// common/services/LoadMonitorService.ts (ou un chemin partagé)
import lag from 'event-loop-lag';
import { Queue as BullMQQueue } from 'bullmq'; // Renommer pour éviter conflit si 'Queue' est utilisé ailleurs

const DEFAULT_CHECK_INTERVAL_MS = 30 * 1000;
const DEFAULT_SCALE_UP_THRESHOLD_MS = 100;
const DEFAULT_SCALE_DOWN_THRESHOLD_MS = 5;
const DEFAULT_SCALE_DOWN_COOLDOWN_MINUTES = 10;
const DEFAULT_REQUEST_COOLDOWN_MINUTES = 5;

interface MonitorState {
  lastRequestTimestamp: number;
  lowLagStartTimestamp: number | null;
  currentLagAvg: number;
}
export interface Logger {
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
}
export interface LoadMonitorServiceOptions {
  /** Type de service monitoré (api, theme, dashboard, etc.) */
  serviceType: string;
  /** ID unique du service/instance monitoré (storeId, themeId, ou nom du service global) */
  serviceId: string;
  /** Instance de la queue BullMQ pour envoyer les requêtes de scaling au serveur central. */
  bullmqQueue: BullMQQueue;
  /** Instance d'un logger compatible. */
  logger: Logger; // Ou `any` si pas de logger standardisé

  checkIntervalMs?: number;
  scaleUpThresholdMs?: number;
  scaleDownThresholdMs?: number;
  scaleDownCooldownMinutes?: number;
  requestCooldownMinutes?: number;
}

export class LoadMonitorService {
  private intervalId: NodeJS.Timeout | null = null;
  private state: MonitorState;
  private lagSampler: ReturnType<typeof lag>;

  private readonly serviceType: string;
  private readonly serviceId: string;
  private readonly bullmqQueue: BullMQQueue;
  private readonly logger: Logger;

  private readonly checkIntervalMs: number;
  private readonly scaleUpThresholdMs: number;
  private readonly scaleDownThresholdMs: number;
  private readonly scaleDownCooldownMinutes: number;
  private readonly requestCooldownMinutes: number;

  constructor(options: LoadMonitorServiceOptions) {
    this.serviceType = options.serviceType;
    this.serviceId = options.serviceId;
    this.bullmqQueue = options.bullmqQueue;
    this.logger = options.logger;

    this.checkIntervalMs = options.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
    this.scaleUpThresholdMs = options.scaleUpThresholdMs ?? DEFAULT_SCALE_UP_THRESHOLD_MS;
    this.scaleDownThresholdMs = options.scaleDownThresholdMs ?? DEFAULT_SCALE_DOWN_THRESHOLD_MS;
    this.scaleDownCooldownMinutes = options.scaleDownCooldownMinutes ?? DEFAULT_SCALE_DOWN_COOLDOWN_MINUTES;
    this.requestCooldownMinutes = options.requestCooldownMinutes ?? DEFAULT_REQUEST_COOLDOWN_MINUTES;

    this.state = {
      lastRequestTimestamp: 0,
      lowLagStartTimestamp: null,
      currentLagAvg: 0,
    };

    this.lagSampler = lag(1000); // Mesure le lag toutes les secondes (configurable ?)

    this.logger.info(`[LoadMonitorService ${this.serviceId}] Initialized for ${this.serviceType}`);
  }

  public startMonitoring(): void {
    if (this.intervalId) {
      this.logger.warn(`[LoadMonitorService ${this.serviceId}] Monitoring already started.`);
      return;
    }

    this.logger.info(`[LoadMonitorService ${this.serviceId}] Starting monitoring loop (interval: ${this.checkIntervalMs}ms)`);
    this.intervalId = setInterval(() => {
      this.checkLoadAndScale();
    }, this.checkIntervalMs);
  }

  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger.info(`[LoadMonitorService ${this.serviceId}] Monitoring stopped.`);
    }
    // `event-loop-lag` n'a pas de méthode de "stop" explicite, l'intervalle suffit.
  }

  private async checkLoadAndScale(): Promise<void> {
    const currentLag = this.lagSampler();
    this.state.currentLagAvg = currentLag;

    this.logger.debug(`[LoadMonitorService ${this.serviceId}] Current Event Loop Lag (avg): ${currentLag.toFixed(2)}ms`);

    const now = Date.now();
    const timeSinceLastRequest = now - this.state.lastRequestTimestamp;
    const requestCooldownMillis = this.requestCooldownMinutes * 60 * 1000;

    // --- Logique Scale Up ---
    if (currentLag > this.scaleUpThresholdMs) {
      this.logger.warn(`[LoadMonitorService ${this.serviceId}] High Lag Detected: ${currentLag.toFixed(2)}ms (Threshold: ${this.scaleUpThresholdMs}ms)`);
      if (timeSinceLastRequest > requestCooldownMillis) {
        this.logger.info(`[LoadMonitorService ${this.serviceId}] Cooldown passed, requesting SCALE UP.`);
        await this.requestScale('up');
      } else {
        this.logger.info(`[LoadMonitorService ${this.serviceId}] Scale UP request cooldown active.`);
      }
      this.state.lowLagStartTimestamp = null; // Réinitialiser le timer de faible lag
      return;
    }

    // --- Logique Scale Down ---
    if (currentLag < this.scaleDownThresholdMs) {
      if (this.state.lowLagStartTimestamp === null) {
        this.logger.info(`[LoadMonitorService ${this.serviceId}] Low lag period started (${currentLag.toFixed(2)}ms < ${this.scaleDownThresholdMs}ms)`);
        this.state.lowLagStartTimestamp = now;
      } else {
        const lowLagDurationMinutes = (now - this.state.lowLagStartTimestamp) / (60 * 1000);
        this.logger.debug(`[LoadMonitorService ${this.serviceId}] Low lag duration: ${lowLagDurationMinutes.toFixed(1)} minutes`);

        if (lowLagDurationMinutes >= this.scaleDownCooldownMinutes) {
          this.logger.warn(`[LoadMonitorService ${this.serviceId}] Sustained low lag detected for ${lowLagDurationMinutes.toFixed(1)} minutes.`);
          if (timeSinceLastRequest > requestCooldownMillis) {
            this.logger.info(`[LoadMonitorService ${this.serviceId}] Cooldown passed, requesting SCALE DOWN.`);
            await this.requestScale('down');
          } else {
            this.logger.info(`[LoadMonitorService ${this.serviceId}] Scale DOWN request cooldown active.`);
          }
          this.state.lowLagStartTimestamp = null; // Réinitialiser après demande
        }
      }
    } else {
      if (this.state.lowLagStartTimestamp !== null) {
        this.logger.info(`[LoadMonitorService ${this.serviceId}] Lag normalized, resetting low lag timer.`);
        this.state.lowLagStartTimestamp = null;
      }
    }
  }

  private async requestScale(direction: 'up' | 'down'): Promise<void> {
    const event = direction === 'up' ? 'request_scale_up' : 'request_scale_down';
    const logCtx = { serviceId: this.serviceId, action: `auto-scale-${direction}`, serviceType: this.serviceType };
    this.logger.info(`[LoadMonitorService] Sending scale request to s_server`, logCtx);

    try {
      const scaleData = {
        serviceType: this.serviceType,
        serviceId: this.serviceId, // ID unique du service/instance
        reason: 'Automatic load detection'
      };
      const jobId = `auto-scale-${direction}-${this.serviceType}-${this.serviceId}-${Date.now()}`;

      await this.bullmqQueue.add(event, { event: event, data: scaleData }, { jobId });

      this.logger.info(`[LoadMonitorService] Scale request sent successfully.`, { ...logCtx, jobId });
      this.state.lastRequestTimestamp = Date.now();
    } catch (error) {
      this.logger.error(`[LoadMonitorService] Failed to send scale request`, { ...logCtx, err: error });
    }
  }
}
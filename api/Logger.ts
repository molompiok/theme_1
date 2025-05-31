// logger.ts (pour le frontend)

const LOG_LEVELS = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
  };
  
  // Détermine le niveau de log actuel
  const currentLogLevel = LOG_LEVELS.INFO
  
  const logger = {
    debug: (data:Record<string,any>|string,...args: any[]) => {
      if (currentLogLevel <= LOG_LEVELS.DEBUG) {
        console.debug('[DEBUG]', ...args);
      }
    },
    info: (data:Record<string,any>|string,...args: any[]) => {
      if (currentLogLevel <= LOG_LEVELS.INFO) {
        console.info('[INFO]', ...args);
      }
    },
    warn: (data:Record<string,any>|string,...args: any[]) => {
      if (currentLogLevel <= LOG_LEVELS.WARN) {
        console.warn('[WARN]', ...args);
      }
    },
    error: (data:Record<string,any>|string | Error, ...optionalParams: any[]) => {
      if (currentLogLevel <= LOG_LEVELS.ERROR) {
        console.error('[ERROR]', data, ...optionalParams);
        // En production, vous pourriez envoyer cette erreur à un service de monitoring
        // if (process.env.NODE_ENV === 'production') {
        //   sendErrorToMonitoringService(message, optionalParams);
        // }
      }
    },
  };
  
  export default logger;
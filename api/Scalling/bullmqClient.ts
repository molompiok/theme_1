// theme_project/src/bullmqClient.ts (exemple de chemin)
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement (si .env est utilisé)

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
// const redisPassword = process.env.REDIS_PASSWORD;

const queueName = 'service-to-server+s_server'; // La queue cible

let serverQueue: Queue | null = null;
let redisConnection: IORedis | null = null;

function initializeQueue() {
    if (serverQueue) return serverQueue;

    console.log(`[Theme BullMQ Client] Initializing connection to Redis: ${redisHost}:${redisPort}`);
    //@ts-ignore
    redisConnection = new IORedis(redisPort, redisHost, {
        // password: redisPassword,
        maxRetriesPerRequest: null,
        lazyConnect: true, // Peut être lazy ici, on ne connecte que si on envoie
    });

    if(!redisConnection) throw new Error('Redis connection failed to initialize');

    redisConnection.on('error', (err) => {
        console.error('[Theme BullMQ Client] Redis connection error:', err);
        // Peut-être désactiver la fonctionnalité ou essayer de recréer ?
        serverQueue = null; // Marquer la queue comme indisponible
    });
     redisConnection.on('connect', () => {
         console.log('[Theme BullMQ Client] Redis connection established for queue.');
     });


    console.log(`[Theme BullMQ Client] Creating queue instance for: ${queueName}`);
    serverQueue = new Queue(queueName, {
        connection: redisConnection,
         defaultJobOptions: { // Important d'avoir des options raisonnables
             removeOnComplete: true,
             removeOnFail: 1000,
             attempts: 3, // Retenter si l'ajout échoue ?
             backoff: { type: 'exponential', delay: 500 }
         }
    });
    serverQueue.on('error', (error) => {
         console.error(`[Theme BullMQ Client] Error on queue ${queueName}:`, error);
    });

    return serverQueue;
}

export function getServerQueue(): Queue {
    // Initialise si ce n'est pas déjà fait
    return initializeQueue();
}

// Fonction pour fermer proprement (appelée à l'arrêt du thème)
export async function closeQueue() {
    await serverQueue?.close();
    await redisConnection?.quit();
    console.log('[Theme BullMQ Client] Queue and connection closed.');
}
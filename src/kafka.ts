import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [];
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

const sasl = (kafkaUsername && kafkaPassword) ? {
  mechanism: 'plain' as const,
  username: kafkaUsername,
  password: kafkaPassword,
} : undefined;

const ssl = process.env.KAFKA_SSL === 'true' || sasl ? true : false;

export const kafka = new Kafka({
  clientId: 'auditax-nexus',
  brokers: kafkaBrokers.length > 0 ? kafkaBrokers : ['localhost:9092'],
  ssl,
  sasl,
});

export const producer = kafka.producer();

let isProducerConnected = false;

export async function connectProducer() {
  if (!isProducerConnected) {
    await producer.connect();
    isProducerConnected = true;
    console.log("⚡ Kafka Producer connected successfully");
  }
}

export async function sendAuditRequest(type: 'generate' | 'harmonize', payload: any) {
  await connectProducer();
  const topic = process.env.KAFKA_TOPIC_AI_AUDIT || 'audit-requests';
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify({
          type,
          payload,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
  console.log(`📤 Message sent to Kafka topic [${topic}]: ${type}`);
}

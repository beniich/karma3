import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { kafka } from './src/kafka';
import { queryKnowledgeBase } from './src/vector-service';

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "production",
  });
  console.log("🛡️ Sentry initialized successfully on Worker");
} else {
  console.log("🛡️ Sentry configuration missing. Operating in silent mode on Worker.");
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  // L'initialisation automatique suppose que GOOGLE_APPLICATION_CREDENTIALS est défini
  // ou qu'il tourne sur un environnement Google Cloud.
  admin.initializeApp();
}

const db = admin.firestore();

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const consumer = kafka.consumer({ groupId: 'auditax-nexus-worker-group' });

async function processMessage(type: string, payload: any) {
  const { jobId, userId, prompt, systemInstruction, fields, correlationId } = payload;
  if (!jobId) {
    console.error("❌ Message has no jobId:", payload);
    return;
  }

  if (correlationId && process.env.SENTRY_DSN) {
    Sentry.setTag("correlation_id", correlationId);
  }

  console.log(`⏳ Processing job ${jobId} of type ${type} (correlationId: ${correlationId || 'none'})`);

  const jobRef = db.collection('audit_jobs').doc(jobId);

  try {
    let resultText = '';

    if (type === 'generate') {
      let context = "";
      const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
      const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;
      if (upstashUrl && upstashToken) {
        try {
          context = await queryKnowledgeBase(userId || "anonymous", prompt);
        } catch (ragError) {
          console.error("⚠️ RAG Query failed, falling back to standard prompt:", ragError);
        }
      }

      const finalPrompt = `
[SYSTEM INSTRUCTIONS]
You are the AuditAX Neural Engine. Use the provided VERIFIED CONTEXT to answer. 
If the context is empty or irrelevant, state that no verified evidence was found.

[VERIFIED CONTEXT]
${context || "No specific documentation found in knowledge base."}

[USER REQUEST]
${prompt}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: finalPrompt,
        config: {
          systemInstruction: systemInstruction || "You are AuditAX Nexus Intelligence. Provide professional, concise risk analysis."
        }
      });
      resultText = response.text || '';
    } else if (type === 'harmonize') {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Harmonize the following data fields across SOC 2 and ISO 27001 standards: ${fields.join(", ")}. Provide a mapping table and identified gaps. Use a very technical, audit-approved tone.`
      });
      resultText = response.text || '';
    } else {
      throw new Error(`Unknown job type: ${type}`);
    }

    await jobRef.set({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      result: resultText,
      correlationId
    }, { merge: true });
    console.log(`✅ Job ${jobId} completed successfully.`);
  } catch (error: any) {
    console.error(`❌ Error processing job ${jobId}:`, error);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { tags: { correlation_id: correlationId } });
    }
    await jobRef.set({
      status: 'failed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      error: error.message || 'Unknown error occurred during processing',
      correlationId
    }, { merge: true });
  }
}

async function run() {
  await consumer.connect();
  const topic = process.env.KAFKA_TOPIC_AI_AUDIT || 'audit-requests';
  await consumer.subscribe({ topic, fromBeginning: false });

  console.log(`🚀 Kafka Worker is running and subscribed to [${topic}]...`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const data = JSON.parse(message.value.toString());
        await processMessage(data.type, data.payload);
      } catch (err) {
        console.error("❌ Error parsing message:", err);
      }
    },
  });
}

const shutdown = async () => {
  console.log("⚡ Shutting down Kafka worker consumer gracefully...");
  try {
    await consumer.disconnect();
    console.log("⚡ Kafka Worker disconnected successfully");
  } catch (err) {
    console.error("Error disconnecting Kafka worker:", err);
  }
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

run().catch(console.error);

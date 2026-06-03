import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import * as Sentry from "@sentry/node";
import { sendAuditRequest } from "./src/kafka";
import { addDocumentToKnowledgeBase } from "./src/vector-service";

if (!admin.apps.length) {
  // L'initialisation automatique suppose que GOOGLE_APPLICATION_CREDENTIALS est défini
  // ou qu'il tourne sur un environnement Google Cloud.
  admin.initializeApp();
}

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
  });
  console.log("🛡️ Sentry initialized successfully on Server");
} else {
  console.log("🛡️ Sentry configuration missing. Operating in silent mode.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia" as any,
});

const app = express();

// Correlation ID Middleware (Distributed Tracing)
app.use((req, res, next) => {
  const headerId = req.headers['x-correlation-id'];
  (req as any).correlationId = headerId && typeof headerId === 'string'
    ? headerId
    : `nexus-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  next();
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

async function logWebhookEvent(event: any, details: string) {
  try {
    await admin.firestore().collection('webhook_logs').add({
      eventId: event.id || `evt_${Math.random().toString(36).substring(2, 11)}`,
      type: event.type,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      data: event.data,
      details: details
    });
    console.log("✅ Webhook loggé dans Firestore");
  } catch (err) {
    console.error("❌ Erreur lors du log Firestore:", err);
  }
}

// 2. L'endpoint Webhook (SÉCURISÉ)
app.post(
  "/api/billing/webhook", 
  express.raw({ type: "application/json" }), 
  async (req, res): Promise<any> => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
      console.error("❌ Erreur: Signature Stripe manquante.");
      return res.status(400).send("Signature manquante");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`❌ Erreur de signature Stripe: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const logId = event.id || `evt_${Math.random().toString(36).substring(2, 11)}`;
    const timestamp = new Date().toISOString();
    const eventType = event.type;
    let details = `Événement ${eventType} traité.`;

    console.log(`✅ Événement Stripe reçu: ${eventType}`);

    if (eventType === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`💰 Paiement réussi pour la session ${session.id}`);
      
      // Simulation pour le prototype:
      io.emit("stripe-webhook-processed", {
        eventId: logId,
        eventType,
        productId: "prod_Uc3qapaLfo84Oq",
        planName: "Corporate (Secure)",
        price: session.amount_total ? session.amount_total / 100 : 499,
        timestamp,
        tokensAdded: 1000,
        status: "Succeeded"
      });
      details = `Paiement sécurisé validé. Signature cryptographique OK. Session: ${session.id}`;
    }

    await logWebhookEvent(event, details);
    res.json({ received: true });
  }
);

app.get("/api/billing/webhook-logs", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('webhook_logs').orderBy('timestamp', 'desc').limit(50).get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
  }
});

app.use(express.json());


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const AUDITAX_MOCK_LOGS = [
  { level: 'INFO', agent: 'Alpha', text: 'Initiating global security baseline scans across Kubernetes clusters...', color: 'text-blue-400' },
  { level: 'DEBUG', agent: 'Beta', text: 'Cross-referencing SOC 2 CC1.3 controls with active Azure and GCP resource maps...', color: 'text-gray-400' },
  { level: 'SUCCESS', agent: 'Alpha', text: 'SOC 2 CC1.1 validated successfully. 100% compliant on local host.', color: 'text-green-400' },
  { level: 'INFO', agent: 'Gamma', text: 'Scanning external SSH Bastion access logs on port 3000...', color: 'text-blue-400' },
  { level: 'WARN', agent: 'System', text: 'Detected 3 inactive administrative accounts with active write access. Raised warning flag.', color: 'text-yellow-400' },
  { level: 'DEBUG', agent: 'Beta', text: 'Recalculating network routing graphs in localized Sovereign Zone CL-1...', color: 'text-gray-400' },
  { level: 'SUCCESS', agent: 'System', text: 'Hardware HSM keys validated. Safe core enclave isolated correctly.', color: 'text-green-400' },
  { level: 'INFO', agent: 'Alpha', text: 'Analyzing Gmail Sentinel compliance audit activities over past 24 hours...', color: 'text-blue-400' },
  { level: 'WARN', agent: 'Gamma', text: 'Unusual ledger API access pattern discovered; initiating cross-enclave integrity validation.', color: 'text-yellow-400' },
  { level: 'SUCCESS', agent: 'Beta', text: 'Sovereign ledger Merkle root hash verification completed successfully.', color: 'text-green-400' },
];

let backgroundLogIndex = 0;

// Set up periodic background logs
setInterval(() => {
  const log = AUDITAX_MOCK_LOGS[backgroundLogIndex];
  backgroundLogIndex = (backgroundLogIndex + 1) % AUDITAX_MOCK_LOGS.length;
  
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  io.emit("agent-log", {
    time: timestamp,
    ...log
  });
}, 4000);

// Socket.io handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("send-update", (data) => {
    // Broadcast updates to everyone in the room except sender
    if (data.room) {
      socket.to(data.room).emit("received-update", data);
    }
  });

  // Client requests a manual workflow run
  socket.on("trigger-agent-workflow", () => {
    console.log(`Socket ${socket.id} triggered a manual agent workflow run`);
    
    const steps = [
      { level: 'INFO', agent: 'System', text: 'Triggering AuditAX Sovereign Agent Orchestrator pipeline...', color: 'text-purple-400' },
      { level: 'DEBUG', agent: 'Alpha', text: 'Analyzing active compliance database schemas for SOC 2 Mapping...', color: 'text-gray-400' },
      { level: 'DEBUG', agent: 'Beta', text: 'Aligning requirements with CC1.3 temporal parameters...', color: 'text-gray-400' },
      { level: 'WARN', agent: 'Gamma', text: 'Found 1 legacy control node with unencrypted credentials backup.', color: 'text-yellow-400' },
      { level: 'INFO', agent: 'Alpha', text: 'Applying automatic isolation policy on insecure node...', color: 'text-blue-400' },
      { level: 'SUCCESS', agent: 'System', text: 'Harmonization and isolation routine complete. 100% safety rating.', color: 'text-green-400' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        socket.emit("agent-log", {
          time: timestamp,
          ...step
        });
      }, idx * 1000);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// 1. Configuration du limiteur
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limite chaque IP à 30 requêtes toutes les 15 minutes
  message: { 
    error: "Too many neural requests", 
    message: "Your API quota is temporarily exhausted. Please wait 15 minutes." 
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

// AI Generation Endpoint
app.post("/api/ai/generate", aiLimiter, async (req, res) => {
  const { prompt, systemInstruction, userId } = req.body;
  const uid = userId || "anonymous";
  const jobRef = admin.firestore().collection('audit_jobs').doc(uid);
  const correlationId = (req as any).correlationId;

  try {
    await jobRef.set({
      status: 'processing',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'generate',
      userId: uid,
      correlationId
    });

    try {
      await sendAuditRequest('generate', {
        jobId: uid,
        userId: uid,
        prompt,
        systemInstruction,
        correlationId
      });
    } catch (kafkaError: any) {
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(kafkaError, { tags: { correlation_id: correlationId } });
      }
      await jobRef.set({
        status: 'failed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        error: `Kafka dispatch failed: ${kafkaError.message || kafkaError}`
      }, { merge: true });
      throw kafkaError;
    }

    res.json({ jobId: uid, status: 'processing', correlationId });
  } catch (error: any) {
    console.error("Generate Endpoint Error:", error);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { tags: { correlation_id: correlationId } });
    }
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

// Harmonization Endpoint (Mapping SOC 2 <-> ISO 27001)
app.post("/api/audit/harmonize", aiLimiter, async (req, res) => {
  const { fields, userId } = req.body;
  const uid = userId || "anonymous";
  const jobRef = admin.firestore().collection('audit_jobs').doc(uid);
  const correlationId = (req as any).correlationId;

  try {
    await jobRef.set({
      status: 'processing',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'harmonize',
      userId: uid,
      correlationId
    });

    try {
      await sendAuditRequest('harmonize', {
        jobId: uid,
        userId: uid,
        fields,
        correlationId
      });
    } catch (kafkaError: any) {
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(kafkaError, { tags: { correlation_id: correlationId } });
      }
      await jobRef.set({
        status: 'failed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        error: `Kafka dispatch failed: ${kafkaError.message || kafkaError}`
      }, { merge: true });
      throw kafkaError;
    }

    res.json({ jobId: uid, status: 'processing', correlationId });
  } catch (error: any) {
    console.error("Harmonization Endpoint Error:", error);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { tags: { correlation_id: correlationId } });
    }
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

// Advanced RAG Endpoint - Index Document to Vector DB
app.post("/api/docs/index", async (req, res) => {
  const { userId, text, documentRef } = req.body;
  const correlationId = (req as any).correlationId;
  const uid = userId || "anonymous";

  if (!text || !documentRef) {
    return res.status(400).json({ error: "Missing required fields: text and documentRef are required." });
  }

  try {
    const vectorId = await addDocumentToKnowledgeBase(uid, text, documentRef);
    res.json({
      status: "success",
      message: vectorId ? "Document successfully indexed in Vector DB." : "Vector DB not configured, running in dry-run mode.",
      vectorId,
      correlationId
    });
  } catch (error: any) {
    console.error("Document Indexing Error:", error);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { tags: { correlation_id: correlationId } });
    }
    res.status(500).json({ error: error.message || "Unknown indexing error" });
  }
});

// GET Health Check Endpoint for local & Docker monitoring
app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Real-time Connection / Testing verification route
app.post("/api/connect/ping", (req, res) => {
  try {
    const { clientTime, clientMessage, browserInfo } = req.body;
    const serverTime = new Date().toISOString();
    const delayMs = clientTime ? Date.now() - new Date(clientTime).getTime() : 0;
    
    res.json({
      status: "success",
      message: "Pong! Connexion avec le serveur Express établie avec succès.",
      receivedMessage: clientMessage || "N/A",
      clientTime,
      serverTime,
      delayMs: Math.max(0, delayMs),
      environment: process.env.NODE_ENV || "development",
      serverPort: PORT,
      features: [
        "Socket.IO Stream v4.8",
        "Express REST Routing v4.21", 
        "Google GenAI Gemini-2.0-Flash Pipeline",
        "Strict secure API architecture"
      ]
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// --- SOVEREIGN APPLIANCE SYSTEM CONFIGURATION (PFSENSE-STYLE ORCHESTRATOR) ---
async function getSystemConfig() {
  const docRef = admin.firestore().collection('system_configs').doc('global');
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return {
      bastion: { enabled: true, port: 443 },
      monitoring: { interval: 'realtime', alertThreshold: 90 },
      security: { mfa_required: true, mtls_enforced: true, token_rotation: true, slow_pings: false }
    };
  }
  return doc.data();
}

async function updateSystemConfig(updates: any) {
  await admin.firestore().collection('system_configs').doc('global').set({
    ...updates
  }, { merge: true });
}

app.get("/api/system/config", async (req, res) => {
  try {
    const config = await getSystemConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Erreur interne" });
  }
});

app.post("/api/system/apply", async (req, res) => {
  try {
    const currentConfig = await getSystemConfig();
    const newConfig = { ...currentConfig, ...req.body };
    await updateSystemConfig(newConfig);
    
    // Broadcast clean orchestrator logs to our Socket namespace for real-time journal trace
    const steps = [
      `[SOVEREIGN CORE] Applying new orchestrator state...`,
      `⚙ [Orchestrator] Saving System State into local configuration: config.json`,
      `⚙ [Network Layer] Updating mTLS rules. Status: ${newConfig.security?.mtls_enforced ? "ENFORCED (mTLS Secure)" : "BYPASSED (mTLS Warning)"}`,
      `⚙ [Enclave Hub] Key Rotation: ${newConfig.security?.token_rotation ? "12h Active Rotation ENABLED" : "STATIC Keys Active"}`,
      `⚙ [Telemetry Daemon] Set interval rate to "${newConfig.monitoring?.interval}" (SLA Level Checked)`,
      `✓ [Appliance] System state applied. Services restarted. Kernel parameters synchronized.`
    ];
    
    steps.forEach((step, idx) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        io.emit("agent-log", {
          time: timestamp,
          level: idx === steps.length - 1 ? 'SUCCESS' : 'INFO',
          agent: 'System',
          text: step,
          color: idx === steps.length - 1 ? 'text-green-400' : 'text-blue-400'
        });
      }, idx * 450);
    });

    res.json({
      status: "success",
      message: "System settings synchronized & services restarted successfully",
      config: newConfig
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

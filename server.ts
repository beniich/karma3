import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

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

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// AI Generation Endpoint
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const response = await ai.models.generateContent({ 
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are AuditAX Nexus Intelligence. Provide professional, concise risk analysis."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const status = error.status || 500;
    const message = status === 429 ? "Gemini API quota exceeded. Please wait a few seconds and try again." : error.message;
    res.status(status).json({ error: message });
  }
});

// Harmonization Endpoint (Mapping SOC 2 <-> ISO 27001)
app.post("/api/audit/harmonize", async (req, res) => {
  try {
    const { fields } = req.body;
    
    // Perform harmonization logic
    const response = await ai.models.generateContent({ 
      model: "gemini-2.0-flash",
      contents: `Harmonize the following data fields across SOC 2 and ISO 27001 standards: ${fields.join(", ")}. Provide a mapping table and identified gaps. Use a very technical, audit-approved tone.`
    });
    
    res.json({ 
      mapping: response.text,
      timestamp: new Date().toISOString(),
      status: "SYNC_COMPLETE"
    });
  } catch (error: any) {
    console.error("Harmonization Error:", error);
    const status = error.status || 500;
    const message = status === 429 ? "Gemini API quota exceeded. Please wait a few seconds and try again." : error.message;
    res.status(status).json({ error: message });
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

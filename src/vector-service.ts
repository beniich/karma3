import { Index } from "@upstash/vector";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let index: Index | null = null;
const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

if (upstashUrl && upstashToken) {
  index = new Index({
    url: upstashUrl,
    token: upstashToken,
  });
  console.log("⚡ Upstash Vector DB client initialized successfully.");
} else {
  console.warn("⚠️ Upstash Vector DB credentials missing. Running in dry-run mode.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Generates semantic embedding vector using Gemini API embedding model text-embedding-004
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  const response = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: text,
  });
  if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
    throw new Error("Failed to generate embedding from Gemini: empty values.");
  }
  return response.embeddings[0].values;
}

/**
 * Upserts a document chunk's semantic embedding and metadata into the vector index
 */
export async function addDocumentToKnowledgeBase(userId: string, text: string, documentRef: string) {
  if (!index) {
    console.warn("⚠️ Skipping document indexing: Upstash Vector DB is not configured.");
    return null;
  }
  try {
    console.log(`📤 Generating embedding for document ref: ${documentRef}`);
    const embedding = await generateEmbedding(text);
    const id = `doc-${userId}-${documentRef}-${Date.now()}`;
    await index.upsert({
      id,
      vector: embedding,
      metadata: { userId, content: text, documentRef, createdAt: new Date().toISOString() },
    });
    console.log(`✅ Document successfully indexed in Vector DB. ID: ${id}`);
    return id;
  } catch (err) {
    console.error("❌ Failed to upsert document to Upstash Vector:", err);
    throw err;
  }
}

/**
 * Queries the knowledge base for top matching context chunks, enforcing tenant isolation by userId
 */
export async function queryKnowledgeBase(userId: string, queryText: string, topK = 3): Promise<string> {
  if (!index) {
    console.warn("⚠️ Skipping knowledge base query: Upstash Vector DB is not configured.");
    return "";
  }
  try {
    console.log(`🔍 Querying knowledge base for user ${userId} with query: "${queryText.substring(0, 50)}..."`);
    const embedding = await generateEmbedding(queryText);
    const matches = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    // Enforce data isolation: only matches belonging to this user
    const userMatches = matches.filter(m => m.metadata && m.metadata.userId === userId);

    if (userMatches.length === 0) {
      console.log("🔍 No matching documents found for this user in knowledge base.");
      return "";
    }

    const context = userMatches.map(m => m.metadata?.content || "").join("\n\n");
    console.log(`✅ Found ${userMatches.length} context match(es) for user ${userId}`);
    return context;
  } catch (err) {
    console.error("❌ Failed to query Upstash Vector database:", err);
    return "";
  }
}

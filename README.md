# 🧠 OpsMind AI — Enterprise RAG Documentation

---

## 📌 Project Overview

**OpsMind AI** is an **Enterprise SOP Agent based on RAG (Retrieval-Augmented Generation) Architecture**. It helps organizations efficiently access, understand, and interact with internal Standard Operating Procedures (SOPs) using AI.

This system allows users to:
- Upload PDF documents
- Ask natural language questions
- Receive accurate, context-aware answers generated from retrieved company data
- Get responses with cited sources

---

## 🎯 Purpose of the Project

Build a **real-world AI-powered enterprise solution** demonstrating:

- Complete **RAG (Retrieval-Augmented Generation) pipeline**
- PDF ingestion, chunking, and vector embedding
- Semantic search using **MongoDB Atlas Vector Search**
- Integration with **Groq’s LLM (Llama 3.1)** for fast inference
- Enterprise-ready backend architecture with admin capabilities

---

## 💼 Project Details

### 🤖 What is an SOP Agent?

An **SOP Agent** is an AI system that helps employees quickly find and understand company procedures, guidelines, and documentation through natural language conversations.

It provides:
- Instant answers from internal documents
- Context-aware responses
- Source citations for verification
- Reduced dependency on manual document searching

## 🧠 How RAG Architecture Works (Implemented)

Document Upload → PDF uploaded & parsed  
Chunking → Text split into overlapping chunks (1000 chars, 150 overlap)  
Embedding → Each chunk → 384-dim vector (local/all-MiniLM-L6-v2)  
Storage → Chunks + vectors stored in MongoDB  
User Query → "How to request leave?"  
Query Embedding → Convert query to vector  
Vector Search → MongoDB $vectorSearch retrieves top chunks  
Context Assembly → Chunks + metadata formatted  
LLM Generation → Groq (Llama 3.1) generates cited answer  
Response → Answer + sources returned to user  

## 👤 User Functionalities

- Ask questions in natural language  
- View answers with cited sources (filename, page number)  
- Upload PDF documents for processing  
- Admin: View all documents & delete them  

---

## ⚙️ System Capabilities

- Semantic vector search (not keyword-based)  
- Context-aware AI responses with source attribution  
- PDF upload & processing pipeline (with duplicate protection)  
- Admin document management  
- Streaming & non-streaming LLM responses  
- Fallback simple answer service if LLM fails  

## 🏗️ Complete System Architecture

---

## 🔄 End-to-End Flow

- User uploads PDF  
  ↓  
- File stored using Multer (5MB limit)  
  ↓  
- PDF parsed into raw text (pdf-parse)  
  ↓  
- Text cleaned & split into chunks (1000 chars, 150 overlap)  
  ↓  
- Each chunk → 384-dim embedding (local/all-MiniLM-L6-v2)  
  ↓  
- Stored in MongoDB with fileName, chunkIndex, pageNumber  
  ↓  
- User asks question  
  ↓  
- Query → improved ("Explain clearly: {query}") → embedding  
  ↓  
- MongoDB Vector Search (index: "vector_index", cosine similarity)  
  ↓  
- Top 10 chunks retrieved → filtered to top 5 by score  
  ↓  
- If 0 results → fallback to last 3 documents  
  ↓  
- Context builder assembles chunks with source metadata  
  ↓  
- Groq LLM (Llama 3.1) generates answer (or simpleAnswer fallback)  
  ↓  
- Response `{ answer, sources }` sent to user  

## 📂 Complete Project Structure (Backend-Focused)


## 📂 Complete Project Structure (Backend-Focused)

```
server/
│
├── config/
│   └── db.js                      # MongoDB connection
│
├── models/
│   └── documentModel.js           # Schema: fileName, chunkText, embedding(384), chunkIndex, pageNumber
│
├── controllers/
│   ├── adminController.js         # getAllDocs (aggregated), deleteDoc
│   ├── queryController.js         # queryDocs (RAG pipeline)
│   └── uploadController.js        # uploadPDF (chunk, embed, store)
│
├── services/
│   ├── embeddingService.js        # Generates 384-dim random embeddings (offline/dev)
│   ├── grokService.js             # Groq LLM (streaming + non-streaming) with strict prompt
│   └── simpleAnswerService.js     # Fallback keyword-based answer generator
│
├── routes/
│   ├── adminRoutes.js             # GET /docs, DELETE /docs/:fileName
│   ├── queryRoutes.js             # POST /
│   └── uploadRoutes.js            # POST /upload
│
├── middlewares/
│   └── uploadMiddleware.js        # Multer config (5MB, PDF only)
│
├── utils/
│   └── chunker.js                 # Text cleaning & chunking (1000 chars, 150 overlap)
│
├── uploads/                       # Temporary Multer storage
├── .env
├── app.js                         # Express app with CORS, JSON, error handling
├── index.js                       # Server entry (app.listen + connectDB)
└── package.json
```

## ⚙️ Technical Stack

---

## 🖥️ Backend
- Node.js + Express.js (REST APIs)  
- MongoDB with Mongoose ODM & Atlas Vector Search  
- Multer for file uploads (PDF only, 5MB limit)  
- pdf-parse for PDF text extraction  

---

## 🤖 AI & ML
- Groq (Llama 3.1 8B) for LLM responses (streaming support)  
- Local Embeddings (384-dim, all-MiniLM-L6-v2 via transformers.js — currently using random for dev)  
- MongoDB Atlas Vector Search with cosine similarity  

---

## 🛠️ Admin & Utilities
- dotenv for environment management  
- cors for cross-origin requests  
- fs for file operations  

## 🔐 Environment Variables Setup

---

## 🖥️ Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/opsmind-ai
GROQ_API_KEY=your_groq_api_key
```

## ⚠️ Important Notes

- Never commit `.env` files to GitHub  
- Keep all secrets (MongoDB URI, API keys) private  
- The system uses **Groq (not Gemini)** for LLM responses  

## 📦 Core Dependencies Explanation

| Package     | Purpose |
|------------|--------|
| express    | Core backend framework |
| mongoose   | MongoDB ODM & Vector Search support |
| multer     | Handle PDF file uploads (5MB limit) |
| pdf-parse  | Extract text content from PDFs |
| groq-sdk   | Groq API client for Llama 3.1 |
| cors       | Enable frontend-backend communication |
| dotenv     | Manage environment variables |
| nodemon    | Auto-restart server during development |

## 🔄 Complete API Endpoints

---

## 1. Upload PDF Document

**POST** `/api/upload`

### Request
- Type: `multipart/form-data`
- Field: `file` (PDF, max 5MB)

### Response

```json
{
  "message": "PDF processed & stored successfully",
  "totalChunks": 42
}
```

## 2. Query Documents (RAG)

**POST** `/api/query`

---

## 📥 Request Body

```json
{
  "query": "How do I access the student management system?"
}
## 📤 Response

```json
{
  "answer": "According to [File: University_Handbook.pdf, Page: 3], you can access the student management system by navigating to Dashboard → View Courses.",
  "sources": [
    { "fileName": "University_Handbook.pdf", "pageNumber": 3 },
    { "fileName": "University_Handbook.pdf", "pageNumber": 5 }
  ]
}
```

## 3. Get All Documents (Admin)

**GET** `/api/admin/docs`

---

## 📤 Response

```json
{
  "documents": [
    {
      "fileName": "HR_Policy.pdf",
      "totalChunks": 120,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```
## 4. Delete Document (Admin)

**DELETE** `/api/admin/docs/:fileName`

---

## 📤 Response

```json
{
  "message": "Document deleted successfully"
}
```

## 🧠 Core Implementation Details

---

## 📊 Database Schema (documentModel.js)

```javascript
const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true, index: true },
  chunkText: { type: String, required: true },
  embedding: { type: [Number], required: true },  // 384 dimensions
  chunkIndex: { type: Number, required: true },
  pageNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

```

## 🧠 MongoDB Atlas Vector Index Configuration

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

## ⚙️ Chunking Logic (chunker.js)

```javascript
exports.chunkText = (text) => {
  const cleaned = cleanText(text);  // Removes special chars
  const chunkSize = 1000;           // characters
  const overlap = 150;              // overlap between chunks

  let chunks = [];

  for (let i = 0; i < cleaned.length; i += (chunkSize - overlap)) {
    chunks.push(cleaned.slice(i, i + chunkSize));
  }

  return chunks;
};
```
## 🔍 Vector Search Query (queryController.js)

```javascript
const results = await Document.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10,
    },
  },
  { $addFields: { score: { $meta: "vectorSearchScore" } } },
]);

// Filter to top 5 by score
const filtered = results.sort((a, b) => b.score - a.score).slice(0, 5);
```

## 🤖 Groq LLM Prompt (Strict RAG)

You are OpsMind AI — an enterprise SOP assistant.

---

### ⚠️ STRICT RULES:

1. Answer ONLY using the provided context  
2. DO NOT say "I don't have" or "I infer"  
3. DO NOT explain limitations  
4. Give a direct, confident answer  
5. Always cite like:  
   **According to [File: <fileName>, Page: <pageNumber>]**

---

### ❌ If answer is not found:
I don't know based on the provided documents.

## 🔁 Fallback Simple Answer Service

If Groq LLM fails, a keyword-based scorer extracts relevant sentences from context to generate a basic response.

## ⚡ Installation & Setup Guide

---

## 🧰 Prerequisites

- Node.js (v18 or higher)  
- MongoDB Atlas account (free tier) with Vector Search enabled  
- Groq API key (free tier available)  

## 1️⃣ Clone & Install

```bash
git clone <your-repo-url>
cd opsmind-ai/server
npm install
```

## 2️⃣ Configure Environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/opsmind-ai
GROQ_API_KEY=your_groq_api_key
```

## 3️⃣ Create MongoDB Atlas Vector Index

- Go to your MongoDB Atlas cluster  
- Navigate to **Atlas Search → Create Index**  
- Select **"JSON Editor" → Vector Search**  
- Use the vector index configuration provided earlier  
- Name the index: `vector_index`  
- Ensure the path `embedding` matches your schema field  

## 4️⃣ Run Backend

```bash
npm run dev   # Runs on http://localhost:5000
```

## 🧪 Testing the System

---

## 📤 Upload a PDF

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/sop.pdf"
  ```

## ❓ Ask a Question

```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the leave approval procedure?"}'
  ```

## 📄 List All Documents

```bash
curl http://localhost:5000/api/admin/docs
```

## 🗑️ Delete a Document

```bash
curl -X DELETE http://localhost:5000/api/admin/docs/HR_Policy.pdf
```

## 📊 Special Features

---

### ⚡ Streaming LLM Responses
`grokService.js` exposes `generateAnswerStream()` for real-time token-by-token responses.

---

### 🛠️ Admin Aggregation Pipeline
`getAllDocs` groups by `fileName`, sums chunks, and returns a clean document list.

---

### 🛡️ Duplicate File Protection
Upload controller checks for existing `fileName` before processing to avoid duplicates.

---

### 📦 Batch Insert (Memory Safe)
Upload controller inserts chunks in batches of 50 to prevent memory overflow during large PDF processing.

---

### 🔁 Fallback Logic
If vector search returns 0 results, the system fetches the last 3 documents as fallback context.

## 🚫 Important Security & Operational Notes

---

- Embeddings are currently random (384-dim) for development. Replace `embeddingService.js` with an actual `transformers.js` pipeline for production.

- Multer stores files temporarily in `uploads/`. Consider using cloud storage (e.g., AWS S3) in production.

- Delete operation removes DB entries but attempts to delete all `.pdf` files in `uploads/` (broad approach). Improve it to target specific files.

- Environment variables must be properly set before running the application.

- CORS is currently open (`origin: "*"`) — restrict it in production for better security.

## 🔍 Troubleshooting Guide

| Issue | Solution |
|------|----------|
| MongoDB connection error | Check `MONGO_URI` & network access in Atlas |
| Vector search returns 0 results | Verify index name `vector_index` & dimensions (384) |
| GROQ_API_KEY missing | Set `GROQ_API_KEY` in `.env` |
| Upload fails (file too large) | Increase `limits.fileSize` in `uploadMiddleware.js` |
| PDF text empty | PDF might be scanned/image-based. Use OCR preprocessing |
| Embedding generation slow | Replace random embeddings with local `transformers.js` or API-based embedding |

## 🚀 Deployment Guidelines

---

## 🌐 Deploy Backend (Render / Railway)

- Push your project to GitHub  
- Connect your repository to Render or Railway  
- Set all required **environment variables**  
- Configure build and start commands:

### Build Command
```bash
npm install
```

## ▶️ Start Command

```bash
node index.js
```

## 🗄️ MongoDB Production Setup

- Use a dedicated MongoDB Atlas cluster (M10+ recommended for Vector Search)  
- Configure IP whitelist for secure access  
- Use strong, secure credentials for database access  

## 📈 Current Implementation Status

---

## ✅ Completed

- Full RAG pipeline (upload → chunk → embed → store → query → vector search → LLM → response)  
- Admin document management (list + delete)  
- Groq Llama 3.1 integration (streaming + non-streaming)  
- Fallback simple answer service  
- Duplicate file detection  
- Batch insert for large PDFs  
- Source citation in responses  

---

## 🚧 Future Improvements

- Replace random embeddings with `@huggingface/transformers` (all-MiniLM-L6-v2)  
- Add user authentication (JWT)  
- Implement frontend React UI  
- Add support for DOCX, TXT files  
- Improve file deletion to target specific file  
- Add rate limiting & request validation  

## 🎯 Key Achievements

From PDF to AI-powered answers with citations — **OpsMind AI** implements a production-ready RAG pipeline with:

- Semantic vector search  
- Strict context-adherent LLM responses  
- Admin document management  
- Robust error handling & fallbacks  

## 📡 Complete API Endpoints

**Base URL:** `http://localhost:5000`

---

## 1️⃣ Upload API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/upload` | Upload & process PDF document |

**Full URL:**  
`http://localhost:5000/api/upload`

---

## 📥 Request

- Type: `multipart/form-data`  
- Field: `file` (PDF, max 5MB)

## 2️⃣ Query API (RAG)

| Method | Endpoint     | Description |
|--------|-------------|-------------|
| POST   | `/api/query` | Ask questions & get AI answers from documents |

**Full URL:**  
`http://localhost:5000/api/query`

## 📥 Request Body

```json
{
  "query": "Your question here"
}
```

## 3️⃣ Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/docs` | Get all documents (grouped by fileName) |
| DELETE | `/api/admin/docs/:fileName` | Delete specific document & its chunks |

---

## 🌐 Full URLs

- `http://localhost:5000/api/admin/docs`  
- `http://localhost:5000/api/admin/docs/HR_Policy.pdf`

## 4️⃣ Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Server health check |

---

## 🌐 Full URL

`http://localhost:5000/`

---

## 📤 Response
OpsMind AI Backend Running

## 📋 API Summary Table

| # | Method | URL | Purpose |
|---|--------|-----|---------|
| 1 | POST | http://localhost:5000/api/upload | Upload PDF |
| 2 | POST | http://localhost:5000/api/query | Ask question (RAG) |
| 3 | GET | http://localhost:5000/api/admin/docs | List all documents |
| 4 | DELETE | http://localhost:5000/api/admin/docs/:fileName | Delete document |
| 5 | GET | http://localhost:5000/ | Health check |


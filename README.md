# 🧠 OpsMind AI — Complete Enterprise RAG Documentation

## 📌 Project Overview

**OpsMind AI** is an **Enterprise SOP Agent based on RAG (Retrieval-Augmented Generation) Architecture**. It helps organizations efficiently access, understand, and interact with internal Standard Operating Procedures (SOPs) using AI. Instead of manually searching documents, users can ask questions in natural language and receive accurate, context-aware answers generated from retrieved company data.

### 🎯 Purpose of the Project

Build a **real-world AI-powered enterprise solution** demonstrating:
- Integration of AI with MERN stack
- Retrieval-Augmented Generation (RAG) pipeline
- Document understanding & semantic search
- Scalable backend architecture
- Production-ready code structure

---

## 💼 Project Details

### 🤖 What is an SOP Agent?

An SOP Agent is an AI system that helps employees quickly find and understand company procedures, guidelines, and documentation through natural language conversations.

### 🧠 How RAG Architecture Works

```
1. Document Upload → SOP documents uploaded (PDF/Text)
2. Embedding Generation → Text converted into vector embeddings
3. Vector Database Storage → Stored for semantic search
4. User Query → User asks a question
5. Retrieval → Relevant document chunks fetched via vector search
6. Generation → AI model generates precise answer using retrieved context
```

### 👤 User Functionalities

- Ask questions in natural language
- Get accurate answers from SOP documents
- Upload documents for processing
- Real-time response generation

### ⚙️ System Capabilities

- Semantic search (not keyword-based)
- Context-aware AI responses
- File upload & processing pipeline
- Scalable backend APIs

---

## 🏗️ Complete System Architecture

### 🔄 End-to-End Flow

```
User uploads PDF
        ↓
File stored using Multer
        ↓
PDF parsed into raw text (pdf-parse)
        ↓
Text split into chunks (500 chars, 100 overlap)
        ↓
Each chunk converted into embedding vector (384 dims)
        ↓
Stored in MongoDB with embeddings
        ↓
User asks question
        ↓
Query converted to embedding
        ↓
MongoDB Vector Search (semantic retrieval)
        ↓
Top 3-5 relevant chunks retrieved
        ↓
Context builder assembles chunks
        ↓
AI generates answer using context + query
        ↓
Response sent to user
```

### 📂 Complete Project Structure

```
project-root/
│
├── client/                    # React Frontend
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── DocumentList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── server/                    # Node + Express Backend
│   ├── node_modules/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── documentModel.js
│   ├── controllers/
│   │   ├── uploadController.js
│   │   └── searchController.js
│   ├── services/
│   │   └── embeddingService.js
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   └── searchRoutes.js
│   ├── middlewares/
│   │   └── uploadMiddleware.js
│   ├── utils/
│   │   └── chunker.js
│   ├── uploads/               # Temporary storage
│   ├── index.js
│   ├── app.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Technical Stack

### Frontend
- **React.js** with modern hooks (useState, useEffect)
- **Vite** for fast development
- **Axios** for API integration
- **React Router** for navigation

### Backend
- **Node.js** + **Express.js** REST APIs
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction

### AI & ML
- **@google/generative-ai** for embeddings & LLM
- **all-MiniLM-L6-v2** (384-dim embeddings) via HuggingFace
- Vector search via MongoDB Atlas

### Security & Utilities
- **bcrypt** for password hashing
- **jsonwebtoken** for authentication
- **dotenv** for environment management
- **cors** for cross-origin requests

---

## 🔐 Environment Variables Setup

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/opsmind-Ai
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Important:** Never push `.env` files to GitHub. Add to `.gitignore`.

---

## 📦 Complete Dependencies Explanation

### 🧠 AI & Core Logic
| Package | Purpose |
|---------|---------|
| `@google/generative-ai` | Gemini API for LLM responses & embeddings |
| `mathjs` | Mathematical operations & vector similarity |
| `@huggingface/transformers` | Local embedding generation (all-MiniLM-L6-v2) |

### 🔐 Authentication & Security
| Package | Purpose |
|---------|---------|
| `bcrypt` | Hash passwords securely |
| `jsonwebtoken` | JWT-based authentication |
| `express-session` | Session-based authentication (optional) |
| `cookie-parser` | Parse cookies from requests |

### 🌐 Backend & Server
| Package | Purpose |
|---------|---------|
| `express` | Core backend framework |
| `cors` | Enable frontend-backend communication |
| `dotenv` | Manage environment variables |

### 🗄️ Database
| Package | Purpose |
|---------|---------|
| `mongoose` | MongoDB ODM for schema & operations |

### 📥 File Handling
| Package | Purpose |
|---------|---------|
| `multer` | Handle PDF file uploads |
| `pdf-parse` | Extract text content from PDFs |

### ✅ Validation
| Package | Purpose |
|---------|---------|
| `express-validator` | Validate user inputs & API requests |

### 🆔 Utilities
| Package | Purpose |
|---------|---------|
| `uuid` | Generate unique identifiers |

### ⚙️ Development
| Package | Purpose |
|---------|---------|
| `nodemon` | Auto-restart server during development |
| `vite` | Fast frontend build tool |

---

## 🔄 Complete API Endpoints

### 1. Upload PDF Document
**POST** `/api/upload`

**Request (form-data):**
```
key: file
type: File
value: PDF file
```

**Response:**
```json
{
  "message": "PDF processed & stored with embeddings",
  "totalChunks": 13
}
```

### 2. Semantic Search
**POST** `/api/search`

**Request Body:**
```json
{
  "query": "How do I access student management system?"
}
```

**Response:**
```json
{
  "success": true,
  "query": "How do I access student management system?",
  "results": [
    {
      "text": "Dashboard → View Courses → Check Attendance...",
      "fileName": "University Document.pdf",
      "relevanceScore": 0.89
    }
  ]
}
```

### 3. Ask Question (RAG Response)
**POST** `/api/ask`

**Request Body:**
```json
{
  "question": "What is the procedure for leave approval?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "What is the procedure for leave approval?",
  "answer": "Based on the SOP document, leave approval requires...",
  "sources": ["HR_Policy.pdf", "Employee_Handbook.pdf"]
}
```

---

## 🧠 Core Implementation Details

### Embedding Generation Service

```javascript
// services/embeddingService.js
const { pipeline } = require('@huggingface/transformers');

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
};

const generateEmbedding = async (text) => {
  try {
    const extractor = await getExtractor();
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data);
  } catch (error) {
    console.error('Embedding error:', error.message);
    return null;
  }
};
```

### Chunking Logic

```javascript
// utils/chunker.js
exports.chunkText = (text) => {
  const chunkSize = 500;  // characters
  const overlap = 100;     // overlap between chunks
  
  let chunks = [];
  
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const chunk = text.slice(i, i + chunkSize);
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
};
```

### Database Schema

```javascript
// models/documentModel.js
const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  chunkText: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create vector search index (MongoDB Atlas)
// Index name: vector_index
// Path: embedding
// Dimensions: 384
// Similarity: cosine
```

### MongoDB Atlas Vector Index Configuration

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

### Vector Search Controller

```javascript
// controllers/searchController.js
const searchQuery = async (req, res) => {
  const { query } = req.body;
  
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  
  // Perform vector search
  const results = await Document.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5
      }
    },
    {
      $project: {
        fileName: 1,
        chunkText: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);
  
  res.json({ success: true, results });
};
```

---

## ⚡ Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- npm or yarn package manager

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd opsmind-ai
```

### 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

**Backend packages installed:**
- express, mongoose, dotenv, cors
- multer, pdf-parse
- @google/generative-ai
- @huggingface/transformers
- bcrypt, jsonwebtoken
- nodemon (dev)

### 3️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
```

**Frontend packages installed:**
- react, react-dom
- vite
- axios
- react-router-dom

### 4️⃣ Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/opsmind-ai
GEMINI_API_KEY=your_actual_key
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 5️⃣ Create MongoDB Atlas Vector Index

1. Go to MongoDB Atlas → Collections
2. Click on "Indexes" tab
3. Click "Create Index"
4. Select "Vector Search"
5. Use configuration:
   ```json
   {
     "fields": [{
       "type": "vector",
       "path": "embedding",
       "numDimensions": 384,
       "similarity": "cosine"
     }]
   }
   ```
6. Name it: `vector_index`

---

## ▶️ Running the Project

### 🔥 Run Backend Server

```bash
cd server
npm run dev
```
Server runs at: `http://localhost:5000`

### 🎨 Run Frontend Client

```bash
cd client
npm run dev
```
Client runs at: `http://localhost:5173`

---

## 🧪 Testing the System

### Step 1: Upload a PDF

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/your/document.pdf"
```

### Step 2: Search for Content

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "your search question here"}'
```

### Step 3: Ask for AI Response

```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "your question here"}'
```

---

## 📊 Database Schema Examples

### Stored Document

```json
{
  "_id": "65f8a3b1c2d4e5f6a7b8c9d0",
  "fileName": "University Document.pdf",
  "chunkText": "Dashboard → View Courses → Check Attendance → Submit Leave Request",
  "embedding": [0.021, -0.77, 0.55, 0.12, -0.34, ...],  // 384 dimensions
  "createdAt": "2026-04-15T19:54:46.034Z",
  "__v": 0
}
```

---

## 🔄 API Communication Flow

```
React Frontend (Axios Request)
        ↓
Express Backend (Route Handler)
        ↓
Controller (Business Logic)
        ↓
Service (Embedding Generation)
        ↓
Database (MongoDB Vector Search)
        ↓
Response sent back to Frontend
```

---

## 🛠️ NPM Scripts

### Backend (`server/package.json`)
```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### Frontend (`client/package.json`)
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 🚫 Important Security Notes

- **Never commit `.env` files** to GitHub
- Use `.env.example` to share variable structure
- Run `npm install` after cloning (node_modules not in repo)
- Always validate user inputs before processing
- Implement rate limiting for API endpoints
- Use HTTPS in production

---

## 🚀 Deployment Guidelines

### Backend Deployment (Render/Railway/AWS)
1. Push code to GitHub repository
2. Connect to deployment service
3. Set environment variables in dashboard
4. Replace local MongoDB URI with production URI
5. Deploy from main branch

### Frontend Deployment (Netlify/Vercel)
1. Build project: `npm run build`
2. Connect to deployment service
3. Set environment variables
4. Deploy production build

---

## 📈 Current Implementation Status

### ✅ Completed Phases
- ✔ File Upload API with Multer
- ✔ PDF Parsing & Text Extraction
- ✔ Text Chunking (500 chars, 100 overlap)
- ✔ Local Embedding Generation (384-dim vectors)
- ✔ MongoDB Storage with Embeddings
- ✔ Database Schema Design

### 🚧 Next Phases
- 🔄 MongoDB Atlas Vector Search Integration
- 🔄 Semantic Query Endpoint
- 🔄 RAG Response Generation
- 🔄 Chat Interface (Frontend)
- 🔄 User Authentication

---

## 🎯 Key Takeaways

### What This System Achieves

**Before:**
- Just file storage ❌
- No intelligence ❌
- Keyword search only ❌

**After:**
- Semantic understanding of content ✅
- Vector-based representation ✅
- Ready for AI search & chat ✅
- Production-ready architecture ✅

### Why This Matters

This is the **foundation of any real-world AI application** — turning raw data into machine-understandable vectors. The system transforms from a simple backend into an **AI-ready data pipeline** where each chunk is independently searchable and the database holds **semantic meaning**, not just text.

---

## 🔍 Troubleshooting Guide

### Issue: MongoDB Connection Error
**Solution:** Check MONGO_URI in `.env` and ensure network access in Atlas

### Issue: Embeddings Not Generating
**Solution:** Verify API keys and install `@huggingface/transformers`

### Issue: Vector Search Not Working
**Solution:** Confirm vector index exists in Atlas and dimensions match (384)

### Issue: CORS Errors
**Solution:** Check CLIENT_URL in backend `.env` and restart server

---

## 👨‍💻 Developer Notes

This project follows industry-level MERN practices:
- Separation of concerns
- Clean code structure
- API-first approach
- Reusable components
- Modular architecture
- Error handling & loading states

---

## 💡 Pro Tips

1. **Always re-upload PDFs** after changing embedding model
2. **Monitor MongoDB Atlas** for vector search performance
3. **Use batches** when uploading multiple documents
4. **Test with small PDFs** first to validate pipeline
5. **Keep chunk size optimized** for your use case (500-1000 chars)

---

## 📚 Additional Resources

- [MongoDB Vector Search Documentation](https://www.mongodb.com/docs/atlas/atlas-vector-search/)
- [HuggingFace Transformers.js](https://huggingface.co/docs/transformers.js/index)
- [RAG Architecture Guide](https://www.pinecone.io/learn/rag/)

---

## 🏁 Final Summary

```You have successfully built:

✔ A complete document ingestion pipeline
✔ A text processing engine with chunking
✔ A semantic embedding system (384-dim vectors)
✔ A database ready for AI search
✔ Production-ready MERN architecture
✔ Foundation for RAG implementation

---

## 🔥 Core Achievement

> **From raw PDF to AI-ready vectors** — OpsMind AI now has the complete pipeline for document understanding, semantic search, and intelligent retrieval. This is the backbone of any enterprise AI system.

---

**Built as part of the OpsMind AI Project** — A production-style AI system designed for intelligent document understanding, semantic search, and retrieval-augmented generation in enterprise environments.```
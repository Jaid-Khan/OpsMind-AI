# 🚀 MERN Stack Project Setup Guide

## 📌 Project Overview

This project is an **Enterprise SOP Agent based on RAG (Retrieval-Augmented Generation) Architecture**. It is designed to help organizations efficiently access, understand, and interact with internal Standard Operating Procedures (SOPs) using AI.

Instead of manually searching documents, users can ask questions in natural language and receive accurate, context-aware answers generated using retrieved company data.

### 🎯 Purpose of the Project

The goal of this project is to build a **real-world AI-powered enterprise solution** that demonstrates:

* Integration of AI with MERN stack
* Retrieval-Augmented Generation (RAG) pipeline
* Document understanding & semantic search
* Scalable backend architecture

---

## 💼 Project Details

### 🤖 What is an SOP Agent?

An SOP Agent is an AI system that helps employees quickly find and understand company procedures, guidelines, and documentation.

---

### 🧠 How RAG Architecture Works (Core Concept)

1. **Document Upload:** SOP documents are uploaded (PDF/Text)
2. **Embedding Generation:** Text is converted into vector embeddings
3. **Vector Database Storage:** Stored for semantic search
4. **User Query:** User asks a question
5. **Retrieval:** Relevant document chunks are fetched
6. **Generation:** AI model generates a precise answer using retrieved context

---

### 🧑‍💻 Key Functionalities

#### 👤 For Users:

* Ask questions in natural language
* Get accurate answers from SOP documents
* Upload documents for processing
* Real-time response generation

#### ⚙️ System Capabilities:

* Semantic search (not keyword-based)
* Context-aware AI responses
* File upload & processing pipeline
* Scalable backend APIs

---

### ⚙️ Technical Highlights

* **Frontend:** React.js (UI for chat + upload)
* **Backend:** Node.js + Express.js
* **AI Integration:** OpenAI / LLM APIs
* **Vector DB:** (e.g., Pinecone / MongoDB Atlas Vector / FAISS)
* **Embeddings:** Text vectorization for semantic search
* **API Handling:** Axios / Fetch

---

### 🌟 Key Features

* AI-powered SOP assistant
* Retrieval-Augmented Generation (RAG)
* Document-based Q&A system
* Clean and interactive chat interface
* Modular and scalable architecture

---

### ⚙️ Technical Highlights:

* **Frontend:** React.js with modern hooks (useState, useEffect)
* **Backend:** Node.js + Express.js REST APIs
* **Database:** MongoDB with Mongoose
* **API Calls:** Axios integration
* **State Management:** Component-level state handling
* **Routing:** React Router
* **Environment Handling:** Secure `.env` configuration

### 🌟 Key Features:

* Dynamic job listing rendering
* Admin dashboard functionality
* API-based architecture
* Modular folder structure
* Error handling & loading states
* Clean and reusable components

---

## 📂 Project Structure

```
project-root/
│
├── client/          # React Frontend
│   ├── node_modules/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── server/          # Node + Express Backend
│   ├── node_modules/
|   └── config
│   ├── models/
│   ├── controllers/
│   ├── routes/
|   └── index.js
|   └── app.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── .gitignore       # Root Git Ignore
└── README.md
```

---

## 🔐 Environment Variables Setup (.env)

### Backend (`server/.env`)

Create a `.env` file inside the `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

Create a `.env` file inside the `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Important:** Never push `.env` files to GitHub. These contain sensitive data.

---

## 🙈 .gitignore Setup

### Root `.gitignore`

```
node_modules/
.env
client/.env
server/.env
```

### Client `.gitignore`

```
node_modules/
dist/
.env
```

### Server `.gitignore`

```
node_modules/
.env
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```
git clone <your-repo-url>
cd project-root
```

---

### 2️⃣ Install Dependencies

#### Install Backend

```
cd server
npm install
```

#### Install Frontend

```
cd ../client
npm install
```

---

## ▶️ Running the Project

### 🔥 Run Backend Server

```
cd server
npm run dev
```

> This will start the backend server using nodemon (auto-restart on changes)

---

### 🎨 Run Frontend Client

```
cd client
npm run dev
```

> This will start the React development server (Vite)

---

## 🌐 Application URLs

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🔄 API Communication Flow

1. React frontend sends request via Axios/Fetch
2. Request hits Express backend
3. Backend processes logic (routes/controllers)
4. Database interaction (MongoDB)
5. Response sent back to frontend

---

## 🧠 Key Features

* RESTful API architecture
* Component-based React UI
* Environment-based configuration
* Secure handling of sensitive data using `.env`
* Modular folder structure
* Axios API integration
* Loading states & error handling

---

## 🛠️ Scripts Used

### Backend (`server/package.json`)

```
"scripts": {
  "dev": "nodemon index.js"
}
```

### Frontend (`client/package.json`)

```
"scripts": {
  "dev": "vite"
}
```

---

## 🚫 Important Notes

* Do NOT upload `.env` files to GitHub
* Always use `.env.example` for sharing variable structure
* Run `npm install` after cloning (node_modules not uploaded)

---

## 📦 Deployment Tips

* Use services like Netlify (Frontend) and Render/Railway (Backend)
* Set environment variables in deployment dashboard
* Replace local URLs with production URLs

---

## 👨‍💻 Developer Notes

This project is designed with scalability in mind and follows industry-level MERN practices including:

* Separation of concerns
* Clean code structure
* API-first approach
* Reusable components

---


## 💡 Final Tip

If the project is not working:

* Check `.env` variables
* Ensure backend is running before frontend
* Verify API URLs

---
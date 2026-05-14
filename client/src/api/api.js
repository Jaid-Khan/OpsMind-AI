// src/api/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ Upload PDF
export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Query Docs (Chat with history)
export const queryDocs = (data) => {
  return API.post("/query", data);
};
// ✅ Get all documents
export const getDocuments = () => {
  return API.get("/admin/docs");
};

// ✅ Delete document (by fileName)
export const deleteDocument = (fileName) => {
  return API.delete(`/admin/docs/${fileName}`);
};

// ✅ GET CHAT
export const getChat = (sessionId) => {
  return API.get(`/chat/${sessionId}`);
};


// ✅ SAVE MESSAGE
export const saveMessage = (data) => {
  return API.post("/chat/save", data);
};

// ✅ GET SOURCE PREVIEW
export const getSourcePreview = (
  fileName,
  pageNumber
) => {
  return API.get(
    `/query/source-preview`,
    {
      params: {
        fileName,
        pageNumber,
      },
    }
  );
};

export default API;
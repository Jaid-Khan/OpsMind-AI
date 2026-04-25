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

// ✅ Query Docs (Chat)
export const queryDocs = (query) => {
  return API.post("/query", { query });
};

// ✅ Get all documents
export const getDocuments = () => {
  return API.get("/admin/docs");
};

// ✅ Delete document (by fileName)
export const deleteDocument = (fileName) => {
  return API.delete(`/admin/docs/${fileName}`);
};

export default API;
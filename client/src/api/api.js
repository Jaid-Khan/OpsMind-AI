// src/api/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging (optional)
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const queryDocs = (query) => {
  return API.post("/query", { query });
};

export const getDocuments = () => {
  return API.get("/documents");
};

export const deleteDocument = (id) => {
  return API.delete(`/documents/${id}`);
};
import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

// ========================================
// AUTO ATTACH JWT TOKEN
// ========================================

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "opsmind_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

API.interceptors.response.use(
  (response) => response,

  (error) => {

    console.error(
      "API Error:",
      error.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

// ========================================
// AUTH APIs
// ========================================

export const registerUser = (
  data
) => {
  return API.post(
    "/auth/register",
    data
  );
};

export const loginUser = (
  data
) => {
  return API.post(
    "/auth/login",
    data
  );
};

// ========================================
// PDF APIs
// ========================================

export const uploadPDF = (
  file
) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  return API.post(
    "/upload/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

// ========================================
// QUERY APIs
// ========================================

export const queryDocs = (
  data
) => {
  return API.post(
    "/query",
    data
  );
};

// ========================================
// ADMIN APIs
// ========================================

export const getDocuments =
  () => {
    return API.get(
      "/admin/docs"
    );
  };

export const deleteDocument =
  (fileName) => {
    return API.delete(
      `/admin/docs/${fileName}`
    );
  };

// ========================================
// CHAT APIs
// ========================================

export const getChat = (
  sessionId
) => {
  return API.get(
    `/chat/${sessionId}`
  );
};

export const saveMessage = (
  data
) => {
  return API.post(
    "/chat/save",
    data
  );
};

// ========================================
// SOURCE PREVIEW
// ========================================

export const getSourcePreview = (
  fileName,
  pageNumber
) => {

  return API.get(
    "/query/source-preview",
    {
      params: {
        fileName,
        pageNumber,
      },
    }
  );
};

export default API;
// src/components/UploadBox.jsx
import { useState } from "react";
import { uploadPDF } from "../api/api";

export default function UploadBox({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMsg("");
      setUploadProgress(0);
    } else {
      setFile(null);
      setMsg("Please select a valid PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMsg("Please select a file first");
      return;
    }

    setLoading(true);
    setMsg("");
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await uploadPDF(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setMsg(`✅ ${res.data.message} (${res.data.totalChunks} chunks processed)`);
      
      // Notify parent component of successful upload
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      // Reset file input after successful upload
      setFile(null);
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setMsg(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
        Upload PDF Document
      </h2>
      
      <div className="space-y-4">
        {/* File Input Area */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
            disabled={loading}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`
            w-full sm:w-auto px-6 py-2.5 rounded-md font-medium
            transition-all duration-200
            ${!file || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:transform active:scale-95"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Upload PDF"
          )}
        </button>

        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Status Message */}
        {msg && (
          <div className={`
            mt-3 p-3 rounded-md text-sm
            ${msg.includes("✅") ? "bg-green-50 text-green-800" : 
              msg.includes("❌") ? "bg-red-50 text-red-800" : 
              "bg-blue-50 text-blue-800"}
          `}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  uploadPDF,
  getDocuments,
  deleteDocument,
} from "../api/api";

export default function UploadBox({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Documents state
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // ✅ Fetch all documents
  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);

      const res = await getDocuments();

      setDocuments(res.data.documents || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDocs(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, []);

  // ✅ File select
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

  // ✅ Upload PDF
  const handleUpload = async () => {
    if (!file) {
      setMsg("Please select a file first");
      return;
    }

    setLoading(true);
    setMsg("");
    setUploadProgress(0);

    try {
      // Fake progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
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

      setMsg(
        `✅ ${res.data.message} (${res.data.totalChunks} chunks processed)`
      );

      // ✅ Refresh docs instantly
      fetchDocuments();

      // ✅ Parent callback
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // ✅ Reset
      setFile(null);

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);

    } catch (err) {
      console.error(err);

      setMsg(
        `❌ Upload failed: ${
          err.response?.data?.error || err.message
        }`
      );

      setUploadProgress(0);

    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete document
  const handleDelete = async (fileName) => {
    const confirmDelete = window.confirm(
      `Delete ${fileName} ?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDocument(fileName);

      alert("🗑️ Document deleted successfully");

      // ✅ Refresh list
      fetchDocuments();

    } catch (error) {
      console.error(error);

      alert("❌ Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* Upload Card */}
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">

        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
          Upload PDF Document
        </h2>

        <div className="space-y-4">

          {/* File Input */}
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
                Selected: {file.name} (
                {(file.size / 1024).toFixed(2)} KB)
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
              ${
                !file || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
              }
            `}
          >
            {loading ? "Processing..." : "Upload PDF"}
          </button>

          {/* Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                }}
              ></div>
            </div>
          )}

          {/* Message */}
          {msg && (
            <div
              className={`
                mt-3 p-3 rounded-md text-sm
                ${
                  msg.includes("✅")
                    ? "bg-green-50 text-green-800"
                    : msg.includes("❌")
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
                }
              `}
            >
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-md p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Uploaded Documents
          </h2>

          <span className="text-sm text-gray-500">
            {documents.length} Files
          </span>
        </div>

        {loadingDocs ? (
          <p className="text-gray-500">
            Loading documents...
          </p>
        ) : documents.length === 0 ? (
          <p className="text-gray-400">
            No documents uploaded yet
          </p>
        ) : (
          <div className="space-y-4">

            {documents.map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >

                {/* Left */}
                <div>
                  <h3 className="font-medium text-gray-800 break-all">
                    {doc.fileName}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">

                    <span>
                      📄 {doc.totalChunks} chunks
                    </span>

                    <span>
                      🕒{" "}
                      {new Date(
                        doc.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>
                </div>

                {/* Right */}
                <button
                  onClick={() =>
                    handleDelete(doc.fileName)
                  }
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
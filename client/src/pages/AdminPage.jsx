// src/pages/AdminPage.jsx
import UploadBox from "../components/UploadBox";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage your PDF documents and embeddings</p>
        </div>
        
        <UploadBox />
        
        {/* Optional: Add document list or stats here */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900">ℹ️ Information</h3>
          <p className="text-sm text-blue-800 mt-1">
            Uploaded PDFs are processed and stored as vector embeddings for semantic search.
          </p>
        </div>
      </div>
    </div>
  );
}
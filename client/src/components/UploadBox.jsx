// src/components/UploadBox.jsx
import { useState } from "react";
import { uploadPDF } from "../api/api";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      const res = await uploadPDF(file);
      setMsg(res.data.message);
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 ml-2"
      >
        Upload PDF
      </button>

      <p className="mt-2 text-sm">{msg}</p>
    </div>
  );
}
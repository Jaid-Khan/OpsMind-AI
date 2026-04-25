const Document = require("../models/documentModel");
const fs = require("fs");
const path = require("path");

// ✅ GET ALL DOCUMENTS (CLEAN FORMAT)
const getAllDocs = async (req, res) => {
  try {
    const docs = await Document.aggregate([
      {
        $group: {
          _id: "$fileName",
          totalChunks: { $sum: 1 },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 0,
          fileName: "$_id",
          totalChunks: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({ documents: docs });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// ✅ DELETE DOCUMENT (DB + FILE CLEANUP)
const deleteDoc = async (req, res) => {
  try {
    const { fileName } = req.params;

    // 🔥 Delete from DB
    const result = await Document.deleteMany({ fileName });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 🔥 Delete from uploads folder
    const uploadsPath = path.join(__dirname, "../uploads");

    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);

      files.forEach(file => {
        // ⚠️ Safe fallback (since filenames are hashed)
        if (file.endsWith(".pdf")) {
          try {
            fs.unlinkSync(path.join(uploadsPath, file));
          } catch (err) {
            console.log("File delete error:", err.message);
          }
        }
      });
    }

    res.json({ message: "Document deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
};

module.exports = {
  getAllDocs,
  deleteDoc
};
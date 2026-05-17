const Document =
  require("../models/documentModel");

const fs = require("fs");

const path = require("path");

// ========================================
// GET ALL DOCS
// ========================================

const getAllDocs = async (
  req,
  res
) => {
  try {

    const docs =
      await Document.aggregate([
        {
          $group: {
            _id: "$fileName",

            totalChunks: {
              $sum: 1,
            },

            createdAt: {
              $first:
                "$createdAt",
            },

            storedFileName: {
              $first:
                "$storedFileName",
            },
          },
        },

        {
          $project: {
            _id: 0,

            fileName: "$_id",

            storedFileName: 1,

            totalChunks: 1,

            createdAt: 1,
          },
        },

        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

    res.json({
      documents: docs,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        "Failed to fetch documents",
    });
  }
};

// ========================================
// DELETE DOC
// ========================================

const deleteDoc = async (
  req,
  res
) => {
  try {

    const { fileName } =
      req.params;

    // Find one document first
    const doc =
      await Document.findOne({
        fileName,
      });

    if (!doc) {
      return res.status(404).json({
        error:
          "Document not found",
      });
    }

    // Delete all chunks
    await Document.deleteMany({
      fileName,
    });

    // Delete actual PDF file
    const filePath =
      path.join(
        __dirname,
        "../uploads",
        doc.storedFileName
      );

    if (
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }

    res.json({
      message:
        "Document deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        "Delete failed",
    });
  }
};

module.exports = {
  getAllDocs,
  deleteDoc,
};
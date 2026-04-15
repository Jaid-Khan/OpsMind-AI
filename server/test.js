const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces use of Google DNS
require('dotenv').config();
const mongoose = require('mongoose');
const { generateEmbedding } = require('./services/embeddingService');
const Document = require('./models/documentModel'); // Matches your documentModel.js

(async () => {
    try {
        // 1. Connect to MongoDB
        // Make sure MONGODB_URI=your_connection_string is in your .env file
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from your .env file");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully!");

        // 2. Generate the embedding
        const textToEmbed = "Hello world, this is my first vector entry";
        const embedding = await generateEmbedding(textToEmbed);
        console.log("Embedding generated. Length:", embedding.length);

        // 3. Save to Database
        // Note: Check your documentModel.js to ensure these field names (content, embedding) match
        const newDoc = await Document.create({
            content: textToEmbed,
            embedding: embedding,
            createdAt: new Date() 
        });

        console.log("✅ SUCCESS! Document saved with ID:", newDoc._id);

        // 4. Double Check
        const count = await Document.countDocuments();
        console.log("Total documents now in your collection:", count);

    } catch (error) {
        console.error("❌ ERROR:", error.message);
    } finally {
        // Always close the connection when the test is done
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
})();
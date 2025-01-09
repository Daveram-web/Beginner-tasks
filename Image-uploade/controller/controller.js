import pool from "../Db/db.js";

export const Imageupload = async (req, res) => {
    try {
        // Validate file input
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Generate image URLs
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        console.log("Image URLs:", imageUrls);

        // Insert into the database
        const result = await pool.query(
            "INSERT INTO img-crud (Image) VALUES (?)",
            [JSON.stringify(imageUrls)]
        );

        console.log("Insert Result:", result);

        if (!result || !result.insertId) {
            return res.status(500).json({ message: "Failed to insert into the database." });
        }

        res.status(200).json({
            message: "Images uploaded successfully",
            id: result.insertId,
            imageUrls
        });
    } catch (error) {
        console.error("Error during image upload:", error.message);
        res.status(500).json({ message: error.message });
    }
};

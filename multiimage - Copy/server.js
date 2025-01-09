// Required dependencies
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path'); // Import 'path' module once
const fs = require('fs'); // Import 'fs' module to handle file system
const cors = require('cors');

// Initialize express
const app = express();
const port = 3000;
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'image_db',
});

// Create MySQL table to store images (run this in MySQL shell)
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL
  );
`;
db.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log("Images table created.");
});

// Set up multer to store files in 'uploads' folder
// Define the upload folder
const uploadFolder = path.join(__dirname, 'uploads');

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Setup Multer storage to save images on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Unique filename
    cb(null, fileName); // Save file with the unique name
  }
});

const upload = multer({ storage: storage });

// Create: Upload multiple images
app.post('/upload', upload.array('images', 10), (req, res) => {
  console.log("hit ");
  
  const files = req.files;
  if (!files || files.length === 0) {
    console.log("files ",files);
    return res.status(400).send('No images uploaded.');
    
  }

  let uploadedImages = 0;
  let totalImages = files.length;

  // Loop through each file and insert into the database
  files.forEach((file) => {
    const name = req.body.name || 'Untitled';
    const filePath = path.join('uploads', file.filename); // Store relative file path

    console.log("hit 2 Image update");
    const query = 'INSERT INTO images (name, path) VALUES (?, ?)';
    console.log("query",query);
    
    db.query(query, [name, filePath], (err, result) => {
      if (err) {
        return res.status(500).send('Error uploading images.');
      }
      

      uploadedImages++;
      console.log("Image " , uploadedImages);
      

      // If all images have been uploaded, send the response
      if (uploadedImages === totalImages) {
        res.send('Images uploaded successfully.');
      }
    });
  });
});

// GET: Get all images
app.get('/images', (req, res) => {
  const query = 'SELECT * FROM images';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// DELETE: Delete image
app.delete('/image/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT path FROM images WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    const imagePath = result[0].path;
    fs.unlink(imagePath, (err) => {
      if (err) throw err;
      const deleteQuery = 'DELETE FROM images WHERE id = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) throw err;
        res.send('Image deleted successfully.');
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

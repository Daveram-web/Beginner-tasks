const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const cros = require('cors');
const { error } = require('console');

const app = express();
app.use(express.json());
app.use(cros());

const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

// Configure multer for storing images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

app.use('/uploads', express.static('uploads'));


const upload = multer({ storage });

// Ensure 'uploads' folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.post('/uploads', upload.single('image'), (req, res) => {
  const updatedName = req.body.name; // Get the name from the input field (passed by frontend)
  const file = req.file;  // The uploaded file

  if (!updatedName || !file) {
    return res.status(400).json({ message: 'Missing name or image file.' });
  }

  const ext = path.extname(file.originalname); // Get file extension
  const newFileName = `${Date.now()}_${file.originalname}`; // Use a timestamped filename for uniqueness
  const newFilePath = path.join(__dirname, 'uploads', newFileName);

  // Move the uploaded file to the final destination
  fs.rename(file.path, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving image.' });
    }

    const imageUrl = `/uploads/${newFileName}`; // Generate the URL for the image

    // Save the name and image URL to the single table
    const query = 'INSERT INTO images (name, url) VALUES (?, ?)';
    db.query(query, [updatedName, imageUrl], (dbErr, result) => {
      if (dbErr) {
        console.error(dbErr);
        return res.status(500).json({ message: 'Error saving data to the database.' });
      }

      // Respond with success
      res.status(200).json({
        message: 'Upload successful!',
        data: {
          id: result.insertId, // The auto-incremented ID of the inserted record
          name: updatedName,
          imageUrl,
        },
      });
    });
  });
});


// Route to upload images
app.post('/upload', upload.array('images'), (req, res) => {
  const { name } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

  // Save image details to MySQL
  const sql = 'INSERT INTO images (name, url) VALUES ?';
  const values = fileUrls.map(url => [name, url]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }
    res.send('Images uploaded and URLs saved successfully.');
  });
});

// Route to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to fetch unique names from the images table
app.get('/names', (req, res) => {
  const sql = 'SELECT DISTINCT name FROM images';  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }
    res.json(results);  // Send the list of unique names as JSON
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.send({
    message: 'File uploaded successfully!',
    file: req.file
  });
});

// Route to fetch images by name
app.get('/images/by-name/:name', (req, res) => {
  const { name } = req.params;
  const sql = 'SELECT * FROM images WHERE name = ?';
  db.query(sql, [name], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }
    res.json(results);  // Send images as JSON
  });
});

// DELETE image by ID
app.delete('/image/:id', (req, res) => {
  const { id } = req.params;
  
  // First, get the image details from the database before deleting it
  const sqlSelect = 'SELECT * FROM images WHERE id = ?';
  db.query(sqlSelect, [id], (err, results) => {
    if (err) return res.status(500).send('Error fetching image details.');
    if (results.length === 0) return res.status(404).send('Image not found.');

    // Delete the image record from the database
    const sqlDelete = 'DELETE FROM images WHERE id = ?';
    db.query(sqlDelete, [id], (err, result) => {
      if (err) return res.status(500).send('Error deleting image.');
      if (result.affectedRows === 0) return res.status(404).send('Image not found.');
      
      // Optionally, delete the image file from the server (you can skip this step if it's not required)
      const filePath = path.join(__dirname, 'uploads', results[0].url.replace('/uploads/', ''));
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });

      res.send('Image deleted successfully.');
    });
  });
});


app.put('/update-image-name', (req, res) => {
  const { oldName, newName } = req.body;
  console.log("Updating image name globally...");

  if (!oldName || !newName) {
    return res.status(400).send('Old name and new name are required.');
  }

  const sql = 'UPDATE images SET name = ? WHERE name = ?';
  db.query(sql, [newName, oldName], (err, result) => {
    if (err) {
      console.error('Error updating name:', err);
      return res.status(500).send('Database error.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('No images with the given old name found.');
    }

    res.send('Image name updated globally.');
  });
});




// PUT update image name by ID
app.put('/images/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('New name is required');
  }
  

  const sql = 'UPDATE images SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Image not found.');
    }

    res.send('Image name updated successfully.');
  });
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

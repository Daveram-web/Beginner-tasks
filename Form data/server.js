const express = require('express');
const mysql2 = require('mysql2');
const multer = require('multer');

const app = express();
const port = 3009;
app.use(express.json())

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'form'
});
db.connect((err) => {
    if (err) {
        console.error('error connecting:', err);
        return;
    }
    console.log('connected as id ' + db.threadId);
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({storage : storage});
app.use('/upload', express.static('uploads'))


app.post('/upload', upload.array('images'), (req, res) => {
    console.log("m");
    const { name } = req.body;
    console.log("name",name);
    
    
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }
  
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
  
    const tableName = `images_${name.replace(/\s+/g, '_').toLowerCase()}`; // Format table name
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS \`${tableName}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL
      )
    `;
  
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).send('Database error.');
      }
  
      // Insert image details into the dynamically created table
      const insertQuery = `INSERT INTO \`${tableName}\` (name, url) VALUES ?`;
      const values = fileUrls.map(url => [name, url]);
  
      db.query(insertQuery, [values], (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Database error.');
        }
        res.send(`Images uploaded and saved in table "${tableName}" successfully.`);
      });
    });
  });
  


app.get('/get_image_data', (req, res) => {
    const sql = 'SELECT * FROM web_view';
    db.query(sql, (err, results) => {
        console.log("hit");
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Error fetching data", error: err });
        }
        else {
            res.send(results);
        }
    });
})

app.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM \`web_view\` WHERE id = '${id}'`;  // Use backticks around the table name
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Error fetching data", error: err });
        } else {
            res.send(results);
        }
    });
});







app.listen(port, () => {
    console.log(` port no http://localhost:${port}`);

})



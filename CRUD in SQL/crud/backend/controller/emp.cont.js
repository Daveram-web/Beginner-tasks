import pool from "../Db/db.js";
import multer from 'multer';
import path from "path";
import fs from "fs"


import { promisify } from 'util';

const query = promisify(pool.query).bind(pool);

export const EmpIndex = async (req, res) => {
    try {
        const result = await query('SELECT * FROM crud');
        
        res.json(result);
        console.log("Employee List:", result);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ msg: error.message || "An error occurred" });
    }
};



export const EmpCreate = async (req, res) => {
  const { FName, LName, Mobile } = req.query;

  console.log("hit");
  

  if (!FName || !LName || !Mobile) {
    console.log("hit 1");
    return res.status(400).json({ message: 'Data is required' });
    
  }

  try {
    console.log("hit 2");
    
    const result = await pool.query(
      'INSERT INTO crud (FName, LName, Mobile) VALUES (?, ?, ?)',
      [FName, LName, Mobile]
    );
    
    res.status(201).json({ id: result.insertId, FName, LName, Mobile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const EmpDetail = async (req, res) => {
  try {
      const emp = await query('SELECT * FROM crud WHERE id = ?', [req.params.id]);

      if (!emp || emp.length === 0) {
          return res.status(404).json({ msg: "Employee not found" });
      }

      res.json(emp[0]); 
      console.log("Employee details:", emp[0]); 
  } catch (error) {
      console.error("Error fetching employee details:", error);
      res.status(500).json({ msg: error.message || "An error occurred" });
  }
};




export const EmpUpdate = async (req, res) => {
  const { FName, LName, Mobile } = req.query;

  if (!FName || !LName || !Mobile) {
      return res.status(400).json({ message: 'Data is required' });
  }

  try {
      const result = await query(
          'UPDATE crud SET FName = ?, LName = ?, Mobile = ? WHERE id = ?',
          [FName, LName, Mobile, req.params.id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Emp not found' });
      }

      res.status(200).json({ message: 'Emp updated successfully', FName, LName, Mobile });
  } catch (error) {
      console.error("Error updating employee:", error);
      res.status(400).json({ message: error.message });
  }
};


export const EmpDelete = async (req, res) => {
  const empId = req.params.id;

  try {
      const result = await query('DELETE FROM crud WHERE id = ?', [empId]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Emp not found" });
      }

      res.status(200).json({ message: "Emp deleted successfully!" });
  } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: error.message || "An error occurred" });
  }
};


export const ImageUpload = async (req, res) => {
  console.log("len", req.files.length)
  if (!req.files || req.files.length === 0) {
    return res.status(401).json({ message: "At least one image is required." });
  }
  try {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);    
    const result = await query(
      "INSERT INTO image (Image) VALUES (?,?)",
      [JSON.stringify(imageUrls)]  
    );    
    res.status(201).json({
      message: "Images uploaded successfully!",
      id: result.insertId,
      imageUrls,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};


export const GetImage = async (req, res) => {
  try {
    const result = await query('SELECT * FROM image');

    // Parse the Image field for each row
    const parsedResult = result.map(row => ({
      ...row,
      Image: JSON.parse(row.Image),
    }));

    res.json(parsedResult);
    console.log("Image List:", parsedResult);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ msg: error.message || "An error occurred" });
  }
};


export const ImageEdit = async (req, res) => {
  const { id } = req.params;
  const { image } = req.files || {}; // Get the uploaded file

  try {
    // Fetch the current image entry from the database
    const currentImage = await query("SELECT Image FROM image WHERE id = ?", [id]);

    if (!currentImage || currentImage.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const currentImagePath = JSON.parse(currentImage[0].Image)[0];

    // If a new image is uploaded, replace the file and update the path
    if (image) {
      const newImagePath = `/uploads/${image[0].filename}`;
      
      // Update the database with the new path
      await query("UPDATE image SET Image = ? WHERE id = ?", [JSON.stringify([newImagePath]), id]);

      // Delete the old file
      const fullPath = path.join(path.resolve(), currentImagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      res.status(200).json({ message: "Image updated successfully", newImagePath });
    } else {
      res.status(400).json({ message: "No image file provided" });
    }
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: error.message || "An error occurred" });
  }
};

// Delete an image entry from the database and remove the file
export const ImageDelete = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the current image entry from the database
    const currentImage = await query("SELECT Image FROM image WHERE id = ?", [id]);

    if (!currentImage || currentImage.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const currentImagePath = JSON.parse(currentImage[0].Image)[0];

    // Delete the database entry
    const result = await query("DELETE FROM image WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the file from the file system
    const fullPath = path.join(path.resolve(), currentImagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: error.message || "An error occurred" });
  }
};

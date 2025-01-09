import express from 'express'
import multer from 'multer';
import { Imageupload } from '../controller/controller.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  
  const upload = multer({ storage: storage });


const router =  express.Router()

router.post("/Create",upload.array('image'),Imageupload)

export default router

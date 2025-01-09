import express from 'express'
import multer from 'multer';
import { EmpCreate, EmpDelete, EmpDetail, EmpIndex, EmpUpdate,GetImage,ImageDelete,ImageEdit,ImageUpload } from '../controller/emp.cont.js';

const route = express.Router()

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

route.get('/Index',EmpIndex);

route.post('/Create',EmpCreate)

route.get('/Emp/:id',EmpDetail)

route.delete('/Emp/:id',EmpDelete)

route.patch('/Emp/:id',EmpUpdate)

route.post('/ImgCreate', upload.array('image'), ImageUpload); // 'image' is the name of the form field for the file upload

route.get("/ImgCreate",GetImage)

route.patch('/Img/:id', upload.array('image'), ImageEdit);

route.delete('/Img/:id', ImageDelete);

export default route;


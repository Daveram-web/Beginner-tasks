import express from 'express'
import path from 'path';
import router from './router/router.js';
import cors from 'cors'


const app = express();
const port = 5000;

app.use(cors())
app.use(express.json())


app.use('/Image',router)

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.listen(port , ()=>{
    console.log(`Server is running at http://localhost:${port}`);
    
})
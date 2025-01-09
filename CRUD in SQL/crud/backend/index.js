import express from 'express';
import route from './router/emp.rout.js';
import path from 'path'
import cros from 'cors'

const app = express();
const port = 3001;

app.use(cros())



// Middleware to parse JSON data
app.use(express.json());

// Use routes from emp.rout.js
app.use("/Emp", route);

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));



// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

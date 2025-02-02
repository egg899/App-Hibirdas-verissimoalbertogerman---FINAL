import express from 'express';
import path from 'path';
import multer from 'multer';
import usuariosRoute from './routes/usuariosRoute.js'; // Correct
import guitaristRoute from './routes/guitaristsRoute.js'; // Correct
import albumsRoute from './routes/albumsRoute.js'; // Correct
import comentariosRoute from './routes/comentariosGuitRoute.js'; // Correct

import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';
import fs from 'fs';


import validateBody from './validation.js';
import { fileURLToPath } from 'url';
import { Server as socketIo } from 'socket.io';
import cloudinary from 'cloudinary';

dotenv.config(); // Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});






const app = express();
//const port = 3000;

import http from 'http';
const server = http.createServer(app);
//const io = new socketIo(server);
const io = new socketIo(server, {
  cors: {
     origin: ['http://localhost:5173', 'https://app-hibirdas-verissimoalbertogerman-final.vercel.app'],
    //origin: ['https://app-hibirdas-verissimoalbertogerman-final.vercel.app/'],

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Successfully connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

console.log('MongoDB URI:', process.env.MONGODB_URI);  // Verifica que la URI esté cargada correctamente

mongoose.connect(process.env.MONGODB_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


//Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(validateBody);

//console.log(guitaristRoutes);
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', "index.html"));
// });
app.get('/', (req, res) => {
  res.send("Database de la Base de Datos de Guitarristas");
});
app.use('/usuarios', usuariosRoute);
app.use('/guitarists', guitaristRoute);
app.use('/albums', albumsRoute);
app.use('/comentarios', comentariosRoute);

app.options('/upload', cors());

//Endpoint para eliminar la imagen
app.delete('/delete-image', async (req, res) => {
  const { public_id } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Imagen eliminada exitosamente', result});
  }
  catch (error) {
      console.error('Error al eliminar la imagen de Cloudinary, error');
      res.status(500).json({ error: 'Error al eliminar la imagen' });
  }




})//app. delete

// const uploadsDir = path.join(__dirname, 'uploads');
// console.log('Uploading', uploadsDir);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// // File type validation
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type. Please upload an image.'));
//   }
// }
// const imageUpload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
//   fileFilter,
// })
// console.log('Multer middleware set up for file uploads');
// app.post('/image-upload', imageUpload.single("file"), (req, res) => {
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body); // This might be empty if middleware isn't working
//   console.log('File:', req.file)

//   if (!req.file) {
//     return res.status(400).send({ error: 'No file uploaded' });
//   }

//   res.send('File uploaded successfully!');
// });

// // Error handling middleware for multer
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   } else if (err) {
//     return res.status(400).json({ error: err.message });
//   }
//   next();
// });

// Serve the uploads directory
//app.use('/uploads', express.static(uploadsDir));

export { io };

const usuariosConectados = {};
//socket
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado', socket.id);

 

  socket.on('mensaje', (data) => {
    console.log('mensaje recibido', data);
    io.emit('mensaje', `Servidor: ${data}`);
  });


  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
})

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
   
});





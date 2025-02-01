import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import usuariosModel from "../model/usuariosModel.js";
import { io } from "../index.js";
import mongoose from "mongoose";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();
 //const secretKey = 'SECRETA';
const secretKey = process.env.SECRET_KEY;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });






//Mostrar todos los usuarios
export const agarrarTodosLosUsuarios = async (req, res) => {
    try {
        const { sort, order = 'asc', page = 1, limit = 10 } = req.query; // default limit to 10

        const validSortFields = ['name', 'email', 'username', 'role']; // Define valid sort fields
        const validOrder = ['asc', 'desc'];

        // Validate sort and order
        if (sort && !validSortFields.includes(sort)) {
            return res.status(400).json({ error: 'Invalid sort field' });
        }
        if (order && !validOrder.includes(order)) {
            return res.status(400).json({ error: 'Invalid order' });
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Validate pagination values
        if (isNaN(pageNumber) || pageNumber <= 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }

        if (isNaN(limitNumber) || limitNumber <= 0) {
            return res.status(400).json({ error: 'Invalid limit' });
        }

        const queryOptions = {};
        
        // Set the sorting order
        if (sort) {
            queryOptions.sort = { [sort]: order === 'asc' ? 1 : -1 }; // 1 for ascending, -1 for descending
        }

        // Fetch the users with pagination and sorting
        const usuarios = await usuariosModel.find()
            .sort(queryOptions.sort)
            .skip((pageNumber - 1) * limitNumber) // Pagination
            .limit(limitNumber); // Convert limit to number

        // Get the total count of users for pagination info
        const totalCount = await usuariosModel.countDocuments();

        // Send response with data and total count for pagination
        res.json({ totalCount, usuarios });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get user by ID
export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params; // Extract the id from URL parameters

    // Validate if the ID is provided and is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido o no proporcionado" });
    }

    try {
        // Search for the user by ID in the MongoDB database
        const user = await usuariosModel.findById(id);

        // If no user is found, return a 404 status
        if (!user) {
            return res.status(404).json({ mensaje: "No se encontró el usuario con ese ID" });
        }

        // Respond with the user data
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            image: user.image,
            role: user.role,
            //password: user.password // Hide the password for security reasons
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send("Error al buscar el usuario por ID");
    }
};


//Boarrar Usuario
const deleteUsuarioById = async (_id) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    const deletedUser = await usuariosModel.findOneAndDelete({_id: objectId});
    return deletedUser;
}//deleteUsuarioById

export const eliminarUsuario = async (req, res) => {
    const userId = req.params.id;

    try{
        const deletedUser = await deleteUsuarioById(userId);
        if(!deletedUser) {
            return res.status(404).json({ error: "No se encontró el usuario con ese ID" });
        }
        res.json(deletedUser);
    }
    catch (error) {
        return res.status(500).json({error:error.message});
    }
}//eliminar Usuario

// Get user by name
export const obtenerUsuarioPorNombre = async (req, res) => {
    const { name } = req.params; // Extract name from URL parameters

    if (!name) {
        return res.status(400).send("El nombre es requerido");
    }

    try {
        // Search for the user by name in the MongoDB database
        const user = await usuariosModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (!user) {
            return res.status(404).send({ mensaje: "No se encontró el usuario con ese nombre" });
        }

        // Send the user data as a response
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            image:user.image,
            //password: user.password // Hide the password for security reasons
        });
    } catch (error) {
        console.error("Error fetching user by name:", error);
        res.status(500).send("Error al buscar el usuario por nombre");
    }
};





//Adherir Usuarios
const adherirUsuario = async (newUser) => {
    const existingUser = await usuariosModel.findOne({
        $or: [{ username: newUser.username }, { email: newUser.email }]
    });

    if (existingUser) {
        if (existingUser.username === newUser.username && existingUser.email === newUser.email) {
            throw new Error("El nombre de usuario y el email ya están en uso.");
        } else if (existingUser.username === newUser.username) {
            throw new Error("El nombre de usuario ya está en uso.");
        } else {
            throw new Error("El email ya está en uso.");
        }
    }

    const newPassword = await bcrypt.hash(newUser.password, 10);

    const orderedUsuarios = new usuariosModel({
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: newPassword,
        role: newUser.role,
        image: newUser.image
    });

    try {
        const savedUser = await orderedUsuarios.save();
        return savedUser;
    } catch (err) {
        console.error("Error guardando el usuario en la base de datos", err);
        throw new Error("Error al guardar el usuario en la base de datos");
    }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..','..' ,'client','src','assets', 'images','uploads');

console.log('Uploading', uploadsDir);


//Configuración de Multer para manejar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Ruta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname); // Asegura que el nombre del archivo sea único
        cb(null, fileName);
    }
});

const imageUpload = multer({ storage: storage })



//Funcion para subir la imagen a Cloudinary
// const uploadToCloudinary = (filePath) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.v2.uploader.upload(filePath, (error, result) => {
//             if (error) {
//                 console.error("Error al subir la imagen:", error);
//                 reject(error);  // Rechaza la promesa en caso de error
//             } else {
//                 console.log("Resultado de Cloudinary:", result);  // Verifica la respuesta
//                 resolve(result.secure_url);  // Devuelve la URL segura de la imagen
//             }
//         });
//     });
// };


export const agregarUsuarios = async (req, res) => {
    const { name, username, email, role, password, imageUrl } = req.body; // Ahora la imagen llega como URL

    if (!name) return res.status(400).send("El nombre es requerido");
    if (!username) return res.status(400).send("El nombre de usuario es requerido");
    if (!email) return res.status(400).send("El email es requerido");
    if (!role) return res.status(400).send("El rol es requerido");
    if (!password) return res.status(400).send("El password es requerido");

    // Si no hay imagen, usa una por defecto
    const profileImage = imageUrl || 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738173415/default-profile_yrvw0s.jpg';

    const newUser = { name, username, email, role, password, image: profileImage };

    try {
        const addedUser = await adherirUsuario(newUser);
        res.json(addedUser);
    } catch (err) {
        if (err.message === "El usuario ya existe") {
            return res.status(400).send(err.message);
        }
        //return res.status(500).send("Error adheriendo al usuario");
    }
};





// //Actualizar el Usuario
// const updateUserById = async (_id, name, username, email, role, image, password) => {
//     try {
//         const objectId = new mongoose.Types.ObjectId(_id);


//          const usuario = await usuariosModel.findById(objectId);
//          console.log('La imagen chabon', image);
//          console.log('Este es el usuario chabon: ', usuario);

//         // if(image && image !== 'default-profile.jpg' && image !== usuario.image) {
//         //     const imagePath = path.join(__dirname, '..', '..', 'client', 'src', 'assets', 'images', 'uploads', usuario.image);
        
//         //     if(fs.existsSync(imagePath)) {
//         //         fs.unlinkSync(imagePath); // Delete the previous image file
//         //         console.log('Esta es la imagen anterior eliminada: ', usuario.image);
//         //     }
//         // }
         




//         const updateFields = { name, username, email, role };
//         if (password) {
//             updateFields.password = await bcrypt.hash(password, 10);
//         }

//        if(image ) {
//         updateFields.image = image; // Update the image field if provided in the request body. The image field is optional.
//        } else {
//         // Retain the existing image if no new image is provided
//         const user = await usuariosModel.findById(objectId);
//         if (user && user.image) {
//             updateFields.image = user.image;
//         }
//        }
//         const updatedUser = await usuariosModel.findOneAndUpdate(
//             { _id: objectId },
//             updateFields,
//             { new: true }
//         );

//         return updatedUser;
//     }
//     catch (error) {
//         throw new Error(`Error al actualizar  el usuario: ${error.message}`);
//     }



// }//udatedUserById

// export const actualizarUsuario = async ( req, res ) => {
//     const userId = req.params.id;
//     const { name, username, email, role, image, password } = req.body;
    
//     //Verificar si se subio la imagen
//     const profileImage = req.file ? req.file.filename : 'default-profile.jpg';
   

//     if (!name || !username || !email || !role) {
//         return res.status(400).json({ error: "Todos los campos son requeridos." });
//     }

//     try {
//         const updatedUser = await updateUserById(userId, name, username, email, role, image, password);
        
//         if (!updatedUser) {image
//             return res.status(404).send({ mensaje: "No se encontró el usuario con el id especificado" });
//         }

//         res.json(updatedUser);

//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }

// }//actualizarUsuario



const updateUserById = async (_id, name, username, email, role, image, password) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id);

        const usuario = await usuariosModel.findById(objectId);
        console.log('La imagen chabon', image);
        console.log('Este es el usuario chabon: ', usuario);

        // Si la imagen se ha proporcionado, actualiza el campo de imagen.
        const updateFields = { name, username, email, role };
        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        // Actualiza la imagen solo si se proporciona una nueva imagen.
        if (image && image !== 'default-profile.jpg') {
            updateFields.image = image;
        } else {
            // Si no se proporciona una nueva imagen, conserva la imagen actual
            if (usuario.image && usuario.image !== 'default-profile.jpg') {
                updateFields.image = usuario.image;
            }
        }

        // Realiza la actualización en la base de datos
        const updatedUser = await usuariosModel.findOneAndUpdate(
            { _id: objectId },
            updateFields,
            { new: true }
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};

export const actualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    const { name, username, email, role, image, password} = req.body;

    if (!name || !username || !email || !role) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
        // Llamada a la función para actualizar el usuario
        const updatedUser = await updateUserById(userId, name, username, email, role, image, password);
        
        if (!updatedUser) {
            return res.status(404).send({ mensaje: "No se encontró el usuario con el id especificado" });
        }

        res.json(updatedUser);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//Exporta el middleWare de Multer para la subida de la imagen
export const uploadProfileImage = imageUpload.single('profileImage');

//Login user
export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send("El email es requerido");
    }
    if (!password) {
        return res.status(400).send("El password es requerido");
    }

    try {
        // Find user by email in the MongoDB database
        const user = await usuariosModel.findOne({ email });
        io.emit('userLoggedIn', { ...user._doc });

        if (!user) {
            return res.status(404).send({ mensaje: "No se encontró el usuario" });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ mensaje: "El password es incorrecto" });
        }

        // Generate a JWT token
        const jwtToken = jwt.sign(
            {usuario:{ _id: user._id, email: user.email, role:user.role, name: user.name, username:user.username }}
            , secretKey, { expiresIn: process.env.EXPIRATION || "30s" });
            console.log("Generated JWT Token:", jwtToken);
            // console.log('expiration', process.env.EXPIRATION);
        res.json({ 
            usuario: {
                _id: user._id, 
                name:user.name,
                username: user.username,
                email: user.email,
                role: user.role
            },
            jwtToken
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error al iniciar sesión");
    }
};
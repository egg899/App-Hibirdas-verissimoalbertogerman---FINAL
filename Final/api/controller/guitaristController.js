import guitaristsModel from "../model/guitaristsModel.js";
import albumsModel from "../model/albumsModel.js";
import mongoose from "mongoose";
import { io } from "../index.js"; 
import { agregarAlbum } from "./albumController.js";

import multer from "multer";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from "url";


//todos los guitarristas
const todosLosGuitarristas = async (req) => {
    const { name, sort, page = 1, limit = null } = req.query; // Set default limit to 10 if not specified

    // Convert limit to a number
    const limitNumber = Math.max(parseInt(limit, 10), 1); // At least 1
    const pageNumber = Math.max(parseInt(page, 10), 1);   // At least 1

    const sortOption = sort === "asc" ? { name: 1 } : sort === "desc" ? { name: -1 } : {};

    


    const searchFilter = name
     ? { name: { $regex: new RegExp(name, "i") } }
     :{}
    // Fetch the guitarists from the database

    // Build the query options
    const queryOptions = {
        limit: limitNumber,
        skip: (pageNumber - 1) * limitNumber,
        sort: sortOption
    };

    const guitarists = await guitaristsModel.find(searchFilter, null, queryOptions);


    return guitarists; // Return the paginated and sorted guitarists
};


export const agarrarTodosLosGuitarristas = async (req, res) => {
    try {
        const guitarristas = await todosLosGuitarristas(req); // Await the async function
        res.json(guitarristas); // Return the guitarists as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

//guitarrista por ID
const guitarristasById = async (_id) => {
    try {
        // Convert _id to ObjectId explicitly
        const objectId = new mongoose.Types.ObjectId(_id);
        return await guitaristsModel.findOne({ _id: objectId }).populate('albums');
    } catch (error) {
        console.error("Error al convertir ObjectId", error);
        throw new Error("Formato ObjectId invalido");
    }
}

export const agarrarGuitarristaPorId = async (req, res) => {
    const guitarristaId = req.params.id;
    
    

    try {
        // Try to fetch the guitarist by ID
        const guitarrista = await guitarristasById(guitarristaId);

        if (guitarrista) {
            res.json(guitarrista);  // Return the guitarist if found
        } else {
            res.status(404).json({ error: "Guitarrista no encontrado" });
        }

    } catch (error) {
        console.error("Error fetching guitarist:", error);
        res.status(500).json({ error: error.message });
    }
}
//Encontrar guitarrista por Nombre

const guitarristasByName = async (name) => {
    // Normalize the name (lowercase, no spaces) for the search
    const normalizedGuitarist = name.toLowerCase().replace(/\s+/g, ' ');

    // Use a MongoDB regular expression search to find matching guitarists
    const matchingGuitarist = await guitaristsModel.find({
        name: { 
            $regex: new RegExp(normalizedGuitarist, 'i') // Case-insensitive search
        }
    });

    return matchingGuitarist;
};

export const agarrarGuitarristaPorNombre = async (req, res) => {
    try {
        const guitarristasNombre = await guitarristasByName(req.params.nombre);

        if(guitarristasNombre && guitarristasNombre.length > 0){
            res.json(guitarristasNombre);
        } else {
            return res.status(404).send("No hay guitarrista con ese nombre");
        }


    } catch(error){
        return res.status(500).json({error: error.message});
    }
}


export const devolverGuitarristaId = async (req, res) => {
    try {
        const guitarristasNombre = await guitarristasByName(req.params.nombre);

        if(guitarristasNombre && guitarristasNombre.length > 0){
            res.json(guitarristasNombre[0]._id);
        } else {
            return res.status(404).send("No hay guitarrista con ese nombre");
        }


    } catch(error){
        return res.status(500).json({error: error.message});
    }
}

//ActualizarGuitarrista
// const updatedGuitarristasById = async (id, name) => {
//     // Find the guitarist by ID and update their name
//     const updatedGuitarist = await guitaristsModel.findOneAndUpdate(
//         { id }, // Search condition
//         { name }, // Update data
//         { new: true } // Return the updated document
//     );

//     return updatedGuitarist; // Return the updated guitarist
// };

// const updatedGuitarristasById = async (_id, name, style, albums, description, imageUrl) => {
//     try {
//         const objectId = new mongoose.Types.ObjectId(_id); // Convertir el ID a ObjectId
//         const updatedGuitarist = await guitaristsModel.findOneAndUpdate(
//             { _id: objectId }, // Condición de búsqueda
//             { name, style, 
//             albums,
//             description, 
//             imageUrl }, // Datos a actualizar
            
//             { new: true } // Devuelve el documento actualizado
//         );
//         return updatedGuitarist;
//     } catch (error) {
//         throw new Error("Error al actualizar el guitarrista: " + error.message);
//     }
// };


// export const actualizarGuitarrista = async (req, res) => {
//     const guitarristaId = req.params.id; // El ID ya es una cadena
//     const { name, style, albums, description, imageUrl } = req.body; // Extrae el campo 'name' del cuerpo de la solicitud

//     if (!name) {
//         return res.status(400).json({ error: "El campo 'name' es requerido" });
//     }

//     try {
//         const updatedGuitarrista = await updatedGuitarristasById(guitarristaId, name, style, albums || [], description, imageUrl);
//         if (!updatedGuitarrista) {
//             return res.status(404).send("El guitarrista no fue encontrado"); // Devuelve 404 si no se encuentra
//         }
//         res.json(updatedGuitarrista);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const guitaristsDir = path.join(__dirname, '..','..' ,'client','src','assets', 'images','guitarists' );




//Borrar guitarrista
const deleteGuitarristasById = async (_id) => {
    const objectId = new mongoose.Types.ObjectId(_id);

    const guitarist = await guitaristsModel.findById(objectId);
    console.log('Imagen de guitarrista a borrar: ',guitarist.image);
    const imagePath = path.join(__dirname, '..', '..', 'client', 'src', 'assets', 'images', 'guitarists', guitarist.image);
    // Verificar que la imagen actual existe antes de intentar eliminarla
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Eliminar el archivo de la imagen anterior
        console.log('Imagen anterior eliminada: ', guitarist.image);
    }
    const deletedGuitarist = await guitaristsModel.findOneAndDelete({ _id: objectId});
    return deletedGuitarist;
}

const deleteAlbumsByArtistId = async(artistId) => {

    //Obtener los albumes asociados al artista
    const albums = await albumsModel.find({artist: artistId});

    console.log('Albumes loKita!!!!: ', albums);

    //Recorrer cada album y eliminar su imagen
    for (const album of albums){
        if(album.image && album.image !== "default-profile") {
            const imagePath = path.join(__dirname, '..', '..', 'client', 'src', 'assets', 'images', 'albums', album.image);

            console.log('Ruta de la imagen del album a eliminar: ', imagePath);


            //Verificar si la imagen existe antes de eliminiarla
            if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar el archivo de la imagen anterior
                console.log('Imagen del album eliminada: ', album.image);
            }
        }



    } //For albums


    await albumsModel.deleteMany({artist:artistId});
}

export const eliminarGuitarrista = async (req, res) => {
    const guitarristaId = req.params.id;

    try{
        //Primero borrar los albumes asociados al guitarrista
        await deleteAlbumsByArtistId(guitarristaId);


        const deletedGuitarrista = await deleteGuitarristasById(guitarristaId);

         // Emit the event for real-time update
         io.emit("guitaristDeleted", { id: guitarristaId });
         res.status(200).json({ message: "Guitarrista eliminado con éxito", id: guitarristaId });

        if(!deletedGuitarrista) { 
            return res.status(404).send("El guitarrista no fue encontrado");
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const guitaristsDir = path.join(__dirname, '..','..' ,'client','src','assets', 'images','guitarists' );

console.log('Guitarists uploaded ', guitaristsDir);

//Configuracion de Multer para manejar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, guitaristsDir); // Ruta donde se guardaran las imagenes de los guitaristas

    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname); // Asegura que el nombre del archivo sea único
        cb(null, filename);
    }
});

const guitImageUpload = multer({ storage: storage });

//Agregar Guitarrista
export const agregarGuitarrista = async (req, res) => {
    let { name, description, albums, style, owner, imageUrl } = req.body;

    // const guitaristImage = req.file ? req.file.filename : 'default-profile.jpg';
    // console.log('req.file: ', req.file);
     
    // Verifica si la URL de la imagen está presente, si no, asigna una imagen por defecto
    const guitaristImage = imageUrl ||  'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738173415/default-profile_yrvw0s.jpg';
    console.log('Imagen URL recibida: ', guitaristImage);

    // Validate required fields
    if (!name || !description ||  !style || !albums || !owner?.userId || !owner?.username) {
        return res.status(400).json({
            error: "All fields (name, description, style, albums, owner.userId, owner.username) are required."
        });
    }

    // Handle style (split if it's a string of multiple styles)
    if (typeof style === "string") {
        style = style.split(",").map(s => s.trim()); // Split by comma and trim spaces
    }

    // Handle albums (split if it's a string of multiple albums)
    if (typeof albums === "string") {
        albums = albums.split(",").map(s => s.trim()); // Split by comma and trim spaces
    }

    try {
        // Check if the guitarist already exists
        const existingGuitarist = await guitaristsModel.findOne({ name });
        if(existingGuitarist){
            return res.status(400).send("El guitarrista ya existe");
        }

       
        // Create a new guitarist with the album references
        const newGuitarist = new guitaristsModel({
            name,
            description,
            
            image:guitaristImage,
            style,
            albums, // Store the album ObjectIds
            owner
        });

        // Save the guitarist to the database
        const savedGuitarist = await newGuitarist.save();
        res.json(savedGuitarist);
        
    } catch(error){
        res.status(500).json({ error: error.message });
    }
}

//Actualizar Guitarrista
const updatedGuitarristasById = async (_id, name, style, albums, description, image) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id); // Convertir el ID a ObjectId
        
        const updateFields = { name, style, albums, description };


        //Obtener el guitarrista actual
        const guitarist = await guitaristsModel.findById(objectId);
        console.log('Este es el guitarrista viejita: ', guitarist);
       // Si se proporciona una nueva imagen que es diferente de la actual y no es la predeterminada, eliminar la anterior
       if (image && image !== "default-profile.jpg" && image !== guitarist.image) {
        const imagePath = path.join(__dirname, '..', '..', 'client', 'src', 'assets', 'images', 'guitarists', guitarist.image);
        
        console.log('Ruta de la imagen a eliminar: ', imagePath);

        // Verificar que la imagen actual existe antes de intentar eliminarla
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Eliminar el archivo de la imagen anterior
            console.log('Imagen anterior eliminada: ', guitarist.image);
        }
    }


            if(image && image !== "default-profile.jpg") {
                updateFields.image = image; // Si la imagen es distinta de la predeterminada, la agrega al updateFields
            } else {
               //const guitarist = await guitaristsModel.findById(objectId);
               if(guitarist && guitarist.image) {
                updateFields.image = guitarist.image;
               }
            }

            const updatedGuitarist = await guitaristsModel.findOneAndUpdate(
                { _id: objectId }, // Condición de búsqueda
                updateFields, // Datos a actualizar
                { new: true } // Devuelve el documento actualizado
            );
        
            return updatedGuitarist;

        } catch (error) {
            throw new Error("Error al actualizar el guitarrista: " + error.message);
        }
};


export const actualizarGuitarrista = async (req, res) => {
    const guitarristaId = req.params.id;
    const { name, style, albums, description, image } = req.body; // Recibimos la URL de la nueva imagen

    if (!name) {
        return res.status(400).json({ error: "El campo 'name' es requerido" });
    }

    const albumsArray = albums ? albums.split(',').map(album => album.trim()) : [];

    try {
        // Aquí solo actualizamos los campos del guitarrista, incluyendo la URL de la imagen
        const updatedGuitarrista = await updatedGuitarristasById(guitarristaId, name, style, albumsArray, description, image);
        if (!updatedGuitarrista) {
            return res.status(404).send("El guitarrista no fue encontrado");
        }
        res.json(updatedGuitarrista);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const uploadGuitaristImage = guitImageUpload.single('guitaristImage');

import albumsModel from "../model/albumsModel.js";
import mongoose from "mongoose";
import guitaristsModel from "../model/guitaristsModel.js"; // Import the guitarist model
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Todos los albums
export const agarrarTodosLosAlbums = async (req, res) => {
    try {
        const { title, sort, order = 'asc', page = 1, limit = null } = req.query; // default limit to null

        const queryOptions = {};
        
        // Set the sorting order
        if (sort) {
            queryOptions.sort = { [sort]: order === 'asc' ? 1 : -1 }; // 1 for ascending, -1 for descending
        }

        // Create the search filter
        const searchFilter = title 
            ? { title: { $regex: new RegExp(title, "i") } } 
            : {};

        // Fetch the albums with pagination, sorting, and filtering
        const albums = await albumsModel.find(searchFilter) // Apply the filter here
            .populate('artist')
            .sort(queryOptions.sort)
            .skip((page - 1) * (limit ? Number(limit) : 0)) // Pagination (skip 0 if limit is null)
            .limit(limit ? Number(limit) : 0); // Convert limit to number, default to no limit if null

        res.json(albums);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//Agarrar album por ID
// const albumById = async (id) => {
//     return await albumsModel.findOne({ id });
// }

const albumById = async (_id) => {
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid ObjectId format");
    }

    try {
        const album = await albumsModel.findById(_id); // Using findById directly
        if (!album) {
            throw new Error("Album not found");
        }

        return album; // Return the album if found
    } catch (error) {
        console.error("Error fetching album:", error.message);
        throw error; // Re-throw the error so it can be handled in the route handler
    }
};


export const agarrarAlbumPorId = async (req, res) => {
    const albumId = req.params.id;

    try {
        const album = await albumById(albumId);

        // If album is null, return 404 response with error message
        if (!album) {
            return res.status(404).json({ error: "Album no encontrado" });
        }

        // If album is found, send it as a response
        res.json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Agarrar album por Artista
const albumByGuitarist = async (artistName) => {
    try {
        const normalizedGuitarist = artistName.toLowerCase().replace(/\s+/g, ' ');

        // Log the normalized name for debugging
        console.log("Normalized Guitarist Name:", normalizedGuitarist);

        // Use a MongoDB regular expression search to find a single matching guitarist
        const matchingGuitarist = await guitaristsModel.findOne({
            name: { 
                $regex: new RegExp(normalizedGuitarist, 'i') // Case-insensitive search
            }
        });

        // Log the result to see what is being returned
        console.log("Matching Guitarist:", matchingGuitarist);

        if (!matchingGuitarist) {
            throw new Error('El artista no se ha encontrado');
        }

       const albums = await albumsModel.find({artist:matchingGuitarist._id});
       return albums;

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error:", error.message);
        throw new Error(error.message);
    }
};


export const agarrarAlbumsPorGuitarrista = async(req, res) => {
    try{
        const albums = await albumByGuitarist(req.params.artista);
            if(albums && albums.length > 0){
                res.json(albums);
                } else {
                    return res.status(404).json({message: 'Los albumes con ese artista no se ha encontrado'});
            }
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
};

//Agarrar Album por nombre
const albumByName = async (name) => {
    // Normalize the name (lowercase, no spaces) for the search
    const normalizedAlbum = name.toLowerCase().replace(/\s+/g, ' ');

    // Use a MongoDB regular expression search to find matching guitarists
    const matchingAlbum = await albumsModel.find({
        title: { 
            $regex: new RegExp(normalizedAlbum, 'i') // Case-insensitive search
        }
    });

    return matchingAlbum;
};

export const agarrarAlbumPorNombre = async (req, res) => {
    console.log(req.params.titulo);
    try {
        const albumNombre = await albumByName(req.params.titulo);
       
        if(albumNombre && albumNombre.length > 0){
            res.json(albumNombre);
        } else {
            console.log('albumNombre', albumNombre);

            return res.status(404).send("No hay Album con ese nombre");
        }


    } catch(error){
        return res.status(500).json({error: error.message});
    }
}



//ActualizarAlbum por Id
const updatedAlbumById = async (_id, title, artist, year, description, imageUrl) => {
    // Validate ObjectId before updating
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid album ID format");
    }

    // Validate the artist ID format
    if (!mongoose.Types.ObjectId.isValid(artist)) {
        throw new Error("Invalid artist ID format");
    }

    // Optionally, you could check if the artist exists
    // const artistExists = await guitaristsModel.findById(artist);
    // if (!artistExists) {
    //     throw new Error("Artist does not exist");
    // }

    // Perform the album update using `findOneAndUpdate`
    const updatedAlbum = await albumsModel.findOneAndUpdate(
        { _id: _id }, // The condition to match the album
        { title, artist, year, description, imageUrl }, // The fields to update
        { new: true } // Return the updated document
    );

    return updatedAlbum; // Return the updated album
};

export const actualizarAlbum = async (req, res) => {
    const albumId = req.params.id;
    const { title, artist, year, description, imageUrl } = req.body;

    // Validate that the albumId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        return res.status(400).send("Invalid album ID format");
    }

    // Validate that the artist ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).send("Invalid artist ID format");
    }

    // Validate required fields are provided
    if (!title || !description || !year || !imageUrl) {
        return res.status(400).send("All fields (title, description, year, imageUrl) are required");
    }

    try {
        // Update the album by ID
        const updatedAlbum = await updatedAlbumById(albumId, title, artist, year, description, imageUrl);

        // If the album is not found, return 404
        if (!updatedAlbum) {
            return res.status(404).send("Album not found");
        }

        // Return the updated album
        res.json(updatedAlbum);
    } catch (error) {
        console.error("Error updating album:", error.message);  // Log the error on the server side for debugging
        return res.status(500).json({ error: error.message });
    }
};




//Borrar Album
const deleteAlbumById = async (_id) => {
    const deletedAlbum = await albumsModel.findOneAndDelete({ _id });
    return deletedAlbum;
}

export const eliminarAlbum = async (req, res) => {
    const albumId = req.params.id;

    try{
        const deletedAlbum = await deleteAlbumById(albumId);
        if(!deletedAlbum) { 
            return res.status(404).send("El album no fue encontrado");
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const albumsDir = path.join(__dirname, '..','..' ,'client','src','assets', 'images','albums' );

//configuracion de Multer para manejar las imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, albumsDir);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const albumImageUpload = multer({ storage: storage});



//Agregar Album
export const agregarAlbum = async (req, res) => {
    const { title, artist, year, description,  owner } = req.body;
    const albumImage = req.file ? req.file.filename :  'default-profile.jpg';
    console.log('La imagen nene: ', albumImage);
    console.log(req.file);
    // Check for required fields
    if (!title) {
        return res.status(400).send("El nombre es requerido.");
    }
    if (!owner || !owner.userId || !owner.username) {
        return res.status(400).send("El propietario (owner) es requerido y debe incluir userId y username.");
    }

    try {
        // Check if the album already exists
        const existingAlbum = await albumsModel.findOne({ title });
        if (existingAlbum) {
            return res.status(400).send("El album ya existe");
        }

        // Create the new album
        const newAlbum = new albumsModel({
            title,
            artist,
            year,
            description,
            ///imageUrl,
            image:albumImage,
            owner, // Include the owner field
        });

        // Save the album to the database
        const savedAlbum = await newAlbum.save();

        // Respond with the saved album
        res.json(savedAlbum);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const upoladAlbumImage = albumImageUpload.single('albumImage');
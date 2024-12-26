import guitaristsModel from "../model/guitaristsModel.js";
import albumsModel from "../model/albumsModel.js";
import mongoose from "mongoose";
import { agregarAlbum } from "./albumController.js";
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

const updatedGuitarristasById = async (_id, name, style, albums, description, imageUrl) => {
    try {
        const objectId = new mongoose.Types.ObjectId(_id); // Convertir el ID a ObjectId
        const updatedGuitarist = await guitaristsModel.findOneAndUpdate(
            { _id: objectId }, // Condición de búsqueda
            { name, style, 
            albums,
            description, 
            imageUrl }, // Datos a actualizar
            
            { new: true } // Devuelve el documento actualizado
        );
        return updatedGuitarist;
    } catch (error) {
        throw new Error("Error al actualizar el guitarrista: " + error.message);
    }
};


export const actualizarGuitarrista = async (req, res) => {
    const guitarristaId = req.params.id; // El ID ya es una cadena
    const { name, style, albums, description, imageUrl } = req.body; // Extrae el campo 'name' del cuerpo de la solicitud

    if (!name) {
        return res.status(400).json({ error: "El campo 'name' es requerido" });
    }

    try {
        const updatedGuitarrista = await updatedGuitarristasById(guitarristaId, name, style, albums || [], description, imageUrl);
        if (!updatedGuitarrista) {
            return res.status(404).send("El guitarrista no fue encontrado"); // Devuelve 404 si no se encuentra
        }
        res.json(updatedGuitarrista);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Borrar guitarrista
const deleteGuitarristasById = async (_id) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    const deletedGuitarist = await guitaristsModel.findOneAndDelete({ _id: objectId});
    return deletedGuitarist;
}

const deleteAlbumsByArtistId = async(artistId) => {
    await albumsModel.deleteMany({artist:artistId});
}

export const eliminarGuitarrista = async (req, res) => {
    const guitarristaId = req.params.id;

    try{
        //Primero borrar los albumes asociados al guitarrista
        await deleteAlbumsByArtistId(guitarristaId);


        const deletedGuitarrista = await deleteGuitarristasById(guitarristaId);
        if(!deletedGuitarrista) { 
            return res.status(404).send("El guitarrista no fue encontrado");
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

//Agregar Guitarrista



//Agregar Guitarrista
export const agregarGuitarrista = async (req, res) => {
    let { name, description, imageUrl, albums, style, owner } = req.body;

    // Validate required fields
    if (!name || !description || !imageUrl || !style || !albums || !owner?.userId || !owner?.username) {
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
            imageUrl,
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




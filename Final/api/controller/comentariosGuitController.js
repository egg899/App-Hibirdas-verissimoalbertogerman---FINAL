import comentariosGuitModel from "../model/comentariosGuitModel.js";
import mongoose from "mongoose";


const todosLosComentarios = async (req) => {

    const comentarios = await comentariosGuitModel.find();
    return comentarios; // Return comentarios
};




export const agarrarTodosLosComentarios = async (req, res) => {
    try {
        const comentarios = await todosLosComentarios(req); // Await the async function
        res.json(comentarios); // Return the guitarists as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};


const GuitarristaCommentsByGuitaristId = async (guitarist) => {
    try {
        const objectId = new mongoose.Types.ObjectId(guitarist); // Convert to ObjectId
        // Find all comments for the guitarist and populate the user field
        return await comentariosGuitModel.find({ guitarist: objectId }).populate('user');;
    } catch (error) {
        console.error("Error al convertir ObjectId", error);
        throw new Error("Formato ObjectId inválido");
    }
};

export const agarrarGuitarristaCommentsById = async (req, res) => {
    const guitaristId = req.params.guitarristaId; // Extract the guitarist ID from params

    try {
        const guitaristComments = await GuitarristaCommentsByGuitaristId(guitaristId);
        if (!guitaristComments || guitaristComments.length === 0) {
            return res.status(404).json({ message: "No comments found for this guitarist" });
        }
        res.json(guitaristComments); // Return all comments as JSON
    } catch (error) {
        console.error("Error fetching comments by guitarist ID:", error.message);
        res.status(500).json({ error: error.message });
    }
};




//Adheriendo comentarios
export const adherirComentarios = async (req, res) => {
    const { content, user, guitarist, timestamp } = req.body;

    // Validate required fields
    if (!content || !user || !guitarist) {
        return res.status(400).json({ error: "All fields (content, user, guitarist) are required" });
    }

    try {
        // Create a new comment
        const newComment = new comentariosGuitModel({
            content,
            user,
            guitarist,
            timestamp: timestamp || Date.now(), // Default to the current timestamp
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        // Send success response and immediately return
        return res.status(201).json({ message: "Comment added successfully", comment: savedComment });
    } catch (error) {
        // Catch and handle any errors, ensuring only one response is sent
        console.error("Error adding comment:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
 //adherirComentarios
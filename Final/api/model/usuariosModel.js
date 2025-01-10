import mongoose, { Schema } from "mongoose";

const usuariosSchema = new mongoose.Schema({
    //id:{type:Number, required:true},
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'contributor'], // Limita los valores de role a 'admin' o 'user'
        default: 'user' // El rol por defecto es 'user'
    },
   password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: 'default-profile.jpg'
    }
})


export default mongoose.model("users", usuariosSchema);
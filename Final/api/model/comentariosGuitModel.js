import mongoose, {Schema} from 'mongoose';


const comentariosSchema = new mongoose.Schema({
    content: {type: String, required: true},
    user: {type:Schema.Types.ObjectId, ref: 'users', required: true},
    guitarist: {type:Schema.Types.ObjectId, ref:'guitarists', required: true},
    timestamp: {type: Date, default: Date.now},
});

export default mongoose.model("comentarios", comentariosSchema);
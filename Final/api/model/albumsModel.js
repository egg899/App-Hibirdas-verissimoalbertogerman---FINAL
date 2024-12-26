import mongoose, { Schema } from "mongoose";

const albumsSchema = new mongoose.Schema({
    // id:{type:Number, required:true},
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'guitarists',
        required: false
    },
    //artist: { type: String, required: true },
    year: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
   
    imageUrl: {
        type: String,
        required: true
    },
    owner:{
        userId: {
            type: String,
            //type: mongoose.Schema.Types.ObjectId, ref: 'user',            required: true
          },
          username: {
            type: String,
            required: true
          }
    }
})

export default mongoose.model("albums", albumsSchema);
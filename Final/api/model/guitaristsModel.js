import mongoose, { Schema } from "mongoose";
import albumsModel from './albumsModel.js';

const guitaristsSchema = new mongoose.Schema({
    // id:{type:Number, required:true},
    name:{type:String, required:true},
  //   imageUrl: {
  //     type: String,
  //     required: true
  // },
  image: {
    type: String,
    required: true,
    default: 'default-profile.jpg'
  },
    description:{type:String, required:true},
    style:{type:[String], required:true},
   albums:{type:[String], required:false},
  //   albums: [{ 
  //     type: Schema.Types.ObjectId,
  //     ref: "albums"  // Reference to the albums collection
  // }],

    owner:{
        userId: {
            type: String,
            // type: mongoose.Schema.Types.ObjectId,
            required: true
          },
          username: {
            type: String,
            required: true
          }
    }


});



export default mongoose.model("guitarists", guitaristsSchema);



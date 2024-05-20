import mongoose from "mongoose";

const petSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
         type: String,
        required: true,
    },
    petName: {
        type: String,
        required: true,
    },
    petAge: {
        type: String,
        required: true,
    },
    petGender: {
        type: String,
        required: true,
    },
    petSize: { 
        type: String,
        required: true,
    },
    petDescription: String,
    picturePath: String,
    isAdopted: Boolean,
},
{ timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
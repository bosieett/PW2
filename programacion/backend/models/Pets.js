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
    petname: {
        type: String,
        required: true,
    },
    picturePath: String,
    isAdopted: Boolean,
},
{ timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
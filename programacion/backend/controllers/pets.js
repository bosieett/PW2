import Pet from "../models/Pets.js";
import User from "../models/User.js";

/* REGISTER PET */
export const petRegister = async (req, res) =>{
    try{
        const {
            userId,
            petName,
            petAge,
            petSize,
            petGender,
            petDescription,
            picturePath
        } = req.body;
        
        const user = await User.findById(userId);

        const newPet = new Pet(
            {
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                petName,
                petAge,
                petSize,
                petGender,
                petDescription,
                picturePath
            }
        );
        const savedPet = await newPet.save();
        res.status(201).json(savedPet);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

/* READ */
export const getUserPets = async (req, res) =>{
    try {
        const {id} = req.params;
        const pets = await Pet.find({userId: id, activo: true}).sort({createdAt: -1});
        res.status(200).json(pets);
    } catch (err) {
        res.status(404).json({message:err.message});
    }
}

/* UPDATE */
export const setAdopted = async(req, res) => {
    try {
        const {id} = req.params;
        const pet = await Pet.findById(id);
        
        pet.isAdopted=true;

        await pet.save();

        const pets = await Pet.find({ userId: pet.userId, activo: true}).sort({createdAt: -1});

        res.status(200).json(pets);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

/* DELETE */
export const deletePet = async(req, res) => {
    try{
        const {id} = req.params;
        
        const pet = await Pet.findById(id);
        
        pet.activo=false;

        await pet.save();

        const pets = await Pet.find({ userId: pet.userId, activo: true}).sort({createdAt: -1});

        res.status(200).json(pets);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
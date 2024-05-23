import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { deletePet, getPet, getPetAndPosts, getPetPosts, getUserPets, setAdopted } from "../controllers/pets.js";

const router = express.Router();

/* READ */
router.get("/postsSearch", verifyToken, getPetAndPosts);
router.get("/user/:id", verifyToken, getUserPets);
router.get("/:petId", verifyToken, getPet);
router.get("/posts/:petId", verifyToken, getPetPosts);

/* UPDATE */
router.patch("/:id", verifyToken, setAdopted);

/* DELETE */
router.delete("/:id", verifyToken, deletePet);

export default router;
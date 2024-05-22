import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { deletePet, getPet, getPetPosts, getUserPets, setAdopted } from "../controllers/pets.js";

const router = express.Router();

/* READ */
router.get("/user/:id", verifyToken, getUserPets);
router.get("/:petId", verifyToken, getPet);
router.get("/:petId/posts", verifyToken, getPetPosts);

/* UPDATE */
router.patch("/:id", verifyToken, setAdopted);

/* DELETE */
router.delete("/:id", verifyToken, deletePet);

export default router;
import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { getUserPets, setAdopted } from "../controllers/pets.js";

const router = express.Router();

/* READ */
router.get("/user/:id", verifyToken, getUserPets);

/* UPDATE */
router.patch("/:id", verifyToken, setAdopted);

export default router;
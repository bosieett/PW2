import express from "express";
import {deletePost, getFeedPosts, getUserPosts, likePost, updateComments, updatePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id", verifyToken, updatePost);
router.patch("/:id/comment", verifyToken, updateComments);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
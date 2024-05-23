import express from "express";
import {deleteComment, deletePost, getFeedPosts, getSearchPosts, getSearchPostsById, getUserPosts, likePost, updateComments, updatePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* POST */
router.post("/:postId/comments", verifyToken, updateComments);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/search", verifyToken, getSearchPosts);
router.get("/search/:userId", verifyToken, getSearchPostsById);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id", verifyToken, updatePost);
router.patch("/:id/comment", verifyToken, updateComments);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);


export default router;
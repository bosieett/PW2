import Pet from "../models/Pets.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath, petId} = req.body;
        const user = await User.findById(userId);
        const pet = await Pet.findById(petId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            petId,
            petName: pet.petName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

/* READ */
export const getFeedPosts = async(req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getSearchPosts = async(req, res) => {
    try {
        const { text } = req.query;
        let post
        if(text){
            post = await Post.find({description: { $regex: text, $options: 'i' }}).sort({ createdAt: -1 });
        }
        else{
            post = await Post.find().sort({ createdAt: -1 });
        }
        res.status(200).json(post);
    } catch (err) {
        console.log(err)
        res.status(404).json({message: err.message});
    }
}

export const getSearchPostsById = async(req, res) => {
    try {
        const { userId } = req.params;
        const { text } = req.query;

        let post = await Post.find({userId: userId}).sort({ createdAt: -1 });
        if(text){
            post = await Post.find({userId: userId,description: { $regex: text, $options: 'i' }}).sort({ createdAt: -1 });
        }
        console.log(post);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) =>{
     try {
        const { userId } = req.params;
        const post = await Post.find({userId: userId}).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

/* UPDATE */
export const likePost = async (req, res) =>{
     try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            { new: true}
        )

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const updatePost = async (req, res) =>{
     try {
        const { id } = req.params;
         const { description } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {description},
             { new: true }
        )

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const updateComments = async (req, res) =>{
     try {
        const { postId } = req.params;
        const { userId, text } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = { userId, text };
        post.comments.push(newComment);
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

/* DELETE */
export const deletePost = async(req, res) => {
    try{
        const {id} = req.params;
        
        const deletedPost = await Post.findByIdAndDelete(id);

        res.status(200).json(deletedPost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteComment = async(req, res) => {
    try {
        const { id, commentId } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode:"light",
    user: null,
    token: null,
    posts: [],
    pets: [],
    pet: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout : (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) =>{
            if(state.user){
                state.user.friends = action.payload.friends;
            } else{
                console.error("user friends non-existent :(")
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPost = action.payload.post;
            const index = state.posts.findIndex(post => post._id === updatedPost._id);
            if (index !== -1) {
                state.posts[index] = updatedPost;
            }
        },
        delPost: (state, action) => {
            const deletedPost = action.payload.post;
            state.posts = state.posts.filter(post => post._id !== deletedPost._id);
        },
        setPets: (state, action) => {
            state.pets = action.payload.pets;
        },
        setPet: (state, action) => {
            console.log(state.pet)
            state.pet = action.payload.pet;
            console.log(state.pet)

        },
        resetPet: (state, action) =>{
            state.pet = null;
        }
       
    }
})

export const { setMode, setLogin , setLogout , setFriends, setPosts, setPost, delPost, setPets, setPet, resetPet} = authSlice.actions;
export default authSlice.reducer;
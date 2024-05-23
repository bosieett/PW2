import { Box, useMediaQuery, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";


const ProfilePage = () =>{

    const [user, setUser] = useState(null);
    const {userId} = useParams();
    const userSelf = useSelector((state) => state.user);
    const token = useSelector((state) => state.token)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

    const getUser = async () => {
        const response =  await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    return <Box>
        <Navbar userId={userId}/>
        <Box
            width="100%"
            padding="2rem 6%"
            display= {isNonMobileScreens ? "flex": "block"}
            gap= "2rem"
            justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%": undefined}>
                    <UserWidget userId={userId} picturePath={user.picturePath}/>
                    <Box m="2rem 0"/>
                </Box>
                <Box
                 flexBasis={isNonMobileScreens ? "42%" : undefined}
                 mt={isNonMobileScreens ? undefined : "2rem"}
                 >
                    
                    {userSelf._id === userId ? (
                <>
                    <MyPostWidget picturePath={user.picturePath} isProfile={true}/>
                    <Box m="2rem 0" />
                </>
            ) :  <Box gap="1.75rem" background-color="#ffecd9">
            <Typography 
                fontWeight="bold" 
                fontSize="clamp(1rem, 2rem, 2.25rem)"
                color="#c58c71"
            >
                Publicaciones del usuario
            </Typography>
            
        </Box>}
                    <PostsWidget userId={userId} isProfile/>
                 </Box>
                 
            </Box>
    </Box>
}

export default ProfilePage;
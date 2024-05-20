import { Box, useMediaQuery, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import PetForm from "./petform";
import WidgetWrapper from "components/WidgetWrapper";

const PetsPage = () =>{

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
        <Navbar/>
        <Box
            width="100%"
            padding="2rem 6%"
            display= {isNonMobileScreens ? "flex": "block"}
            gap= "2rem"
            justifyContent="center"
            >
                <Box
                 flexBasis={isNonMobileScreens ? "42%" : undefined}
                 mt={isNonMobileScreens ? undefined : "2rem"}
                 >
                    <WidgetWrapper>
                    <PetForm></PetForm>
                    </WidgetWrapper>
                 </Box>
                 
            </Box>
    </Box>
}

export default PetsPage;
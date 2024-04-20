import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
} from "@mui/icons-material";
import {Box, Typograpghy, Divider, useTheme} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from  "components/WidgetWrapper";
import { useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const UserWidget = ({ userId, picturePath})=> {
    const [user, setUser]= useState(null);
    const {palette} = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium =  palette.neutral.medium;
    const main = palette.neutral.main;

    const getUser= async () => {
        const response = await fetch('http://localhost:3001/users/$(userId)',
        {
            method: "GET",
            headers: {Authorization: 'Bearer ${token}'},
        });
        const data = await response.json();
        setUser (data);
    };
    useEffects(()=>{
        getUser();
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    if(!user){
        return null;
    }
    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
    } = user;

    return(
       <WidgetWrapper>
        {/*FIRST ROW*/}
        <FlexBetween 
        gap = "0.5 rem"
        pb= "1.1rem"
        onClick={() => navigate ('/profile/${userId}')}
        >
            <FlexBetween gap= "1rem">
                <UserImage image = {picturePath}/>
                <Box>
                    <Typograpghy
                    variant= "h4"
                    color= {dark}
                    fontWeight="500"
                    sx={{
                        "&;hover" : {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }} >
                    {firstName} {lastName}
                    </Typograpghy>
                    <Typograpghy color={medium}> (friends.length) friends </Typograpghy>

                </Box>
                <ManageAccountsOutlined/>

            </FlexBetween>
            <Divider/>
            {/*SECOND ROW*/}
                    <Box p= "1rem 0">
                       <Box display= "flex" alignItems= "center" gap= "1rem" mb= "0.5rem">
                       <LocationOnOutlined fontSize="large" sx={{color: main}}/>
                       <Typograpghy color= {medium}>{location}</Typograpghy>
                        </Box> 

                        
                       <Box display= "flex" alignItems= "center" gap= "1rem" >
                       <WorkOutlineOutlined fontSize="large" sx={{color: main}}/>
                       <Typograpghy color= {medium}>{occupation}</Typograpghy>
                        </Box> 
                    </Box>

             {/*THIRD ROW*/}
             <Box p="1rem 0">
                <FlexBetween mb="0.5rem">
                    <Typograpghy color= {medium}>who's viewed your profile</Typograpghy>
                    <Typograpghy color = {main} fontWeight= "500">
                       {viewedProfile}
                        </Typograpghy>
                </FlexBetween>
                <FlexBetween>
                <Typograpghy color= {medium}>impressions of your post</Typograpghy>
                    <Typograpghy color = {main} fontWeight= "500">
                       {impressions}
                        </Typograpghy>

                </FlexBetween>


             </Box>

              {/*FOURTH ROW*/}
              <Box p="1rem 0">
                <Typograpghy fontSize="1rem" color={main} fontWeight="500" mb= "1rem">
                   Social Profiles 
                </Typograpghy>
                <FlexBetween gap ="1rem" mb = "0.5rem">
                    <FlexBetween gap = "1rem">
                        <img src= "../assets/twitter.png" alt= "twitter" />
                <Box>
                    <Typograpghy color={main} fontWeight= "500">
                        twitter
                    </Typograpghy>
                    <Typograpghy color= {medium}>Social Network</Typograpghy>


              </Box>
        </FlexBetween>
        <EditOutlined sx= {{ color:main }}/>

        </FlexBetween>

        <FlexBetween gap ="1rem">
                    <FlexBetween gap = "1rem">
                        <img src= "../assets/linked.png" alt= "linkedin" />
                <Box>
                    <Typograpghy color={main} fontWeight= "500">
                        LinkedIn
                    </Typograpghy>
                    <Typograpghy color= {medium}>Network Platform</Typograpghy>


              </Box>
        </FlexBetween>
        <EditOutlined sx= {{ color:main }}/>

        </FlexBetween>

        </Box>
        </FlexBetween>
       </WidgetWrapper> 
    );
    
};

export default UserWidget;
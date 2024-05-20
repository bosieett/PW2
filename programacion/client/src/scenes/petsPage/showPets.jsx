import { Box, useMediaQuery, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { setPets } from "state";
import CardMedia from '@mui/material/CardMedia';
import FlexBetween from "components/FlexBetween";

const PetsProfilePage = () =>{

    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const {_id} = useSelector((state) => state.user);
    const pets = useSelector((state) => state.pets);
    const token = useSelector((state) => state.token)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

    const getUserPets = async () => {
        const response =  await fetch(`http://localhost:3001/pets/user/${_id}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        dispatch(setPets({ pets: data}));
    }

    const getUser = async () => {
        const response =  await fetch(`http://localhost:3001/users/${_id}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
        getUserPets();
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
                <Box flexBasis={isNonMobileScreens ? "26%": undefined}>
                    <UserWidget userId={_id} picturePath={user.picturePath}/>
                </Box>
                    <>
        {pets.map(
            ({
            _id,
            userId,
            petName,
            petAge,
            petSize,
            petGender,
            petDescription,
            picturePath,
            isAdopted,
            
        }) => ( 
        <FlexBetween>
        <Box height="500px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" overflow-y="scroll">
            <WidgetWrapper>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="green iguana"
          sx={{borderRadius: "0.75rem"}}
        />
            <Typography
            textAlign="center"
            variant= "h3"
            color= "#8e2020"
            fontWeight="500"
            >{petName}</Typography>
            <FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Edad: {petAge}</Typography>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Tamaño: {petSize}</Typography>
        </FlexBetween>
            <FlexBetween>

            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Sexo: {petGender}</Typography>
        </FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Descripción: {petDescription}</Typography>

            {isAdopted ? (
            <Button>¡Encontró un hogar!</Button>):(
            <Button>Adoptar</Button>)}
            </WidgetWrapper>
            </Box>
            <Box height="500px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" overflow-y="scroll">
            <WidgetWrapper>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="green iguana"
          sx={{borderRadius: "0.75rem"}}
        />
            <Typography
            textAlign="center"
            variant= "h3"
            color= "#8e2020"
            fontWeight="500"
            >{petName}</Typography>
            <FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Edad: {petAge}</Typography>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Tamaño: {petSize}</Typography>
        </FlexBetween>
            <FlexBetween>

            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Sexo: {petGender}</Typography>
        </FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Descripción: {petDescription}</Typography>

            {isAdopted ? (
            <Button>¡Encontró un hogar!</Button>):(
            <Button>Adoptar</Button>)}
            </WidgetWrapper>
            </Box>
            <Box height="500px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" overflow-y="scroll">
            <WidgetWrapper>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="green iguana"
          sx={{borderRadius: "0.75rem"}}
        />
            <Typography
            textAlign="center"
            variant= "h3"
            color= "#8e2020"
            fontWeight="500"
            >{petName}</Typography>
            <FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Edad: {petAge}</Typography>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Tamaño: {petSize}</Typography>
        </FlexBetween>
            <FlexBetween>

            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Sexo: {petGender}</Typography>
        </FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Descripción: {petDescription}</Typography>

            {isAdopted ? (
            <Button>¡Encontró un hogar!</Button>):(
            <Button>Adoptar</Button>)}
            </WidgetWrapper>
            </Box>
            <Box height="500px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" overflow-y="scroll">
            <WidgetWrapper width="300px">
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="green iguana"
          sx={{borderRadius: "0.75rem"}}
        />
            <Typography
            textAlign="center"
            variant= "h3"
            color= "#8e2020"
            fontWeight="500"
            >{petName}</Typography>
            <FlexBetween>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Edad: {petAge}</Typography>
            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Tamaño: {petSize}</Typography>
        </FlexBetween>
            <FlexBetween>

            <Typography
            variant= "body2"
            color= "#8e2020"
            fontWeight="500">Sexo: {petGender}</Typography>
        </FlexBetween>
            <Typography
             variant="body2"
                    color="#8e2020"
                    fontWeight="500"
                    style={{
                        display: "block",
                        maxHeight: "6em",  // limit the height to 3 lines
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "pre-wrap",
                        lineHeight: "2em"
                    }}>Descripción: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA{petDescription}</Typography>

            {isAdopted ? (
            <Button>¡Encontró un hogar!</Button>):(
            <Button>Adoptar</Button>)}
            </WidgetWrapper>
            </Box>
            </FlexBetween>
        )


        )}
        </>
                 
            </Box>
    </Box>
}

export default PetsProfilePage;
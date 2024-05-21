import { Box, useMediaQuery, Typography, Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { setPets } from "state";
import CardMedia from '@mui/material/CardMedia';
import FlexBetween from "components/FlexBetween";
import PetsIcon from '@mui/icons-material/Pets';
import {
    DeleteOutlined
} from '@mui/icons-material';
import ConfirmationDialog from "components/ConfirmationDialog";

const PetsProfilePage = () =>{

    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const loggedUser = useSelector((state) => state.user);
    const pets = useSelector((state) => state.pets);
    const token = useSelector((state) => state.token)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

    const getUserPets = async () => {
        const response =  await fetch(`http://localhost:3001/pets/user/${loggedUser._id}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        dispatch(setPets({ pets: data}));
    }

    const getUser = async () => {
        const response =  await fetch(`http://localhost:3001/users/${loggedUser._id}`, {
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


    const [open, setOpen] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({ title: '', description: '', handleConfirm: () => {} });
    
    const handleClickOpen = (title, description, handleConfirm) => {
        setConfirmationConfig({ title, description, handleConfirm });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleAdoptation = async (petId) => {
        
        const response = await fetch(`http://localhost:3001/pets/${petId}`, {
            method: "PATCH",
            headers: {Authorization: `Bearer ${token}` }

        });
        setOpen(false);
        getUserPets();
    };



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
                    <UserWidget userId={loggedUser._id} picturePath={user.picturePath}/>
                </Box>
                <Box
                     display= "grid"
                     gap="2px"
                     gridTemplateColumns="repeat(4,minmax(0,1fr)) "
                     sx={{
                        "& > div": { gridColumn: isNonMobileScreens ? undefined: "span 4"},

                     }} 
                     >
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
            userId == loggedUser._id ? (
            <>
            <Box height="500px" width="300px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" sx={{gridColumn: "span 1"}}>
            <WidgetWrapper>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="pet picture"
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
                    sx={{
                        overflowY: "scroll",
                        '::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: '#ffecd9',
                            borderRadius: '10px',
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                            background: '#d5c5b9',
                        },
                    }}
                    style={{
                        height: "6em",
                        display: "block",
                        overflow: "overlay",
                        textOverflow: "ellipsis",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}>Descripción: {petDescription}</Typography>
                    <FlexBetween>
                    <Box display="flex" justifyContent="center" mt="1rem">
                    {isAdopted ? (
                        <Typography variant= "h4"
            color= "#ffecd9"
            fontWeight="500">
                            ¡Encontró un hogar!
                        </Typography>
                    ) : (
                        <Button variant="contained" onClick={() => handleClickOpen('¿Seguro que deseas darlo en adopción?', 'Esta acción hará que el perrito obtenga un hogar.', ()=>handleAdoptation(_id))} endIcon={<PetsIcon />}>
                            Dar en adopción
                        </Button>
                    )}
                </Box>
                        <IconButton onClick={handleAdoptation} color="error">
                            <DeleteOutlined />
                        </IconButton>
                </FlexBetween>
            </WidgetWrapper>
            </Box>
            </>
            ) : (
                <>
            <Box height="500px" width="300px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" sx={{gridColumn: "span 1"}}>
            <WidgetWrapper>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="pet picture"
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
                    sx={{
                        overflowY: "scroll",
                        '::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: '#ffecd9',
                            borderRadius: '10px',
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                            background: '#d5c5b9',
                        },
                    }}
                    style={{
                        height: "6em",
                        display: "block",
                        overflow: "overlay",
                        textOverflow: "ellipsis",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}>Descripción: {petDescription}</Typography>
                    <FlexBetween>
                    <Box display="flex" justifyContent="center" mt="1rem">
                    {isAdopted ? (
                        <Typography variant= "h4"
            color= "#ffecd9"
            fontWeight="500">
                            ¡Encontró un hogar!
                        </Typography>
                    ) : (
                        <Button variant="contained" endIcon={<PetsIcon />}>
                            Adoptar
                        </Button>
                    )}
                </Box>
                </FlexBetween>
            </WidgetWrapper>
            </Box>
            </>
            )
        )


        )}
        </Box>
                 
            </Box>
             <ConfirmationDialog 
                open={open} 
                handleClose={handleClose} 
                handleConfirm={confirmationConfig.handleConfirm} 
                title={confirmationConfig.title} 
                description={confirmationConfig.description} 
            />
    </Box>
}

export default PetsProfilePage;
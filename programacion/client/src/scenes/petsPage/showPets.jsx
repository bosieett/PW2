import { Box, useMediaQuery, Typography, Button, IconButton, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import { setPets, setUpdPet } from "state";
import CardMedia from '@mui/material/CardMedia';
import FlexBetween from "components/FlexBetween";
import PetsIcon from '@mui/icons-material/Pets';
import {
    DeleteOutlined,
    LocationOnOutlined,
    ManageAccountsOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material';
import ConfirmationDialog from "components/ConfirmationDialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import UserImage from "components/UserImage";
import AlertCustom from "scenes/widgets/AlertCustom";

const PetsProfilePage = () =>{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const {userId} = useParams();
    const location = useLocation();
    const loggedUser = useSelector((state) => state.user);
    const pets = useSelector((state) => state.pets);
    const token = useSelector((state) => state.token)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const medium =  palette.neutral.medium;
    const main = palette.neutral.main;

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
  
    const handleOpenAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
  
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };
  

    const getUserPets = async () => {
        const response =  await fetch(`http://localhost:3001/pets/user/${userId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        dispatch(setPets({ pets: data}));
    }

    const getUser = async () => {
        const response =  await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })

        const data = await response.json();
        console.log(data)
        setUser(data);
    }

    useEffect(() => {
        getUser();
        getUserPets();
    }, [location.pathname]); //eslint-disable-line react-hooks/exhaustive-deps


    const [open, setOpen] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({ title: '', description: '', handleConfirm: () => {} });
    
    const handleClickOpen = (title, description, handleConfirm) => {
        setConfirmationConfig({ title, description, handleConfirm });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendMail = async (to, petName) => {
    try {
        const responseU =  await fetch(`http://localhost:3001/users/${to}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })
    
        const { email } = await responseU.json();

        const response = await fetch('http://localhost:3001/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to:email, pet: petName, nombreDueno: `${user.firstName} ${user.lastName}`, nombreAdoptar: `${loggedUser.firstName} ${loggedUser.lastName}`, emailAdoptar: loggedUser.email}),
        });

        
        if (response.ok) {
            handleOpenAlert("Se ha enviado un correo al dueño", "success");
        } else {
          handleOpenAlert("Error al enviar el correo", "error");
        }
    } catch (error) {
        handleOpenAlert('Error en la solicitud de envío de correo:' + error, "error");
    }
};
    
    const handleAdoptation = async (petId) => {
        
        const response = await fetch(`http://localhost:3001/pets/${petId}`, {
            method: "PATCH",
            headers: {Authorization: `Bearer ${token}` }

        });
        const data = await response.json();

        dispatch(setUpdPet({pet: data}))
        setOpen(false);
    };

    const handleDelete = async (petId) => {
        
        const response = await fetch(`http://localhost:3001/pets/${petId}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}` }

        });
        const data = await response.json();

        dispatch(setPets({pets: data}))
        setOpen(false);
    };



    if (!user) return null;

    return <Box>
        <Navbar isPetPage/>
        <Box
            width="100%"
            padding="2rem 6%"
            display= {isNonMobileScreens ? "flex": "block"}
            gap= "2rem"
            justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%": undefined}>
                <WidgetWrapper>
        {/*FIRST ROW*/}
        <FlexBetween 
        gap = "0.5 rem"
        pb= "1.1rem"
        onClick={() => navigate (`/profile/${userId}`)}
        sx={{cursor: "pointer"}}
        >
            <FlexBetween gap= "1rem">
                <UserImage image = {user.picturePath}/>
                <Box>
                    <Typography
                    variant= "h4"
                    color= {dark}
                    fontWeight="500"
                    sx={{
                        "&;hover" : {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }} >
                    {user.firstName} {user.lastName}
                    </Typography>
                    <Typography color={medium}> {user.friends.length} amigos </Typography>

                </Box>
            </FlexBetween>
            <ManageAccountsOutlined/>
            </FlexBetween>

            <Divider/>

            {/*SECOND ROW*/}
            <Box p= "1rem 0">
               <Box display= "flex" alignItems= "center" gap= "1rem" mb= "0.5rem">
               <LocationOnOutlined fontSize="large" sx={{color: main}}/>
               <Typography color= {medium}>{user.location}</Typography>
                </Box> 
                
               <Box display= "flex" alignItems= "center" gap= "1rem" >
               <WorkOutlineOutlined fontSize="large" sx={{color: main}}/>
               <Typography color= {medium}>{user.occupation}</Typography>
                </Box> 
            </Box>

            <Divider/>

            <Box p= "1rem 0">
               <Box display= "flex" alignItems= "center" gap= "1rem" mb= "0.5rem"  sx={{cursor: "pointer"}}
            onClick={() => navigate (`/pets/${user._id}`)}>
               <PetsIcon fontSize="large" sx={{color: main}}/>
               
               <Typography color= {medium}>Mascotas</Typography>
                </Box>
            </Box>

       </WidgetWrapper> 
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
            userId === loggedUser._id ? (
            <>
            <Box height="500px" width="300px" flexBasis={isNonMobileScreens ? "26%": undefined} mr="2rem" sx={{gridColumn: "span 1"}}>
            <WidgetWrapper>
        <CardMedia
          onClick={()=>navigate(`/petsProfile/${_id}`)}
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="pet picture"
          sx={{borderRadius: "0.75rem",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.2s",
          }}}
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
                        <IconButton onClick={() => handleClickOpen('¿Seguro que deseas borrar su registro?', 'No podrás ver hacer más publicaciones, ni ver en tu perfil a este cachorro.', ()=>handleDelete(_id))} color="error">
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
          onClick={()=>navigate(`/petsProfile/${_id}`)}
          component="img"
          height="140"
          image={`http://localhost:3001/assets/${picturePath}`}
          alt="pet picture"
          sx={{borderRadius: "0.75rem",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.2s",
          }}}
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
                        <Button variant="contained" onClick={()=>sendMail(userId, petName)} endIcon={<PetsIcon />}>
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
             <AlertCustom
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        handleClose={handleCloseAlert}></AlertCustom>
    </Box>
}

export default PetsProfilePage;
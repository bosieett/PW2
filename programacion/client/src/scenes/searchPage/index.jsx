import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, useMediaQuery, CardMedia, IconButton } from '@mui/material';
import Navbar from 'scenes/navbar';
import { useSelector } from 'react-redux';
import WidgetWrapper from 'components/WidgetWrapper';
import PostWidget from 'scenes/widgets/PostWidget';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import FlexBetween from 'components/FlexBetween';
import { DeleteOutlined } from '@mui/icons-material';
import ConfirmationDialog from 'components/ConfirmationDialog';
import AlertCustom from 'scenes/widgets/AlertCustom';

const SearchPage = () => {
  const navigate = useNavigate();
  const [queryPost, setQueryPost] = useState('');
  const [queryPet, setQueryPet] = useState('');
  const [results, setResults] = useState({ animals: [], posts: [] });
  const token = useSelector((state) => state.token)
  const loggedUser = useSelector((state) => state.user)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

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
    const data = await response.json();

    const index = results.animals.findIndex(pet => pet._id === petId);
    if (index !== -1) {
        results.animals[index] = data;
    }

    setOpen(false);
};

const handleDelete = async (petId) => {
        
    const response = await fetch(`http://localhost:3001/pets/${petId}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}` }

    });
    const data = await response.json();
    results.animals = results.animals.filter(pet => pet._id !== data._id);
    setOpen(false);
};

  const handleSearch = async () => {
    try {
        const _queryPet = queryPet ? `pet=${queryPet}` : '';
        const _queryPost = queryPost ? `post=${queryPost}` : '';
        const query = _queryPet && _queryPost ? `${_queryPet}&${_queryPost}` : _queryPet || _queryPost;
        
        const response = await fetch(`http://localhost:3001/pets/postsSearch?${query}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Añadir el token si es necesario
            },
      });
      const data = await response.json();
      console.log(data);
      setResults(data);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const sendMail = async (to, petName) => {
    try {
        const responseU =  await fetch(`http://localhost:3001/users/${to}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })
    
        const { email, firstName, lastName } = await responseU.json();

        const response = await fetch('http://localhost:3001/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to:email, pet: petName, nombreDueno: `${firstName} ${lastName}`, nombreAdoptar: `${loggedUser.firstName} ${loggedUser.lastName}`, emailAdoptar: loggedUser.email}),
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

  return (
    <>
      <Navbar isPetPage />
      <Container>
      <WidgetWrapper>
        <Box my={4} textAlign="center">
          <Typography variant="h4"
          color="#8e2020"
                   fontWeight="500">Buscar Animales y Publicaciones</Typography>
          <Box my={2}>
          <Typography variant="h6"
          color="#8e2020"
                   fontWeight="500">Nombre de mascota</Typography>
            <TextField
              label="Buscar"
              variant="outlined"
              fullWidth
              value={queryPet}
              onChange={(e) => setQueryPet(e.target.value)}
            />
          </Box>
          <Box my={2}>
          <Typography variant="h6"
          color="#8e2020"
                   fontWeight="500">Texto de publicación</Typography>
            <TextField
              label="Buscar"
              variant="outlined"
              fullWidth
              value={queryPost}
              onChange={(e) => setQueryPost(e.target.value)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Buscar
          </Button>
        </Box>
        </WidgetWrapper>

        <Box mt={4}>
          <Typography variant="h4"
          color="#8e2020"
                   fontWeight="500">Resultados de Animales</Typography>
        </Box>
          <Box
                     display= "grid"
                     gap="2px"
                     gridTemplateColumns="repeat(4,minmax(0,1fr)) "
                     sx={{
                        "& > div": { gridColumn: isNonMobileScreens ? undefined: "span 4"},

                     }} 
                     >{results.animals.map(({
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
            ))}
            </Box>

        <Box mt={4}>
          <Typography  variant="h4"
          color="#8e2020"
                   fontWeight="500">Resultados de Publicaciones</Typography>
        </Box>
            {results.posts.map(({
                _id,
                userId,
                firstName,
                lastName,
                description,
                location,
                picturePath,
                userPicturePath,
                likes,
                comments,
                petName,
                petId,
            }) => (
              <PostWidget
              key = {_id}
              postId = {_id}
              postUserId = {userId}
              name = {`${firstName} ${lastName}`}
              description = {description}
              location = {location}
              picturePath = {picturePath}
              userPicturePath = {userPicturePath}
              likes = {likes}
              comments = {comments}
              petName = {petName}
              petId = {petId}
              />
            ))}
      </Container>
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
    </>
    
  );
};

export default SearchPage;
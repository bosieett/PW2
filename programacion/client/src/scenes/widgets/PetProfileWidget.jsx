import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Button, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPet, setPetPosts } from 'state';
import PetsIcon from '@mui/icons-material/Pets';
import PostWidget from './PostWidget';
import ConfirmationDialog from 'components/ConfirmationDialog';
import AlertCustom from './AlertCustom';

const AnimalProfile = ({ petId }) => {
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pet);
  const user = useSelector((state) => state.user);
  const petPosts = useSelector((state) => state.petposts);
  const token = useSelector((state) => state.token)

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

  const getPet = async () => {
    const response =  await fetch(`http://localhost:3001/pets/${petId}`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
    })

    const data = await response.json();
    dispatch(setPet({ pet: data}));
    console.log(pet);
}
const getPetPosts = async () => {
  const response =  await fetch(`http://localhost:3001/pets/posts/${petId}`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`}
  })

  const data = await response.json();
  dispatch(setPetPosts({ petposts: data}));
}

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
          body: JSON.stringify({ email, pet: petName, nombreDueno: `${pet.firstName} ${pet.lastName}`, nombreAdoptar: `${user.firstName} ${user.lastName}`, emailAdoptar: user.email}),
          
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

  dispatch(setPet({pet: data}))
  setOpen(false);
};

useEffect(() => {
  getPet();
  getPetPosts();
}, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!pet) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 2}}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={pet.petName}
          src={`http://localhost:3001/assets/${pet.picturePath}`}
          sx={{ 
            width: 200, 
            height: 200, 
          }}
          variant= "rounded"
        />
      </Box>

      <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: "#efbf6a" }}>
        <Typography variant="h4">{pet.petName}</Typography>
        <Typography variant="body1">Edad: {pet.petAge}</Typography>
        <Typography variant="body1">Sexo: {pet.petGender}</Typography>
        <Typography variant="body1">Tamaño: {pet.petSize}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{pet.petDescription}</Typography>
        {pet.userId === user._id ? (
        pet.isAdopted ? (
          <Typography variant= "h4"
color= "#ffecd9"
fontWeight="500">
              ¡Encontró un hogar!
          </Typography>
      ) : (
          <Button variant="contained" onClick={() => handleClickOpen('¿Seguro que deseas darlo en adopción?', 'Esta acción hará que el perrito obtenga un hogar.', ()=>handleAdoptation(pet._id))} endIcon={<PetsIcon />}>
              Dar en adopción
          </Button>
      )):(pet.isAdopted ? (
        <Typography variant= "h4"
color= "#ffecd9"
fontWeight="500">
            ¡Encontró un hogar!
        </Typography>
    ) : (
        <Button variant="contained" onClick={()=>sendMail(pet.userId, pet.petName)} endIcon={<PetsIcon />}>
            Adoptar
        </Button>
    ))}
      </Paper>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">PUBLICACIONES</Typography>
        <Divider />
        {petPosts.map(({
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
           />
        ))}
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
  );
};

export default AnimalProfile;
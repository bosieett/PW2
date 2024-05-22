import React, { useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Button, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetPet, setPet } from 'state';

const AnimalProfile = ({ petId }) => {
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pet);
  const token = useSelector((state) => state.token)

  const getPet = async () => {
    const response =  await fetch(`http://localhost:3001/pets/${petId}`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
    })

    const data = await response.json();
    dispatch(setPet({ pet: data}));
    console.log(pet);
}
useEffect(() => {
  getPet();
}, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!pet) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={pet.petName}
          src={`http://localhost:3001/assets/${pet.picturePath}`}
          sx={{ width: 200, height: 200 }}
          variant="rounded"
        />
      </Box>

      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h4">{pet.petName}</Typography>
        <Typography variant="body1">Edad: {pet.petAge}</Typography>
        <Typography variant="body1">Sexo: {pet.petGender}</Typography>
        <Typography variant="body1">Tamaño: {pet.petSize}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{pet.petDescription}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          ¡Quiero darle un hogar!
        </Button>
      </Paper>
{/*
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">PUBLICACIONES</Typography>
        <Divider />
        {posts.map((post, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <Typography variant="body2">{post.content}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>*/}
    </Box>
  );
};

export default AnimalProfile;
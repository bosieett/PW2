import React, { useEffect } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
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
}
useEffect(() => {
  getPet();
}, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!pet) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
    <Paper elevation={3}>
        <Avatar src={pet.imageUrl} alt={pet.name} />
        <Typography variant="h5">{pet.name}</Typography>
        <Typography variant="body1">Edad: {pet.age}</Typography>
        <Typography variant="body1">Sexo: {pet.gender}</Typography>
        <Typography variant="body1">Tamaño: {pet.size}</Typography>
        <Typography variant="body1">{pet.description}</Typography>
    </Paper>
</Box>
  );
};

export default AnimalProfile;
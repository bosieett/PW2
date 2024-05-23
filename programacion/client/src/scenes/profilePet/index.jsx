import React from 'react';
import { Container } from '@mui/material';
import AnimalProfile from 'scenes/widgets/PetProfileWidget';
import Navbar from 'scenes/navbar';
import { useParams } from 'react-router-dom';



const ProfilePet = () => {

    const {petId} = useParams();
    
    return <>
        <Navbar isPetPage/>
        <Container>
            <AnimalProfile petId={petId} />
        </Container>
    </>
};

export default ProfilePet;
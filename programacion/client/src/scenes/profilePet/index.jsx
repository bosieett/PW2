import React, { useEffect, useState } from 'react';
import { Container, CssBaseline } from '@mui/material';
import AnimalProfile from 'scenes/widgets/PetProfileWidget';
import Navbar from 'scenes/navbar';
import { resetPet, setPet } from 'state';
import { useDispatch, useSelector } from 'react-redux';
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
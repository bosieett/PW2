import React, { useState, useEffect } from 'react';
import { setPets } from "state";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const Combobox = ({ onValueChange }) => {
    const dispatch = useDispatch();
    
    const {_id} = useSelector((state) => state.user);
    const pets = useSelector((state) => state.pets);
    const token = useSelector((state) => state.token)
    
    const getUserPets = async () => {
        const response =  await fetch(`http://localhost:3001/pets/user/${_id}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        })
        
        const data = await response.json();
        dispatch(setPets({ pets: data}));
    }
    
    useEffect(() => {
        getUserPets();
    }, []); //eslint-disable-line react-hooks/exhaustive-deps
    
    const [selectedValue, setSelectedValue] = useState(-1);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        onValueChange(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Elige una mascota para publicar</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    label="Opción"
                    onChange={handleChange}
                >
                <MenuItem value={-1}>Seleccionar</MenuItem>
                     {pets.map(
            ({
            _id,
            petName
        }) => (
                    <MenuItem key={_id} value={_id}>{petName}</MenuItem>
        ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default Combobox;
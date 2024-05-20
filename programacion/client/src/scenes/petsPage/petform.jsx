import { useState } from "react";
import{
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import  EditOutlinedIcon  from "@mui/icons-material/EditOutlined";
import{ Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import AlertCustom from "../widgets/AlertCustom";
import { useSelector } from "react-redux";

const petSchema = yup.object().shape({
    picture: yup.string().required("requerido"),
    petName: yup.string().required("requerido"),
    petAge: yup.string().required("requerido"),
    petSize: yup.string().required("requerido"),
    petGender: yup.string().required("requerido")
});


const initialValues = {
    petName: "",
    picture: "",
    petAge: "",
    petSize: "",
    petGender: "",
    petDescription: "",
};

const PetForm = () => {
    const {palette}= useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    /*Alerta*/
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


const register = async(values, onSubmitProps)=> {
    const formData = new FormData();
    for (let value in values){
        formData.append(value, values[value])
    }
    formData.append('picturePath',values.picture.name);
    formData.append('userId', _id);

    const savedPetResponse = await fetch(
        "http://localhost:3001/pets/register",
        {
            method: "POST",
            headers: {Authorization: `Bearer ${token}` },
            body: formData,
        }
    );

    
    if (!savedPetResponse.ok) {
        handleOpenAlert('Error en el registro de la mascota', "Error");
        throw new Error('Error en el registro de la mascota');
    }

    //const savedPet= await savedPetResponse.json();
    onSubmitProps.resetForm();
    handleOpenAlert("Mascota registrada correctamente", "success")

};



    const  handleFormSubmit = async (values, onSubmitProps)=> {
        register(values, onSubmitProps);
    };

    return(
        <Formik
            onSubmit= {handleFormSubmit}
            initialValues={initialValues}
            validationSchema={petSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm, 


            }) => (
                <form onSubmit={handleSubmit}>
                     <Box
                     display= "grid"
                     gap="2px"
                     gridTemplateColumns="repeat(4,minmax(0,1fr)) "
                     sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined: "span 4"},

                     }} 
                     >
                            <Typography
                             fontWeight="bold" 
                            fontSize="clamp(1rem, 2rem, 2.25rem)"
                            color="#8e2020"
                            sx={{gridColumn: "span 4"}}
                            >Registrar Mascota</Typography>

                            <TextField
                            label="Nombre"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.petName}
                            name="petName"
                            error={Boolean(touched.petName)&& Boolean(errors.petName)}
                            helperText={touched.petName && errors.petName}
                            sx={{gridColumn: "span 2"}}
                            />

                            <TextField
                            label="Edad"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.petAge}
                            name="petAge"
                            error={Boolean(touched.petAge)&& Boolean(errors.petAge)}
                            helperText={touched.petAge && errors.petAge}
                            sx={{gridColumn: "span 2"}}
                            />

                            <TextField
                            label="Sexo"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.petGender}
                            name="petGender"
                            error={Boolean(touched.petGender)&& Boolean(errors.petGender)}
                            helperText={touched.petGender && errors.petGender}
                            sx={{gridColumn: "span 2"}}
                            />

                            <TextField
                            label="Tamaño"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.petSize}
                            name="petSize"
                            error={Boolean(touched.petSize)&& Boolean(errors.petSize)}
                            helperText={touched.petSize && errors.petSize}
                            sx={{gridColumn: "span 2"}}
                            />

                            <TextField
                            label="Descripción"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.petDescription}
                            name="petDescription"
                            error={Boolean(touched.petDescription)&& Boolean(errors.petDescription)}
                            helperText={touched.petDescription && errors.petDescription}
                            sx={{gridColumn: "span 4"}}
                            />

                            <Box
                            gridColumn= "span 4"
                            border= {`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="0.5rem"
                            >
                                <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles)=>
                                    setFieldValue("picture",acceptedFiles[0])
                                }
                                >
                                  {({getRootProps, getInputProps})=>(
                                    <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="0.5rem"
                                    sx={{ "&:hover": {cursor:"pointer"}}}
                                    >
                                        <input {...getInputProps()}/>
                                        {!values.picture ? (
                                            <p>Añade una imagen aquí</p>
                                        ): (
                                            <FlexBetween>
                                                <Typography>{values.picture.name}</Typography>
                                                <EditOutlinedIcon/>
                                            </FlexBetween>
                                        )}

                                    </Box>
                                  )}
                                </Dropzone>                                
                            </Box>
                     </Box>

                    {/*BUTTONS*/}
                    <Box>
                        <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m:"0.2rem 0",
                            p: "0.5rem",
                            backgroundColor: palette.primary.main,
                            color:palette.background.alt,
                            "&:hover": { color: palette.hoverBtn.typo, backgroundColor: palette.hoverBtn.color},

                        }}
                        >
                            Registrar mascota
                        </Button>
                        <Typography
                            onClick={() => {
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover":{
                                    cursor:"pointer",
                                    color: palette.primary.light,
                                },
                            }}
                        >
                           

                        </Typography>
                    
                                <AlertCustom
                                  open={alertOpen}
                                  message={alertMessage}
                                  severity={alertSeverity}
                                  handleClose={handleCloseAlert}></AlertCustom>
                    </Box>

                </form>

            )}

        </Formik>
    )
}

export default PetForm;

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
import { useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLogin} from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import AlertCustom from "../widgets/AlertCustom";

const petSchema = yup.object().shape({
    picture: yup.string().required("requerido"),
    petname: yup.string().required("requerido"),
});


const initialValues = {
    petname: "",
    picture: ""
};

const PetForm = () => {
    const {palette}= useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    {/*Alerta*/}
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
    //esto nos permite enviar form info con imagen
    const formData = new FormData();
    for (let value in values){
        formData.append(value, values[value])
    }
    formData.append('picturePath',values.picture.name);

    const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
            method: "POST",
            body: formData,
        }
    );
    const savedUser= await savedUserResponse.json();
    onSubmitProps.resetForm();
    handleOpenAlert("Mascota registrada correctamente", "success")

};

    const login = async (values,onSubmitProps ) =>{
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers:{ "Content-Type": "application/json"},
                body: JSON.stringify(values),
            }
        );

        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if (loggedIn){
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate ("/home");
        }
    };

    const  handleFormSubmit = async (values, onSubmitProps)=> {
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
                            <TextField
                            label="Nombre de la mascota"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.location}
                            name="petname"
                            error={Boolean(touched.location)&& Boolean(errors.location)}
                            helperText={touched.location && errors.location}
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

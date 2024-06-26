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

const registerSchema = yup.object().shape({
    firstName: yup.string().required("requerido"),
    lastName: yup.string().required("requerido"),
    email: yup.string().email ("correo invalido").required("requerido"),
    password: yup.string().required("requerido"),
    location: yup.string().required("requerido"),
    occupation: yup.string().required("requerido"),
    picture: yup.string().required("requerido"),
})

const loginSchema = yup.object().shape({
    email: yup.string().email ("correo invalido").required("requerido"),
    password: yup.string().required("requerido"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const [pageType, setPageType]=useState("login");
    const {palette}= useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

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
    handleOpenAlert("Usuario registrado correctamente", "success")

    if(savedUser){
        setPageType("login");
    }

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
       if (isLogin) await login(values, onSubmitProps);
       if (isRegister) await register(values, onSubmitProps);
    };

    return(
        <Formik
            onSubmit= {handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
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
                     gap="30px"
                     gridTemplateColumns="repeat(4,minmax(0,1fr)) "
                     sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined: "span 4"},

                     }} 
                     >
                        {isRegister && (
                            <>
                            <TextField
                            label="Nombre(s)"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.firstName}
                            name="firstName"
                            error={Boolean(touched.firstName)&& Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                            sx={{gridColumn: "span 2"}}
                            />
                            <TextField
                            label="Apellido(s)"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.lastName}
                            name="lastName"
                            error={Boolean(touched.lastName)&& Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{gridColumn: "span 2"}}
                            />
                            <TextField
                            label="Ubicación"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.location}
                            name="location"
                            error={Boolean(touched.location)&& Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                            sx={{gridColumn: "span 4"}}
                            />
                            <TextField
                            label="Ocupación"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.occupation}
                            name="occupation"
                            error={Boolean(touched.occupation)&& Boolean(errors.occupation)}
                            helperText={touched.occupation && errors.occupation}
                            sx={{gridColumn: "span 4"}}
                            />
                            <Box
                            gridColumn= "span 4"
                            border= {`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
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
                                    p="1rem"
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
                        </>
                    )}

                        <TextField
                            label="Correo electronico"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.email}
                            name="email"
                            error={Boolean(touched.email)&& Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{gridColumn: "span 4"}}
                        />

                        <TextField
                            label="Contraseña"
                            type = "password"
                            onBlur= {handleBlur}
                            onChange ={handleChange}
                            value= {values.password}
                            name="password"
                            error={Boolean(touched.password)&& Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{gridColumn: "span 4"}}
                        />

                     </Box>

                    {/*BUTTONS*/}
                    <Box>
                        <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m:"2rem 0",
                            p: "1rem",
                            backgroundColor: palette.primary.main,
                            color:palette.background.alt,
                            "&:hover": {color: palette.hoverBtn.typo, backgroundColor: palette.hoverBtn.color},

                        }}
                        >  
                        {isLogin ?"INICIAR SESION": "REGISTRARSE"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
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
                            {isLogin
                            ? "¿No tienes una cuenta? Registrate aquí."
                            : "¿Ya tienes cuenta? Inicia sesión aquí."}

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

export default Form;

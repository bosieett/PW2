import { Box, Typography, /*useTheme,*/ useMediaQuery  } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import Form from "./Form";
//const { Typography } = require("@mui/material");

const LoginPage = () =>{
    //const theme = useTheme();
    const isNonMobileScreens= useMediaQuery("(min-width: 1000px)");
    return<Box>
        <Box width = "100%" backgroundColor={'#c58c71'} p="1rem 6%" textAlign= "center">
        <Typography
        fontWeight = "bold"
        fontSize="32px"
        color="#ffecd9">
        AD<PetsIcon sx={{ color:"#8e2020" }}/>PET
</Typography>
</Box>
<Box
     width={isNonMobileScreens ? "50%" : "93%"}
     
    p="2rem"
    m="2rem auto"
    borderRadius= "1.5rem" 
    backgroundColor = {'#efbf6a'}
    >

    <Typography fontWeight = "bold" variant= "h2" sx={{mb: "1.5rem", color: "#8e2020"}}>
 No compres, ¡AD<PetsIcon sx={{ fontSize : "32px", color:"#8e2020" }}/>PTA!
    </Typography>
    <Typography fontWeight = "bold" variant= "h5" sx={{mb: "1.5rem", color: "#8e2020"}}>
 Ayuda a muchas mascotas alrededor del mundo a encontrar un hogar.
    </Typography>
    <Form />  
</Box>
</Box>
};  


   // return (<div>LoginPage</div>)
    

export default LoginPage;
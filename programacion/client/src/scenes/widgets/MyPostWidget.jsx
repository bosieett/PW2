import {
    EditOutlined,
    DeleteOutlined,
    ImageOutlined,
} from "@mui/icons-material";
import {
    Box, 
    Divider, 
    Typography, 
    InputBase, 
    useTheme,
    Button,
    IconButton,
} from "@mui//material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import AlertCustom from "./AlertCustom";
import Combobox from "components/ComboBox";

const MyPostWidget = ({picturePath, isProfile = false}) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");

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

    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [selectedPetId, setSelectedPetId] = useState("");

    const handleValueChange = (value) => {
        setSelectedPetId(value);
    };

    const handlePost = async () => {
        if(selectedPetId && selectedPetId !== -1){
        if(image || post){
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("petId", selectedPetId);
        formData.append("description", post);
        if (image){
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}` },
            body: formData,

        });
       

        if(isProfile){
           const response2 = await fetch(`http://localhost:3001/posts/${_id}/posts`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}` },
        });
        const posts = await response2.json();
        dispatch(setPosts({ posts }));
        }
        else{
            const posts = await response.json();
            dispatch(setPosts({ posts }));
        }

        setImage(null);
        setPost("");

        handleOpenAlert("Publicación realizada con éxito!", "success");
    }
    else{
        handleOpenAlert("Ingresa un archivo o texto al cuerpo de tu publicación", "warning")
    }}else{
        handleOpenAlert("Necesitas seleccionar una mascota", "warning")
    }
    };

     return (

        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath}/>
                <InputBase
                placeholder="¿Qué estás pensando?..."
                onChange={(e) => setPost(e.target.value)}
                value={post}
                sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "1rem 2rem",
                }}
               />
               </FlexBetween>
               
               <Divider sx={{ margin: "1.25rem 0"}}/>

               <Combobox onValueChange={handleValueChange}></Combobox>
               {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius ="5px"
                    mt="1rem"
                    p="1rem"
                >
                   <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles)=> setImage(acceptedFiles[0])
                                }
                                >
                                  {({getRootProps, getInputProps})=>(
                                    <FlexBetween>
                                    <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": {cursor:"pointer"}}}
                                    >
                                        <input {...getInputProps()}/>
                                        {!image ? (
                                            <p>Añade una imagen aquí</p>
                                        ): (
                                            <FlexBetween>
                                                <Typography>{image.name}</Typography>
                                                <EditOutlined/>
                                            </FlexBetween>
                                        )}

                                    </Box>
                                    {image && (
                                        <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{width: "15%"}}>
                                        <DeleteOutlined/>
                                        </IconButton>
                                    )}
                                    </FlexBetween>
                                  )}
                                </Dropzone>   
                </Box>
               )}

               <Divider sx={{ margin: "1.25rem 0"}}/>

               <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain}}/>
                    <Typography
                    color={mediumMain}
                    sx={{ "&:hover": {cursor: "pointer", color:medium}}}
                    >
                       Imagen 
                    </Typography>
                </FlexBetween>

               <Button
               disable={!post}
               onClick={handlePost}
               sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem"
               }}
               >
                POSTEAR
               </Button>
               </FlexBetween>
              <AlertCustom
              open={alertOpen}
              message={alertMessage}
              severity={alertSeverity}
              handleClose={handleCloseAlert}></AlertCustom>
        </WidgetWrapper>
     );

};

export default MyPostWidget;
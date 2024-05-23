import { useState } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material";
import PetsIcon from '@mui/icons-material/Pets';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setPosts } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = ({userId, isPetPage}) =>{
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token)
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const isUserProfile = userId;
    console.log(isPetPage);
 
    const searchPosts = async (text) => {
        if(isUserProfile){
            const query = text ? `?text=${text}` : '';
            const response = await fetch(`http://localhost:3001/posts/search/${isUserProfile}${query}`, {
                method: "GET",
                headers: {Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                dispatch(setPosts({ posts: data}));
        }
        else{
            const query = text ? `?text=${text}` : '';
            const response = await fetch(`http://localhost:3001/posts/search${query}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.log(data);
            dispatch(setPosts({ posts: data}));
        }
    };

    const fullName = `${user.firstName} ${user.lastName}`;


    return <FlexBetween padding="1rem 6%" backgroundColor={'#c58c71'}>
        <FlexBetween gap="1.75rem">
            <Typography 
                fontWeight="bold" 
                fontSize="clamp(1rem, 2rem, 2.25rem)" 
                color="#ffecd9" 
                onClick={() => navigate("/home")}
                sx={{
                    "&:hover": {
                        color: "#d5c5b9",
                        cursor: "pointer",
                    },
                }}
            >
                AD<PetsIcon sx={{ color: "#8e2020" }}/>PET
            </Typography>
            {isNonMobileScreens && !isPetPage && (
                <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                    <InputBase placeholder="Buscar..." onChange={(event)=>searchPosts(event.target.value)}/>
                    <IconButton>
                        <Search/>
                    </IconButton>
                </FlexBetween>
            )}
            <Typography 
                fontWeight="bold" 
                fontSize="clamp(0rem, 1rem, 1.25rem)" 
                color="#ffecd9" 
                onClick={() => navigate("/search")}
                sx={{
                    "&:hover": {
                        color: "#d5c5b9",
                        cursor: "pointer",
                    },
                }}
            >
                Busqueda avanzada
            </Typography>
        </FlexBetween>

        {/* Desktop NAV */}
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
                <FormControl variant="standard" value={fullName}>
                    <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutralLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1rem",
                            "& .MuiSvgIcon-root": {
                                pr: "0.25rem",
                                width: "3rem"
                            },
                            "& .MuiSelect-select:focus":{
                                backgroundColor: neutralLight
                            }
                        }}
                        input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate (`/pets`)}>
                            <Typography>Dar de alta mascota</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate (`/pets/${user._id}`)}>
                            <Typography>Mascotas</Typography>
                        </MenuItem>
                        <MenuItem onClick={()=> dispatch(setLogout())}>Salir</MenuItem>
                    </Select>
                </FormControl>
            </FlexBetween>
        ) : (
            <IconButton
                onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <Menu />
            </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={background}
            >
                {/* CLOSE ICON */}
                <Box display="flex" justifyContent="flex-end" p="1rem">
                    <IconButton
                        onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}
                    >
                        <Close/>
                    </IconButton>
                </Box>

                {/* MENU ITEMS */}
                <FlexBetween 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="center" 
                    alignItems="center" 
                    gap="3rem"
                >
                <IconButton 
                    onClick={()=> dispatch(setMode())}
                    sx={{ fontSize : "25px" }}
                >
                    {theme.palette.mode === "dark" ? (
                        <DarkMode sx={{ fontSize : "25px" }} />
                    ): (
                        <LightMode sx={{ color: dark, fontSize:"25px" }}/>
                    )}
                </IconButton>
                <Message sx={{ fontSize : "25px" }}/>
                <Notifications sx={{ fontSize : "25px" }}/>
                <Help sx={{ fontSize : "25px" }}/>
                <FormControl variant="standard" value={fullName}>
                    <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutralLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1rem",
                            "& .MuiSvgIcon-root": {
                                pr: "0.25rem",
                                width: "3rem"
                            },
                            "& .MuiSelect-select:focus":{
                                backgroundColor: neutralLight
                            }
                        }}
                        input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem><MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={()=> dispatch(setLogout())}>Salir</MenuItem>
                    </Select>
                </FormControl>
            </FlexBetween>
            </Box>
        )}
    </FlexBetween>;
}

export default Navbar;
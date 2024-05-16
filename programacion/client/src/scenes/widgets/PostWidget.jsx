import React, { useState } from 'react';
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
    CancelOutlined
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme, TextField } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [isComments, setIsComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: loggedInUserId }),
        });

        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        // Aquí puedes enviar los datos editados al servidor o realizar cualquier acción necesaria
        // Por simplicidad, solo actualizo el estado en este ejemplo
        setEditedDescription(editedDescription);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Restaurar la descripción original al cancelar la edición
        setEditedDescription(description);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                // La publicación se eliminó correctamente
                // Puedes redirigir a una página de confirmación o actualizar la lista de publicaciones
                console.log("Publicación eliminada correctamente");
            } else {
                // Manejar el caso en que no se pueda eliminar la publicación
                console.error("Error al eliminar la publicación");
            }
        } catch (error) {
            console.error("Error al procesar la solicitud de eliminación:", error);
        }
    };

    return (
        <WidgetWrapper m="2rem 0">
            <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} />

            {isEditing ? (
                <TextField
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    multiline
                    fullWidth
                    variant="outlined"
                    label="Editar descripción"
                    sx={{ mt: '1rem' }}
                />
            ) : (
                <Typography color={main} sx={{ mt: '1rem' }}>
                    {description}
                </Typography>
            )}

            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
                    src={`http://localhost:3001/assets/${picturePath}`}
                />
            )}

            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween gap="0.3rem">
                {/* Botón de guardar edición */}
                {isEditing && (
                    <IconButton onClick={handleSaveEdit}>
                        <SaveOutlined />
                    </IconButton>
                )}
                {/* Botón de editar */}
                { postUserId===loggedInUserId ? ( isEditing ? (
                    <IconButton onClick={handleCancelEdit}>
                        <CancelOutlined />
                    </IconButton>
                ) : (
                    <IconButton onClick={handleEditClick}>
                        <EditOutlined />
                    </IconButton>
                )) : ""}

            {postUserId===loggedInUserId ? (<IconButton onClick={handleDelete} color="error">
    <DeleteOutlined />
</IconButton>): ""}
            </FlexBetween>
            </FlexBetween>

            {isComments && (
                <Box mt="0.5rem">
                    {comments.map((comment, i) => (
                        <Box key={`${name}-${i}`}>
                            <Divider />
                            <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>{comment}</Typography>
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}

        </WidgetWrapper>
    );
};

export default PostWidget;
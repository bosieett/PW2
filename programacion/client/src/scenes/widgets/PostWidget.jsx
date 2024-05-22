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
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { delPost, setPost } from 'state';
import ConfirmationDialog from 'components/ConfirmationDialog';
import AlertCustom from './AlertCustom';

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
    const [commentText, setCommentText] = useState('');
    const [isComments, setIsComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const descripcion = description;
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

    const patchDesc = async () => {
    try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: editedDescription }),
        });

        if (response.ok) {
            const updatedPost = await response.json();
            dispatch(setPost({ post: updatedPost }));
            setEditedDescription(updatedPost.description);
            setIsEditing(false);
        } else {
            console.error('Error al actualizar la descripción');
        }
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error);
    }
};

const handleAddComment = async () => {
    if (commentText.trim()) {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: loggedInUserId, text: commentText }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                dispatch(setPost({ post: updatedPost }));
                setCommentText(''); // Clear the comment input
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    }
};

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        
        setEditedDescription(description);
    };


    /* Confirmation Dialog */
    const [open, setOpen] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({ title: '', description: '', handleConfirm: () => {} });
    
    const handleClickOpen = (title, description, handleConfirm) => {
        setConfirmationConfig({ title, description, handleConfirm });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /* Alert */
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

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                handleOpenAlert("Publicación eliminada con éxito!", "success");
                const deletedPost = await response.json();
                dispatch(delPost({ post: deletedPost }))
            } else {
                handleOpenAlert("Error al eliminar la publicación", "error");
            }
        } catch (error) {
            handleOpenAlert("Error al procesar la solicitud de eliminación: "+error, "error");
        }
        setOpen(false);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const updatedPost = await response.json();
                dispatch(setPost({ post: updatedPost }));
                handleOpenAlert('Comentario eliminado con éxito!', 'success');
            } else {
                handleOpenAlert('Error al eliminar el comentario', 'error');
            }
        } catch (error) {
            handleOpenAlert('Error al procesar la solicitud de eliminación: ' + error, 'error');
        }
        handleClose();
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
                    {descripcion}
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
                    <IconButton onClick={patchDesc}>
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

            {postUserId===loggedInUserId ? (<IconButton onClick={() => handleClickOpen('¿Seguro que deseas borrar la publicación?', 'No se podrá recuperar la publicación eliminada.', ()=>handleDelete())} color="error">
    <DeleteOutlined />
</IconButton>): ""}
            </FlexBetween>
            </FlexBetween>

            {isComments && (
                <Box mt="0.5rem">
                    {comments.map((comment, i) => (
                        <Box key={comment._id}>
                            <Divider />
                            <FlexBetween>
                            <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>{comment.text}</Typography>
                            {comment.userId === loggedInUserId && (
                    <IconButton
                        onClick={() => handleClickOpen(
                            '¿Seguro que deseas borrar este comentario?',
                            'No podrás recuperar este comentario una vez eliminado.',
                            () => handleDeleteComment(comment._id) // Aquí debes definir la función handleDeleteComment para eliminar el comentario
                        )}
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
                </FlexBetween>
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}

            <FlexBetween gap="0.3rem">
             {/* Agregar el campo de texto para el nuevo comentario */}
            <TextField
                label="Escribe un comentario"
                variant="outlined"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                fullWidth
            />

            {/* Agregar el botón para enviar el comentario */}
            <IconButton onClick={handleAddComment}>
                <SendIcon/>
            </IconButton>
</FlexBetween>
              <ConfirmationDialog 
                open={open} 
                handleClose={handleClose} 
                handleConfirm={confirmationConfig.handleConfirm} 
                title={confirmationConfig.title} 
                description={confirmationConfig.description} 
            />
            <AlertCustom
              open={alertOpen}
              message={alertMessage}
              severity={alertSeverity}
              handleClose={handleCloseAlert}></AlertCustom>
        </WidgetWrapper>
    );
};

export default PostWidget;
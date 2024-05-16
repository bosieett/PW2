import React, { useEffect } from 'react';
import { Snackbar, Alert, ClickAwayListener  } from '@mui/material';

const AlertCustom = ({ open, message, severity, handleClose }) => {
    useEffect(() => {
        let timer;
        if (open) {
            timer = setTimeout(() => {
                handleClose();
            }, 3000); // Cerrar automáticamente después de 3 segundos
        }
        return () => {
            clearTimeout(timer);
        };
    }, [open, severity, handleClose]);

    return (
        <ClickAwayListener onClickAway={() => {}}>
        <Snackbar
            open={open}
            //autoHideDuration={3000}  // Desaparece después de 3 segundos si no es un error
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ClickAwayListenerProps={{ onClickAway: () => {} }} // Evitar que la alerta se cierre al hacer clic fuera de ella
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    </ClickAwayListener>
    );
};

export default AlertCustom;
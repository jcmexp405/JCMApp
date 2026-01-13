import {
  Alert,
  AlertTitle,
  Box,
  Modal,
  Typography,
  IconButton,
  Fade,
  Backdrop,
  Paper,
  Divider,
  alpha
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { postNewUser } from '../../services/usersService';
import { newUsersValidationSchema } from '../../validations/newUserValidation';
import NewUserButton from './NewUserButton.component';
import { NewUserInputs } from './NewUserInputs.component';
import { SuccessAlert } from '../Common/SuccessAlert';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500, md: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
  outline: 'none'
};

const NewUserModal = ({ open, setOpen }) => {
  const [errorMsg, setErrorMsg] = useState({});
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      USER_NAME: '',
      EMAIL: '',
      PASSWORD: '',
      PASSWORD_CONFIRM: '',
      COMPANY: ''
    },
    validationSchema: newUsersValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await postNewUser(values);
        if (response.message === 'Success') {
          SuccessAlert('Usuario Creado', 'Se ha creado el usuario con éxito');
          formik.resetForm();
          setOpen(false);
        } else {
          console.log(response);
          setErrorMsg(response);
        }
      } catch (error) {
        console.log('hay un error');
        console.error(error);
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0, 13, 25, 0.75)',
            backdropFilter: 'blur(8px)'
          }
        }
      }}>
      <Fade in={open} timeout={400}>
        <Paper sx={style} elevation={24}>
          {/* Header with Gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
              padding: { xs: 3, md: 4 },
              position: 'relative',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}>
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
                backgroundColor: alpha('#ffffff', 0.1),
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                  transform: 'rotate(90deg)'
                }
              }}>
              <CloseIcon />
            </IconButton>

            {/* Icon and Title */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  background: alpha('#ffffff', 0.15),
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${alpha('#ffffff', 0.2)}`
                }}>
                <PersonAddIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    letterSpacing: '-0.01em'
                  }}>
                  Nuevo Usuario
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#ffffff', 0.85),
                    mt: 0.5,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}>
                  Completa el formulario para crear una cuenta
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form Content */}
          <Box sx={{ padding: { xs: 3, md: 4 } }}>
            {errorMsg && errorMsg?.error && (
              <Alert
                variant="filled"
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                }}>
                <AlertTitle sx={{ fontWeight: 700 }}>{errorMsg.message}</AlertTitle>
                {errorMsg.error.code}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    fontSize: '0.75rem'
                  }}>
                  Información del Usuario
                </Typography>
                <Divider sx={{ mt: 1, mb: 3 }} />
                <NewUserInputs formik={formik} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    padding: '10px 24px',
                    borderRadius: '12px',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: alpha('#000', 0.04)
                    }
                  }}>
                  Cancelar
                </IconButton>
                <NewUserButton />
              </Box>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};
export default NewUserModal;

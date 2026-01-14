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
  alpha,
  TextField,
  Button
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { postUserAlert } from '../../actions/alertsActions';
import { alertValidationSchema } from '../../validations/alertValidation';
import { SuccessAlert } from '../Common';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
  outline: 'none'
};

const NewAlertModal = ({ open, setOpen, handleGetAlerts, idUsuario }) => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      TITLE: '',
      DESCRIPTION: ''
    },
    validationSchema: alertValidationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(postUserAlert(values));
        SuccessAlert('Alerta creada', 'La alerta se creó con éxito');
        await handleGetAlerts(idUsuario);
        formik.resetForm();
        setOpen(false);
      } catch (error) {
        setErrorMsg({
          message: 'Error al crear alerta',
          error
        });
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setErrorMsg(null);
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
          {/* 🔹 HEADER */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
              padding: { xs: 3, md: 4 },
              position: 'relative',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}>
            {/* Close button */}
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

            {/* Icon + Title */}
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
                <NotificationsActiveIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}>
                  Nueva Alerta
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#ffffff', 0.85),
                    mt: 0.5
                  }}>
                  Crea una alerta para notificar eventos importantes
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 🔹 CONTENT */}
          <Box sx={{ padding: { xs: 3, md: 4 } }}>
            {errorMsg && (
              <Alert
                variant="filled"
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                }}>
                <AlertTitle sx={{ fontWeight: 700 }}>{errorMsg.message}</AlertTitle>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="TITLE"
                  name="TITLE"
                  label="Título"
                  placeholder="Ej. Documento vencido"
                  size="small"
                  margin="normal"
                  value={formik.values.TITLE}
                  onChange={formik.handleChange}
                  error={formik.touched.TITLE && Boolean(formik.errors.TITLE)}
                  helperText={formik.touched.TITLE && formik.errors.TITLE}
                />

                <TextField
                  fullWidth
                  id="DESCRIPTION"
                  name="DESCRIPTION"
                  label="Descripción"
                  placeholder="Describe el motivo de la alerta"
                  size="small"
                  multiline
                  rows={4}
                  margin="normal"
                  value={formik.values.DESCRIPTION}
                  onChange={formik.handleChange}
                  error={formik.touched.DESCRIPTION && Boolean(formik.errors.DESCRIPTION)}
                  helperText={formik.touched.DESCRIPTION && formik.errors.DESCRIPTION}
                />
              </Box>

              {/* 🔹 ACTIONS */}
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

                <Button type="submit" variant="contained">
                  Crear Alerta
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default NewAlertModal;

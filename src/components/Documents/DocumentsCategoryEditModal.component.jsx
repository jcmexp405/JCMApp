import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Box,
  IconButton,
  alpha,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useFormik } from 'formik';
import { newCategoryValidationSchema } from '../../validations/newCategoryValidation';
import { editCategory } from '../../services/documentsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CATEGORY_ICON_MAP, CATEGORY_ICON_OPTIONS } from '../../constants/constants';

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
const DocumentCategoryEditModal = ({ open, setOpen, selectedCategory, fetchCategories }) => {
  const [toast, setToast] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      TITLE: selectedCategory?.title || '',
      ICON: selectedCategory?.icon || ''
    },
    validationSchema: newCategoryValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const docRef = await editCategory(selectedCategory.id, values);

        if (docRef?.message === 'Success' || docRef?.id) {
          setToast({
            open: true,
            severity: 'success',
            message: 'Categoría actualizada correctamente.'
          });

          helpers.resetForm();
          setOpen(false);

          await fetchCategories?.();
        } else {
          setToast({
            open: true,
            severity: 'error',
            message: 'No se pudo actualizar la categoría.'
          });
        }
      } catch (error) {
        setToast({
          open: true,
          severity: 'error',
          message: error?.message || 'Ocurrió un error inesperado al actualizar.'
        });
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleCloseToast = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
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
            {/* HEADER */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                padding: { xs: 3, md: 4 },
                position: 'relative',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px'
              }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: 'white',
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2),
                    transform: 'rotate(90deg)'
                  }
                }}>
                <CloseIcon />
              </IconButton>

              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                Editar Categoría
              </Typography>
            </Box>

            {/* FORM */}
            <Box sx={{ padding: { xs: 3, md: 4 } }}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="TITLE"
                  name="TITLE"
                  label="Nombre"
                  margin="normal"
                  size="small"
                  value={formik.values.TITLE}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.TITLE && Boolean(formik.errors.TITLE)}
                  helperText={formik.touched.TITLE && formik.errors.TITLE}
                />

                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  error={formik.touched.ICON && Boolean(formik.errors.ICON)}>
                  <InputLabel>Icono</InputLabel>
                  <Select
                    name="ICON"
                    value={formik.values.ICON}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Icono"
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                        {selected && <FontAwesomeIcon icon={CATEGORY_ICON_MAP[selected]} />}
                        {selected || 'Selecciona un icono'}
                      </Box>
                    )}>
                    {CATEGORY_ICON_OPTIONS.map((iconKey) => (
                      <MenuItem key={iconKey} value={iconKey}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                          <FontAwesomeIcon icon={CATEGORY_ICON_MAP[iconKey]} />
                          {iconKey}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3
                  }}>
                  <Button onClick={handleClose}>Cancelar</Button>

                  <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Guardando...' : 'Editar'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" onClose={handleCloseToast}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentCategoryEditModal;

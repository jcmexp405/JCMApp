import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CATEGORY_ICON_MAP, CATEGORY_ICON_OPTIONS } from '../../constants/constants';
import { postNewDocumentType } from '../../services/documentsService';
import * as Yup from 'yup';

const DocumentTypeNewModal = ({ open, onClose, categoriesList = [], onCreated }) => {
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      category: '',
      icon: '',
      maxFiles: 1
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required('Requerido'),
      category: Yup.string().required('Selecciona una categoría'),
      icon: Yup.string().required('Selecciona un icono'),
      maxFiles: Yup.number()
        .required('Requerido')
        .min(1, 'Debe ser al menos 1')
        .max(2, 'No puede ser mayor a 2')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const docRef = await postNewDocumentType(values);

        if (docRef?.id) {
          setToast({
            open: true,
            severity: 'success',
            message: 'Tipo de documento creado.'
          });

          helpers.resetForm();
          onClose?.();
          await onCreated?.();
        } else {
          setToast({ open: true, severity: 'error', message: 'No se pudo crear.' });
        }
      } catch (e) {
        setToast({
          open: true,
          severity: 'error',
          message: e?.message || 'Ocurrió un error al crear.'
        });
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  const handleToastClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast((t) => ({ ...t, open: false }));
  };

  const handleClose = () => {
    if (formik.isSubmitting) return;
    onClose?.();
    formik.resetForm();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Nuevo tipo de documento
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Crea un tipo de documento y asígnalo a una categoría.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            {/* Título */}
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Nombre del tipo"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* Categoría */}
            <FormControl
              fullWidth
              size="small"
              margin="normal"
              error={formik.touched.category && Boolean(formik.errors.category)}>
              <InputLabel id="category-label">Categoría</InputLabel>
              <Select
                labelId="category-label"
                label="Categoría"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}>
                {categoriesList.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formik.errors.category}
                </Typography>
              )}
            </FormControl>

            {/* Icono */}
            <FormControl
              fullWidth
              size="small"
              margin="normal"
              error={formik.touched.icon && Boolean(formik.errors.icon)}>
              <InputLabel id="icon-label">Icono</InputLabel>
              <Select
                labelId="icon-label"
                label="Icono"
                name="icon"
                value={formik.values.icon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selected ? <FontAwesomeIcon icon={CATEGORY_ICON_MAP[selected]} /> : null}
                    <Typography variant="body2">{selected || 'Selecciona un icono'}</Typography>
                  </Box>
                )}>
                {CATEGORY_ICON_OPTIONS.map((iconKey) => (
                  <MenuItem key={iconKey} value={iconKey}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={CATEGORY_ICON_MAP[iconKey]} />
                      <Typography variant="body2">{iconKey}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.icon && formik.errors.icon && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formik.errors.icon}
                </Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Máximo de archivos aceptados"
              name="maxFiles"
              type="number"
              value={formik.values.maxFiles}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.maxFiles && Boolean(formik.errors.maxFiles)}
              helperText={formik.touched.maxFiles && formik.errors.maxFiles}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={formik.isSubmitting}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={formik.submitForm} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleToastClose} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentTypeNewModal;

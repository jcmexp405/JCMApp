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
import { editDocumentType } from '../../services/documentsService';
import * as Yup from 'yup';

const DocumentTypeEditModal = ({
  open,
  onClose,
  selectedDocType,
  categoriesList = [],
  onUpdated
}) => {
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: selectedDocType?.title || '',
      category: selectedDocType?.category || '',
      icon: selectedDocType?.icon || '',
      maxFiles: selectedDocType?.maxFiles || 1
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
        const res = await editDocumentType(selectedDocType.id, values);

        if (res?.message === 'Success') {
          setToast({ open: true, severity: 'success', message: 'Tipo de documento actualizado.' });
          helpers.resetForm();
          onClose?.();
          await onUpdated?.();
        } else {
          setToast({ open: true, severity: 'error', message: 'No se pudo actualizar.' });
        }
      } catch (e) {
        setToast({
          open: true,
          severity: 'error',
          message: e?.message || 'Ocurrió un error al actualizar.'
        });
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  const handleCloseToast = (_, reason) => {
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
          Editar tipo de documento
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Actualiza el nombre, categoría e icono.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            {/* TITLE */}
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Nombre del tipo"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {/* CATEGORY */}
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel id="cat-label">Categoría</InputLabel>
              <Select
                labelId="cat-label"
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
            </FormControl>

            {/* ICON */}
            <FormControl fullWidth size="small" margin="normal">
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
            {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentTypeEditModal;

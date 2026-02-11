import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { newCategoryValidationSchema } from '../../validations/newCategoryValidation';
import { SuccessAlert } from '../Common';
import { postNewCategory } from '../../services/documentsService';

// FontAwesome (React)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CATEGORY_ICON_MAP, CATEGORY_ICON_OPTIONS } from '../../constants/constants';

const DocumentsNewForm = ({ fetchCategories }) => {
  const [errorMsg, setErrorMsg] = useState({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ICON: '',
      TITLE: ''
    },
    validationSchema: newCategoryValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        setErrorMsg({});

        const response = await postNewCategory(values);

        if (response?.message === 'Success') {
          SuccessAlert('Categoría creada', 'Se ha creado la categoría con éxito');

          helpers.resetForm(); // ✅ correcto

          if (typeof fetchCategories === 'function') {
            await fetchCategories(); // ✅ espera el refresh
          }
        } else {
          console.log(response);
          setErrorMsg(response);
        }
      } catch (error) {
        console.error(error);
        setErrorMsg({
          message: 'Ocurrió un error al guardar',
          error: { code: error?.message || 'UNKNOWN' }
        });
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          p: { xs: 2.5, md: 3 },
          borderBottom: '1px solid',
          borderColor: '#e0e0e0'
        }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            m: 0,
            color: '#424242'
          }}>
          Nueva Categoría
        </Typography>
      </Box>

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
              Información de la Categoría
            </Typography>
            <Divider sx={{ mt: 1, mb: 3 }} />

            {/* TITLE */}
            <TextField
              fullWidth
              color="primary"
              id="TITLE"
              name="TITLE"
              label="Nombre"
              variant="outlined"
              margin="normal"
              size="small"
              value={formik.values.TITLE}
              onChange={formik.handleChange}
              error={formik.touched.TITLE && Boolean(formik.errors.TITLE)}
              helperText={formik.touched.TITLE && formik.errors.TITLE}
            />

            {/* ICON */}
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              error={formik.touched.ICON && Boolean(formik.errors.ICON)}>
              <InputLabel id="icon-label">Icono</InputLabel>
              <Select
                labelId="icon-label"
                id="ICON"
                name="ICON"
                label="Icono"
                value={formik.values.ICON}
                onChange={formik.handleChange}
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

              {formik.touched.ICON && formik.errors.ICON && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formik.errors.ICON}
                </Typography>
              )}
            </FormControl>
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
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default DocumentsNewForm;

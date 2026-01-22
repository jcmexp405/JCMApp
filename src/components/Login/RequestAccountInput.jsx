import { Box, TextField } from '@mui/material';

const RequestAccountInput = ({ formik }) => {
  return (
    <>
      <Box mb={3}>
        <TextField
          fullWidth
          id="USER"
          name="USER"
          label="Nombre"
          placeholder="Nombre completo"
          margin="normal"
          value={formik.values.USER}
          onChange={formik.handleChange}
          error={formik.touched.USER && Boolean(formik.errors.USER)}
          helperText={formik.touched.USER && formik.errors.USER}
        />
      </Box>
      <Box mb={3}>
        <TextField
          fullWidth
          id="EMAIL"
          name="EMAIL"
          label="Email"
          placeholder="correo@empresa.com"
          margin="normal"
          value={formik.values.EMAIL}
          onChange={formik.handleChange}
          error={formik.touched.EMAIL && Boolean(formik.errors.EMAIL)}
          helperText={formik.touched.EMAIL && formik.errors.EMAIL}
        />
      </Box>
    </>
  );
};

export default RequestAccountInput;

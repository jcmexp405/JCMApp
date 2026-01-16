import { Box, TextField } from '@mui/material';

const ResetPasswordInput = ({ formik }) => {
  return (
    <Box mb={3}>
      <TextField
        fullWidth
        id="USER"
        name="USER"
        label="Email"
        placeholder="correo@empresa.com"
        margin="normal"
        value={formik.values.USER}
        onChange={formik.handleChange}
        error={formik.touched.USER && Boolean(formik.errors.USER)}
        helperText={formik.touched.USER && formik.errors.USER}
      />
    </Box>
  );
};

export default ResetPasswordInput;

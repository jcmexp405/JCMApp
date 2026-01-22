import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginInputs = ({ formik }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <TextField
        fullWidth
        id="USER"
        name="USER"
        label="Email"
        variant="outlined"
        margin="normal"
        value={formik.values.USER}
        onChange={formik.handleChange}
        error={formik.touched.USER && Boolean(formik.errors.USER)}
        helperText={formik.touched.USER && formik.errors.USER}
      />

      <TextField
        fullWidth
        id="PASSWORD"
        name="PASSWORD"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        value={formik.values.PASSWORD}
        onChange={formik.handleChange}
        error={formik.touched.PASSWORD && Boolean(formik.errors.PASSWORD)}
        helperText={formik.touched.PASSWORD && formik.errors.PASSWORD}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  style={{ color: '#94a3b8' }}
                />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          component={Link}
          to="/requestaccount"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'right',
            fontSize: '0.85rem',
            color: '#7dd3fc',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}>
          ¿Aún no tienes cuenta? Solicitar cuenta
        </Typography>

        <Typography
          component={Link}
          to="/resetpassword"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'right',
            fontSize: '0.85rem',
            color: '#7dd3fc',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}>
          ¿Olvidaste tu contraseña?
        </Typography>
      </div>
    </Box>
  );
};

export default LoginInputs;

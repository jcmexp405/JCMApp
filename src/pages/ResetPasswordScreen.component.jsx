import { Alert, Grid, Box, Typography, Fade, Paper, alpha, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import { resetPasswordValidationSchema } from '../validations/resetPassword';
import { userResetPassword } from '../actions/loginActions';
import { useDispatch, useSelector } from 'react-redux';
import { ResetPasswordInput, ResetPasswordButton } from '../components/Login';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from 'react-router-dom';

const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const { resetPass } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { USER: '' },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: ({ USER }) => {
      dispatch(userResetPassword(USER));
    }
  });

  return (
    <Grid
      container
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'radial-gradient(circle at top, #00356a 0%, #001e3c 40%, #000d19 100%)'
      }}>
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 2,
            p: 4,
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            backgroundColor: alpha('#ffffff', 0.08),
            border: `1px solid ${alpha('#ffffff', 0.15)}`,
            boxShadow: '0 40px 120px rgba(0,0,0,0.4)'
          }}>
          {/* 🔙 BACK */}
          <Box mb={3}>
            <IconButton
              component={Link}
              to="/login"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                gap: 1,
                fontSize: '0.9rem'
              }}>
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
              Regresar
            </IconButton>
          </Box>

          {/* 🔹 HEADER */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
              Restablecer contraseña
            </Typography>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Ingresa el email asociado a tu cuenta y te enviaremos un correo con las instrucciones
              para recuperar tu contraseña.
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            {resetPass?.message && (
              <Alert
                variant="filled"
                severity={resetPass.error ? 'error' : 'success'}
                sx={{ mb: 3, borderRadius: '12px' }}>
                {resetPass.message}
              </Alert>
            )}

            <ResetPasswordInput formik={formik} />
            <ResetPasswordButton />
          </form>

          <Typography
            variant="caption"
            align="center"
            sx={{ mt: 4, display: 'block', opacity: 0.6 }}>
            © {new Date().getFullYear()} · Plataforma interna
          </Typography>
        </Paper>
      </Fade>
    </Grid>
  );
};

export default ResetPasswordScreen;

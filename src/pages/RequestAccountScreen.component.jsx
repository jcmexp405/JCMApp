import { Grid, Paper, Box, Typography, IconButton, Fade, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { requestAccountValidationSchema } from '../validations/accountRequest';
import RequestAccountInput from '../components/Login/RequestAccountInput';
import RequestAccountButton from '../components/Login/RequestAccountButton';
import { postUserRequest } from '../services/usersService';
import { useState } from 'react';

const RequestAccountScreen = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { USER: '', EMAIL: '' },
    validationSchema: requestAccountValidationSchema,
    onSubmit: async ({ USER, EMAIL }) => {
      setError(null);
      setLoading(true);
      try {
        await postUserRequest({ USER, EMAIL });
        navigate('/successmessage');
      } catch (err) {
        setError('Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.');
        console.error('Error submitting request:', err);
      } finally {
        setLoading(false);
      }
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
              Solicitar cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Ingresa tu nombre y correo electrónico para solicitar una nueva cuenta. Nuestro equipo
              se pondrá en contacto contigo lo antes posible.
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <RequestAccountInput formik={formik} />
            <RequestAccountButton loading={loading} />
          </form>

          <Typography
            variant="caption"
            align="center"
            sx={{ mt: 4, display: 'block', opacity: 0.6 }}>
            © {new Date().getFullYear()} · JCM Expansión
          </Typography>
        </Paper>
      </Fade>
    </Grid>
  );
};

export default RequestAccountScreen;

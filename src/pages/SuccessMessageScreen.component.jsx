import { Grid, Paper, Box, Typography, Button, Fade } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from 'react-router-dom';

const SuccessMessageScreen = () => {
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
            boxShadow: '0 40px 120px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}>
          {/* Success Icon */}
          <Box mb={3}>
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 80,
                color: '#22c55e'
              }}
            />
          </Box>

          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
              ¡Solicitud enviada!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mt: 2 }}>
              Tu solicitud fue enviada a nuestro equipo. Serás notificado por correo electrónico
              cuando tu cuenta esté lista.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 2 }}>
              Generalmente procesamos las solicitudes en 24-48 horas.
            </Typography>
          </Box>

          {/* Return Button */}
          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              height: 52,
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2dd4bf, #22c55e)',
              color: '#00356a',
              '&:hover': {
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                opacity: 0.7,
                color: '#00356a'
              }
            }}>
            Volver al inicio de sesión
          </Button>

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

export default SuccessMessageScreen;

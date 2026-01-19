import { Box, Typography, Container, Paper, Stack, Fade, alpha } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpScreen = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
        py: 4
      }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              backgroundColor: alpha('#ffffff', 0.95),
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              boxShadow: '0 40px 120px rgba(0,0,0,0.3)'
            }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <HelpOutlineIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: '#00356a',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}>
                Ayuda y Soporte
              </Typography>

              <Typography variant="body1" sx={{ color: '#5a6c7d', lineHeight: 1.7 }}>
                ¿Necesitas ayuda con la aplicación? Nuestro equipo está aquí para asistirte.
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: alpha('#00356a', 0.05),
                  border: `2px solid ${alpha('#00356a', 0.1)}`
                }}>
                <Stack spacing={2} alignItems="center">
                  <EmailIcon sx={{ fontSize: 32, color: '#00356a' }} />
                  <Typography variant="body2" sx={{ color: '#5a6c7d', fontWeight: 600 }}>
                    Contáctanos por correo electrónico
                  </Typography>
                  <Typography
                    component="a"
                    href="mailto:jcmexpansion@hotmail.com"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#00356a',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}>
                    jcmexpansion@hotmail.com
                  </Typography>
                </Stack>
              </Box>

              <Typography variant="caption" sx={{ color: alpha('#5a6c7d', 0.7), mt: 2 }}>
                Responderemos tu consulta lo antes posible
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default HelpScreen;

import { Box, Typography, Container, Paper, Stack, Fade, alpha } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AlertsTable } from '../components/Alerts';
import { ResponsiveAppBar } from '../components/Common';
import { useAuthState } from '../hooks/useAuthState';

const AlertsScreen = () => {
  const { user, authReady } = useAuthState();
  const { user: userRole } = useSelector((state) => state.auth);

  if (!authReady) return null;

  if (!user || userRole?.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Fragment>
      <ResponsiveAppBar />

      {/* Hero Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 4, md: 6 },
          pb: { xs: 10, md: 12 }
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={600}>
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 84,
                  height: 84,
                  background: alpha('#ffffff', 0.15),
                  backdropFilter: 'blur(12px)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha('#ffffff', 0.25)}`
                }}>
                <NotificationsIcon sx={{ fontSize: 56, color: 'white' }} />
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    letterSpacing: '-0.02em'
                  }}>
                  Alertas
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#ffffff', 0.85),
                  maxWidth: 560
                }}>
                En esta sección puedes consultar y administrar las alertas generadas para todos los
                usuarios del sistema.{' '}
              </Typography>
            </Stack>
          </Fade>
        </Container>
      </Box>
      {/* CONTENT */}
      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          mt: '-10px',
          position: 'relative',
          zIndex: 2,
          pb: 6
        }}>
        <Container style={{ marginTop: '15px' }} maxWidth="lg">
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                background: 'linear-gradient(to bottom, #ffffff, #fafbfc)'
              }}>
              {/* HEADER */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  p: 3
                }}>
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.4rem'
                  }}>
                  Listado de alertas
                </Typography>
              </Box>

              {/* TABLE */}
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <AlertsTable />
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Fragment>
  );
};

export default AlertsScreen;

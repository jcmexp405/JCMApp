import { Box, Typography, Container, Paper, Stack, Fade, alpha } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getAuth } from 'firebase/auth';
import { useEffect, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AlertsTable } from '../components/Alerts';
import { ResponsiveAppBar } from '../components/Common';

const auth = getAuth();

const AlertsScreen = () => {
  // 🔐 AUTH STATE CORRECTO
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const { user: userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  // ⏳ Esperar a Firebase
  if (!authReady) return null;

  // 🚫 No autorizado
  if (!user || userRole?.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Fragment>
      <ResponsiveAppBar />

      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  background: alpha('#ffffff', 0.15),
                  backdropFilter: 'blur(10px)',
                  borderRadius: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${alpha('#ffffff', 0.2)}`
                }}>
                <NotificationsIcon sx={{ fontSize: 56, color: 'white' }} />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '2.3rem', md: '3.3rem' }
                }}>
                Alertas
              </Typography>

              <Typography
                sx={{
                  color: alpha('#ffffff', 0.9),
                  maxWidth: 700,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  lineHeight: 1.6
                }}>
                En esta sección puedes consultar y administrar las alertas generadas para todos los
                usuarios del sistema.
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
                  📋 Listado de alertas
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

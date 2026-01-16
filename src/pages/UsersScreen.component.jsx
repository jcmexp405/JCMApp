import { Button, Typography, Paper, Stack, Container, alpha, Fade, Chip } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { NewUserModal, UsersTable } from '../components/Users';
import { ResponsiveAppBar } from '../components/Common';
import { useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuthState } from '../hooks/useAuthState';

const UsersScreen = () => {
  const [open, setOpen] = useState(false);
  const { user, authReady } = useAuthState();
  const { user: userRole } = useSelector((state) => state.auth);
  const onOpenModal = () => {
    setOpen(true);
  };

  if (!authReady) return null;

  if (!user || userRole?.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
                <GroupsIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    letterSpacing: '-0.02em'
                  }}>
                  Gestión de Usuarios
                </Typography>

                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: 14, color: 'white !important' }} />}
                  label="Admin"
                  size="small"
                  sx={{
                    background: alpha('#ffffff', 0.2),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Stack>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#ffffff', 0.85),
                  maxWidth: 560
                }}>
                Administra y controla todos los usuarios de la plataforma
              </Typography>

              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={onOpenModal}
                sx={{
                  backgroundColor: 'white',
                  color: '#00356a',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 999,
                  textTransform: 'none'
                }}>
                Crear Usuario
              </Button>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#e5e8eb',
          marginTop: '-60px',
          position: 'relative',
          zIndex: 2
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)'
              }}>
              {/* Table Header with Gradient Bar */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  padding: { xs: 2, md: 3 },
                  borderBottom: '4px solid #e5e8eb'
                }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.2rem' },
                    letterSpacing: '0.01em'
                  }}>
                  Directorio de Usuarios
                </Typography>
              </Box>

              {/* Table Content */}
              <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
                <UsersTable />
              </Box>
            </Paper>
          </Fade>
        </Container>

        {/* Bottom Spacing */}
        <Box sx={{ height: { xs: 40, md: 60 } }} />
      </Box>

      <NewUserModal open={open} setOpen={setOpen} />
    </Box>
  );
};

export default UsersScreen;

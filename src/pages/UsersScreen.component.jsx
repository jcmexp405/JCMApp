import { Button, Typography, Paper, Stack, Container, alpha, Fade, Chip } from '@mui/material';
import { Box } from '@mui/system';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { NewUserModal, UsersTable } from '../components/Users';
import { ResponsiveAppBar } from '../components/Common';
import { useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const auth = getAuth();

const UsersScreen = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const { user: userRole } = useSelector((state) => state.auth);
  const onOpenModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, []);

  return user && userRole?.type === 'admin' ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ResponsiveAppBar />

      {/* Hero Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: { xs: 6, md: 10 },
          paddingBottom: { xs: 8, md: 12 }
        }}>
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0,53,106,0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 15s ease-in-out infinite reverse'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              {/* Icon Badge */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  background: alpha('#ffffff', 0.15),
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${alpha('#ffffff', 0.2)}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}>
                <GroupsIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>

              {/* Title with Chip */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                justifyContent="center">
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                  }}>
                  Gestión de Usuarios
                </Typography>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                  label="Admin"
                  size="small"
                  sx={{
                    background: alpha('#ffffff', 0.2),
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    border: `1px solid ${alpha('#ffffff', 0.3)}`,
                    fontSize: '0.9rem',
                    height: 32
                  }}
                />
              </Stack>

              {/* Description */}
              <Typography
                variant="h6"
                sx={{
                  color: alpha('#ffffff', 0.9),
                  maxWidth: '700px',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6
                }}>
                Administra y controla todos los usuarios de tu plataforma desde un solo lugar
              </Typography>

              {/* CTA Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={onOpenModal}
                sx={{
                  mt: 1,
                  backgroundColor: 'white',
                  color: '#00356a',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none'
                }}>
                Crear Nuevo Usuario
              </Button>
            </Stack>
          </Fade>
        </Container>

        {/* Keyframe animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(30px, -30px) rotate(120deg); }
              66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
          `}
        </style>
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
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
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
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
};
export default UsersScreen;

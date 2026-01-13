import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Typography, Container, Paper, Stack, Fade, Chip, alpha } from '@mui/material';
import { Box } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../actions/userActions';
import NewAlertModal from '../components/Alerts/NewAlertModal.component';
import { ResponsiveAppBar } from '../components/Common';
import UserDetailsTable from '../components/Users/UserDetailsTable.component';
import PersonIcon from '@mui/icons-material/Person';

const auth = getAuth();

const UserDetailsScreen = () => {
  const dispatch = useDispatch();
  const { idUsuario } = useParams();

  // 🔐 AUTH STATE (CORRECTO)
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const { selectedUser } = useSelector((state) => state.documents);
  const { user: userRole } = useSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);

  // 📦 DATA
  useEffect(() => {
    if (idUsuario) {
      dispatch(startGetDocumentsSuccess(idUsuario));
    }
  }, [dispatch, idUsuario]);

  // 🔐 FIREBASE AUTH (SIN RACE CONDITIONS)
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  // ⏳ ESPERA A FIREBASE
  if (!authReady) return null;

  // 🚫 NO AUTORIZADO
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
                <PersonIcon sx={{ fontSize: 56, color: 'white' }} />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '2.3rem', md: '3.3rem' }
                }}>
                {selectedUser?.name}
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Chip
                  label={selectedUser?.company}
                  sx={{
                    background: alpha('#ffffff', 0.2),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip
                  label={selectedUser?.email}
                  sx={{
                    background: alpha('#ffffff', 0.15),
                    color: 'white'
                  }}
                />
              </Stack>

              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faBell} />}
                onClick={() => setOpenModal(true)}
                sx={{
                  mt: 2,
                  backgroundColor: 'white',
                  color: '#00356a',
                  fontWeight: 700,
                  px: 5,
                  py: 1.8,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,.3)',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.95),
                    transform: 'translateY(-3px)'
                  }
                }}>
                Crear Alerta
              </Button>
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
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  p: 3
                }}>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.4rem' }}>
                  📋 Detalle del Usuario
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <UserDetailsTable />
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      <NewAlertModal open={openModal} setOpen={setOpenModal} />
    </Fragment>
  );
};

export default UserDetailsScreen;

import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Typography,
  Container,
  Paper,
  Stack,
  Fade,
  Chip,
  alpha,
  Tabs,
  Tab
} from '@mui/material';
import { Box } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../actions/userActions';
import NewAlertModal from '../components/Alerts/NewAlertModal.component';
import { ResponsiveAppBar } from '../components/Common';
import UserDetailsTable from '../components/Users/UserDetailsTable.component';
import UserAlertsTable from '../components/Alerts/UserAlertsTable.component';
import { getUserAlertsSuccess } from '../services/alertsService';

const auth = getAuth();

const UserDetailsScreen = () => {
  const dispatch = useDispatch();
  const { idUsuario } = useParams();

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);

  const { selectedUser } = useSelector((state) => state.documents);
  const { user: userRole } = useSelector((state) => state.auth);
  const [alertsList, setAlertsList] = useState([]);

  const handleGetAlerts = async (idUsuario) => {
    const response = await getUserAlertsSuccess(idUsuario);
    setAlertsList(response);
  };
  useEffect(() => {
    if (idUsuario) {
      handleGetAlerts(idUsuario);
    }
  }, [idUsuario]);

  useEffect(() => {
    if (idUsuario) {
      dispatch(startGetDocumentsSuccess(idUsuario));
    }
  }, [dispatch, idUsuario]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  if (!authReady) return null;
  if (!user || userRole?.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  const SectionHeader = ({ title, subtitle }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: 'text.primary'
        }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 0.5
        }}>
        {subtitle}
      </Typography>
    </Box>
  );

  return (
    <Fragment>
      <ResponsiveAppBar />

      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 }
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {selectedUser?.name}
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap">
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
                size="small"
                startIcon={<FontAwesomeIcon icon={faBell} />}
                onClick={() => setOpenModal(true)}
                sx={{
                  backgroundColor: 'white',
                  color: '#00356a',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none'
                }}>
                Crear Alerta
              </Button>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          mt: '-10px',
          pb: 6
        }}>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
              }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  px: 3,
                  pt: 2
                }}>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  textColor="inherit"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: 'white',
                      height: 3,
                      borderRadius: 3
                    }
                  }}
                  sx={{
                    '& .MuiTab-root': {
                      color: alpha('#fff', 0.7),
                      fontWeight: 600,
                      textTransform: 'none'
                    },
                    '& .Mui-selected': {
                      color: 'white'
                    }
                  }}>
                  <Tab label="Documentos" />
                  <Tab label="Alertas" />
                </Tabs>
              </Box>

              <Box sx={{ p: { xs: 2, md: 4 } }}>
                {tab === 0 && (
                  <>
                    <SectionHeader
                      title="Documentos del Usuario"
                      subtitle="Aquí puedes ver y gestionar los documentos del usuario."
                    />
                    <UserDetailsTable />
                  </>
                )}
                {tab === 1 && (
                  <>
                    <SectionHeader
                      title="Alertas del Usuario"
                      subtitle="Aquí puedes ver y gestionar las alertas del usuario."
                    />
                    <UserAlertsTable
                      alertsList={alertsList}
                      handleGetAlerts={handleGetAlerts}
                      idUsuario={idUsuario}
                    />
                  </>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      <NewAlertModal
        open={openModal}
        setOpen={setOpenModal}
        handleGetAlerts={handleGetAlerts}
        idUsuario={idUsuario}
      />
    </Fragment>
  );
};

export default UserDetailsScreen;

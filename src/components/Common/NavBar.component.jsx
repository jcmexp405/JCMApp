import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { faArrowRightFromBracket, faFile, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Badge, BottomNavigation, BottomNavigationAction, Paper, Box, alpha } from '@mui/material';

import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../../firebaseElements/firebase';

import { logOut } from '../../services/loginService';
import { setCurrentPath, logout } from '../../actions/loginActions';
import { persistor } from '../../store/store';

const db = getFirestore(app);

const NavBar = () => {
  const { user: currentUser, currentPath } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'alerts'),
      where('user', '==', currentUser.uid),
      where('status', '==', 'Pendiente')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTasksCount(snapshot.size);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  const handleChange = (_, value) => {
    if (value === 'logout') {
      handleLogout();
      return;
    }

    dispatch(setCurrentPath(value));
    navigate(`/${value}`);
  };

  const handleLogout = async () => {
    try {
      // Limpiar estado de Redux primero
      dispatch(logout());
      // Cerrar sesión en Firebase
      await logOut();
      // Limpiar persistor
      await persistor.purge();
      // Navegar al login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#ffffff',
        zIndex: 1300
      }}>
      <BottomNavigation
        showLabels
        value={currentPath?.path}
        onChange={handleChange}
        sx={{
          height: 76,
          px: 1,

          '& .MuiBottomNavigationAction-root': {
            color: '#8a97a6',
            transition: 'all 0.25s ease',
            minWidth: 72,
            py: 1
          },

          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontWeight: 600,
            transition: 'all 0.25s ease'
          },

          '& .Mui-selected': {
            color: '#00356a'
          },

          '& .Mui-selected .MuiBottomNavigationAction-label': {
            fontSize: '0.8rem',
            fontWeight: 700
          },

          '& .Mui-selected svg': {
            transform: 'scale(1.15)',
            transition: 'transform 0.25s ease'
          }
        }}>
        {/* DOCUMENTOS */}
        <BottomNavigationAction
          label="Documentos"
          value="documentos"
          icon={
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                transition: 'all 0.25s ease',
                backgroundColor: 'transparent',
                '.Mui-selected &': {
                  backgroundColor: alpha('#00356a', 0.12)
                }
              }}>
              <FontAwesomeIcon icon={faFile} />
            </Box>
          }
        />

        {/* TAREAS */}
        <BottomNavigationAction
          label="Tareas"
          value="tareas"
          icon={
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                transition: 'all 0.25s ease',
                backgroundColor: 'transparent',
                '.Mui-selected &': {
                  backgroundColor: alpha('#00356a', 0.12)
                }
              }}>
              <Badge badgeContent={tasksCount} color="success" invisible={tasksCount === 0}>
                <FontAwesomeIcon icon={faListCheck} />
              </Badge>
            </Box>
          }
        />

        {/* LOGOUT */}
        <BottomNavigationAction
          label="Salir"
          value="logout"
          icon={
            <Box sx={{ color: '#8a97a6' }}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </Box>
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default NavBar;

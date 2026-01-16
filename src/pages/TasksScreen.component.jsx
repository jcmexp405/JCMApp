import { Box, Grid, Typography, Fade, alpha } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { NavBar } from '../components/Common';
import { NoTasksFoundMessage, TaskCard } from '../components/Tasks';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../firebaseElements/firebase';
import { useAuthState } from '../hooks/useAuthState';

const db = getFirestore(app);

const TasksScreen = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const { user, authReady } = useAuthState();
  const [tasksList, setTasksList] = useState([]);

  /* 📡 REALTIME TASKS */
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'alerts'),
      where('user', '==', currentUser.uid),
      where('status', '==', 'Pendiente')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTasksList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [currentUser?.uid]);

  if (!authReady) return null;

  if (!user || currentUser?.type !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Fragment>
      {/* 🔹 HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 4, md: 5 },
          pb: { xs: 5, md: 6 },
          textAlign: 'center'
        }}>
        <Fade in timeout={600}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1
              }}>
              Mis Tareas
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 520,
                mx: 'auto'
              }}>
              Aquí puedes ver las tareas pendientes que requieren tu atención
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 🔹 CONTENT */}
      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          minHeight: 'calc(100vh - 180px)',
          mt: '-16px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          px: { xs: 2, md: 3 },
          pt: { xs: 3, md: 4 }
        }}>
        <Grid container spacing={2}>
          {tasksList && tasksList.length > 0 ? (
            tasksList.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <NoTasksFoundMessage />
          )}
        </Grid>
      </Box>

      <NavBar />
    </Fragment>
  );
};

export default TasksScreen;

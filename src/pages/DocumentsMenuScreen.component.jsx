import { CircularProgress, Grid, Box, Typography, Fade, alpha } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAllDocumentCategories } from '../services/documentsService';
import NavBar from '../components/Common/NavBar.component';
import { DocumentCard } from '../components/Documents';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingDocumentTypes } from '../actions/loadingActions';
import { useAuthState } from '../hooks/useAuthState';

const DocumentsMenuScreen = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const { user, authReady } = useAuthState();

  const { user: userRole } = useSelector((state) => state.auth);
  const { loadingDocumentTypes } = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      dispatch(setLoadingDocumentTypes(true));
      const docs = await getAllDocumentCategories();
      setCategoriesList(docs);
      dispatch(setLoadingDocumentTypes(false));
    };
    load();
  }, [dispatch]);

  // ⛔ ESPERA A FIREBASE
  if (!authReady) return null;

  // 🚫 NO AUTORIZADO
  if (!user || userRole?.type !== 'user') {
    return <Navigate to="/login" replace />;
  }

  // ✅ UI NORMAL
  return (
    <>
      {/* 🔹 HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 4, md: 5 },
          pb: { xs: 5, md: 6 },
          textAlign: 'center'
        }}>
        <Fade in timeout={700}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1
              }}>
              Mis Documentos
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 520,
                mx: 'auto'
              }}>
              Selecciona una categoría para consultar o subir tus documentos
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
        {loadingDocumentTypes ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {categoriesList.map((item) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={item.id}>
                <DocumentCard cardCathegory={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <NavBar />
    </>
  );
};
export default DocumentsMenuScreen;

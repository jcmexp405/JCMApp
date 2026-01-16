import { CircularProgress, List, Box, Typography, Fade, alpha, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getAllDocumetsByCategory } from '../services/documentsService';
import NavBar from '../components/Common/NavBar.component';
import DocumentsListCard from '../components/Documents/DocumentsListCard.component';
import { useDispatch, useSelector } from 'react-redux';
import NoDocumetsType from '../components/Documents/NoDocumetsType.component';
import { setLoadingDocumentCategories } from '../actions/loadingActions';
import { useAuthState } from '../hooks/useAuthState';

const DocumentsListScreen = () => {
  const { idCategory } = useParams();
  const { user: userRole } = useSelector((state) => state.auth);
  const { loadingDocumentCategories } = useSelector((state) => state.loading);

  const [documentsList, setDocumentsList] = useState([]);
  const { user, authReady } = useAuthState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!idCategory || !userRole?.uid) return;

    const load = async () => {
      dispatch(setLoadingDocumentCategories(true));
      const docs = await getAllDocumetsByCategory(userRole.uid, idCategory);
      setDocumentsList(docs);
      dispatch(setLoadingDocumentCategories(false));
    };

    load();
  }, [dispatch, idCategory, userRole?.uid]);

  if (!authReady) return null;

  if (!user || userRole?.type !== 'user') {
    return <Navigate to="/login" replace />;
  }

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
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Documentos
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 520,
                mx: 'auto'
              }}>
              Consulta y visualiza los documentos disponibles en esta categoría
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
        <Fade in timeout={900}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: 640,
              mx: 'auto',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.08)'
            }}>
            {loadingDocumentCategories ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            ) : documentsList && documentsList.length > 0 ? (
              <List disablePadding>
                {documentsList.map((document) => (
                  <DocumentsListCard document={document} key={document.id} />
                ))}
              </List>
            ) : (
              <NoDocumetsType />
            )}
          </Paper>
        </Fade>
      </Box>

      <NavBar />
    </>
  );
};

export default DocumentsListScreen;

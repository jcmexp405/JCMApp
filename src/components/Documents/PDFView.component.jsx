import { Box, Button, Typography, Fade, alpha, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NavBar from '../Common/NavBar.component';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuthState } from '../../hooks/useAuthState';

const PDFView = () => {
  const { document } = useSelector((state) => state.documents);
  const { url, category } = document || {};

  const { user, authReady } = useAuthState();

  // ⏳ Esperar auth
  if (!authReady) return null;

  // 🚫 No autorizado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* 🔹 HEADER */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 },
          textAlign: 'center'
        }}>
        <Fade in timeout={600}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                fontWeight: 600,
                mb: 0.5
              }}>
              Documento
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                px: 2
              }}>
              {category || 'Vista previa'}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 🔹 CONTENT */}
      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          minHeight: 'calc(100vh - 160px)',
          mt: '-12px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          px: { xs: 1.5, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: 10
        }}>
        {!url ? (
          <Box height="50vh" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
              backgroundColor: '#fff'
            }}>
            <iframe
              title="pdf-view"
              src={url}
              style={{
                width: '100%',
                height: '70vh',
                border: 'none'
              }}
            />
          </Box>
        )}
      </Box>

      {/* 🔹 DOWNLOAD BUTTON (FLOATING) */}
      {url && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 88,
            left: 16,
            right: 16,
            zIndex: 1300
          }}>
          <Button
            component="a"
            href={url}
            download
            startIcon={<DownloadIcon />}
            fullWidth
            size="large"
            variant="contained"
            sx={{
              borderRadius: '14px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
            }}>
            Descargar documento
          </Button>
        </Box>
      )}

      <NavBar />
    </>
  );
};

export default PDFView;

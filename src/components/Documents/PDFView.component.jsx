import {
  Box,
  Button,
  Typography,
  Fade,
  alpha,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Chip
} from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NavBar from '../Common/NavBar.component';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuthState } from '../../hooks/useAuthState';

const PDFView = () => {
  const { document } = useSelector((state) => state.documents);
  const { user, authReady } = useAuthState();

  // ✅ Hooks SIEMPRE arriba (sin returns antes)
  const files = useMemo(() => {
    if (!document) return [];

    if (Array.isArray(document.files) && document.files.length) {
      return document.files
        .filter((f) => f?.url)
        .sort((a, b) => (a.fileIndex ?? 999) - (b.fileIndex ?? 999))
        .map((f, idx) => ({
          url: f.url,
          name: f.name || `Archivo ${idx + 1}`
        }));
    }

    const singleUrl = document.url || document.document;
    if (singleUrl) return [{ url: singleUrl, name: document.title || 'Documento' }];

    return [];
  }, [document]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [document?.id]);

  const activeFile = files[activeIndex];
  const title = document?.title || 'Vista previa';
  const category = document?.category || 'Documento';

  // ✅ Ahora sí: returns condicionales (después de hooks)
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          textAlign: 'center'
        }}>
        <Fade in timeout={600}>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: alpha('#ffffff', 0.85), fontWeight: 600, mb: 0.5 }}>
              Documento
            </Typography>

            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, px: 2 }}>
              {category}
            </Typography>

            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.85), mt: 0.5 }}>
              {title}
            </Typography>

            {files.length > 1 && (
              <Chip
                label={`${activeIndex + 1} / ${files.length}`}
                size="small"
                sx={{
                  mt: 1.5,
                  color: 'white',
                  borderColor: alpha('#fff', 0.35),
                  backgroundColor: alpha('#fff', 0.12)
                }}
                variant="outlined"
              />
            )}
          </Box>
        </Fade>
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          minHeight: 'calc(100vh - 160px)',
          mt: '-12px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          px: { xs: 1.5, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: 12
        }}>
        {/* Tabs si hay más de 1 */}
        {files.length > 1 && (
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={activeIndex}
              onChange={(_, v) => setActiveIndex(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                px: 1,
                boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 }
              }}>
              {files.map((f, idx) => (
                <Tab key={idx} label={f.name || `Archivo ${idx + 1}`} />
              ))}
            </Tabs>
          </Box>
        )}

        {!activeFile?.url ? (
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
              src={activeFile.url}
              style={{ width: '100%', height: '70vh', border: 'none' }}
            />
          </Box>
        )}
      </Box>

      {/* DOWNLOAD */}
      {activeFile?.url && (
        <Box sx={{ position: 'fixed', bottom: 88, left: 16, right: 16, zIndex: 1300 }}>
          <Stack spacing={1.25}>
            <Button
              component="a"
              href={activeFile.url}
              download
              startIcon={<DownloadIcon />}
              fullWidth
              size="large"
              variant="contained"
              sx={{
                borderRadius: '14px',
                py: 1.5,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
              }}>
              Descargar {files.length > 1 ? `(${activeIndex + 1}/${files.length})` : 'documento'}
            </Button>
          </Stack>
        </Box>
      )}

      <NavBar />
    </>
  );
};

export default PDFView;

import { Fragment, useEffect, useState } from 'react';
import { ResponsiveAppBar } from '../components/Common';
import {
  alpha,
  Box,
  Container,
  Fade,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import DocumentsCategories from '../components/Documents/DocumentsCategories.component';
import DocumentsPerCategorie from '../components/Documents/DocumentsPerCategorie.component';
import DocumentsNewForm from '../components/Documents/DocumentsNewForm.component';
import { getAllDocumentCategories } from '../services/documentsService';

const SettingsScreen = () => {
  const [tab, setTab] = useState(0);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const docs = await getAllDocumentCategories();
      setCategoriesList(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const SectionHeader = ({ title, subtitle }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
  );

  return (
    <Fragment>
      <ResponsiveAppBar />

      {/* HERO / HEADING */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
          pt: { xs: 3, md: 4 },
          pb: { xs: 6, md: 7 } // un poco más alto para que respire
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                Configuraciones
              </Typography>
              <Typography sx={{ color: 'white' }}>
                En esta sección encontrarás las configuraciones del sistema tales como categorías y
                documentos.
              </Typography>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* CONTENIDO (TABS + SECCIONES) - SEPARADO DEL HERO */}
      <Box
        sx={{
          backgroundColor: '#e5e8eb',
          pb: 6,
          minHeight: '100vh',
          pt: { xs: 3, md: 4 }
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                mt: { xs: 0, md: 0 }
              }}>
              {/* BARRA DE TABS */}
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
                  <Tab label="Categorías" />
                  <Tab label="Documentos por categoría" />
                </Tabs>
              </Box>

              {/* CONTENIDO DE TABS */}
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                {tab === 0 && (
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <SectionHeader
                        title="Categorías"
                        subtitle="Aquí puedes ver y gestionar las categorías."
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                        }}>
                        <DocumentsNewForm fetchCategories={fetchCategories} />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                        }}>
                        <DocumentsCategories
                          categoriesList={categoriesList}
                          loading={loading}
                          fetchCategories={fetchCategories}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {tab === 1 && (
                  <>
                    <SectionHeader
                      title="Documentos por categoría"
                      subtitle="Aquí puedes ver y gestionar los documentos por categoría."
                    />
                    <DocumentsPerCategorie categoriesList={categoriesList} />
                  </>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Fragment>
  );
};

export default SettingsScreen;

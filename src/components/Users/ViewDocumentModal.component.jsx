import { Modal, Typography, Box, Stack, Divider, IconButton, Tabs, Tab, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { useMemo, useState } from 'react';

const ViewDocumentModal = ({ open, setOpen, documentData }) => {
  const handleClose = () => setOpen(false);

  const files = useMemo(() => {
    if (!documentData) return [];
    if (Array.isArray(documentData.files) && documentData.files.length) {
      return documentData.files;
    }

    if (documentData.document) {
      return [{ url: documentData.document, name: documentData.title }];
    }

    return [];
  }, [documentData]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeFile = files[activeIndex];

  if (!documentData) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: '95%', md: '70%' },
          height: { xs: '90vh', md: '85vh' },
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 3,
          mx: 'auto',
          mt: '5vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
        }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              📄 {documentData.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Última modificación:{' '}
              {moment(documentData?.lastUpdate?.seconds * 1000).format('DD MMMM YYYY')}
            </Typography>

            {files.length > 1 && (
              <Chip
                label={`Archivo ${activeIndex + 1} de ${files.length}`}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {files.length > 1 && (
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={activeIndex}
              onChange={(_, v) => setActiveIndex(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600
                }
              }}>
              {files.map((file, idx) => (
                <Tab key={idx} label={file.name ? file.name : `Archivo ${idx + 1}`} />
              ))}
            </Tabs>
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
          <iframe
            title="pdf-view"
            src={activeFile?.url}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDocumentModal;

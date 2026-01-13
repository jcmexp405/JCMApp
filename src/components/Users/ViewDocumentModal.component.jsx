import { Modal, Typography, Box, Stack, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const ViewDocumentModal = ({ open, setOpen, documentData }) => {
  const handleClose = () => {
    setOpen(false);
  };

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
        {/* HEADER */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              📄 {documentData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última modificación:{' '}
              {moment(documentData?.lastUpdate?.seconds * 1000).format('DD MMMM YYYY')}
            </Typography>
          </Box>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* PDF VIEWER */}
        <Box
          sx={{
            flex: 1,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
          <iframe
            title="pdf-view"
            src={documentData.document}
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

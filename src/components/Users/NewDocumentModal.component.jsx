import { Alert, Box, Button, LinearProgress, Modal, Typography, Stack, alpha } from '@mui/material';
import React, { useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { postNewDocument } from '../../services/documentsService';
import { SuccessAlert } from '../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../../actions/userActions';

const storage = getStorage();

const NewDocumentModal = ({ open, setOpen, documentType }) => {
  const { selectedUser } = useSelector((state) => state.documents);
  const dispatch = useDispatch();
  const { idUsuario } = useParams();

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setErrorMsg('');
    setFile(null);
    setProgressPercent(0);
    setLoading(false);
    setOpen(false);
  };

  const validateSelectedFile = () => {
    const MAX_FILE_SIZE = 20480; // KB (20MB)

    if (!file) {
      setErrorMsg('Por favor selecciona un archivo');
      return;
    }

    if (file.size / 1024 > MAX_FILE_SIZE) {
      setErrorMsg('El archivo excede el límite de 20MB');
      return;
    }

    setErrorMsg('');
    handleSubmitDocument();
  };

  const handleSubmitDocument = () => {
    setLoading(true);

    const documentRef = ref(storage, `${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(documentRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressPercent(progress);
      },
      () => {
        setErrorMsg('Error al subir el archivo');
        setLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await postNewDocument(selectedUser.id, downloadURL, documentType.id);
        dispatch(startGetDocumentsSuccess(idUsuario));
        SuccessAlert('Documento cargado', 'El documento se cargó correctamente');
        handleClose();
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: '90%', sm: 480 },
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 4,
          mx: 'auto',
          mt: '10vh',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
        }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700}>
            📄 Cargar nuevo documento
          </Typography>

          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* UPLOAD ZONE */}
          {!loading ? (
            <>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <Box
                onClick={() => inputRef.current?.click()}
                sx={{
                  border: `2px dashed ${alpha('#001E3C', 0.4)}`,
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all .3s ease',
                  '&:hover': {
                    backgroundColor: alpha('#001E3C', 0.04)
                  }
                }}>
                <FontAwesomeIcon icon={faUpload} size="2x" style={{ color: '#001E3C' }} />
                <Typography mt={1} fontWeight={600}>
                  Seleccionar archivo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file ? (
                    <>
                      <FontAwesomeIcon icon={faFilePdf} /> {file.name}
                    </>
                  ) : (
                    'Formato PDF · Máx 20MB'
                  )}
                </Typography>
              </Box>
            </>
          ) : (
            <Stack spacing={2}>
              <Typography>Subiendo documento… por favor espera</Typography>
              <Typography variant="h4" textAlign="center">
                {progressPercent}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Stack>
          )}

          {/* ACTIONS */}
          <Stack direction="row" spacing={2}>
            <Button fullWidth variant="outlined" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={validateSelectedFile}
              disabled={!file || loading}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NewDocumentModal;

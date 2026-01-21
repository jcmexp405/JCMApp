import { Alert, Box, Button, LinearProgress, Modal, Typography, Stack, alpha } from '@mui/material';
import React, { useRef, useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../../actions/userActions';
import { postEditDocument } from '../../services/documentsService';
import { SuccessAlert } from '../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const storage = getStorage();

const EditDocumentModal = ({ open, setOpen, documentType }) => {
  const dispatch = useDispatch();
  const { idUsuario } = useParams();

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setFile(null);
    setProgressPercent(0);
    setErrorMsg('');
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
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          if (documentType?.document) {
            const oldRef = ref(storage, documentType.document);
            await deleteObject(oldRef);
          }

          await postEditDocument(documentType.id, downloadURL);
          dispatch(startGetDocumentsSuccess(idUsuario));

          SuccessAlert('Documento actualizado', 'El documento se actualizó correctamente');

          handleClose();
        } catch (error) {
          console.error(error);
          setErrorMsg('No se pudo actualizar el documento');
          setLoading(false);
        }
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
            ✏️ Actualizar documento
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
                  Seleccionar nuevo archivo
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
              <Typography>Actualizando documento… por favor espera</Typography>
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
              Guardar cambios
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditDocumentModal;

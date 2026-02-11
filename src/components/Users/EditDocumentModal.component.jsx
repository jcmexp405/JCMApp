import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Modal,
  Typography,
  Stack,
  alpha,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../../actions/userActions';
import { upsertUserDocumentFile } from '../../services/documentsService';
import { SuccessAlert } from '../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const storage = getStorage();

const EditDocumentModal = ({ open, setOpen, documentType }) => {
  const dispatch = useDispatch();
  const { idUsuario } = useParams();
  const { selectedUser } = useSelector((state) => state.documents);

  const inputRef = useRef(null);

  const maxFiles = documentType?.maxFiles || 1;

  const existingFiles = useMemo(() => documentType?.files || [], [documentType]);
  const slotOptions = useMemo(() => Array.from({ length: maxFiles }, (_, i) => i + 1), [maxFiles]);

  const [slot, setSlot] = useState(1);
  const [file, setFile] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setSlot(1);
    setFile(null);
    setProgressPercent(0);
    setLoading(false);
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  }, [open, documentType?.id]);

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const currentExisting = useMemo(() => {
    return existingFiles[slot - 1] || null;
  }, [existingFiles, slot]);

  const validateSelectedFile = () => {
    const MAX_FILE_SIZE = 20480;

    if (!file) return setErrorMsg('Por favor selecciona un archivo');
    if (file.type !== 'application/pdf') return setErrorMsg('El archivo debe ser PDF');
    if (file.size / 1024 > MAX_FILE_SIZE) return setErrorMsg('El archivo excede el límite de 20MB');

    setErrorMsg('');
    handleSubmit();
  };

  const uploadSingleFile = (fileToUpload) => {
    return new Promise((resolve, reject) => {
      const path = `users/${selectedUser.id}/documentTypes/${documentType.id}/${Date.now()}_${
        fileToUpload.name
      }`;
      const documentRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(documentRef, fileToUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgressPercent(progress);
        },
        (err) => reject(err),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setProgressPercent(0);

      const url = await uploadSingleFile(file);

      const result = await upsertUserDocumentFile({
        userId: selectedUser.id,
        documentTypeId: documentType.id,
        fileIndex: slot,
        documentURL: url,
        fileName: file.name
      });

      if (result.prevUrl) {
        try {
          const oldRef = ref(storage, result.prevUrl);
          await deleteObject(oldRef);
        } catch (e) {
          console.warn('No se pudo borrar el archivo anterior del storage:', e);
        }
      }

      dispatch(startGetDocumentsSuccess(idUsuario));
      SuccessAlert(
        'Documento actualizado',
        `Se actualizó el archivo ${slot}${maxFiles > 1 ? ` de ${maxFiles}` : ''}`
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.message || 'No se pudo actualizar el documento');
      setLoading(false);
    }
  };

  if (!documentType) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: '90%', sm: 520 },
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

          <Typography variant="body2" color="text.secondary">
            Tipo: <strong>{documentType.title}</strong> · Máx <strong>{maxFiles}</strong> archivo(s)
          </Typography>

          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {maxFiles > 1 && (
            <FormControl fullWidth size="small">
              <InputLabel id="slot-label">Archivo a actualizar</InputLabel>
              <Select
                labelId="slot-label"
                label="Archivo a actualizar"
                value={slot}
                onChange={(e) => setSlot(Number(e.target.value))}
                disabled={loading}>
                {slotOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    Archivo {n} {existingFiles[n - 1]?.url ? '• (ya existe)' : '• (vacío)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {currentExisting?.url && (
            <Alert severity="info">
              Actualmente: <strong>{currentExisting.name || `Archivo ${slot}`}</strong>
            </Alert>
          )}

          {!loading ? (
            <>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                  '&:hover': { backgroundColor: alpha('#001E3C', 0.04) }
                }}>
                <FontAwesomeIcon icon={faUpload} size="2x" style={{ color: '#001E3C' }} />
                <Typography mt={1} fontWeight={600}>
                  Seleccionar nuevo archivo (PDF)
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
              <Typography>Actualizando… por favor espera</Typography>
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

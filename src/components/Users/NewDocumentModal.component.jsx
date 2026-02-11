import { Alert, Box, Button, LinearProgress, Modal, Typography, Stack, alpha } from '@mui/material';
import React, { useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { postNewDocument } from '../../services/documentsService';
import { SuccessAlert } from '../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { startGetDocumentsSuccess } from '../../actions/userActions';

const storage = getStorage();

const NewDocumentModal = ({ open, setOpen, documentType }) => {
  const { selectedUser } = useSelector((state) => state.documents);
  const dispatch = useDispatch();
  const { idUsuario } = useParams();

  const inputRef = useRef(null);

  const maxFiles = documentType?.maxFiles || 1;

  const [files, setFiles] = useState([]); // ✅ ahora array
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ archivo actual (1..n)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setErrorMsg('');
    setFiles([]);
    setProgressPercent(0);
    setCurrentIndex(0);
    setLoading(false);
    setOpen(false);
  };

  const handlePickFiles = (picked) => {
    const incoming = Array.from(picked || []);
    if (!incoming.length) return;
    if (maxFiles === 1) {
      setFiles(incoming.slice(0, 1));
      if (inputRef.current) inputRef.current.value = '';
      setErrorMsg('');
      return;
    }

    setFiles((prev) => {
      // ✅ merge + dedupe por name/size/lastModified (evita duplicados)
      const merged = [...prev, ...incoming];
      const deduped = [];
      const seen = new Set();

      for (const f of merged) {
        const key = `${f.name}_${f.size}_${f.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(f);
        }
      }

      if (deduped.length > maxFiles) {
        setErrorMsg(`Solo puedes seleccionar máximo ${maxFiles} archivo(s).`);
        return deduped.slice(0, maxFiles);
      }

      setErrorMsg('');
      return deduped;
    });

    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateSelectedFiles = () => {
    const MAX_FILE_SIZE = 20480; // KB (20MB)

    if (!files.length) {
      setErrorMsg('Por favor selecciona al menos un archivo');
      return;
    }

    if (files.length > maxFiles) {
      setErrorMsg(`Solo puedes subir máximo ${maxFiles} archivo(s).`);
      return;
    }

    for (const f of files) {
      if (f.size / 1024 > MAX_FILE_SIZE) {
        setErrorMsg(`"${f.name}" excede el límite de 20MB`);
        return;
      }
      if (f.type !== 'application/pdf') {
        setErrorMsg(`"${f.name}" no es un PDF válido`);
        return;
      }
    }

    setErrorMsg('');
    handleSubmitDocuments();
  };

  const uploadSingleFile = (file) => {
    return new Promise((resolve, reject) => {
      const documentRef = ref(storage, `${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(documentRef, file);

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

  const handleSubmitDocuments = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < files.length; i++) {
        setCurrentIndex(i + 1);
        setProgressPercent(0);

        const url = await uploadSingleFile(files[i]);

        await await postNewDocument(selectedUser.id, url, documentType.id, {
          fileIndex: i + 1,
          fileName: files[i].name
        });
      }

      dispatch(startGetDocumentsSuccess(idUsuario));
      SuccessAlert(
        'Documento cargado',
        files.length > 1
          ? 'Los documentos se cargaron correctamente'
          : 'El documento se cargó correctamente'
      );

      handleClose();
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.message || 'Error al subir el archivo');
      setLoading(false);
    }
  };

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
            📄 Cargar nuevo documento
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Este tipo permite: <strong>{maxFiles}</strong> archivo(s).
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
                multiple={maxFiles > 1}
                onChange={(e) => handlePickFiles(e.target.files)}
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
                  Seleccionar archivo{maxFiles > 1 ? 's' : ''}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Formato PDF · Máx 20MB · Máx {maxFiles} archivo(s)
                </Typography>

                {files.length > 0 && (
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {files.map((f, idx) => (
                      <Box
                        key={`${f.name}-${idx}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                          py: 0.75,
                          px: 1,
                          borderRadius: 2,
                          backgroundColor: alpha('#001E3C', 0.04),
                          mb: 1
                        }}>
                        <Typography
                          variant="body2"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FontAwesomeIcon icon={faFilePdf} />
                          {f.name}
                        </Typography>

                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            removeFile(idx);
                          }}
                          sx={{ minWidth: 0, px: 1 }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Stack spacing={2}>
              <Typography>
                Subiendo{' '}
                {files.length > 1 ? `archivo ${currentIndex}/${files.length}` : 'documento'}… por
                favor espera
              </Typography>

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
              onClick={validateSelectedFiles}
              disabled={!files.length || loading}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NewDocumentModal;

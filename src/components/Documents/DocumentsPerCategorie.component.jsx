import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { deleteDocumentType, getAllCategoriesDocuments } from '../../services/documentsService';
import DocumentTypeNewModal from './DocumentTypeNewModal.component';
import DocumentTypeEditModal from './DocumentTypeEditModal.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CATEGORY_ICON_MAP } from '../../constants/constants';

const generateColorFromString = (str) => {
  const colors = [
    '#1976d2',
    '#1DDB7F',
    '#9c27b0',
    '#ed6c02',
    '#d32f2f',
    '#0288d1',
    '#7b1fa2',
    '#455a64'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const DocumentsPerCategorie = ({ categoriesList = [] }) => {
  const [documentsList, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openNew, setOpenNew] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEditDocType, setSelectedEditDocType] = useState(null);

  const openEditModal = (docType) => {
    setSelectedEditDocType(docType);
    setOpenEdit(true);
  };

  const fetchDocs = async () => {
    setLoading(true);
    const docs = await getAllCategoriesDocuments();
    setDocumentsList(docs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocuments = useMemo(() => {
    if (selectedCategory === 'all') return documentsList;
    return documentsList.filter((d) => d.category === selectedCategory);
  }, [documentsList, selectedCategory]);

  const openDeleteConfirm = (docType) => {
    setSelectedDocType({ id: docType.id, title: docType.title });
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setSelectedDocType(null);
  };

  const handleCloseToast = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast((t) => ({ ...t, open: false }));
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedDocType?.id) return;

    try {
      setDeleting(true);
      await deleteDocumentType(selectedDocType.id);

      setToast({
        open: true,
        severity: 'success',
        message: `Eliminado: "${selectedDocType.title}"`
      });

      setConfirmOpen(false);
      setSelectedDocType(null);

      await fetchDocs();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        severity: 'error',
        message: error?.message || 'No se pudo eliminar el tipo de documento. Intenta de nuevo.'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Select
          size="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ minWidth: 260, bgcolor: 'white' }}>
          <MenuItem value="all">Todas las categorías</MenuItem>
          {categoriesList.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.title}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={() => setOpenNew(true)}>
          Nuevo tipo de documento
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#00356a' }}>Nombre del documento</TableCell>
              <TableCell style={{ color: '#00356a' }}>Categoría</TableCell>
              <TableCell style={{ color: '#00356a' }} align="center">
                Máximo de archivos
              </TableCell>
              <TableCell style={{ color: '#00356a' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Cargando documentos...</TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell style={{ color: '#00356a' }}>
                    <FontAwesomeIcon icon={CATEGORY_ICON_MAP[document.icon]} /> {document.title}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={document.categoryName}
                      sx={{
                        backgroundColor: generateColorFromString(document.category),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{document.maxFiles}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      disabled={deleting}
                      onClick={() => openEditModal(document)}>
                      Editar
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      disabled={deleting}
                      onClick={() => openDeleteConfirm(document)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Nuevo */}
      <DocumentTypeNewModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        categoriesList={categoriesList}
        onCreated={fetchDocs}
      />

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={closeDeleteConfirm}>
        <DialogTitle>Eliminar tipo de documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar <strong>{selectedDocType?.title}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteConfirm} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
            disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <DocumentTypeEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        selectedDocType={selectedEditDocType}
        categoriesList={categoriesList}
        onUpdated={fetchDocs}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default DocumentsPerCategorie;

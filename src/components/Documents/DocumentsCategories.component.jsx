import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontIcons from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { deleteCategory } from '../../services/documentsService';
import DocumentCategoryEditModal from './DocumentsCategoryEditModal.component';

const DocumentsCategories = ({ categoriesList, loading, fetchCategories }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const handleOpenConfirm = (category) => {
    setSelected({ id: category.id, title: category.title });
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setSelected(null);
  };

  const handleCloseToast = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast((t) => ({ ...t, open: false }));
  };

  const handleDeleteConfirmed = async () => {
    if (!selected?.id) return;

    try {
      setDeleting(true);
      await deleteCategory(selected.id);

      setToast({
        open: true,
        severity: 'success',
        message: `Categoría "${selected.title}" eliminada.`
      });

      setConfirmOpen(false);
      setSelected(null);

      if (typeof fetchCategories === 'function') {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setToast({
        open: true,
        severity: 'error',
        message: error?.message
          ? `No se pudo eliminar: ${error.message}`
          : 'No se pudo eliminar la categoría. Intenta de nuevo.'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            p: { xs: 2.5, md: 3 },
            borderBottom: '1px solid',
            borderColor: '#e0e0e0'
          }}>
          <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#424242' }}>
            Categorías
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
              p: 4
            }}>
            <CircularProgress />
          </Box>
        ) : categoriesList.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
              p: 4
            }}>
            <Typography variant="body1" color="text.secondary">
              No hay categorías registradas
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#001E3C' }}>
                    Nombre de la categoría
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#001E3C' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categoriesList.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f9f9f9', color: '#001E3C' }
                    }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#00356a' }}>
                        <FontAwesomeIcon
                          icon={fontIcons[category.icon] || fontIcons.faFolder}
                          size="1x"
                          style={{ color: '#00356a' }}
                        />
                        {category.title}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        disabled={deleting}
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenModal(true);
                        }}>
                        Editar
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleOpenConfirm(category)}
                        disabled={deleting}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* DIALOG CONFIRMAR ELIMINACIÓN */}
        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
          <DialogTitle>Eliminar categoría</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Seguro que deseas eliminar la categoría <strong>{selected?.title || ''}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseConfirm} disabled={deleting}>
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

        {/* ALERT (SNACKBAR) */}
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
      </Box>
      <DocumentCategoryEditModal
        open={openModal}
        setOpen={setOpenModal}
        selectedCategory={selectedCategory}
        fetchCategories={fetchCategories}
      />
    </>
  );
};

export default DocumentsCategories;

import { Box, Chip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postEditTask } from '../../services/tasksService';
import { SuccessAlert } from '../Common/SuccessAlert';
import NoAlertsFound from './NoAlertsFound.component';

const UserAlertsTable = ({ alertsList, handleGetAlerts, idUsuario }) => {
  const handleEditAlert = async (alert) => {
    try {
      await postEditTask(alert.id);
      await handleGetAlerts(idUsuario);
      SuccessAlert('Alerta Editada', 'Se ha editado la alerta con éxito');
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Título',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 2,
      minWidth: 260
    },
    {
      field: 'userName',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'date',
      headerName: 'Fecha',
      minWidth: 160,
      valueGetter: (params) =>
        params.value?.seconds ? moment(params.value.seconds * 1000).format('DD MMM YYYY') : ''
    },
    {
      field: 'status',
      headerName: 'Estado',
      minWidth: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Pendiente' ? 'error' : 'success'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: '',
      minWidth: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.status === 'Pendiente' && (
          <IconButton color="success" onClick={() => handleEditAlert(params.row)}>
            <FontAwesomeIcon icon={faCheck} />
          </IconButton>
        )
    }
  ];

  if (!alertsList || alertsList.length === 0) {
    return <NoAlertsFound />;
  }

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        rows={alertsList}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          }
        }}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f7fa',
            color: '#001E3C',
            fontWeight: 700
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f0f4f8'
          }
        }}
      />
    </Box>
  );
};

export default UserAlertsTable;

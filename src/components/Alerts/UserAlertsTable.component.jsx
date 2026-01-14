import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { headerTitles } from '.';
import moment from 'moment';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postEditTask } from '../../services/tasksService';
import { SuccessAlert } from '../Common/SuccessAlert';
import { Fragment } from 'react';
import NoAlertsFound from './NoAlertsFound.component';

const UserAlertsTable = ({ alertsList, handleGetAlerts, idUsuario }) => {
  const handleEditAlert = async (alert) => {
    try {
      await postEditTask(alert.id);
      handleGetAlerts(idUsuario);
      SuccessAlert('Alerta Editada', 'Se ha editado la alerta con éxito');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      {alertsList && alertsList.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headerTitles.map((headerTitle) => (
                  <TableCell style={{ color: '#001E3C' }} key={headerTitle.id}>
                    {headerTitle.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {alertsList?.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell style={{ color: '#001E3C' }}>{alert.title}</TableCell>
                  <TableCell style={{ color: '#001E3C' }}>{alert.description}</TableCell>
                  <TableCell style={{ color: '#001E3C' }}>{alert.userName}</TableCell>
                  <TableCell style={{ color: '#001E3C' }}>
                    {' '}
                    {moment(alert?.date?.seconds * 1000).format('DD MMMM YYYY')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={alert.status === 'Pendiente' ? 'error' : 'success'}
                      label={alert.status}
                    />
                    {alert.status === 'Pendiente' && (
                      <IconButton
                        aria-label="delete"
                        color="success"
                        onClick={() => handleEditAlert(alert)}>
                        <FontAwesomeIcon icon={faCheck} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <NoAlertsFound />
      )}
    </Fragment>
  );
};
export default UserAlertsTable;

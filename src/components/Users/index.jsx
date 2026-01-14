import UsersTable from './UsersTable.component';
import NewUserModal from './NewUserModal.component';
import NewDocumentModal from './NewDocumentModal.component';
import NoUsersFound from './NoUsersFound.component';
const usersTableHeaders = [
  {
    id: 'HEAD-0',
    title: 'Id'
  },
  {
    id: 'HEAD-1',
    title: 'Nombre'
  },
  {
    id: 'HEAD-2',
    title: 'Empresa'
  },
  {
    id: 'HEAD-3',
    title: 'Correo'
  }
  /*  {
    id: "HEAD-4",
    title: "Acciones",
  }, */
];
const userDetailsTableHeaders = [
  {
    id: 'HEAD-0',
    title: 'Documento'
  },
  {
    id: 'HEAD-1',
    title: 'Status'
  },
  {
    id: 'HEAD-2',
    title: 'Última Modificación'
  },
  {
    id: 'HEAD-3',
    title: 'Acciones'
  }
];
export {
  usersTableHeaders,
  UsersTable,
  NewUserModal,
  userDetailsTableHeaders,
  NewDocumentModal,
  NoUsersFound
};

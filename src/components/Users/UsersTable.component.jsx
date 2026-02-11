import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NoUsersFound, usersTableHeaders } from '.';
import { getSelectedUser } from '../../actions/documentsActions';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../../firebaseElements/firebase';
import { setLoadingUsers } from '../../actions/loadingActions';
const db = getFirestore(app);

const UsersTable = () => {
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState('');
  const { loadingUsers } = useSelector((state) => state.loading);

  const setSelectedUser = (user) => {
    dispatch(getSelectedUser(user));
  };

  useEffect(() => {
    dispatch(setLoadingUsers(true));

    const unsub = onSnapshot(
      query(collection(db, 'accounts'), where('type', '==', 'user')),
      (snapshot) => {
        setUsersList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        dispatch(setLoadingUsers(false));
      },
      (error) => {
        console.error(error);
        dispatch(setLoadingUsers(false));
      }
    );

    return () => unsub();
  }, []);

  // 🔎 filtra por cualquier campo (id, name, company, email, etc.)
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return usersList;

    return usersList.filter((u) => {
      // Busca en todos los values del objeto
      return Object.values(u).some((val) => {
        if (val === null || val === undefined) return false;

        // si es objeto/array, lo convertimos a string (por si acaso)
        const text =
          typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
            ? String(val)
            : JSON.stringify(val);

        return text.toLowerCase().includes(q);
      });
    });
  }, [usersList, search]);

  return (
    <Fragment>
      {/* SEARCH */}
      {!loadingUsers && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre, empresa, email, id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}

      {loadingUsers ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {usersTableHeaders.map((header) => (
                  <TableCell style={{ color: '#001E3C' }} key={header.id}>
                    {header.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell style={{ color: '#001E3C' }}>
                    <Link to={`/${user.id}`} onClick={() => setSelectedUser(user)}>
                      {user.id}
                    </Link>
                  </TableCell>
                  <TableCell style={{ color: '#001E3C' }}>{user.name}</TableCell>
                  <TableCell style={{ color: '#001E3C' }}>{user.company}</TableCell>
                  <TableCell style={{ color: '#001E3C' }}>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <NoUsersFound />
      )}
    </Fragment>
  );
};

export default UsersTable;

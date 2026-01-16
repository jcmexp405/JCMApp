import * as fontIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, alpha } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getDocuments } from '../../actions/documentsActions';
import { useNavigate } from 'react-router-dom';

const DocumentsListCard = ({ document }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    if (!document.document) return;

    dispatch(getDocuments({ url: document.document, category: document.title }));
    navigate('/documentos/preview');
  };

  return (
    <ListItem
      button
      disabled={!document.document}
      onClick={handleOpen}
      divider
      sx={{
        px: 3,
        py: 2,
        transition: 'all 0.25s ease',
        '&:hover': {
          backgroundColor: alpha('#00356a', 0.05)
        }
      }}
      secondaryAction={
        <IconButton edge="end">
          <FontAwesomeIcon icon={fontIcons.faChevronRight} />
        </IconButton>
      }>
      <ListItemAvatar>
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #00356a, #001e3c)',
            color: 'white',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
          }}>
          <FontAwesomeIcon icon={fontIcons[document.icon]} />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={document.title}
        secondary={!document.document ? 'Documento no disponible' : 'Toca para visualizar'}
        primaryTypographyProps={{
          fontWeight: 600,
          color: '#001E3C'
        }}
        secondaryTypographyProps={{
          fontSize: '0.8rem',
          color: alpha('#000', 0.6)
        }}
      />
    </ListItem>
  );
};

export default DocumentsListCard;

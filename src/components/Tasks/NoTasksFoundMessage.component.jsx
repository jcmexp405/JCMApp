import { Box, Button, Typography, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import NoDataImg from '../../assets/images/no-data.jpg';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../../actions/loginActions';

const NoTasksFoundMessage = () => {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 420,
        mx: 'auto',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        p: 3,
        boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
        mb: 4, // 👈 CLAVE
        ml: 2,
        mt: 2
      }}>
      {/* 🖼️ Illustration */}
      <Box
        component="img"
        src={NoDataImg}
        alt="Sin tareas"
        sx={{
          width: '100%',
          maxWidth: 260,
          mb: 2,
          mx: 'auto'
        }}
      />

      {/* 📝 Text */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#001E3C',
          mb: 1
        }}>
        No hay tareas pendientes
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: alpha('#001E3C', 0.7),
          mb: 3
        }}>
        Por ahora no tienes tareas asignadas. Te avisaremos cuando haya algo nuevo para ti.
      </Typography>

      {/* 🔘 CTA */}
      <Button
        component={Link}
        to="/documentos"
        onClick={() => dispatch(setCurrentPath('documentos'))}
        variant="contained"
        fullWidth
        size="large"
        sx={{
          borderRadius: '14px',
          py: 1.4,
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
        }}>
        Volver a documentos
      </Button>
    </Box>
  );
};

export default NoTasksFoundMessage;

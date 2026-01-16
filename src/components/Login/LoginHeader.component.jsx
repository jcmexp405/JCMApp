import { Box, Typography } from '@mui/material';
import Logo from '../../assets/images/logo-white.png';

const LoginHeader = ({ title, subtitle }) => {
  return (
    <Box textAlign="center" mb={4}>
      {' '}
      <img alt="img-logo" src={Logo} style={{ width: '12%', marginBottom: '20px' }} />
      <Typography variant="h4" fontWeight={500} color="white" style={{ lineHeight: '1.8rem' }}>
        {title || 'Hola, bienvenido de nuevo!'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.75)' }}>
        {subtitle || 'Inicia sesión para continuar'}
      </Typography>
    </Box>
  );
};

export default LoginHeader;

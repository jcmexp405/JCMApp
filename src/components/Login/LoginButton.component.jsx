import { Button } from '@mui/material';

const LoginButton = () => {
  return (
    <Button
      type="submit"
      fullWidth
      size="large"
      sx={{
        mt: 4,
        height: 52,
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'none',
        background: 'linear-gradient(135deg, #2dd4bf, #22c55e)',
        color: '#00356a',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}>
      Iniciar sesión
    </Button>
  );
};

export default LoginButton;

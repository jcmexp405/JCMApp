import { Button } from '@mui/material';

const ResetPasswordButton = () => {
  return (
    <Button
      type="submit"
      fullWidth
      size="large"
      sx={{
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
      Recuperar contraseña
    </Button>
  );
};

export default ResetPasswordButton;

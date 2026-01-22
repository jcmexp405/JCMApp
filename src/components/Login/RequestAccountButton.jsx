import { Button, CircularProgress } from '@mui/material';

const RequestAccountButton = ({ loading = false }) => {
  return (
    <Button
      type="submit"
      fullWidth
      size="large"
      disabled={loading}
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
        },
        '&:disabled': {
          opacity: 0.7,
          color: '#00356a'
        }
      }}>
      {loading ? <CircularProgress size={24} sx={{ color: '#00356a' }} /> : 'Solicitar cuenta'}
    </Button>
  );
};

export default RequestAccountButton;

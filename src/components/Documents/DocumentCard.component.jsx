import { Card, Grid, Typography, Box, alpha } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontIcons from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DocumentCard = ({ cardCathegory }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`./${cardCathegory.id}`);
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <Card
        onClick={handleRedirect}
        elevation={0}
        sx={{
          height: 180,
          cursor: 'pointer',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,

          /* 🎨 Estilo base */
          background: 'linear-gradient(180deg, #001E3C 0%, #00162b 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',

          /* 🧊 Glass effect */
          border: '1px solid',
          borderColor: alpha('#ffffff', 0.08),
          backdropFilter: 'blur(10px)',

          /* ✨ Transiciones */
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.45)'
          },

          /* Glow suave al hover */
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 60%)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          },

          '&:hover::after': {
            opacity: 1
          }
        }}>
        {/* 🔹 Icon badge */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha('#ffffff', 0.12),
            border: `1px solid ${alpha('#ffffff', 0.2)}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
          <FontAwesomeIcon icon={fontIcons[cardCathegory.icon]} size="2x" />
        </Box>

        {/* 🔹 Title */}
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            px: 1.5,
            opacity: 0.95
          }}>
          {cardCathegory.title}
        </Typography>
      </Card>
    </Grid>
  );
};

export default DocumentCard;

import { Card, CardContent, Chip, Grid, Typography, Box, alpha } from '@mui/material';
import moment from 'moment';

const TaskCard = ({ task }) => {
  return (
    <Grid item xs={12}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '18px',
          backgroundColor: '#ffffff',
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          transition: 'all 0.25s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
          }
        }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Box>
              <Typography
                sx={{
                  color: '#001E3C',
                  fontWeight: 700,
                  mb: 0.5
                }}>
                {task.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: alpha('#001E3C', 0.7)
                }}>
                {task.description}
              </Typography>
            </Box>

            <Chip
              size="small"
              color={task.status === 'Pendiente' ? 'error' : 'success'}
              label={task.status}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: alpha('#000', 0.6),
              fontWeight: 500
            }}>
            {moment(task?.date?.seconds * 1000).format('DD MMM YYYY')}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TaskCard;

import { Grid, Alert, Typography, Fade, Paper, alpha } from '@mui/material';
import { LoginButton, LoginHeader, LoginInputs } from '../components/Login';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../validations/loginValidation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userAuth } from '../actions/loginActions';
import { useEffect, useRef } from 'react';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, user: userRole } = useSelector((state) => state.auth);
  const hasNavigated = useRef(false);

  const formik = useFormik({
    initialValues: { USER: '', PASSWORD: '' },
    validationSchema: loginValidationSchema,
    onSubmit: ({ USER, PASSWORD }) => {
      dispatch(userAuth(USER, PASSWORD));
    }
  });

  useEffect(() => {
    // Redirect if user is already logged in with userRole data
    console.log('LoginScreen - userRole:', userRole);
    console.log('LoginScreen - hasNavigated:', hasNavigated.current);
    if (userRole?.uid && userRole?.type && !hasNavigated.current) {
      hasNavigated.current = true;
      const path = userRole.type === 'admin' ? '/usuarios' : '/documentos';
      console.log('LoginScreen - Navigating to:', path);
      navigate(path, { replace: true });
    }
  }, [userRole, navigate]);
  return (
    <Grid
      container
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{ background: 'radial-gradient(circle at top, #00356a 0%, #001e3c 40%, #000d19 100%)' }}>
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 2,
            p: 4,
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            backgroundColor: alpha('#ffffff', 0.08),
            border: `1px solid ${alpha('#ffffff', 0.15)}`,
            boxShadow: '0 40px 120px rgba(0,0,0,0.4)'
          }}>
          {' '}
          <LoginHeader />{' '}
          <form onSubmit={formik.handleSubmit}>
            {' '}
            {error?.message && (
              <Alert variant="filled" severity="error" sx={{ my: 2, borderRadius: '12px' }}>
                {' '}
                {error.message}{' '}
              </Alert>
            )}{' '}
            <LoginInputs formik={formik} /> <LoginButton />{' '}
          </form>{' '}
          <Typography
            variant="caption"
            align="center"
            sx={{ mt: 4, display: 'block', opacity: 0.6 }}>
            {' '}
            © {new Date().getFullYear()} · Plataforma interna{' '}
          </Typography>
        </Paper>
      </Fade>
    </Grid>
  );
};
export default LoginScreen;

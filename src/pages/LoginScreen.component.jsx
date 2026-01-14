import { Grid, Alert, Box, Typography, Fade } from '@mui/material';
import { LoginButton, LoginHeader, LoginInputs } from '../components/Login';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../validations/loginValidation';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userAuth } from '../actions/loginActions';

const auth = getAuth();

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { error, user: userRole } = useSelector((state) => state.auth);
  // 🔐 AUTH STATE CORRECTO
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const formik = useFormik({
    initialValues: {
      USER: '',
      PASSWORD: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async ({ USER, PASSWORD }) => {
      dispatch(userAuth(USER, PASSWORD));
    }
  });

  useEffect(() => {
    // Timeout de seguridad: si Firebase no responde en 2 segundos, continuamos
    const timeout = setTimeout(() => {
      console.log('⚠️ Firebase timeout - continuando sin auth');
      setUser(null);
      setAuthReady(true);
    }, 2000);

    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      console.log('👤 Firebase user:', firebaseUser);
      clearTimeout(timeout);
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  // ⏳ Esperar a Firebase
  if (!authReady) {
    console.log('⏳ Waiting for auth to be ready...');
    return null;
  }

  // ✅ Ya autenticado → redirigir según rol
  if (user && userRole?.type) {
    return userRole.type === 'admin' ? (
      <Navigate to="/usuarios" replace />
    ) : (
      <Navigate to="/documentos" replace />
    );
  }

  return (
    <Grid
      container
      direction="column"
      sx={{
        minHeight: '100vh',
        color: 'white',
        background:
          'radial-gradient(circle, rgba(0,53,106,1) 0%, rgba(0,30,60,1) 41%, rgba(0,13,25,1) 100%)'
      }}
      alignItems="center"
      justifyContent="center">
      <Fade in timeout={600}>
        <Box sx={{ width: '100%', maxWidth: 420, px: 3 }}>
          <LoginHeader
            title="¡Bienvenido de nuevo!"
            subtitle="Por favor inicia sesión para continuar"
          />

          <form onSubmit={formik.handleSubmit}>
            {error?.message && (
              <Alert sx={{ my: 2 }} variant="filled" severity="error">
                {error.message}
              </Alert>
            )}
            <LoginInputs formik={formik} />
            <LoginButton />
          </form>

          {/* Footer opcional */}
          <Typography variant="body2" align="center" sx={{ mt: 3, opacity: 0.7 }}>
            © {new Date().getFullYear()} · Plataforma interna
          </Typography>
        </Box>
      </Fade>
    </Grid>
  );
};

export default LoginScreen;

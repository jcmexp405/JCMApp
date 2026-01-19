import { Box, Typography, Container, Paper, Stack, Fade, alpha } from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

const PrivacyPolicyScreen = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00356a 0%, #001e3c 50%, #000d19 100%)',
        py: 4
      }}>
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              backgroundColor: alpha('#ffffff', 0.95),
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              boxShadow: '0 40px 120px rgba(0,0,0,0.3)'
            }}>
            <Stack spacing={3} textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #00356a 0%, #001e3c 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                <PrivacyTipIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: '#00356a',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}>
                Política de Privacidad
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  p: 4,
                  borderRadius: '16px',
                  backgroundColor: alpha('#00356a', 0.02),
                  border: `2px solid ${alpha('#00356a', 0.1)}`,
                  textAlign: 'left',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}>
                <Stack spacing={3}>
                  {/* Sección 1 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      1. Información que recopilamos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1 }}>
                      JCMApp recopila únicamente la información necesaria para el correcto
                      funcionamiento de la aplicación:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#00356a', fontWeight: 600, mt: 1.5, mb: 0.5 }}>
                      a) Información proporcionada por el usuario
                    </Typography>
                    <Typography
                      component="ul"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2, mb: 1.5 }}>
                      <li>
                        Datos de inicio de sesión (correo electrónico y credenciales de acceso)
                      </li>
                      <li>
                        Documentos contables y administrativos que el usuario decide cargar o
                        consultar, tales como:
                        <ul style={{ marginTop: '0.5rem' }}>
                          <li>Acta constitutiva</li>
                          <li>RFC</li>
                          <li>Comprobante de domicilio</li>
                          <li>Otros documentos relacionados con servicios contables</li>
                        </ul>
                      </li>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00356a', fontWeight: 600, mb: 0.5 }}>
                      b) Información técnica
                    </Typography>
                    <Typography component="ul" sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2 }}>
                      <li>
                        Información básica del dispositivo (tipo de dispositivo, sistema operativo)
                      </li>
                      <li>Registros técnicos para diagnóstico de errores y mejora del servicio</li>
                    </Typography>
                  </Box>

                  {/* Sección 2 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      2. Uso de la información
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1 }}>
                      La información recopilada se utiliza exclusivamente para:
                    </Typography>
                    <Typography
                      component="ul"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2, mb: 1 }}>
                      <li>Permitir el acceso seguro a la aplicación</li>
                      <li>Mostrar, gestionar y descargar documentos contables</li>
                      <li>
                        Enviar comunicaciones relacionadas con la seguridad de la cuenta (por
                        ejemplo, recuperación de contraseña)
                      </li>
                      <li>Mejorar la estabilidad, seguridad y funcionalidad de la aplicación</li>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, fontStyle: 'italic' }}>
                      JCMApp no utiliza la información para fines publicitarios.
                    </Typography>
                  </Box>

                  {/* Sección 3 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      3. Almacenamiento y seguridad de la información
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1 }}>
                      Implementamos medidas de seguridad técnicas y organizativas para proteger tu
                      información, incluyendo:
                    </Typography>
                    <Typography
                      component="ul"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2, mb: 1 }}>
                      <li>Acceso restringido a los datos</li>
                      <li>Protección contra accesos no autorizados</li>
                      <li>Almacenamiento seguro de documentos</li>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, fontStyle: 'italic' }}>
                      Aun así, ningún sistema es completamente infalible, por lo que no podemos
                      garantizar una seguridad absoluta.
                    </Typography>
                  </Box>

                  {/* Sección 4 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      4. Compartición de información
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8 }}>
                      JCMApp no vende, renta ni comparte información personal o documentos con
                      terceros, excepto cuando sea requerido por ley o autoridad competente.
                    </Typography>
                  </Box>

                  {/* Sección 5 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      5. Privacidad de los documentos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1 }}>
                      Los documentos que el usuario consulta o descarga dentro de la aplicación:
                    </Typography>
                    <Typography component="ul" sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2 }}>
                      <li>Permanecen bajo control del usuario</li>
                      <li>No son utilizados con fines distintos a los expresamente solicitados</li>
                      <li>No se comparten con terceros sin consentimiento</li>
                    </Typography>
                  </Box>

                  {/* Sección 6 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      6. Derechos del usuario
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1 }}>
                      El usuario puede:
                    </Typography>
                    <Typography
                      component="ul"
                      sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2, mb: 1 }}>
                      <li>Acceder a su información</li>
                      <li>Solicitar la corrección o eliminación de sus datos</li>
                      <li>Solicitar información sobre el uso de sus datos</li>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8 }}>
                      Para ejercer estos derechos, puede contactarnos mediante los datos indicados
                      en la sección de contacto.
                    </Typography>
                  </Box>

                  {/* Sección 7 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      7. Cambios a esta política
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8 }}>
                      Nos reservamos el derecho de actualizar esta Política de Privacidad en
                      cualquier momento. Cualquier cambio será publicado en esta misma página y
                      entrará en vigor a partir de su publicación.
                    </Typography>
                  </Box>

                  {/* Sección 8 */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00356a', fontWeight: 700, mb: 1.5 }}>
                      8. Contacto
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.8, mb: 1.5 }}>
                      Si tienes preguntas o inquietudes sobre esta Política de Privacidad o el uso
                      de la aplicación, puedes contactarnos en:
                    </Typography>
                    <Typography component="div" sx={{ color: '#5a6c7d', lineHeight: 1.8, pl: 2 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          📧 Correo electrónico:{' '}
                        </Typography>
                        <Typography
                          component="a"
                          href="mailto:jcmexpansion@hotmail.com"
                          sx={{
                            color: '#00356a',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}>
                          jcmexpansion@hotmail.com
                        </Typography>
                      </Box>
                      <Box>
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          🌐 Sitio web:{' '}
                        </Typography>
                        <Typography
                          component="a"
                          href="https://jcm-app-f47aeae8e3a2.herokuapp.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#00356a',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}>
                          https://jcm-app-f47aeae8e3a2.herokuapp.com
                        </Typography>
                      </Box>
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Typography variant="caption" sx={{ color: alpha('#5a6c7d', 0.7), mt: 2 }}>
                Última actualización: Enero 2026
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyScreen;

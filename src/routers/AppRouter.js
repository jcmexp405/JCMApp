import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorPage } from '../components/Common';
import { PDFView } from '../components/Documents';
import {
  LoginScreen,
  UsersScreen,
  UserDetailsScreen,
  DocumentsMenuScreen,
  DocumentsListScreen,
  AlertsScreen,
  TasksScreen,
  ResetPasswordScreen,
  HelpScreen,
  PrivacyPolicyScreen
} from '../pages';

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/resetpassword" element={<ResetPasswordScreen />} />
        <Route path="/ayuda" element={<HelpScreen />} />
        <Route path="/privacidad" element={<PrivacyPolicyScreen />} />
        <Route path="/documentos" element={<DocumentsMenuScreen />} />
        <Route path="/documentos/:idCategory" element={<DocumentsListScreen />} />
        <Route path="/documentos/preview" element={<PDFView />} />
        <Route path="/usuarios" element={<UsersScreen />} />
        <Route path="/:idUsuario" element={<UserDetailsScreen />} />
        <Route path="/alertas" element={<AlertsScreen />} />
        <Route path="/tareas" element={<TasksScreen />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;

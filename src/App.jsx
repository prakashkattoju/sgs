import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { getToken } from './util/Cookies'
import { checkAndRemoveExpiredToken, fetchUserRole } from "./util/authUtils";
import ProtectedRoute from './components/ProtectedRoute';
import LoginAdmin from "./pages/LoginAdmin";
import Temp from "./pages/Temp";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const isLoggedIn = token && checkAndRemoveExpiredToken(token);
  const user_role = fetchUserRole(token)

  const checkToken = () => {
    if (isLoggedIn) {
      dispatch(setCredentials({ token }));
    }
  };

  useEffect(() => {
    checkToken()
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <ProtectedRoute allowedRoles={["Admin", "Emp"]}><Temp /></ProtectedRoute> : <LoginAdmin/>}  />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
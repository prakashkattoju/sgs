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
import Bill from "./pages/Bill";
import Account from "./pages/Account";
import OrderDetails from "./pages/OrderDetails";
import Items from "./pages/Items";
import SearchItems from "./pages/SearchItems";

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
      <Route path="/" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Home /></ProtectedRoute> : <Login />} />
      <Route path="/items/:slug/:cat_id/:scat_id" element={<ProtectedRoute allowedRoles={["user"]}><Items /></ProtectedRoute>} />
      <Route path="/search-items" element={<ProtectedRoute allowedRoles={["user"]}><SearchItems /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute>} />
      <Route path="/bill" element={<ProtectedRoute allowedRoles={["user"]}><Bill /> </ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute allowedRoles={["user"]}><Account /> </ProtectedRoute>} />
      <Route path="/order-details" element={<ProtectedRoute allowedRoles={["user"]}><OrderDetails /> </ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { getToken } from './util/Cookies'
import { checkAndRemoveExpiredToken, fetchUserRole } from "./util/authUtils";
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import OrderAgain from "./pages/OrderAgain";
import SearchItems from "./pages/SearchItems";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Account from "./pages/Account";
import EditUserDetails from "./pages/EditUserDetails";
import Bill from "./pages/Bill";

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
      <Route path="/" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Home /></ProtectedRoute> : <Login />}  />
      <Route path="/cart" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute> : <Login />} />
      <Route path="/order-again" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><OrderAgain /></ProtectedRoute> : <Login />} />
      <Route path="/search-items" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><SearchItems /></ProtectedRoute> : <Login />} />
      <Route path="/account/orders" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Orders /></ProtectedRoute> : <Login />} />
      <Route path="/order-details" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><OrderDetails /></ProtectedRoute> : <Login />} />
      <Route path="/account" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Account /></ProtectedRoute> : <Login />} />
      <Route path="/account/update-details" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><EditUserDetails /></ProtectedRoute> : <Login />} />
      <Route path="/bill" element={isLoggedIn ? <ProtectedRoute allowedRoles={["user"]}><Bill /></ProtectedRoute> : <Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
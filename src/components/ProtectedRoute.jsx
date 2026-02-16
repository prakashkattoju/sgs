import { useState, useCallback, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { logOut } from '../store/authSlice';
import { GetUserByID, GetAdminByID } from '../services/Userservices';
import AlertModal from './AlertModal';
import BottomNavi from './BottomNavi';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cart = useSelector((state) => state.cart.cart);
  const token = useSelector((state) => state.auth.token);
  const decodedToken = decodeToken(token);
  const user_id = decodedToken?.user_id;
  const user_role = decodedToken?.user_role;
  const exp = decodedToken?.exp;

  const [showAlert, setShowAlert] = useState({
    title: null,
    message: null,
    show: false
  });

  const fetchuser = useCallback(async () => {
    try {
      if (user_role === 'user') {
        const userdata = await GetUserByID(user_id);
        dispatch(setUserDetails({
          fullname: userdata?.uname,
          mobile: userdata?.mobile
        }))
      } else {
        const userdata =  await GetAdminByID(user_id);
        dispatch(setUserDetails({
          fullname: userdata?.username,
          mobile: userdata?.mobile
        }))
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [user_id]);

  useEffect(() => {
    const expiryMs = exp * 1000;
    // Check if the token has expired

    console.log("expiryMs", expiryMs)
    console.log("Date.now", Date.now())

    if (Date.now() >= expiryMs) {
      setShowAlert({
        title: 'Session Expired',
        message: 'Please Login Again',
        show: true
      })
    }
    user_id && fetchuser();
  }, [fetchuser, user_id]);


  const logoutAccount = () => {
    dispatch(logOut()); // Dispatch the logout action to clear user state
    dispatch(setUserDetails({
      fullname: null,
      mobile: null
    }))
    navigate("/", { replace: true }); // Redirect the user to the login page after logging out
    window.location.reload(true);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user_role)) {
    return <Navigate to={user_role === "Admin" ? "/sgs" : "/"} replace />;
  }

  return (
    <>
      {children}
      {user_role === "user" && <BottomNavi />}
      <AlertModal
        show={showAlert.show}
        title={showAlert.title}
        message={showAlert.message}
        onClose={() => logoutAccount()}
      />
    </>
  );
};

export default ProtectedRoute;

import { useState, useCallback, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { logOut } from '../store/authSlice';
import { GetUserByID } from '../services/Userservices';
import AlertModal from './AlertModal';

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

  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState({
    title: null,
    message: null,
    show: false
  });

  const fetchuser = useCallback(async () => {
    try {
      const userdata = await GetUserByID(user_id);
      dispatch(setUserDetails({
        fullname: user_role === "admin" ? "Ravi Kumar" : userdata?.uname,
        mobile: user_role === "admin" ? "9491771333" : userdata?.mobile
      }))
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [user_id]);

  useEffect(() => {
    const expiryMs = exp * 1000;
    // Check if the token has expired

    console.log("expiryMs", expiryMs )
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

  const user = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user_role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`site inner user ${cart.length > 0 ? 'cart' : ''}`}>

      {((user_role === "admin" && location.pathname !== "/order-details")) && <header className="site-header">
        <div className='site-header-top'>
          <ul id="mobileMenu" className={`navbar-nav show`}>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' && 'active'}`} to="/">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/products' && 'active'}`} to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/categories' && 'active'}`} to="/categories">Categories</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/groceries' && 'active'}`} to="/groceries">Groceries</Link>
            </li>
          </ul>
          <span onClick={logoutAccount} className='d-flex gap-2 justify-content-end align-items-center'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></span>
        </div>
        {/* user_role === "user" && <div className="login-user">
          <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" /></svg> {user.fullname ? user.fullname : 'User'}</span>
          <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-600q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" /></svg> {user.mobile}</span>
        </div> */}
      </header>}

      <main className="site-main">
        <article className="page">
          <div className="entry-content">
            {children}
          </div>
        </article>
      </main>
      <AlertModal
        show={showAlert.show}
        title={showAlert.title}
        message={showAlert.message}
        onClose={() => logoutAccount()}
      />
    </div>
  );
};

export default ProtectedRoute;

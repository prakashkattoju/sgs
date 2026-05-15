import { useState, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetOrders } from '../services/Billservices';
import { useNavigate, useLocation } from "react-router-dom";
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import priceDisplay from '../util/priceDisplay';
import { format } from 'date-fns'
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Account() {
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart.cart);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([])
    const user = useSelector((state) => state.user);
    const [showConfirm, setShowConfirm] = useState(false);

    const headerRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const fetchOrders = useCallback(async () => {
        const searchData = {
            mobile: user.mobile
        }
        try {
            setLoading(true)
            const res = await GetOrders(searchData);
            console.log("Orders", res)
            setOrders(res);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false)
        }
    }, [user.mobile]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, user.mobile]);

    const onClose = () => {
        navigate(-1);
    }

    const StatusChip = ({ status }) => {
        const isPaid = status == 1;

        return (
            <span className={`chip ${isPaid ? 'chip--paid' : 'chip--unpaid'}`}>
                {isPaid ? 'PAID' : 'UNPAID'}
            </span>
        );
    };

    const logoutAccount = () => {
        dispatch(logOut()); // Dispatch the logout action to clear user state
        dispatch(setUserDetails({
            fullname: null,
            mobile: null
        }))
        navigate("/", { replace: true }); // Redirect the user to the login page after logging out
        window.location.reload(true);
    };

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowConfirm(false);
    };

    return (
        <>
            <Header headerRef={headerRef} title={user.mobile === '1143' ? 'Siri General Stores' : user.fullname ? user.fullname : 'User'} subtitle={`${user.mobile === '1143' ? '**********' : user.mobile}`} />
            <main className='site-main'>
                <div className='items-container search-items-container'>
                    <div style={{ height: `calc(100dvh - ${height + 2}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                            <div className={`item-list orders-list`}>
                                <div role='button' className="item" onClick={() => navigate('/account/orders')}>
                                    <div style={{ padding: '8px 5px'}} className='item-inner'>
                                        <div className="meta">
                                            <div className="meta-inner" style={{justifyContent: 'flex-start', columnGap: 20, fontWeight: 500 }}>
                                                <div><i className="fa-solid fa-list"></i></div>
                                                <div>Orders</div>
                                                <div style={{marginLeft: 'auto'}}><i className="fas fa-chevron-right"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div role='button' className="item" onClick={() => setShowConfirm(true)}>
                                    <div style={{ padding: '8px 5px'}} className='item-inner'>
                                        <div className="meta">
                                            <div className="meta-inner" style={{justifyContent: 'flex-start', columnGap: 20, fontWeight: 500 }}>
                                                <div><i className="fa-solid fa-arrow-right-from-bracket"></i></div>
                                                <div>Logout</div>
                                                <div style={{marginLeft: 'auto'}}><i className="fas fa-chevron-right"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                <ConfirmModal
                    show={showConfirm}
                    title="Exit!"
                    message={`Are you sure you want to exit?`}
                    onConfirm={() => logoutAccount()}
                    onConfirmLabel="Yes"
                    onCancel={handleCancel}
                />
            </main>
        </>
    )
}
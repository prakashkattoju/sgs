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

export default function Orders() {
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
            <Header headerRef={headerRef} title={user.fullname ? user.fullname : 'User'} subtitle={`You have ${orders.length} order(s)`} />
            <main className='site-main'>
                <div className='items-container search-items-container'>
                    <div style={{ height: `calc(100dvh - ${height + 2}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                            <div className={`item-list ${orders.length > 0 ? 'orders-list' : 'empty-list'}`}>
                                {loading ? <div className="item"><div className='loading'>Loading...</div></div> : orders.length > 0 ? orders.map((item, index) => {
                                    const data = item.items;
                                    const titles = data.map(item => item.title);
                                    const visibleTitles = titles.slice(0, 2);
                                    const remainingCount = titles.length - visibleTitles.length;

                                    return <div key={index} className="item" onClick={() => navigate('/order-details', { state: item })}>
                                        <div style={{ padding: 0 }} className='item-inner'>
                                            <div className="meta">
                                                <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: 20, marginBottom: 5 }}><span>{visibleTitles.map((title, index) => (
                                                    <span className='items-more-title' key={index}>{title}{index < visibleTitles.length - 1 ? ',' : ''}&nbsp;</span>
                                                ))} {remainingCount > 0 && (<span> +{remainingCount} more</span>)}</span></h2>
                                                <div className="meta-inner" style={{ fontWeight: 500 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: 20 }}>
                                                        <div>Order # {item.token_num}</div>
                                                        <div><i className="fa-regular fa-calendar-days"></i> {format(new Date(item.dcreated_on), 'dd-MM-yyyy')}</div>
                                                    </div>
                                                    {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', columnGap: 20 }}>
                                                        <div>{StatusChip({ status: item.status })}</div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }) : <h2 className='no-data'>You haven't placed any orders yet.</h2>}
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
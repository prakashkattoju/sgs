import { useRef, useEffect, useState, useCallback } from 'react'
import { GetCategories } from '../services/Productsservices';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
import { useLocation, useNavigate, Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ConfirmModal from '../components/ConfirmModal';

export default function Home() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);

    const [showConfirm, setShowConfirm] = useState(false);

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

    const fetchcategories = useCallback(async () => {
        setLoading(true)
        try {
            const categoriesdata = await GetCategories();
            const statusData = categoriesdata.filter((item) => item.status == 1);
            setCategories(statusData)
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchcategories();
    }, [fetchcategories]);

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

    const setSearchResultsFunc = (text) => {

    }

    return (
        <>
            <header ref={headerRef} className="site-header">

                <div className='site-header-top d-flex gap-3 align-items-center justify-content-start'>
                    <img src='/icon.jpg' alt='' />
                    <div>
                        <h1>SIRI GENERAL STORES</h1>
                        <div className='d-flex gap-3 align-items-end justify-content-start'><h3><i className="fa-solid fa-location-dot"></i> KAKINADA</h3><h3><i className="fa-solid fa-mobile-screen"></i> 9343343434</h3></div>
                    </div>
                </div>

                <div className='search-area d-flex gap-2 align-items-center justify-content-between'>
                    <button className='icon-btn' onClick={() => navigate('/account')}><i className="fa-regular fa-circle-user"></i></button>

                    <div className="search-form">
                        <div className="form-group">
                            <input className="form-control alt" type="button" value="Search here..." onClick={() => navigate('/search')} />
                            <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                        </div>
                    </div>

                    <button className='icon-btn-s' onClick={() => setShowConfirm(true)}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
            </header>
            <div className='items-container'>
                <h2>Shop by Category</h2>
                <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 134) : (height + 70)}px)` }} className="list scroll">
                    <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                        <div className="item-list">
                            {loading ? Array.from({ length: 9 }).map((_, i) => (<div key={i} className="item">
                                <div className='item-inner'>
                                    <div className="skeleton img"></div>
                                    <div className="meta">
                                        <h2 className="skeleton"></h2>
                                    </div>
                                </div>
                            </div>)) : categories?.length > 0 && categories?.map((item, index) => <div key={index} className="item" onClick={() => navigate(`/items/${item.slug}/${item.cat_id}/${item.sub_cats[0].scat_id}`)}>
                                <div className='item-inner'>
                                    <div className="img"><img width="111" height="111" src={`/categories/${item.image}`} alt={item.category} /></div>
                                    <div className="meta">
                                        <h2>{item.category}</h2>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
            {
                cart.length > 0 && <div className="cart-summary-badge">
                    <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                    <div className="continue">
                        <button className="btn toggle" onClick={() => navigate("/cart", { replace: true })}>Continue</button>
                    </div>
                </div>
            }

            < ConfirmModal
                show={showConfirm}
                title="Exit!"
                message={`Are you sure you want to exit?`}
                onConfirm={() => logoutAccount()}
                onConfirmLabel="Yes"
                onCancel={handleCancel}
            />
        </>
    )
}
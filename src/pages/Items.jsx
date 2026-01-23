import { useRef, useEffect, useState, useCallback } from 'react'
import { GetCategoryByID, GetItems } from '../services/Productsservices';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
import { useNavigate, useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ConfirmModal from '../components/ConfirmModal';
import priceDisplay from '../util/priceDisplay';


export default function Items() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug, cat_id, scat_id } = useParams();

    const [categoryItem, setCategoryItem] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);

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

    const fetchcategory = useCallback(async () => {
        setLoading(true)
        try {
            const categorydata = await GetCategoryByID(cat_id);
            setCategoryItem(categorydata[0])
        } catch (error) {
            console.error("Failed to fetch category:", error);
        } finally {
            setLoading(false)
        }
    }, []);

    const fetchitems = useCallback(async () => {
        setItemLoading(true)
        try {
            const itemsdata = await GetItems(cat_id, scat_id);
            setItems(itemsdata)
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setItemLoading(false)
        }
    }, [cat_id, scat_id]);

    useEffect(() => {
        fetchcategory();
        fetchitems();
    }, [fetchcategory, cat_id, scat_id]);

    console.log(items)

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

    const backBtn = () => {
        navigate('/')
    }

    const { category, sub_cats } = categoryItem

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
                    <button className='icon-btn' onClick={backBtn}><i className="fa-solid fa-arrow-left"></i></button>

                    <div className="search-form">
                        <div className="form-group">
                            <input ref={searchInputRef} className="form-control" type="text" value="" onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
                            <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                        </div>
                    </div>

                    <button className='icon-btn-s' onClick={() => setShowConfirm(true)}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
            </header>
            <div className='items-container'>
                <h2>Buy "{category}" Items</h2>
                <div className='items-container-inner'>
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 134) : (height + 70)}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                            <div className="item-list sidenav-list">
                                {loading ? Array.from({ length: 6 }).map((_, i) => (<div key={i} className="item">
                                    <div className='item-inner'>
                                        <div className="meta">
                                            <h2 className="skeleton"></h2>
                                        </div>
                                    </div>
                                </div>)) : sub_cats?.length > 0 && sub_cats?.map((item, index) => <div key={index} className="item" role='button' onClick={() => navigate(`/items/${slug}/${cat_id}/${item.scat_id}`)}>
                                    <div className='item-inner'>
                                        <div className="meta">
                                            <h2 className={item.scat_id == scat_id ? "active" : ""}>{item.scategory}</h2>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 134) : (height + 70)}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className='alter'>
                            <div className={`item-list ${items.length > 0 ? 'products-list' : 'empty-list'}`}>
                                {loading ? Array.from({ length: 6 }).map((_, i) => (<div key={i} className="item">
                                    <div className='item-inner'>
                                        <div className="meta">
                                            <h2 className="skeleton"></h2>
                                        </div>
                                    </div>
                                </div>)) : items?.length > 0 ? items?.map((item, index) => <div key={index} className="item">
                                    <div className='item-inner'>
                                        <div className="meta">
                                            <h2>{item.item}</h2>
                                        </div>
                                        <div className='price'>{priceDisplay(parseInt(item.price))}</div>
                                        <div className="meta" style={{marginTop:'auto'}}>
                                            <div className="cart-action"><button className="btnAddAction init">Add <i className="fa-solid fa-plus"></i></button></div>
                                        </div>
                                    </div>
                                </div>) : <h4 className='text-center'>No Items Found</h4>}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
            {cart.length > 0 && <div className="cart-summary-badge">
                <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                <div className="continue">
                    <button className="btn toggle" onClick={() => navigate("/cart", { replace: true })}>Continue</button>
                </div>
            </div>}

            <ConfirmModal
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
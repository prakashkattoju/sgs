import { useRef, useEffect, useState, useCallback } from 'react'
import { GetCategories } from '../services/Productsservices';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import priceDisplay from '../util/priceDisplay';
import Header from '../components/Header';

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


    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };
    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    return (
        <>
            <Header headerRef={headerRef} title="" />
            <div className='items-container'>
                <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 80) : (height + 30)}px)` }} className="list scroll">
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
            {cart.length > 0 && <div className="cart-summary-badge" onClick={() => navigate("/cart", { replace: true })}>
                <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                <button className="icon-btn alt"><i className="fa-solid fa-arrow-right"></i></button>
            </div>}
        </>
    )
}
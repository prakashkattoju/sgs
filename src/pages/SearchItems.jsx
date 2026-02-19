import { useRef, useEffect, useState, useCallback } from 'react'
import { GetSearchItems } from '../services/Productsservices';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import priceDisplay from '../util/priceDisplay';
import Lottie from 'lottie-react';
import search from '../search.json'
import ItemCard from '../components/ItemCard';

export default function SearchItems() {

    const cart = useSelector((state) => state.cart.cart);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [itemLoading, setItemLoading] = useState(false);
    const headerRef = useRef(null);
    const inputRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);

    useEffect(() => {
        inputRef.current?.focus();
        
        const updateHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const fetchitems = useCallback(async () => {
        setItemLoading(true)
        try {
            const itemsdata = await GetSearchItems(query);
            setItems(itemsdata)
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setItemLoading(false)
        }
    }, [query]);

    useEffect(() => {
        if (!query.trim()) {
            setItems([])
            return;
        }

        const timer = setTimeout(() => {
            fetchitems()
        }, 400);

        return () => clearTimeout(timer);
    }, [fetchitems, query]);

    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    const onClose = () => {
        navigate(-1);
    }

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area'>
                    <div className="search-form d-flex gap-3 align-items-center justify-content-start">
                        <button className='icon-btn' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>
                        <div className="form-group">
                            <input ref={inputRef} className="form-control" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                            <span className='search-icon'>{query !== "" ? <span role='button' onClick={() => setQuery("")}><i className="fa-solid fa-close"></i></span> : <Lottie animationData={search} loop={true} autoplay={true} style={{ width: 18, height: 18 }} />}</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className='site-main'>
                <div className='items-container search-items-container'>
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 64) : (height + 2)}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className='alter'>
                            <div className={`item-list ${items.length > 0 ? 'products-list col-3' : 'empty-list'}`}>
                                {itemLoading ? Array.from({ length: 8 }).map((_, i) => (<div key={i} className="item">
                                    <div className='item-inner'>
                                        <div className='unit skeleton'></div>
                                        <div className="meta">
                                            <h2 className="skeleton"></h2>
                                        </div>
                                        <div className='price skeleton'></div>
                                        <div className="meta" style={{ marginTop: 'auto' }}>
                                            <div className="cart-action skeleton"></div>
                                        </div>
                                    </div>
                                </div>)) : items?.length > 0 ? items?.map((item, index) => <ItemCard key={index} item={item} />) : <h2 className='no-data'>No Search Result Items Found</h2>}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                {cart.length > 0 && <div className="cart-summary-badge" onClick={() => navigate("/cart", { replace: true })}>
                    <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                    <button className="icon-btn alt"><i className="fa-solid fa-arrow-right"></i></button>
                </div>}
            </main>
        </>
    )
}
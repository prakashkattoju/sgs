import { useRef, useEffect, useState, useCallback } from 'react'
import { GetItems } from '../services/Productsservices';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import priceDisplay from '../util/priceDisplay';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';

export default function Home() {
    const cart = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);

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

    const fetchitems = useCallback(async () => {
        setItemLoading(true)
        try {
            const itemsdata = await GetItems();
            setItems(itemsdata)
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setItemLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchitems();
    }, [fetchitems]);


    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    return (
        <>
            <Header headerRef={headerRef} title={'Top Selling Items'} subtitle={`${items.length} item(s)`} />
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
                                </div>)) : items?.length > 0 ? items?.map((item, index) => <ItemCard key={index} item={item} />) : <h2 className='no-data'>No Top Selling Items Found</h2>}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                {cart.length > 0 && <div className="cart-summary-badge" onClick={() => navigate("/cart", { replace: true })}>
                    <div className="cart-bottom-bar">CONTINUE</div>
                    <button><i className="fa-solid fa-arrow-right"></i></button>
                </div>}
            </main>
        </>
    )
}
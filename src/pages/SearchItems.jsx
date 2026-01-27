import { useRef, useEffect, useState, useCallback } from 'react'
import { GetSearchItems } from '../services/Productsservices';
import { GetOrders } from '../services/Billservices';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import priceDisplay from '../util/priceDisplay';
import Units from '../components/Units';
import ItemCartCal from '../components/ItemCartCal';

export default function SearchItems() {

    const cart = useSelector((state) => state.cart.cart);
    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [orders, setOrders] = useState([])
    const [items, setItems] = useState([]);
    const [itemLoading, setItemLoading] = useState(false);

    const headerRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);
    const [AddToCartModalIndex, setAddToCartModalIndex] = useState(null)

    const [itemUnit, setItemUnit] = useState('')
    const [itemUnitValue, setItemUnitValue] = useState(null)

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
            mobile: user.mobile,
            search: "yes"
        }
        try {
            setItemLoading(true)
            const res = await GetOrders(searchData);
            setOrders(res);
            setItems(res)
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setItemLoading(false)
        }
    }, [user.mobile]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, user.mobile]);

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
            setItems(orders)
            return;
        }

        const timer = setTimeout(() => {
            fetchitems()
        }, 400);

        return () => clearTimeout(timer);
    }, [fetchitems, query]);

    const checkForAdd = (item_id) => {
        const found = cart.some(el => el.item_id === item_id);
        return found;
    }

    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    const calculatePrice = (pricePerKg, weight, unit = 'g') => {
        const weightInKg = unit === 'kg' ? weight : weight / 1000;
        return weightInKg * pricePerKg;
    };

    const addToCartModalOpen = (item) => {
        const unit = item.unit === 'g' ? 'kg' : item.unit === 'ml' ? 'ltr' : 'pkt'
        setItemUnit(unit)
        setAddToCartModalIndex(item.item_id);
    };

    const addOptToCart = (item) => {

        const itemTotal = item.unit === 'g' ? calculatePrice(item.price, itemUnitValue, itemUnit) : itemUnitValue * item.price;

        const cartItem = {
            'item_id': parseInt(item.item_id),
            'title': item.item,
            'price': parseInt(item.price),
            'totalPrice': parseInt(itemTotal),
            'itemUnit': itemUnit,
            'itemUnitValue': itemUnitValue,
        }
        console.log("cartItem", cartItem)
        dispatch(addToCart(cartItem))
        handleAddToCartModalCancel()
    }
    const remove = (item_id) => {
        dispatch(removeFromCart(item_id));
        setItemUnit('')
        setItemUnitValue(null)
    }

    const handleAddToCartModalCancel = () => {
        setItemUnit('')
        setItemUnitValue(null)
        document.activeElement?.blur();
        setAddToCartModalIndex(null);
    };

    const onClose = () => {
        navigate(-1);
    }

    return (
        <>
            <header ref={headerRef} style={{ paddingBottom: 0 }}>
                <div className='search-area d-flex gap-2 align-items-center justify-content-between'>
                    <button style={{ marginRight: 'auto' }} className='icon-btn-s' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="search-form">
                        <div className="form-group">
                            <input className="form-control alt" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                            <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                        </div>
                    </div>
                </div>
                <div className='search-area'><h3 style={{fontSize: 20}} className='text-start'>{query.length > 0 ? 'Search Results' : 'Recently Ordered Items'}</h3></div>
                <hr />
            </header>
            <div className='items-container search-items-container'>
                <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 71) : (height + 21)}px)` }} className="list scroll">
                    <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className='alter'>
                        <div className={`item-list ${items.length > 0 ? 'products-list' : 'products-list'}`}>
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
                            </div>)) : items?.length > 0 ? items?.map((item, index) => <div key={index} className="item">
                                <div className='item-inner'>
                                    <Units unit={item.unit} base_unit={item.base_unit} />
                                    <div className="meta">
                                        <h2>{item.item}</h2>
                                    </div>
                                    <div className='price'>{priceDisplay(parseInt(item.price))}</div>
                                    <div className="meta add-to-cart-meta">
                                        <div className="cart-action">
                                            {checkForAdd(parseInt(item.item_id)) ?
                                                (<div>
                                                    <button className="btnAddAction init secondary" onClick={() => remove(item.item_id)}><i className="fa-solid fa-trash-can"></i></button>
                                                </div>) :
                                                <>
                                                    <button className="btnAddAction init" onClick={() => addToCartModalOpen(item)}><i className="fa-solid fa-plus"></i></button>
                                                    <div
                                                        className={`dfc-modal modal fade ${AddToCartModalIndex === item.item_id ? "show d-flex" : ""}`}
                                                        id={`AddToCartModal${index}`}
                                                        tabIndex="-1"
                                                    >
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h4 className="modal-title text-start small">Select {item.unit === 'g' ? 'kg / g' : item.unit === 'ml' ? 'ltr / ml' : 'pkt'}, and enter value for {item.item}</h4>
                                                                    <button type="button" className="btn-close small" onClick={handleAddToCartModalCancel}></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className='d-flex align-items-center gap-2'>
                                                                        <ItemCartCal itemUnit={itemUnit} setItemUnit={setItemUnit} setItemUnitValue={setItemUnitValue} />

                                                                        <button className="btn" onClick={() => addOptToCart(item)}><i className="fa-solid fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>) : <h4 className='text-center'>No {query.length > 0 ? 'Search' : 'Recently Ordered'} Items Found</h4>}
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
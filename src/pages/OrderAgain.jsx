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
import Header from '../components/Header';

export default function OrderAgain() {

    const cart = useSelector((state) => state.cart.cart);
    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [items, setItems] = useState([])
    const [itemLoading, setItemLoading] = useState(false);

    const headerRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);
    const [AddToCartModalIndex, setAddToCartModalIndex] = useState(null)

    const [itemUnitValue1, setItemUnitValue1] = useState(0)
    const [itemUnitValue2, setItemUnitValue2] = useState(0)

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
            setItems(res);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setItemLoading(false)
        }
    }, [user.mobile]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, user.mobile]);

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

    const addToCartModalOpen = (item) => {
        setAddToCartModalIndex(item.item_id);
    };

    const addOptToCart = (item) => {

        const itemUnit = item.unit === 'kg' ? itemUnitValue1 + itemUnitValue2 >= 1000 ? 'kg' : 'g' : item.unit === 'ltr' ? itemUnitValue1 + itemUnitValue2 >= 1000 ? 'ltr' : 'ml' : item.unit === 'unit' ? 'unit' : 'pkt'

        const itemUnitValue = item.unit === 'kg' || item.unit === 'ltr' ? (itemUnitValue1 + itemUnitValue2) / 1000 : (itemUnitValue1 + itemUnitValue2)

        //const itemTotal = item.unit === 'kg' || item.unit === 'ltr' ? calculatePrice(item.price, itemUnitValue, itemUnit) : itemUnitValue * item.price;

        const itemTotal = itemUnitValue * item.price;

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
        setItemUnitValue1(0)
        setItemUnitValue2(0)
    }

    const handleAddToCartModalCancel = () => {
        setItemUnitValue1(0)
        setItemUnitValue2(0)
        document.activeElement?.blur();
        setAddToCartModalIndex(null);
    };

    return (
        <>
            <Header headerRef={headerRef} title="Order Again" subtitle={`${items.length} item(s) recently ordered`} />
            <div className='items-container search-items-container'>
                <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 80) : (height + 21)}px)` }} className="list scroll">
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
                            </div>)) : items?.length > 0 ? items?.map((item, index) => <div key={index} className="item">
                                <div className='item-inner' role='button' onClick={() => checkForAdd(parseInt(item.item_id)) ? remove(item.item_id) : addToCartModalOpen(item)}>
                                    <div className='w-100 d-flex align-items-center justify-content-between'>
                                        <Units unit={item.unit} base_unit={item.base_unit} />
                                        {checkForAdd(parseInt(item.item_id)) ? <button className='icon-btn-cart del'><i className="fa-solid fa-trash-can"></i></button> : <button className='icon-btn-cart add'><i className="fa-solid fa-plus"></i></button>}
                                    </div>
                                    <div className="meta">
                                        <h2>{item.item}</h2>
                                    </div>
                                    <div className='price'>{priceDisplay(parseInt(item.price))}</div>
                                </div>

                                {!checkForAdd(parseInt(item.item_id)) &&
                                    <div
                                        className={`dfc-modal modal fade ${AddToCartModalIndex === item.item_id ? "show d-flex" : ""}`}
                                        id={`AddToCartModal${index}`}
                                        tabIndex="-1"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title small"><span>{item.item}</span>Enter {item.unit === 'kg' ? 'kg (and/or) grams' : item.unit === 'ltr' ? 'ltr (and/or) ml' : item.unit === 'unit' ? 'unit(s)' : 'pkt(s)'} values</h4>
                                                </div>
                                                <div className="modal-body">
                                                    <div className='d-flex flex-column align-items-center justify-content-between gap-2'>
                                                        <ItemCartCal itemUnit={item.unit} setItemUnitValue1={setItemUnitValue1} setItemUnitValue2={setItemUnitValue2} itemUnitValue1={itemUnitValue1} itemUnitValue2={itemUnitValue2} />
                                                    </div>
                                                </div>
                                                <div className="modal-footer justify-content-center">
                                                    <button type="button" className="btn btn-secondary" onClick={handleAddToCartModalCancel}>Cancel</button>
                                                    <button disabled={itemUnitValue1 + itemUnitValue2 === 0} className="btn" onClick={() => addOptToCart(item)}><span>Add</span> <i className="fa-solid fa-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                            </div>) : <h2 className='no-data'>No Recently Ordered Items Found</h2>}
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
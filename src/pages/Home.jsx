import { useRef, useEffect, useState, useCallback } from 'react'
import { GetItems } from '../services/Productsservices';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import priceDisplay from '../util/priceDisplay';
import Header from '../components/Header';
import Units from '../components/Units';
import ItemCartCal from '../components/ItemCartCal';
import ConfirmModal from '../components/ConfirmModal';

export default function Home() {

    const cart = useSelector((state) => state.cart.cart);

    //console.log("cart", cart)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);

    const headerRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);
    const [AddToCartModalIndex, setAddToCartModalIndex] = useState(null)

    const [itemUnitValue1, setItemUnitValue1] = useState(0)
    const [itemUnitValue2, setItemUnitValue2] = useState(0)

    const [confirm, setConfirm] = useState({
        status: false,
        item_id: null,
        item_name: null
    });

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

    const checkForAdd = (item_id) => {
        const found = cart.some(el => el.item_id == item_id);
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
        dispatch(addToCart(cartItem))
        handleAddToCartModalCancel()
    }
    const remove = (item_id) => {
        dispatch(removeFromCart(item_id));
        setItemUnitValue1(0)
        setItemUnitValue2(0)
        handleCancel()
    }

    const handleAddToCartModalCancel = () => {
        setItemUnitValue1(0)
        setItemUnitValue2(0)
        document.activeElement?.blur();
        setAddToCartModalIndex(null);
    };

    const handleCancel = () => {
        document.activeElement?.blur();
        setConfirm({
            status: false,
            item_id: null,
            item_name: null
        });
    };

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
                                </div>)) : items?.length > 0 ? items?.map((item, index) => <div key={index} className="item">
                                    <div className='item-inner' role='button' onClick={() => checkForAdd(parseInt(item.item_id)) ? setConfirm({
                                        status: true,
                                        item_id: item.item_id,
                                        item_name: item.item
                                    }) : addToCartModalOpen(item)}>
                                        <div className="meta">
                                            <h2>{item.item}</h2>
                                        </div>
                                        <div className='price'>{priceDisplay(parseInt(item.price))}</div>
                                        <div className='w-100 d-flex align-items-center justify-content-between'>
                                            <Units item_id={item.item_id} unit={item.unit} base_unit={item.base_unit} />
                                            {checkForAdd(parseInt(item.item_id)) ? <button className='icon-btn-cart del'><i className="fa-solid fa-trash-can"></i></button> : <button className='icon-btn-cart add'>ADD</button>}
                                        </div>
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
                                                        <ItemCartCal itemUnit={item.unit} setItemUnitValue1={setItemUnitValue1} setItemUnitValue2={setItemUnitValue2} itemUnitValue1={itemUnitValue1} itemUnitValue2={itemUnitValue2} />
                                                    </div>
                                                    <div className="modal-footer align-items-center justify-content-center gap-3">
                                                        <button type="button" className="btn btn-secondary" onClick={handleAddToCartModalCancel}>Cancel</button>
                                                        <button disabled={itemUnitValue1 + itemUnitValue2 === 0} className="btn" onClick={() => addOptToCart(item)}><span>Add</span></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                </div>) : <h2 className='no-data'>No Top Selling Items Found</h2>}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                {cart.length > 0 && <div className="cart-summary-badge" onClick={() => navigate("/cart", { replace: true })}>
                    <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                    <button className="icon-btn alt"><i className="fa-solid fa-arrow-right"></i></button>
                </div>}
                <ConfirmModal
                    show={confirm.status}
                    title="Remove Item"
                    message={`Are you sure you want to remove "${confirm.item_name}" from order?`}
                    onConfirm={() => remove(confirm.item_id)}
                    onConfirmLabel="Yes"
                    onCancel={handleCancel}
                />
            </main>
        </>
    )
}
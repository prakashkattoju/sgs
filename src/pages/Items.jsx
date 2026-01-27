import { useRef, useEffect, useState, useCallback } from 'react'
import { GetCategoryByID, GetItems } from '../services/Productsservices';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import priceDisplay from '../util/priceDisplay';
import Header from '../components/Header';
import Units from '../components/Units';
import ItemCartCal from '../components/ItemCartCal';

export default function Items() {

    const cart = useSelector((state) => state.cart.cart);

    //console.log("cart", cart)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug, cat_id, scat_id } = useParams();

    const [categoryItem, setCategoryItem] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const checkForAdd = (item_id) => {
        const found = cart.some(el => el.item_id === item_id);
        return found;
    }
    const getQuantity = (item_id) => {
        const qty = cart.find((el) => el.item_id === item_id);
        return qty.quantity;
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

    const { category, sub_cats } = categoryItem

    return (
        <>
            <Header headerRef={headerRef} title={category ? `Buy "${category}" Items` : 'Buy Items'} />
            <div className='items-container'>
                <div className='items-container-inner' style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 71) : (height + 21)}px)` }}>
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 71) : (height + 21)}px)` }} className="list scroll">
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
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 71) : (height + 21)}px)` }} className="list scroll">
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className='alter'>
                            <div className={`item-list ${items.length > 0 ? 'products-list' : 'empty-list'}`}>
                                {itemLoading ? Array.from({ length: 6 }).map((_, i) => (<div key={i} className="item">
                                    <div className='item-inner'>
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
                                </div>) : <h2 className='no-data'>No Items Found</h2>}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
            {cart.length > 0 && <div className="cart-summary-badge" onClick={() => navigate("/cart", { replace: true })}>
                <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                <button className="icon-btn alt"><i className="fa-solid fa-arrow-right"></i></button>
            </div>}
        </>
    )
}
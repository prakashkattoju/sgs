import { useEffect, useState, useRef } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
//import { verifyCartItems } from '../store/cartThunks';
import { useNavigate, Link } from "react-router-dom";
import { decodeToken } from 'react-jwt';
import { CreateBill } from '../services/Billservices';
import { UpdateUserName } from '../services/Userservices';
import ConfirmModal from '../components/ConfirmModal';
import { FaSpinner } from "react-icons/fa";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Cart() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart.cart);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const [removedItems, setRemovedItems] = useState([])
    const decodedToken = decodeToken(token);
    const user_id = decodedToken?.user_id;
    const [loading, setLoading] = useState(false);
    const [showPromptModal, setShowPromptModal] = useState(false)

    const headerRef = useRef(null);
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

    const backBtn = () => {
        navigate('/')
    }

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            uname: ""
        },
        validationSchema: Yup.object({
            uname: Yup.string()
                .required("Name is required")
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const data = await UpdateUserName(values.uname, user_id);
                if (data.status) {
                    dispatch(setUserDetails({
                        ...user,
                        fullname: values.uname,
                    }))
                    handleConfirmSubmit()
                }
            } catch (error) {
                console.error("Error", error)
            }
        },
    });

    const getQuantity = (item_id) => {
        const qty = cart.find((el) => el.item_id === item_id);
        return qty.quantity;
    }

    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.price * item.quantity, 0));
    }

    const getCartItemsAmount = (item) => {
        return priceDisplay(item.price * item.quantity);
    }
    const remove = (item_id) => {
        dispatch(removeFromCart(item_id));
    }

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowPromptModal(false);
    };

    const handleConfirmSubmit = async () => {

        setLoading(true)
        const cartdata = {
            total_quantity: getCartQuantity(),
            total_price: cart.reduce((total, item) => total + item.price * 1, 0),
            items: cart
        };
        try {
            const data = await CreateBill(cartdata);
            if (data.status) {
                //handleCancel();
                navigate('/bill', { state: { token_num: data.token_num } })
            }
        } catch (error) {
            console.error("Error", error.message)
        }
    }

    const setSearchResultsFunc = (text) => {
        if (text !== '') {
            navigate('/', { state: { queryString: text } })
        }
    }

    const logoutAccount = () => {
        dispatch(logOut()); // Dispatch the logout action to clear user state
        dispatch(setUserDetails({
            fullname: null,
            mobile: null
        }))
        navigate("/", { replace: true }); // Redirect the user to the login page after logging out
        window.location.reload(true);
    };

    const handleExitCancel = () => {
        document.activeElement?.blur();
        setShowConfirm(false);
    };

    return (<>
        <header ref={headerRef} className="site-header">
            <div className='site-header-top d-flex gap-3 align-items-center justify-content-start'>
                <img src='/icon.jpg' alt='' />
                <div>
                    <h1>SIRI GENERAL STORES</h1>
                    <div className='d-flex gap-3 align-items-end justify-content-start'><h3><i className="fa-solid fa-location-dot"></i> KAKINADA</h3><h3><i className="fa-solid fa-mobile-screen"></i> 9343343434</h3></div>
                </div>
            </div>
            <div className='search-area d-flex gap-2 align-items-center justify-content-between'>
                <button className='icon-btn-s' onClick={backBtn}><i className="fa-solid fa-arrow-left"></i></button>
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
            <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 89) : (height + 30)}px)` }} className="list scroll">
                <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className='alter'>
                    <div className={`item-list ${cart.length > 0 ? 'cart-list' : 'empty-list'}`}>
                        {cart?.length > 0 && cart.map((item, index) =>
                            <div key={index} className="item">
                                <div className='item-inner'>
                                    <div className="meta">
                                        <h2>{item.title}</h2>
                                        <div className="meta-inner">
                                            <div className="meta-info">
                                                <div className="price">{priceDisplay(parseInt(item.price)).replace("₹", "")}</div>
                                                <span className="itemid"># {item.item_id}</span>
                                            </div>
                                            <div className="cart-action">
                                                <div className="opt">
                                                    <button className="minus" onClick={() => decrement(item.item_id)}><i className="fa-solid fa-minus"></i></button>
                                                    <div className="qty">{getQuantity(parseInt(item.item_id))}Kg</div>
                                                    <button className="plus" onClick={() => increment(item.item_id)}><i className="fa-solid fa-plus"></i></button>
                                                </div>
                                                <div className="price">{priceDisplay(parseInt(item.price) * item.quantity).replace("₹", "")}</div>
                                            </div>
                                            <button className='remove-item' onClick={() => remove(item.item_id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {cart?.length > 0 ? <div className="addmore"><p>If you want add more items.</p><button type="button" className="btn toggle" onClick={() => navigate("/", { replace: true })}>Add More</button></div> :
                            <div className="cart-summary-review">
                                <div className="tbl-cart show-cart">
                                    <div className="addmore"><p>Your cart is empty.</p><button type="button" className="btn toggle" onClick={() => navigate("/", { replace: true })}>Add Items</button></div>
                                </div>
                            </div>}
                    </div>
                </PerfectScrollbar>
            </div>
        </div>
        {cart.length > 0 && <div className="cart-summary-badge">
            <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()} items</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
            <div className="continue">
                <button className="btn" onClick={() => setShowPromptModal(true)}>Submit</button>
            </div>
        </div>}
        <div
            className={`dfc-modal modal fade ${showPromptModal ? "show d-flex" : ""}`}
            id="PromptModal"
            tabIndex="-1"
        >
            <div className="modal-dialog">
                {user.fullname === "" ? <form className="modal-content" onSubmit={formik.handleSubmit}>
                    <div className="modal-header">
                        <h4 className="modal-title">Enter Name & Confirm Order</h4>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <input
                                name="uname"
                                placeholder="Your name"
                                value={formik.values.uname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-control"
                            />
                            {formik.touched.uname && formik.errors.uname ? (
                                <div className="input-error">{formik.errors.uname}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn"> {loading && <FaSpinner className="animate-spin" />} Submit </button>
                    </div>
                </form> :
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Confirm Order</h4>
                        </div>
                        <div className="modal-body">
                            <p>{`Are you sure you want to place your order?`}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                No
                            </button>
                            <button className="btn" onClick={handleConfirmSubmit}>
                                {loading && <FaSpinner className="animate-spin" />} Yes
                            </button>
                        </div>
                    </div>}
            </div>
        </div>
        <ConfirmModal
            show={showConfirm}
            title="Exit!"
            message={`Are you sure you want to exit?`}
            onConfirm={() => logoutAccount()}
            onConfirmLabel="Yes"
            onCancel={handleExitCancel}
        />
    </>
    )
}
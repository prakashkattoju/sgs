import { useState } from 'react'
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate, useLocation } from "react-router-dom";

export default function Bill() {
    const dispatch = useDispatch()
    const location = useLocation();
    const cart = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const { token_num } = location.state || 0;

    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    const onClose = () => {
        dispatch(clearCart());
        navigate('/')
    }

    return (
        <div className='bill-details'>
            <button type="button" className="btn-close" onClick={onClose}></button>
            <h2>Order Details</h2>
            <table>
                <thead>
                    <tr className='token'><th className='pb-0' colSpan={2}>Token No</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{token_num}</th></tr>
                    <tr><th colSpan={5} className='sep pb-0'></th></tr>
                    <tr><th className='pb-0' colSpan={2}>Date</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{new Date().toLocaleDateString('en-IN')}</th></tr>
                    <tr><th colSpan={5} className='sep pb-0'></th></tr>
                    <tr><th className='pb-0' colSpan={2}>Name</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{user.fullname}</th></tr>
                    <tr><th className='pb-0' colSpan={2}>Mobile Number</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{user.mobile}</th></tr>
                    <tr><th colSpan={5} className='sep pb-0'></th></tr>
                    <tr><th className='pid'>#</th><th className='pname'>Items</th><th>&nbsp;</th><th>I.Rs.</th><th>Rs.</th></tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => <tr key={index}><td className='pid'>{item.item_id}</td><td className='pname'>{item.title}</td><td>{item.itemUnitValue} {item.itemUnit}</td><td>{priceDisplay(parseInt(item.price)).replace("₹", "")}</td><td>{priceDisplay(parseInt(item.totalPrice)).replace("₹", "")}</td></tr>)}
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={2}>No. of Items</td><td>{getCartQuantity()}</td><td colSpan={2}></td></tr>
                    <tr><td colSpan={2}>Amount</td><td colSpan={2}></td><td>{getCartAmount().replace("₹", "")}</td></tr>
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={3}>Total Amount</td><td colSpan={1}></td><td>{getCartAmount().replace("₹", "")}</td></tr>
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td style={{color:'red'}} colSpan={5}>Note: Total amount is estimated.</td></tr>
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={5}><h4 className='pt-4 text-center'>*** THANK YOU ***</h4></td></tr>
                </tbody>
            </table>
        </div>
    )
}
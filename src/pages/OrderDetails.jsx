import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import priceDisplay from '../util/priceDisplay';
import { format } from 'date-fns'
import { ChangeOrderStatus } from '../services/Billservices';
import AlertModal from '../components/AlertModal';
import { FaSpinner } from "react-icons/fa";

export default function OrderDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [orderDetails, setOrderDetails] = useState(location.state ? location.state : [])
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState({
        title: null,
        message: null,
        show: false
    });

    const onClose = () => {
        navigate(-1);
    }

    return (
        <>
            <div id="orderDetails" className="bill-details">
                <button type="button" className="btn-close" onClick={onClose}></button>
                <h2 className='text-start'>Hello, {user.fullname ? user.fullname : 'User'}</h2>
                <h4 className='text-start'><span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-600q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" /></svg> {user.mobile}</span></h4>
                <hr />
                <table>
                    <thead>
                        <tr className='token'><th className='pb-0' colSpan={2}>Token No</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{orderDetails.token_num}</th></tr>
                        <tr><th colSpan={5} className='sep pb-0'></th></tr>
                        <tr><th className='pb-0' colSpan={2}>Date</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{format(new Date(orderDetails.dcreated_on), 'dd-MM-yyyy')}</th></tr>
                        <tr><th colSpan={5} className='sep pb-0'></th></tr>
                        <tr><th className='pid'>#</th><th className='pname'>Items</th><th>Qty</th><th>I.Rs.</th><th>Rs.</th></tr>
                    </thead>
                    <tbody>
                        {orderDetails.items?.map((item, index) => <tr key={index}><td className='pid'>{item.product_id}</td><td className='pname'>{item.title}</td><td>{item.quantity}</td><td>{item.unit_price}</td><td>{item.quantity * item.unit_price}</td></tr>)}
                        <tr><td className='sep' colSpan={5}></td></tr>
                        <tr><td colSpan={2}>Items Total</td><td>{orderDetails.total_quantity}</td><td colSpan={2}></td></tr>
                        <tr><td colSpan={2}>Amount</td><td colSpan={2}></td><td>{orderDetails.total_price}</td></tr>
                        <tr><td className='sep' colSpan={5}></td></tr>
                        <tr><td colSpan={2}>Total Amount</td><td className='text-end' colSpan={3}>{priceDisplay(orderDetails.total_price)}</td></tr>
                    </tbody>
                </table>
            </div>
            {/* <AlertModal
                show={showAlert.show}
                title={showAlert.title}
                message={showAlert.message}
                onClose={() => {
                    navigate('/', { state: orderDetails.dcreated_on })
                }}
            /> */}
        </>
    )
}
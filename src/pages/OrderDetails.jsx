import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import priceDisplay from '../util/priceDisplay';
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function OrderDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const { token_num, total_quantity, total_price, items: orderDetails, status } = location.state || 0;

    const getCartQuantity = () => {
        return orderDetails.reduce(total => total + total_price, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(orderDetails.reduce((total, item) => total + item.totalPrice * item.itemUnitValue, 0));
    }

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

    const onClose = () => {
        navigate(-1);
    }

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area d-flex gap-3 align-items-center justify-content-start'>
                    <button className='icon-btn' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>
                    <div>
                        <h1>Order No: {token_num}</h1>
                        <p>{total_quantity} item(s) ordered</p>
                    </div>
                </div>
            </header>
            <main className='site-main no-bg'>
                <div style={{ height: `calc(100dvh - ${height + 54}px)` }} className="list scroll">
                    <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                        <div className='bill-details'>
                            <table>
                                <thead>
                                    <tr><th colSpan={2} className='pb-0'>Date:</th><th colSpan={2} className='pb-0'>{new Date().toLocaleDateString('en-IN')}</th></tr>
                                    <tr><th colSpan={4} className='sep pb-0'></th></tr>
                                    <tr><th colSpan={2} className='pname'>Items</th><th>No. of Items</th><th style={{textAlign:'right'}}>I./T. Price</th></tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((item, index) =>
                                        <tr key={index}>
                                        <td colSpan={2} className='pname'>{item.title}</td><td>{item.itemUnit === 'KG' || item.itemUnit === 'G' ? item.itemUnitValue > 1 ? item.itemUnitValue : item.itemUnitValue * 1000 : item.itemUnitValue} {item.itemUnit === 'KG' || item.itemUnit === 'G' ? `${item.itemUnitValue > 1 ? 'KG' : 'G'}` : `${item.itemUnitValue > 1 ? `${item.itemUnit}'S` : item.itemUnit}`}</td>{status == 0 ? <td style={{textAlign:'right'}}>-</td> : <td style={{textAlign:'right'}}>{priceDisplay(item.price).replace('₹', '')}<br/>{priceDisplay(item.totalPrice).replace('₹', '')}</td>}</tr>)}
                                    <tr><td className='sep' colSpan={4}></td></tr>
                                    {status == 0 ? <tr><td style={{ color: 'red' }} colSpan={4}>Note:<br />You will receive a WhatsApp message if the prices for this order are updated.</td></tr> : <tr><th colSpan={2} className='pb-0'>Total Quantity: {total_quantity}</th><th colSpan={2} className='pb-0' style={{textAlign:'right'}}>Total Price: {priceDisplay(total_price)}</th></tr>}
                                    <tr><td className='sep' colSpan={4}></td></tr>
                                    <tr><td colSpan={4}><h4 className='pt-4 text-center'>*** THANK YOU ***</h4></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </PerfectScrollbar>
                </div>
                {/* <AlertModal
                show={showAlert.show}
                title={showAlert.title}
                message={showAlert.message}
                onClose={() => {
                    navigate('/', { state: orderDetails.dcreated_on })
                }}
            /> */}
            </main>
        </>
    )
}
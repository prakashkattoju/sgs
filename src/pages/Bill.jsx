import React, { useState, useEffect, useRef } from 'react'
import priceDisplay from '../util/priceDisplay';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Bill() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

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

    const { token_num, cart } = location.state || 0;

    const getCartQuantity = () => {
        return cart.reduce(total => total + 1, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.totalPrice * 1, 0));
    }

    const onClose = () => {
        navigate('/')
    }

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area d-flex gap-3 align-items-center justify-content-start'>
                    <button className='icon-btn' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>
                    <div>
                        <h1>Order No: {token_num}</h1>
                        <p>{getCartQuantity()} item(s) ordered</p>
                    </div>
                </div>
                <hr />
            </header>
            <div style={{ height: `calc(100dvh - ${height + 81}px)` }} className="list scroll">
                <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                    <div className='bill-details'>
                        <table>
                            <thead>
                                <tr><th className='pb-0' colSpan={2}>Date</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{new Date().toLocaleDateString('en-IN')}</th></tr>
                                {/* <tr><th colSpan={5} className='sep pb-0'></th></tr>
                                <tr><th className='pb-0' colSpan={2}>Name</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{user.fullname}</th></tr>
                                <tr><th className='pb-0' colSpan={2}>Mobile Number</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{user.mobile}</th></tr> */}
                                <tr><th colSpan={5} className='sep pb-0'></th></tr>
                                <tr><th colSpan={2} className='pname'>Items</th><th>&nbsp;</th><th style={{textAlign:'center'}}>I.Rs.</th><th style={{textAlign:'center'}}>Rs.</th></tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => <tr key={index}><td colSpan={2} className='pname'>{item.title}</td><td>{item.itemUnit === 'g' || item.itemUnit === 'ml' ? item.itemUnitValue * 1000 : item.itemUnitValue} {`${item.itemUnit === 'unit' || item.itemUnit === 'pkt' ? `${item.itemUnit}(s)` : item.itemUnit}`}</td><td style={{textAlign:'right'}}>{priceDisplay(parseInt(item.price)).replace("₹", "")}</td><td style={{textAlign:'right'}}>{priceDisplay(parseInt(item.totalPrice)).replace("₹", "")}</td></tr>)}
                                <tr><td className='sep' colSpan={5}></td></tr>
                                <tr><td colSpan={2}>No. of Items</td><td>{getCartQuantity()}</td><td colSpan={2}></td></tr>
                                <tr><td colSpan={2}>Amount</td><td colSpan={2}></td><td style={{textAlign:'right'}}>{getCartAmount().replace("₹", "")}</td></tr>
                                <tr><td className='sep' colSpan={5}></td></tr>
                                <tr><td colSpan={3}>Total Amount</td><td colSpan={1}></td><td style={{textAlign:'right'}}>{getCartAmount().replace("₹", "")}</td></tr>
                                <tr><td className='sep' colSpan={5}></td></tr>
                                <tr><td style={{ color: 'red' }} colSpan={5}>Note: Total amount is estimated.</td></tr>
                                <tr><td className='sep' colSpan={5}></td></tr>
                                <tr><td colSpan={5}><h4 className='pt-4 text-center'>*** THANK YOU ***</h4></td></tr>
                            </tbody>
                        </table>
                    </div>
                </PerfectScrollbar>
            </div>
        </>
    )
}
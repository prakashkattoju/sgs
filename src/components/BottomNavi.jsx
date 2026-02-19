import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BottomNavi = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClose = () => {
        navigate(-1);
    }

    return (
        <footer className='site-footer'>
            <div className='bottom-navi'>
                <button onClick={() => navigate('/')} className={`bottom-navi-btn ${pathname === '/' ? 'active' : ''}`}><i className="fa-regular fa-house"></i><span>Home</span></button>
                <button onClick={() => navigate('/order-again')} className={`bottom-navi-btn ${pathname === '/order-again' ? 'active' : ''}`}><i className="fa-solid fa-repeat"></i><span>Order Again</span></button>
                {/* <button onClick={() => navigate('/search-items')} className={`bottom-navi-btn ${pathname === '/search-items' ? 'active' : ''}`}><i className="fa-solid fa-search"></i><span>Search</span></button> */}
                <button onClick={() => navigate('/account')} className={`bottom-navi-btn ${pathname === '/account' || pathname === '/account/orders' || pathname === '/order-details' ? 'active' : ''}`}><i className="fa-regular fa-circle-user"></i><span>You</span></button>
            </div>
        </footer>
    )
}

export default BottomNavi
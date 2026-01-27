import React from 'react'
import { useNavigate } from 'react-router-dom'

const BottomNavi = () => {
    const navigate = useNavigate();
    return (
        <div className='bottom-navi'>
            <button onClick={() => navigate('/')} className='bottom-navi-btn'><i className="fa-regular fa-house"></i><span>Home</span></button>
            <button onClick={() => navigate('/account')} className='bottom-navi-btn'><i className="fa-regular fa-circle-user"></i><span>Account</span></button>
            <button className='bottom-navi-btn'><i className="fa-solid fa-repeat"></i><span>Order Again</span></button>
            {/* <button className='bottom-navi-btn'><i className="fa-solid fa-search"></i><span>Search</span></button> */}
        </div>
    )
}

export default BottomNavi
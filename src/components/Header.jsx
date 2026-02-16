import { useNavigate, useLocation } from "react-router-dom";
import Lottie from 'lottie-react';
import search from '../search.json'
const Header = ({ headerRef, title, subtitle }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClose = () => {
        navigate(-1);
    }

    return (
        <header ref={headerRef} className="site-header">
            {pathname === '/' ?
                <div className="site-header-top">
                    <div className='d-flex gap-2 align-items-center justify-content-start mb-2'>
                        <img className="logo" src='/icon.jpg' alt='' />
                        <h1>SIRI GENERAL STORES, Kakinada</h1>
                        <a role='button' href='tel:9177965769' className='bottom-navi-btn large'><i className="fa-solid fa-mobile-screen"></i></a>
                    </div>
                    <hr />
                    <div className="search-form d-flex gap-3 align-items-start justify-content-between">
                        <div>
                            <h2>{title}</h2>
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                        <button onClick={() => navigate('/search-items')} className='search-icon-btn'><Lottie animationData={search} loop={true} autoplay={true} style={{ width: 18, height: 18 }} />
                        </button>
                    </div>
                </div> :
                <div className='search-area d-flex gap-3 align-items-center justify-content-start'>
                    {pathname !== '/' && <button className='icon-btn' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>}
                    <div>
                        <h2>{title}</h2>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                    <button style={{ marginLeft: 'auto' }} onClick={() => navigate('/search-items')} className='search-icon-btn'><Lottie animationData={search} loop={true} autoplay={true} style={{ width: 18, height: 18 }} /></button>
                </div>
            }
        </header>
    )
}

export default Header
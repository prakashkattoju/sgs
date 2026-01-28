import { useNavigate, useLocation } from "react-router-dom";
const Header = ({ headerRef, title }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClose = () => {
        navigate(-1);
    }

    return (
        <header ref={headerRef} className="site-header">
            <div className='site-header-top d-flex gap-2 align-items-center justify-content-start'>
                <img className="logo" src='/icon.jpg' alt='' />
                <h1>SIRI GENERAL STORES</h1>
                <button style={{marginLeft:'auto'}} onClick={() => navigate('/search-items')} className='icon-btn'><i className="fa-solid fa-square-phone"></i></button>
                <button style={{marginLeft:'auto'}} onClick={() => navigate('/search-items')} className='icon-btn-s'><i className="fa-solid fa-search"></i></button>
            </div>
            {/* <div className='search-area d-flex gap-2 align-items-center justify-content-start'>{pathname !== '/' && <button className='icon-btn-s' onClick={onClose}><i className="fa-solid fa-arrow-left-long"></i></button>}<h2>{title}</h2></div> */}
            <hr />
        </header>
    )
}

export default Header
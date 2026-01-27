import { useNavigate } from "react-router-dom";
const Header = ({ headerRef, title }) => {
    const navigate = useNavigate();
    return (
        <header ref={headerRef} className="site-header" style={{ paddingBottom: 0 }}>
            <div className='site-header-top d-flex gap-3 align-items-center justify-content-start'>
                <img src='/icon.jpg' alt='' />
                <div>
                    <h1>SIRI GENERAL STORES</h1>
                    <div className='d-flex gap-3 align-items-end justify-content-start'><h3><i className="fa-solid fa-location-dot"></i> KAKINADA</h3><h3><i className="fa-solid fa-mobile-screen"></i> 9343343434</h3></div>
                </div>
                <button style={{ marginLeft: 'auto' }} className='icon-btn-s' onClick={() => navigate('/search-items')}><i className="fa-solid fa-search"></i></button>
            </div>
            <div className='search-area'><h2 className='text-start'>{title}</h2></div>
            <hr />
        </header>
    )
}

export default Header
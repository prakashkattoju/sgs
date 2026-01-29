import { useNavigate, useLocation } from "react-router-dom";
const Header = ({ headerRef, title, subtitle }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClose = () => {
        navigate(-1);
    }

    return (
        <header ref={headerRef} className="site-header">
            {title === '' ?
                <div className='site-header-top d-flex gap-2 align-items-center justify-content-start'>
                    <img className="logo" src='/icon.jpg' alt='' />
                    <h1>SIRI GENERAL STORES, Kakinada</h1>
                </div> :
                <div className='search-area d-flex gap-3 align-items-center justify-content-start'>
                    {pathname !== '/' && <button className='icon-btn' onClick={onClose}><i className="fa-solid fa-arrow-left"></i></button>}
                    <div>
                        <h2>{title}</h2>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                </div>
            }
            <hr />
        </header>
    )
}

export default Header
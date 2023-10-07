import React, { useState } from 'react';
import './NavBar.css';
import { BrowserRouter, Link } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NavBar() {

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    const closeMobileMenu = () => setClick(false);

    return (
        <BrowserRouter>
            <header>
                <nav className='navbar navbar-expand-sm'>
                    <div className='container-fluid'>

                        <div className='navbar-brand'></div>
                        <div className={click ? 'navbar-items-visible' : 'navbar-items-hidden'}>
                            <ul className='navbar-nav'>
                                <li className='nav-item'>
                                    <Link to='/' className='nav-link' onClick={closeMobileMenu}>
                                        <i className="bi bi-house-door-fill"></i>
                                        <strong className='homeItem'>Home</strong>
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to='/sign-up' className='nav-link' onClick={closeMobileMenu}>
                                        Register
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to='/login' className='nav-link' onClick={closeMobileMenu}>
                                        Log in
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        <div className='toggle-button' onClick={handleClick}>
                            <i className={click ? 'bi bi-caret-down-fill' : 'bi bi-list'}></i>
                        </div>

                    </div>
                </nav>
            </header>
        </BrowserRouter>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import { NavLink } from 'react-router-dom';

function Return() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = (isCollapsed) => {
        setIsMenuOpen(isCollapsed);
    }

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>

                </div>
            </div>
        </div>
    );
}

export default Return;
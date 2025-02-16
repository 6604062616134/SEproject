import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLine } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

function NavbarLogin({ isMenuOpen, toggleMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        toggleMenu(newCollapsed);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
            // Redirect to home page after logout
            navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า home
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleToggle}
                        className="text-white text-xl z-10"
                    >
                        {isCollapsed ? '✖' : '☰'}
                    </button>
                    {/* จัดให้อยู่กลาง */}
                    <div className='text-center'>
                        <h1 className="text-white text-2xl font-bold">
                            Boardgames
                        </h1>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <p className="text-white text-xl font-semibold" >username</p>
                        <FontAwesomeIcon icon={faBell} className="ml-2 pr-4" />
                    </div>
                </div>

                {/* Menu */}
                <div
                    className={`fixed top-50rem left-0 w-1/6 bg-[#f2f2f2] text-white transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        } h-[100vh] z-50`}
                >
                    <a href="#home" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Home</a>
                    <a href="#about" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Return</a>
                    <a href="#services" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">History</a>
                    <a onClick={handleLogout} className="block px-6 text-black font-normal hover:underline cursor-pointer" style={{ position: 'relative', top: '315px' }}>Logout <span style={{ textDecoration: 'none' }}>-{'>'}</span></a>
                    <p className="block px-6 text-black font-semibold" style={{ position: 'relative', top: '470px' }}>Contact us</p>
                    <div>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-3xl pl-6"
                            style={{ position: 'relative', top: '305px' }}
                        >
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-4xl pl-4"
                            style={{ position: 'relative', top: '307px' }}
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-3xl pl-4"
                            style={{ position: 'relative', top: '305px' }}
                        >
                            <FontAwesomeIcon icon={faLine} />
                        </a>
                    </div>
                    <p className="text-black font-light" style={{ position: 'relative' , top: '310px' , left: '25px'}}>02-555-2000 , 1111</p>
                </div>
            </div>
        </div>
    );
}

export default NavbarLogin;

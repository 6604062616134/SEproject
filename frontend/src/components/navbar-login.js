import React, { useState, use } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLine } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

function NavbarLogin({ isMenuOpen, toggleMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(true); //red dot
    const navigate = useNavigate();

    const fetchNotification = async () => {
        try {
            const response = await axios.get('http://localhost:8000/notifications', { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        toggleMenu(newCollapsed);
    };

    const handleNotificationClick = () => {
        setIsNotificationOpen((prev) => !prev);
        if (!isOpenNoti) {
            fetchNotification();
            setIsOpenNoti(true);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleToggle}
                        className="text-white text-xl z-10"
                    >
                        {isCollapsed ? '☰' : '☰'}
                    </button>
                    {/* จัดให้อยู่กลาง */}
                    <div className='text-center'>
                        <NavLink to="/" className="text-white text-2xl font-bold">
                            Boardgames
                        </NavLink>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <p className="text-white text-xl font-semibold">username</p>
                        <button onClick={handleNotificationClick} className="ml-2 pr-4 cursor-pointer bg-transparent border-none z-10 relative">
                            <FontAwesomeIcon icon={faBell} />
                            {hasNewNotification && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"></span>
                            )}
                        </button>
                        {isNotificationOpen && (
                            <div className="absolute top-16 right-4 bg-white text-black p-4 rounded shadow-lg z-50 w-64" style={{ borderRadius: '35px' }}>
                                <h2 className="font-semibold text-lg">Notifications</h2>
                                <ul className="mt-2">
                                    <li className="border-b py-2">มีการอัปเดตใหม่ในระบบ</li>
                                    <li className="border-b py-2">มีบอร์ดเกมใหม่เข้ามา</li>
                                    <li className="py-2">โปรโมชันพิเศษสำหรับสมาชิก</li>
                                </ul>
                                <button
                                    className="mt-2 bg-black text-white w-full py-1 rounded hover:bg-gray-700"
                                    onClick={handleNotificationClick}
                                >
                                    ปิด
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu */}
                <div
                    className={`fixed top-50rem left-0 w-1/6 bg-[#f2f2f2] text-white transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        } h-[100vh] z-50`}
                >
                    <NavLink to="/home-login" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Home</NavLink>
                    <NavLink to="/return" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Return</NavLink>
                    <NavLink to="/history" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">History</NavLink>
                    <a onClick={handleLogout} className="block px-6 text-black font-normal hover:underline cursor-pointer z-10" style={{ position: 'relative', top: '315px' }}>Logout <span style={{ textDecoration: 'none' }}>-{'>'}</span></a>
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
                    <p className="text-black font-light" style={{ position: 'relative', top: '310px', left: '25px' }}>02-555-2000 , 1111</p>
                </div>
            </div>
        </div>
    );
}

export default NavbarLogin;
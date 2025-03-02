import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

function NavbarLogin({ isMenuOpen, toggleMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(true);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`http://localhost:8000/users/${userId}`, { withCredentials: true });
                    setUsername(response.data.data.name);
                } else {
                    console.error('User ID not found in localStorage');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

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

    return (
        <div className="font-sans">
            <div className="bg-black text-white fixed top-0 left-0 w-full z-50">
                <div className="flex items-center justify-between p-4">
                    <button onClick={handleToggle} className="text-white text-xl z-10">☰</button>
                    <div className='text-center'>
                        <NavLink to="/" className="text-white text-2xl font-bold">Boardgames</NavLink>
                        <p className='text-xs text-right'>KMUTNB</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <p className="text-white text-xl font-semibold">{username}</p>
                        <button onClick={handleNotificationClick} className="relative bg-transparent border-none cursor-pointer">
                            <FontAwesomeIcon icon={faBell} />
                            {hasNewNotification && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"></span>
                            )}
                        </button>
                        {isNotificationOpen && (
                            <div className="absolute top-16 right-4 bg-white text-black p-4 rounded shadow-lg z-50 w-64">
                                <h2 className="font-semibold text-lg">Notifications</h2>
                                <ul className="mt-2">
                                    <li className="border-b py-2">มีการอัปเดตใหม่ในระบบ</li>
                                    <li className="border-b py-2">มีบอร์ดเกมใหม่เข้ามา</li>
                                    <li className="py-2">โปรโมชันพิเศษสำหรับสมาชิก</li>
                                </ul>
                                <button className="mt-2 bg-black text-white w-full py-1 rounded hover:bg-gray-700" onClick={handleNotificationClick}>ปิด</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu */}
                <div className={`fixed mt-20 top-0 left-0 w-1/6 bg-[#f2f2f2] text-white transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} h-screen z-50`}>
                    <NavLink to="/home-login" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Home</NavLink>
                    <NavLink to="/return" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">Return</NavLink>
                    <NavLink to="/history" className="block px-6 py-4 text-black hover:bg-black font-medium hover:text-white">History</NavLink>
                    <button onClick={logout} className="block px-6 text-black font-normal hover:underline cursor-pointer mt-72">Logout <span style={{ textDecoration: 'none' }}>-{'>'}</span></button>
                    <p className="block px-6 text-black font-semibold mt-4">Contact us</p>
                    <div className="flex px-6 mt-4 gap-4">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-black text-3xl">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-black text-3xl">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-black text-3xl">
                            <FontAwesomeIcon icon={faLine} />
                        </a>
                    </div>
                    <p className="text-black font-light px-6 mt-2">02-555-2000 , 1111</p>
                </div>
            </div>
        </div>
    );
}

export default NavbarLogin;
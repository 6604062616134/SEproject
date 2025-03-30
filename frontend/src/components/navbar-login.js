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
    const [notifications, setNotifications] = useState([]);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportMessage, setReportMessage] = useState('');
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
                if (error.response && error.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    console.error('Error fetching user:', error);
                }
            }
        };
        fetchUser();
        fetchNotification();
    }, [navigate]);

    const fetchNotification = async () => {
        try {
            //เรียกเอพีไอเส้น getnotires เพื่อดึงข้อมูลการจอง
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }

            const response = await axios.get(`http://localhost:8000/notifications/getnotires/${userId}`, { withCredentials: true });
            const notificationsData = response.data.data;
            setNotifications(notificationsData);
            setHasNewNotification(notificationsData.length > 0); // เช็คว่ามีการแจ้งเตือนใหม่หรือไม่

        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                console.error('Error fetching notifications:', error);
            }
        }
    };

    const openLogoutModal = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);

    const openReportModal = () => setIsReportModalOpen(true);
    const closeReportModal = () => setIsReportModalOpen(false);

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/users/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId'); // ลบ userId ออกจาก localStorage เมื่อผู้ใช้ล็อกเอาท์
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

    const submitReport = async () => {
        try {
            const userID = localStorage.getItem('userId'); // ดึง userID จาก localStorage
            if (!userID) {
                alert('User ID not found. Please log in again.');
                return;
            }
    
            await axios.post('http://localhost:8000/reports/createReport', { userID, message: reportMessage }, { withCredentials: true });
            alert('Report submitted successfully!');
            setReportMessage('');
            closeReportModal();
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white fixed top-0 left-0 w-full z-50">
                <div className="flex items-center justify-between p-4">
                    <button onClick={handleToggle} className="text-white text-xl z-10">☰</button>
                    <div className='text-center'>
                        <NavLink to="/home-login" className="text-white text-2xl font-bold">Boardgames</NavLink>
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
                                    {notifications.map((notification, index) => (
                                        <li key={index} className="border-b py-2">
                                            {notification.type === 'Returning' ? (
                                                <>
                                                    <p>Game: {notification.boardgame_name}</p>
                                                    <p>Borrowed Date: {new Date(notification.borrowingDate).toLocaleString()}</p>
                                                    <p>Return Date: {new Date(notification.borrow_return_date).toLocaleString()}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p>Game: {notification.boardgame_name}</p>
                                                    <p>Status: {notification.status}</p>
                                                </>
                                            )}
                                        </li>
                                    ))}
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
                    {/* modalแสดงหน้าเขียนreportหรือขอความช่วยเหลือจากแอดมิน */}
                    <button onClick={openReportModal} className="block py-4 px-6 text-black hover:bg-black font-medium hover:text-white w-full text-left">
                        Report / Help
                    </button>
                    <button onClick={openLogoutModal} className="block px-6 text-black font-normal hover:underline cursor-pointer mt-72">
                        Logout <span style={{ textDecoration: 'none' }}>-{'>'}</span>
                    </button>
                    <p className="block px-6 text-black font-semibold mt-4">Contact us</p>
                    <div className="flex px-6 mt-2 gap-4">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-black text-3xl">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-black text-3xl">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </div>
                    <p className="text-black font-light px-6 mt-2">02-555-2000 , 1111</p>
                </div>
            </div>

            {/* ป็อปอัปยืนยัน Logout */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-[300px]" style={{ borderRadius: '20px' }}>
                        <h3 className="font-bold text-xl">Confirm Logout</h3>
                        <p className="mt-4">Are you sure you want to log out?</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="btn-custom bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={closeLogoutModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-search"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReportModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl w-[400px]" style={{ borderRadius: '30px', border: '1px solid' }}>
                        <h3 className="font-bold text-xl text-black">Report / Help</h3>
                        <textarea
                            className="w-full mt-4 p-2 border border-black rounded"
                            rows="5"
                            placeholder="Write your report or request for help here..."
                            value={reportMessage}
                            onChange={(e) => setReportMessage(e.target.value)} // อัปเดต state
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="btn-custom bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={closeReportModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-search"
                                onClick={submitReport} // เรียกใช้ฟังก์ชัน submitReport
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavbarLogin;
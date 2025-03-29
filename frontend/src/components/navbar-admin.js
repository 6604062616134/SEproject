import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavbarAdmin({ isMenuOpen, toggleMenu }) {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/users/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId'); // ลบ userId ออกจาก localStorage
            window.location.href = '/login'; // เปลี่ยนเส้นทางไปยังหน้า Login
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    };

    const openLogoutModal = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);

    return (
        <div className="font-sans">
            <div className="bg-black text-white p-5 fixed top-0 left-0 w-full z-50">
                <div className="flex items-center justify-between p-5">
                    <div className='text-center z-10' style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <NavLink to="/" className="text-white text-2xl font-bold">
                            Boardgames
                        </NavLink>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex gap-5 p-4' style={{ position: 'absolute', right: '0' }}>
                        <p className='cursor-pointer'>Admin</p>
                        <button onClick={openLogoutModal} className="btn-logout">
                            Logout
                        </button>
                    </div>
                </div>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg w-[300px]" style={{ borderRadius: '20px', zIndex: 50 }}>
                            <h3 className="font-bold text-xl text-black">Confirm Logout</h3>
                            <p className="mt-4 text-black">Are you sure you want to log out?</p>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="btn-custom bg-gray-300 text-black px-4 py-2 rounded"
                                    onClick={closeLogoutModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-search"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavbarAdmin;

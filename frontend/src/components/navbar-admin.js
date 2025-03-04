import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavbarAdmin({ isMenuOpen, toggleMenu }) {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/users/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId'); // ลบ userId ออกจาก localStorage เมื่อผู้ใช้ล็อกเอาท์
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white p-5">
                <div className="flex items-center justify-between p-5">
                    <div className='text-center z-10' style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <NavLink to="/" className="text-white text-2xl font-bold">
                            Boardgames
                        </NavLink>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex gap-5 p-4' style={{ position: 'absolute', right: '0' }}>
                        <p className='cursor-pointer'>Admin</p>
                        <NavLink to='/login' className='cursor-pointer hover:underline z-10'>Logout</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavbarAdmin;

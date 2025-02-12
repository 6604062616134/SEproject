import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ isMenuOpen, toggleMenu }) {

    return (
        <div className="font-sans">
            <div className="bg-black text-white p-5">
                <div className="flex items-center justify-between p-5">
                    <div className='text-center z-10' style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <NavLink to='/' className="text-white text-2xl font-bold cursor-pointer">
                            Boardgames
                        </NavLink>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex gap-5 p-4' style={{ position: 'absolute', right: '0' }}>
                        <NavLink to='/register' target='_blank' className='cursor-pointer hover:underline z-10'>Register</NavLink>
                        <NavLink to='/login' target='_blank' className='cursor-pointer hover:underline z-10'>Login</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

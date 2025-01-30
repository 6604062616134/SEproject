import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ isMenuOpen, toggleMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        toggleMenu(newCollapsed);
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white p-4">
                <div className="flex items-center justify-between p-5">
                    <div className='text-center' style = {{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <h1 className="text-white text-2xl font-bold">
                            Boardgames
                        </h1>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex gap-5 pr-5' style={{ position: 'absolute', right: '0' }}>
                        <NavLink to='/register' target = '_blank' className='hover:underline'>Register</NavLink>
                        <NavLink to='/login' target = '_blank' className='hover:underline'>Login</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

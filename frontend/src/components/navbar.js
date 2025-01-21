import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ isMenuOpen, toggleMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        toggleMenu(newCollapsed); // ใช้ toggleMenu แทน onToggle
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white">
                <div>
                    <h1 className="text-white text-2xl font-bold justify-self-center" style={{ position: 'relative', top: '20px' }}>
                        Boardgames
                        <p className='text-right text-xs'>KMUTNB</p>
                    </h1>
                    {/* Hamburger Icon */}
                    <button
                        onClick={handleToggle}
                        className="text-white text-xl" style={{ position: 'relative', top: '-20px', left: '20px' }}
                    >
                        {isCollapsed ? '✖' : '☰'}
                    </button>
                </div>

                {/* Menu */}
                <div
                    className={`fixed top-50rem left-0 w-1/5 bg-white text-white transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        } h-[100vh]`}
                >
                    <a href="#home" className="block px-6 py-2 text-black hover:bg-black hover:text-white">Home</a>
                    <a href="#about" className="block px-6 py-2 text-black hover:bg-black hover:text-white">About</a>
                    <a href="#services" className="block px-6 py-2 text-black hover:bg-black hover:text-white">Services</a>
                    <a href="#contact" className="block px-6 py-2 text-black hover:bg-black hover:text-white">Contact</a>
                </div>

            </div>
            {/* <hr style={{ height: '0.5px', backgroundColor: 'black', border: 'none' }} /> */}
        </div>
    );
}

export default Navbar;

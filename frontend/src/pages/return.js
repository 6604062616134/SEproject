import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import '../index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

function Return() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [boardgameName, setBoardgameName] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Select Category');
    const [selectedDate, setSelectedDate] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [studentID, setStudentID] = useState('');
    const navigate = useNavigate();
    const formRef = useRef(null); // เพิ่ม useRef สำหรับฟอร์ม

    const toggleMenu = (isCollapsed) => {
        setIsMenuOpen(isCollapsed);
    };

    const toggleCategoryDropdown = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
            const response = await axios.post('http://localhost:8000/br/create', {
                boardgameName: boardgameName,
                user_id: userId,
                date: selectedDate,
                mode: 'returned',
                email: email,
                name: name,
                studentID: studentID
            }, { withCredentials: true });

            if (response.data.status === 'success') {
                alert('Return request sent successfully');
            } else {
                alert('Return request failed');
            }
        } catch (error) {
            console.error('Error returning boardgame:', error);
            alert('Error returning boardgame');
        }
    };

    const handleCancel = () => {
        if (formRef.current) {
            formRef.current.reset(); // รีเซ็ตฟอร์ม
        }
        setBoardgameName('');
        setSelectedCategory('Select Category');
        setSelectedDate('');
        setEmail('');
        setName('');
        setStudentID('');
    };

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-20'>
                        <form className="space-y-4" onSubmit={handleReturn} ref={formRef}>
                            <div className='w-full'>
                                <h2 className="text-3xl font-bold text-left mt-12 mb-4">Returning</h2>
                                <div className='flex flex-row gap-12'>
                                    <div className='flex flex-col mb-4'>
                                        <p className='text-xl font-semibold text-left mb-2'>Boardgame's name</p>
                                        <input
                                            type="text"
                                            placeholder="Enter boardgame's name"
                                            value={boardgameName}
                                            onChange={(e) => setBoardgameName(e.target.value)}
                                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-[600px]"
                                            style={{ borderWidth: '1px' }}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='text-xl font-semibold text-left mb-2'>Category</p>
                                        <div className="relative">
                                            <button type="button" className='btn-custom' onClick={toggleCategoryDropdown}>
                                                {selectedCategory}
                                                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                            </button>
                                            {isCategoryOpen && (
                                                <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                                    <ul>
                                                        <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handleCategorySelect('Strategy')}>Strategy</li>
                                                        <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleCategorySelect('Family')}>Family</li>
                                                        <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleCategorySelect('Kids')}>Kids</li>
                                                        <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handleCategorySelect('Party')}>Party</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-12'>
                                    <div className='flex flex-col mb-4'>
                                        <p className='text-xl font-semibold text-left mb-2'>Date</p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="text"
                                                placeholder="DD"
                                                maxLength="2"
                                                className="w-10 text-center"
                                                style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}
                                            />
                                            <span>/</span>
                                            <input
                                                type="text"
                                                placeholder="MM"
                                                maxLength="2"
                                                className="w-10 text-center"
                                                style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}
                                            />
                                            <span>/</span>
                                            <input
                                                type="text"
                                                placeholder="YY"
                                                maxLength="4"
                                                className="w-10 text-center"
                                                style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='text-xl text-left font-semibold mb-2'>Email</p>
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-[600px]"
                                            style={{ borderWidth: '1px' }}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row gap-12'>
                                    <div className='flex flex-col mb-4'>
                                        <p className='text-xl text-left font-semibold mb-2'>Student's name</p>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-96"
                                            style={{ borderWidth: '1px' }}
                                        />
                                    </div>
                                    <div className='flex flex-col mb-4'>
                                        <p className='text-xl text-left font-semibold mb-2'>Student ID</p>
                                        <input
                                            type="text"
                                            placeholder="Enter your student ID"
                                            value={studentID}
                                            onChange={(e) => setStudentID(e.target.value)}
                                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-96"
                                            style={{ borderWidth: '1px' }}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row justify-end gap-2'>
                                    <button type="submit" className="btn-search">Return</button>
                                    <button type="button" className="btn-custom" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Return;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function History() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userId = localStorage.getItem('userId');

                console.log('User ID:', userId); // ตรวจสอบว่า userId ถูกต้องหรือไม่

                const response = await axios.get(`http://localhost:8000/history?userID=${userId}`);

                console.log('Response Data:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API

                setTransactions(response.data.data); // เก็บข้อมูลที่ได้รับใน state
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const toggleMenu = (isCollapsed) => {
        setIsMenuOpen(isCollapsed);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.name && transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log('Filtered Transactions:', filteredTransactions); // ตรวจสอบข้อมูลหลังการกรอง

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-32 w-full mb-12 p-4'>
                        <div className='flex flex-row gap-4'>
                            <h2 className='text-left text-black font-bold text-3xl'>History</h2>
                            <div className="border border-black rounded-3xl pl-6 ml-12 mt-1 bg-transparent w-[450px] flex items-center justify-between gap-2" style={{ height: '40px' }}>
                                <FontAwesomeIcon icon={faSearch} className="" />
                                <input
                                    type="text"
                                    placeholder="Enter boardgame's name ..."
                                    name="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="bg-transparent w-full border-none focus:outline-none ml-2"
                                    style={{ borderWidth: '1px' }}
                                />
                            </div>
                            {/* <button className='btn-search'>Search</button> */}
                        </div>
                        {/* modal */}
                        <div className="flex flex-row flex-wrap gap-4 justify-center mt-10">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="bg-transparent shadow-lg p-3"
                                        style={{ border: '1px solid black', borderRadius: '38px', width: '280px' }}
                                    >
                                        <img
                                            src={transaction.imagePath || '/images/default.jpg'}
                                            alt={transaction.game_name}
                                            className="w-[280px] h-[220px] object-fill"
                                            style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }}
                                            onError={(e) => {
                                                e.target.src = '/images/default.jpg'; // แสดงภาพ default หากโหลดภาพไม่ได้
                                            }}
                                        />
                                        <div className="mt-3">
                                            <p className="text-xl font-semibold ml-5">{transaction.game_name}</p>
                                            <p className="text-black ml-5">{transaction.category_name}</p>
                                            <p className="text-black ml-5">Level: {transaction.level}</p>
                                            <p className="text-black ml-5">Players: {transaction.playerCounts} persons</p>
                                            <p className="text-black ml-5">Borrowed Date: {formatDate(transaction.modified)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xl font-light text-black opacity-50">No boardgames history</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
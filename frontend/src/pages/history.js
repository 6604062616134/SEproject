import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import '../index.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function History() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลการยืมคืน

    useEffect(() => {
        // Fetch API มาแสดงประวัติการยืมคืนของผู้ใช้ที่ล็อกอินอยู่
        const fetchTransactions = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8000/br/transactions/${userId}`);
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
        transaction.game_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-32 w-full'>
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
                        {/* ตารางแสดงข้อมูล */}
                        <table className='table-auto w-[800px] mt-8'>
                            <thead style={{ borderBottom: '2px solid black' }}>
                                <tr className='text-left'>
                                    <th className="text-left">Boardgame's name</th>
                                    <th className="text-right pr-8">Date</th>
                                </tr>
                            </thead>
                            <tbody className='text-left text-black'>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid black' }}>
                                            <td className='pt-4 pb-4'>{transaction.game_name}</td>
                                            <td className='pt-4 pb-4 text-right'>{formatDate(transaction.borrowingDate)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center pt-4 pb-4 text-black opacity-50">No results</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
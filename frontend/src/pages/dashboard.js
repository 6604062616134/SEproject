import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from '../components/navbar-admin';
import '../index.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch API มาแสดงประวัติการยืมคืนที่มีสถานะ returning
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/br/transactions', {
                    params: { mode: 'returning' }
                });
                setTransactions(response.data.data); // เก็บข้อมูลที่ได้รับใน state
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAccept = (transactionId) => {
        // เพิ่มโค้ดสำหรับการยอมรับการคืนบอร์ดเกม
        console.log(`Accepted transaction ID: ${transactionId}`);
    };

    const handleReject = (transactionId) => {
        // เพิ่มโค้ดสำหรับการปฏิเสธการคืนบอร์ดเกม
        console.log(`Rejected transaction ID: ${transactionId}`);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <NavbarAdmin />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-12 w-full'>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-row gap-3'>
                                <h2 className='text-left text-black font-bold text-3xl'>Dashboard</h2>
                                <p className='text-lg text-black mt-2'>returning</p>
                            </div>
                            <div className="border border-black rounded-3xl pl-6 ml-12 bg-transparent w-[450px] flex items-center justify-between gap-2" style={{ height: '40px' }}>
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
                            <button className='btn-search'>Search</button>
                        </div>
                        {/* ตารางแสดงข้อมูล */}
                        <table className='table-auto w-[800px] mt-8'>
                            <thead style={{ borderBottom: '2px solid black' }}>
                                <tr className='text-left'>
                                    <th className='text-black font-semibold text-lg'>Boardgame's name</th>
                                    <th className='text-black font-semibold text-lg'>Student ID</th>
                                    <th className='text-black font-semibold text-lg'>Student's name</th>
                                    <th className='text-black font-semibold text-lg'>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='text-left'>
                                {Array.isArray(transactions) && transactions.map((transaction, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid black' }}>
                                        <td className='pt-6 pb-6'>{transaction.game_name}</td>
                                        <td className='pt-4 pb-4'>{transaction.studentID}</td>
                                        <td className='pt-4 pb-4'>{transaction.user_name}</td>
                                        <td className='pt-4 pb-4'>{formatDate(transaction.borrowingDate)}</td>
                                        <td className='pt-4 pb-4 gap-4'>
                                            <button className='btn-accept' onClick={() => handleAccept(transaction.transactionID)}>Accept</button>
                                            <button className='btn-reject' onClick={() => handleReject(transaction.transactionID)}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
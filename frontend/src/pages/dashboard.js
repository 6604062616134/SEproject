import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from '../components/navbar-admin';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
    const userId = localStorage.getItem('userId'); // ดึง userId จาก Local Storage
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/br/transactions', {
                    params: { mode: 'returning' }
                });
                setTransactions(response.data.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const openRejectModal = (transactionId) => {
        setSelectedTransactionId(transactionId);
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setSelectedTransactionId(null);
        setIsRejectModalOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAccept = async (transactionId) => {
        const transaction = transactions.find(t => t.transactionID === transactionId);
    
        if (!transaction || !transaction.game_id || !transaction.user_name) {
            console.error("Transaction is missing required fields:", transaction);
            alert("Required data is missing. Please check the transaction.");
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:8000/br/admin/accept', {
                gameID: transaction.game_id,
                name: transaction.user_name, // ส่งชื่อผู้ใช้
                status: 'returning', // หรือ 'borrowed' ขึ้นอยู่กับสถานะ
            });
    
            if (response.data.status === 'success') {
                setTransactions(transactions.filter(t => t.transactionID !== transactionId));
            } else {
                alert(`Accept request failed: ${response.data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error submitting accept request:', error.response?.data || error.message);
            alert(`Error submitting accept request: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleReject = async (transactionId) => {
        if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        const transaction = transactions.find(t => t.transactionID === transactionId);

        if (!transaction || !transaction.game_id) {
            console.error("Transaction is missing game_id:", transaction);
            alert("Game ID is missing. Please check the data.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/br/transactions/update`, {
                gameID: transaction.game_id,
                userID: userId, // ใช้ userId จาก Local Storage
                status: 'available',
            }, { withCredentials: true });

            if (response.data.status === 'success') {
                setTransactions(transactions.filter(t => t.transactionID !== transactionId));
            } else {
                alert(`Borrow request failed: ${response.data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error submitting borrow request:', error.response?.data || error.message);
            alert(`Error submitting borrow request: ${error.response?.data?.message || error.message}`);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.game_name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        String(transaction.studentID || "").toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        transaction.user_name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <div>
            <NavbarAdmin />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-32 w-full'>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-row gap-3'>
                                <h2 className='text-left text-black font-bold text-3xl'>Dashboard</h2>
                                <p className='text-lg text-black mt-2'>returning</p>
                            </div>
                            <div className="border border-black rounded-3xl pl-6 ml-12 bg-transparent w-[450px] flex items-center justify-between gap-2" style={{ height: '40px' }}>
                                <FontAwesomeIcon icon={faSearch} className="" />
                                <input
                                    type="text"
                                    placeholder="Search ..."
                                    name="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="bg-transparent w-full border-none focus:outline-none ml-2"
                                    style={{ borderWidth: '1px' }}
                                />
                            </div>
                        </div>
                        <table className='table-auto w-[800px] mt-8'>
                            <thead style={{ borderBottom: '2px solid black' }}>
                                <tr className='text-left'>
                                    <th className='text-black font-semibold text-lg'>Boardgame's name</th>
                                    <th className='text-black font-semibold text-lg'>Student ID</th>
                                    <th className='text-black font-semibold text-lg'>Student's name</th>
                                    <th className='text-black font-semibold text-lg'>Date</th>
                                </tr>
                            </thead>
                            <tbody className='text-left'>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid black' }}>
                                            <td className='pt-6 pb-6'>{transaction.game_name}</td>
                                            <td className='pt-4 pb-4'>{transaction.studentID}</td>
                                            <td className='pt-4 pb-4'>{transaction.user_name}</td>
                                            <td className='pt-4 pb-4'>{formatDate(transaction.borrowingDate)}</td>
                                            <td className='pt-4 pb-4 gap-4'>
                                                <button className='btn-accept' onClick={() => handleAccept(transaction.transactionID)}>Accept</button>
                                                <button className='btn-reject' onClick={() => openRejectModal(transaction.transactionID)}>Reject</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center pt-4 pb-4 text-black opacity-50">No results</td>
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

export default Dashboard;
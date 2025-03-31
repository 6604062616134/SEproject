import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Return() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null); // เพิ่ม useRef สำหรับฟอร์ม
    const [searchTerm, setSearchTerm] = useState('');
    const [borrowedGames, setBorrowedGames] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [gameToReturn, setGameToReturn] = useState(null);

    useEffect(() => {
        fetchBorrowedGames();
    }, []);

    const fetchBorrowedGames = async () => {
        try {
            const userId = localStorage.getItem('userId');
            console.log("Fetching borrowed games for user ID:", userId);
    
            const response = await axios.get(`http://localhost:8000/br/borrowed/${userId}`);
            console.log("Borrowed Games Response:", response.data);
    
            // กรองเฉพาะเกมที่ยังไม่ได้คืนหรือถูกปฏิเสธการคืน
            const filteredGames = response.data.data.filter((game) => game.status !== 'returning' || game.isReject === 1);
            console.log("Filtered Borrowed Games:", filteredGames);
    
            setBorrowedGames(filteredGames);
        } catch (error) {
            console.error("Error fetching borrowed games:", error);
        }
    };

    const toggleMenu = (isCollapsed) => {
        setIsMenuOpen(isCollapsed);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const openConfirmModal = (game) => {
        setGameToReturn(game); // เก็บข้อมูลเกมที่ต้องการคืน
        setIsConfirmModalOpen(true); // เปิด modal
    };

    const closeConfirmModal = () => {
        setGameToReturn(null); // ล้างข้อมูลเกม
        setIsConfirmModalOpen(false); // ปิด modal
    };

    const filteredGames = borrowedGames.filter((game) =>
        game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReturn = async (game) => {
        try {
            const userId = localStorage.getItem('userId');

            const response = await axios.put(`http://localhost:8000/br/transactions/${game.game_id}/return`, {
                user_id: userId,
                status: 'returning',
            }, { withCredentials: true });

            if (response.data.status === 'success') {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error returning boardgame:', error);
            alert('Error returning boardgame');
        }
    };

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center mt-32 w-full'>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-row gap-3'>
                                <h2 className='text-left text-black font-bold text-3xl'>Returning</h2>
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
                            {/* <button className='btn-search'>Search</button> */}
                        </div>
                        <div className='flex flex-col mt-10 gap-4'>
                            <div className="flex flex-row flex-wrap gap-4 items-start">
                                {borrowedGames.length === 0 ? (
                                    // หากไม่มีเกมที่ยืมมาเลย
                                    <p className="text-xl font-light text-black opacity-50">No borrowed boardgames</p>
                                ) : filteredGames.length > 0 ? (
                                    // หากมีเกมที่ตรงกับคำค้นหา
                                    filteredGames.map((game) => (
                                        <div key={game.transactionID} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                            <img
                                                src={game.imagePath}
                                                alt={game.boardgame_name}
                                                className="w-[280px] h-[220px] object-fill"
                                                style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }}
                                                onError={(e) => {
                                                    e.target.src = '/images/default.jpg'; // แสดงภาพ default หากโหลดภาพไม่ได้
                                                }}
                                            />
                                            <div className="mt-3">
                                                <p className="text-xl font-semibold ml-5">{game.game_name}</p>
                                                <p className="text-black ml-5">{game.category_name}</p>
                                                <p className="text-black ml-5">level : {game.level}</p>
                                                <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                                    <p className="text-black" style={{ marginTop: -19 }}>players : {game.playerCounts} persons</p>
                                                    <button
                                                        className="btn-search"
                                                        onClick={() => openConfirmModal(game)}
                                                    >
                                                        Return
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // หากไม่มีเกมที่ตรงกับคำค้นหา
                                    <p className="text-xl font-semibold text-black opacity-50">No results</p>
                                )}
                            </div>
                        </div>
                        {isConfirmModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg w-[300px]" style={{ borderRadius: '35px' }}>
                                    <h3 className="font-bold text-xl">Return</h3>
                                    <p className="mt-4">Confirm returning <strong>{gameToReturn?.game_name}</strong>?</p>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            className="btn-custom"
                                            onClick={closeConfirmModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-search"
                                            onClick={() => handleReturn(gameToReturn)}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Return;
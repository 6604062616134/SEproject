import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

function Homelogin() {
    const [boardgames, setBoardgames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isPlayersOpen, setIsPlayersOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Category');
    const [selectedLevel, setSelectedLevel] = useState('Level');
    const [selectedPlayers, setSelectedPlayers] = useState('2 Players');
    const [categoryId, setCategoryId] = useState('');
    const [level, setLevel] = useState('');
    const [players, setPlayers] = useState('');
    const [showRecommended, setShowRecommended] = useState(true);
    const [recommended, setRecommended] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isHourOpen, setIsHourOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('Select Hour');
    const [hour, setHour] = useState('1');
    const [status, setStatus] = useState('available');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isBorrowed, setIsBorrowed] = useState(false);

    useEffect(() => {
        fetchBoardgamesRecommended();
        fetchGameStatus();
        fetchUsername();
    }, []);

    const fetchBoardgames = async () => {
        try {
            const response = await axios.get('http://localhost:8000/boardgames', {
                params: {
                    name: searchTerm,
                    level: level !== 'Level' ? level : '',
                    playerCounts: players !== '2 Players' ? players : '',
                    categoryID: categoryId !== '' ? categoryId : ''
                }
            });

            if (response.data.data && response.data.data.length > 0) {
                setBoardgames(response.data.data); // ตั้งค่า boardgames หากมีข้อมูล
            } else {
                setBoardgames([]); // ตั้งค่าเป็นอาร์เรย์ว่างหากไม่มีข้อมูล
            }
        } catch (error) {
            console.error("Error fetching boardgames:", error);
            setBoardgames([]); // ตั้งค่าเป็นอาร์เรย์ว่างในกรณีที่เกิดข้อผิดพลาด
        } finally {

        }
    };

    const fetchBoardgamesRecommended = async () => {
        try {
            const response = await axios.get('http://localhost:8000/boardgames/recommended');
            setRecommended(response.data.data);
        } catch (error) {
            console.error("Error fetching recommended boardgames:", error);
        }
    };

    const fetchGameStatus = async (gameId) => {
        if (!gameId) {
            console.error("Error: Missing game ID");
            return;
        }

        try {
            console.log("Fetching status for game ID:", gameId);
            const response = await axios.get(`http://localhost:8000/br/getStatus/${gameId}`);

            if (response.data.data.length > 0) {
                const gameStatus = response.data.data[0].status;
                console.log("Game Status Response:", gameStatus);
                setStatus(gameStatus);
                setIsBorrowed(gameStatus === 'borrowed'); // อัปเดต isBorrowed
            } else {
                console.warn("No status found for game ID:", gameId);
                setStatus("unknown");
                setIsBorrowed(false); // ตั้งค่าเป็น false หากไม่มีสถานะ
            }
        } catch (error) {
            console.error("Error fetching game status:", error);
            setStatus("unknown");
            setIsBorrowed(false); // ตั้งค่าเป็น false ในกรณีเกิดข้อผิดพลาด
        }
    };

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', { withCredentials: true });
            console.log("API Response:", response.data);
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    };

    const handleBorrowClick = async (game, selectedHour) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        if (!game || !game.boardgame_id) {
            alert("Game ID is missing.");
            return;
        }

        if (selectedHour === 'Select Hour') {
            alert("Please select a borrowing duration.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/br/transactions/update`, {
                gameID: game.boardgame_id,
                userID: userId,
                status: 'borrowed',
                duration: selectedHour, // ส่งจำนวนชั่วโมงไปด้วย
            }, { withCredentials: true });

            if (response.data.status === 'success') {
                alert('Borrow request sent successfully');

                // เรียกใช้ createReturnDate เพื่อสร้างวันที่คืน
                await createReturnDate(game.boardgame_id, userId, selectedHour);

                setSelectedGame(null); // ปิด modal
            } else {
                alert(`Borrow request failed: ${response.data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error submitting borrow request:', error.response?.data || error.message);
            alert(`Error submitting borrow request: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleBookingClick = async (game) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        if (!game || !game.boardgame_id) {
            alert("Game ID is missing.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/reserve/createReservation`, {
                gameID: game.boardgame_id,
                userID: userId,
            }, { withCredentials: true });

            if (response.data.status === 'success') {
                alert('Reservation created successfully');
                setSelectedGame(null); // ปิด modal
            } else {
                alert(`Reservation failed: ${response.data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error creating reservation:', error.response?.data || error.message);
            alert(`Error creating reservation: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setShowRecommended(false);
        fetchBoardgames();
    };

    const toggleHourDropdown = () => {
        setIsHourOpen(!isHourOpen);
    };

    const toggleCategoryDropdown = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleLevelDropdown = () => {
        setIsLevelOpen(!isLevelOpen);
    };

    const togglePlayersDropdown = () => {
        setIsPlayersOpen(!isPlayersOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleHourSelect = (hour) => {
        setSelectedHour(hour);

        switch (hour) {
            case '1 Hour':
                setHour('1');
                break;
            case '2 Hours':
                setHour('2');
                break;
            case '3 Hours':
                setHour('3');
                break;
            default:
                setHour('');
        }
        setIsHourOpen(false);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        switch (category) {
            case 'Family':
                setCategoryId('1');
                break;
            case 'Strategy':
                setCategoryId('2');
                break;
            case 'Party':
                setCategoryId('3');
                break;
            case 'Kids':
                setCategoryId('4');
                break;
            default:
                setCategoryId('');
        }
        setIsCategoryOpen(false);
    };

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);

        switch (level) {
            case 'Easy':
                setLevel('easy');
                break;
            case 'Medium':
                setLevel('medium');
                break;
            case 'Hard':
                setLevel('hard');
                break;
            default:
                setLevel('');
        }
        setIsLevelOpen(false);
    };

    const handlePlayersSelect = (players) => {
        setSelectedPlayers(players);

        switch (players) {
            case '1 Players':
                setPlayers('1');
                break;
            case '2 Players':
                setPlayers('2');
                break;
            case '3 Players':
                setPlayers('3');
                break;
            case '4 Players':
                setPlayers('4');
                break;
            case '5 Players':
                setPlayers('5');
                break;
            case '6 Players':
                setPlayers('6');
                break;
            default:
                setPlayers('');
        }
        setIsPlayersOpen(false);
    };

    const handleCategoryClick = (category) => {
        handleCategorySelect(category);
        setShowRecommended(false);
        fetchBoardgames();
    };

    // const handleConfirmBorrowClick = async () => {
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) {
    //         alert("Please log in to borrow a board game.");
    //         return;
    //     }

    //     // ตรวจสอบสถานะล่าสุดจากฐานข้อมูล
    //     try {
    //         const response = await axios.get(`http://localhost:8000/br/getStatus/${selectedGame.boardgame_id}`);

    //         //const latestStatus = response.data.data[0]?.status;

    //         // if (latestStatus === 'reserved' || latestStatus === 'returning') {
    //         //     alert("This game is already borrowed, please reserve it instead.");
    //         //     return;
    //         // }


    //         try {
    //             const reservationResponse = await axios.post(`http://localhost:8000/reserve/createReservation`, {
    //                 gameID: selectedGame.boardgame_id,
    //                 userID: userId
    //             }, { withCredentials: true });

    //             if (reservationResponse.data.status === 'success') {
    //                 alert('Reservation created successfully');
    //                 setSelectedGame(null);
    //             } else {
    //                 alert(`Reservation failed: ${reservationResponse.data.message || "Unknown error"}`);
    //             }
    //         } catch (error) {
    //             console.error('Error creating reservation:', error.response?.data || error.message);
    //             alert(`Error creating reservation: ${error.response?.data?.message || error.message}`);
    //         }

    //     } catch (error) {
    //         console.error("Error fetching latest status:", error);
    //         alert("Unable to verify the game status. Please try again later.");
    //     }
    // };

    // const borrowSubmit = async (game) => {
    //     const userId = localStorage.getItem('userId');

    //     if (!userId) {
    //         alert("User ID not found. Please log in.");
    //         return;
    //     }

    //     if (!game || !game.boardgame_id) {
    //         alert("Game ID is missing.");
    //         return;
    //     }

    //     try {
    //         const response = await axios.put(`http://localhost:8000/br/transactions/update`, {
    //             gameID: game.boardgame_id,
    //             userID: userId,
    //             status: 'borrowed',
    //         }, { withCredentials: true });

    //         console.log("API Response:", response.data);

    //         if (response.data.status === 'success') {
    //             alert('Borrow request sent successfully');

    //             if (hour) {
    //                 await createReturnDate(game.boardgame_id, userId, hour);
    //             }
    //         } else {
    //             alert(`Borrow request failed: ${response.data.message || "Unknown error"}`);
    //         }
    //     } catch (error) {
    //         console.error('Error submitting borrow request:', error.response?.data || error.message);
    //         alert(`Error submitting borrow request: ${error.response?.data?.message || error.message}`);
    //     }
    // };

    const createReturnDate = async (gameID, userID, hour) => {
        try {
            const response = await axios.put(`http://localhost:8000/br/createReturnDate`, {
                gameID: gameID,
                userID: userID,
                hour: hour,
            }, { withCredentials: true });

            console.log("Create return date Response:", response.data);

            if (response.data.status === 'success') {
                // alert('Return date created successfully');
                console.log('Return date created successfully');
            } else {
                alert(`Return date creation failed: ${response.data.message || "Unknown error"}`);
            }

        } catch (error) {
            console.error("Error creating return date:", error);
        }
    };

    // const reservedSubmit = async (game) => {
    //     // เมื่อมีการอินพุทข้อมูลจองบอร์ดเกมให้เรียกใช้ฟังก์ชันนี้
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) {
    //         alert("User ID not found. Please log in.");
    //         return;
    //     }
    //     if (!game || !game.boardgame_id) {
    //         alert("Game ID is missing.");
    //         return;
    //     }

    //     try {
    //         const response = await axios.put(`http://localhost:8000/br/transactions/update`, {
    //             gameID: game.boardgame_id,
    //             userID: userId,
    //             status: 'reserved',
    //         }, { withCredentials: true });

    //         console.log("API Response:", response.data);

    //         if (response.data.status === 'success') {
    //             alert('Reservation request sent successfully');
    //         } else {
    //             alert(`Reservation request failed: ${response.data.message || "Unknown error"}`);
    //         }
    //     }
    //     catch (error) {
    //         console.error('Error submitting reservation request:', error.response?.data || error.message);
    //         alert(`Error submitting reservation request: ${error.response?.data?.message || error.message}`);
    //     }
    // };

    return (
        <div>
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center min-h-screen'>
                <div className='container mx-auto'>
                    <h1 className='text-4xl font-bold mt-24 ml-24'>Find Your Boardgames !</h1>
                    <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row justify-center items-center mt-8">
                        <div className="2xl:w-full w-2/4">
                            <div className="border border-black rounded-3xl p-2 pl-6 ml-12 bg-transparent w-full flex items-center justify-between gap-2">
                                <FontAwesomeIcon icon={faSearch} className="" />
                                <input
                                    type="text"
                                    placeholder="Search Boardgames ..."
                                    name="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="bg-transparent w-full border-none focus:outline-none ml-2"
                                    style={{ borderWidth: '1px' }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 w-2/3 justify-center mt-8 lg:mt-0">
                            <div className="relative">
                                <button type="button" className='btn-custom' onClick={toggleCategoryDropdown}>
                                    {selectedCategory}
                                    <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                </button>
                                {isCategoryOpen && (
                                    <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                        <ul>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handleCategorySelect('Category')}>Category</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleCategorySelect('Strategy')}>Strategy</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleCategorySelect('Family')}>Family</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleCategorySelect('Kids')}>Kids</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handleCategorySelect('Party')}>Party</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button type="button" className='btn-custom' onClick={toggleLevelDropdown}>
                                    {selectedLevel}
                                    <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                </button>
                                {isLevelOpen && (
                                    <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                        <ul>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handleLevelSelect('Level')}>Level</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleLevelSelect('Level 1')}>Easy</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleLevelSelect('Level 2')}>Medium</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handleLevelSelect('Level 5')}>Hard</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button type="button" className='btn-custom' onClick={togglePlayersDropdown}>
                                    {selectedPlayers}
                                    <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                </button>
                                {isPlayersOpen && (
                                    <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                        <ul>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handlePlayersSelect('2 Players')}>Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handlePlayersSelect('1 Players')}>1 Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handlePlayersSelect('2 Players')}>2 Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handlePlayersSelect('3 Players')}>3 Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handlePlayersSelect('4 Players')}>4 Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handlePlayersSelect('5 Players')}>5 Players</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handlePlayersSelect('6 Players')}>6 Players</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className='btn-search'>Search</button>
                        </div>
                    </form>
                    <div className="mt-10 flex justify-center gap-20 flex-wrap">
                        <div className="flex flex-col items-center">
                            <button onClick={() => handleCategoryClick('Party')} className="bg-transparent border-none p-0">
                                <img src="/images/partygame.jpg" alt="Party games" className="circular-image" />
                            </button>
                            <button onClick={() => handleCategoryClick('Party')} className='hover:underline text-xl font-semibold mt-2 bg-transparent border-none p-0'>Party games</button>
                        </div>
                        <div className="flex flex-col items-center">
                            <button onClick={() => handleCategoryClick('Kids')} className="bg-transparent border-none p-0">
                                <img src="/images/kidgame.jpg" alt="Kids games" className="circular-image" />
                            </button>
                            <button onClick={() => handleCategoryClick('Kids')} className='hover:underline text-xl font-semibold mt-2 bg-transparent border-none p-0'>Kids games</button>
                        </div>
                        <div className="flex flex-col items-center">
                            <button onClick={() => handleCategoryClick('Family')} className="bg-transparent border-none p-0">
                                <img src="/images/familygame.jpg" alt="Family games" className="circular-image" />
                            </button>
                            <button onClick={() => handleCategoryClick('Family')} className='hover:underline text-xl font-semibold mt-2 bg-transparent border-none p-0'>Family games</button>
                        </div>
                        <div className="flex flex-col items-center">
                            <button onClick={() => handleCategoryClick('Strategy')} className="bg-transparent border-none p-0">
                                <img src="/images/strategygame.jpg" alt="Strategy games" className="circular-image" />
                            </button>
                            <button onClick={() => handleCategoryClick('Strategy')} className='hover:underline text-xl font-semibold mt-2 bg-transparent border-none p-0'>Strategy games</button>
                        </div>
                    </div>
                    {/* การ์ดแสดงข้อมูลบอร์ดเกมที่recommended */}
                    {showRecommended && (
                        <div className='flex flex-col mt-10 gap-4'>
                            <p className="text-2xl font-semibold ml-48">Recommended</p>
                            <div className="flex flex-row flex-wrap gap-4 justify-center">
                                {recommended.map((boardgame) => (
                                    <div key={boardgame.boardgame_id} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                        <img src={boardgame.imagePath} alt={boardgame.boardgame_name} className="w-[280px] h-[220px] object-fill" style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }} />
                                        <div className="mt-3">
                                            <p className="text-xl font-semibold ml-5">{boardgame.boardgame_name}</p>
                                            <p className="text-black ml-5">{boardgame.category_name}</p>
                                            <p className="text-black ml-5">level : {boardgame.level}</p>
                                            <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                                <p className="text-black" style={{ marginTop: -19 }}>players : {boardgame.playerCounts} persons</p>
                                                <button
                                                    className="btn-search"
                                                    onClick={() => setSelectedGame(boardgame)} // ใช้ boardgame แทน game
                                                >
                                                    Borrow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* modalยืมบอร์ดเกม */}
                    {selectedGame && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-[#ececec] p-6 rounded-lg w-[350px] relative" style={{ borderRadius: '35px', border: '1px solid black' }}>
                                {/* ปุ่มกากบาทสำหรับปิด modal */}
                                <button
                                    className="absolute top-2 right-6 text-gray-800 hover:text-black"
                                    onClick={() => setSelectedGame(null)}
                                    style={{ fontSize: '25px', fontWeight: 'bold' }}
                                >
                                    &times;
                                </button>
                                <h3 className="font-bold text-xl">{selectedGame.boardgame_name}</h3>
                                {/* <div className="flex row gap-4 mt-4">
                                    <p className="text-lg">Status:</p>
                                    <p className={`text-lg font-semibold ${status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                                        {status === 'returning' || status === 'reserved' ? 'borrowed' : status}
                                    </p>
                                </div> */}
                                <div className='flex flex-row gap-2 justify-between'>
                                    <p className='text-lg font-semibold mt-2' style={{ position: 'relative', top: '10px' }}>Borrow</p>
                                    {/* ดรอปดาวน์สำหรับเลือกจำนวนชั่วโมง */}
                                    <div className="relative mt-2">
                                        <button
                                            type="button"
                                            className="btn-custom w-full text-left"
                                            style={{ width: '132px', height: '40px' }}
                                            onClick={toggleHourDropdown}
                                        >
                                            {selectedHour}
                                            <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                        </button>
                                        {isHourOpen && (
                                            <div className="absolute mt-2 w-full bg-white border border-black rounded-3xl shadow-lg z-10">
                                                <ul>
                                                    <li
                                                        className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer"
                                                        onClick={() => handleHourSelect('Select')}
                                                    >
                                                        Select
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                                                        onClick={() => handleHourSelect('1 Hour')}
                                                    >
                                                        1 Hour
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                                                        onClick={() => handleHourSelect('2 Hours')}
                                                    >
                                                        2 Hours
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer"
                                                        onClick={() => handleHourSelect('3 Hours')}
                                                    >
                                                        3 Hours
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {/* ปุ่มสำหรับ Borrow */}
                                    <button
                                        className="btn-search" style={{ width: '90px', height: '40px', marginTop: '10px', position: 'relative', top: '3px' }}
                                        onClick={() => handleBorrowClick(selectedGame, selectedHour)} // ส่ง selectedHour ไปด้วย
                                    >
                                        Borrow
                                    </button>
                                </div>
                                <div className="flex items-center justify-center my-4">
                                    <div className="border-t border-gray-400 w-full"></div>
                                    <span className="mx-4 text-gray-500">or</span>
                                    <div className="border-t border-gray-400 w-full"></div>
                                </div>
                                <div className="flex flex-col gap-4 mt-4 mb-2">
                                    <div className='flex flex-row justify-between'>
                                        <p className='text-lg font-semibold mt-2'>Booking</p>
                                        {/* ปุ่มสำหรับ Booking */}
                                        <button
                                            className="btn-search"
                                            onClick={() => handleBookingClick(selectedGame)} // เรียกฟังก์ชันจอง
                                        >
                                            Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ส่วนแสดงผลเสิร์ช */}
                    <div className="flex flex-row flex-wrap gap-6 justify-center mt-10 mb-12">
                        {boardgames.length > 0 ? (
                            boardgames.map((game) => (
                                <div key={game.boardgame_id} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                    <img src={game.imagePath} alt={game.boardgame_name} className="w-[280px] h-[220px] object-fill" style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }} />
                                    <div className="mt-3">
                                        <p className="text-xl font-semibold ml-5">{game.boardgame_name}</p>
                                        <p className="text-black ml-5">{game.category_name}</p>
                                        <p className="text-black ml-5">level : {game.level}</p>
                                        <p className="text-black ml-5">players : {game.playerCounts} persons</p>
                                        <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                            <div>
                                                <p className="text-black" style={{ marginTop: -14 }}>borrowed times : {game.borrowedTimes}</p>
                                            </div>
                                            <button
                                                className="btn-search"
                                                onClick={() => setSelectedGame(game)} // ใช้ game ที่ถูกส่งผ่านใน map
                                            >
                                                Borrow
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            isSearching && <p className="text-2xl font-semibold text-black opacity-50">No results</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homelogin;
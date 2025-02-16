import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import { NavLink } from 'react-router-dom';

function Home() {
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
    const [showPopular, setShowPopular] = useState(true);
    const [recommended, setRecommended] = useState([]);
    const [popular, setPopular] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    //const [searched, setSearched] = useState(false);
    const [isHourOpen, setIsHourOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('1 Hour');
    const [hour, setHour] = useState('1');
    const [status, setStatus] = useState('available');

    useEffect(() => {
        fetchBoardgamesRecommended();
        fetchBoardgamesPopular();
        // fetchBoardgames(searchTerm);
        // console.log("AAA --> ", showRecommended);
    }, []);

    const fetchBoardgames = async () => {
        try {
            console.log("Fetching boardgames with params:", {
                name: searchTerm,
                level: level !== 'Level' ? level : '',
                playerCounts: players !== '2 Players' ? players : '',
                categoryID: categoryId !== '' ? categoryId : ''
            });

            const response = await axios.get('http://localhost:8000/boardgames', {
                params: {
                    name: searchTerm,
                    level: level !== 'Level' ? level : '',
                    playerCounts: players !== '2 Players' ? players : '',
                    categoryID: categoryId !== '' ? categoryId : ''
                }
            });

            console.log("API Response:", response.data);
            setBoardgames(response.data.data || []); // ตรวจสอบว่า response มีข้อมูลหรือไม่
        } catch (error) {
            console.error("Error fetching boardgames:", error);
            setBoardgames([]);
        }
    };

    const fetchBoardgamesRecommended = async () => {
        try {
            const response = await axios.get('http://localhost:8000/boardgames/recommended');
            console.log("API Response:", response.data.data);
            setShowRecommended(true);
            setRecommended(response.data.data);
        } catch (error) {
            console.error("Error fetching recommended boardgames:", error);
            setRecommended([]);
        }
    };

    const fetchBoardgamesPopular = async () => {
        try {
            const response = await axios.get('http://localhost:8000/boardgames/popular');
            console.log("API Response:", response.data.data);
            setShowPopular(true);
            setPopular(response.data.data);
        } catch (error) {
            console.error("Error fetching popular boardgames:", error);
            setPopular([]);
        }
    };

    const fetchGameStatus = async (gameId) => {
        try {
            const response = await axios.get(`http://localhost:8000/br/getStatus/${gameId}`);
            console.log("Game Status Response:", response.data);
            setStatus(response.data.data[0].status);
            console.log(response.data.data[0].status);
        } catch (error) {
            console.error("Error fetching game status:", error);
        }
    };

    const handleBorrowClick = (boardgame) => {
        setSelectedGame(boardgame);
        fetchGameStatus(boardgame.boardgame_id);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowRecommended(false);

        //console.log("BBBB --> ", showRecommended);
        setShowPopular(false);
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
            case 'Level 1':
                setLevel('1');
                break;
            case 'Level 2':
                setLevel('2');
                break;
            case 'Level 3':
                setLevel('3');
                break;
            case 'Level 4':
                setLevel('4');
                break;
            case 'Level 5':
                setLevel('5');
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

        //console.log("CCCC --> ", showRecommended);
        setShowPopular(false);
        fetchBoardgames();
    };

    const handleConfirmClick = async () => {
        const token = localStorage.getItem('token'); // หรือวิธีการอื่นในการรับ token
        if (!token) {
            alert("Please log in to borrow a board game.");
            return;
        }
    
        if (selectedGame) {
            await borrowSubmit(selectedGame.boardgame_id, token);
            setSelectedGame(null);
        }
    };

    const borrowSubmit = async (boardgameId, token) => {
        try {
            let res = await axios.post(
                'http://localhost:8000/br',
                { boardgame_id: boardgameId },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log(`Borrow request sent for boardgame ID: ${boardgameId}`);
            console.log("API Response:", res);
            if (res.data.status == "success") {
                alert("Borrow request sent successfully");
            }
        } catch (error) {
            console.error("Error submitting borrow request:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex justify-center items-center min-h-screen' style={{ position: 'relative', width: '100%', height: '100%', top: '-100px' }}>
                <div className='container mx-auto'>
                    <h1 className='text-4xl font-bold' style={{ position: 'absolute', left: '15%', top: '140px' }}>Find Your Boardgames !</h1>
                    {/* search bar */}
                    <form onSubmit={handleSearchSubmit} className="mt-5 flex items-center gap-4" style={{ position: 'absolute', left: '15%', top: '200px', width: '70%' }}>
                        <div className="relative flex-grow">
                            <FontAwesomeIcon icon={faSearch} className="text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search Boardgames ..."
                                name="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="border border-black rounded-3xl p-2 pl-10 bg-transparent w-full"
                                style={{ borderWidth: '1px' }}
                            />
                        </div>
                        <div className="flex gap-4">
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
                            <div className="relative">
                                <button type="button" className='btn-custom' onClick={toggleLevelDropdown}>
                                    {selectedLevel}
                                    <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                </button>
                                {isLevelOpen && (
                                    <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                        <ul>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handleLevelSelect('Level 1')}>Level 1</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleLevelSelect('Level 2')}>Level 2</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleLevelSelect('Level 3')}>Level 3</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleLevelSelect('Level 4')}>Level 4</li>
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handleLevelSelect('Level 5')}>Level 5</li>
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
                                            <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handlePlayersSelect('1 Players')}>1 Players</li>
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
                    <div className="mt-10 flex justify-center gap-20" style={{ position: 'absolute', left: '21%', top: '260px' }}>
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
                    <div>
                        {/* การ์ดแสดงข้อมูลบอร์ดเกมที่recommended */}
                        {showRecommended && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ position: 'absolute', left: '19%', top: '540px' }}>
                                <p className="text-2xl font-semibold col-span-full">Recommended</p>
                                {recommended.map((boardgame) => (
                                    <div key={boardgame.boardgame_id} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                        <img src={boardgame.imagePath} alt={boardgame.boardgame_name} className="w-[280px] h-[220px] object-fill" style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }} />
                                        <div className="mt-3">
                                            <p className="text-xl font-semibold ml-5">{boardgame.boardgame_name}</p>
                                            <p className="text-black ml-5">{boardgame.category_name}</p>
                                            <p className="text-black ml-5">level : {boardgame.level}</p>
                                            <p className="text-black ml-5">players : {boardgame.playerCounts} persons</p>
                                            <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                                <div>
                                                    <p className="text-black" style={{ marginTop: -19 }}>borrowed times : {boardgame.borrowedTimes}</p>
                                                </div>
                                                <button
                                                    className="btn-search"
                                                    onClick={() => handleBorrowClick(boardgame)}
                                                >
                                                    Borrow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        {showPopular && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 pb-12 pt-16" style={{ position: 'absolute', left: '19%', top: '1380px' }}>
                                <p className="text-2xl font-semibold col-span-full">Popular</p>
                                {popular.map((boardgame) => (
                                    <div key={boardgame.boardgame_id} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                        <img src={boardgame.imagePath} alt={boardgame.boardgame_name} className="w-[280px] h-[220px] object-fill" style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }} />
                                        <div className="mt-3">
                                            <p className="text-xl font-semibold ml-5">{boardgame.boardgame_name}</p>
                                            <p className="text-black ml-5">{boardgame.category_name}</p>
                                            <p className="text-black ml-5">level : {boardgame.level}</p>
                                            <p className="text-black ml-5">players : {boardgame.playerCounts} persons</p>
                                            <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                                <div>
                                                    <p className="text-black" style={{ marginTop: -19 }}>borrowed times : {boardgame.borrowedTimes}</p>
                                                </div>
                                                <button
                                                    className="btn-search"
                                                    onClick={() => handleBorrowClick(boardgame)}
                                                >
                                                    Borrow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* modalยืมบอร์ดเกม */}
                    {selectedGame && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-[#ececec] p-6 rounded-lg w-[300px]" style={{ borderRadius: '35px' }}>
                                <h3 className="font-bold text-xl">{selectedGame.boardgame_name}</h3>
                                <div className="flex row gap-4 mt-4">
                                    <p className="text-lg">Status:</p>
                                    <p className={`text-lg font-semibold ${status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                                        {status}
                                    </p>
                                </div>
                                <p className="text-lg pt-2 pb-2">Borrow</p>
                                <div className="relative">
                                    <button className="btn-custom" onClick={toggleHourDropdown}>
                                        {selectedHour}
                                        <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                                    </button>
                                    {isHourOpen && (
                                        <div className="absolute mt-2 w-48 bg-[#ececec] border border-black rounded-3xl shadow-lg" style={{ zIndex: 10 }}>
                                            <ul>
                                                <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-tl-3xl hover:rounded-tr-3xl cursor-pointer" onClick={() => handleHourSelect('1 Hour')}>1 Hour</li>
                                                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleHourSelect('2 Hours')}>2 Hours</li>
                                                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleHourSelect('3 Hours')}>3 Hours</li>
                                                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer" onClick={() => handleHourSelect('4 Hours')}>4 Hours</li>
                                                <li className="px-4 py-2 hover:bg-black hover:text-white hover:rounded-bl-3xl hover:rounded-br-3xl cursor-pointer" onClick={() => handleHourSelect('5 Hours')}>5 Hours</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 pb-2 pt-2">
                                    <hr className="flex-grow" style={{ height: '0.2px', backgroundColor: 'black', border: 'none' }} />
                                    <p className="mx-2">or</p>
                                    <hr className="flex-grow" style={{ height: '0.2px', backgroundColor: 'black', border: 'none' }} />
                                </div>
                                <p className="text-lg pb-2">Booking</p>
                                {/* ช่องอินพุทวันเดือนปีที่ต้องการจองแบบ __DD / __MM / __ YY */}
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
                                        maxLength="2"
                                        className="w-10 text-center"
                                        style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button className="btn-search" onClick={handleConfirmClick}>Confirm</button>
                                    <button
                                        className="btn-custom"
                                        onClick={() => setSelectedGame(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ส่วนแสดงผลเสิร์ช */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5" style={{ position: 'absolute', left: '20%', top: '575px' }}>
                        {boardgames.length > 0 ? (
                            boardgames.map((game) => (
                                <div key={game.id} className="bg-transparent shadow-lg p-3" style={{ border: '1px solid black', borderRadius: '38px' }}>
                                    <img src={game.imagePath} alt={game.name} className="w-[280px] h-[220px] object-fill" style={{ borderTopLeftRadius: '38px', borderTopRightRadius: '38px' }} />
                                    <div className="mt-3">
                                        <p className="text-xl font-semibold ml-5">{game.name}</p>
                                        <p className="text-black ml-5">{game.category}</p>
                                        <p className="text-black ml-5">level : {game.level}</p>
                                        <p className="text-black ml-5">players : {game.players} persons</p>
                                        <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                            <div>
                                                <p className="text-black" style={{ marginTop: -14 }}>borrowed times : {game.borrowedTimes}</p>
                                            </div>
                                            <button
                                                className="btn-search"
                                                onClick={() => setSelectedGame(game)}
                                            >
                                                Borrow
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>
                                {boardgames.map((game) => (
                                    <div key={game.id}>{game.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

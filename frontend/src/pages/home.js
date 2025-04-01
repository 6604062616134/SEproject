import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

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
    const [recommended, setRecommended] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [status, setStatus] = useState('available');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchBoardgamesRecommended();
        fetchGameStatus();
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

    const handleBorrowClick = async (game) => {
        alert("Please log in to borrow/reserve a board game.");
        return;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setShowRecommended(false);
        setIsSearching(true); // ตั้งค่า isSearching เป็น true เมื่อเริ่มค้นหา
        try {
            const response = await axios.get('http://localhost:8000/boardgames', {
                params: {
                    name: searchTerm,
                    level: selectedLevel !== 'Level' ? selectedLevel : '',
                    playerCounts: selectedPlayers !== '2 Players' ? selectedPlayers : '',
                    categoryID: selectedCategory !== 'Category' ? selectedCategory : ''
                }
            });
            setBoardgames(response.data.data);
        } catch (error) {
            console.error('Error fetching boardgames:', error);
            setBoardgames([]); // ตั้งค่าเป็นอาร์เรย์ว่างในกรณีที่เกิดข้อผิดพลาด
        } finally {
            setIsSearching(false); // ตั้งค่า isSearching เป็น false เมื่อการค้นหาเสร็จสิ้น
        }
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

    return (
        <div>
            <Navbar />
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
                                                    onClick={() => handleBorrowClick(boardgame)}
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
                                        <div className="flex justify-between gap-4 items-center ml-5 mr-2">
                                            <div>
                                                <p className="text-black" style={{ marginTop: -14 }}>players : {game.playerCounts} persons</p>
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
                            isSearching && <p className="text-2xl font-semibold text-black opacity-50">No results</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
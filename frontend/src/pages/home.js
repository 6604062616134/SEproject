import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import { NavLink } from 'react-router-dom';

function Home() {
    const [boardgames, setBoardgames] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchBoardgames = async () => {
            try {
                const response = await axios.get('http://localhost:8000/boardgames');
                console.log("API Response:", (response.data.data));
                let test = response.data.data;
                console.log("typeof response.data:", typeof response.data.data);
                setBoardgames(response.data.data);
            } catch (error) {
                console.error("Error fetching boardgames:", error);
                setBoardgames([]);
            }
        };
        fetchBoardgames();
    }, []);

    const borrowSubmit = async (boardgameId) => {
        try {
            let res = await axios.post(
                'http://localhost:8000/br',
                { boardgame_id: boardgameId },
                { withCredentials: true }
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

    const toggleMenu = (collapsed) => {
        setIsMenuOpen(collapsed);
    };

    return (
        <div>
            <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='flex justify-center items-center min-h-screen' style={{ position: 'relative', width: '100%', height: '100%', left: '100px', top: '-100px' }}>
                <div className='container mx-auto'>
                    <h1 className='text-4xl font-bold' style={{ position: 'absolute', left: '15%', top: '160px' }}>Find Your Boardgames !</h1>
                    {/* search bar */}
                    <div className="mt-5 flex items-center gap-4" style={{ position: 'absolute', left: '15%', top: '220px' }}>
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search Boardgames ..."
                                name="search"
                                className="border border-black rounded-3xl p-2 pl-10 bg-transparent"
                                style={{ borderWidth: '1px', width: '700px' }} // กำหนดความกว้างของช่องอินพุท
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className='btn-custom'>
                                Category
                                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                            </button>
                            <button className='btn-custom'>
                                Level
                                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                            </button>
                            <button className='btn-custom'>
                                2 Players
                                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                            </button>
                            <button className='btn-search'>Search</button>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-center gap-20" style={{ position: 'absolute', left: '21%', top: '300px' }}>
                        <div className="flex flex-col items-center">
                            <NavLink to='#' target='_blank'>
                                <img src="/images/partygame.jpg" alt="Party games" className="circular-image" />
                            </NavLink>
                            <NavLink to='#' target='_blank' className='hover:underline text-xl font-semibold mt-2'>Party games</NavLink>
                        </div>
                        <div className="flex flex-col items-center">
                            <NavLink to='#' target='_blank'>
                                <img src="/images/kidgame.jpg" alt="Kids games" className="circular-image" />
                            </NavLink>
                            <NavLink to='#' target='_blank' className='hover:underline text-xl font-semibold mt-2'>Kids games</NavLink>
                        </div>
                        <div className="flex flex-col items-center">
                            <NavLink to='#' target='_blank'>
                                <img src="/images/familygame.jpg" alt="Family games" className="circular-image" />
                            </NavLink>
                            <NavLink to='#' target='_blank' className='hover:underline text-xl font-semibold mt-2'>Family games</NavLink>
                        </div>
                        <div className="flex flex-col items-center">
                            <NavLink to='#' target='_blank'>
                                <img src="/images/strategygame.jpg" alt="Strategy games" className="circular-image" />
                            </NavLink>
                            <NavLink to='#' target='_blank' className='hover:underline text-xl font-semibold mt-2'>Strategy games</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

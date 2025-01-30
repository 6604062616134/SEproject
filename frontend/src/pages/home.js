import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

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
            <div className='container mx-auto'>
                <h1 className='text-4xl font-bold' style={{ position: 'absolute', left: '15%', top: '160px' }}>Find Your Boardgames !</h1>
                {/* search bar */}
                <div className="mt-5 flex items-center gap-4" style={{ position: 'absolute', left: '15%', top: '240px' }}>
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search.."
                            name="search"
                            className="border border-black rounded-3xl p-2 pl-10 bg-transparent"
                            style={{ borderWidth: '1px', width: '700px' }} // กำหนดความกว้างของช่องอินพุท
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className='btn-custom'>Category</button>
                        <button className='btn-custom'>Level</button>
                        <button className='btn-custom'>2 Players</button>
                        <button className='btn-search'>Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

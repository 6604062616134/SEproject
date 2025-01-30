import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/navbar-login';

function Homelogin() {
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
            <NavbarLogin isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className='container mx-auto'>
                <h1 className='text-2xl font-bold'>HOME</h1>
            </div>
        </div>
    );
}

export default Homelogin;

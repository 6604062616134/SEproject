import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [boardgames, setBoardgames] = useState([]);

    useEffect(() => {
        const fetchBoardgames = async () => {
            const response = await axios.get('http://localhost:8000/boardgames');
            setBoardgames(response.data.data);
        };
        fetchBoardgames();
    }, []);

    return (
        <div>
            <h1>Boardgames</h1>
            <ul>
                {boardgames.map((boardgame) => (
                    <li key={boardgame.id}>{boardgame.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
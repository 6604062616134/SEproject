import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [boardgames, setBoardgames] = useState([]);

    useEffect(() => {
        const fetchBoardgames = async () => {
            try {
                const response = await axios.get('http://localhost:8000/br');
                
                setBoardgames(response.data.data);
            } catch (error) {
                console.error("Error fetching boardgames:", error);
                setBoardgames([]);
            }
        };
        fetchBoardgames();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {boardgames.map((boardgame, idx) => (
                    <li key={idx} className='my-2'>
                        <p>{boardgame.game_name}</p>
                        <p>{boardgame.user_name}</p>
                        <p>{boardgame.studentID}</p>
                        <p>{boardgame.tel}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;


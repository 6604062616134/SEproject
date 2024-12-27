import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [boardgames, setBoardgames] = useState([]);

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
            if(res.data.status == "success"){
                alert("Borrow request sent successfully");
            }
        } catch (error) {
            console.error("Error submitting borrow request:", error);
        }
    };

    return (
        <div>
            <h1>Boardgames</h1>

            <ul>
                {boardgames.map((boardgame, idx) => (
                    <li key={idx} className='my-2'>
                        <p>{boardgame.boardgame_name}</p>
                        <button onClick={() => borrowSubmit(boardgame.boardgame_id)} className='bg-red-300 p-1 rounded'>Borrow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;

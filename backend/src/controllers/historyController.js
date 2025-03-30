const db = require('../db');

const HistoryController = {
    async getHistory(req, res) {
        try {
            const { userID } = req.query;

            if (!userID) {
                return res.status(400).json({ error: 'Missing userID or gameID', status: 'error' });
            }

            const sql = `
                SELECT 
                h.*, 
                b.name AS game_name, -- ใช้ alias เพื่อแยกชื่อเกม
                c.name AS category_name, -- ใช้ alias เพื่อแยกชื่อหมวดหมู่
                b.*, 
                c.*
                FROM history h
                LEFT JOIN boardgames b ON h.gameID = b.id
                LEFT JOIN category c ON b.categoryID = c.id
                WHERE h.userID = ?
                ORDER BY h.modified DESC
            `;

            const [rows] = await db.query(sql, [userID]);

            console.log('Fetched history:', rows); // Log the fetched history for debugging

            if (rows.length === 0) {
                return res.status(404).json({ error: 'History not found', status: 'error' });
            }

            const historyWithImagePaths = rows.map(row => ({
                ...row,
                imagePath: `/images/${row.game_name.replace(/\s+/g, '_').toLowerCase()}.jpg`
            }));

            console.log('History with image paths:', historyWithImagePaths); // Log the history with image paths for debugging

            res.status(200).json({ status: 'success', data: historyWithImagePaths });

        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
}

module.exports = HistoryController;
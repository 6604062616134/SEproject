const db = require('../db');

const HistoryController = {
    async getHistory(req, res) {
        try {
            const { userID } = req.query; // Get userID from query parameters

            if (!userID) {
                return res.status(400).json({ error: 'Missing userID or gameID', status: 'error' });
            }

            const sql = `
                SELECT h.*, b.name
                FROM history h
                LEFT JOIN boardgames b ON h.gameID = b.id
                WHERE h.userID = 2
                ORDER BY h.modified DESC
            `;

            const [rows] = await db.query(sql, [userID]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'History not found', status: 'error' });
            }

            const historyWithImagePaths = rows.map(row => ({
                ...row,
                imagePath: `/images/${row.name.replace(/\s+/g, '_').toLowerCase()}.jpg`
            }));
            //console.log("Borrowed Games with Image Paths:", historyWithImagePaths);

            res.status(200).json({ status: 'success', data: historyWithImagePaths });

            // res.json({ data: rows, status: 'success' });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
}

module.exports = HistoryController;
const db = require('../db');

const ReserveController = {
    async getReservationById(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query('SELECT * FROM reservation WHERE reserveID = ?', [id]);
    
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Reservation not found', status: 'error' });
            }
    
            res.json({ data: rows[0], status: 'success' });
        } catch (error) {
            console.error('Error fetching reservation:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    // async updateReservationById(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const { status } = req.body;
    
    //         const [result] = await db.query('UPDATE reservation SET status = ? WHERE reserveID = ?', [status, id]);
    
    //         if (result.affectedRows === 0) {
    //             return res.status(404).json({ error: 'Reservation not found', status: 'error' });
    //         }
    
    //         res.status(200).json({ message: 'Reservation updated successfully', affectedRows: result.affectedRows, status: 'success' });
    //     } catch (error) {
    //         console.error('Error updating reservation:', error);
    //         res.status(500).json({ error: 'Internal server error', status: 'error' });
    //     }
    // },

    // async createReservation(req, res) {
    //     try {
    //         const { gameID, userID } = req.body;

    //         if (!gameID || !userID) {
    //             return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    //         }
    
    //         // // ตรวจสอบ transactionID จากตาราง borrowreturn ที่สถานะเป็น borrowed
    //         // const [borrowedRows] = await db.query(
    //         //     'SELECT transactionID FROM borrowreturn WHERE gameID = ? AND status = "borrowed"',
    //         //     [gameID]
    //         // );
    
    //         // if (borrowedRows.length === 0) {
    //         //     return res.status(400).json({
    //         //         status: 'error',
    //         //         message: 'Cannot reserve this game. The game is available.',
    //         //     });
    //         // }
    
    //         // const transactionID = borrowedRows[0].transactionID;
            
    //         //เช็คสต็อกจากตารางboardgames ถ้าสต็อก == 0 จะจองได้
            
    //         const [stockRows] = await db.query('SELECT stock FROM boardgames WHERE id = ?', [gameID]);

    //         const { stock } = stockRows[0];

    //         // อนุญาตให้จองได้เฉพาะเมื่อ stock == 0
    //         if (stock > 0) {
    //             return res.status(400).json({
    //                 status: 'error',
    //                 message: 'Cannot reserve this game. The game is still in stock.',
    //             });
    //         }

    //         // ทำการจองเกม
    //         const [result] = await db.query(
    //             'INSERT INTO reservation (gameID, userID, modifiedDate) VALUES (?, ?, NOW())',
    //             [gameID, userID]
    //         );
    
    //         res.status(200).json({
    //             message: 'Reservation created successfully',
    //             reservationId: result.insertId,
    //             status: 'success',
    //         });
    //     } catch (error) {
    //         console.error('Error creating reservation:', error);
    //         res.status(500).json({ error: 'Internal server error', status: 'error' });
    //     }
    // }

    async createReservation(req, res) {
        try {
            const { gameID, userID } = req.body;
    
            if (!gameID || !userID) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }
    
            // ตรวจสอบ stock จากตาราง boardgames
            const [stockRows] = await db.query('SELECT stock FROM boardgames WHERE id = ?', [gameID]);
    
            if (stockRows.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Game not found' });
            }
    
            const { stock } = stockRows[0];
    
            // อนุญาตให้จองได้เฉพาะเมื่อ stock == 0
            if (stock > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot reserve this game. The game is still in stock.',
                });
            }
    
            // ทำการจองเกม
            const [result] = await db.query(
                'INSERT INTO reservation (gameID, userID, modifiedDate) VALUES (?, ?, NOW())',
                [gameID, userID]
            );
    
            const reservationId = result.insertId;
    
            // เพิ่มการแจ้งเตือนในตาราง notification
            const message = `Your reservation for game ID ${gameID} has been created.`;
            await db.query(
                'INSERT INTO notification (message, userID, gameID, reserveID, created) VALUES (?, ?, ?, ?, NOW())',
                [message, userID, gameID, reservationId]
            );
    
            res.status(200).json({
                message: 'Reservation created successfully',
                reservationId,
                status: 'success',
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
}

module.exports = ReserveController;
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

    async createReservation(req, res) {
        try {
            const { gameID, userID } = req.body;
    
            // ตรวจสอบ transactionID จากตาราง borrowreturn ที่สถานะเป็น borrowed
            const [borrowedRows] = await db.query(
                'SELECT transactionID FROM borrowreturn WHERE gameID = ? AND status = "borrowed"',
                [gameID]
            );
    
            if (borrowedRows.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot reserve this game. The game is available.',
                });
            }
    
            const transactionID = borrowedRows[0].transactionID;
    
            // ทำการจองเกม
            const [result] = await db.query(
                'INSERT INTO reservation (gameID, userID, transactionID, modifiedDate) VALUES (?, ?, ?, ?, NOW())',
                [gameID, userID, transactionID]
            );
    
            res.status(200).json({
                message: 'Reservation created successfully',
                reservationId: result.insertId,
                status: 'success',
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
}

module.exports = ReserveController;
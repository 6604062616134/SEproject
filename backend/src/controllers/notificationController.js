const db = require('../db');

const NotificationController = {
    async getNotifications(req, res) {
        try {
            // // ดึงข้อมูลการแจ้งเตือนแบบ Returning
            // const [returningRows] = await db.query(`
            //     SELECT b.boardgame_name, br.borrowingDate, br.borrow_return_date
            //     FROM borrowreturn br
            //     JOIN boardgames b ON br.gameID = b.boardgame_id
            //     WHERE br.userID = ? AND br.borrow_return_date < NOW() AND br.status = 'borrowed'
            // `, [req.user.id]);

            // // ดึงข้อมูลการแจ้งเตือนแบบ Reservation
            // const [reservationRows] = await db.query(`
            //     SELECT b.boardgame_name, 'available' AS status
            //     FROM reservations r
            //     JOIN boardgames b ON r.gameID = b.boardgame_id
            //     WHERE r.userID = ? AND r.status = 'reserved'
            // `, [req.user.id]);

            // const notifications = [
            //     ...returningRows.map(row => ({ type: 'Returning', ...row })),
            //     ...reservationRows.map(row => ({ type: 'Reservation', ...row }))
            // ];

            // if (notifications.length === 0) {
            //     res.status(404).json({ error: 'Notification not found', status: 'error' });
            // } else {
            //     res.json({ data: notifications, status: 'success' });
            // }

        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async createNotification(req, res) {
        try {
            
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = NotificationController;
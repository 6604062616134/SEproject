const db = require('../db');

const NotificationController = {
    async getNotifications(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM borrowreturn ORDER BY created DESC');

            if (rows.length === 0) {
                res.status(404).json({ error: 'Notification not found', "status": "error" });
            } else {
                res.json({ data: rows, "status": "success" });
            }

        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    }
};

module.exports = NotificationController;
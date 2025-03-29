const db = require('../db');

const ReportController = {
    async createReport(req, res) {
        try {
            const { userID, message } = req.body;
    
            // ดึงอีเมลของผู้ใช้จาก userID
            const [userRows] = await db.query('SELECT email FROM users WHERE id = ?', [userID]);
            if (userRows.length === 0) {
                return res.status(404).json({ error: 'User not found', status: 'error' });
            }
    
            const email = userRows[0].email;
            const created = new Date();
    
            // บันทึกรีพอร์ตลงในฐานข้อมูล
            await db.query('INSERT INTO reports (email, message, created) VALUES (?, ?, ?)', [email, message, created]);
    
            res.status(201).json({ message: 'Report submitted successfully', status: 'success' });
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async getReports(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM reports ORDER BY created DESC');
            res.json({ data: rows, status: 'success' });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },
}

module.exports = ReportController;
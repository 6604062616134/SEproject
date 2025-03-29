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
            await db.query('INSERT INTO reports (email, message, created, status) VALUES (?, ?, ?, ?)', [email, message, created, 'pending']);
    
            res.status(201).json({ message: 'Report submitted successfully', status: 'success' });
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async getReports(req, res) {
        try {
            // ดึงเฉพาะรายงานที่มีสถานะเป็น 'pending'
            const [rows] = await db.query('SELECT * FROM reports WHERE status = "pending" ORDER BY created DESC');
            res.json({ data: rows, status: 'success' });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async updateReport(req, res) {
        try {
            const { message, status } = req.body;
    
            // ตรวจสอบว่าอีเมลและสถานะถูกส่งมาหรือไม่
            if (!message || !status) {
                return res.status(400).json({ error: 'message and status are required', status: 'error' });
            }
    
            // อัปเดตสถานะของรีพอร์ตในฐานข้อมูลโดยใช้เงื่อนไขอีเมล
            const [result] = await db.query('UPDATE reports SET status = ? WHERE message = ?', [status, message]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'No report found for the provided email', status: 'error' });
            }
    
            res.json({ message: 'Report updated successfully', status: 'success' });
        } catch (error) {
            console.error('Error updating report:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
}

module.exports = ReportController;
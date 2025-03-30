const db = require('../db');

const NotificationController = {
    async getReserveNotificationsById(req, res) {
        try {
            const { id } = req.params;

            // ดึงข้อมูลจากตาราง reservation ด้วยuserID
            const [rows] = await db.query('SELECT * FROM reservation WHERE userID = ?', [id]); //ได้ reserveID,gameID,userID

            //เอา gameID ไปดึงข้อมูลจากตาราง boardgames เอาชื่อเกมกับประเภท(คอลัมcategoryIDซึ่งต้องไปleft join กับตาราง category เพื่อเอาชื่อประเภทเกม)
            const gameIDs = rows.map(row => row.gameID); // ดึง gameID ทั้งหมดที่ได้จาก rows
            const [games] = await db.query('SELECT name, categoryID FROM boardgames WHERE id = ?', [gameIDs]); //ได้ gameID,gameName,categoryID

            //เอา categoryID ไปดึงข้อมูลจากตาราง category เอาชื่อประเภทเกม
            const categoryIDs = games.map(game => game.categoryID); // ดึง categoryID ทั้งหมดที่ได้จาก games
            const [categories] = await db.query('SELECT name FROM category WHERE id = ?', [categoryIDs]); //ได้ categoryID,categoryName

            // สร้าง array ของ notifications โดยรวมข้อมูลจากทั้ง 3 ตาราง
            const notifications = rows.map((row, index) => {
                return {
                    reserveID: row.reserveID,
                    gameName: games[index].name,
                    categoryName: categories[index].name,
                    status: row.status,
                    createdAt: row.createdAt
                };
            });

            // ส่งข้อมูล notifications กลับไปยัง client
            res.json({ data: notifications, status: 'success' });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async getReturnNotificationsById(req, res) {
        try {
            const { id } = req.params;
    
            // ดึงข้อมูลจากตาราง returning ด้วย userID
            const [rows] = await db.query('SELECT * FROM `returning` WHERE userID = ?', [id]); // ได้ returnID, gameID, userID
    
            // ดึง gameID ทั้งหมดจาก rows
            const gameIDs = rows.map(row => row.gameID);
    
            if (gameIDs.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No return notifications found' });
            }
    
            // ใช้คำสั่ง SQL IN เพื่อดึงข้อมูลเกม
            const [games] = await db.query(
                `SELECT id, name, categoryID FROM boardgames WHERE id IN (${gameIDs.map(() => '?').join(',')})`,
                gameIDs
            );
    
            // ดึง categoryID ทั้งหมดจาก games
            const categoryIDs = games.map(game => game.categoryID);
    
            if (categoryIDs.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No categories found' });
            }
    
            // ใช้คำสั่ง SQL IN เพื่อดึงข้อมูลประเภทเกม
            const [categories] = await db.query(
                `SELECT id, name FROM category WHERE id IN (${categoryIDs.map(() => '?').join(',')})`,
                categoryIDs
            );
    
            // สร้าง array ของ notifications โดยรวมข้อมูลจากทั้ง 3 ตาราง
            const notifications = rows.map(row => {
                const game = games.find(game => game.id === row.gameID);
                const category = categories.find(category => category.id === game.categoryID);
    
                return {
                    returnID: row.returnID,
                    gameName: game.name,
                    categoryName: category.name,
                    status: row.status,
                    createdAt: row.createdAt
                };
            });
    
            // ส่งข้อมูล notifications กลับไปยัง client
            res.json({ data: notifications, status: 'success' });
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
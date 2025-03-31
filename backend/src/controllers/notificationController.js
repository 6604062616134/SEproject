const db = require('../db');

const NotificationController = {
    async getReserveNotificationsById(req, res) {
        try {
            const { id } = req.params;

            // ดึงข้อมูลจากตาราง reservation ด้วย userID
            const [rows] = await db.query('SELECT * FROM reservation WHERE userID = ?', [id]); // ได้ reserveID, gameID, userID

            // ดึง gameID ทั้งหมดจาก rows
            const gameIDs = rows.map(row => row.gameID);

            if (gameIDs.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No reserve notifications found' });
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
                    reserveID: row.reserveID,
                    gameName: game.name,
                    categoryName: category.name,
                    status: row.status || 'available',
                    borrowingDate: row.borrowingDate || null,
                    returningDate: row.returningDate || null,
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

    // async getReturnNotificationsById(req, res) {
    //     try {
    //         const { id } = req.params;

    //         // ดึงข้อมูลจากตาราง returning ด้วย userID
    //         const [rows] = await db.query('SELECT * FROM `returning` WHERE userID = ?', [id]); // ได้ returnID, gameID, userID

    //         // ดึง gameID ทั้งหมดจาก rows
    //         const gameIDs = rows.map(row => row.gameID);

    //         if (gameIDs.length === 0) {
    //             return res.status(404).json({ status: 'error', message: 'No return notifications found' });
    //         }

    //         // ใช้คำสั่ง SQL IN เพื่อดึงข้อมูลเกม
    //         const [games] = await db.query(
    //             `SELECT id, name, categoryID FROM boardgames WHERE id IN (${gameIDs.map(() => '?').join(',')})`,
    //             gameIDs
    //         );

    //         // ดึง categoryID ทั้งหมดจาก games
    //         const categoryIDs = games.map(game => game.categoryID);

    //         if (categoryIDs.length === 0) {
    //             return res.status(404).json({ status: 'error', message: 'No categories found' });
    //         }

    //         // ใช้คำสั่ง SQL IN เพื่อดึงข้อมูลประเภทเกม
    //         const [categories] = await db.query(
    //             `SELECT id, name FROM category WHERE id IN (${categoryIDs.map(() => '?').join(',')})`,
    //             categoryIDs
    //         );

    //         // สร้าง array ของ notifications โดยรวมข้อมูลจากทั้ง 3 ตาราง
    //         const notifications = rows.map(row => {
    //             const game = games.find(game => game.id === row.gameID);
    //             const category = categories.find(category => category.id === game.categoryID);

    //             return {
    //                 returnID: row.returnID,
    //                 gameName: game.name,
    //                 categoryName: category.name,
    //                 status: row.status,
    //                 createdAt: row.createdAt
    //             };
    //         });

    //         // ส่งข้อมูล notifications กลับไปยัง client
    //         res.json({ data: notifications, status: 'success' });
    //     } catch (error) {
    //         console.error('Error fetching notifications:', error);
    //         res.status(500).json({ error: 'Internal server error', status: 'error' });
    //     }
    // },

    async getReturnNotificationsById(req, res) {
        try {
            const { id } = req.params;

            // ดึงข้อมูลจากตาราง returning และ borrowreturn ด้วย userID
            const [rows] = await db.query(
                `SELECT 
                    r.returnID, 
                    r.gameID, 
                    r.userID, 
                    r.returnDate, 
                    r.categoryID, 
                    b.borrowingDate
                FROM \`returning\` r
                JOIN borrowreturn b ON r.gameID = b.gameID
                WHERE r.userID = ?`,
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No return notifications found' });
            }

            // ดึง gameID ทั้งหมดจาก rows
            const gameIDs = rows.map(row => row.gameID);

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
                const category = categories.find(category => category.id === row.categoryID);

                return {
                    returnID: row.returnID,
                    gameName: game ? game.name : 'Unknown Game',
                    categoryName: category ? category.name : 'Unknown Category',
                    borrowingDate: row.borrowingDate ? new Date(row.borrowingDate).toISOString() : null, // แปลงเป็น ISO 8601
                    returningDate: row.returnDate ? new Date(row.returnDate).toISOString() : null, // แปลงเป็น ISO 8601
                    status: row.status || 'returned',
                    createdAt: row.createdAt || null
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
            const { gameID, userID, message } = req.body;

            if (!gameID || !userID || !message) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }

            // บันทึกข้อมูลลงในตาราง notification
            const [result] = await db.query(
                `INSERT INTO notification (gameID, userID, message, rejectType, created) VALUES (?, ?, ?, ?, NOW())`,
                [gameID, userID, message, 'Rejection']
            );

            if (result.affectedRows === 0) {
                return res.status(500).json({ status: 'error', message: 'Failed to create notification' });
            }

            // อัปเดตคอลัมน์ isReject ในตาราง borrowreturn
            const [updateResult] = await db.query(
                `UPDATE borrowreturn SET isReject = 1, modified = NOW() WHERE gameID = ? AND userID = ?`,
                [gameID, userID]
            );

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Failed to update borrowreturn record' });
            }

            return res.status(201).json({ status: 'success', message: 'Notification created and borrowreturn updated successfully' });
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getRejectNotificationsById(req, res) {
        try {
            const { id } = req.params;
    
            // ดึงข้อมูลการแจ้งเตือนการปฏิเสธจากตาราง notification
            const [rows] = await db.query(
                `SELECT 
                    n.notiID AS notificationID,
                    n.gameID,
                    n.userID,
                    n.message,
                    n.created AS createdAt,
                    b.name AS gameName
                FROM notification n
                LEFT JOIN boardgames b ON n.gameID = b.id
                WHERE n.userID = ? AND n.rejectType = 'Rejection'
                ORDER BY n.created DESC`,
                [id]
            );
    
            // หากไม่มีข้อมูล ให้ส่งข้อมูลว่างกลับไป
            if (rows.length === 0) {
                return res.status(200).json({ data: [], status: 'success', message: 'No rejection notifications found' });
            }
    
            // ส่งข้อมูลการแจ้งเตือนกลับไปยัง client
            res.json({ data: rows, status: 'success' });
        } catch (error) {
            console.error('Error fetching rejection notifications:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
};

module.exports = NotificationController;
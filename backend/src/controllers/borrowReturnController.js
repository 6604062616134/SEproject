const db = require('../db');

const BorrowReturnController = {
    // async getTransactionsList(req, res) {
    //     try {
    //         const orderby = req?.query?.orderby || 'desc'; //default order by desc

    //         let sql = `SELECT borrowreturn.transactionID,users.id AS user_id,users.name AS user_name,users.studentID,boardgames.id AS game_id,boardgames.name AS game_name FROM borrowreturn LEFT JOIN users ON borrowreturn.userID = users.id LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id`; //join 3 tables

    //         sql += ` ORDER BY borrowreturn.transactionID ${orderby}`;

    //         const [rows] = await db.query(sql);

    //         if (rows.length === 0) {
    //             res.status(404).json({ error: 'Transaction not found', "status": "error" });
    //         } else {
    //             res.json({ data: rows, "status": "success" });
    //         }

    //     } catch (error) {
    //         console.error('Error fetching transactions:', error);
    //         res.status(500).json({ error: 'Internal server error', "status": "error" });
    //     }
    // },

    async getTransactionsList(req, res) {
        try {
            const orderby = req?.query?.orderby || 'asc'; // default order by desc
            const mode = req.query.mode || ''; // default mode is null

            let sql = `SELECT borrowreturn.transactionID, users.id AS user_id, users.name AS user_name, users.studentID, boardgames.id AS game_id, boardgames.name AS game_name, borrowreturn.status, borrowreturn.borrowingDate, borrowreturn.returningDate FROM borrowreturn LEFT JOIN users ON borrowreturn.userID = users.id LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id`; // join 3 tables

            if (mode) {
                sql += ` WHERE borrowreturn.status = '${mode}'`;
            }

            sql += ` ORDER BY borrowreturn.transactionID ${orderby}`;

            const [rows] = await db.query(sql);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Transaction not found', status: 'error' });
            } else {
                res.json({ data: rows, status: 'success' });
            }

        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async getTransactionById(req, res) {
        try {
            const userId = req.params.id;

            const sql = `SELECT borrowreturn.transactionID, users.id AS user_id, users.name AS user_name, users.studentID, boardgames.id AS game_id, boardgames.name AS game_name, borrowreturn.status, borrowreturn.borrowingDate, borrowreturn.returningDate FROM borrowreturn LEFT JOIN users ON borrowreturn.userID = users.id LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id WHERE users.id = ?`; // join 3 tables

            const [rows] = await db.query(sql, [userId]);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Transaction not found', status: 'error' });
            } else {
                res.json({ data: rows, status: 'success' });
            }

        } catch (error) {
            console.error('Error fetching transaction:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    // async createTransaction(req, res) {
    //     try {
    //         //userล็อกอินแล้วเลือกเกมที่จะยืม กดปุ่มยืม เลือกเวลายืม-คืน กด ยืนยัน
    //         let boardgame_id = req.body.boardgame_id;
    //         let user_id = req.user.id;

    //         const sql = `INSERT INTO borrowreturn (userID, gameID, borrowing, status, created, modified) VALUES (?, ?, NOW(), ?, NOW(), NOW())`;
    //         const [{ insertId }] = await db.query(sql, [user_id, boardgame_id, 'borrowing']);

    //         const [rows] = await db.query('SELECT * FROM borrowreturn WHERE transactionID = ?', insertId);

    //         res.status(201).json({ data: rows[0], "status": "success" });

    //     } catch (error) {
    //         console.error('Error creating transaction:', error);
    //         res.status(500).json({ error: 'Internal server error', "status": "error" });
    //     }
    // },

    async createTransaction(req, res) {
        try {
            const { boardgame_id, user_id, booking_date, hour } = req.body;
            const mode = booking_date ? 'reserved' : 'borrowed'; // ถ้ามี booking_date ให้เป็นโหมด reserved

            // ดึงวันเวลาปัจจุบัน
            const borrowingDate = new Date();

            // คำนวณ borrow_return_date โดยการบวกชั่วโมงที่เลือก
            const borrowReturnDate = new Date(borrowingDate);
            if (hour) {
                borrowReturnDate.setHours(borrowReturnDate.getHours() + parseInt(hour));
            }

            const sql = `INSERT INTO borrowreturn (userID, gameID, borrowingDate, returningDate, status, created, modified, borrow_return_date) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`;
            const [{ insertId }] = await db.query(sql, [user_id, boardgame_id, borrowingDate, borrowReturnDate, mode, borrowReturnDate]);

            if (mode === 'reserved') {
                const reservationSql = `INSERT INTO reservation (transactionID, booking, created, modified) VALUES (?, ?, ?, NOW())`;
                await db.query(reservationSql, [insertId, booking_date, borrowReturnDate]);
            }

            if (mode === 'borrowed') {
                const updateGameStatusSql = `UPDATE boardgames SET status = ? WHERE id = ?`;
                await db.query(updateGameStatusSql, [mode, boardgame_id]);
            } else if (mode === 'reserved') {
                const updateGameStatusSql = `UPDATE borrowreturn SET status = ? WHERE gameID = ?`;
                await db.query(updateGameStatusSql, [mode, boardgame_id]);
            }

            const [rows] = await db.query('SELECT * FROM borrowreturn WHERE transactionID = ?', [insertId]);

            res.status(201).json({ data: rows[0], status: 'success' });
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ status: 'error', error: 'Internal server error' });
        }
    },

    async getBorrowedGames(req, res) {
        try {
            const { userId } = req.params; // ดึง userId จาก URL

            console.log("Fetching borrowed games for user ID:", userId);

            const sql = `
                SELECT 
                    borrowreturn.transactionID,
                    boardgames.id AS game_id,
                    boardgames.name AS game_name,
                    category.name AS category_name,
                    boardgames.level,
                    boardgames.playerCounts,
                    boardgames.borrowedTimes,
                    borrowreturn.status,
                    borrowreturn.borrowingDate,
                    borrowreturn.returningDate
                FROM borrowreturn
                LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id
                LEFT JOIN category ON boardgames.categoryID = category.id
                WHERE borrowreturn.userID = ?
                ORDER BY borrowreturn.transactionID ASC
            `;

            const [rows] = await db.query(sql, [userId]);

            if (rows.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No borrowed games found' });
            }

            const borrowedboardgamesWithImagePaths = rows.map(row => ({
                ...row,
                imagePath: `/images/${row.game_name.replace(/\s+/g, '_').toLowerCase()}.jpg`
            }));
            //console.log("Borrowed Games with Image Paths:", borrowedboardgamesWithImagePaths);

            res.status(200).json({ status: 'success', data: borrowedboardgamesWithImagePaths });
        } catch (error) {
            console.error('Error fetching borrowed games:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    async updateTransactionStatus(req, res) {
        try {
            const { gameID, userID, status } = req.body;

            console.log("Received gameID:", gameID, "Received userID:", userID, "Received status:", status);

            if (!gameID || !userID || !status) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }

            // ตรวจสอบว่ามีข้อมูลเกมนี้อยู่ในฐานข้อมูลหรือไม่
            const [existingTransaction] = await db.query(`SELECT * FROM borrowreturn WHERE gameID = ?`, [gameID]);

            if (existingTransaction.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Game not found' });
            }

            let updateStockSql = '';

            if (status === 'borrowed') {
                // ลด stock เมื่อสถานะเป็น borrowed
                updateStockSql = `UPDATE boardgames SET stock = stock - 1 WHERE id = ? AND stock > 0`;
            }

            if (!updateStockSql) {
                return res.status(400).json({ status: 'error', message: 'Invalid stock update operation' });
            }

            // อัปเดต stock ในตาราง boardgames
            const [stockResult] = await db.query(updateStockSql, [gameID]);

            if (stockResult.affectedRows === 0) {
                return res.status(400).json({ status: 'error', message: 'Stock update failed' });
            }

            // อัปเดต userID และสถานะในตาราง borrowreturn
            const updateBorrowReturnSql = `
                UPDATE borrowreturn
                SET userID = ?, status = ?, modified = NOW()
                WHERE gameID = ?
            `;
            const [borrowReturnResult] = await db.query(updateBorrowReturnSql, [userID, status, gameID]);

            if (borrowReturnResult.affectedRows === 0) {
                return res.status(400).json({ status: 'error', message: 'Failed to update borrowreturn' });
            }

            // เพิ่ม borrowedTimes ในตาราง boardgames
            if (accept) {
                const updateBorrowedTimesSql = `
                UPDATE boardgames
                SET borrowedTimes = borrowedTimes + 1
                WHERE id = ?
            `;
                await db.query(updateBorrowedTimesSql, [gameID]);
            }

            if (status === 'available' || status === 'returning') {
                const insertHistorySql = `
                    INSERT INTO history (gameID, userID, modified)
                    VALUES (?, ?, NOW())
                `;
                await db.query(insertHistorySql, [gameID, userID]);
            }

            res.status(200).json({ status: 'success', message: 'Transaction updated successfully' });
        } catch (error) {
            console.error('Error updating transaction status:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    async adminAcceptRequest(req, res) {
        try {
            const { gameID, name, status } = req.body;
    
            console.log("Admin Accept Request - Received gameID:", gameID, "name:", name, "status:", status);
    
            if (!gameID || !name || !status) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }
    
            // ค้นหา userID จาก name
            const [userResult] = await db.query(`SELECT id FROM users WHERE name = ?`, [name]);
    
            if (userResult.length === 0) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
    
            const userID = userResult[0].id;
    
            // อัปเดต userID และสถานะในตาราง borrowreturn
            const updateBorrowReturnSql = `
                UPDATE borrowreturn
                SET userID = ?, status = ?, modified = NOW()
                WHERE gameID = ?
            `;
            const [borrowReturnResult] = await db.query(updateBorrowReturnSql, [userID, status, gameID]);
    
            if (borrowReturnResult.affectedRows === 0) {
                return res.status(400).json({ status: 'error', message: 'Failed to update borrowreturn' });
            }
    
            // เพิ่ม stock ในกรณีที่สถานะเป็น returning
            if (status === 'returning') {
                const updateStockSql = `
                    UPDATE boardgames
                    SET stock = stock + 1
                    WHERE id = ?
                `;
                const [stockResult] = await db.query(updateStockSql, [gameID]);
    
                if (stockResult.affectedRows === 0) {
                    return res.status(400).json({ status: 'error', message: 'Failed to update stock' });
                }
    
                // ตรวจสอบ stock หลังจากอัปเดต
                const [stockCheckResult] = await db.query(`SELECT stock FROM boardgames WHERE id = ?`, [gameID]);
    
                if (stockCheckResult.length > 0 && stockCheckResult[0].stock > 0) {
                    // อัปเดตสถานะใน borrowreturn เป็น available หาก stock > 0
                    const updateStatusSql = `
                        UPDATE borrowreturn
                        SET status = 'available', modified = NOW()
                        WHERE gameID = ?
                    `;
                    await db.query(updateStatusSql, [gameID]);
                }
            }
    
            // เพิ่ม borrowedTimes ในตาราง boardgames ในกรณีที่สถานะเป็น borrowed
            if (status === 'borrowed') {
                const updateBorrowedTimesSql = `
                    UPDATE boardgames
                    SET borrowedTimes = borrowedTimes + 1
                    WHERE id = ?
                `;
                await db.query(updateBorrowedTimesSql, [gameID]);
            }
    
            res.status(200).json({ status: 'success', message: 'Request accepted successfully' });
        } catch (error) {
            console.error('Error in adminAcceptRequest:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    async returnGame(req, res) {
        try {
            const { game_id } = req.params; // ดึง game_id จาก URL
            const { user_id, status } = req.body; // ดึง user_id และ status จาก body

            if (!game_id || !user_id || !status) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }

            // ตรวจสอบว่ามีข้อมูลเกมนี้อยู่ในฐานข้อมูลหรือไม่
            const [existingTransaction] = await db.query(`SELECT * FROM borrowreturn WHERE gameID = ? AND userID = ?`, [game_id, user_id]);

            if (existingTransaction.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Transaction not found' });
            }

            // อัพเดตสถานะในตาราง borrowreturn เป็น returning
            const sql = `
                UPDATE borrowreturn
                SET status = ?, modified = NOW()
                WHERE gameID = ? AND userID = ?
            `;
            const [result] = await db.query(sql, [status, game_id, user_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Failed to update transaction' });
            }

            res.status(200).json({ status: 'success', message: 'Game status updated to returning' });
        } catch (error) {
            console.error('Error returning game:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    async getStatus(req, res) {
        try {
            const gameId = req.params.gameId;

            const sql = `
                SELECT status
                FROM borrowreturn
                WHERE gameID = ?
            `;

            const [rows] = await db.query(sql, [gameId]);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Status not found', status: 'error' });
            } else {
                res.json({ data: rows, status: 'success' });
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

}

module.exports = BorrowReturnController;
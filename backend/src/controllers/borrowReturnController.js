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

            let sql = `SELECT borrowreturn.transactionID, users.id AS user_id, users.name AS user_name, users.studentID, boardgames.id AS game_id, boardgames.name AS game_name, borrowreturn.status, borrowreturn.borrowingDate FROM borrowreturn LEFT JOIN users ON borrowreturn.userID = users.id LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id`; // join 3 tables

            if (mode) {
                sql += ` WHERE borrowreturn.isBorrow = 1`;
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

            //console.log("Fetching borrowed games for user ID:", userId);

            const sql = `
                SELECT 
                borrowreturn.transactionID,
                boardgames.id AS game_id,
                boardgames.name AS game_name,
                category.name AS category_name,
                boardgames.level,
                boardgames.playerCounts,
                borrowreturn.status,
                borrowreturn.borrowingDate,
                borrowreturn.isReject,
                boardgames.stock
            FROM borrowreturn
            LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id
            LEFT JOIN category ON boardgames.categoryID = category.id
            WHERE borrowreturn.userID = ? 
              AND borrowreturn.isBorrow = 1 || borrowreturn.isReject = 1
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

            // ตรวจสอบ stock ของเกม
            const [stockCheckResult] = await db.query(`SELECT stock FROM boardgames WHERE id = ?`, [gameID]);

            if (stockCheckResult.length === 0) {
                return res.status(404).json({ status: 'error', message: 'boardgames not available' });
            }

            const { stock } = stockCheckResult[0];

            const updateBorrowReturnSql = `
                UPDATE borrowreturn
                SET isBorrow = 1, userID = ?, modified = NOW()
                WHERE gameID = ?
            `;

            const [borrowReturnResult] = await db.query(updateBorrowReturnSql, [userID, gameID]);

            if (borrowReturnResult.affectedRows === 0) {
                return res.status(400).json({ status: 'error', message: 'Failed to update borrowreturn' });
            }

            // เงื่อนไขการจัดการ stock และสถานะ
            if (status === 'borrowed') {
                if (stock === 0) {
                    // อัปเดตสถานะเป็น borrowed
                    const updateBorrowReturnSql = `
                        UPDATE borrowreturn
                        SET userID = ?, status = ?, modified = NOW()
                        WHERE gameID = ?
                    `;
                    await db.query(updateBorrowReturnSql, [userID, status, gameID]);

                    return res.status(200).json({ status: 'success', message: 'Status updated to borrowed.' });
                } else if (stock > 0) {
                    // ลด stock ลง 1
                    const updateStockSql = `
                        UPDATE boardgames
                        SET stock = stock - 1
                        WHERE id = ?
                    `;
                    await db.query(updateStockSql, [gameID]);

                    return res.status(200).json({ status: 'success', message: 'Stock decreased by 1' });
                }
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

    async createReturningDate(req, res) {
        try {
            const { gameID, userID, hour } = req.body;

            if (!gameID || !userID) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }

            if (!hour) {
                return res.status(400).json({ status: 'error', message: 'Missing hour' });
            }

            // ดึง borrowingDate จากฐานข้อมูล
            const [borrowRecord] = await db.query(
                `SELECT borrowingDate FROM borrowreturn WHERE gameID = ? AND userID = ?`,
                [gameID, userID]
            );

            if (borrowRecord.length === 0 || !borrowRecord[0].borrowingDate) {
                return res.status(404).json({ status: 'error', message: 'Borrowing date not found' });
            }

            const borrowingDate = new Date(borrowRecord[0].borrowingDate);
            console.log("Borrowing Date:", borrowingDate);

            // คำนวณวันที่คืนโดยการบวกชั่วโมงที่เลือก
            const returnDate = new Date(borrowingDate);
            returnDate.setHours(returnDate.getHours() + parseInt(hour));

            const formattedReturnDate = returnDate.toISOString().slice(0, 19).replace('T', ' ');
            console.log("Calculated Return Date:", formattedReturnDate);

            // ดึง categoryID จาก gameID
            const [categoryResult] = await db.query(
                `SELECT categoryID FROM boardgames WHERE id = ?`,
                [gameID]
            );

            if (categoryResult.length === 0 || !categoryResult[0].categoryID) {
                return res.status(404).json({ status: 'error', message: 'Category not found for the given gameID' });
            }

            // กำหนดค่า categoryID
            const categoryID = categoryResult[0].categoryID;
            console.log("Category ID:", categoryID);

            // เพิ่มข้อมูลลงในตาราง returning
            const insertReturnSql = `
                INSERT INTO \`returning\` (gameID, userID, categoryID, returnDate)
                VALUES (?, ?, ?, ?)
            `;

            await db.query(insertReturnSql, [gameID, userID, categoryID, formattedReturnDate]);

            res.status(200).json({ status: 'success', message: 'Return date created successfully' });

        } catch (error) {
            console.error('Error updating returning date:', error);
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
                SET userID = ?, status = ?, modified = NOW(), isBorrow = 0
                WHERE gameID = ?
            `;
            const [borrowReturnResult] = await db.query(updateBorrowReturnSql, [userID, status, gameID]);

            if (borrowReturnResult.affectedRows === 0) {
                return res.status(400).json({ status: 'error', message: 'Failed to update borrowreturn' });
            }

            // เพิ่ม stock ในกรณีที่สถานะเป็น returning
            if (status === 'returning') {
                // ตรวจสอบ stock ก่อนเพิ่ม
                const [stockCheckResult] = await db.query(`SELECT stock FROM boardgames WHERE id = ?`, [gameID]);

                const { stock } = stockCheckResult[0]; // ตรวจสอบ stock ก่อนเพิ่ม

                // เพิ่ม stock
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
                const [updatedStockResult] = await db.query(`SELECT stock FROM boardgames WHERE id = ?`, [gameID]);

                if (updatedStockResult.length > 0 && updatedStockResult[0].stock > 0) {
                    // อัปเดตสถานะใน borrowreturn เป็น available หาก stock > 0
                    const updateStatusSql = `
                            UPDATE borrowreturn
                            SET status = 'available', modified = NOW()
                            WHERE gameID = ?
                        `;
                    await db.query(updateStatusSql, [gameID]);
                }

            }

            // เพิ่มประวัติการยืมในตาราง history
            const insertHistorySql = `
                INSERT INTO history (gameID, userID, modified)
                VALUES (?, ?, NOW())
            `;
            await db.query(insertHistorySql, [gameID, userID]);

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

            // อัพเดตคอลัมน์ isReject เป็น 0
            const updateIsRejectSql = `
            UPDATE borrowreturn
            SET isReject = 0, modified = NOW()
            WHERE gameID = ? AND userID = ?
        `;
            const [updateIsRejectResult] = await db.query(updateIsRejectSql, [game_id, user_id]);

            if (updateIsRejectResult.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Failed to update isReject column' });
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

    async adminRejectRequest(req, res) {
        try {
            const { gameID, userID, reason } = req.body;

            if (!gameID || !userID || !reason) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields' });
            }

            // อัปเดตสถานะ isReject เป็น 1 ในตาราง borrowreturn
            const sql = `
                UPDATE borrowreturn
                SET isReject = 1, modified = NOW()
                WHERE gameID = ? AND userID = ?
            `;
            const [result] = await db.query(sql, [gameID, userID]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Failed to update transaction' });
            }

            // เพิ่มการแจ้งเตือนการปฏิเสธในตาราง notification
            const notificationSql = `
                INSERT INTO notification (gameID, userID, message, rejectType, created)
                VALUES (?, ?, ?, 'Rejection', NOW())
            `;
            await db.query(notificationSql, [gameID, userID, reason]);

            res.status(200).json({ status: 'success', message: 'Request rejected successfully' });
        } catch (error) {
            console.error('Error in adminRejectRequest:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

module.exports = BorrowReturnController;
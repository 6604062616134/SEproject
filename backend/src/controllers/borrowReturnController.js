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
            const userId = req.params.userId;

            const sql = `
                SELECT 
                borrowreturn.transactionID, 
                boardgames.id AS game_id, 
                boardgames.name AS game_name, 
                category.name AS category_name, -- ดึงชื่อ category จากตาราง category
                boardgames.level, 
                boardgames.playerCounts, 
                boardgames.borrowedTimes, 
                borrowreturn.status, 
                borrowreturn.borrowingDate, 
                borrowreturn.returningDate
            FROM borrowreturn
            LEFT JOIN boardgames ON borrowreturn.gameID = boardgames.id
            LEFT JOIN category ON boardgames.categoryID = category.id -- เชื่อมตาราง category
            WHERE borrowreturn.userID = ?
            AND borrowreturn.status = 'borrowed'
            ORDER BY borrowreturn.gameID ASC
            `;

            const [rows] = await db.query(sql, [userId]);

            if (rows.length === 0) {
                res.status(404).json({ error: 'No borrowed games found', status: 'error' });
            }
            // เพิ่ม imagePath ให้กับแต่ละบอร์ดเกม
            const borrowedGamesWithImagePaths = rows.map(row => ({
                ...row,
                imagePath: `/images/${row.game_name.replace(/\s+/g, '_').toLowerCase()}.jpg` // สร้างพาธรูปภาพ
            }));

            res.json({ data: borrowedGamesWithImagePaths, status: 'success' });

        } catch (error) {
            console.error('Error fetching borrowed games:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async updateTransactionStatus(req, res) {
        try {
            const { boardgame_id } = req.params;
            const { user_id, status } = req.body;

            const sql = `
                UPDATE borrowreturn
                SET status = ?, userID = ?, modified = NOW()
                WHERE gameID = ? AND status = 'available'
            `;
            const [result] = await db.query(sql, [status, boardgame_id, user_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Transaction not found or already borrowed' });
            }

            res.status(200).json({ status: 'success', message: 'Transaction updated successfully' });
        } catch (error) {
            console.error('Error updating transaction status:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    async getStatus(req, res) {
        try {
            const gameId = req.params.gameId;

            const sql = `
                SELECT status
                FROM borrowreturn
            `;

            const [rows] = await db.query(sql);

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
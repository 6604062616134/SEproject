const db = require('../db');

const BoardgamesController = {
    async getAllBoardgames(req, res){
        try {
            const search = req.query.search || '';

            let sql = `SELECT * FROM boardgames`;

            if (search) {
                sql_count += ` WHERE name LIKE '%${search}%'`;
            }

            const [rows] = await db.query(sql);

            res.json({ data: rows, "status": "success" });

        } catch (error) {
            console.error('Error fetching boardgames:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async getBoardgameById(req, res){
        try {
            const id = req.params.id;

            const [rows] = await db.query('SELECT * FROM boardgames WHERE id = ?', id);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Boardgame not found', "status": "error" });
            } else {
                res.json({ data: rows[0], "status": "success" });
            }

        } catch (error) {
            console.error('Error fetching boardgame:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async createBoardgame(req, res){
        try {
            const { name } = req.body; //ต้องส่งจากหน้าบ้านมาเป็น object
            console.log(req.body);

            const sql = `INSERT INTO boardgames (name) VALUES (?)`;
            const [{ insertId }] = await db.query(sql, [name]);

            const [rows] = await db.query('SELECT * FROM boardgames WHERE id = ?', insertId); // ดึงข้อมูลที่เพิ่งสร้างขึ้นมา

            res.status(201).json({ data: rows[0], "status": "success" }); 
        } catch (error) {
            console.error('Error creating boardgame:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async updateBoardgame(req, res){
        try {
            const id = req.params.id;
            const { name } = req.body;

            //const modified = new Date();

            let update_array = [];
            let params = [];

            if (name) {
                update_array.push("name = ?");
                params.push(name);
            }

            params.push(id);

            const sql = `UPDATE boardgames SET ${update_array.join(', ')} WHERE id = ?`;

            await db.query(sql, params);

            const [rows] = await db.query('SELECT * FROM boardgames WHERE id = ?', id);

            res.json({ data: rows[0], "status": "success" });
        } catch (error) {
            console.error('Error updating boardgame:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async deleteBoardgame(req, res){
        try {
            const id = req.params.id;

            await db.query('DELETE FROM boardgames WHERE id = ?', id);

            res.json({ message: 'Boardgame deleted', "status": "success" });
        } catch (error) {
            console.error('Error deleting boardgame:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    }
}

module.exports = BoardgamesController;
    
const db = require('../db');

const CategoryController = {
    async getAllCategories(req, res){
        try {
            let sql = `SELECT * FROM category`;

            const [rows] = await db.query(sql);

            res.json({ data: rows, "status": "success" });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async getCategoryById(req, res){
        try {
            const id = req.params.id;

            const [rows] = await db.query('SELECT * FROM category WHERE id = ?', id);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Category not found', "status": "error" });
            } else {
                res.json({ data: rows[0], "status": "success" });
            }

        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async createCategory(req, res){
        try {
            const { name } = req.body;
            const created = new Date();
            const modified = new Date();

            const sql = `INSERT INTO category (name, createdDate, modifiedDate) VALUES (?, ?, ?)`;
            await db.query(sql, [name, created, modified]);

            res.status(201).json({ "status": "success" });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async updateCategory(req, res){
        try {
            const id = req.params.id;
            const { name } = req.body;
            const modified = new Date();

            let sql = `UPDATE category SET name = ?, modifiedDate = ? WHERE id = ?`;
            await db.query(sql, [name, modified, id]);

            res.json({ "status": "success" });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async deleteCategory(req, res){
        try {
            const id = req.params.id;

            const [rows] = await db.query('SELECT * FROM category WHERE id = ?', id);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Category not found', "status": "error" });
            } else {
                await db.query('DELETE FROM category WHERE id = ?', id);
                res.json({"status": "success"});
            }

        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    }

}

module.exports = CategoryController;
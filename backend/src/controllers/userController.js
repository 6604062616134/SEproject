const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserController = {
    async getAllUsers(req, res) {
        try {
            const limit = req.query.limit || 2;
            const page = req.query.page || 1;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';

            let sql_count = `SELECT COUNT(*) AS total FROM users`;
            if (search) {
                sql_count += ` WHERE name LIKE '%${search}%'`;
            }

            const [rows_count] = await db.query(sql_count);
            const total = rows_count[0].total;
            const total_pages = Math.ceil(total / limit);

            const sort = req.query.sort || 'name';
            const order = req.query.order || 'ASC';

            let sql = `SELECT * FROM users`;
            if (search) {
                sql += ` WHERE name LIKE '%${search}%'`;
            }
            sql += ` ORDER BY ${sort} ${order}`;
            sql += ` LIMIT ${limit} OFFSET ${offset}`;

            // console.log("sql_query-->>",sql);
            const [rows] = await db.query(sql);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'NO DATA' });
            }

            res.json({ rows, total, total_pages, page, "status": "success" });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async getUserById(req, res) {
        try {
            const id = req.params.id;

            // Optional: ตรวจสอบว่าผู้ใช้ที่ร้องขอเป็นเจ้าของข้อมูลเอง
            if (req.user.id !== parseInt(id)) {
                return res.status(403).json({ error: 'Forbidden', status: 'error' });
            }

            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', id);
            if (rows.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json({ data: rows[0], "status": "success" });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async createUser(req, res) {
        try {
            console.log(req.body);
            const { name, email, password, studentId } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const permission = 'user'; // กำหนดค่า permission เป็น 'user'
            const created = new Date();
            const modified = new Date();

            const sql_params = [name, email, hashedPassword, permission, created, modified, studentId];

            await db.query(`INSERT INTO users (name, email, password, permission, created, modified, studentId) VALUES (?, ?, ?, ?, ?, ?, ?)`, sql_params);

            res.status(201).json({ message: 'User created', status: 'success' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    },

    async updateUser(req, res) {
        try {
            console.log(req.params);
            const id = req.params.id;
            const modified = new Date();

            // if (!email || !password) {
            //     return res.status(400).json({ error: 'Invalid request' });
            // }

            let update_array = ["modified = ?"];
            let params = [modified];

            if (req.body.name) {
                update_array.push("name = ?");
                params.push(req.body.name);
            }

            if (req.body.email) {
                update_array.push("email = ?");
                params.push(req.body.email);
            }

            if (req.body.password) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                update_array.push("password = ?");
                params.push(hashedPassword);
            }

            let set_str = "";
            if (update_array.length > 0) {
                set_str = "SET " + update_array.join(", ");
            }

            let query = "UPDATE users " + set_str + " WHERE id = ?";
            params = params.concat([id]);

            await db.query(query, params);

            res.json({ message: 'User updated', "status": "success" });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async deleteUser(req, res) {
        const id = req.params.id;
        try {
            await db.query('DELETE FROM users WHERE id = ?', id);
            res.json({ message: 'User deleted', "status": "success" });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', email);

            console.log("rows-->>", rows);
            console.log("email-->>", email);
            console.log("password-->>", password);

            if (rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password or do not have an account' });
            }
            const user = rows[0]; // ข้อมูลผู้ใช้ที่เจอจากฐานข้อมูล
            const result = await bcrypt.compare(password, user.password);

            if (!result) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.id, email: user.email, permission: user.permission }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // ตั้งค่าคุกกี้เพื่อตอบกลับไปยังผู้ใช้
            res.cookie('auth_token', token, {
                httpOnly: true, // ป้องกันการเข้าถึงด้วย JavaScript
                sameSite: 'lax', // หรือ 'none' ถ้า frontend, backend อยู่คนละโดเมน (ต้องใช้ https)
                secure: process.env.NODE_ENV === 'production', // ใช้ secure=true เมื่อรันบน production
                maxAge: 86400000 // คุกกี้มีอายุ 24 ชั่วโมง (หน่วยเป็น ms) 24 * 60 * 60 * 1000 = 86400000
            });

            const data = {
                id: user.id,
                token: token,
                permission: user.permission
            };

            res.json({ data, "status": "success" });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error', "status": "error" });
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie('auth_token'); // ลบคุกกี้ที่ใช้ในการตรวจสอบสิทธิ์
            res.json({ message: 'Logout successful', status: 'success' });
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ error: 'Internal server error', status: 'error' });
        }
    }
};

module.exports = UserController;
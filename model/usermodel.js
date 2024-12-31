const pool = require('../config/database');
const { hashPassword } = require('../utils/passutil');


const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(200) NOT NULL,
                last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                invalid_attempts INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS permissions (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL
            );
        `);
        console.log('Tables created successfully');
        return true;
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

// const findAll = async () => {
//     try {
//         const result = await pool.query(`
//             SELECT u.id, u.username, u.last_login,u.password,
//                    json_agg(json_build_object('name', p.name)) as permissions
//             FROM users u
//             LEFT JOIN permissions p ON u.id = p.user_id
//             GROUP BY u.id, u.username, u.last_login
//         `);
        
//         console.log(result);
        
//         return result.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// const findById = async (id) => {
//     try {
//         const result = await pool.query(`
//             SELECT u.id, u.username, u.last_login,u.password,
//                    json_agg(json_build_object('name', p.name)) as permissions
//             FROM users u
//             LEFT JOIN permissions p ON u.id = p.user_id
//             WHERE u.id = $1
//             GROUP BY u.id, u.username, u.last_login
//         `, [id]);
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// const create = async (username, hashedPassword, permissions) => {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');

//         // Insert user
//         const userResult = await client.query(`
//             INSERT INTO users (username, password)
//             VALUES ($1, $2)
//             RETURNING id, username, last_login
//         `, [username, hashedPassword]);

//         const userId = userResult.rows[0].id;

//         // Insert permissions if any
//         if (permissions && permissions.length > 0) {
//             const permissionValues = permissions.map(p => `(${userId}, '${p.name}')`).join(',');
//             await client.query(`
//                 INSERT INTO permissions (user_id, name)
//                 VALUES ${permissionValues}
//             `);
//         }

//         await client.query('COMMIT');

//         // Return created user with permissions
//         const result = await client.query(`
//             SELECT u.id, u.username, u.last_login,u.password,
//                    json_agg(json_build_object('name', p.name)) as permissions
//             FROM users u
//             LEFT JOIN permissions p ON u.id = p.user_id
//             WHERE u.id = $1
//             GROUP BY u.id, u.username, u.last_login
//         `, [userId]);

//         return result.rows[0];
//     } catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//     } finally {
//         client.release();
//     }
// };

// const update = async (id, username, hashedPassword, permissions) => {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');

//         // Update user
//         const updateFields = ['username = $1'];
//         const values = [username];
//         let paramCount = 2;

//         if (hashedPassword) {
//             updateFields.push(`password = $${paramCount}`);
//             values.push(hashedPassword);
//             paramCount++;
//         }

//         values.push(id);
//         const userResult = await client.query(`
//             UPDATE users 
//             SET ${updateFields.join(', ')}
//             WHERE id = $${paramCount}
//             RETURNING id
//         `, values);

//         if (userResult.rows.length === 0) {
//             throw new Error('User not found');
//         }

//         // Update permissions
//         await client.query('DELETE FROM permissions WHERE user_id = $1', [id]);

//         if (permissions && permissions.length > 0) {
//             const permissionValues = permissions.map(p => `(${id}, '${p.name}')`).join(',');
//             await client.query(`
//                 INSERT INTO permissions (user_id, name)
//                 VALUES ${permissionValues}
//             `);
//         }

//         await client.query('COMMIT');

//         // Return updated user
//         const result = await client.query(`
//             SELECT u.id, u.username, u.last_login,
//                    json_agg(json_build_object('name', p.name)) as permissions
//             FROM users u
//             LEFT JOIN permissions p ON u.id = p.user_id
//             WHERE u.id = $1
//             GROUP BY u.id, u.username, u.last_login
//         `, [id]);

//         return result.rows[0];
//     } catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//     } finally {
//         client.release();
//     }
// };

// const remove = async (id) => {
//     try {
//         const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

module.exports = {
    createTables
    // findAll,
    // findById,
    // create,
    // update,
    // remove
};
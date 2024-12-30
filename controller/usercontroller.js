// controllers/userController.js
const UserService = require('../service/userService');
const { hashPassword, decryptPassword } = require('../utils/passutil');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.findAll();
        
        for (let user of users) {
            
            user.password = await decryptPassword(user.password); 
        }
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UserService.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
         user.password=await decryptPassword(user.password);
       
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createUser = async (req, res) => {
    const { username, password, permissions } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);
        
        const user = await UserService.create(username, hashedPassword.encryptedData, permissions);
        console.log(user);

        user.password=await decryptPassword(user.password);
       
        
        
        

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const { username, password, permissions } = req.body;
    try {
        const hashedPassword = password ? await hashPassword(password) : null;
        const user = await UserService.update(req.params.id, username, hashedPassword, permissions);
        res.json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await UserService.remove(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
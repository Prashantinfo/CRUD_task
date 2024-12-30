const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const { hashPassword, decryptPassword } = require('../utils/passutil');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
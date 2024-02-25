const express = require('express');
const { register, followUser, logout, updatePassword } = require('../controller/user');
const { login } = require('../controller/user');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/follow/:id').get(isAuthenticated,followUser)
router.route('/update/password').put(isAuthenticated,updatePassword)
router.route('/logout').get(isAuthenticated,logout)
module.exports = router;
const express = require('express');
const { register } = require('../controller/user');
const { login } = require('../controller/user');

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router;
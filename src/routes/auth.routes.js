const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const {validateProvider} = require('../middlewares/validator');
const router = express.Router();

router.post('/register', validateProvider, register);
router.post('/login', login);

module.exports = router;

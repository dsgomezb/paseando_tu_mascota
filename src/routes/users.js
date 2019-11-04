const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const datatable = require('datatables.net');
const jquery = require('jquery');
const NodeTable = require("nodetable");

//Ruta para listar todos los usuarios del sistema
router.get('/', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    res.render('users/list', {users});
});

//Ruta para crear nuevos usuarios en el sistema
router.get('/create', isLoggedIn, (req, res) => {
    res.render('users/create');
});

//Ruta para registrar un nuevo usuario en la base de datos
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/users',
    failureRedirect: '/create',
    failureFlash: true,
}));

module.exports = router;
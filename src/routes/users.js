const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');

//Ruta para listar todos los usuarios del sistema
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id;
    const users = await pool.query('SELECT * FROM users WHERE id != ?', [id_user]);
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

//Ruta para obtener los datos al detalle del usuario
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const data = users[0];
    res.json(data);
});

//Ruta para eliminar un usuario
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?',[id]);
    res.send('true');
});

module.exports = router;
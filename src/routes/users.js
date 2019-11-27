const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');


//Ruta para registrar un nuevo usuario del sistema desde un usuario admin
router.post('/register', isLoggedIn, async (req, res) => {
    let data = req.body;
    const { username, password, names, document, email, phone } = data;
    let status = 1;
    let created_at = new Date();
    const newUser = {
        username,
        password,
        names,
        document,
        email,
        phone,
        status,
        created_at
    };
    const username_result = await pool.query('SELECT username FROM users WHERE username = ?', [newUser.username]);
    const document_result = await pool.query('SELECT document FROM users WHERE document = ?', [newUser.document]);
    const email_result = await pool.query('SELECT email FROM users WHERE email = ?', [newUser.email]);
    
    if(document_result.length > 0){
        res.send('document');
    }else if(username_result.length > 0){
        res.send('username');
    }else if(email_result.length > 0){
        res.send('email');
    }else{
        newUser.password = await helpers.encryptPassword(password);
        await pool.query('INSERT INTO users SET ?', [newUser]);
        res.send(true);
    }
});

//Ruta para listar todos los usuarios del sistema
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id;
    const users = await pool.query('SELECT * FROM users WHERE id != ? ORDER BY created_at desc', [id_user]);
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

//Ruta para inactivar un usuario
router.get('/inactive/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let deleted_at = new Date();
    let status = 2;
    await pool.query('UPDATE users set status = ?, deleted_at = ? WHERE ID = ?',[status, deleted_at, id]);
    res.send('true');
});

//Ruta para activar un usuario
router.get('/active/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let deleted_at = null;
    let status = 1;
    await pool.query('UPDATE users set status = ?, deleted_at = ? WHERE ID = ?',[status, deleted_at, id]);
    res.send('true');
});

//Ruta para cargar la informacion del usuario en el formulario de edición
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = users[0];
    res.render('users/edit', {user});
});

//Ruta para actualizar un usuario existente en el sistema desde un usuario admin
router.post('/update', isLoggedIn, async (req, res) => {
    
    let data = req.body;
    const { username, password, names, document, email, phone, user_id } = data;

    let updated_at = new Date();
    const newUser = {
        username,
        password,
        names,
        document,
        email,
        phone,
        updated_at
    };
    
    const username_result = await pool.query('SELECT username FROM users WHERE username = ? and id != ?', [newUser.username, user_id]);
    const document_result = await pool.query('SELECT document FROM users WHERE document = ? and id != ?', [newUser.document, user_id]);
    const email_result = await pool.query('SELECT email FROM users WHERE email = ? and id != ?', [newUser.email, user_id]);
    const password_result = await pool.query('SELECT password FROM users WHERE id = ?', [user_id]);

    if(document_result.length > 0){
        res.send('document');
    }else if(username_result.length > 0){
        res.send('username');
    }else if(email_result.length > 0){
        res.send('email');
    }else{
        if(password != ''){
            newUser.password = await helpers.encryptPassword(password);
        }else{
            newUser.password = password_result[0].password;
        }
        await pool.query('UPDATE users SET ? WHERE id = ?', [newUser, user_id]);
        res.send(true);
    }
});
module.exports = router;
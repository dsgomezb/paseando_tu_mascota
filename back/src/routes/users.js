const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');


//Ruta para registrar un nuevo usuario del sistema desde un usuario admin
router.post('/register', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        let data = req.body;
        const { username, password, names, document, email, phone, id_profile } = data;

        let status_user = 1;
        let status_user_profile = 1;
        let created_at = new Date();
        const newUser = {
            username,
            password,
            names,
            document,
            email,
            phone,
            status_user,
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
            const query_user = await pool.query('INSERT INTO users SET ?', [newUser]);
            const id_user = query_user.insertId;
            const newPorfileUSer = {
                id_user,
                id_profile,
                status_user_profile
            };
            const query_user_profile = await pool.query('INSERT INTO user_profile SET ?', [newPorfileUSer]);
            if(query_user && query_user_profile){
                res.send(true);
            }else{
                res.send(false);
            }
        }
    }else{
        res.send(false);
    }
});

//Ruta para listar todos los usuarios del sistema
router.get('/', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const id_user = req.user.id_user;
        const users = await pool.query("SELECT * FROM users as u inner join user_profile as up on u.id_user = up.id_user inner join profile as p on p.id_profile = up.id_profile WHERE u.id_user != ? ORDER BY u.created_at desc", [id_user]);
        res.render('users/list', {users});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    } 
});

//Ruta para crear nuevos usuarios en el sistema
router.get('/create', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const profile = await pool.query('SELECT * FROM profile ORDER BY name_profile desc');
        res.render('users/create', {profile});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    }
});

//Ruta para registrar un nuevo usuario en la base de datos
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/users',
    failureRedirect: '/create',
    failureFlash: true,
}));

//Ruta para obtener los datos al detalle del usuario
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const { id } = req.params;
        const users = await pool.query('SELECT * FROM users as u inner join user_profile as up on u.id_user = up.id_user inner join profile as p on p.id_profile = up.id_profile WHERE u.id_user = ? ORDER BY u.created_at desc', [id]);
        const data = users[0];
        res.json(data);
    }else{
        const data = "";
        res.json(data);
    }
});

//Ruta para inactivar un usuario
router.get('/inactive/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const { id } = req.params;
        let deleted_at = new Date();
        let status_user = 2;
        const query_inactive = await pool.query('UPDATE users set status_user = ?, deleted_at = ? WHERE id_user = ?',[status_user, deleted_at, id]);
        if(query_inactive){
            res.send(true);
        }else{
            res.send(false);
        }
    }else{
        res.send(false);
    }
});

//Ruta para activar un usuario
router.get('/active/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const { id } = req.params;
        let deleted_at = null;
        let status_user = 1;
        const query_active = await pool.query('UPDATE users set status_user = ?, deleted_at = ? WHERE id_user = ?',[status_user, deleted_at, id]);
        if(query_active){
            res.send(true);
        }else{
            res.send(false);
        }
    }else{
        res.send(false);
    }
});

//Ruta para cargar la informacion del usuario en el formulario de edición
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        const { id } = req.params;
        const users = await pool.query('SELECT * FROM users as u inner join user_profile as up on u.id_user = up.id_user inner join profile as p on p.id_profile = up.id_profile WHERE u.id_user = ?', [id]);
        const userr = users[0];
        res.render('users/edit', {userr});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    }
});

//Ruta para actualizar un usuario existente en el sistema desde un usuario admin
router.post('/update', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 1){
        let data = req.body;
        const { password, names, document, email, phone, user_id } = data;

        let updated_at = new Date();
        const newUser = {
            password,
            names,
            document,
            email,
            phone,
            updated_at
        };
        
        const document_result = await pool.query('SELECT document FROM users WHERE document = ? and id_user != ?', [newUser.document, user_id]);
        const email_result = await pool.query('SELECT email FROM users WHERE email = ? and id_user != ?', [newUser.email, user_id]);
        const password_result = await pool.query('SELECT password FROM users WHERE id_user = ?', [user_id]);

        if(document_result.length > 0){
            res.send('document');
        }else if(email_result.length > 0){
            res.send('email');
        }else{
            if(password != ''){
                newUser.password = await helpers.encryptPassword(password);
            }else{
                newUser.password = password_result[0].password;
            }
            const query_user = await pool.query('UPDATE users SET ? WHERE id_user = ?', [newUser, user_id]);
            if(query_user){
                res.send(true);
            }else{
                res.send(false);
            }
        }
    }else{
        res.send(false);
    }
});

//Capturar id de usuario, consultar informacion de éste y enviarla al front para perfil
router.post('/api/get_info_user', async (req, res) => {
    const { user_id } = req.body;
    const rows = await pool.query('SELECT us.id_user as id_user, us.names, us.document, us.email, us.phone FROM users AS us INNER JOIN user_profile AS up ON us.id_user = up.id_user INNER JOIN profile AS pro ON pro.id_profile = up.id_profile WHERE us.id_user = ?', [user_id]);
    if(rows.length > 0){
        const user = rows[0];
        data = {
            "code": "0",
            "data": user
        };
    }else{
        data = {
            "code": "1",
            "error": "El usuario no existe"
        };
    }
    res.status(200).json(data);
});

//Actualizar información de usuario desde movil
router.post('/api/update_user_api', async (req, res) => {
    const { id_user, document, names, email, phone } = req.body;
    const update_user = await pool.query('UPDATE users SET names = ?, document = ?, email = ?, phone = ? WHERE id_user = ?', [names, document, email, phone, id_user]);
    if(update_user){
        data = {
            "code": "0",
            "message": "Usuario actualizado correctamente",
            "update": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al actualizar usuario"
        };
    }
    res.status(200).json(data);
});

//Capturar id de usuario, consultar direcciones que tiene asociadas y enviarlas al front para gestion de direcciones
router.post('/api/get_address_user', async (req, res) => {
    console.log(req.body);
    const { user_id } = req.body;
    const user_address = await pool.query('SELECT us_add.address_title as address_title, us_add.user_address as user_address, us_add.description_user_address as description_user_address, \
        us_add.id_user_address, mun.nombre_muni FROM users AS us INNER JOIN user_address AS us_add ON us.id_user = us_add.id_user\
        INNER JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us.id_user = ?', [user_id]);
    if(user_address.length > 0){
        data = {
            "code": "0",
            "data": user_address
        };
    }else{
        data = {
            "code": "1",
            "error": "El usuario no tiene direcciones asociadas"
        };
    }
    console.log(data);
    res.status(200).json(data);
});

module.exports = router;
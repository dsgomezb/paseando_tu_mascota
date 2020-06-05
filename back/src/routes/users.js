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
    const { user_id } = req.body;
    const user_address = await pool.query('SELECT us_add.address_title as address_title, us_add.user_address as user_address, us_add.description_user_address as description_user_address, \
        us_add.id_user_address, mun.nombre_muni FROM users AS us INNER JOIN user_address AS us_add ON us.id_user = us_add.id_user\
        INNER JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us.id_user = ?', [user_id]);
    data = {
        "code": "0",
        "data": user_address
    };
    res.status(200).json(data);
});

//Api para obtener los municipios de la base de datos
router.post('/api/get_states', async (req, res) => {
    const states = await pool.query("SELECT muni.id_muni, CONCAT(muni.nombre_muni,' - ',UPPER(depto.name_depto)) as nombre_muni \
    FROM municipios AS muni JOIN departamentos AS depto ON depto.id_depto = muni.id_depto ORDER BY depto.name_depto asc");
    if(states.length > 0){
        data = {
            "code": "0",
            "data": states
        };
    }else{
        data = {
            "code": "1",
            "error": "No existen municipios"
        };
    }
    res.status(200).json(data);
});

//Agregar nueva direccion de un usuario desde movil
router.post('/api/add_user_address', async (req, res) => {
    const { address_title, user_address, description_user_address, id_user } = req.body;
    var id_muni = req.body.id_muni.id_muni;
    const newUserAddress = {
        id_user,
        address_title,
        description_user_address,
        user_address,
        id_muni
    };
    const add_address = await pool.query('INSERT INTO user_address SET ?', [newUserAddress]);
    if(add_address){
        data = {
            "code": "0",
            "message": "Dirección guardada correctamente",
            "save": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al guardar la dirección"
        };
    }
    res.status(200).json(data);
});

//Eliminar direccion de un usuario
router.post('/api/delete_address_user', async (req, res) => {
    const { id_user_address } = req.body;
    const delete_address = await pool.query('DELETE FROM user_address WHERE id_user_address = ?', [id_user_address]);
    if(delete_address){
        data = {
            "code": "0",
            "message": "Dirección eliminada correctamente",
            "delete": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al eliminar la dirección"
        };
    }
    res.status(200).json(data);
});

//Capturar id de la direccion de un usuario para poderla editar desde la móvil
router.post('/api/get_address_data_edit', async (req, res) => {
    console.log("hola");
    const { id_user_address } = req.body;
    console.log("llega"+id_user_address);
    const rows = await pool.query('SELECT us_add.address_title as address_title, us_add.user_address as user_address, \
                us_add.description_user_address as description_user_address, us_add.id_user_address, \
                mun.id_muni, mun.nombre_muni FROM user_address AS us_add INNER JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us_add.id_user_address = ?', [id_user_address]);
    if(rows.length > 0){
        const address = rows[0];
        console.log(address);
        data = {
            "code": "0",
            "data": address
        };
    }else{
        data = {
            "code": "1",
            "error": "La dirección no existe"
        };
    }
    res.status(200).json(data);
});

//Actualizar una direccion de un usuario desde movil
router.post('/api/update_user_address', async (req, res) => {
    const { address_title, user_address, description_user_address, id_user } = req.body;
    var id_muni = req.body.id_muni.id_muni;
    var id_user_address = req.body.id_user_address;

    const update_address = await pool.query('UPDATE user_address SET address_title = ?, description_user_address = ?, \
        user_address = ?, id_muni = ? WHERE id_user_address = ?', [address_title, description_user_address, user_address, id_muni, id_user_address]);
    if(update_address){
        data = {
            "code": "0",
            "message": "Dirección actualizada correctamente",
            "save": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al editar la dirección"
        };
    }
    res.status(200).json(data);
});

module.exports = router;
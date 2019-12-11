const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');


//Ruta para listar todos los establecimientos del sistema
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const establecimientos = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN users AS usr ON usr.id_user = est_usr.id_user INNER JOIN municipios AS mun ON mun.id_muni = est.id_muni WHERE est_usr.id_user != ? ORDER BY est.created_at desc', [id_user]);
    res.render('establecimientos/list', {establecimientos});
});

//Ruta para obtener los municipios de un departamentos
router.get('/get_municipios/:id_depto', isLoggedIn, async (req, res) => {
    const { id_depto } = req.params;
    const municipios = await pool.query('SELECT * FROM municipios WHERE id_depto = ? ORDER BY nombre_muni', [id_depto]);
    const data = municipios;
    res.json(data);
});

//Ruta para crear nuevos establecimientos en el sistema
router.get('/create', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const users = await pool.query('SELECT * FROM users AS u INNER JOIN user_profile AS up ON u.id_user = up.id_user INNER JOIN profile AS p ON p.id_profile = up.id_profile WHERE u.id_user != ? ORDER BY u.created_at desc', [id_user]);
    const deptos = await pool.query('SELECT * FROM departamentos ORDER BY name_depto');
    res.render('establecimientos/create', {users, deptos});
});

//Ruta para registrar un nuevo establecimiento un usuario admin
router.post('/register', isLoggedIn, async (req, res) => {
    let data = req.body;
    const { name_establecimiento, direccion_establecimiento, telefono_establecimiento, id_muni, id_user} = data;

    let status_establecimiento = 1;
    let created_at = new Date();

    const newEstablecimiento = {
        name_establecimiento,
        direccion_establecimiento,
        telefono_establecimiento,
        id_muni,
        status_establecimiento,
        created_at
    };

    const name_establecimiento_result = await pool.query('SELECT name_establecimiento FROM establecimiento WHERE name_establecimiento = ?', [newEstablecimiento.name_establecimiento]);
    const direccion_establecimiento_result = await pool.query('SELECT direccion_establecimiento FROM establecimiento WHERE direccion_establecimiento = ?', [newEstablecimiento.direccion_establecimiento]);

    if(name_establecimiento_result.length > 0){
        res.send('name_establecimiento');
    }else if(direccion_establecimiento_result.length > 0){
        res.send('direccion_establecimiento');
    }else{
        const query_user = await pool.query('INSERT INTO establecimiento SET ?', [newEstablecimiento]);
        const id_establecimiento = query_user.insertId; 
        const newUserEst = {
            id_establecimiento,
            id_user,
        };
        await pool.query('INSERT INTO establecimiento_user SET ?', [newUserEst]);
        res.send(true);
    }
});

//Ruta para obtener los datos al detalle del establecimiento
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const establecimiento = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN municipios AS muni ON muni.id_muni = est.id_muni INNER JOIN departamentos AS depto ON depto.id_depto = muni.id_depto INNER JOIN users AS usr ON usr.id_user = est_usr.id_user WHERE est.id_establecimiento = ? ORDER BY est.created_at desc', [id]);
    const data = establecimiento[0];
    res.json(data);
});

module.exports = router;
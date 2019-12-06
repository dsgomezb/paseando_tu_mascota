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

//Ruta para crear nuevos establecimientos en el sistema
router.get('/create', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const users = await pool.query('SELECT * FROM users AS u INNER JOIN user_profile AS up ON u.id_user = up.id_user INNER JOIN profile AS p ON p.id_profile = up.id_profile WHERE u.id_user != ? ORDER BY u.created_at desc', [id_user]);
    const deptos = await pool.query('SELECT * FROM departamentos ORDER BY name_depto');
    res.render('establecimientos/create', {users, deptos});
});

//Ruta para obtener los municipios de un departamentos
router.get('/get_municipios/:id_depto', isLoggedIn, async (req, res) => {
    const { id_depto } = req.params;
    const municipios = await pool.query('SELECT * FROM municipios WHERE id_depto = ? ORDER BY nombre_muni', [id_depto]);
    const data = municipios;
    res.json(data);
});

module.exports = router;
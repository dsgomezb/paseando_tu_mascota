const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

//Ruta para listar todos los productos
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    //const id_profile_user = req.user.id_profile;
    var  products = await pool.query('SELECT * FROM product AS pro INNER JOIN establecimiento AS est ON est.id_establecimiento = pro.id_establecimiento INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN users AS usr ON usr.id_user = est_usr.id_user INNER JOIN municipios AS mun ON mun.id_muni = est.id_muni WHERE est_usr.id_user != ? ORDER BY est.created_at desc', [id_user]);
    console.log(products);
    res.render('products/list', {products});
});

//Ruta para crear nuevos productos
router.get('/create', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const category_product = await pool.query('SELECT * FROM category_product ORDER BY name_category_product desc');
    const presentation_product = await pool.query('SELECT * FROM presentation_product ORDER BY name_presentation_product');
    const establecimientos = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN users AS usr ON usr.id_user = est_usr.id_user INNER JOIN municipios AS mun ON mun.id_muni = est.id_muni WHERE est_usr.id_user = ? ORDER BY est.created_at desc', [id_user]);
    res.render('products/create', {category_product, presentation_product, establecimientos});
});

module.exports = router;
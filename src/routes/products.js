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
    res.render('products/list', {products});
});

//Ruta para crear nuevos productos
router.get('/create', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const category_product = await pool.query('SELECT * FROM category_product WHERE status_category_product = 3 ORDER BY name_category_product desc');
    const presentation_product = await pool.query('SELECT * FROM presentation_product WHERE status_presentation_product = 3 ORDER BY name_presentation_product');
    const establecimientos = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN users AS usr ON usr.id_user = est_usr.id_user INNER JOIN municipios AS mun ON mun.id_muni = est.id_muni WHERE est_usr.id_user = ? ORDER BY est.created_at desc', [id_user]);
    res.render('products/create', {category_product, presentation_product, establecimientos});
});

//Ruta para registrar una nueva categoria de un producto
router.post('/register_category_product', isLoggedIn, async (req, res) => {
    let data = req.body;
    const { name_category_product, status_category_product} = data;
    const newCategoryProduct = {
        name_category_product,
        status_category_product
    };
    const name_category_product_result = await pool.query('SELECT name_category_product FROM category_product WHERE name_category_product = ?', [newCategoryProduct.name_category_product]);

    if(name_category_product_result.length > 0){
        res.send('name_category_product');
    }else{
        const query_category_product = await pool.query('INSERT INTO category_product SET ?', [newCategoryProduct]);
        if(query_category_product){
            res.send(true);
        }else{
            res.send(false);
        }
    }
});

//Ruta para registrar una nueva presentacion de un producto
router.post('/register_presentation_product', isLoggedIn, async (req, res) => {
    let data = req.body;
    const { name_presentation_product, status_presentation_product} = data;
    const newPresentationProduct = {
        name_presentation_product,
        status_presentation_product
    };
    const name_presentation_product_result = await pool.query('SELECT name_presentation_product FROM presentation_product WHERE name_presentation_product = ?', [newPresentationProduct.name_presentation_product]);

    if(name_presentation_product_result.length > 0){
        res.send('name_presentation_product');
    }else{
        const query_presentation_product = await pool.query('INSERT INTO presentation_product SET ?', [newPresentationProduct]);
        if(query_presentation_product){
            res.send(true);
        }else{
            res.send(false);
        }
    }
});

module.exports = router;
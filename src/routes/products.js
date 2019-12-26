const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const fileUpload = require('express-fileupload')
const es = require('../lib/lang/es');

const multer = require("multer");


//Ruta para registrar un nuevo producto
router.post('/register_product', async (req, res) => {
    let data = req.body;

    let created_at = new Date();
    const { name_product, id_establecimiento, description_product, internal_code_product, id_category_product, id_presentation_product, unitary_value_product, iva_product, status_product} = data;
    console.log(unitary_value_product);
    console.log(iva_product);
    let value_iva_product = (unitary_value_product*iva_product)/100; 
    value_iva_product = parseFloat(unitary_value_product)+parseFloat(value_iva_product);
    const newProduct = {
        name_product,
        id_establecimiento,
        description_product,
        internal_code_product,
        id_category_product,
        id_presentation_product,
        unitary_value_product,
        iva_product,
        value_iva_product,
        status_product,
        created_at
    };

    console.log(value_iva_product);

    const name_product_result = await pool.query('SELECT name_product FROM product WHERE name_product = ? AND id_establecimiento = ?', [newProduct.name_product, newProduct.id_establecimiento]);
    const internal_code_product_result = await pool.query('SELECT internal_code_product FROM product WHERE internal_code_product = ? AND id_establecimiento = ?', [newProduct.internal_code_product, newProduct.id_establecimiento]);

    if(name_product_result.length > 0){
        return res.send('name_product');
    }else if(internal_code_product_result.length > 0){
        return res.send('internal_code_product');
    }else{
        let image_url_product = null;
        if(req.files != null){
            let image = req.files.image_product;
            let extension = req.body.fileExtension;
            let internal_code = data.internal_code_product;
            image_url_product = es.constant.ruta_local + 'imagen' + internal_code + "-" + Date.now() + '.' + extension;
            await image.mv(image_url_product);
        }
        newProduct.image_url_product = image_url_product;
        const query_presentation_product = await pool.query('INSERT INTO product SET ?', [newProduct]);
        if(query_presentation_product){
            return res.send(true);
        }else{
            return res.send(false);
        }
    }
    return res.send(false);

});

//Ruta para listar todos los productos
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    //const id_profile_user = req.user.id_profile;
    var products = await pool.query('SELECT * FROM product AS pro INNER JOIN establecimiento AS est ON est.id_establecimiento = pro.id_establecimiento INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN users AS usr ON usr.id_user = est_usr.id_user INNER JOIN municipios AS mun ON mun.id_muni = est.id_muni WHERE est_usr.id_user = ? ORDER BY est.created_at desc', [id_user]);
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
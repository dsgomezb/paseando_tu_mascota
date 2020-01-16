const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const es = require('../lib/lang/es');

//Ruta para listar todos los pedidos de un establecimiento
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    const id_profile_user = req.user.id_profile;
    var orders = {};
    if(id_profile_user == '1'){
        orders = await pool.query('SELECT * FROM master_order AS mas_ord INNER JOIN establecimiento AS est ON est.id_establecimiento = mas_ord.id_establecimiento INNER JOIN order_status AS ord_sta ON ord_sta.id_order_status = mas_ord.id_order_status INNER JOIN user_address AS usr_add ON usr_add.id_user_address = mas_ord.id_user_address INNER JOIN users AS usu ON usu.id_user = usr_add.id_user ORDER BY est.created_at desc');
    }else if(id_profile_user == '2'){
        orders = await pool.query('SELECT * FROM master_order AS mas_ord INNER JOIN establecimiento AS est ON est.id_establecimiento = mas_ord.id_establecimiento INNER JOIN order_status AS ord_sta ON ord_sta.id_order_status = mas_ord.id_order_status INNER JOIN user_address AS usr_add ON usr_add.id_user_address = mas_ord.id_user_address INNER JOIN users AS usu ON usu.id_user = usr_add.id_user INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ? ORDER BY est.created_at desc', [id_user]);
    }
    res.render('orders/list', {orders});
});

//Ruta para obtener los datos al detalle del pedido
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const order_master = await pool.query("SELECT * FROM master_order AS mas_ord INNER JOIN establecimiento AS est ON est.id_establecimiento = mas_ord.id_establecimiento INNER JOIN order_status AS ord_sta ON ord_sta.id_order_status = mas_ord.id_order_status INNER JOIN user_address AS usr_add ON usr_add.id_user_address = mas_ord.id_user_address INNER JOIN users AS usu ON usu.id_user = usr_add.id_user WHERE mas_ord.id_master_order = ? ORDER BY est.created_at desc", [id]);
    const order = await pool.query("SELECT * FROM master_order AS mas_ord INNER JOIN detail_order AS det_ord ON det_ord.id_master_order = mas_ord.id_master_order INNER JOIN establecimiento AS est ON est.id_establecimiento = mas_ord.id_establecimiento INNER JOIN order_status AS ord_sta ON ord_sta.id_order_status = mas_ord.id_order_status INNER JOIN user_address AS usr_add ON usr_add.id_user_address = mas_ord.id_user_address INNER JOIN product AS pro ON pro.id_product = det_ord.id_product INNER JOIN presentation_product AS pre_pro ON pre_pro.id_presentation_product = pro.id_presentation_product INNER JOIN category_product AS cat_pro ON cat_pro.id_category_product = pro.id_category_product INNER JOIN users AS usu ON usu.id_user = usr_add.id_user WHERE mas_ord.id_master_order = ? ORDER BY est.created_at desc", [id]);
    res.json({order_master: order_master, order: order});
});

//Ruta para obtener los estados de un pedido
router.get('/status_params/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const actually_status_order = await pool.query("SELECT * FROM master_order AS mast INNER JOIN order_status AS ord ON ord.id_order_status = mast.id_order_status WHERE mast.id_master_order = ?",[id]);
    console.log(actually_status_order);
    const order_status = await pool.query("SELECT * FROM order_status WHERE id_order_status != ?", [actually_status_order[0].id_order_status]);
    res.json({order_status, id});
});



//Ruta para cambiar el estado de un pedido
router.post('/chenge_status_order', isLoggedIn, async (req, res) => {
    let data = req.body;
    const {status_order, id_master_order_modal} = data;
    console.log(data);
    const query_status_result = await pool.query('UPDATE master_order SET id_order_status = ? WHERE id_master_order = ?', [status_order, id_master_order_modal]);
    if(query_status_result){
        res.send(true);
    }else{
        res.send(false);
    }
});

module.exports = router;
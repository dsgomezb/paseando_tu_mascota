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

module.exports = router;
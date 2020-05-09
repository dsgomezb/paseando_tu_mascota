const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const functions = require('../lib/functions');
const jwt = require('jsonwebtoken');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })(req, res, next);
});

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/profile/edit', isLoggedIn, (req, res) => {
    res.render('profile/edit');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/signin');
});

//Ruta api para autenticar usuarios desde la móvil
router.post('/api/signin', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    let status_active = 1;
    const rows = await pool.query('SELECT * FROM users AS us INNER JOIN user_profile AS up ON us.id_user = up.id_user INNER JOIN profile AS pro ON pro.id_profile = up.id_profile WHERE us.username = ? and us.status_user = ?', [username, status_active]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            const token = jwt.sign({_id: user.id_user}, 'secretkey');
            const token_final= 'Bearer '+token;
            data = {
                "exito": "El usuario existe",
                "token": token_final,
                "code": "0"
            };
        }else{
            data = {
                "error": "Contraseña invalida",
                "code": "1"
            };
        }
    }else{
        data = {
            "error": "Usuario invalido o inactivo",
            "code": "2"
        };
    }
    res.status(200).json(data);
});

router.post('/api/prueba', functions.verifyToken, async (req, res) => {
    res.json({"caco": "uno", "mari": "209"});
});

router.post('/api/prueba_free', async (req, res) => {
    res.json({"mateo": "gayyy", "pruab": "aaaa"});
});

module.exports = router;
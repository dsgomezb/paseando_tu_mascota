const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let status_active = 1;
    const rows = await pool.query('SELECT * FROM users AS us INNER JOIN user_profile AS up ON us.id_user = up.id_user INNER JOIN profile AS pro ON pro.id_profile = up.id_profile WHERE us.username = ? and us.status_user = ?', [username, status_active]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('exito', 'Bienvenido ' + user.username));
        }else{
            done(null, false, req.flash('message', 'Contraseña invalida'));
        }
    }else{
        return done(null, false, req.flash('message','Usuario invalido o inactivo'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { names, document, email, phone } = req.body;
    let status_user = 1;
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
    const usernam = newUser.username;
    const username_result = await pool.query('SELECT * FROM users WHERE username = ?', [usernam]);
    if(username_result.length == 0){
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        newUser.id = result.insertId;
        req.flash('exito', 'Usuario creado correctamente');
        return done(null, newUser);
    }else{
        return done(null, false, req.flash('message','No se puede crear el usuario'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users AS us INNER JOIN user_profile AS up ON us.id_user = up.id_user INNER JOIN profile AS pro ON pro.id_profile = up.id_profile WHERE us.id_user = ?', [id]);
    done(null, rows[0]);
});
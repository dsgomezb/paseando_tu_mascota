const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');
const lang = require('./lib/lang/es');
var favicon = require('serve-favicon');

//Inicializaciones
const app = express();
require('./lib/passport');

//configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(favicon(path.join(__dirname, 'public/img/images_logo', 'favicon.png')))

//Middlewars
app.use(session({
    secret: 'clavesesion',
    resave: false,
    saveUninitialized: false,
    store:  new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
    app.locals.exito = req.flash('exito');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    app.locals.lang = lang;
    next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/establecimientos', require('./routes/establecimientos'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));


//Public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));

//Starting the server
app.listen(app.get('port'), () => {
    console.log('server port: '+app.get('port'));
});

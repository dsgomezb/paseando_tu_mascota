const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../lib/auth');

/* router.get('/',isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
}); */
router.get('/', (req, res) => {
    res.send('Test');
});
module.exports = router;
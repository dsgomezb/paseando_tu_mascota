module.exports = {
    isLoggedIn(req, res, next){
        //Devuelve true si el usuario esta autenticado
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    }
};
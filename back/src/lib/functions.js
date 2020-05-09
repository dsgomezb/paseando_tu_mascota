const jwt = require('jsonwebtoken');

// Metodo para validar un token que viene desde sistema externo (movil)
function verifyToken(req, res, next) {
    if(!req.headers.authorization){
        res.status(401).json({"error": "No autorizado"});
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token == null){
        res.status(401).json({"error": "No autorizado"});
    }
    jwt.verify(token, 'secretkey', function(err, decoded) {
        if (err) {
            res.status(401).json({"error": "Token invalido"});
        }else{
            req.userId = decoded._id;
            console.log(req.userId);
            next();
        }
    });
}

module.exports = {
    verifyToken
}
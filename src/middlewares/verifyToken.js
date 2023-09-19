const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {

    const token = req.header('Authorization');
    const secret = process.env.JWT_SECRET;

    if (!token) {
        res.status(401).json({message: 'Acesso negado!'});
    } else {
        try {
            req.user = jwt.verify(token, secret);
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({message: 'Token JWT inválido'});
            } else {
                res.status(500).json({message: 'Erro interno do servidor'});
            }
        }
    }
}

module.exports = verifyToken;
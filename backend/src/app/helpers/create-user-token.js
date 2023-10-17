const jwt = require('jsonwebtoken');

const createUserToken = (user, req, res) => {
    // cria o token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, "tccpostos");

    // retorna o token
    res.status(200).json({
        message: 'Você está autenticado',
        token,
        userId: user._id,
    });
}

module.exports = createUserToken;
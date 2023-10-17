const jwt = require('jsonwebtoken');

const User = require('../models/User');

// busca o usuário pelo token JWT
const getUserByToken = async (token) => {
    if (!token) { return resizeBy.status(401).json({message: 'Acesso negado!'}); }

    const decoded = jwt.verify(token, 'tccpostos');
    
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId });

    return user;
}

module.exports = getUserByToken;
const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Acesso negado.');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, senhaHash);

        const verificarUsuario = await knex('usuarios').where({ id }).first();

        if (!verificarUsuario) {
            return res.status(404).json('Usuário não foi encontrado');
        }

        const { senha, ...usuario } = verificarUsuario;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = verificarLogin;
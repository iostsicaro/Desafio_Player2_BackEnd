const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario) {
            return res.status(404).json('Email ou senha inválidos.');
        }

        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(404).json('Email ou senha inválidos.');
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            email: usuario.email
        };

        const token = jwt.sign(dadosTokenUsuario, senhaHash, { expiresIn: '3h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    login
};
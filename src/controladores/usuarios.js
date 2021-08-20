const knex = require('../conexao');
const bcrypt = require('bcrypt');
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        await schemaCadastroUsuario.validate(req.body);

        const verificarEmail = await knex('usuarios').where({ email }).first();

        if (verificarEmail) {
            return res.status(404).json('Email informado já existe.');
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada });

        if (!usuario) {
            return res.status(404).json('Não foi possível concluir cadastro.');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = cadastrarUsuario;
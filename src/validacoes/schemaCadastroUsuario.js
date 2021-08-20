const yup = require('./configuracao');

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required('Campo nome é obrigatório.'),
    email: yup.string().required('Campo email é obrigatório.').email(),
    senha: yup.string().required().min(5),
});

module.exports = schemaCadastroUsuario;
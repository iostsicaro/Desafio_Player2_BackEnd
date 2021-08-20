const yup = require('./configuracao');

const schemaCadastroEmpresa = yup.object().shape({
    cnpj: yup.string().required('Campo CNPJ é obrigatório.'),
});

module.exports = schemaCadastroEmpresa;
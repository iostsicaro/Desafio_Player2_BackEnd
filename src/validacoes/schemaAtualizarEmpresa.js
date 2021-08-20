const yup = require('./configuracao');

const schemaAtualizarEmpresa = yup.object().shape({
    razao_social: yup.string().required('Campo razão social é obrigatório.'),
    nome_fantasia: yup.string().required('Campo nome fantasia é obrigatório.'),
    situacao_cadastral:yup.number().required('Campo situação cadastral é obrigatório.'),
    data_situacao_cadastral: yup.string().required('Campo data situação cadastral, é obrigatório.'),
    codigo_juridico: yup.number().required('Campo código jurídico é obrigatório.'),
    inicio_atividade: yup.string().required('Campo início atividade é obrigatório.'),
    cnae_fiscal: yup.number().required('Campo CNAE fiscal é obrigatório.'),
    descricao_cnae: yup.string().required('Campo descrição CNAE é obrigatório.'),
    tipo_logradouro: yup.string().required('Campo tipo logradouro é obrigatório.'),
    logradouro: yup.string().required('Campo logradouro é obrigatório.'),
    numero: yup.number().required('Campo número é obrigatório.'), 
    complemento: yup.string(), 
    bairro: yup.string().required('Campo bairro é obrigatório.'), 
    cep: yup.string().required('Campo CEP é obrigatório.'), 
    uf: yup.string().required('Campo UF é obrigatório.'), 
    municipio: yup.string().required('Campo município é obrigatório.'), 
    codigo_municipio: yup.number().required('Campo código município é obrigatório.'),
    ddd_telefone: yup.string().required('Campo telefone é obrigatório.'), 
    telefone_opcional: yup.string().required('Campo telefone opcional é obrigatório.'),
    ddd_fax: yup.string().required('Campo fax é obrigatório.')
});

module.exports = schemaAtualizarEmpresa
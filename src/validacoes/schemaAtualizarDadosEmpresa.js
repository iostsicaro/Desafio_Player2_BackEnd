const yup = require('./configuracao');

const schemaAtualizarDadosEmpresa = yup.object().shape({
    razao_social: yup.string(),
    nome_fantasia: yup.string(),
    situacao_cadastral: yup.number(),
    data_situacao_cadastral: yup.string(),
    codigo_juridico: yup.number(),
    inicio_atividade: yup.string(),
    cnae_fiscal: yup.number(),
    descricao_cnae: yup.string(),
    tipo_logradouro: yup.string(),
    logradouro: yup.string(),
    numero: yup.number(),
    complemento: yup.string(),
    bairro: yup.string(),
    cep: yup.number(),
    uf: yup.string(),
    municipio: yup.string(),
    codigo_municipio: yup.number(),
    ddd_telefone: yup.string(), 
    telefone_opcional: yup.string(),
    ddd_fax: yup.string()
});

module.exports = schemaAtualizarDadosEmpresa;
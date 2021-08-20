const knex = require('../conexao');
const instanciaAxios = require("../servicos/brasilApi");
const schemaAtualizarDadosEmpresa = require('../validacoes/schemaAtualizarDadosEmpresa');
const schemaAtualizarEmpresa = require('../validacoes/schemaAtualizarEmpresa');
const schemaCadastroEmpresa = require('../validacoes/schemaCadastroEmpresa');

const listarEmpresas = async (req, res) => {
    const { usuario } = req;

    try {
        const empresas = await knex('empresas').join('endereco', 'empresas.id', '=', 'endereco.empresa_id').join('telefones', 'empresas.id', '=', 'telefones.empresa_id').select('*').where({ usuario_id: usuario.id });

        if (empresas.length === 0) {
            return res.status(404).json('Não foram encontradas empresas cadastradas.');
        }

        for (const empresa of empresas) {
            const socio = await knex('socios').where({ empresa_id: empresa.id }).select('*')

            empresa.socios = socio;
        }

        return res.status(200).json(empresas);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const empresas = await knex('empresas').join('endereco', 'empresas.id', '=', 'endereco.empresa_id').join('telefones', 'empresas.id', '=', 'telefones.empresa_id').select('*').where('telefones.empresa_id', '=', `${id}`);

        if (empresas.length === 0) {
            return res.status(404).json('Não foram encontradas empresas cadastradas.');
        }

        for (const empresa of empresas) {
            const socio = await knex('socios').where({ empresa_id: empresa.id }).select('*')

            empresa.socios = socio;
        }

        return res.status(200).json(empresas);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarEmpresa = async (req, res) => {
    const { usuario } = req;
    const { cnpj } = req.body;

    try {
        await schemaCadastroEmpresa.validate(req.body);

        const { data } = await instanciaAxios.get(`api/cnpj/v1/${cnpj}`);

        if (!data) {
            return res.status(404).json('Empresa não possui cadastro.');
        }

        const cadastrarEmpresa = await knex('empresas').insert({ cnpj, usuario_id: usuario.id, razao_social: data.razao_social, nome_fantasia: data.nome_fantasia, situacao_cadastral: data.situacao_cadastral, data_situacao_cadastral: data.data_situacao_cadastral, codigo_juridico: data.codigo_natureza_juridica, inicio_atividade: data.data_inicio_atividade, cnae_fiscal: data.cnae_fiscal, descricao_cnae: data.cnae_fiscal_descricao });

        if (!cadastrarEmpresa) {
            return res.status(404).json('Cadastro não foi conclúido.');
        }

        const cadastrarEndereco = await knex('endereco').insert({ empresa_id: cadastrarEmpresa[0], tipo_logradouro: data.descricao_tipo_logradouro, logradouro: data.logradouro, numero: data.numero, complemento: data.complemento, bairro: data.bairro, cep: data.cep, uf: data.uf, municipio: data.municipio, codigo_municipio: data.codigo_municipio });

        if (!cadastrarEndereco) {
            return res.status(404).json('Cadastro não foi conclúido.');
        }

        const cadastrarTelefone = await knex('telefones').insert({ empresa_id: cadastrarEmpresa[0], ddd_telefone: data.ddd_telefone_1, telefone_opcional: data.ddd_telefone_2, ddd_fax: data.ddd_fax });

        if (!cadastrarTelefone) {
            return res.status(404).json('Cadastro não foi conclúido.');
        }

        const { qsa } = data;

        qsa.forEach(async socio => {
            const cadastrarSocios = await knex('socios').insert({ empresa_id: cadastrarEmpresa[0], cnpj: socio.cnpj, nome_socio: socio.nome_socio, cnpj_cpf_do_socio: socio.cnpj_cpf_do_socio, data_entrada_sociedade: socio.data_entrada_sociedade, percentual_capital_social: socio.percentual_capital_social });

            if (!cadastrarSocios) {
                return res.status(404).json('Cadastro não foi conclúido.');
            }
        });

        return res.status(200).json('Empresa cadastrada com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarDadosEmpresa = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { razao_social, nome_fantasia, situacao_cadastral, data_situacao_cadastral, codigo_juridico, inicio_atividade, cnae_fiscal, descricao_cnae } = req.body;
    const { tipo_logradouro, logradouro, numero, complemento, bairro, cep, uf, municipio, codigo_municipio } = req.body;
    const { ddd_telefone, telefone_opcional, ddd_fax } = req.body;

    try {
        await schemaAtualizarDadosEmpresa.validate(req.body);

        if (req.body === {} || !req.body) {
            return res.status(404).json('É necessário atualizar pelo menos um campo.');
        }

        if (razao_social || nome_fantasia || situacao_cadastral || data_situacao_cadastral || codigo_juridico || inicio_atividade || cnae_fiscal || descricao_cnae) {
            const atualizarEmpresa = await knex('empresas').update({ razao_social, nome_fantasia, situacao_cadastral, data_situacao_cadastral, codigo_juridico, inicio_atividade, cnae_fiscal, descricao_cnae }).where({ id, usuario_id: usuario.id });

            if (!atualizarEmpresa) {
                return res.status(404).json('Não foi possível concluir atualização.');
            }
        }

        if (tipo_logradouro || logradouro || numero || complemento || bairro || cep || uf || municipio || codigo_municipio) {
            const atualizarEndereco = await knex('endereco').update({ tipo_logradouro, logradouro, numero, complemento, bairro, cep, uf, municipio, codigo_municipio }).where({ empresa_id: id });

            if (!atualizarEndereco) {
                return res.status(404).json('Não foi possível concluir atualização.');
            }
        }

        if (ddd_telefone || telefone_opcional || ddd_fax) {
            const atualizarTelefone = await knex('telefones').update({ ddd_telefone, telefone_opcional, ddd_fax }).where({ empresa_id: id });

            if (!atualizarTelefone) {
                return res.status(404).json('Não foi possível concluir atualização.');
            }
        }

        return res.status(200).json('Atualização concluída.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarEmpresa = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { razao_social, nome_fantasia, situacao_cadastral, data_situacao_cadastral, codigo_juridico, inicio_atividade, cnae_fiscal, descricao_cnae } = req.body;
    const { tipo_logradouro, logradouro, numero, complemento, bairro, cep, uf, municipio, codigo_municipio } = req.body;
    const { ddd_telefone, telefone_opcional, ddd_fax } = req.body;

    try {
        await schemaAtualizarEmpresa.validate(req.body);

        const atualizarEmpresa = await knex('empresas').update({ razao_social, nome_fantasia, situacao_cadastral, data_situacao_cadastral, codigo_juridico, inicio_atividade, cnae_fiscal, descricao_cnae }).where({ id, usuario_id: usuario.id });

        if (!atualizarEmpresa) {
            return res.status(404).json('Não foi possível concluir atualização.');
        }

        const atualizarEndereco = await knex('endereco').update({ tipo_logradouro, logradouro, numero, complemento, bairro, cep, uf, municipio, codigo_municipio }).where({ empresa_id: id });

        if (!atualizarEndereco) {
            return res.status(404).json('Não foi possível concluir atualização.');
        }

        const atualizarTelefone = await knex('telefones').update({ ddd_telefone, telefone_opcional, ddd_fax }).where({ empresa_id: id });

        if (!atualizarTelefone) {
            return res.status(404).json('Não foi possível concluir atualização.');
        }

        return res.status(200).json('Atualização concluída.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const verificarEmpresa = await knex('empresas').where({ id }).first();

        if (!verificarEmpresa) {
            return res.status(404).json('Não foi possível excluir empresa.');
        }

        const excluirEndereco = await knex('endereco').delete().where({ empresa_id: id });

        if (!excluirEndereco) {
            return res.status(404).json('Não foi possível excluir endereco.');
        }

        const excluirTelefone = await knex('telefone').delete().where({ empresa_id: id });

        if (!excluirTelefone) {
            return res.status(404).json('Não foi possível excluir empresa.');
        }

        const excluirSocios = await knex('socios').delete().where({ empresa_id: id });

        if (!excluirSocios) {
            return res.status(404).json('Não foi possível excluir empresa.');
        }

        const excluirEmpresa = await knex('empresas').delete().where({ id });

        if (!excluirEmpresa) {
            return res.status(404).json('Não foi possível excluir empresa.');
        }

        return res.status(200).json('Empresa excluida com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarEmpresas,
    obterEmpresa,
    cadastrarEmpresa,
    atualizarDadosEmpresa,
    atualizarEmpresa,
    excluirEmpresa
};
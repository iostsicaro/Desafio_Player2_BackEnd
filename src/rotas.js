const express = require('express');
const cadastrarUsuario = require('./controladores/usuarios');
const { login } = require('./controladores/login');
const verificarLogin = require('./filtros/verificarLogin');
const { listarEmpresas, obterEmpresa, cadastrarEmpresa, atualizarEmpresa, atualizarDadosEmpresa, excluirEmpresa } = require('./controladores/empresas');
const rotas = express();

// ENDPOINT DE CADASTRO DO USUÁRIO
rotas.post('/usuarios', cadastrarUsuario);

// ENDPOINT DE LOGIN DO USUÁRIO
rotas.post('/login', login)

// MIDDLEWARE QUE VERIFICA LOGIN
rotas.use(verificarLogin);

// ENDPOINTS PARA LISTAGEM, CADASTRO, ATUALIZAÇÃO E EXCLUSÃO DE DADOS CADASTRADOS DAS EMPRESAS NO BD
rotas.get('/empresas', listarEmpresas);
rotas.get('/empresas/:id', obterEmpresa);
rotas.post('/empresas', cadastrarEmpresa);
rotas.put('/empresas/:id', atualizarEmpresa);
rotas.patch('/empresa/:id', atualizarDadosEmpresa);
rotas.delete('/empresas/:id', excluirEmpresa);

module.exports = rotas;
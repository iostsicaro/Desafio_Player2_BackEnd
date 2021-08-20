const axios = require('axios');

const instanciaAxios = axios.create({
    baseURL: 'https://brasilapi.com.br/',
});

module.exports = instanciaAxios;
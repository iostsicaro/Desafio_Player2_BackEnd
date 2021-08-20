// CRIAÇÃO DO BANCO DE DADOS
CREATE DATABASE desafio_player;

USE desafio_player;

// CRIAÇÃO DAS TABELAS DO BANCO
DROP TABLE usuarios;

CREATE TABLE usuarios(
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(40) NOT NULL,
  email varchar(50) NOT NULL,
  senha text NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE empresas;

CREATE TABLE empresas(
  id int NOT NULL AUTO_INCREMENT,
  cnpj varchar(60) NOT NULL,
  usuario_id int NOT NULL,
  razao_social varchar(100) NOT NULL,
  nome_fantasia varchar(100) NOT NULL,
  situacao_cadastral integer NOT NULL,
  data_situacao_cadastral varchar(60) NOT NULL,
  codigo_juridico integer NOT NULL,
  inicio_atividade varchar(100) NOT NULL,
  cnae_fiscal integer NOT NULL,
  descricao_cnae varchar(150) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

DROP TABLE endereco;

CREATE TABLE endereco(
  id int NOT NULL AUTO_INCREMENT,
  empresa_id integer NOT NULL,
  tipo_logradouro varchar(50) NOT NULL,
  logradouro varchar(100) NOT NULL,
  numero integer NOT NULL,
  complemento text,
  bairro varchar(60) NOT NULL,
  cep varchar(30) NOT NULL,
  uf varchar(10) NOT NULL,
  municipio varchar(60) NOT NULL,
  codigo_municipio integer NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

DROP TABLE telefones;

CREATE TABLE telefones(
  id int NOT NULL AUTO_INCREMENT,
  empresa_id integer NOT NULL,
  ddd_telefone varchar(20) NOT NULL,
  telefone_opcional varchar(20),
  ddd_fax varchar(30),
  PRIMARY KEY(id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

DROP TABLE socios;

CREATE TABLE socios(
  id int NOT NULL AUTO_INCREMENT,
  empresa_id integer NOT NULL,
  cnpj varchar(100) NOT NULL,
  nome_socio varchar(100) NOT NULL,
  cnpj_cpf_do_socio varchar(80),
  data_entrada_sociedade varchar(50) NOT NULL,
  percentual_capital_social integer NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
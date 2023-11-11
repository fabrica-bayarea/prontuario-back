![Centro Universitário IESB](public/logoIesb.png)

## Tabela de Conteúdos

- [Prontuário Eletrônico / Backend](#prontuário-eletrônico--backend)
  - [Resumo](#resumo)
  - [Roadmap](#versão-1)
  - [Funcionalidades](#funcionalidades)
  - [Tecnologias](#tecnologias)
- [Executando o Projeto](#executando-o-projeto)
  - [Dependências](#dependências)
  - [Rodando localmente](#rodando-localmente)
- [Autores](#autores)
  - [Equipe 1º/2023](#equipe-12023)

# Prontuário Eletrônico / Backend

## Resumo

Criar um sistema de cadastro de atendimentos para o núcleo social do IESB, que permita o registro de atendimentos realizados por programas sociais vinculados a cursos da instituição.


## Versão 1:

O objetivo da versão 1 é entregar um sistema que permita o registro dos seguintes dados:

- Cursos
- Programas sociais (associados a um curso)
- Usuários (administrador e cadastrador)
- Beneficiários (com nome, e-mail e telefone)
- Atendimentos (associando um usuário e uma data a um programa)


## Funcionalidades:

- O usuário administrador deve ser capaz de criar cursos e programas sociais.
- O usuário cadastrador deve ser capaz de logar em um programa e cadastrar um atendimento.

## Tecnologias

- TypeScript
- NestJS
- Prisma
- PostgreSQL
- Docker

# Executando o Projeto

## Dependências

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:
- Node.js: [Instalação do Node.js](https://nodejs.org/)
- Docker: [Instalação do Docker](https://docs.docker.com/desktop/install/linux-install/)

## Rodando localmente

Clone o projeto:

```bash
git clone https://github.com/fabrica-bayarea/prontuario-back.git
```

Navegue para a pasta recém-criada:

```bash
cd prontuario-back 
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo .env na raíz do projeto e adicione as seguintes variáveis de ambiente:

```sh
DATABASE_URL="postgresql://usuario:senha@host:port/nome_do_banco?schema=nome_do_schema"
JWT_SECRET="seu segredo"
POSTGRES_USER=usuario_postgres
POSTGRES_PASSWORD=senha_postgres
POSTGRES_DB=db_postgres
```

Suba o banco de dados com o docker:

```sh
docker-compose up -d

```

Aplique as migrações necessárias:

```sh
npx prisma migrate dev
```

Inicie a aplicação:

```bash
# desenvolvimento 
$ npm run start

# hot reload 
$ npm run start:dev

# produção 
$ npm run start:prod
```

Executando os testes:

```bash
# testes unitários 
$ npm run test

# testes end to end 
$ npm run test:e2e

# cobertura de testes 
$ npm run test:cov
```

## Autores

Abaixo temos uma lista de pessoas que participaram deste projeto ao longo dos anos.

### Equipe 1º/2023

| E-mail | Nome | Função |
| ------ | ---- | ------ |
| pedro.generic.email@gmail.com | Pedro Martins Pereira | Líder Técnico | 
| alisson.silva.3366@gmail.com | Alisson Silva dos Santos | Engenheiro Backend | 
| ievsouza622@gmail.com | Iev de Souza Cruz | Engenheiro Backend | 

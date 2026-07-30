# Sprint 01 - Funcionalidades Básicas | BACKEND
Data Inicial: 25/07/2026 \
Data Final:

## Introdução
A primeira sprint foi designada para a criação das funcionalidades básicas do Backend,
incluindo:
- CRUD
- Criptografia de senhas
- Hash de senhas para Login
- Validação de usuario com JWT Token

O modelo atual pode se comparar com um MVP do produto, tendo somente o básico e sendo trabalhado
e melhorado futuramente

## Funcionalidades Principais
Como o foco dessa primeira sprint foi as funcionalidades básicas do backend, foram criadas as seguintes funcionalidades:

### Login e Sistema de Autenticação
Para poder acessar o sistema interno, deve ser feito login com email e senha, com uma camada de segurança para proteger e garantir que apenas usuarios autorizados tenham acesso as funcionalidades
- Registro de novos usuarios internamente e fluxo de login seguro
- **Tecnologia:** implementação de JWT (JSON Web Token) para autenticação stateless e mecanismo de Refresh Tokens, garantindo sessões seguras, persistentes e renováveis sem a necessidade de logins constantes

### Criptografia de Senhas
Antes de salvas no banco de dados, todas as senhas, não apenas de Login, mas também as senhas gerenciadas, passam por um tratamento de criptografia, sendo:
- **Senhas Gerenciadas:** criptografia usando o pacote `crypto` do próprio Node.Js, usando o algoritimo `aes-256-gcm`, authTag, Initialization vectors e Chave de Criptografia de 32 bytes
- **Senhas de Login:** por conta da diferença de regra de negócio, as senhas usadas para login são criptografadas usando o pacote `bcrypt`, com uma criptografia em **Hash**, ou seja, a senha é cifrada, e nunca mais volta a ter seu texto original

## Variaveis de Ambiente (.env)
O documento com as variaveis ambientes, que pode ser conferido com o .env.example atualmente se encontra
com informações do banco de dados, keys de criptografia, e de tokens de autenticação, ele possui as seguintes
variaveis:

| Variavel | Descrição |
|:---------|:----------|
|PORT| Porta do Servidor|
|DB_HOST | Servidor do Banco |
|DB_USER| Usuario administrador do Banco |
|DB_PASS| Senha do Banco |
|DB_PORT| Porta do Banco |
|DB_NAME| Nome do Banco |
|ENCRYPTION_KEY| Chave para Criptografia de senhas |

## Endpoints
As endpoints atuais são referentes a login de usuario e CRUD de senha, 
|Método|Rota|Descrição|
|:---|:---|:---|
|`GET`|`/password`| Lista todas as senhas (senhas ainda criptografadas)|
|`GET`|`/password/:id`|Filtra senhas pelo id (senhas com descriptografia)|
|`POST`|`/password/register`|Cadastra novas senhas|
|`PATCH`|`/password/:id`|Atualiza parcialmente as senhas. Apenas campos enviados no body são alterados|
|`DELETE`|`/password/:id`|Exclui uma senha pelo ID|
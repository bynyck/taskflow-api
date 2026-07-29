# TaskFlow API

API REST para gerenciamento de tarefas, desenvolvida com Node.js, Express, JavaScript e PostgreSQL.

O projeto aplica arquitetura em camadas, validação e normalização de dados com Zod, persistência em banco de dados, consultas SQL parametrizadas, tratamento centralizado de erros e boas práticas de versionamento com Git e GitHub.

## Tecnologias e ferramentas

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NODEJS](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=339933)
![EXPRESS](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![POSTGRESQL](https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=4169E1)
![ZOD](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3E67B1)
![VITEST](https://img.shields.io/badge/Vitest-000000?style=for-the-badge&logo=vitest&logoColor=6E9F18)
![POSTMAN](https://img.shields.io/badge/Postman-000000?style=for-the-badge&logo=postman&logoColor=FF6C37)
![GIT](https://img.shields.io/badge/Git-000000?style=for-the-badge&logo=git&logoColor=F05032)
![GITHUB](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)
![VSCODE](https://img.shields.io/badge/VS_Code-000000?style=for-the-badge&logo=visualstudiocode&logoColor=007ACC)

## Funcionalidades

- Listar todas as tarefas
- Buscar uma tarefa por ID
- Cadastrar uma nova tarefa
- Atualizar parcialmente uma tarefa
- Marcar uma tarefa como concluída
- Reabrir uma tarefa concluída
- Excluir uma tarefa
- Validar e normalizar os dados recebidos
- Gerar ID, status e data de criação automaticamente
- Persistir os dados no PostgreSQL
- Executar consultas SQL parametrizadas
- Proteger a aplicação contra SQL Injection
- Tratar erros de forma centralizada
- Retornar status HTTP adequados
- Registrar as requisições recebidas
- Testar os schemas de validação automaticamente

## Arquitetura

O projeto está organizado em camadas:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

- **Routes:** definem os métodos e caminhos da API.
- **Middlewares:** registram requisições, validam dados e tratam erros.
- **Controllers:** recebem as requisições e definem as respostas HTTP.
- **Services:** concentram as regras de negócio.
- **Repositories:** executam consultas SQL parametrizadas.
- **Schemas:** definem as regras de validação e normalização com Zod.
- **Database:** configura e disponibiliza o pool de conexões com o PostgreSQL.
- **Errors:** define os erros personalizados da aplicação.

## Estrutura do projeto

```text
taskflow-api/
├── src/
│   ├── controllers/
│   │   └── tarefasController.js
│   ├── database/
│   │   └── conexao.js
│   ├── errors/
│   │   └── ErroAplicacao.js
│   ├── middlewares/
│   │   ├── registrarRequisicao.js
│   │   ├── rotaNaoEncontrada.js
│   │   ├── tratarErros.js
│   │   └── validarRequisicao.js
│   ├── repositories/
│   │   └── tarefasRepository.js
│   ├── routes/
│   │   └── tarefasRoutes.js
│   ├── schemas/
│   │   └── tarefasSchemas.js
│   ├── services/
│   │   └── tarefasService.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── tarefasSchemas.test.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- PostgreSQL
- Git

O pgAdmin é opcional, mas pode ser utilizado para administrar visualmente o banco de dados.

## Configuração do banco de dados

Crie um banco chamado `taskflow`:

```sql
CREATE DATABASE taskflow;
```

Conectado ao banco `taskflow`, crie o tipo de prioridade:

```sql
CREATE TYPE prioridade_tarefa AS ENUM (
  'baixa',
  'media',
  'alta'
);
```

Depois, crie a tabela de tarefas:

```sql
CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR NOT NULL
    CHECK (char_length(trim(titulo)) > 0),
  descricao VARCHAR,
  prioridade prioridade_tarefa NOT NULL,
  concluida BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

O PostgreSQL será responsável por gerar automaticamente:

- `id`
- `concluida`
- `criado_em`

## Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/nykthedev/taskflow-api.git
```

### 2. Entre na pasta do projeto

```bash
cd taskflow-api
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto usando o `.env.example` como referência:

```env
PORT=3333

DB_HOST=localhost
DB_PORT=PORTA_DO_POSTGRESQL
DB_USER=SEU_USER_DO_POSTGRESQL
DB_PASSWORD=SUA_SENHA_DO_POSTGRESQL
DB_NAME=taskflow
```

O arquivo `.env` contém dados privados e não deve ser enviado ao GitHub.

### 5. Inicie o servidor

```bash
npm run dev
```

Durante a inicialização, a aplicação testa a comunicação com o PostgreSQL antes de começar a receber requisições HTTP.

Resultado esperado:

```text
PostgreSQL conectado 1
Servidor rodando em http://localhost:3333
```

A API ficará disponível em:

```text
http://localhost:3333
```

## Testes automatizados

Execute os testes com:

```bash
npm test
```

Os testes atuais verificam os schemas de cadastro e atualização, incluindo:

- Rejeição de título vazio
- Aceitação de dados válidos
- Normalização da prioridade
- Rejeição de prioridade inválida
- Rejeição de atualização com corpo vazio
- Aceitação de atualização parcial

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tarefas` | Lista todas as tarefas |
| `GET` | `/tarefas/:id` | Busca uma tarefa pelo ID |
| `POST` | `/tarefas` | Cadastra uma nova tarefa |
| `PATCH` | `/tarefas/:id` | Atualiza parcialmente uma tarefa |
| `PATCH` | `/tarefas/:id/concluir` | Marca uma tarefa como concluída |
| `PATCH` | `/tarefas/:id/reabrir` | Reabre uma tarefa concluída |
| `DELETE` | `/tarefas/:id` | Exclui uma tarefa |

## Listar tarefas

```http
GET /tarefas
```

As tarefas são retornadas da mais recente para a mais antiga.

### Resposta de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Tarefas encontradas com sucesso",
  "tarefas": [
    {
      "id": 1,
      "titulo": "Estudar Node.js",
      "descricao": "Praticar desenvolvimento de APIs",
      "prioridade": "alta",
      "concluida": false,
      "criadoEm": "2026-07-28T12:21:06.245Z"
    }
  ]
}
```

## Buscar uma tarefa por ID

```http
GET /tarefas/1
```

### Resposta de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Tarefa encontrada com sucesso",
  "tarefa": {
    "id": 1,
    "titulo": "Estudar Node.js",
    "descricao": "Praticar desenvolvimento de APIs",
    "prioridade": "alta",
    "concluida": false,
    "criadoEm": "2026-07-28T12:21:06.245Z"
  }
}
```

## Cadastrar uma tarefa

```http
POST /tarefas
```

### Corpo da requisição

```json
{
  "titulo": "Estudar PostgreSQL",
  "descricao": "Praticar consultas SQL",
  "prioridade": "alta"
}
```

A descrição é opcional:

```json
{
  "titulo": "Organizar GitHub",
  "prioridade": "media"
}
```

### Resposta de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Tarefa criada com sucesso",
  "tarefa": {
    "id": 1,
    "titulo": "Organizar GitHub",
    "descricao": null,
    "prioridade": "media",
    "concluida": false,
    "criadoEm": "2026-07-28T12:21:06.245Z"
  }
}
```

## Atualizar uma tarefa

```http
PATCH /tarefas/1
```

Somente os campos enviados serão atualizados:

```json
{
  "titulo": "Estudar Express avançado",
  "prioridade": "alta"
}
```

Também é possível atualizar apenas um campo:

```json
{
  "prioridade": "media"
}
```

A consulta de atualização é construída dinamicamente de acordo com os campos enviados.

### Resposta de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Tarefa atualizada com sucesso",
  "tarefa": {
    "id": 1,
    "titulo": "Estudar Express avançado",
    "descricao": null,
    "prioridade": "alta",
    "concluida": false,
    "criadoEm": "2026-07-28T12:21:06.245Z"
  }
}
```

## Concluir uma tarefa

```http
PATCH /tarefas/1/concluir
```

Não é necessário enviar um corpo na requisição.

A tarefa passa a ter:

```json
{
  "concluida": true
}
```

Tentar concluir uma tarefa que já está concluída retorna:

```text
409 Conflict
```

## Reabrir uma tarefa

```http
PATCH /tarefas/1/reabrir
```

Não é necessário enviar um corpo na requisição.

A tarefa passa a ter:

```json
{
  "concluida": false
}
```

Tentar reabrir uma tarefa que já está aberta retorna:

```text
409 Conflict
```

## Excluir uma tarefa

```http
DELETE /tarefas/1
```

### Resposta de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Tarefa deletada com sucesso",
  "tarefaRemovida": {
    "id": 1,
    "titulo": "Estudar Node.js",
    "descricao": "Praticar desenvolvimento de APIs",
    "prioridade": "alta",
    "concluida": false,
    "criadoEm": "2026-07-28T12:21:06.245Z"
  }
}
```

## Regras de negócio

### Título

- Obrigatório no cadastro
- Deve ser uma string
- Não pode estar vazio
- Não pode conter somente espaços
- É normalizado antes de ser salvo
- Pode ser atualizado parcialmente

A aplicação valida o título com Zod, e o PostgreSQL também protege a coluna com uma constraint `CHECK`.

### Descrição

- Opcional
- Quando enviada, deve ser uma string
- Quando não enviada, recebe `null`
- Pode ser atualizada parcialmente

### Prioridade

Valores permitidos:

```text
baixa
media
alta
```

A prioridade é normalizada antes do salvamento:

```text
"  ALTA  " → "alta"
```

O PostgreSQL utiliza o tipo personalizado:

```text
prioridade_tarefa
```

### Estado da tarefa

Toda nova tarefa é criada com:

```json
{
  "concluida": false
}
```

Uma tarefa aberta pode ser concluída.

Uma tarefa concluída pode ser reaberta.

A API impede:

- Concluir uma tarefa que já está concluída
- Reabrir uma tarefa que já está aberta

### Campos gerados automaticamente

Os seguintes campos são definidos pelo PostgreSQL:

- `id`
- `concluida`
- `criadoEm`

No banco de dados, a coluna de criação utiliza o nome:

```text
criado_em
```

Na resposta da API, ela é retornada como:

```text
criadoEm
```

## Consultas parametrizadas

Os dados enviados pelo cliente não são concatenados diretamente no SQL.

Exemplo:

```sql
SELECT *
FROM tarefas
WHERE id = $1;
```

Os valores são enviados separadamente:

```js
[id]
```

Isso faz com que o PostgreSQL trate o conteúdo recebido como dado, ajudando a impedir ataques de SQL Injection.

## Tratamento de erros

A aplicação possui um middleware centralizado de erros.

Erros conhecidos são representados pela classe:

```text
ErroAplicacao
```

Erros inesperados são registrados no terminal, enquanto o cliente recebe uma resposta genérica e segura:

```json
{
  "sucesso": false,
  "tipoErro": "ERRO_INTERNO",
  "mensagem": "Erro interno no servidor"
}
```

## Status HTTP

| Status | Descrição |
|---|---|
| `200 OK` | Operação realizada com sucesso |
| `201 Created` | Tarefa criada com sucesso |
| `400 Bad Request` | Dados ou identificador inválidos |
| `404 Not Found` | Tarefa não encontrada |
| `409 Conflict` | A operação entra em conflito com o estado atual da tarefa |
| `500 Internal Server Error` | Erro inesperado na aplicação |

## Próximas melhorias

- Filtros por prioridade e status
- Busca de tarefas pelo título
- Paginação com `LIMIT` e `OFFSET`
- Contagem total de tarefas
- Testes de integração das rotas
- Migrações do banco de dados
- Autenticação e autorização
- Documentação com Swagger
- Docker
- Deploy da aplicação

## Status do projeto

✅ CRUD completo integrado ao PostgreSQL.

✅ Validação profissional com Zod.

✅ Consultas SQL parametrizadas.

✅ Arquitetura em camadas.

✅ Tratamento centralizado de erros.

✅ Testes automatizados dos schemas.

O projeto continuará sendo evoluído com novos recursos, segurança, testes e melhorias na arquitetura.

## Autor

Desenvolvido por [Nicollas](https://github.com/bynyck).
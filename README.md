# TaskFlow API

API REST para gerenciamento de tarefas e projetos, desenvolvida com Node.js, Express, JavaScript e PostgreSQL.

A TaskFlow permite criar e organizar tarefas, agrupá-las em projetos, controlar prioridade e estado, aplicar filtros, navegar pelos resultados com paginação e manter regras de negócio consistentes.

O projeto utiliza arquitetura em camadas, validação e normalização de dados com Zod, consultas SQL parametrizadas, tratamento centralizado de erros e testes automatizados com Vitest.

## Tecnologias e ferramentas

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NODEJS](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=339933)
![EXPRESS](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![POSTGRESQL](https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=4169E1)
![ZOD](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3E67B1)
![VITEST](https://img.shields.io/badge/Vitest-000000?style=for-the-badge&logo=vitest&logoColor=6E9F18)
![POSTMAN](https://img.shields.io/badge/Postman-000000?style=for-the-badge&logo=postman&logoColor=FF6C37)

## Funcionalidades

- Criar, listar, buscar, atualizar e excluir tarefas
- Marcar tarefas como concluídas
- Reabrir tarefas concluídas
- Criar, listar, buscar, atualizar e excluir projetos
- Vincular tarefas a projetos
- Alterar o projeto associado a uma tarefa
- Remover o vínculo entre tarefa e projeto
- Listar as tarefas pertencentes a um projeto
- Filtrar tarefas por prioridade
- Filtrar tarefas por estado de conclusão
- Combinar filtros na listagem
- Paginar a listagem de tarefas
- Limitar a quantidade máxima de registros por página
- Validar `body`, `params` e `query params` com Zod
- Normalizar dados antes de entrarem na aplicação
- Tratar erros de forma centralizada
- Retornar status HTTP adequados
- Executar consultas SQL parametrizadas
- Preservar tarefas quando um projeto é excluído
- Executar testes automatizados dos principais contratos de validação

## Arquitetura

A aplicação utiliza uma arquitetura em camadas:

```text
Request HTTP
    ↓
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

### Routes

Definem os métodos HTTP, caminhos dos endpoints e middlewares executados antes dos controllers.

### Middlewares

Executam responsabilidades compartilhadas entre diferentes rotas, como:

- registro de requisições
- validação dos dados recebidos
- tratamento de rotas inexistentes
- tratamento centralizado de erros

### Controllers

Recebem os dados HTTP já validados, chamam a camada de serviço e constroem a resposta HTTP.

### Services

Concentram as regras de negócio da aplicação.

Exemplos:

- verificar se uma tarefa existe
- verificar se um projeto existe
- impedir que uma tarefa já concluída seja concluída novamente
- impedir que uma tarefa aberta seja reaberta
- validar a existência de um projeto antes de vinculá-lo a uma tarefa
- calcular os dados de paginação

### Repositories

São responsáveis pelo acesso ao PostgreSQL.

Executam consultas SQL parametrizadas e transformam os resultados retornados pelo banco em dados utilizados pela aplicação.

### Schemas

Definem os contratos de entrada da API utilizando Zod.

São utilizados para validar e normalizar:

- `request.body`
- `request.params`
- `request.query`

### Database

Configura e disponibiliza o pool de conexões com PostgreSQL.

### Errors

Contém os erros personalizados utilizados pelas regras da aplicação.

## Estrutura do projeto

```text
taskflow-api/
├── src/
│   ├── controllers/
│   │   ├── projetosController.js
│   │   └── tarefasController.js
│   │
│   ├── database/
│   │   └── conexao.js
│   │
│   ├── errors/
│   │   └── ErroAplicacao.js
│   │
│   ├── middlewares/
│   │   ├── registrarRequisicao.js
│   │   ├── rotaNaoEncontrada.js
│   │   ├── tratarErros.js
│   │   └── validarRequisicao.js
│   │
│   ├── repositories/
│   │   ├── projetosRepository.js
│   │   └── tarefasRepository.js
│   │
│   ├── routes/
│   │   ├── projetosRoutes.js
│   │   └── tarefasRoutes.js
│   │
│   ├── schemas/
│   │   ├── comunsSchemas.js
│   │   ├── projetosSchemas.js
│   │   └── tarefasSchemas.js
│   │
│   ├── services/
│   │   ├── projetosService.js
│   │   └── tarefasService.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── comunsSchemas.test.js
│   ├── projetoSchemas.test.js
│   └── tarefasSchemas.test.js
│
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

O pgAdmin é opcional e pode ser utilizado para administrar visualmente o PostgreSQL.

## Configuração do banco de dados

Crie um banco chamado:

```sql
CREATE DATABASE taskflow;
```

Conectado ao banco `taskflow`, crie o tipo utilizado para representar a prioridade das tarefas:

```sql
CREATE TYPE prioridade_tarefa AS ENUM (
    'baixa',
    'media',
    'alta'
);
```

### Tabela de projetos

```sql
CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR NOT NULL
        CHECK (char_length(trim(nome)) > 0),
    descricao VARCHAR,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela de tarefas

```sql
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo VARCHAR NOT NULL
        CHECK (char_length(trim(titulo)) > 0),
    descricao VARCHAR,
    prioridade prioridade_tarefa NOT NULL,
    concluida BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    projeto_id INTEGER
        REFERENCES projetos(id)
        ON DELETE SET NULL
);
```

A chave estrangeira:

```text
tarefas.projeto_id → projetos.id
```

representa o relacionamento entre tarefas e projetos.

O campo `projeto_id` é opcional, portanto uma tarefa pode existir sem estar vinculada a um projeto.

O `ON DELETE SET NULL` garante que, ao excluir um projeto, suas tarefas não sejam excluídas. O vínculo é removido e `projeto_id` passa a ser `NULL`.

## Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/nykthedev/taskflow-api.git
```

### 2. Entre na pasta

```bash
cd taskflow-api
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando `.env.example` como referência:

```env
PORT=3333

DB_HOST=localhost
DB_PORT=PORTA_DO_POSTGRESQL
DB_USER=SEU_USUARIO_DO_POSTGRESQL
DB_PASSWORD=SUA_SENHA_DO_POSTGRESQL
DB_NAME=taskflow
```

O arquivo `.env` contém informações privadas e não deve ser enviado ao repositório.

### 5. Inicie a aplicação

```bash
npm run dev
```

Durante a inicialização, a aplicação verifica a conexão com PostgreSQL antes de iniciar o servidor HTTP.

A API ficará disponível localmente em:

```text
http://localhost:3333
```

## Testes automatizados

Os testes utilizam Vitest.

Execute:

```bash
npm test
```

A suíte atual possui 22 testes automatizados.

Eles verificam contratos importantes como:

- cadastro e atualização de tarefas
- cadastro e atualização de projetos
- normalização de prioridade
- rejeição de valores inválidos
- atualização parcial
- rejeição de atualização vazia
- cadastro de projeto sem dados
- validação de IDs
- conversão de parâmetros de string para número
- rejeição de IDs não numéricos
- rejeição de IDs não positivos
- rejeição de IDs decimais
- limite máximo da paginação
- valores padrão da paginação

## Rotas

### Tarefas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tarefas` | Lista tarefas com filtros e paginação |
| `GET` | `/tarefas/:id` | Busca uma tarefa pelo ID |
| `POST` | `/tarefas` | Cadastra uma nova tarefa |
| `PATCH` | `/tarefas/:id` | Atualiza parcialmente uma tarefa |
| `PATCH` | `/tarefas/:id/concluir` | Marca uma tarefa como concluída |
| `PATCH` | `/tarefas/:id/reabrir` | Reabre uma tarefa concluída |
| `DELETE` | `/tarefas/:id` | Exclui uma tarefa |

### Projetos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/projetos` | Lista todos os projetos |
| `GET` | `/projetos/:id` | Busca um projeto pelo ID |
| `GET` | `/projetos/:id/tarefas` | Lista as tarefas de um projeto |
| `POST` | `/projetos` | Cadastra um novo projeto |
| `PATCH` | `/projetos/:id` | Atualiza parcialmente um projeto |
| `DELETE` | `/projetos/:id` | Exclui um projeto |

## Filtros e paginação

A rota:

```http
GET /tarefas
```

aceita os seguintes query params:

| Parâmetro | Valores | Padrão | Descrição |
|---|---|---|---|
| `concluida` | `true` ou `false` | — | Filtra pelo estado da tarefa |
| `prioridade` | `baixa`, `media` ou `alta` | — | Filtra pela prioridade |
| `pagina` | inteiro positivo | `1` | Define a página |
| `limite` | inteiro entre `1` e `100` | `10` | Define a quantidade de registros por página |

Os filtros podem ser combinados.

Exemplo:

```http
GET /tarefas?concluida=false&prioridade=alta&pagina=2&limite=5
```

### Resposta paginada

```json
{
    "sucesso": true,
    "mensagem": "Tarefas encontradas com sucesso",
    "pagina": 1,
    "limite": 10,
    "total": 2,
    "totalPaginas": 1,
    "tarefas": [
        {
            "id": 2,
            "titulo": "Estudar PostgreSQL",
            "descricao": "Praticar consultas SQL",
            "prioridade": "alta",
            "concluida": false,
            "criadoEm": "2026-08-08T18:00:00.000Z",
            "projetoId": 1,
            "projetoNome": "Backend"
        }
    ]
}
```

Quando a página solicitada não possui registros, a API retorna uma lista vazia:

```json
{
    "tarefas": []
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
    "prioridade": "alta",
    "projetoId": 1
}
```

Campos:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `titulo` | Sim | Título da tarefa |
| `descricao` | Não | Informações adicionais |
| `prioridade` | Sim | `baixa`, `media` ou `alta` |
| `projetoId` | Não | Projeto ao qual a tarefa será vinculada |

Uma tarefa também pode ser criada sem projeto:

```json
{
    "titulo": "Organizar estudos",
    "prioridade": "media"
}
```

Quando `projetoId` é enviado, a aplicação verifica se o projeto existe antes de criar a tarefa.

## Atualizar uma tarefa

```http
PATCH /tarefas/:id
```

Somente os campos enviados são modificados.

Exemplo:

```json
{
    "titulo": "Estudar Express",
    "prioridade": "alta"
}
```

O projeto também pode ser alterado:

```json
{
    "projetoId": 3
}
```

Para remover o vínculo entre tarefa e projeto:

```json
{
    "projetoId": null
}
```

No `PATCH`:

```text
projetoId ausente
→ mantém o vínculo atual

projetoId com número
→ vincula a tarefa ao projeto informado

projetoId null
→ remove o vínculo
```

Uma atualização com corpo vazio é rejeitada.

## Concluir uma tarefa

```http
PATCH /tarefas/:id/concluir
```

Não é necessário enviar body.

Uma tarefa já concluída não pode ser concluída novamente.

Nesse caso a API retorna:

```text
409 Conflict
```

## Reabrir uma tarefa

```http
PATCH /tarefas/:id/reabrir
```

Não é necessário enviar body.

Uma tarefa que já está aberta não pode ser reaberta.

Nesse caso a API retorna:

```text
409 Conflict
```

## Cadastrar um projeto

```http
POST /projetos
```

### Corpo da requisição

```json
{
    "nome": "Backend",
    "descricao": "Estudos e projetos relacionados a back-end"
}
```

Campos:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `nome` | Sim | Nome do projeto |
| `descricao` | Não | Descrição do projeto |

Um cadastro sem `nome` é rejeitado.

## Atualizar um projeto

```http
PATCH /projetos/:id
```

A atualização é parcial.

Exemplo:

```json
{
    "nome": "Backend avançado"
}
```

A descrição também pode ser removida:

```json
{
    "descricao": null
}
```

Uma atualização sem nenhum campo é rejeitada.

## Listar tarefas de um projeto

```http
GET /projetos/:id/tarefas
```

A API primeiro verifica se o projeto existe.

Se o projeto existir, suas tarefas são retornadas.

Um projeto válido sem tarefas retorna:

```json
{
    "tarefas": []
}
```

Um projeto inexistente retorna:

```text
404 Not Found
```

## Relacionamento entre tarefas e projetos

Uma tarefa pode:

```text
existir sem projeto
        ↓
ser vinculada a um projeto
        ↓
mudar de projeto
        ↓
ter seu vínculo removido
```

Na leitura das tarefas, a aplicação utiliza `LEFT JOIN` entre `tarefas` e `projetos`.

Isso permite retornar informações do projeto quando existe um vínculo sem impedir que tarefas sem projeto também sejam listadas.

Exemplo de dados retornados:

```json
{
    "id": 10,
    "titulo": "Estudar SQL",
    "projetoId": 2,
    "projetoNome": "Backend"
}
```

Uma tarefa sem projeto retorna:

```json
{
    "projetoId": null,
    "projetoNome": null
}
```

## Validação dos identificadores

Os parâmetros `:id` são validados na fronteira da aplicação utilizando um schema compartilhado.

Um ID precisa:

- representar um número
- ser inteiro
- ser positivo

Exemplos:

```text
/tarefas/abc
→ 400 Bad Request

/tarefas/0
→ 400 Bad Request

/tarefas/1.5
→ 400 Bad Request
```

Um ID estruturalmente válido pode passar pela validação e ainda representar um recurso inexistente:

```text
/tarefas/999
→ 404 Not Found
```

A separação de responsabilidades é:

```text
Schema / middleware
→ valida o formato da entrada

Service
→ verifica existência e regras de negócio
```

## Validação de dados

A API utiliza Zod para validar e normalizar entradas antes que elas cheguem às regras de negócio.

O middleware de validação pode trabalhar com diferentes origens:

```text
body
params
query
```

Dados validados vindos de `params` e `query` são disponibilizados para a aplicação já transformados e confiáveis.

Por exemplo:

```text
"8"
↓
z.coerce.number()
↓
8
```

## Consultas parametrizadas

Valores fornecidos pelo cliente não são concatenados diretamente às consultas SQL.

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

Isso faz com que o PostgreSQL trate o conteúdo recebido como dado, reduzindo o risco de SQL Injection.

## Tratamento de erros

A aplicação utiliza tratamento centralizado de erros.

Erros conhecidos são representados pela classe:

```text
ErroAplicacao
```

Formato geral de erro:

```json
{
    "sucesso": false,
    "tipoErro": "DADOS_INVALIDOS",
    "mensagem": "Os dados enviados são inválidos",
    "detalhes": []
}
```

Erros inesperados são tratados pelo middleware central e não expõem detalhes internos da aplicação ao cliente.

## Status HTTP

| Status | Significado |
|---|---|
| `200 OK` | Operação realizada com sucesso |
| `201 Created` | Recurso criado com sucesso |
| `400 Bad Request` | Dados ou identificadores inválidos |
| `404 Not Found` | Tarefa, projeto ou rota não encontrada |
| `409 Conflict` | Operação incompatível com o estado atual do recurso |
| `500 Internal Server Error` | Erro inesperado na aplicação |

## Decisões técnicas

Algumas decisões adotadas no projeto:

- arquitetura separada em routes, controllers, services e repositories
- validação dos dados na fronteira da aplicação
- regras de negócio concentradas nos services
- acesso ao banco concentrado nos repositories
- consultas SQL parametrizadas
- schemas reutilizáveis para contratos compartilhados
- relacionamento opcional entre tarefas e projetos
- `ON DELETE SET NULL` para preservar tarefas
- `LEFT JOIN` para manter tarefas sem projeto nas consultas
- paginação utilizando `LIMIT` e `OFFSET`
- limite máximo de 100 registros por página
- tratamento centralizado de erros
- testes automatizados dos principais contratos de validação

## Deploy

A API está publicada no Render e utiliza PostgreSQL hospedado no Neon.

### API em produção

**Base URL:**

```text
https://taskflow-api-j3lv.onrender.com
````

## Status do projeto

A versão atual possui:

- CRUD de tarefas
- CRUD de projetos
- relacionamento entre tarefas e projetos
- regras de negócio
- validação profissional com Zod
- filtros
- paginação
- PostgreSQL
- consultas parametrizadas
- tratamento centralizado de erros
- testes automatizados

A API está publicada em ambiente de produção utilizando Render e PostgreSQL hospedado no Neon.

## Autor

Desenvolvido por [Nicollas](https://github.com/bynyck).

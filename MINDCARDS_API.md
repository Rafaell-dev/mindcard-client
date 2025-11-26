# Mindcards API Documentation

Esta documentação detalha as rotas de criação e atualização de Mindcards, projetada para integração por agentes de IA e desenvolvedores frontend.

## Visão Geral

O recurso **Mindcard** é o núcleo da aplicação, representando um conjunto de estudos gerado a partir de um arquivo (PDF, imagem) ou texto. O processamento é assíncrono, utilizando IA para gerar flashcards ou quizzes.

---

## 1. Criar Mindcard (Assíncrono)

Rota para iniciar a criação de um novo Mindcard. O upload do arquivo é processado e um job de IA é iniciado em background.

- **URL**: `/mindcard/criar`
- **Método**: `POST`
- **Content-Type**: `multipart/form-data`

### Parâmetros do Corpo (Form-Data)

| Campo                 | Tipo          | Obrigatório | Descrição                                                                                   | Exemplo                                      |
| :-------------------- | :------------ | :---------: | :------------------------------------------------------------------------------------------ | :------------------------------------------- |
| `titulo`              | string        |     Sim     | Título descritivo para o mindcard.                                                          | `Matemática - Álgebra Linear`                |
| `usuarioId`           | string (UUID) |     Sim     | ID do usuário proprietário do mindcard.                                                     | `8c40a29b-04f4-4960-965d-9e741f66288f`       |
| `tipoGeracao`         | string        |     Sim     | Tipo de conteúdo a ser gerado pela IA. Valores: `FLASHCARDS`, `QUIZ`.                       | `FLASHCARDS`                                 |
| `fonteArquivo`        | file          |     Sim     | Arquivo fonte para extração de conteúdo. Suporta PDF, PNG, JPG, JPEG, GIF, WEBP (Máx 50MB). | `arquivo.pdf`                                |
| `promptPersonalizado` | string        |     Não     | Instruções adicionais para guiar a geração da IA.                                           | `Foque em definições e teoremas principais.` |

### Resposta de Sucesso (201 Created)

Retorna imediatamente com o ID do mindcard criado e o ID do job de processamento.

```json
{
  "success": true,
  "message": "Mindcard criado com sucesso. O processamento será feito em background.",
  "data": {
    "mindcardId": "019a8588-9582-72f8-ac5e-231e942f52d9",
    "jobId": "1",
    "status": "PROCESSING"
  }
}
```

### Respostas de Erro

- **400 Bad Request**: Dados inválidos ou arquivo ausente/corrompido.
- **413 Payload Too Large**: Arquivo excede o limite de 50MB.

---

## 2. Atualizar Mindcard

Rota para atualizar as informações básicas de um Mindcard existente. É possível atualizar o título, o prompt personalizado e substituir o arquivo fonte.

> **Nota**: Se um novo arquivo for enviado, o conteúdo (cards/quiz) **não** é regenerado automaticamente nesta rota. Esta rota atualiza apenas os metadados e o arquivo de referência.

- **URL**: `/mindcard/atualizar/:mindcardId`
- **Método**: `PATCH`
- **Content-Type**: `multipart/form-data`

### Parâmetros de Rota

| Parâmetro    | Tipo          | Descrição                              |
| :----------- | :------------ | :------------------------------------- |
| `mindcardId` | string (UUID) | ID único do mindcard a ser atualizado. |

### Parâmetros do Corpo (Form-Data)

| Campo                 | Tipo   | Obrigatório | Descrição                                      |
| :-------------------- | :----- | :---------: | :--------------------------------------------- |
| `titulo`              | string |     Não     | Novo título para o mindcard.                   |
| `promptPersonalizado` | string |     Não     | Novo prompt personalizado.                     |
| `fonteArquivo`        | file   |     Não     | Novo arquivo fonte para substituir o anterior. |

### Resposta de Sucesso (200 OK)

Retorna o objeto Mindcard atualizado.

```json
{
  "id": "019a8588-9582-72f8-ac5e-231e942f52d9",
  "titulo": "Matemática - Álgebra Linear Avançada",
  "fonteArquivo": "caminho/para/novo_arquivo.pdf",
  "promptPersonalizado": "Foque em exercícios práticos.",
  "usuarioId": "8c40a29b-04f4-4960-965d-9e741f66288f",
  "dataCriacao": "2023-10-27T10:00:00.000Z",
  "statusProcessamento": "CONCLUIDO",
  "jobId": "1",
  "mensagemErro": null,
  "iniciadoEm": "2023-10-27T10:00:05.000Z",
  "concluidoEm": "2023-10-27T10:00:30.000Z"
}
```

### Respostas de Erro

- **400 Bad Request**: Dados inválidos.
- **404 Not Found**: Mindcard não encontrado com o ID fornecido.

---

## Fluxo de Integração (Frontend)

1.  **Criação**:
    - O frontend deve coletar o arquivo e metadados do usuário.
    - Enviar uma requisição `POST` para `/mindcard/criar`.
    - Armazenar o `jobId` retornado para monitoramento (polling ou websocket, se disponível) ou simplesmente aguardar a notificação de conclusão.
    - Redirecionar o usuário para a lista de mindcards ou para a tela de detalhes com status "Processando".

2.  **Atualização**:
    - O frontend exibe os dados atuais em um formulário.
    - Envia apenas os campos modificados via `PATCH` para `/mindcard/atualizar/:id`.
    - Atualiza a interface com os dados retornados na resposta.

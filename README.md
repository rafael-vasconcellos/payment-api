# Sobre
Resolução do desafio por um completo iniciante em backend

## API
algumas rotas fazem uso de uma proto autenticação através do header *"Authorization"*.
### /api (GET)
lista as rotas
### /user
o método GET utiliza parâmetros de busca, enquanto POST e PUT utilizam o body da requisição
```typescript
// GET & PUT
interface IUserDTO { 
    document?: string,
    type?: "COMMON" | "MERCHANT",
    name?: string,
    lastname?: string,
    email?: string,
    pass?: string,
    balance?: number
}

// POST
interface ICreateUserDTO { 
    document: string,
    type: "COMMON" | "MERCHANT",
    name: string,
    email: string,
    pass: string,
    lastname?: string,
}
```
### /transaction
```typescript
// POST
interface ICreateTransactionDTO { 
    sender: string
    receiver: string
    amount: number
}

// DELETE
interface IReverseTransactionDTO {
    id: string
}

// GET
type IGetTransactionDTO = IGetUser & { 
  transactionId?: string 
}
```

#### Variáveis de ambiente
*HOST, PORT, USER, PASS* (credenciais do provedor de email)

## Instalação
```bash
$ npm  install
```

## Executando
```bash
# development
$ npm  run  start

# watch mode
$ npm  run  start:dev

# production mode
$ npm  run  start:prod
```

## Executando Testes
```bash
# unit tests
$ npm  run  test

# e2e tests
$ npm  run  test:e2e

# test coverage
$ npm  run  test:cov
```

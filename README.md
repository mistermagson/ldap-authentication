# LDAP Authentication with Node.js

A simple node.js lib to authenticate against an LDAP server.

## Pre-Requisite

- Node instalado
- Clonar este ``` git clone ```

```sh 
$ npm install
```

## USAGE

### Iniciar o serviço
```sh 
$ node index.js
```

### Obter um Token
Enviar requisição POST
```
POST http://localhost:3000/authenticate
```

```
Body
{
"username": "xxxx@trf3.jus.br",
"password":"xxxxxxxx"   
}
```

### Validar o Token

```
GET http://localhost:3000/verify
Authorization: Bearer JWT_ACCESS_TOKEN
```
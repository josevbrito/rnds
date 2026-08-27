---
title: Autenticação
description: >-
  Certificado ICP-Brasil A1, autenticação mútua TLS e o header
  X-Authorization-Server - o fluxo de autenticação da RNDS e onde ele costuma
  falhar.
sidebar:
  order: 6
---

O acesso à RNDS é autenticado por **certificado digital** em mTLS (autenticação
mútua TLS). Não há usuário e senha, e não há chave de API.

## O fluxo

```
1. mTLS no endereço Auth, apresentando o certificado A1
   → recebe um token de acesso (JWT)

2. Chamada ao endereço EHR
   → token vai no header X-Authorization-Server
```

:::danger[O header não é `Authorization`]
O barramento espera **`X-Authorization-Server`**, não o `Authorization`
convencional do HTTP.

Esse detalhe pega quase todo mundo na primeira tentativa, e o erro resultante
costuma ser genérico, não diz "header errado". Se a autenticação parece correta
e mesmo assim a chamada falha, confira o nome do header antes de qualquer outra
coisa.
:::

## Sobre o certificado

Os pontos que mais geram retrabalho na compra:

- Precisa ser **ICP-Brasil tipo A1** (arquivo `.pfx` ou `.p12`)
- É usado em **mTLS**, não apenas para assinar documento
- **Certificado autoassinado não serve**
- A1 em arquivo é o formato esperado; o A3 (token/cartão) complica a automação

Confirme esses pontos com quem for emitir **antes de fechar a compra**. Trocar
depois custa tempo e dinheiro.

## Em código

A parte que muda entre linguagens é como carregar o `.pfx` no cliente HTTP. O
conceito é sempre o mesmo: o certificado vai na camada TLS da conexão, não num
header.

```js
// Node.js - o certificado vai no agente TLS
import { Agent } from 'node:https';
import { readFileSync } from 'node:fs';

const agent = new Agent({
  pfx: readFileSync(process.env.RNDS_CERT_PATH),
  passphrase: process.env.RNDS_CERT_PASS,
});

const r = await fetch('https://ehr-auth-hmg.saude.gov.br/api/token', { agent });
const token = await r.text();
```

Depois, o token vai no header em toda chamada ao EHR:

```js
await fetch(`https://${ehrHost}/api/fhir/r4/Bundle`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Authorization-Server': `Bearer ${token}`,
  },
  body: JSON.stringify(bundle),
});
```

:::caution[Certificado é segredo]
Nunca versione o `.pfx`, e nunca coloque a senha dele no código. Use variável de
ambiente ou um gerenciador de segredos. Um certificado vazado permite que
terceiros enviem dados em nome do estabelecimento.
:::

## Onde está o detalhamento

O comportamento completo: validade do token, renovação, códigos de erro - está
no [Manual de Integração do Barramento](https://datasus.saude.gov.br/wp-content/uploads/2020/04/SOA-RNDS_ManualIntegracaoBarramento_vSite.pdf)
e na [seção de segurança do Guia de Implementação](https://rnds-fhir.saude.gov.br/seguranca.html).

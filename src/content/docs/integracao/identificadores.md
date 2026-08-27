---
title: Identificadores
description: >-
  CPF, CNS, CNES e CBO no FHIR - como o Identifier funciona, por que a URI do
  system é condição de aceitação, e a validação local que evita ida e volta.
sidebar:
  order: 3
---

O FHIR identifica entidades por `Identifier`, que é essencialmente um par de
**sistema** e **valor**:

```json
{
  "identifier": [
    { "system": "<URI-canônica-do-CNS>", "value": "700000000000000" }
  ]
}
```

O `value` é o número. O `system` é a URI que diz *que tipo de número é aquele*.
Sem o `system` correto, o mesmo dígito poderia ser um CNS, um CPF ou um
protocolo interno - e o barramento não tem como saber.

## Os identificadores brasileiros

A RNDS publica NamingSystems para os identificadores nacionais:

| Sigla | O que identifica |
|---|---|
| **CPF** | Pessoa física |
| **CNS** | O indivíduo no SUS (Cartão Nacional de Saúde) |
| **CNES** | Estabelecimento de saúde |
| **CBO** | Ocupação do profissional (Classificação Brasileira de Ocupações) |

:::danger[Copie as URIs, não as escreva de memória]
A relação completa, com as URIs canônicas de cada um, está no
[índice de artefatos](https://rnds-fhir.saude.gov.br/artifacts.html), seção
*Naming Systems*.

**Copie de lá.** Escrever a URI de memória ou inventar uma que "pareça certa",
é uma das causas mais frequentes de rejeição de documento e o erro que volta
raramente aponta o campo.
:::

## Valide o dígito verificador localmente

CNS e CPF têm dígitos verificadores com algoritmos próprios. Validar antes de
enviar evita ida e volta desnecessária com o barramento,
transforma um erro remoto e genérico num erro local e específico.

```js
// CPF - 11 dígitos, dois verificadores por módulo 11
export function cpfValido(cpf) {
  const d = String(cpf).replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const dv = (ate) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += +d[i] * (ate + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };

  return dv(9) === +d[9] && dv(10) === +d[10];
}
```

O CNS tem regras distintas conforme o número comece com 1/2 (definitivo) ou 7/8/9
(provisório). Vale usar uma implementação testada em vez de escrever a sua: o
[kyriosdata/rnds](https://github.com/kyriosdata/rnds) traz utilitários prontos
em Java e JavaScript.

## Onde isso aparece no documento

- `Patient.identifier` - CNS e/ou CPF do indivíduo
- `Organization.identifier` - CNES do estabelecimento
- `Practitioner.identifier` - CPF ou CNS do profissional
- `PractitionerRole` - o vínculo, incluindo a ocupação em CBO

Repare que o profissional aparece em dois recursos: `Practitioner` é a pessoa,
`PractitionerRole` é o papel dela num estabelecimento. Confundir os dois é
comum e o perfil rejeita.

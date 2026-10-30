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
Nos documentos, as URIs dos identificadores estão nos perfis e nos exemplos de
cada guia por modelo, no [Guia de Implementação](https://fhir.saude.gov.br/). A
lista de NamingSystems está no
[índice de artefatos do guia anterior](https://rnds-fhir.saude.gov.br/artifacts.html),
seção *Sistemas de nomenclatura*: o guia de outubro de 2026 não publica essa
lista.

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

## Onde isso aparece

Há dois lugares, e as URIs são diferentes em cada um.

### No documento que você envia

Paciente, estabelecimento e profissional não entram como recursos: são
referenciados pelo identificador, e o perfil do modelo fixa o `system`. Repare
que ele é a URL de um **perfil**, não de um NamingSystem. Nos exemplos
oficiais:

| Quem | `system` (prefixo `http://www.saude.gov.br/fhir/r4/StructureDefinition/`) | Valor |
|---|---|---|
| Paciente | `BRIndividuo-1.0` | CPF ou CNS |
| Estabelecimento | `BREstabelecimentoSaude-1.0` | CNES |
| Lotação do profissional | `BRLotacaoProfissional-1.0` | `{CNS}-{CNES}` |
| Laboratório como pessoa jurídica (REL) | `BRPessoaJuridicaProfissionalLiberal-1.0` | CNPJ |

```json
"subject": {
  "identifier": {
    "system": "http://www.saude.gov.br/fhir/r4/StructureDefinition/BRIndividuo-1.0",
    "value": "706004324048847"
  }
}
```

Há exceções por modelo: o REDFM, por exemplo, inclui `PractitionerRole`,
`Practitioner` e `Organization` dentro do documento. Confira sempre o exemplo
oficial do seu modelo.

### Nas consultas à RNDS

Os recursos que a RNDS devolve nas consultas de `Patient` e `Practitioner` usam
os NamingSystems `http://rnds.saude.gov.br/fhir/r4/NamingSystem/cpf` e
`.../cns`, e é com eles que se busca pelo parâmetro `identifier`. Ver em
[serviços](/integracao/servicos/).

### Profissional: pessoa e papel

O profissional aparece em dois recursos: `Practitioner` é a pessoa,
`PractitionerRole` é o papel dela num estabelecimento, com a ocupação em CBO.
Na consulta à RNDS, o id do `PractitionerRole` combina os dois números:
`{CNS}-{CNES}`. Confundir pessoa e papel é comum, e o perfil rejeita.

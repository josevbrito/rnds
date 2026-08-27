---
title: FHIRPath
description: >-
  A linguagem de consulta do FHIR - por que navegar Bundles por índice quebra, e
  como extrair dados de forma robusta à ordem e à cardinalidade.
sidebar:
  order: 2
---

Navegar o JSON de um Bundle na mão funciona no primeiro documento e quebra no
segundo:

```js
bundle.entry[3].resource.name[0].given[0]   // frágil
```

Quebra por dois motivos: **a ordem das entradas não é garantida** (exceto a
primeira, que é sempre o `Composition`), e **a cardinalidade dos campos varia**, o
`name` pode ter zero, um ou vários itens.

## A solução

**FHIRPath** é a linguagem de consulta do FHIR. É o equivalente de XPath para
recursos FHIR:

```
Bundle.entry.resource.ofType(Patient).identifier
  .where(system = '<URI-do-CNS>').value
```

Essa expressão pega o CNS do paciente **sem depender de posição** e devolve
vazio em vez de explodir se o campo não existir.

## Os operadores que resolvem 90% dos casos

| Expressão | O que faz |
|---|---|
| `.ofType(Patient)` | Filtra por tipo de recurso |
| `.where(campo = 'valor')` | Filtra por condição |
| `.first()` / `.last()` | Pega um item da coleção |
| `.exists()` | Testa presença sem quebrar |
| `.select(...)` | Projeta um novo valor |
| `\|` | Une coleções |

O ponto conceitual que vale internalizar: em FHIRPath **tudo é coleção**. Um
campo singular é uma coleção de um item, um campo ausente é uma coleção vazia.
Por isso nada lança exceção de "undefined", o pior caso é vazio.

## Suporte nas bibliotecas

Praticamente toda biblioteca FHIR séria implementa FHIRPath. Vale procurar
antes de escrever navegação manual:

- **Java** - HAPI FHIR traz avaliador embutido
- **JavaScript/TypeScript** - `fhirpath.js`
- **.NET** - Firely SDK
- **Python** - implementações comunitárias, com cobertura variável

## Aplicado à RNDS

O Guia de Integração tem uma
[seção dedicada a FHIRPath](https://rnds-guia.saude.gov.br/docs/rnds/tools/fhirpath/)
com exemplos aplicados aos documentos brasileiros, vale ler porque os exemplos
usam as URIs e os perfis reais.

Para experimentar sem escrever código, o Simplifier tem um
[playground de FHIRPath](https://simplifier.net/fhirpath?scope=project%3ARedeNacionaldeDadosemSaude)
já no escopo do projeto da RNDS.

A especificação da linguagem está em [hl7.org/fhirpath](https://hl7.org/fhirpath/).

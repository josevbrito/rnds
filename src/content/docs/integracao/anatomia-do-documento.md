---
title: Anatomia do documento
description: >-
  Como um documento clínico da RNDS é estruturado: Bundle, Composition,
  referências por fullUrl e as três regras normativas que valem memorizar.
sidebar:
  order: 1
---

Aqui está a parte que costuma travar quem vem de integrações mais simples. Um
documento clínico FHIR **não é um objeto JSON plano** com os campos do
atendimento. É um **grafo de recursos**.

A estrutura é sempre a mesma:

```
Bundle (type: "document")
└── entry[0] → Composition    ← obrigatoriamente o primeiro
    ├── subject     → referencia o Patient
    ├── author      → referencia o Practitioner ou a Organization
    ├── custodian   → referencia a Organization
    └── section[]   → referencia os recursos clínicos
└── entry[1] → Patient
└── entry[2] → Organization
└── entry[3] → Observation
└── entry[n] → ...
```

## Três regras que valem memorizar

### A primeira entrada é sempre um `Composition`

Isso é **normativo** para Bundles do tipo `document`, veja em
[hl7.org/fhir/R4/bundle.html](https://hl7.org/fhir/R4/bundle.html). O
`Composition` é o índice do documento: ele não contém os dados clínicos, ele
aponta para quem contém.

### As referências internas usam `fullUrl`

Cada entrada do Bundle tem um `fullUrl`, normalmente um UUID `urn:uuid:...`, e
as referências entre recursos apontam para **esse valor**, não para um ID de
banco de dados.

O documento é **autocontido**: tudo que ele referencia está dentro dele. Essa é
a propriedade que permite arquivá-lo, assiná-lo e trocá-lo entre sistemas que
não compartilham banco.

### O documento é imutável

Conceitualmente, um documento clínico é um instantâneo assinado. Correções não
editam o documento original, **geram um novo que substitui o anterior**.

Se o seu modelo de dados assume atualização em campo, essa diferença de desenho
precisa ser resolvida antes de escrever código, não depois.

## Na prática

**Ler** um documento quase sempre envolve montar um índice de `fullUrl → recurso`
na entrada, e depois resolver as referências a partir do `Composition`:

```js
const porUrl = new Map(bundle.entry.map((e) => [e.fullUrl, e.resource]));
const composition = bundle.entry[0].resource;
const paciente = porUrl.get(composition.subject.reference);
```

**Escrever** envolve a inversão: gerar os UUIDs primeiro e amarrar as
referências depois. O passo a passo completo está em
[seu primeiro documento](/comecar/primeiro-documento/).

Para navegação mais robusta que índices posicionais, use em
[FHIRPath](/ferramentas/fhirpath/).

## Comece pelos exemplos reais

Os exemplos oficiais estão no
[índice de artefatos do Guia de Implementação](https://rnds-fhir.saude.gov.br/artifacts.html),
com instâncias completas de Bundle em JSON prontas para baixar.

**Comece por eles.** Ler um documento válido de verdade ensina mais rápido do
que qualquer descrição, inclusive esta.

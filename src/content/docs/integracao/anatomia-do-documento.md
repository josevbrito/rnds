---
title: Anatomia do documento
description: >-
  Como um documento clínico da RNDS é estruturado: Bundle, Composition,
  referências por fullUrl, paciente por identificador e as regras que valem
  memorizar.
sidebar:
  order: 1
---

Aqui está a parte que costuma travar quem vem de integrações mais simples. Um
documento clínico FHIR **não é um objeto JSON plano** com os campos do
atendimento. É um **grafo de recursos**.

A estrutura, como nos exemplos oficiais:

```
Bundle (type: "document")
├── identifier  → identificador local do documento, gerado pelo seu sistema
└── entry[0] → Composition       ← obrigatoriamente o primeiro
    ├── subject    → paciente, pelo identificador (CPF ou CNS)
    ├── author     → estabelecimento, pelo identificador (CNES)
    └── section[]  → aponta para os recursos clínicos, por fullUrl
└── entry[1] → Observation, Immunization, Encounter...
└── entry[n] → ...
```

## Regras que valem memorizar

### A primeira entrada é sempre um `Composition`

Isso é **normativo** para Bundles do tipo `document`, veja em
[hl7.org/fhir/R4/bundle.html](https://hl7.org/fhir/R4/bundle.html). O
`Composition` é o índice do documento: ele não contém os dados clínicos, ele
aponta para quem contém.

### Paciente e estabelecimento vão por identificador

O paciente **não vai dentro do documento**. Nos perfis da RNDS ele é referenciado
pelo identificador, e o perfil proíbe a referência a um recurso `Patient`:

```json
"subject": {
  "identifier": {
    "system": "http://www.saude.gov.br/fhir/r4/StructureDefinition/BRIndividuo-1.0",
    "value": "706004324048847"
  }
}
```

O estabelecimento segue o mesmo padrão, com o CNES e o `system`
`.../StructureDefinition/BREstabelecimentoSaude-1.0`. Repare que o `system` é a
URL de um perfil, não de um NamingSystem: parece errado, mas é o que o perfil
fixa. Os detalhes estão em [identificadores](/integracao/identificadores/).

Há exceções por modelo. No REDFM, por exemplo, o profissional e o estabelecimento
da dispensação vão dentro do documento, como `PractitionerRole`,
`Practitioner` e `Organization`. Confira sempre o exemplo oficial do seu modelo.

### Referências entre recursos do documento usam `fullUrl`

Cada entrada do Bundle tem um `fullUrl`, normalmente um UUID `urn:uuid:...`. Quando
um recurso do documento aponta para outro recurso **do próprio documento**, como
o `Composition` apontando para o resultado, a referência usa **esse valor**, não
um ID de banco de dados.

### O documento tem um identificador local

O `Bundle.identifier` carrega o identificador que o seu sistema deu ao
documento, com `system` `http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-`
seguido do número do solicitante. Guarde esse valor e o ID que a RNDS devolve no
envio: sem eles não há como consultar, substituir nem excluir o documento
depois. Ver em [serviços](/integracao/servicos/).

### O documento é imutável

Conceitualmente, um documento clínico é um instantâneo assinado. Correções não
editam o documento original, **geram um novo que substitui o anterior**, e cada
documento só pode ser substituído uma vez.

Se o seu modelo de dados assume atualização em campo, essa diferença de desenho
precisa ser resolvida antes de escrever código, não depois.

## Na prática

**Ler** um documento quase sempre envolve montar um índice de `fullUrl → recurso`
na entrada, e depois resolver as referências a partir do `Composition`. O
paciente, que não está no documento, se lê direto do identificador:

```js
const porUrl = new Map(bundle.entry.map((e) => [e.fullUrl, e.resource]));
const composition = bundle.entry[0].resource;

const paciente = composition.subject.identifier.value; // CPF ou CNS
const recursos = composition.section
  .flatMap((s) => s.entry ?? [])
  .map((ref) => porUrl.get(ref.reference));
```

**Escrever** envolve a inversão: gerar os UUIDs primeiro e amarrar as
referências depois. O passo a passo completo está em
[seu primeiro documento](/comecar/primeiro-documento/).

Para navegação mais robusta que índices posicionais, use
[FHIRPath](/ferramentas/fhirpath/).

## Comece pelos exemplos reais

Os exemplos oficiais estão na página de exemplos de cada guia por modelo do
[Guia de Implementação](https://fhir.saude.gov.br/), como os
[exemplos do REL](https://fhir.saude.gov.br/rel/pt-BR/exemplos.html), com
Bundles completos em JSON prontos para baixar.

**Comece por eles.** Ler um documento válido de verdade ensina mais rápido do
que qualquer descrição, inclusive esta.

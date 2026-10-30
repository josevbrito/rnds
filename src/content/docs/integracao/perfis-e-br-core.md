---
title: Perfis e BR Core
description: >-
  Onde estão os perfis FHIR da RNDS, como validar contra eles, e por que o BR
  Core, apesar do nome, não é a base deles.
sidebar:
  order: 2
---

FHIR é deliberadamente genérico: o recurso `Patient` da especificação base serve
para o mundo inteiro e por isso quase não tem campos obrigatórios. Cada contexto
aperta esse recurso com **perfis** (`StructureDefinition`), que dizem o que é
obrigatório, quais códigos são aceitos e quais extensões existem localmente.

No Brasil há dois conjuntos de perfis com nomes parecidos, e confundir os dois
custa tempo.

## Os perfis da RNDS

Estão no Guia de Implementação oficial, em
[fhir.saude.gov.br](https://fhir.saude.gov.br/), com um guia por modelo de
informação. Cada guia reúne os perfis, as extensões, as terminologias e os
exemplos do seu modelo, e publica um pacote para o validador em
`https://fhir.saude.gov.br/{modelo}/package.tgz`.

É contra esses perfis que o documento precisa estar conforme. Nos exemplos
oficiais, cada recurso declara em `meta.profile` o perfil que segue: o
`Composition` de um REL, por exemplo, aponta para
`http://www.saude.gov.br/fhir/r4/StructureDefinition/BRResultadoExameLaboratorial-3.2.1`.

O guia anterior, em [rnds-fhir.saude.gov.br](https://rnds-fhir.saude.gov.br/),
segue no ar com o build de 2022.

## O BR Core não é a base deles

O [BR Core](https://hl7.org.br/fhir/core/) é o núcleo FHIR brasileiro de uso
geral, pacote `br.gov.saude.br-core.fhir`, em **STU1 (versão 1.7.1, de outubro
de 2026)**. Define perfis como `BRCorePatient`, `BRCorePractitioner` e
`BRCoreOrganization`, e foi desenvolvido pela Secretaria de Informação e Saúde
Digital com apoio do HL7 International e da OPAS.

**Mas os perfis da RNDS não derivam dele.** Nos pacotes do Guia de Implementação
de outubro de 2026, nenhum dos sete (o geral e os seis modelos publicados)
declara dependência do BR Core, e os perfis do REL e do RAC herdam direto dos
recursos base do FHIR R4.

:::caution[Correção]
Versões anteriores deste guia descreviam a RNDS como uma camada acima do BR
Core. Não é o que os pacotes oficiais mostram. Se você encontrar essa descrição
em outro material, desconfie da data dele.
:::

## O que isso muda na prática

- **Valide contra o pacote do seu modelo**, não contra o BR Core. Validar só
  contra o BR Core não diz nada sobre a conformidade com a RNDS. Ver em
  [validação](/ferramentas/validacao/).
- **Quando um campo parece arbitrário**, a explicação está no perfil do modelo,
  na página *Artefatos* do guia correspondente. O erro do validador traz a URL
  do perfil violado, que leva direto a ela.
- **O BR Core continua sendo a referência** para perfis brasileiros de uso
  geral, fora dos modelos da RNDS.

## Sobre o Simplifier

Há também o projeto da RNDS no **Simplifier**, em
[simplifier.net/redenacionaldedadosemsaude](https://simplifier.net/redenacionaldedadosemsaude).

É útil para navegar e experimentar: tem consulta por FQL, inspeção via FHIRPath
e validação direto no navegador.

:::caution[O Simplifier não é o repositório oficial]
A própria página avisa: **não é o repositório oficial da RNDS** e parte dos
artefatos ainda está marcada como *draft*.

Para decisões de implementação, o que vale é o `fhir.saude.gov.br`. Use o
Simplifier para explorar, não para decidir.
:::

## Você precisa criar perfis?

Quase certamente não. A RNDS já definiu os perfis e integrar não exige criar
novos. Ferramentas de modelagem como o [Forge](https://simplifier.net/forge) só
entram em cena se o seu caso envolver estender a modelagem, o que é raro em
projeto de integração.

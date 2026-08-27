---
title: Perfis e BR Core
description: >-
  As duas camadas de perfil FHIR no Brasil (BR Core e RNDS) e por que saber em
  qual delas um erro de validação nasceu acelera o diagnóstico.
sidebar:
  order: 2
---

FHIR é deliberadamente genérico: o recurso `Patient` da especificação base serve
para o mundo inteiro e por isso quase não tem campos obrigatórios. Cada país
aperta esse recurso com **perfis** (`StructureDefinition`), que dizem o que é
obrigatório, quais códigos são aceitos e quais extensões existem localmente.

No Brasil isso acontece em **duas camadas**.

## Camada 1 - BR Core

O núcleo nacional, publicado em [hl7.org.br/fhir/core](https://hl7.org.br/fhir/core/),
pacote `br.gov.saude.br-core.fhir`.

Define os perfis brasileiros de uso geral: `BRCorePatient`,
`BRCorePractitioner`, `BRCoreOrganization` e afins. Foi desenvolvido pela
Secretaria de Informação e Saúde Digital com apoio do HL7 International e da
OPAS, e está em **STU1 (versão 1.1.0, de 2023)**.

## Camada 2 - RNDS

A camada específica da rede, publicada em
[rnds-fhir.saude.gov.br](https://rnds-fhir.saude.gov.br/).

Deriva do BR Core e acrescenta o que a RNDS precisa: perfis de amostra
biológica, condição de saúde, diagnóstico laboratorial, estabelecimento e
profissional. Traz também mais de 25 ValueSets (categorias de exame, etnias,
municípios, ocupações, nomes de exames em LOINC e GAL) e as extensões
brasileiras: nacionalidade, raça/cor, naturalização, atendimento SUS.

## Por que a hierarquia importa

Entender essa estrutura poupa tempo de duas formas.

**Primeira:** quando um campo parece arbitrário no perfil da RNDS, a explicação
normalmente está no BR Core, uma camada abaixo. Ir direto à camada certa evita
procurar no lugar errado.

**Segunda, e mais prática:** um erro de validação pode vir do BR Core e não da
RNDS. Saber em qual camada o perfil violado está acelera muito o diagnóstico, isso 
é a diferença entre "por que esse campo é obrigatório?" e "ah, isso é regra
nacional geral, não da rede".

## Sobre o Simplifier

Há também o projeto da RNDS no **Simplifier**, em
[simplifier.net/redenacionaldedadosemsaude](https://simplifier.net/redenacionaldedadosemsaude).

É útil para navegar e experimentar: tem consulta por FQL, inspeção via FHIRPath
e validação direto no navegador.

:::caution[O Simplifier não é o repositório oficial]
A própria página avisa: **não é o repositório oficial da RNDS** e parte dos
artefatos ainda está marcada como *draft*.

Para decisões de implementação, o que vale é o `rnds-fhir.saude.gov.br`. Use o
Simplifier para explorar, não para decidir.
:::

## Você precisa criar perfis?

Quase certamente não. A RNDS já definiu os perfis e integrar não exige criar
novos. Ferramentas de modelagem como o [Forge](https://simplifier.net/forge) só
entram em cena se o seu caso envolver estender a modelagem, o que é raro em
projeto de integração.

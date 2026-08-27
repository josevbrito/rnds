---
title: Por que FHIR
description: >-
  O padrão HL7 usado pela RNDS, o modelo de recursos do FHIR R4, e a vantagem
  prática sobre os layouts posicionais dos sistemas legados.
sidebar:
  order: 2
---

**FHIR** (Fast Healthcare Interoperability Resources) é o padrão do HL7 para
troca de informação em saúde. A RNDS usa a versão **R4 (4.0.1)**.

O modelo do FHIR é composto por *recursos*: unidades de informação com
significado clínico ou administrativo bem definido.

- `Patient` descreve um indivíduo
- `Observation` descreve uma medição ou um resultado
- `Immunization` descreve uma dose aplicada
- `Organization` descreve um estabelecimento

E assim por diante, a especificação R4 tem cerca de 145 recursos.

Um documento clínico não é um recurso solto: é um conjunto de recursos que se
referenciam, empacotados em um `Bundle`. Como isso se monta na prática está em
[anatomia do documento](/integracao/anatomia-do-documento/).

## A vantagem prática sobre o layout antigo

Um arquivo posicional só está errado quando o sistema receptor reclama. Um
documento FHIR pode ser **validado com o perfil antes de sair da sua
máquina**.

Essa é a diferença que muda o dia a dia do projeto: o ciclo de feedback deixa de
depender do outro lado. Você coloca o
[validador oficial no CI](/ferramentas/validacao/) e passa a detectar regressão
de estrutura em segundos, não em dias.

## O preço disso

FHIR é mais verboso e mais indireto que um registro posicional. Ler um documento
envolve resolver referências entre recursos em vez de fatiar uma string por
posição. Quem espera um objeto JSON plano com os campos do atendimento leva um
susto na primeira vez.

Vale a pena conhecer [FHIRPath](/ferramentas/fhirpath/) cedo: é a linguagem de
consulta do padrão, e resolve boa parte do incômodo de navegar o grafo na mão.

## Onde está a especificação

- [Especificação FHIR R4](https://hl7.org/fhir/R4/) - a referência completa
- [Recurso Bundle](https://hl7.org/fhir/R4/bundle.html) - o empacotamento de documentos
- [Ecossistema FHIR no guia da RNDS](https://rnds-guia.saude.gov.br/docs/rnds/tecnologias/)

O FHIR base é deliberadamente genérico e serve o mundo inteiro. O que aperta
esse padrão para o Brasil são os perfis, assunto de
[perfis e BR Core](/integracao/perfis-e-br-core/).

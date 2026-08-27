---
title: Como conseguir acesso
description: >-
  O processo de credenciamento junto ao DATASUS, quem faz o quê, o que é
  indelegável, e por que isso costuma ser o gargalo do projeto.
sidebar:
  order: 7
---

Este é o trecho burocrático, e vale conhecê-lo cedo porque **o prazo aqui
costuma ser o gargalo do projeto, não o desenvolvimento**.

## O fluxo

1. **O gestor do estabelecimento** obtém um certificado digital em uma conta
   gov.br.
2. Solicita acesso pelo
   [Portal de Serviços do DATASUS](https://servicos-datasus.saude.gov.br/).
3. Aprovada a solicitação, o DATASUS emite o **identificador do solicitante** e
   libera o ambiente de **homologação**.
4. O integrador desenvolve a solução e produz as **evidências** de conformidade.
5. Com as evidências aprovadas, o software é homologado para **produção**.

O fluxo oficial, com as telas do portal, está em
[rnds-guia.saude.gov.br/docs/passo-a-passo](https://rnds-guia.saude.gov.br/docs/passo-a-passo/).

## O que é indelegável

**As etapas 1 e 2 são do gestor do estabelecimento.** O desenvolvedor não
consegue destravar isso sozinho: não é questão de permissão no sistema, é
questão de quem tem legitimidade para representar o estabelecimento.

Consequência prática para o cronograma: se você está começando um projeto com
prazo, **dispare esse processo no primeiro dia** e desenvolva contra ambiente
local enquanto ele corre. Deixar para pedir acesso quando o código estiver
pronto é a forma mais confiável de estourar a data.

## Enquanto o acesso não sai

Boa parte do trabalho de integração não depende de credencial: montar o Bundle,
resolver referências, validar contra os perfis, tratar os identificadores,
escrever os testes. Veja
[testando sem acesso](/ferramentas/testando-sem-acesso/) e
[seu primeiro documento](/comecar/primeiro-documento/).

## Dúvidas de processo

Quem pode solicitar, o que conta como estabelecimento e prazos está no
[FAQ oficial da RNDS](https://rnds.saude.gov.br/perguntas-e-respostas/).

A seção de [credenciamento do Guia de Implementação](https://rnds-fhir.saude.gov.br/credenciamento.html)
traz o roteiro do lado técnico.

:::note
Este guia não intermedeia acesso, não emite certificado e não tem canal com o
DATASUS. Se o seu processo travou, o caminho é o suporte oficial pelo Portal de
Serviços.
:::

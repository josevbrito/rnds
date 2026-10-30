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

O credenciamento tem duas fases: primeiro o acesso à homologação, depois o
acesso à produção.

1. **O gestor do estabelecimento** providencia o certificado digital e uma conta
   gov.br, se ainda não tiver.
2. Solicita acesso pelo
   [Portal de Serviços do DATASUS](https://servicos-datasus.saude.gov.br/), no
   botão "Solicitar Acesso" do serviço.
3. Aprovada a solicitação, a RNDS fornece o **identificador do solicitante** e
   libera o ambiente de **homologação**.
4. O integrador desenvolve a solução, confere a conformidade e produz as
   **evidências**.
5. O gestor solicita acesso à **produção** pelo mesmo portal e aguarda a
   resposta do DATASUS.

O fluxo oficial, com as telas do portal, está na
[seção de credenciamento do Guia de Implementação](https://fhir.saude.gov.br/pt-BR/credenciamento.html).

## Os detalhes que travam

**O certificado** é ICP-Brasil, tipo A1: o e-CNPJ do estabelecimento principal
ou o e-CPF da pessoa responsável pela solicitação. Ele fica associado ao
estabelecimento, ou à lista de estabelecimentos, informado no pedido. Veja em
[autenticação](/integracao/autenticacao/).

**Vários estabelecimentos numa solicitação** precisam ser todos da mesma UF. A
credencial vale para uma UF só, e a RNDS bloqueia envios para o endereço de
outra.

**O identificador do solicitante** fica no menu "Gerenciar Credenciais" do
Portal de Serviços. É ele que entra no identificador de todo documento enviado,
no `system` `http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-{número}`. Ver
em [anatomia do documento](/integracao/anatomia-do-documento/).

**As evidências para pedir produção** são três, segundo o Guia de
Implementação:

- um print do validador local mostrando a validação com sucesso;
- um print do header da resposta de criação do registro na RNDS;
- um print do Bundle enviado.

Vale guardar esses três desde o primeiro envio bem-sucedido em homologação, em
vez de refazer o caminho depois.

## O que é indelegável

**As etapas 1, 2 e 5 são do gestor do estabelecimento.** O desenvolvedor não
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

A seção de [credenciamento do Guia de Implementação](https://fhir.saude.gov.br/pt-BR/credenciamento.html)
traz o roteiro do lado técnico. Segundo ela, o integrador também pode abrir
chamado com a equipe técnica do DATASUS, pelo Suporte ao Usuário, se tiver
dúvidas nos testes.

:::note
Este guia não intermedeia acesso, não emite certificado e não tem canal com o
DATASUS. Se o seu processo travou, o caminho é o suporte oficial pelo Portal de
Serviços.
:::

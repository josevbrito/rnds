---
title: Erros comuns
description: >-
  O que mais consome tempo de quem está começando a integrar com a RNDS e como
  reconhecer cada caso rápido.
---

Uma lista do que mais consome tempo de quem está começando. Vale ler antes de
gastar o tempo, não depois.

## Usar o header `Authorization` em vez de `X-Authorization-Server`

O barramento espera o segundo. O erro resultante costuma ser genérico e **não
aponta o header**, o que faz muita gente procurar problema no certificado, no
token ou no corpo da requisição.

Se a autenticação parece correta e a chamada falha mesmo assim, confira o nome
do header primeiro. → [Autenticação](/integracao/autenticacao/)

## Errar a URI do `system` nos identificadores

CPF, CNS e CNES têm URIs canônicas específicas, publicadas nos NamingSystems do
Guia de Implementação. **Copie de lá**, não escreva de memória e não invente uma
URI que "pareça certa". Ver em [Identificadores](/integracao/identificadores/).

## Montar o Bundle sem `Composition` na primeira posição

Para Bundles do tipo `document` isso é normativo. O validador acusa, mas a
mensagem nem sempre é óbvia, costuma falar de perfil, não de ordem. Ver em
 [Anatomia do documento](/integracao/anatomia-do-documento/).

## Referenciar recursos por ID em vez de `fullUrl`

Dentro de um documento, as referências apontam para o `fullUrl` das entradas do
próprio Bundle, tipicamente `urn:uuid:...`. Referenciar o ID do seu banco
produz um documento que não é autocontido e que o outro lado não consegue
resolver.

## Assumir que homologação é aberta

Não é. Sem certificado e sem aprovação do DATASUS, **não há endpoint que
responda**, nem em homologação. Isso surpreende quem está acostumado com
sandbox público de outras APIs. Ver em [Ambientes](/integracao/ambientes/).

## Testar só o caminho feliz

O barramento rejeita documentos por motivos que não aparecem nos exemplos:
código fora do ValueSet, dígito verificador inválido, campo obrigatório do
perfil ausente. Vale montar casos de teste **negativos** desde cedo.

## Confundir os dois níveis de perfil

Um erro de validação pode vir do **BR Core** e não da **RNDS**. Saber em qual
camada o perfil violado está acelera muito o diagnóstico. Ver em
[Perfis e BR Core](/integracao/perfis-e-br-core/).

## Implementar contra a portaria errada

Este é o erro mais caro, porque só aparece tarde. Os modelos são substituídos:
o RAC foi inteiramente refeito em 2025 e RPM/RDM deram lugar a REPM/REDFM em
2024.

Pior: a lista oficial de legislação no gov.br está incompleta, então checar só
ali não basta. Ver em [Linha do tempo da legislação](/legislacao/).

## Confundir `Practitioner` com `PractitionerRole`

`Practitioner` é a pessoa. `PractitionerRole` é o papel dela num
estabelecimento, incluindo a ocupação em CBO. Colocar o vínculo no recurso
errado é rejeitado pelo perfil.

## Deixar o pedido de acesso para o fim

O gargalo do projeto raramente é o desenvolvimento, é a burocracia de acesso,
que depende do gestor do estabelecimento e não do desenvolvedor. Dispare no dia
1. [Como conseguir acesso](/integracao/acesso/)

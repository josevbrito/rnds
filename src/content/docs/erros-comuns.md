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

## Colocar o paciente dentro do documento

Nos perfis da RNDS o paciente não entra como recurso `Patient`: vai por
identificador, em `subject.identifier`, e o perfil proíbe apontar para um
recurso. O mesmo costuma valer para o estabelecimento. Quem vem de FHIR
genérico monta o documento com `Patient` dentro e só descobre na validação. Ver
em [Anatomia do documento](/integracao/anatomia-do-documento/).

## Errar a URI do `system` nos identificadores

Nos documentos, o `system` do paciente e do estabelecimento é a URL de um
perfil, como `http://www.saude.gov.br/fhir/r4/StructureDefinition/BRIndividuo-1.0`,
e não de um NamingSystem. Parece errado, e por isso é comum "corrigir" para a
URI que parece certa. **Copie dos exemplos oficiais**, não escreva de memória.
Ver em [Identificadores](/integracao/identificadores/).

## Montar o Bundle sem `Composition` na primeira posição

Para Bundles do tipo `document` isso é normativo. O validador acusa, mas a
mensagem nem sempre é óbvia, costuma falar de perfil, não de ordem. Ver em
 [Anatomia do documento](/integracao/anatomia-do-documento/).

## Referenciar recursos por ID em vez de `fullUrl`

Quando um recurso do documento aponta para outro recurso do próprio Bundle, a
referência usa o `fullUrl` da entrada, tipicamente `urn:uuid:...`. Referenciar o
ID do seu banco produz um documento que o outro lado não consegue resolver.

## Assumir que homologação é aberta

Não é. Sem certificado e sem aprovação do DATASUS, **não há endpoint que
responda**, nem em homologação. Isso surpreende quem está acostumado com
sandbox público de outras APIs. Ver em [Ambientes](/integracao/ambientes/).

## Testar só o caminho feliz

O barramento rejeita documentos por motivos que não aparecem nos exemplos:
código fora do ValueSet, dígito verificador inválido, campo obrigatório do
perfil ausente. Vale montar casos de teste **negativos** desde cedo.

## Validar contra o pacote errado

Os perfis da RNDS não derivam do BR Core, então validar contra ele não diz nada
sobre a conformidade com a RNDS. Valide contra o pacote do seu modelo, em
`https://fhir.saude.gov.br/{modelo}/package.tgz`. Ver em
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

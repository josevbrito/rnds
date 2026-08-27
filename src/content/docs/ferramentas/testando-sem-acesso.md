---
title: Testando sem acesso
description: >-
  O que dá para desenvolver e testar antes de ter credencial da RNDS - exemplos
  oficiais, servidor FHIR local, dados sintéticos e os limites de cada um.
sidebar:
  order: 3
---

Você **não precisa de credencial para começar a escrever código**. Boa parte do
trabalho de integração (montar o Bundle, resolver referências, validar contra
os perfis, tratar os identificadores) pode ser feita e testada localmente.

Como o [processo de acesso](/integracao/acesso/) costuma ser o gargalo do
cronograma, saber trabalhar em paralelo com ele vale semanas.

## Use os exemplos oficiais como massa de teste

O [índice de artefatos](https://rnds-fhir.saude.gov.br/artifacts.html) traz
instâncias completas de Bundle em JSON.

Baixe **todas**, coloque no seu diretório de fixtures e escreva os testes do
leitor contra elas. São documentos válidos, produzidos pela mesma fonte que
define os perfis e não há massa de teste melhor disponível publicamente.

## Suba um servidor FHIR local

O [HAPI FHIR](https://hapifhir.io/) é a implementação de referência em Java e
roda em container. Você consegue dar `POST` nos Bundles de exemplo e ver como um
servidor FHIR real reage: buscas, paginação, formato de erro.

Há também um [servidor público de testes](http://hapi.fhir.org/), recomendado
pelo próprio guia da RNDS, se você não quiser subir nada.

:::caution[Limite do HAPI]
Nem o HAPI local nem o público carregam os perfis brasileiros por padrão. Eles
servem para exercitar **mecânica FHIR**, não **conformidade RNDS**. Para
conformidade, use o [validador](/ferramentas/validacao/).
:::

## Gere volume com dados sintéticos

O [Synthea](https://github.com/synthetichealth/synthea) gera históricos
completos de pacientes fictícios como Bundles FHIR R4. É a forma mais rápida de
produzir milhares de documentos para testar desempenho, paralelismo e tratamento
de erro.

Os Bundles saem nos **perfis americanos**, não nos brasileiros. Servem como
**massa** para exercitar throughput e parsing e não como teste de
conformidade.

## Leia a coleção Postman

A [coleção Postman do kyriosdata/rnds](https://github.com/kyriosdata/rnds/blob/master/tools/postman/rnds-postman-collection.json)
documenta a forma exata das requisições ao barramento. É excelente material de
leitura mesmo sem poder executá-la: mostra headers, corpo e sequência de
chamadas antes de você ter qualquer credencial.

## Um aviso sobre dados de teste

:::danger[Nunca use dado real de paciente]
Não use dados reais de pacientes em ambiente de desenvolvimento e **não coloque
documentos clínicos reais em repositório (nem que seja privado)**.

Dado de saúde é dado pessoal sensível sob a LGPD e o regime é mais restritivo
que o de dado pessoal comum. Os exemplos oficiais e o Synthea existem exatamente
para evitar essa tentação.
:::

## O que só dá para testar com acesso

Para calibrar expectativa, o que **não** dá para exercitar localmente:

- O comportamento real de erro do barramento
- A latência e os limites de vazão de produção
- O fluxo de token e o header `X-Authorization-Server` de ponta a ponta
- A topologia por UF de produção (homologação é nacional e única)

Vale desenhar o código de forma que essas partes fiquem isoladas atrás de uma
interface, assim o resto continua testável sem rede.

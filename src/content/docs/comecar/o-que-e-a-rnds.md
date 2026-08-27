---
title: O que é a RNDS
description: >-
  A plataforma nacional de interoperabilidade em saúde do Brasil, o que ela muda
  em relação aos sistemas legados do SUS, e o que isso significa para quem
  desenvolve.
sidebar:
  order: 1
---

A **Rede Nacional de Dados em Saúde** é a plataforma nacional de
interoperabilidade em saúde do Brasil, projeto estruturante do programa Conecte
SUS. Foi instituída juridicamente pela [Portaria nº 1.434, de 28 de maio de
2020](/legislacao/#portaria-1434-2020).

Na prática, ela funciona como um barramento: estabelecimentos de saúde
(públicos e privados) enviam registros clínicos padronizados e esses registros
ficam disponíveis para outros pontos da rede de atenção que tenham autorização
para consultá-los.

## O que muda em relação aos sistemas legados

A diferença que importa é a **unidade de troca**. Em vez de arquivos de remessa
em layout posicional, processados em lote, a RNDS trabalha com **documentos
clínicos estruturados**, trocados via API, no padrão HL7 FHIR.

Para quem desenvolve, isso significa três coisas:

1. Você vai produzir e consumir **JSON**, não arquivos de largura fixa.
2. A conformidade é verificável **automaticamente**, contra perfis publicados,
   antes de o documento sair da sua máquina.
3. O acesso é **autenticado por certificado digital** em mTLS, não por FTP com
   usuário e senha.

O terceiro ponto é o que mais surpreende quem vem de integrações mais simples
e é o que costuma atrasar o projeto. Veja
[como conseguir acesso](/integracao/acesso/).

## Governança

A RNDS é gerida pela **SEIDIGI** (Secretaria de Informação e Saúde Digital) do
Ministério da Saúde, através do **DATASUS**, com acompanhamento do **Comitê
Gestor de Saúde Digital (CGSD)**.

O enquadramento de política pública vem da [Estratégia de Saúde Digital para o
Brasil 2020-2028](/legislacao/#gm-ms-3632-2020), instituída pela Portaria GM/MS
nº 3.632/2020, documento útil quando é preciso justificar o projeto para quem
decide orçamento.

## Onde ficam as fontes oficiais

A documentação está distribuída em cinco lugares e saber qual serve para o quê
poupa tempo:

| Onde | Para quê |
|---|---|
| [rnds.saude.gov.br](https://rnds.saude.gov.br/) | Portal institucional e FAQ |
| [rnds-guia.saude.gov.br](https://rnds-guia.saude.gov.br/) | Guia narrativo: ambientes, serviços, passo a passo |
| [rnds-fhir.saude.gov.br](https://rnds-fhir.saude.gov.br/) | **A referência canônica** dos perfis FHIR e dos exemplos |
| [servicos-datasus.saude.gov.br](https://servicos-datasus.saude.gov.br/) | Solicitação de acesso (exige conta gov.br) |
| [gov.br/saude — SEIDIGI](https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/legislacao) | Legislação, mas veja o aviso abaixo |

:::caution[A lista oficial de legislação está incompleta]
Em agosto de 2026, a página de legislação da RNDS no gov.br não listava a
Portaria GM/MS nº 6.100/2024 (REPM e REDFM) nem a GM/MS nº 8.347/2025 (novo
modelo do RAC). A [linha do tempo deste guia](/legislacao/) marca explicitamente
quais normas estão ausentes de lá.
:::

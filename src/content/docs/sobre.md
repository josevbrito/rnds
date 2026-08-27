---
title: Sobre este guia
description: >-
  O que este guia é e o que não é, a metodologia por trás dele, como contribuir
  e sob que licença o conteúdo está publicado.
---

## O que é

Um guia de referência, em português, para quem precisa integrar sistemas de
saúde à RNDS. Reúne num lugar só o que hoje está espalhado entre o gov.br, o
Guia de Implementação FHIR, o Guia de Integração, o Simplifier e o Portal de
Serviços do DATASUS.

## O que não é

**Não é material oficial.** Não tem vínculo com o Ministério da Saúde, com o
DATASUS nem com o HL7. As fontes oficiais estão linkadas ao longo do texto e
**devem sempre prevalecer** sobre o que está escrito aqui.

Não intermedeia acesso, não emite certificado e não tem canal com o DATASUS.

## Metodologia

Três regras sustentam o conteúdo:

1. **Toda afirmação técnica precisa de fonte pública linkada.**.
2. **Toda afirmação carrega data de verificação**, mostrada na página. Conteúdo
   normativo muda por portaria..
3. **Nada de dado real de paciente**, em nenhuma hipótese (nem em exemplo, nem
   em teste, nem "anonimizado por cima").

Na prática isso significa que o conteúdo factual não vive em prosa: vive em
arquivos YAML versionados, com campos `fontes` e `verificado_em` obrigatórios,
validados por schema no build. As tabelas do site são renderizadas a partir
deles e o mesmo dado é publicado como [JSON aberto](/dados/).

Se um registro referencia uma portaria que não existe no catálogo, **o site não
compila**. É proposital.

## Por que ele existe

Porque juntar essa documentação é a primeira semana de trabalho de qualquer
integrador e todo mundo refaz esse mesmo trabalho do zero.

E porque há uma lacuna concreta: a página oficial de legislação da RNDS está
incompleta. Em agosto de 2026 ela não listava a Portaria GM/MS nº 6.100/2024,
que instituiu o REPM e o REDFM, nem a GM/MS nº 8.347/2025, que substituiu o
modelo do RAC. Quem confia só nela implementa o modelo errado.

## Como contribuir

O projeto é aberto. A contribuição mais valiosa **não é código** e sim, avisar que
saiu portaria nova ou que algo aqui está errado ou desatualizado.

- [Abrir uma issue](https://github.com/josevbrito/rnds/issues/new/choose) (há
  templates para "saiu portaria nova", "isto está errado" e "modelo mudou")
- [Ler o CONTRIBUTING](https://github.com/josevbrito/rnds/blob/main/CONTRIBUTING.md)
- [Ver o repositório](https://github.com/josevbrito/rnds)

## Licença

- **Texto e dados** - [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br).
  Use como quiser, inclusive comercialmente, citando a origem.
- **Código** - MIT.

Textos de portaria, lei e decreto não são protegidos por direito autoral no
Brasil ([Lei nº 9.610/1998, art. 8º, IV](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm)),
então a compilação normativa aqui é lícita.

## Publicidade

Este site **não exibe anúncios**. Se isso mudar no futuro, será sinalizado de
forma explícita e sem rastreamento invasivo e este parágrafo será atualizado.

## Autoria

Mantido por [José Victor Brito](https://josevbrito.com).

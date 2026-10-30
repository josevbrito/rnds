---
title: Validação
description: >-
  O validador oficial do HL7, como rodá-lo contra o pacote do seu modelo da
  RNDS, e por que colocar validação no CI muda o ciclo de feedback do projeto.
sidebar:
  order: 1
---

Esta é a etapa que separa "o JSON abriu" de "o documento está conforme".

A ferramenta de referência é o **validador oficial do HL7**, o
`validator_cli.jar`. Roda em Java e valida um recurso contra os perfis de um
Implementation Guide. Para a RNDS, o guia é o do seu modelo, cujo pacote fica em
`https://fhir.saude.gov.br/{modelo}/package.tgz`:

```bash
java -jar validator_cli.jar documento.json \
  -version 4.0.1 \
  -ig https://fhir.saude.gov.br/rel/package.tgz
```

Não valide contra o BR Core: os perfis da RNDS não derivam dele, então passar no
BR Core não diz nada sobre a conformidade com a RNDS. Veja em
[perfis e BR Core](/integracao/perfis-e-br-core/). O validador confere cada
recurso contra o perfil declarado em `meta.profile`, como fazem os exemplos
oficiais.

O JAR é publicado nas
[releases do org.hl7.fhir.core](https://github.com/hapifhir/org.hl7.fhir.core/releases).
A documentação de uso está no
[Confluence do HL7](https://confluence.hl7.org/spaces/FHIR/pages/35718580/Using+the+FHIR+Validator).

## Duas recomendações práticas

**Use sempre a versão mais recente do validador**, independentemente da versão
de FHIR que você está validando. Ele é retrocompatível e recebe correções
constantes, rodar uma versão antiga significa perder diagnósticos que já foram
melhorados.

**Coloque a validação no CI.** Esta é a recomendação que mais muda o projeto:

- Se o seu sistema **gera** documentos, validá-los a cada build custa segundos e
  pega regressão de estrutura antes que ela chegue ao barramento.
- Se o seu sistema **consome** documentos, validar por amostragem detecta
  mudança de contrato do outro lado - antes que ela vire incidente.

```yaml
# .github/workflows/fhir.yml - esboço
- name: Validar documentos gerados
  run: |
    curl -sL -o validator_cli.jar \
      https://github.com/hapifhir/org.hl7.fhir.core/releases/latest/download/validator_cli.jar
    java -jar validator_cli.jar tests/fixtures/*.json \
      -version 4.0.1 \
      -ig https://fhir.saude.gov.br/rel/package.tgz   # troque rel pelo seu modelo
```

## Diagnosticando o erro

Quando a validação falha, a primeira pergunta útil é **qual perfil foi
violado**. A mensagem traz a URL do `StructureDefinition`, e ele está na página
*Artefatos* do guia do seu modelo, com a explicação de cada campo. Ler o perfil
encurta muito a investigação.

A segunda pergunta é se o erro é de **estrutura** (campo obrigatório ausente,
cardinalidade errada) ou de **terminologia** (código fora do ValueSet). São
problemas de natureza diferente: o primeiro é seu, o segundo costuma ser de
mapeamento de domínio.

## Alternativas para validação exploratória

Para checagem pontual, sem montar pipeline:

- O [Simplifier](https://simplifier.net/redenacionaldedadosemsaude) valida direto
  no navegador
- O [kyriosdata/rnds](https://github.com/kyriosdata/rnds) inclui um validador de
  linha de comando com foco na RNDS

Nenhum dos dois substitui o validador oficial no CI, mas ambos são úteis para
responder rápido a "por que este documento não passa?".

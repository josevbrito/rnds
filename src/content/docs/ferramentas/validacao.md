---
title: Validação
description: >-
  O validador oficial do HL7, como rodá-lo contra os perfis brasileiros, e por
  que colocar validação no CI muda o ciclo de feedback do projeto.
sidebar:
  order: 1
---

Esta é a etapa que separa "o JSON abriu" de "o documento está conforme".

A ferramenta de referência é o **validador oficial do HL7**, o
`validator_cli.jar`. Roda offline, em Java, e valida um recurso contra os perfis
de um Implementation Guide:

```bash
java -jar validator_cli.jar documento.json \
  -version 4.0.1 \
  -ig br.gov.saude.br-core.fhir
```

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
      -ig br.gov.saude.br-core.fhir
```

## Diagnosticando o erro

Quando a validação falha, a primeira pergunta útil é **em qual camada o perfil
violado está** como BR Core ou RNDS. As duas camadas estão explicadas em
[perfis e BR Core](/integracao/perfis-e-br-core/) e saber distinguir encurta
muito a investigação.

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

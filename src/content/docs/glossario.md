---
title: Glossário
description: >-
  As siglas da RNDS e do FHIR brasileiro explicadas, como CMD, CNS, CNES, CBO,
  SEIDIGI, LOINC, ValueSet, IG e as demais que aparecem na documentação oficial.
---

A documentação oficial da RNDS assume familiaridade com um vocabulário que
mistura três mundos: administração pública brasileira, SUS e padrões
internacionais de saúde. Esta página junta tudo.

## Instituições e governança

**RNDS** - Rede Nacional de Dados em Saúde. A plataforma nacional de
interoperabilidade em saúde. Ver mais em [O que é a RNDS](/comecar/o-que-e-a-rnds/).

**Conecte SUS** - Programa do Ministério da Saúde do qual a RNDS é o projeto
estruturante. Instituído pela [Portaria nº 1.434/2020](/legislacao/#portaria-1434-2020).

**SEIDIGI** - Secretaria de Informação e Saúde Digital do Ministério da Saúde.
É quem gere a RNDS.

**DATASUS** - Departamento de Informática do SUS. Opera a plataforma e conduz o
credenciamento dos integradores.

**CGSD** - Comitê Gestor de Saúde Digital. Acompanha a execução.

**SAES** - Secretaria de Atenção Especializada à Saúde. Aparece como órgão
emissor de algumas portarias.

**ESD28** - Estratégia de Saúde Digital para o Brasil 2020-2028. O enquadramento
de política pública. Ver mais em [Portaria GM/MS 3.632/2020](/legislacao/#gm-ms-3632-2020)

## Identificadores brasileiros

**CNS** - Cartão Nacional de Saúde. O identificador do indivíduo no SUS.

**CPF** - Cadastro de Pessoas Físicas.

**CNES** - Cadastro Nacional de Estabelecimentos de Saúde. Identifica o
estabelecimento.

**CBO** - Classificação Brasileira de Ocupações. Codifica a ocupação do
profissional de saúde.

Ver mais em [Identificadores](/integracao/identificadores/).

## Modelos de informação

**Modelo de Informação** é a especificação que define quais campos um tipo de
documento clínico deve conter. Cada um é instituído por portaria.

**CMD** - Conjunto Mínimo de Dados.

**RAC** - Registro de Atendimento Clínico.

**REL** - Resultado de Exame Laboratorial.

**RIA** - Registro de
Imunobiológico Administrado.

**RIRA** - Registro de Informações de Regulação
Assistencial.

**SA** - Sumário de Alta.

**SAO** - Sumário de Alta Obstétrico.

**REPM** - Registro Eletrônico da Prescrição de Medicamentos.

**REDFM** - Registro Eletrônico de Dispensação ou Fornecimento de Medicamentos.

**RPM** e **RDM** - modelos de prescrição e dispensação de 2022, sucedidos por
REPM e REDFM.

**RIA-R** e **RIA-C** - os dois fluxos do RIA: rotina e campanha, processados
separadamente.

**OBM** - a base de medicamentos referenciada pelo REDFM.

Ver mais em  [Todos os modelos](/modelos/).

## Padrões e terminologia

**FHIR** - Fast Healthcare Interoperability Resources. O padrão do HL7 para
troca de informação em saúde. A RNDS usa a versão **R4 (4.0.1)**.

**HL7** - Health Level Seven International, a organização que mantém o FHIR.

**Recurso** (*resource*) - a unidade de informação do FHIR, com significado
clínico ou administrativo definido: `Patient`, `Observation`, `Organization`.

**Bundle** - o empacotamento de vários recursos. Documentos clínicos usam
`Bundle` do tipo `document`.

**Composition** - o índice do documento. Obrigatoriamente a primeira entrada de
um Bundle do tipo `document`.

**fullUrl** - o identificador de cada entrada do Bundle, ao qual as referências
internas apontam. Tipicamente `urn:uuid:...`.
Ver mais em [Anatomia do documento](/integracao/anatomia-do-documento/).

**Perfil** / **StructureDefinition** - a restrição local de um recurso FHIR:
o que é obrigatório, quais códigos valem, quais extensões existem.

**IG** - Implementation Guide. O pacote publicado com perfis, ValueSets,
exemplos e documentação.

**BR Core** - o núcleo FHIR brasileiro, do qual os perfis da RNDS derivam.
Ver mais em [Perfis e BR Core](/integracao/perfis-e-br-core/).

**CodeSystem** - o conjunto de códigos definidos para um domínio.
Ex.: `BRTipoDocumento`.

**ValueSet** - o subconjunto de códigos aceito num campo específico.

**NamingSystem** - a definição da URI canônica de um identificador (CPF, CNS,
CNES).

**Extensão** - mecanismo do FHIR para acrescentar campos não previstos no
padrão base. A RNDS define extensões brasileiras: nacionalidade, raça/cor,
naturalização, atendimento SUS.

**FHIRPath** - a linguagem de consulta do FHIR.
Ver mais em [FHIRPath](/ferramentas/fhirpath/).

**LOINC** - Logical Observation Identifiers Names and Codes. Padrão
internacional para codificar exames laboratoriais.

**GAL** - Gerenciador de Ambiente Laboratorial. Aparece em ValueSets de nomes de
exame.

## Integração

**Barramento** - o termo usado na documentação oficial para o serviço de troca
de mensagens da RNDS.

**EHR** - Electronic Health Record. Na RNDS, nomeia o endereço de troca de
dados, distinto do endereço de autenticação. Em produção varia por UF.
Ver mais em [Ambientes](/integracao/ambientes/).

**mTLS** - autenticação mútua TLS. Cliente e servidor apresentam certificado.

**ICP-Brasil** - a infraestrutura de chaves públicas brasileira.

**A1** - o tipo de certificado exigido: arquivo `.pfx`/`.p12`, diferente do A3
em token físico.

**X-Authorization-Server** - o header onde vai o token de acesso. **Não** é o
`Authorization` convencional. Ver mais em [Autenticação](/integracao/autenticacao/).

**Homologação** - o ambiente de testes. Exige credencial: não é aberto.

**Evidências** - os artefatos de conformidade que o integrador produz em
homologação para obter aprovação em produção.

## Legal

**LGPD** - Lei Geral de Proteção de Dados. Dado de saúde é dado pessoal
**sensível**, com regime mais restritivo que o de dado pessoal comum.

**Portaria** - o instrumento normativo que institui cada modelo de informação.
Ver mais em [Linha do tempo](/legislacao/).

**DOU** - Diário Oficial da União, onde as portarias são publicadas.

**BVS Saúde Legis** - a base de legislação em saúde da Biblioteca Virtual em
Saúde. Útil para achar texto integral de portaria.

**CONASS** - Conselho Nacional de Secretários de Saúde. Publica os informes que,
em alguns casos, são a fonte pública mais acessível de uma portaria nova.

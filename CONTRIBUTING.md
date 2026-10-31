# Como contribuir

A contribuição mais valiosa para este projeto **não é código**. É avisar que
saiu portaria nova ou que algo aqui está errado.

A legislação da RNDS muda com frequência e a própria lista oficial do gov.br
está incompleta. Sua contribuição é muito importante.

## As três regras

Elas não são burocracia: são o que separa este guia de mais um blog desatualizado.

### 1. Toda afirmação técnica precisa de fonte pública linkada

Se não dá para apontar a documentação oficial, não entra. Sem exceção para
"eu sei porque trabalho com isso" , o leitor não tem como verificar.

### 2. Toda afirmação carrega data de verificação

Todo registro em `src/data/` tem `verificado_em`, e essa data aparece
renderizada na página. Se você edita um registro, **atualize a data** e só
atualize se você realmente abriu a fonte e conferiu.

Data mentirosa é pior que data velha.

### 3. Nada de dado real de paciente

Em nenhuma hipótese: nem em exemplo, nem em teste, nem "anonimizado por cima".

Dado de saúde é dado pessoal sensível sob a LGPD, com regime mais restritivo que
o de dado pessoal comum. Use os exemplos oficiais do Guia de Implementação ou o
[Synthea](https://github.com/synthetichealth/synthea).

## O jeito mais fácil de ajudar

[Abra uma issue.](https://github.com/josevbrito/rnds/issues/new/choose) Há
templates para:

- **Saiu portaria nova** - pede número, data, ementa e link. Leva 30 segundos.
- **Isto está errado** - exige o link da fonte que comprova.
- **Modelo mudou** - quando um modelo de informação é substituído.

Você não precisa saber Astro, nem abrir PR. Uma issue bem preenchida já resolve.

Se preferir apoiar financeiramente, as opções estão na seção
[Apoie do README](README.md#apoie).

## Se quiser abrir PR

### Onde o conteúdo mora

**Fato estruturado vive em YAML, não em prosa.** Se você quer corrigir uma
portaria, um endpoint ou uma ferramenta, o arquivo é um destes:

```
src/data/portarias.yaml     legislação
src/data/modelos.yaml       modelos de informação
src/data/servicos.yaml      serviços web e endpoints
src/data/ambientes.yaml     homologação e produção
src/data/ferramentas.yaml   ecossistema
src/data/novidades.yaml     mudanças relevantes (página, RSS e aviso)
```

As tabelas do site e os endpoints `/api/*.json` são renderizados a partir
deles. **Nunca escreva uma tabela à mão em MDX**, se o dado aparece em mais de
um lugar, ele pertence ao YAML.

Texto explicativo vive em `src/content/docs/`.

As páginas em `src/content/docs/modelos/` são **geradas**. Não edite à mão:
edite `modelos.yaml` e rode `npm run gerar:modelos` (o `npm run build` também
roda o gerador).

Um modelo pode ter um guia próprio, com texto explicativo além da ficha: crie
`src/guias-modelo/{id}.mdx`. O gerador incorpora o guia à página do modelo,
depois da ficha. Um `description` no frontmatter do guia substitui o resumo do
YAML na busca. Hoje só o RIA tem guia.

### Quando registrar uma novidade

Toda entrada em `novidades.yaml` vira item no RSS e aviso para quem volta ao
site. Registre só o que muda a vida de quem integra: portaria nova, modelo que
mudou, fonte oficial que mudou de lugar, correção de algo que o site ensinava
errado, ou guia novo de um modelo. Ajuste em guia que já existe, correção de
texto, link ou digitação não entra.

A novidade não tem `fontes` própria: ela aponta para as portarias, os modelos
ou a página onde a fonte já está.

### Rodando localmente

Precisa de **Node 22+** (há um `.nvmrc`):

```bash
nvm use
npm install
npm run dev
```

### Antes de abrir o PR

```bash
npm run validar   # integridade do dataset
npm run build     # build completo
```

O validador falha se:

- houver id duplicado
- uma referência apontar para registro inexistente
- faltar `fontes` ou `verificado_em` em algum registro
- alguma URL de fonte for inválida
- `verificado_em` estiver no futuro
- uma novidade não apontar para nenhuma portaria, modelo ou página existente

E o `build` roda o validador antes de qualquer coisa, então dataset quebrado
não chega a virar site.

## O que este projeto não aceita

- Afirmação sem fonte
- Dado real de paciente, sob qualquer pretexto
- Conteúdo copiado de material com licença restritiva
  (texto de portaria é livre - [Lei 9.610/98, art. 8º, IV](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm))
- Link de afiliado ou publicidade embutida no texto

## Licença das contribuições

Ao contribuir você concorda em licenciar o texto sob
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br) e o código
sob MIT - as mesmas licenças do projeto.

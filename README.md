# Guia RNDS para Desenvolvedores

Guia aberto e independente de integração com a **Rede Nacional de Dados em
Saúde**, publicado em **[rnds.josevbrito.com](https://rnds.josevbrito.com)**.

Reúne num lugar só o que hoje está espalhado entre o gov.br, o Guia de
Implementação FHIR, o Guia de Integração, o Simplifier e o Portal de Serviços do
DATASUS com a fonte linkada e a data de verificação em cada afirmação.

> **Material independente e não oficial.** Sem vínculo com o Ministério da
> Saúde, o DATASUS ou o HL7. As fontes oficiais sempre prevalecem.

## Por que existe

Juntar essa documentação é a primeira semana de trabalho de qualquer integrador,
e todo mundo refaz esse mesmo trabalho do zero.

E há uma lacuna concreta: **a página oficial de legislação da RNDS está
incompleta.** Em agosto de 2026 ela não listava a Portaria GM/MS nº 6.100/2024,
que instituiu o REPM e o REDFM, nem a GM/MS nº 8.347/2025, que substituiu
integralmente o modelo do RAC. Quem confia só nela implementa o modelo errado.

Outro efeito colateral disso: muito material em circulação ainda fala em "os
sete tipos de documento" da RNDS. **São onze modelos**, entraram SAO, RIRA,
REPM e REDFM.

## Dados abertos

Todo o conteúdo estruturado é publicado como JSON, com CORS liberado:

| Endpoint | Conteúdo |
|---|---|
| `/api/portarias.json` | Legislação |
| `/api/modelos.json` | Modelos de informação |
| `/api/servicos.json` | Serviços web |
| `/api/ambientes.json` | Homologação e produção |
| `/api/ferramentas.json` | Ecossistema |
| `/api/tudo.json` | Tudo num arquivo só |

```bash
# Quais normas faltam na lista oficial do gov.br?
curl -s https://rnds.josevbrito.com/api/portarias.json \
  | jq '.portarias[] | select(.ausente_da_lista_oficial) | {numero, data}'
```

Documentação em [/dados](https://rnds.josevbrito.com/dados/).

## Arquitetura

O princípio: **fato estruturado vive em YAML, não em prosa.**

```
src/
├── data/           ← fonte da verdade (YAML)
├── schemas/        ← Zod, valida os YAML no build
├── content/docs/   ← as páginas
├── components/     ← renderizam as tabelas a partir do YAML
├── lib/            ← formatação e serialização do dataset
└── pages/api/      ← endpoints JSON
scripts/
├── validar-dados.mjs        ← integridade; roda antes do build
└── gerar-paginas-modelos.mjs ← gera src/content/docs/modelos/
```

Nenhuma tabela é escrita à mão. Isso dá consistência entre páginas, contribuição
fácil (edita-se YAML, não HTML) e o dataset público de graça.

Cada registro carrega obrigatoriamente `fontes` e `verificado_em`, sem isso o
build falha.

## Rodando localmente

Requer **Node 22+**:

```bash
nvm use          # há um .nvmrc
npm install
npm run dev      # http://localhost:4321
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Valida o dataset e constrói o site |
| `npm run validar` | Só a checagem de integridade |
| `npm run gerar:modelos` | Regenera as páginas de modelo a partir do YAML |
| `npm run preview` | Serve o build local |

Stack: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build),
publicado na Vercel. Busca offline via Pagefind, sem JavaScript de terceiros.

## Contribuindo

A contribuição mais valiosa não é código, é avisar que saiu portaria nova.
[Abra uma issue](https://github.com/josevbrito/rnds/issues/new/choose); há
template para isso e leva 30 segundos.

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir PR.

## Publicidade

Este site **não exibe anúncios**. O componente `AdSlot` existe e é inerte:
não renderiza nada, não carrega script e não usa cookie enquanto
`PUBLIC_ADS_ENABLED` não for `true`.

## Licença

- **Texto e dados** - [CC BY 4.0](LICENSE-CONTENT)
- **Código** - [MIT](LICENSE)

Textos de portaria, lei e decreto não são protegidos por direito autoral no
Brasil ([Lei nº 9.610/1998, art. 8º, IV](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm)).

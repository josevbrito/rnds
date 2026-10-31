#!/usr/bin/env node
/**
 * Gera as páginas MDX de src/content/docs/modelos/ a partir de
 * src/data/modelos.yaml.
 *
 * As páginas geradas carregam o frontmatter (título, descrição e ordem na
 * sidebar, que o Starlight e o SEO precisam ver como arquivo real) e a ficha,
 * que lê o YAML em tempo de render via <FichaModelo />.
 *
 * Guia opcional por modelo: se existir src/guias-modelo/{id}.mdx, o conteúdo
 * dele entra na página depois da ficha. Ele é copiado, não importado, para os
 * títulos aparecerem no índice "Nesta página". No guia:
 *   - um frontmatter com `description` substitui o resumo do YAML na busca;
 *   - os imports sobem para o topo da página gerada, e caminhos relativos
 *     devem ser escritos a partir de src/content/docs/modelos/.
 *
 * Roda sozinho no `npm run build`. Para ver uma mudança no `npm run dev`:
 *   npm run gerar:modelos
 */
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'src/data/modelos.yaml');
const destino = join(raiz, 'src/content/docs/modelos');
const guias = join(raiz, 'src/guias-modelo');

const modelos = yaml.load(await readFile(origem, 'utf8'));

await mkdir(destino, { recursive: true });

const escapar = (s) => s.replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();

const MAX_DESCRICAO = 155;

const resumir = (texto) => {
  const t = escapar(texto);
  if (t.length <= MAX_DESCRICAO) return t;

  const corte = t.lastIndexOf(' ', MAX_DESCRICAO - 1);
  return t.slice(0, corte).replace(/[\s,;:.\-–—]+$/, '') + '…';
};

const badge = (status) =>
  ({
    historico: "\n    badge: { text: 'histórico', variant: 'note' }",
    homologacao: "\n    badge: { text: 'homologação', variant: 'caution' }",
    planejado: "\n    badge: { text: 'planejado', variant: 'tip' }",
  })[status] ?? '';

/** Lê o guia do modelo, se houver: frontmatter, imports e corpo separados. */
const lerGuia = async (id) => {
  const arquivo = join(guias, `${id}.mdx`);
  if (!existsSync(arquivo)) return null;

  let texto = await readFile(arquivo, 'utf8');
  let meta = {};
  const fm = texto.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    meta = yaml.load(fm[1]) ?? {};
    texto = texto.slice(fm[0].length);
  }

  // Só os imports do começo do arquivo: um `import` dentro de bloco de código
  // do guia é exemplo, não dependência.
  const linhas = texto.split('\n');
  const imports = [];
  while (linhas.length && (linhas[0].startsWith('import ') || linhas[0].trim() === '')) {
    const linha = linhas.shift();
    if (linha.trim()) imports.push(linha);
  }
  const corpo = linhas.join('\n').trim();

  return { meta, imports, corpo };
};

const gerados = new Set();

for (const m of modelos) {
  const arquivo = `${m.id}.mdx`;
  gerados.add(arquivo);

  const guia = await lerGuia(m.id);
  const descricao = resumir(guia?.meta.description ?? m.resumo);
  const imports = ["import FichaModelo from '../../../components/FichaModelo.astro';", ...(guia?.imports ?? [])];
  const origemTexto = guia
    ? `src/data/modelos.yaml (ficha) e src/guias-modelo/${m.id}.mdx (guia)`
    : 'src/data/modelos.yaml';

  const conteudo = `---
title: ${m.sigla} - ${m.nome}
description: "${descricao}"
sidebar:
    label: ${m.sigla}
    order: ${m.ordem ?? 99}${badge(m.status)}
---

${imports.join('\n')}

{/* Página gerada por scripts/gerar-paginas-modelos.mjs, não edite à mão.
    Para mudar o conteúdo, edite ${origemTexto}. */}

<FichaModelo id="${m.id}" />
${guia ? `\n${guia.corpo}\n` : ''}`;

  await writeFile(join(destino, arquivo), conteudo, 'utf8');
}

// Remoção das páginas de modelos que saíram do YAML, mas preserva o índice.
for (const existente of await readdir(destino)) {
  if (existente === 'index.mdx' || gerados.has(existente)) continue;
  await unlink(join(destino, existente));
  console.log(`removido (não está mais no YAML): ${existente}`);
}

// Guia sem modelo correspondente provavelmente é erro de digitação no nome.
if (existsSync(guias)) {
  const ids = new Set(modelos.map((m) => m.id));
  for (const arquivo of await readdir(guias)) {
    const id = arquivo.replace(/\.mdx$/, '');
    if (arquivo.endsWith('.mdx') && !ids.has(id)) {
      console.warn(`aviso: src/guias-modelo/${arquivo} não corresponde a nenhum modelo do YAML.`);
    }
  }
}

console.log(`${modelos.length} páginas de modelo geradas em src/content/docs/modelos/`);

#!/usr/bin/env node
/**
 * Gera as páginas MDX de src/content/docs/modelos/ a partir de
 * src/data/modelos.yaml.
 *
 * As páginas geradas carregam apenas frontmatter: título, descrição e ordem na
 * sidebar, que o Starlight e o SEO precisam ver como arquivo real. Todo o
 * conteúdo factual vem do YAML em tempo de render, via <FichaModelo />.
 *
 * Rode depois de adicionar ou renomear um modelo:
 *   node scripts/gerar-paginas-modelos.mjs
 */
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'src/data/modelos.yaml');
const destino = join(raiz, 'src/content/docs/modelos');

const modelos = yaml.load(await readFile(origem, 'utf8'));

await mkdir(destino, { recursive: true });

const escapar = (s) => s.replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();

const badge = (status) =>
  ({
    historico: "\n    badge: { text: 'histórico', variant: 'note' }",
    homologacao: "\n    badge: { text: 'homologação', variant: 'caution' }",
    planejado: "\n    badge: { text: 'planejado', variant: 'tip' }",
  })[status] ?? '';

const gerados = new Set();

for (const m of modelos) {
  const arquivo = `${m.id}.mdx`;
  gerados.add(arquivo);

  const conteudo = `---
title: ${m.sigla} - ${m.nome}
description: "${escapar(m.resumo).slice(0, 155)}"
sidebar:
    label: ${m.sigla}
    order: ${m.ordem ?? 99}${badge(m.status)}
---

import FichaModelo from '../../../components/FichaModelo.astro';

{/* Página gerada por scripts/gerar-paginas-modelos.mjs, não edite à mão.
    Para mudar o conteúdo, edite src/data/modelos.yaml. */}

<FichaModelo id="${m.id}" />
`;

  await writeFile(join(destino, arquivo), conteudo, 'utf8');
}

// Remoção das páginas de modelos que saíram do YAML, mas preserva o índice.
for (const existente of await readdir(destino)) {
  if (existente === 'index.mdx' || gerados.has(existente)) continue;
  await unlink(join(destino, existente));
  console.log(`removido (não está mais no YAML): ${existente}`);
}

console.log(`${modelos.length} páginas de modelo geradas em src/content/docs/modelos/`);

#!/usr/bin/env node
/**
 * Validação de integridade do dataset, roda ANTES do build.
 *
 * Existe porque o Astro loga referência quebrada como [ERROR] mas ainda assim
 * termina com exit code 0. Isso significaria publicar um site com link morto
 * para uma portaria inexistente sem que nada avisasse.
 *
 * Confere:
 *   1. ids únicos dentro de cada coleção
 *   2. toda referência entre coleções resolve
 *   3. todo registro tem ao menos uma fonte com URL válida
 *   4. todo registro tem `verificado_em`, e a data não está no futuro
 *   5. modelo com status "historico" aponta para o sucessor
 *
 * Uso: node scripts/validar-dados.mjs
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dados = join(raiz, 'src/data');

/** campo -> coleção que ele referencia. `[]` marca campo de lista. */
const REFERENCIAS = {
  portarias: {
    'modelos[]': 'modelos',
    'revoga[]': 'portarias',
    'revogada_por[]': 'portarias',
    'altera[]': 'portarias',
  },
  modelos: {
    portaria_vigente: 'portarias',
    'portarias[]': 'portarias',
    sucedido_por: 'modelos',
    sucede: 'modelos',
  },
};

const COLECOES = ['portarias', 'modelos', 'servicos', 'ambientes', 'ferramentas'];

const erros = [];
const avisos = [];
const falha = (m) => erros.push(m);

const carregar = async (nome) =>
  yaml.load(await readFile(join(dados, `${nome}.yaml`), 'utf8'));

const tudo = Object.fromEntries(
  await Promise.all(COLECOES.map(async (c) => [c, await carregar(c)]))
);

// 1. ids únicos
const ids = {};
for (const [colecao, registros] of Object.entries(tudo)) {
  if (!Array.isArray(registros)) {
    falha(`${colecao}.yaml: esperava uma lista no topo do arquivo.`);
    continue;
  }
  ids[colecao] = new Set();
  for (const [i, r] of registros.entries()) {
    if (!r?.id) {
      falha(`${colecao}.yaml[${i}]: registro sem campo "id".`);
      continue;
    }
    if (ids[colecao].has(r.id)) falha(`${colecao}.yaml: id duplicado "${r.id}".`);
    ids[colecao].add(r.id);
  }
}

// 2. referências entre coleções
for (const [colecao, campos] of Object.entries(REFERENCIAS)) {
  for (const r of tudo[colecao] ?? []) {
    for (const [campo, alvo] of Object.entries(campos)) {
      const lista = campo.endsWith('[]');
      const nome = lista ? campo.slice(0, -2) : campo;
      const valor = r[nome];
      if (valor === undefined || valor === null) continue;

      for (const ref of lista ? valor : [valor]) {
        if (!ids[alvo]?.has(ref)) {
          falha(
            `${colecao}.yaml -> "${r.id}": campo ${nome} referencia "${ref}", ` +
              `que não existe em ${alvo}.yaml.`
          );
        }
      }
    }
  }
}

// 3 e 4. rastreabilidade, a regra editorial do projeto
const hoje = new Date();
hoje.setUTCHours(23, 59, 59, 999);

for (const [colecao, registros] of Object.entries(tudo)) {
  for (const r of registros ?? []) {
    if (!Array.isArray(r?.fontes) || r.fontes.length === 0) {
      falha(`${colecao}.yaml -> "${r?.id}": sem "fontes". Toda afirmação precisa de fonte pública.`);
    } else {
      for (const f of r.fontes) {
        try {
          const u = new URL(f.url);
          if (!/^https?:$/.test(u.protocol)) throw new Error();
        } catch {
          falha(`${colecao}.yaml -> "${r.id}": fonte com URL inválida (${f?.url}).`);
        }
      }
    }

    if (!r?.verificado_em) {
      falha(`${colecao}.yaml -> "${r?.id}": sem "verificado_em".`);
    } else {
      const d = new Date(r.verificado_em);
      if (Number.isNaN(d.getTime())) {
        falha(`${colecao}.yaml -> "${r.id}": "verificado_em" não é data válida.`);
      } else if (d > hoje) {
        falha(`${colecao}.yaml -> "${r.id}": "verificado_em" está no futuro.`);
      } else {
        const meses = (hoje - d) / (1000 * 60 * 60 * 24 * 30.44);
        if (meses > 12) {
          avisos.push(
            `${colecao}.yaml -> "${r.id}": conferido há ${Math.floor(meses)} meses. Vale revisar.`
          );
        }
      }
    }
  }
}

// 5. coerência dos modelos históricos
for (const m of tudo.modelos ?? []) {
  if (m.status === 'historico' && !m.sucedido_por) {
    avisos.push(
      `modelos.yaml -> "${m.id}": marcado como histórico mas sem "sucedido_por". ` +
        `Quem lê a página fica sem saber o que usar no lugar.`
    );
  }
}

// Relatório
for (const a of avisos) console.warn(`  aviso: ${a}`);

if (erros.length > 0) {
  console.error(`\n✗ ${erros.length} problema(s) de integridade no dataset:\n`);
  for (const e of erros) console.error(`  • ${e}`);
  console.error('');
  process.exit(1);
}

const total = COLECOES.reduce((n, c) => n + (tudo[c]?.length ?? 0), 0);
console.log(
  `✓ dataset íntegro - ${total} registros em ${COLECOES.length} coleções` +
    (avisos.length ? `, ${avisos.length} aviso(s)` : '')
);

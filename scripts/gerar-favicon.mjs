#!/usr/bin/env node
/**
 * Rasteriza public/favicon.svg nos PNGs de fallback.
 *
 * Favicon SVG cobre navegador moderno, mas não Safari antigo nem o ícone de
 * "adicionar à tela de início" no iOS, daí os PNGs.
 *
 * Rode se mudar o desenho da chama:
 *   npm run gerar:favicon
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = await readFile(join(raiz, 'public/favicon.svg'));

const TRANSPARENTE = { r: 0, g: 0, b: 0, alpha: 0 };
const CREME = { r: 255, g: 251, b: 235, alpha: 1 }; // #fffbeb

const saidas = [
  { arquivo: 'favicon-32.png', tamanho: 32, fundo: TRANSPARENTE },
  { arquivo: 'favicon-192.png', tamanho: 192, fundo: TRANSPARENTE },
  { arquivo: 'favicon-512.png', tamanho: 512, fundo: TRANSPARENTE },
  // Tela de início do iOS: sem fundo, a chama iria contra preto.
  { arquivo: 'favicon-180.png', tamanho: 180, fundo: CREME, margem: 0.12 },
];

for (const { arquivo, tamanho, fundo, margem = 0 } of saidas) {
  const util = Math.round(tamanho * (1 - margem * 2));
  const borda = Math.round((tamanho - util) / 2);

  let img = sharp(svg, { density: 512 }).resize(util, util, {
    fit: 'contain',
    background: TRANSPARENTE,
  });

  if (borda > 0 || fundo.alpha === 1) {
    img = img.extend({
      top: borda,
      bottom: tamanho - util - borda,
      left: borda,
      right: tamanho - util - borda,
      background: fundo,
    }).flatten({ background: fundo });
  }

  const png = await img.png({ compressionLevel: 9 }).toBuffer();
  await writeFile(join(raiz, 'public', arquivo), png);

  const tipo = fundo.alpha === 1 ? 'fundo creme' : 'transparente';
  console.log(`  ${arquivo.padEnd(18)} ${tamanho}x${tamanho}  ${tipo.padEnd(13)} ${(png.length / 1024).toFixed(1)} KB`);
}

console.log(`${saidas.length} PNGs gerados em public/`);

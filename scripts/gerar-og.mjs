#!/usr/bin/env node
/**
 * Gera public/og.png, a imagem que aparece quando um link do site é colado no
 * WhatsApp, LinkedIn, Slack ou X.
 * 
 * Rode se mudar o título, a descrição ou o desenho da chama:
 *   npm run gerar:og
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

// Proporção 1200x630
const LARGURA = 1200;
const ALTURA = 630;

// Mesmos tokens de src/styles/custom.css, tema escuro.
const FUNDO = '#0c0a09';
const CREME = '#fffbeb';
const AMBAR = '#fbbf24';
const CINZA = '#a1a1aa';
const CINZA_FRACO = '#71717a';

// A chama.
const CHAMA = `
  <path d="M12.6 0.4c0.4 5.2 3.9 7.2 6.5 10.4 2.1 2.6 2.9 5.3 2.9 8.1 0 6.1-4.5 10.7-10 10.7S2 25 2 18.9c0-3.5 1.4-5.9 3.4-8.1C7.8 8.2 9.3 6.6 9.6 3.4c1.6 1.5 2.3 3.2 2.4 5.3 0.6-2.9 0.7-5.6 0.6-8.3z" fill="url(#cf)"/>
  <path d="M12.3 12.1c0.2 2.7 2 3.8 3.3 5.4 1.1 1.4 1.5 2.8 1.5 4.3 0 3.2-2.3 5.6-5.1 5.6s-5.1-2.4-5.1-5.6c0-1.8 0.7-3.1 1.7-4.2 1.2-1.4 2-2.2 2.2-3.9 0.8 0.8 1.2 1.7 1.2 2.8 0.3-1.5 0.4-2.9 0.3-4.4z" fill="url(#cd)"/>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}">
  <defs>
    <linearGradient id="cf" x1="12" y1="0" x2="12" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="cd" x1="12" y1="12" x2="12" y2="29" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="brilho" cx="0.12" cy="0.18" r="0.55">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${LARGURA}" height="${ALTURA}" fill="${FUNDO}"/>
  <rect width="${LARGURA}" height="${ALTURA}" fill="url(#brilho)"/>

  <!-- A barra âmbar à esquerda repete o motivo do aviso de material não
       oficial, que no site também marca o conteúdo com uma borda lateral. -->
  <rect x="0" y="0" width="14" height="${ALTURA}" fill="${AMBAR}"/>

  <g transform="translate(88 96) scale(4.2)">${CHAMA}</g>

  <g font-family="DejaVu Sans" fill="${CREME}">
    <text x="88" y="330" font-size="76" font-weight="bold">Guia RNDS</text>
    <text x="88" y="412" font-size="76" font-weight="bold">para Desenvolvedores</text>

    <text x="88" y="482" font-size="29" fill="${CINZA}">Legislação, modelos FHIR, serviços e ferramentas.</text>
    <text x="88" y="524" font-size="29" fill="${CINZA}">Cada afirmação com fonte pública e data de verificação.</text>

    <text x="88" y="586" font-size="26" fill="${AMBAR}">rnds.josevbrito.com</text>
    <text x="1120" y="586" font-size="24" fill="${CINZA_FRACO}" text-anchor="end">Material independente, não oficial</text>
  </g>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(join(raiz, 'public/og.png'), png);

console.log(`  og.png  ${LARGURA}x${ALTURA}  ${(png.length / 1024).toFixed(1)} KB`);

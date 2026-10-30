import type { APIRoute } from 'astro';
import { novidadesOrdenadas } from '../lib/novidades';

/**
 * RSS 2.0 das novidades, escrito à mão: são poucos campos e não justifica uma
 * dependência. As datas vêm do YAML, não do relógio do build, então o feed só
 * muda quando há novidade de fato.
 */
const escapar = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const novidades = await novidadesOrdenadas();
  const pagina = new URL('/novidades/', site).href;
  const proprio = new URL('/novidades.xml', site).href;

  const itens = novidades
    .map((n) => {
      const link = `${pagina}#${n.id}`;
      return `    <item>
      <title>${escapar(n.titulo)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${n.data.toUTCString()}</pubDate>
      <description>${escapar(n.texto)}</description>
    </item>`;
    })
    .join('\n');

  const ultima = novidades[0]?.data.toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Guia RNDS para Desenvolvedores - Novidades</title>
    <link>${pagina}</link>
    <atom:link href="${proprio}" rel="self" type="application/rss+xml" />
    <description>Portarias novas, modelos de informação que mudaram e fontes oficiais que mudaram de lugar. Material independente e não oficial.</description>
    <language>pt-BR</language>
${ultima ? `    <lastBuildDate>${ultima}</lastBuildDate>\n` : ''}${itens}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};

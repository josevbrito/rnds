import { getCollection, getEntry } from 'astro:content';

/**
 * Novidades da mais recente para a mais antiga, com portarias e modelos já
 * resolvidos. A página, o RSS e o aviso leem daqui para nunca discordarem da
 * ordem.
 *
 * No mesmo dia, desempata pelo id em ordem alfabética: o loader do Astro não
 * preserva a ordem do arquivo YAML.
 */
export async function novidadesOrdenadas() {
  const entradas = await getCollection('novidades');

  const ordenadas = [...entradas].sort(
    (a, b) => b.data.data.getTime() - a.data.data.getTime() || a.id.localeCompare(b.id)
  );

  return Promise.all(
    ordenadas.map(async (n) => ({
      id: n.id,
      ...n.data,
      portarias: (await Promise.all(n.data.portarias.map((r) => getEntry(r)))).filter(
        (p) => p !== undefined
      ),
      modelos: (await Promise.all(n.data.modelos.map((r) => getEntry(r)))).filter(
        (m) => m !== undefined
      ),
    }))
  );
}

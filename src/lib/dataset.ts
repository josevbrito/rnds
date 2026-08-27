import { getCollection } from 'astro:content';

/**
 * Serialização do dataset público.
 *
 * As referências entre coleções são objetos { collection, id } internos do
 * Astro. Para consumo externo elas viram strings de id, quem baixa o JSON não
 * deve precisar saber como o Astro guarda referência.
 */
type Ref = { collection: string; id: string };

const ehRef = (v: unknown): v is Ref =>
  typeof v === 'object' && v !== null && 'collection' in v && 'id' in v;

const limpar = (valor: unknown): unknown => {
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  if (Array.isArray(valor)) return valor.map(limpar);
  if (ehRef(valor)) return valor.id;
  if (typeof valor === 'object' && valor !== null) {
    return Object.fromEntries(
      Object.entries(valor).map(([k, v]) => [k, limpar(v)])
    );
  }
  return valor;
};

async function serializar(nome: 'portarias' | 'modelos' | 'servicos' | 'ambientes' | 'ferramentas') {
  const entradas = await getCollection(nome as any);
  return entradas.map((e: any) => ({ id: e.id, ...(limpar(e.data) as object) }));
}

export const LICENCA = {
  dados: 'CC BY 4.0',
  url: 'https://creativecommons.org/licenses/by/4.0/deed.pt-br',
  atribuicao: 'Guia RNDS para Desenvolvedores - rnds.josevbrito.com',
  aviso:
    'Material independente e não oficial, compilado de fontes públicas. ' +
    'Sem vínculo com o Ministério da Saúde, o DATASUS ou o HL7. ' +
    'As fontes oficiais prevalecem.',
  fonte: 'https://github.com/josevbrito/rnds',
};

/** Envelope padrão de todas as respostas. */
export async function dataset(
  nome: 'portarias' | 'modelos' | 'servicos' | 'ambientes' | 'ferramentas'
) {
  const dados = await serializar(nome);
  return {
    licenca: LICENCA,
    gerado_em: new Date().toISOString(),
    total: dados.length,
    [nome]: dados,
  };
}

export async function datasetCompleto() {
  const [portarias, modelos, servicos, ambientes, ferramentas] = await Promise.all([
    serializar('portarias'),
    serializar('modelos'),
    serializar('servicos'),
    serializar('ambientes'),
    serializar('ferramentas'),
  ]);

  return {
    licenca: LICENCA,
    gerado_em: new Date().toISOString(),
    totais: {
      portarias: portarias.length,
      modelos: modelos.length,
      servicos: servicos.length,
      ambientes: ambientes.length,
      ferramentas: ferramentas.length,
    },
    portarias,
    modelos,
    servicos,
    ambientes,
    ferramentas,
  };
}

export const respostaJson = (corpo: unknown) =>
  new Response(JSON.stringify(corpo, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });

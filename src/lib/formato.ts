const LOCALE = 'pt-BR';

const longa = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const curta = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "8 de outubro de 2025" */
export const dataLonga = (d: Date) => longa.format(d);

/** "08/10/2025" */
export const dataCurta = (d: Date) => curta.format(d);

/** "2025-10-08" - para o atributo datetime de <time>. */
export const dataISO = (d: Date) => d.toISOString().slice(0, 10);

export const ano = (d: Date) => d.getUTCFullYear();

/** Rótulo correspondente a um status. */
export const rotuloStatus: Record<string, string> = {
  vigente: 'Vigente',
  revogada: 'Revogada',
  alterada: 'Alterada',
  indeterminado: 'A confirmar',
  producao: 'Em produção',
  homologacao: 'Homologação',
  historico: 'Histórico',
  planejado: 'Planejado',
};

/** Rótulo correspondente a uma fonte de dados. */
export const rotuloFonte: Record<string, string> = {
  'gov-br': 'gov.br',
  dou: 'DOU',
  bvs: 'BVS Saúde Legis',
  conass: 'CONASS',
  datasus: 'DATASUS',
  ig: 'Guia de Implementação',
  simplifier: 'Simplifier',
  hl7: 'HL7',
  academico: 'Acadêmico',
  outro: 'Outra fonte',
};

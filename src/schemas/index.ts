import { reference } from 'astro:content';
import { z } from 'zod';

/**
 * Toda afirmação neste guia precisa de uma fonte pública linkada e de uma data de verificação.
 */
export const fonteSchema = z.object({
  tipo: z.enum([
    'gov-br', // portal do Ministério da Saúde
    'dou', // Diário Oficial da União
    'bvs', // BVS Saúde Legis
    'conass', // Conselho Nacional de Secretários de Saúde
    'datasus', // Departamento de Informação e Informática do Sistema Único de Saúde
    'ig', // Implementation Guide FHIR
    'simplifier',
    'hl7',
    'academico',
    'outro',
  ]),
  titulo: z.string().optional(),
  url: z.string().url(),
});

const rastreavel = {
  /** Data em que as fontes deste registro foram conferidas pela última vez. */
  verificado_em: z.coerce.date(),
  fontes: z.array(fonteSchema).min(1),
};

/** Órgão emissor da norma. */
export const orgaoSchema = z.enum([
  'GM/MS', // Gabinete do Ministro do Ministério da Saúde
  'SAES/MS', // Secretaria de Atenção Especializada à Saúde do Ministério da Saúde
  'SECTICS/MS', // Secretaria de Ciência, Tecnologia, Inovação e Complexo da Saúde
  'SEIDIGI/MS', // Secretaria de Informação e Saúde Digital do Ministério da Saúde
  'SAES/SEIDIGI', // portaria conjunta
  'SVS/MS', // Secretaria de Vigilância em Saúde do Ministério da Saúde
  'outro',
]);

/** Descrição de uma portaria. */
export const portariaSchema = z.object({
  /** Ex.: "GM/MS nº 8.347" */
  numero: z.string(),
  orgao: orgaoSchema,
  data: z.coerce.date(),
  ementa: z.string(),
  status: z.enum(['vigente', 'revogada', 'alterada', 'indeterminado']),
  /** Modelos de informação que esta norma institui ou altera. */
  modelos: z.array(reference('modelos')).default([]),
  revoga: z.array(reference('portarias')).default([]),
  revogada_por: z.array(reference('portarias')).default([]),
  altera: z.array(reference('portarias')).default([]),
  /**
   * true quando a norma NÃO consta da página oficial de legislação da RNDS
   * no gov.br. É o principal diferencial deste guia, pois a lista oficial está
   * incompleta e sinalizar isso na página é parte do valor.
   */
  ausente_da_lista_oficial: z.boolean().default(false),
  notas: z.string().optional(),
  ...rastreavel,
});

/** Descrição de um modelo de informação. */
export const modeloSchema = z.object({
  /** Ex.: "RAC" */
  sigla: z.string(),
  nome: z.string(),
  resumo: z.string(),
  status: z.enum(['producao', 'homologacao', 'historico', 'planejado']),
  /** Código no CodeSystem BRTipoDocumento, quando existir. */
  codigo_tipo_documento: z.string().optional(),
  portaria_vigente: reference('portarias').optional(),
  portarias: z.array(reference('portarias')).default([]),
  /** Modelo que sucedeu este (ex.: RDM → REDFM). */
  sucedido_por: reference('modelos').optional(),
  sucede: reference('modelos').optional(),
  ig_oficial: z.string().url().optional(),
  ig_comunitario: z
    .array(
      z.object({
        nome: z.string(),
        autor: z.string(),
        url: z.string().url(),
        repo: z.string().url().optional(),
      })
    )
    .default([]),
  ordem: z.number().default(99),
  ...rastreavel,
});

/** Descrição de um serviço disponível no sistema. */
export const servicoSchema = z.object({
  nome: z.string(),
  metodo: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  endpoint: z.string(),
  categoria: z.enum(['seguranca', 'saude']),
  descricao: z.string(),
  ...rastreavel,
});

/** Descrição de um ambiente de execução do sistema. */
export const ambienteSchema = z.object({
  nome: z.string(),
  tipo: z.enum(['homologacao', 'producao']),
  auth_host: z.string(),
  ehr_host: z.string(),
  /** Em produção o EHR é por UF (ex.: sp-ehr-services.saude.gov.br). */
  ehr_por_uf: z.boolean().default(false),
  aberto: z.boolean().default(false),
  observacao: z.string().optional(),
  ...rastreavel,
});

/** Descrição de uma ferramenta de software utilizada no sistema. */
export const ferramentaSchema = z.object({
  nome: z.string(),
  categoria: z.enum([
    'validacao',
    'biblioteca',
    'servidor',
    'dados-sinteticos',
    'modelagem',
    'exploracao',
    'documentacao',
  ]),
  oficial: z.boolean().default(false),
  descricao: z.string(),
  url: z.string().url(),
  repo: z.string().url().optional(),
  licenca: z.string().optional(),
  linguagens: z.array(z.string()).default([]),
  ...rastreavel,
});

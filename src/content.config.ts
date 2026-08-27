import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

import {
  ambienteSchema,
  ferramentaSchema,
  modeloSchema,
  portariaSchema,
  servicoSchema,
} from './schemas';

/**
 * As coleções de dados são a fonte da verdade do site: nenhuma tabela é escrita
 * à mão em MDX. Os schemas rodam no build, então YAML malformado ou uma
 * referência para uma portaria que não existe, isso quebra o build em vez de virar
 * uma página errada em produção.
 */
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

  portarias: defineCollection({
    loader: file('src/data/portarias.yaml'),
    schema: portariaSchema,
  }),
  modelos: defineCollection({
    loader: file('src/data/modelos.yaml'),
    schema: modeloSchema,
  }),
  servicos: defineCollection({
    loader: file('src/data/servicos.yaml'),
    schema: servicoSchema,
  }),
  ambientes: defineCollection({
    loader: file('src/data/ambientes.yaml'),
    schema: ambienteSchema,
  }),
  ferramentas: defineCollection({
    loader: file('src/data/ferramentas.yaml'),
    schema: ferramentaSchema,
  }),
};

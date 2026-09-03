// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const REPO = 'https://github.com/josevbrito/rnds';

export default defineConfig({
  site: 'https://rnds.josevbrito.com',
  integrations: [
    starlight({
      title: 'Guia RNDS para Desenvolvedores',
      description:
        'Guia aberto e independente para quem precisa integrar sistemas de saúde à Rede '
        + 'Nacional de Dados em Saúde (RNDS). Legislação, modelos de informação, serviços FHIR '
        + 'e ferramentas, compilados de fontes públicas com data de verificação.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português (Brasil)', lang: 'pt-BR' },
      },
      logo: {
        src: './src/assets/chama.svg',
        alt: '',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: REPO },
      ],
      editLink: {
        baseUrl: `${REPO}/edit/main/`,
      },
      lastUpdated: true,
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      head: [
        {
          tag: 'meta',
          attrs: { name: 'author', content: 'José Victor Brito' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        },
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-180.png' },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#b45309' },
        },
      ],
      sidebar: [
        { label: 'Início', link: '/' },
        {
          label: 'Começar',
          items: [
            { label: 'Visão geral', slug: 'comecar' },
            { label: 'O que é a RNDS', slug: 'comecar/o-que-e-a-rnds' },
            { label: 'Por que FHIR', slug: 'comecar/por-que-fhir' },
            { label: 'Seu primeiro documento', slug: 'comecar/primeiro-documento' },
          ],
        },
        {
          label: 'Modelos de informação',
          items: [{ autogenerate: { directory: 'modelos' } }],
        },
        {
          label: 'Legislação',
          items: [
            { label: 'Linha do tempo', slug: 'legislacao' },
          ],
        },
        {
          label: 'Integração',
          items: [
            { label: 'Anatomia do documento', slug: 'integracao/anatomia-do-documento' },
            { label: 'Perfis e BR Core', slug: 'integracao/perfis-e-br-core' },
            { label: 'Identificadores', slug: 'integracao/identificadores' },
            { label: 'Ambientes', slug: 'integracao/ambientes' },
            { label: 'Serviços', slug: 'integracao/servicos' },
            { label: 'Autenticação', slug: 'integracao/autenticacao' },
            { label: 'Como conseguir acesso', slug: 'integracao/acesso' },
          ],
        },
        {
          label: 'Ferramentas',
          items: [
            { label: 'Validação', slug: 'ferramentas/validacao' },
            { label: 'FHIRPath', slug: 'ferramentas/fhirpath' },
            { label: 'Testando sem acesso', slug: 'ferramentas/testando-sem-acesso' },
            { label: 'Ecossistema', slug: 'ferramentas/ecossistema' },
          ],
        },
        {
          label: 'Referência',
          items: [
            { label: 'Erros comuns', slug: 'erros-comuns' },
            { label: 'Glossário', slug: 'glossario' },
            { label: 'Todas as fontes', slug: 'referencias' },
            { label: 'Dados abertos (JSON)', slug: 'dados' },
            { label: 'Sobre este guia', slug: 'sobre' },
          ],
        },
      ],
    }),
  ],
});

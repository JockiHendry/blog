import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import starlightBlog from 'starlight-blog';
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from 'rehype-mermaid';
import starlightImageZoom from 'starlight-image-zoom';
import serviceWorkerIntegration from './src/integrations/serviceWorker';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';


// https://astro.build/config
export default defineConfig({
  site: 'https://jocki.me',
  integrations: [
    starlight({
      title: 'Catatan Jocki',
      favicon: '/favicon.png',
      social: {
        github: 'https://github.com/JockiHendry/blog'
      },
      sidebar: [{
        label: 'Tools',
        autogenerate: {
          directory: 'tools'
        }
      }],
      customCss: ['@fontsource/roboto', './src/styles/custom.scss'],
      plugins: [starlightBlog(), starlightImageZoom()],
      expressiveCode: {
        themes: ['github-light', 'github-dark']
      },
      components: {
        MarkdownContent: './src/components/MyMarkdownContent.astro'
      }
    }), 
    mdx(),     
    tailwind({
      applyBaseStyles: false,
    }),
    serviceWorkerIntegration(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeMermaid, {strategy: "img-svg"}], rehypeKatex],
  },
  trailingSlash: 'never',  
});

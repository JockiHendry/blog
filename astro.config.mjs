import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import starlightBlog from 'starlight-blog';
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from 'rehype-mermaid';
import starlightImageZoom from 'starlight-image-zoom';

// https://astro.build/config
export default defineConfig({
  site: 'https://jocki.me',
  integrations: [starlight({
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
  }), mdx(), tailwind({
    applyBaseStyles: false,
  })],
  markdown: {
    rehypePlugins: [[rehypeMermaid, {strategy: "img-svg"}]],
  }
});

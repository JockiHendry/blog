import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { AstroIntegration } from "astro";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { rollup } from 'rollup';
import { injectManifest } from 'rollup-plugin-workbox';

const SW_NAME = "service-worker.js";

const createPlugin = (): AstroIntegration => {
    return {
        name: "local-service-worker-integration",
        hooks: {
            "astro:config:setup": async({ config, injectScript, injectRoute, command, logger }) => {
                logger.info('Injecting service worker loader script in every pages');
                const swPath = join(config.base, SW_NAME);
                injectScript("head-inline", `
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.register('${swPath}');
                    }
                `);
                if (command === "dev") {
                    injectRoute({
                        pattern: swPath,
                        entrypoint: "./src/integrations/serviceWorker/no-op-service-worker.js",
                    });
                }

            },
            "astro:build:done": async ({ dir, logger }) => {                
                logger.info(`Using rollup to bundle ${SW_NAME} with Workbox`);                  
                if (process.env.MODE === "staging") {
                    logger.info(`Don't minify code to enable logging`);
                }                
                const out = fileURLToPath(dir);                                
                const swSrc = join(out, "../src/integrations/serviceWorker/service-worker.js");
                const swDest = join(out, SW_NAME);
                const bundle = await rollup({
                    input: swSrc,                    
                    plugins: [
                        nodeResolve(),                                                                       
                        injectManifest({
                            swSrc, 
                            swDest,                                                        
                            globDirectory: out,
                            globPatterns: ["**/*"],                            
                        }, {                            
                            esbuild: {
                                minify: !(process.env.MODE === "staging"),
                            }
                        })                        
                    ]
                });
                await bundle.write({
                    dir: out, 
                    format: 'iife',                    
                });                
                await bundle.close();                
            }
        },
    };
};

export default createPlugin;
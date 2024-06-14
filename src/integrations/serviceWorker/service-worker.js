import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
registerRoute(/.*\/blog$/, new NetworkFirst(), 'GET');
precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /ts$/],  
  urlManipulation: ({url}) => [new URL(url.href + '/index.html')],  
});
cleanupOutdatedCaches();
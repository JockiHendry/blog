import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate} from "workbox-strategies";

self.skipWaiting();
clientsClaim();
registerRoute(/.*\/blog$/, new NetworkFirst(), 'GET');
registerRoute(() => true, new StaleWhileRevalidate(), 'GET');
precacheAndRoute(self.__WB_MANIFEST, {
  "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts$/]
});
cleanupOutdatedCaches();
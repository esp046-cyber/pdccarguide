const V='pdc-v1',P='/pdccarguide/';
const CORE=['','index.html','offline.html','css/styles.css','js/app.js','manifest.webmanifest','favicon.svg','icons/icon-192.png','icons/icon-512.png','assets/dashboard-symbols.svg','assets/parking-diagrams.svg','assets/road-signs.svg'].map(f=>P+f);
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match(P+'index.html')).then(m=>m||caches.match(P+'offline.html'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x})))});

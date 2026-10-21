// Network-first for the page so updates show right away; cache-first for the big audio packs.
const C='zanji-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;
  if(/\/a\d\d\.mp3$/.test(u.pathname)){
    e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{ if(res.ok) c.put(e.request,res.clone()); return res; }))));
  } else {
    e.respondWith(fetch(e.request).then(res=>{ if(res.ok){ const cl=res.clone(); caches.open(C).then(c=>c.put(e.request,cl)); } return res; }).catch(()=>caches.match(e.request)));
  }
});

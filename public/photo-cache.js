/* Public hashed WebP images only. No pages, uploads, APIs or customer details. */
const PHOTO_CACHE='pcs-public-photos-v1';
const MAX_PHOTOS=180;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('pcs-public-photos-')&&key!==PHOTO_CACHE)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search||!/^\/assets\/pcs-[a-f0-9]{16}-\d+\.webp$/.test(url.pathname))return;
  event.respondWith((async()=>{
    let cache;
    try{cache=await caches.open(PHOTO_CACHE);const stored=await cache.match(event.request);if(stored)return stored;}catch{/* Storage can be unavailable in private browsing. */}
    const response=await fetch(event.request);
    if(cache&&response.ok&&response.headers.get('content-type')?.includes('image/webp')){
      const copy=response.clone();
      event.waitUntil((async()=>{try{await cache.put(event.request,copy);const keys=await cache.keys();for(const old of keys.slice(0,Math.max(0,keys.length-MAX_PHOTOS)))await cache.delete(old);}catch{/* Browser quota may evict cached photos. */}})());
    }
    return response;
  })());
});

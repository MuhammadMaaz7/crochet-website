import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const listeners={},stored=new Map();let fetched=0;
const origin='https://shop.example';
const cache={match:async r=>stored.get(r.url)?.clone(),put:async(r,v)=>stored.set(r.url,v),keys:async()=>[...stored.keys()].map(url=>({url})),delete:async r=>stored.delete(r.url)};
vm.runInNewContext(readFileSync(new URL('../public/photo-cache.js',import.meta.url),'utf8'),{URL,self:{location:{origin},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting(){},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>[]},fetch:async()=>{fetched++;return new Response('webp',{headers:{'content-type':'image/webp'}})}});
async function request(path,method='GET'){
 let response;const pending=[];
 listeners.fetch({request:new Request(new URL(path,origin),{method}),respondWith:p=>response=p,waitUntil:p=>pending.push(p)});
 const result=response?await response:undefined;await Promise.all(pending);return result;
}
for(const path of ['/','/admin','/api/requests','/media/customer-upload','/assets/source.webp','https://elsewhere.example/assets/pcs-0123456789abcdef-480.webp','/assets/pcs-0123456789abcdef-480.webp?private=1'])assert.equal(await request(path),undefined,path);
assert.equal(await request('/assets/pcs-0123456789abcdef-480.webp','POST'),undefined);
assert.equal(fetched,0);
await request('/assets/pcs-0123456789abcdef-480.webp');await request('/assets/pcs-0123456789abcdef-480.webp');assert.equal(fetched,1,'repeat photo served from cache');
for(let i=0;i<185;i++)await request('/assets/pcs-'+i.toString(16).padStart(16,'0')+'-320.webp');assert.equal(stored.size,180,'cache remains bounded');
assert.equal(await request('/api/admin'),undefined);
console.log('Photo cache: repeat hit, bounded eviction, external/query/source/API/page/upload exclusions passed.');

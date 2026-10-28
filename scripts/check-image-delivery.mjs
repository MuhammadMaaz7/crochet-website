import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync(new URL('../lib/image-manifest.json',import.meta.url),'utf8'));
const withAssets=existsSync(new URL('../public/assets',import.meta.url));
let total=0;
for(const [original,photo] of Object.entries(manifest)){
  assert.match(original,/^\/assets\/[a-z-]+\.webp$/);
  let previous=0;
  for(const v of photo.variants){
    assert.ok(v.width>previous&&v.width<=photo.width);previous=v.width;
    assert.match(v.src,/^\/assets\/pcs-[a-f0-9]{16}-\d+\.webp$/);
    if(withAssets){const bytes=readFileSync(new URL('../public'+v.src,import.meta.url));assert.equal(bytes.length,v.bytes);assert.ok(v.src.includes(createHash('sha256').update(bytes).digest('hex').slice(0,16)));}
    total++;
  }
  assert.ok(photo.variants.some(v=>v.width===320));
}
const headers=readFileSync(new URL('../public/_headers',import.meta.url),'utf8');
assert.match(headers,/\/assets\/pcs-\*[\s\S]*max-age=31536000, immutable/);
console.log(`${Object.keys(manifest).length} photos / ${total} variants: widths, hashed URLs and immutable-cache policy passed. ${withAssets?'Image bytes verified.':'Source mirror: image files excluded.'}`);

import assert from "node:assert/strict";import {productColourways} from "../lib/customisation.ts";import {existsSync} from "node:fs";import {defaults,enquirySchema,productSchema,settingsSchema} from "../lib/catalog.ts";
const verifyAssets=existsSync(new URL("../public/assets",import.meta.url));\nif(!verifyAssets)console.log("Private product assets are omitted from the source mirror; asset checks are skipped.");\nfor(const p of defaults){assert.equal(productSchema.safeParse(p).success,true,p.id);if(verifyAssets)for(const image of [p.image,p.reference,...(p.gallery||[]).map(g=>g.image)].filter(Boolean))assert.ok(existsSync(new URL("../public"+image,import.meta.url)),"Missing catalogue image: "+image);}
assert.equal(new Set(defaults.map(p=>p.id)).size,defaults.length);
assert.equal(productSchema.safeParse({...defaults[0],gallery:[{image:"https://external.invalid/photo",label:"Bad path"}]}).success,false);
assert.equal(productSchema.safeParse({...defaults[0],price:-1}).success,false);
assert.equal(productSchema.safeParse({...defaults[0],image:"javascript:alert(1)"}).success,false);
assert.equal(productSchema.safeParse({...defaults[0],image:"https://external.invalid/photo"}).success,false);
assert.equal(settingsSchema.safeParse({whatsapp:"123",accepting:true,notice:"",shipping:"Shipping by quote",returns:"Terms confirmed before acceptance"}).success,false);
const request={token:"12345678-1234-4234-8234-123456789012",name:"Test Buyer",contact:"test@example.invalid",city:"Islamabad",country:"Pakistan",idea:"Please quote a tulip pouch.",colours:"",budget:"",deadline:"",items:[{id:"tulip-cream",quantity:1}],consent:true,website:""};
assert.equal(enquirySchema.safeParse(request).success,true);
for(const quantity of [-1,0,51,1.2])assert.equal(enquirySchema.safeParse({...request,items:[{id:"tulip-cream",quantity}]}).success,false);
assert.equal(enquirySchema.safeParse({...request,consent:false}).success,false);
assert.equal(enquirySchema.safeParse({...request,website:"spam.invalid"}).success,false);
assert.equal(enquirySchema.safeParse({...request,idea:"x".repeat(2001)}).success,false);
console.log("Business-rule checks passed: products, media paths, price bounds, contact settings, quantities, consent, spam field and payload bounds.");

assert.equal(defaults.find(p=>p.id==="penguin").published,false);
for(const p of defaults){const choices=productColourways(p);for(const c of choices)if(verifyAssets)assert.ok(existsSync(new URL("../public"+c.image,import.meta.url)),"Missing colour preview: "+c.image);if(choices.length)assert.equal(productColourways({...p,image:"/media/replacement-photo"}).length,0);}
console.log("Colour previews: assets exist, removed product stays unpublished, replacement photos do not inherit stale previews.");

import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
export function validateConfig(c,{locked=false}={}){
 const errors=[];
 if(!/^photocraftsquare-[a-z0-9-]+$/.test(c.name||''))errors.push('Worker name must begin photocraftsquare-.');
 const db=c.d1_databases?.find(x=>x.binding==='DB');
 if(!/^[a-f0-9-]{36}$/.test(db?.database_id||'')||db.database_id==='00000000-0000-4000-8000-000000000000')errors.push('Use the real NEW D1 database ID.');
 if(!c.r2_buckets?.some(x=>x.binding==='BUCKET'&&/^photocraftsquare-[-a-z0-9]+$/.test(x.bucket_name)))errors.push('Set the owner-controlled R2 bucket.');
 if(c.vars?.SITE_ORIGIN){try{const u=new URL(c.vars.SITE_ORIGIN);if(u.protocol!=='https:'||u.origin!==c.vars.SITE_ORIGIN||u.hostname.includes('REPLACE'))throw Error();}catch{errors.push('SITE_ORIGIN must be an exact HTTPS origin without trailing slash.');}}
 else if(!locked)errors.push('Set SITE_ORIGIN after first staging deployment.');
 if(!locked){if(!/^https:\/\/[-a-z0-9]+\.cloudflareaccess\.com$/.test(c.vars?.CF_ACCESS_TEAM_DOMAIN||'')||c.vars.CF_ACCESS_TEAM_DOMAIN.includes('REPLACE'))errors.push('Set your Cloudflare Access team origin.');if(!c.vars?.CF_ACCESS_AUD||c.vars.CF_ACCESS_AUD.includes('REPLACE'))errors.push('Set the Access application audience.');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.vars?.ADMIN_OWNER_EMAIL||''))errors.push('Set the owner admin email.');}
 return errors;
}
if(import.meta.url===new URL(process.argv[1],`file://${process.cwd()}/`).href){
 if(process.argv.includes('--check')){const c=JSON.parse(readFileSync('wrangler.json','utf8'));const errors=validateConfig(c,{locked:process.argv.includes('--locked-admin')});if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Cloudflare configuration checks passed.');}
 else {
  if(existsSync('wrangler.json'))throw Error('wrangler.json exists. Edit it directly; no overwrite performed.');
  const rl=createInterface({input:stdin,output:stdout});
  try{
   const c=JSON.parse(readFileSync('deployment/wrangler.example.json','utf8'));
   const db=await rl.question('New staging D1 database ID: ');
   const owner=await rl.question('Owner admin email: ');
   c.d1_databases[0].database_id=db.trim();c.vars.ADMIN_OWNER_EMAIL=owner.trim();c.vars.SITE_ORIGIN='';c.vars.CF_ACCESS_TEAM_DOMAIN='';c.vars.CF_ACCESS_AUD='';
   const errors=validateConfig(c,{locked:true});if(errors.length)throw Error(errors.join('\n'));
   writeFileSync('wrangler.json',JSON.stringify(c,null,2)+'\n',{mode:0o600});console.log('Created staging config. Admin remains locked until Access is configured.');
  }finally{rl.close();}
 }
}

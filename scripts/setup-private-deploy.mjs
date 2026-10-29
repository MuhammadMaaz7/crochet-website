import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,realpathSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateConfig} from './cloudflare-config.mjs';
// Run from the existing complete project; this script lives in a fresh source clone.
const source=process.cwd();
const target=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const repo='MuhammadMaaz7/photocraftsquare-deploy';
if(realpathSync(source)===realpathSync(target))throw Error('Run this script from the existing complete project, using the absolute path to the new clone script.');
const c=JSON.parse(readFileSync(resolve(source,'wrangler.json'),'utf8'));
const errors=validateConfig(c);
for(const p of ['public/assets/mocha-bow-tote-product-v2.webp','public/assets/rose-gajra-styled.webp'])if(!existsSync(resolve(source,p)))errors.push(`Missing product asset: ${p}`);
if(!/^[a-f0-9]{32}$/.test(c.account_id||'')&&!/^[a-f0-9]{32}$/.test(process.env.PCS_ACCOUNT_ID||''))errors.push('Set PCS_ACCOUNT_ID to your Cloudflare account ID.');
if(errors.length)throw Error(errors.join('\n'));
function run(args,{input,cwd=target,capture=false}={}){const r=spawnSync(args[0],args.slice(1),{cwd,input,encoding:'utf8',stdio:capture||input!==undefined?['pipe','pipe','pipe']:'inherit'});if(r.error)throw r.error;if(r.status!==0)throw Error(`${args[0]} ${args[1]} failed. ${capture||input!==undefined?'Check account access and retry; no secret values were printed.':''}`);return r.stdout?.trim();}
run(['gh','auth','status'],{capture:true});
const dirty=run(['git','status','--porcelain'],{capture:true});if(dirty)throw Error('Use a fresh clean source clone for the deployment repository.');
run(['rsync','-a','--exclude=.DS_Store','--exclude=._*',resolve(source,'public')+'/',resolve(target,'public')+'/']);
run(['git','add','public']);
const changed=run(['git','diff','--cached','--name-only'],{capture:true});
if(changed)run(['git','commit','-m','Include storefront assets for private deployment']);
// Fails if the name already exists; never changes an existing repository's visibility.
run(['git','remote','rename','origin','source']);
run(['gh','repo','create',repo,'--private','--source',target,'--remote','origin','--push']);
run(['gh','repo','edit',repo,'--default-branch','feat/independent-cloudflare']);
const secrets={CLOUDFLARE_ACCOUNT_ID:c.account_id||process.env.PCS_ACCOUNT_ID,PCS_OWNER_EMAIL:c.vars.ADMIN_OWNER_EMAIL};
for(const [name,value] of Object.entries(secrets))run(['gh','secret','set',name,'--repo',repo],{input:value+'\n'});
const vars={PCS_D1_ID:c.d1_databases.find(d=>d.binding==='DB').database_id,PCS_SITE_ORIGIN:c.vars.SITE_ORIGIN,PCS_ACCESS_TEAM:c.vars.CF_ACCESS_TEAM_DOMAIN,PCS_ACCESS_AUD:c.vars.CF_ACCESS_AUD};
for(const [name,value] of Object.entries(vars))run(['gh','variable','set',name,'--repo',repo,'--body',value]);
console.log(`Private deployment repo prepared: ${repo}\nAutomatic deployment remains OFF. Add CLOUDFLARE_API_TOKEN directly through gh secret set, then enable CF_AUTODEPLOY.\nKeep this clone as your future working copy. No wrangler.json or OAuth credential was committed.`);

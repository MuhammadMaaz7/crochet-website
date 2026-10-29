import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {validateConfig} from './cloudflare-config.mjs';
const locked=process.argv.includes('--locked-admin');
const config=JSON.parse(readFileSync('wrangler.json','utf8'));
const errors=validateConfig(config,{locked});
for(const p of ['/assets/mocha-bow-tote-product-v2.webp','/assets/rose-gajra-styled.webp'])if(!existsSync('public'+p))errors.push('Missing private product assets. Use the complete private deployment package.');
if(errors.length)throw Error(errors.join('\n'));
function run(args){const r=spawnSync(process.execPath,args,{stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
run(['node_modules/typescript/bin/tsc','--noEmit']);
run(['--experimental-strip-types','scripts/check-access-auth.mjs']);
run(['node_modules/vinext/dist/cli.js','build']);
const output='dist/server/wrangler.json';
if(!existsSync(output))throw Error('Expected Cloudflare Vite build configuration missing. No deployment attempted.');
if(statSync(output).mtimeMs<statSync('wrangler.json').mtimeMs)throw Error('Stale build configuration.');
if(locked)console.log('Bootstrap staging deployment: admin denied until valid Access configuration and owner token are present.');
run(['node_modules/wrangler/bin/wrangler.js','deploy','--config',output]);

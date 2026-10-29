import assert from 'node:assert/strict';
import {generateKeyPair,exportJWK,createLocalJWKSet,SignJWT} from 'jose';
import {accessConfiguration,verifyOwnerToken} from '../lib/access-auth.ts';
const {privateKey,publicKey}=await generateKeyPair('RS256');
const jwk=await exportJWK(publicKey);jwk.kid='test-key';jwk.alg='RS256';
const getKey=createLocalJWKSet({keys:[jwk]});
const settings={CF_ACCESS_TEAM_DOMAIN:'https://pcs-test.cloudflareaccess.com',CF_ACCESS_AUD:'test-application',ADMIN_OWNER_EMAIL:'owner@example.invalid'};
const now=Math.floor(Date.now()/1000);
async function token(extra={},options={}){return new SignJWT({email:'owner@example.invalid',iss:settings.CF_ACCESS_TEAM_DOMAIN,aud:settings.CF_ACCESS_AUD,sub:'owner-123',iat:now,exp:now+300,...extra}).setProtectedHeader({alg:'RS256',kid:'test-key',...options}).sign(privateKey);}
assert.equal((await verifyOwnerToken(await token(),settings,getKey))?.userId,'owner-123');
assert.equal((await verifyOwnerToken(await token({email:'OWNER@example.invalid'}),settings,getKey))?.email,'OWNER@example.invalid');
for(const claims of [{email:'other@example.invalid'},{iss:'https://evil.example'},{aud:'another-app'},{exp:now-60},{iat:now+120},{iat:now-90000,exp:now+300},{email:undefined},{exp:undefined},{sub:undefined}])assert.equal(await verifyOwnerToken(await token(claims),settings,getKey),null,JSON.stringify(claims));
assert.equal(await verifyOwnerToken('eyJhbGciOiJub25lIn0.e30.',settings,getKey),null);
const valid=await token();assert.equal(await verifyOwnerToken(valid.slice(0,-12)+'tampered',settings,getKey),null);
assert.equal(await verifyOwnerToken(null,settings,getKey),null);
assert.equal(await verifyOwnerToken('x'.repeat(17000),settings,getKey),null);
for(const bad of [{},{...settings,CF_ACCESS_AUD:''},{...settings,ADMIN_OWNER_EMAIL:''},{...settings,CF_ACCESS_TEAM_DOMAIN:'https://attacker.example'},{...settings,CF_ACCESS_TEAM_DOMAIN:'http://pcs-test.cloudflareaccess.com'},{...settings,CF_ACCESS_TEAM_DOMAIN:'https://pcs-test.cloudflareaccess.com/other'}])assert.equal(await verifyOwnerToken(valid,bad,getKey),null);
console.log('Independent auth passed: valid signature, owner allowlist, issuer, audience, expiry, future/stale tokens, required claims, tampering and fail-closed configuration.');

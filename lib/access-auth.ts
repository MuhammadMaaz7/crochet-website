import {createRemoteJWKSet,jwtVerify,type JWTVerifyGetKey} from 'jose';
export type OwnerIdentity={userId:string;displayName:string;email:string;fullName:null};
export type AccessSettings={CF_ACCESS_TEAM_DOMAIN?:string;CF_ACCESS_AUD?:string;ADMIN_OWNER_EMAIL?:string};
let keyset:{issuer:string;getKey:JWTVerifyGetKey}|undefined;
export function accessConfiguration(settings:AccessSettings){
 const team=settings.CF_ACCESS_TEAM_DOMAIN?.trim();
 const audience=settings.CF_ACCESS_AUD?.trim();
 const owner=settings.ADMIN_OWNER_EMAIL?.trim().toLowerCase();
 if(!team||!audience||!owner)return null;
 try{const url=new URL(team);if(url.protocol!=='https:'||!/^[-a-z0-9]+\.cloudflareaccess\.com$/.test(url.hostname)||url.username||url.password||url.port||url.search||url.hash||url.pathname!=='/')return null;return {issuer:url.origin,audience,owner};}catch{return null;}
}
/** Validate the signature and claims; a request header alone is never identity. */
export async function verifyOwnerToken(token:string|undefined|null,settings:AccessSettings,getKey?:JWTVerifyGetKey):Promise<OwnerIdentity|null>{
 const config=accessConfiguration(settings);
 if(!config||!token||token.length>16384)return null;
 try{
  if(!getKey){if(keyset?.issuer!==config.issuer)keyset={issuer:config.issuer,getKey:createRemoteJWKSet(new URL('/cdn-cgi/access/certs',config.issuer),{timeoutDuration:5000,cooldownDuration:30000,cacheMaxAge:600000})};getKey=keyset.getKey;}
  const {payload}=await jwtVerify(token,getKey,{issuer:config.issuer,audience:config.audience,algorithms:['RS256'],requiredClaims:['exp','iat','sub','email'],clockTolerance:5,maxTokenAge:'24h'});
  if(typeof payload.sub!=='string'||typeof payload.email!=='string'||payload.email.toLowerCase()!==config.owner)return null;
  return {userId:payload.sub,displayName:payload.email,email:payload.email,fullName:null};
 }catch{return null;}
}

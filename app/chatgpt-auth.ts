// Compatibility export names only: this independent build has no ChatGPT login.
import {headers} from 'next/headers';
import {cache} from 'react';
import {env} from 'cloudflare:workers';
import {verifyOwnerToken,type OwnerIdentity} from '../lib/access-auth';
export type ChatGPTUser=OwnerIdentity;
export const getChatGPTUser=cache(async()=>{
 const incoming=await headers();
 return verifyOwnerToken(incoming.get('cf-access-jwt-assertion'),env);
});

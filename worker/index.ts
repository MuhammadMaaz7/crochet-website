import handler from 'vinext/server/fetch-handler';
export default {
 async fetch(request:Request,env:Cloudflare.Env,ctx:ExecutionContext){
  // Defence in depth: never forward the previous host's identity headers.
  const clean=new Headers(request.headers);
  for(const name of [...clean.keys()])if(name.toLowerCase().startsWith('oai-authenticated-user-'))clean.delete(name);
  const response=await handler.fetch(new Request(request,{headers:clean}),env,ctx);
  const path=new URL(request.url).pathname;
  if(path==='/admin'||path.startsWith('/admin/')||path.startsWith('/api/')){
   const safe=new Response(response.body,response);safe.headers.set('Cache-Control','private, no-store');safe.headers.set('X-Content-Type-Options','nosniff');return safe;
  }
  return response;
 }
};

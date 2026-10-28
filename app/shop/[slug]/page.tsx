import type {Metadata} from "next";
import {env} from "cloudflare:workers";
import {catalog,shopSettings} from "../../../lib/store";
import Shop from "../../shop-ui";
import {notFound} from "next/navigation";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const product=(await catalog()).find(p=>p.id===slug);
  if(!product)return {title:"Product not found"};
  const origin=env.SITE_ORIGIN;
  return {title:product.name,description:product.description,openGraph:{title:product.name+" · PhotoCraftSquare",description:product.description,...(origin?{url:new URL("/shop/"+product.id,origin).href,images:[{url:new URL(product.image,origin).href,alt:product.name}]}:{})}};
}
export default async function Page({params}:Props){
  const {slug}=await params;
  const [products,settings]=await Promise.all([catalog(),shopSettings()]);
  if(!products.some(p=>p.id===slug))notFound();
  return <Shop products={products} settings={settings} initialProduct={slug}/>;
}

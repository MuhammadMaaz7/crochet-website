import type {Metadata} from "next";
import {env} from "cloudflare:workers";
import {productColourways} from "../../../lib/customisation";
import {catalog,shopSettings} from "../../../lib/store";
import Shop from "../../shop-ui";
import {notFound} from "next/navigation";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>;searchParams:Promise<{colour?:string|string[]}>};
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{
  const {slug}=await params;
  const [products,query]=await Promise.all([catalog(),searchParams]);
  const product=products.find(p=>p.id===slug);
  if(!product)return {title:"Product not found"};
  const origin=env.SITE_ORIGIN;
  const colour=productColourways(product).find(c=>c.name===query.colour);
  const image=colour?.image||product.image;
  const path="/shop/"+product.id+(colour?"?colour="+encodeURIComponent(colour.name):"");
  return {title:product.name,description:product.description,openGraph:{title:product.name+" · PhotoCraftSquare",description:product.description,...(origin?{url:new URL(path,origin).href,images:[{url:new URL(image,origin).href,alt:product.name}]}:{})}};
}
export default async function Page({params,searchParams}:Props){
  const {slug}=await params;
  const [products,settings,query]=await Promise.all([catalog(),shopSettings(),searchParams]);
  if(!products.some(p=>p.id===slug))notFound();
  return <Shop products={products} settings={settings} initialProduct={slug} initialColour={typeof query.colour==="string"?query.colour:undefined}/>;
}

import type {ImgHTMLAttributes} from "react";
import {BUNTING_LAYOUT_IMAGE} from "../lib/product-presentation";
import manifest from "../lib/image-manifest.json";
const photos:Record<string,{width:number;height:number;variants:{src:string;width:number;bytes:number}[]}>=manifest;
/** Known studio photos get responsive derivatives; new owner uploads keep their own URL. */
export default function ProductPhoto({src,alt,sizes="(max-width: 699px) 45vw, (max-width: 1049px) 30vw, 290px",...props}:ImgHTMLAttributes<HTMLImageElement> & {src:string;alt:string}){
  const photo=photos[src];
  const fallback=photo?.variants.find(v=>v.width===768)||photo?.variants.at(-1);
  return <img {...props} style={src===BUNTING_LAYOUT_IMAGE?{...props.style,objectFit:"contain",backgroundColor:"#f7f1e7"}:props.style} src={fallback?.src||src} srcSet={photo?.variants.map(v=>`${v.src} ${v.width}w`).join(", ")} sizes={photo?sizes:undefined} alt={alt} decoding="async"/>;
}

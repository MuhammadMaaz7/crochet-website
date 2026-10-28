"use client";
import {useState} from 'react';
import type {Product} from '../lib/catalog';
import {productColourways} from '../lib/customisation';
import ProductPhoto from './product-photo';
export default function ProductCard({product:p}:{product:Product}){
  const [selected,setSelected]=useState(0);
  const choices=productColourways(p),choice=choices[selected];
  const href='/shop/'+p.id+(selected>0&&choice?'?colour='+encodeURIComponent(choice.name):'');
  return <article className="product-card"><a href={href} className="product-link"><div className="product-image"><ProductPhoto src={choice?.image||p.image} alt={p.name+(choice?' — '+choice.name:'')} loading="lazy" width="650" height="650"/>{choice?.approximate&&<span className="card-preview-label">Colour concept</span>}</div><div className="product-meta"><h3>{p.name}</h3><p>{p.price===null?'Price on request':'PKR '+p.price.toLocaleString('en-PK')}</p><span className="view-product">View product</span></div></a>{choices.length>1&&<div className="card-colours" role="group" aria-label={'Preview colours for '+p.name}>{choices.map((c,i)=><button type="button" key={c.name} title={c.name} aria-label={'Preview '+c.name+' for '+p.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span aria-hidden="true" style={{background:c.swatches.length>1?'linear-gradient(135deg,'+c.swatches.join(',')+')':c.swatches[0]}}/></button>)}<span aria-live="polite">{choice?.name}</span></div>}</article>;
}

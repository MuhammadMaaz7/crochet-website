"use client";
import {useEffect,useState} from 'react';
import type {Product} from '../lib/catalog';
import type {Colourway} from '../lib/customisation';
import {fitQuestion,pieceBrief} from '../lib/product-guides';
import {ColourPicker} from './studio-experiences';
export default function PieceOptions({product,accepting,onRequest,colourways=[],selected=0,onSelect=()=>{},initialQuantity=1}:{product:Product;accepting:boolean;onRequest:(idea:string,colours:string,id:string,quantity?:number)=>void;colourways?:Colourway[];selected?:number;onSelect?:(index:number)=>void;initialQuantity?:number}){
  const [ownColours,setOwnColours]=useState(false),[colours,setColours]=useState(''),[fit,setFit]=useState(''),[note,setNote]=useState(''),[error,setError]=useState(''),[quantity,setQuantity]=useState(initialQuantity);
  const question=fitQuestion(product),gajra=product.id.includes('gajra');
  const palette=colourways[selected]?.name||'As pictured';
  // A photo-palette choice is an explicit alternative to a free-text request.
  useEffect(()=>{setOwnColours(false)},[selected]);
  useEffect(()=>{setQuantity(initialQuantity)},[initialQuantity]);
  function submit(e:React.FormEvent){e.preventDefault();const chosen=ownColours?colours.trim():palette;if(ownColours&&!chosen){setError('Tell us the colours you have in mind.');return;}if(question?.required&&!fit.trim()){setError('Please add the wording you would like.');return;}setError('');onRequest(pieceBrief(product,{colours:chosen,fit,note}),chosen,product.id,gajra?quantity:undefined);}
  return <form id="piece-options" className="piece-options" onSubmit={submit}>
    {colourways.length>0&&<div className="desktop-colour-picker"><ColourPicker colourways={colourways} selected={selected} onSelect={onSelect}/></div>}
    <fieldset><legend>{colourways.length?'Or choose your own':'Make it yours'}</legend><div className="piece-colour-choice" role="group" aria-label="Colour preference"><button type="button" aria-pressed={!ownColours} onClick={()=>setOwnColours(false)}>{colourways.length?'Photo palette':'As pictured'}</button><button type="button" aria-pressed={ownColours} onClick={()=>setOwnColours(true)}>My colours</button></div>
    {ownColours&&<label>Your colours<input name="pieceColours" required maxLength={80} value={colours} onChange={e=>{setColours(e.target.value);setError('');}} placeholder="Blush pink, cream and a little sage"/><small>Photo stays in {palette.toLowerCase()}. We’ll confirm your yarn shades.</small></label>}
    </fieldset>
    {gajra&&<div className="gajra-quantity"><label>How many gajray?<input name="gajraQuantity" type="number" min={1} max={50} required value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label><div className="gajra-quantity-picks" role="group" aria-label="Gajra quantity shortcuts">{[{n:1,label:'Single'},{n:2,label:'Pair · 2'},{n:6,label:'Group · 6'}].map(x=><button key={x.n} type="button" aria-pressed={quantity===x.n} onClick={()=>setQuantity(x.n)}>{x.label}</button>)}</div><p className="preview-note">Quantity counts individual gajray. Add your event date in the next step.</p></div>}
    {question&&<label>{question.label} <small>{question.required?'(required)':'(optional)'}</small><input name="pieceFit" maxLength={90} required={question.required} placeholder={question.placeholder} value={fit} onChange={e=>{setFit(e.target.value);setError('');}}/><small>{question.help}</small></label>}
    <details className="piece-extra"><summary>Add a note for the maker</summary><label>Your note <small>(optional)</small><textarea name="pieceNote" rows={2} maxLength={140} value={note} onChange={e=>setNote(e.target.value)} placeholder="A detail you’d love us to consider…"/></label></details>
    {error&&<p className="error" role="alert">{error}</p>}
    <button className="button inline-product-request" disabled={!accepting}>Order this piece</button>
  </form>;
}

"use client";
import {useState} from 'react';
import type {Product} from '../lib/catalog';
import {fitQuestion,pieceBrief} from '../lib/product-guides';
export default function PieceOptions({product,accepting,onRequest}:{product:Product;accepting:boolean;onRequest:(idea:string,colours:string,id:string)=>void}){
  const [ownColours,setOwnColours]=useState(false),[colours,setColours]=useState(''),[fit,setFit]=useState(''),[note,setNote]=useState(''),[error,setError]=useState('');
  const question=fitQuestion(product);
  function submit(e:React.FormEvent){e.preventDefault();const selected=ownColours?colours.trim():'As pictured';if(ownColours&&!selected){setError('Tell us the colours you have in mind.');return;}setError('');onRequest(pieceBrief(product,{colours:selected,fit,note}),selected,product.id);}
  return <form id="piece-options" className="piece-options" onSubmit={submit}>
    <fieldset><legend>Make it yours</legend><div className="piece-colour-choice" role="group" aria-label="Colour preference"><button type="button" aria-pressed={!ownColours} onClick={()=>setOwnColours(false)}>As pictured</button><button type="button" aria-pressed={ownColours} onClick={()=>setOwnColours(true)}>My colours</button></div>
    {ownColours&&<label>Your colours<input name="pieceColours" required maxLength={80} value={colours} onChange={e=>{setColours(e.target.value);setError('');}} placeholder="Blush pink, cream and a little sage"/><small>We’ll confirm yarn shades with you.</small></label>}
    </fieldset>
    {question&&<label>{question.label} <small>(optional)</small><input name="pieceFit" maxLength={90} placeholder={question.placeholder} value={fit} onChange={e=>setFit(e.target.value)}/><small>{question.help}</small></label>}
    <details className="piece-extra"><summary>Add a note for the maker</summary><label>Your note <small>(optional)</small><textarea name="pieceNote" rows={2} maxLength={140} value={note} onChange={e=>setNote(e.target.value)} placeholder="A detail you’d love us to consider…"/></label></details>
    {error&&<p className="error" role="alert">{error}</p>}
    <button className="button inline-product-request" disabled={!accepting}>Order this piece</button>
  </form>;
}

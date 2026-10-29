"use client";
import {useEffect} from 'react';
/** Optional enhancement: public, content-addressed studio images only. */
export function usePhotoCache(){useEffect(()=>{
  if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
  const register=()=>{void navigator.serviceWorker.register('/photo-cache.js',{scope:'/'}).catch(()=>{/* Normal network delivery remains available. */});};
  if(document.readyState==='complete'){register();return;}
  window.addEventListener('load',register,{once:true});
  return()=>window.removeEventListener('load',register);
},[]);}

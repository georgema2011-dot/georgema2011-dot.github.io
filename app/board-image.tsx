"use client";
/* eslint-disable @next/next/no-img-element */
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";

type Props = { src: string; alt: string; caption: string; width: number; height: number; eager: boolean };

export function BoardImage({src,alt,caption,width,height,eager}:Props){
 const [open,setOpen]=useState(false);
 const [zoomed,setZoomed]=useState(false);
 const opener=useRef<HTMLAnchorElement>(null);
 const dialog=useRef<HTMLDivElement>(null);
 const titleId=useId();
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  const main=document.querySelector("main");
  const wasInert=main?.inert??false;
 const activeOpener=opener.current;
  if(main)main.inert=true;
  document.body.style.overflow="hidden";
  const key=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){event.preventDefault();setOpen(false)}
   if(event.key==="Tab"){
    const controls=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button,a[href],[tabindex="0"]')??[]);
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  };
  document.addEventListener("keydown",key);
  const focus=requestAnimationFrame(()=>dialog.current?.querySelector("button")?.focus());
  return()=>{
   cancelAnimationFrame(focus);
   document.removeEventListener("keydown",key);
   document.body.style.overflow=previous;
   if(main)main.inert=wasInert;
   activeOpener?.focus();
  };
 },[open]);
 return <>
  <a className="board-view" href={src} target="_blank" rel="noreferrer" ref={opener} aria-label={`Enlarge image: ${alt}`} onClick={event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();setZoomed(false);setOpen(true)}}>
   <img src={src} alt={alt} width={width} height={height} loading={eager?"eager":"lazy"} decoding="async"/>
   <span className="board-enlarge">Enlarge image</span>
  </a>
  {open&&createPortal(<div className={`board-zoom ${zoomed?"is-zoomed":""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialog}>
   <div className="board-zoom-toolbar"><button type="button" onClick={()=>setOpen(false)}>Close image</button><button type="button" aria-pressed={zoomed} onClick={()=>setZoomed(value=>!value)}>{zoomed?"Fit to screen":"Actual size"}</button><a href={src} target="_blank" rel="noreferrer">Open original</a></div>
   <div className="board-zoom-stage" role="region" aria-label="Image viewing area. At actual size, scroll to explore the drawing."><img src={src} alt={alt} width={width} height={height} style={zoomed?{width}:undefined}/></div>
   <div className="board-zoom-caption"><p id={titleId}>{caption}</p><p>{zoomed?"Scroll to explore the drawing. Choose Fit to screen to see the whole board.":"Choose Actual size to inspect details. Press Escape to close."}</p></div>
  </div>,document.body)}
 </>;
}

"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/no-noninteractive-element-interactions */
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export type OrbitPhoto={file:string;place:string;title:string};

export function PhotoOrbit({photos}:{photos:OrbitPhoto[]}){
 const stage=useRef<HTMLDivElement>(null);
 const items=useRef<Array<HTMLButtonElement|null>>([]);
 const phase=useRef(0);
 const speed=useRef(1);
 const last=useRef(0);
 const frame=useRef(0);
 const opener=useRef<HTMLButtonElement|null>(null);
 const dialog=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [hovered,setHovered]=useState(false);
 const [lightbox,setLightbox]=useState<number|null>(null);
 useEffect(()=>{
  const node=stage.current;
  if(!node)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw=(time:number)=>{
   const dt=Math.min(.04,(time-last.current)/1000||0);
   last.current=time;
   if(paused||lightbox!==null||reduced)speed.current=0;
   else{
    const target=hovered?.12:1;
    speed.current+=(target-speed.current)*(1-Math.exp(-dt*5));
    phase.current+=dt*Math.PI/12*speed.current;
   }
   const width=node.clientWidth;
   const height=node.clientHeight;
   const rx=width*(width<620?.35:.39);
   const ry=height*.4;
   let foremost=0;
   let foremostDepth=-1;
   items.current.forEach((item,index)=>{
    if(!item)return;
    const angle=phase.current+index/photos.length*Math.PI*2;
    const x=Math.sin(angle*2)*rx;
    const y=-Math.cos(angle)*ry;
    const depth=(Math.sin(angle)+1)/2;
    if(depth>foremostDepth){foremost=index;foremostDepth=depth}
    const scale=.62+depth*.72;
    item.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale})`;
    item.style.opacity=String(.34+depth*.66);
    item.style.zIndex=String(10+Math.round(depth*90));
   });
   setActive(current=>current===foremost?current:foremost);
   frame.current=requestAnimationFrame(draw);
  };
  frame.current=requestAnimationFrame(draw);
  return()=>cancelAnimationFrame(frame.current);
 },[hovered,lightbox,paused,photos.length]);

 useEffect(()=>{
  if(lightbox===null)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const key=(event:KeyboardEvent)=>{
   if(event.key==="Escape")setLightbox(null);
   if(event.key==="ArrowLeft")setLightbox(index=>(index===null?0:(index-1+photos.length)%photos.length));
   if(event.key==="ArrowRight")setLightbox(index=>(index===null?0:(index+1)%photos.length));
   if(event.key==="Tab"){
    const focusable=[...dialog.current?.querySelectorAll<HTMLElement>("button")||[]];
    if(!focusable.length)return;
    const first=focusable[0],lastItem=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();lastItem.focus()}
    else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();first.focus()}
   }
  };
  document.addEventListener("keydown",key);
  requestAnimationFrame(()=>dialog.current?.querySelector<HTMLButtonElement>(".lightbox-close")?.focus());
  return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",key);opener.current?.focus()};
 },[lightbox,photos.length]);

 const open=(index:number,event:React.MouseEvent<HTMLButtonElement>)=>{opener.current=event.currentTarget;setLightbox(index)};
 const current=photos[active];
 const shown=lightbox===null?null:photos[lightbox];

 return <section className="photo-archive" id="photography">
  <header className="archive-head">
   <div><p className="label">Personal study / Photography</p><h2>Photography Orbit</h2></div>
   <p>Fragments from Scandinavia, Copenhagen and Hong Kong revolve as a living contact sheet. Select any snapshot to see the complete frame.</p>
   <div className="archive-controls"><button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?"Play orbit":"Pause orbit"}</button></div>
  </header>
  <div className="orbit-stage" ref={stage} role="region" aria-roledescription="carousel" aria-label="Revolving photography archive" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
   <div className="orbit-title" aria-live="off"><span>{current.title}</span><small>{current.place}</small></div>
   {photos.map((photo,index)=><button className="orbit-snapshot" ref={node=>{items.current[index]=node}} type="button" key={photo.file} onClick={event=>open(index,event)} onFocus={()=>setHovered(true)} onBlur={()=>setHovered(false)} aria-label={`Open ${photo.title}, ${photo.place} full screen`}>
    <img src={`/photo-dump/web/${photo.file}`} alt="" loading={index<4?"eager":"lazy"} decoding="async"/>
   </button>)}
  </div>
  {shown&&createPortal(<div className="photo-lightbox" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onMouseDown={event=>{if(event.target===event.currentTarget)setLightbox(null)}}>
   <button className="lightbox-close" type="button" onClick={()=>setLightbox(null)} aria-label="Close full-screen photograph">Close</button>
   <button className="lightbox-prev" type="button" onClick={()=>setLightbox(index=>(index!-1+photos.length)%photos.length)} aria-label="Previous photograph">←</button>
   <figure><img src={`/photo-dump/web/${shown.file}`} alt={`${shown.title}, ${shown.place}`}/><figcaption><span id="lightbox-title">{shown.title}</span><span>{shown.place}</span></figcaption></figure>
   <button className="lightbox-next" type="button" onClick={()=>setLightbox(index=>(index!+1)%photos.length)} aria-label="Next photograph">→</button>
  </div>,document.body)}
 </section>
}

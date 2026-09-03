"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { PhotoOrbit, type OrbitPhoto } from "./photo-orbit";
import { projects } from "./projects-data";

const archiveFiles=[
 "archive-gm-1-2.webp","archive-gm-1-3.webp","archive-gm-1.webp","archive-gm-10-2.webp","archive-gm-10.webp","archive-gm-11-2.webp","archive-gm-11.webp","archive-gm-12-2.webp","archive-gm-12.webp","archive-gm-13-2.webp","archive-gm-13.webp","archive-gm-14-2.webp","archive-gm-14.webp","archive-gm-15-2.webp","archive-gm-15.webp","archive-gm-17.webp","archive-gm-18.webp","archive-gm-2-2.webp","archive-gm-2-3.webp","archive-gm-2.webp","archive-gm-3-2.webp","archive-gm-3-3.webp","archive-gm-3.webp","archive-gm-4-2.webp","archive-gm-4-3.webp","archive-gm-4.webp","archive-gm-5-2.webp","archive-gm-5-3.webp","archive-gm-5.webp","archive-gm-6-2.webp","archive-gm-6-3.webp","archive-gm-6.webp","archive-gm-7-2.webp","archive-gm-7-3.webp","archive-gm-7.webp","archive-gm-8-2.webp","archive-gm-8-3.webp","archive-gm-8.webp","archive-gm-9-2.webp","archive-gm-9.webp","archive-gm-chunartboard-11.webp","archive-gm-chunartboard-12.webp","archive-gm-chunartboard-3.webp","archive-gm-chunartboard-5.webp","archive-gm-chunartboard-6.webp","archive-gm-chunartboard-8.webp","archive-gm-chunartboard-9.webp"
] as const;

const photographs:OrbitPhoto[]=[
 {file:"scandinavia-van.webp",place:"Norway",title:"Roadside pause"},{file:"scandinavia-pass.webp",place:"Norway",title:"Open distance"},{file:"scandinavia-road.webp",place:"Norway",title:"Through the valley"},
 {file:"copenhagen-arcade.webp",place:"Copenhagen",title:"After hours"},{file:"copenhagen-street.webp",place:"Copenhagen",title:"Corner study"},{file:"copenhagen-shore.webp",place:"Copenhagen",title:"The quiet edge"},
 {file:"hong-kong-motion.webp",place:"Hong Kong",title:"Velocity"},{file:"hong-kong-temple.webp",place:"Hong Kong",title:"Threshold"},{file:"hong-kong-reflection.webp",place:"Hong Kong",title:"Passing image"},
 {file:"hong-kong-courtyard.webp",place:"Hong Kong",title:"Gathering"},{file:"hong-kong-market.webp",place:"Hong Kong",title:"Street room"},{file:"hong-kong-density.webp",place:"Hong Kong",title:"Compression"},
 ...archiveFiles.map((file,index)=>({file,place:"Personal archive",title:`Photo study ${String(index+1).padStart(2,"0")}`}))
];

function Label({children}:{children:React.ReactNode}){return <p className="label">{children}</p>}

function HeroSlideshow(){
 const [active,setActive]=useState(0);
 const [hovered,setHovered]=useState(false);
 useEffect(()=>{
  if(hovered||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const timer=window.setInterval(()=>setActive(index=>(index+1)%projects.length),2200);
  return()=>window.clearInterval(timer);
 },[hovered]);
 const project=projects[active];
 const board=project.boards[0];
 return <figure className="hero-image" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
  <a className="hero-slide-link" href={`/projects/${project.id}/`} aria-label={`View ${project.title} project details`}>
   <img className="hero-slide" key={board.src} src={board.src} alt={board.alt}/>
   <span className="hero-slide-action">View project ↘</span>
  </a>
  <figcaption><span>{project.number} / {project.title}</span><span>{project.discipline} · {project.year}</span></figcaption>
 </figure>
}

function BlobIntro(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const element=canvas.current;
  const host=element?.parentElement?.parentElement;
  if(!element||!host)return;
  let disposed=false;
  let cleanup:(()=>void)|undefined;
  import("./symbiote-scene").then(({createSymbioteScene})=>{
   if(disposed)return;
   cleanup=createSymbioteScene(element,host);
  });
  return()=>{disposed=true;cleanup?.()};
 },[]);
 return <div className="blob-intro symbiote-scene" aria-hidden="true">
  <canvas ref={canvas}/>
  <span>Move to attract · Click to feed</span>
 </div>
}

export default function Home(){
 return <main id="top">
  <nav className="site-nav" aria-label="Primary navigation"><a className="brand" href="#top">Ma / George</a><span className="nav-role">Spatial + Industrial Designer</span><div className="nav-links"><a href="#work">Projects</a><a href="#photography">Photography</a><a href="#contact">Contact</a></div></nav>
  <header className="hero">
   <div className="hero-intro"><BlobIntro/><Label>Singapore / 01°17′N / Portfolio 2026</Label><blockquote className="hero-quote"><h1>“The idea begins as a small form in your head. It becomes real when you draw it, test it and share it.”</h1></blockquote></div>
   <HeroSlideshow/>
   <div className="hero-index"><span>01—07</span><p>Spatial, industrial, interaction and inclusive design.</p><a href="#work">View projects ↓</a></div>
  </header>
  <section className="about-grid" id="about"><Label>Profile / 00</Label><h2>Designing across scales.</h2><p>I am Ma Shun Ngai George, an interdisciplinary spatial and industrial designer interested in how planning, material choices and human behaviour reshape everyday experience.</p><ul><li>Spatial design</li><li>Industrial design</li><li>Inclusive design</li><li>Photography</li></ul></section>
  <section className="experience" aria-labelledby="experience-title"><header><Label>Experience / 02</Label><h2 id="experience-title">Industry practice.</h2></header><ol><li><span>01</span><strong>SpaceLogic</strong><span>Internship</span></li><li><span>02</span><strong>M Moser Associates</strong><span>Internship</span></li></ol></section>
  <section className="project-index" id="work"><header><Label>Selected projects / 01—07</Label><h2>Work Index</h2></header><div className="index-list">{projects.map(project=><a href={`/projects/${project.id}/`} key={project.id}><span>{project.number}</span><strong>{project.title}</strong><span>{project.discipline}</span><span>{project.year}</span><b>↗</b></a>)}</div></section>
  <PhotoOrbit photos={photographs}/>
  <section className="press-feature" aria-labelledby="press-title">
   <div className="press-meta"><Label>Press / 01</Label><span>The Straits Times</span><time dateTime="2023-09-08">08.09.2023</time></div>
   <div className="press-story"><Label>Now Is Not The Time / Mirror Maze</Label><h2 id="press-title">A young designer’s view of legacy.</h2><p>The Straits Times featured Mr George Ma as one of 10 NYP students involved in creating the exhibition’s mirror-maze installation.</p></div>
   <blockquote className="press-quote">“After this project, through the research and all, it made me realise that what he did in the past influenced whatever that happens now.”<cite>— Mr George Ma</cite></blockquote>
   <a className="press-link" href="https://www.straitstimes.com/singapore/immersive-exhibition-shares-lee-kuan-yew-s-life-and-legacy-with-the-young" target="_blank" rel="noreferrer">Read the article <span aria-hidden="true">↗</span></a>
   <div className="press-visuals">
    <figure><img src="https://cassette.sphdigital.com.sg/image/straitstimes/0ef02c706a6b15fefc55cf03585f9351cebed67ce1114edd68362e53698faf56" alt="Now Is Not The Time immersive exhibition in Singapore" referrerPolicy="no-referrer"/><figcaption><span>01</span>Exhibition overview <cite>ST Photo: Ng Sor Luan</cite></figcaption></figure>
    <figure><img src="https://cassette.sphdigital.com.sg/image/straitstimes/edac579e3c78c6b0eee02337a7cc5f1b3ad707660c7c9d2aa977a1c96bdc72d7" alt="Mirror maze installation at the Now Is Not The Time exhibition" referrerPolicy="no-referrer"/><figcaption><span>02</span>Mirror maze installation <cite>ST Photo: Ng Sor Luan</cite></figcaption></figure>
   </div>
  </section>
  <footer className="site-footer" id="contact"><div><Label>Contact / Singapore</Label><h2>Let’s shape what’s next.</h2></div><a className="email" href="mailto:georgem2011@gmail.com">georgem2011@gmail.com ↗</a><div className="footer-line"><span>© 2026 Ma Shun Ngai George</span><a href="https://github.com/georgema2011-dot">GitHub</a><a href="#top">Back to top ↑</a></div></footer>
 </main>
}

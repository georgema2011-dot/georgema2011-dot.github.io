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

const previews = [
 { id: "japandi", label: "Interior design", title: "Japandi Retreat", alt: "Filtered light across a timber-lined compact bedroom" },
 { id: "somepen", label: "Industrial design", title: "SOMEPEN", alt: "A transparent four-colour pen worn around a finger" },
 { id: "visual-bridge", label: "Spatial computing", title: "Visual Bridge", alt: "A layered knee model with floating anatomy controls" },
 { id: "sca-lab", label: "Spatial + interaction design", title: "SCA-Lab", alt: "Interior rendering of the SCA-Lab viewing and control area overlooking the track" },
];
const gallery = [...previews.slice(0,3).map(preview => projects.find(item => item.id === preview.id)!),
 ...projects.filter(item => !previews.slice(0,3).some(preview => preview.id === item.id))];

function HeroSlideshow(){
 const [start,setStart] = useState(0);
 const move = (step:number) => setStart(index => (index + step + gallery.length) % gallery.length);
 return <section className="project-trio" aria-label="Selected projects" aria-roledescription="carousel">
  <div className="trio-grid" aria-live="polite">
   {[0,1,2].map(offset => {
    const item = gallery[(start + offset) % gallery.length];
    const preview = previews.find(entry => entry.id === item.id);
    return <a href={`/projects/${item.id}/`} key={item.id}>
     <img src={preview ? `/projects/${item.id}/preview.webp` : item.boards[0].src} alt={preview?.alt ?? item.boards[0].alt}/>
     <small>{preview?.label ?? item.discipline}</small><strong>{preview?.title ?? item.title}</strong>
    </a>;
   })}
  </div>
  <div className="trio-nav"><a href="#work">All {projects.length} projects ↓</a><button onClick={()=>move(-1)} aria-label="Previous projects">←</button><button onClick={()=>move(1)} aria-label="Next projects">→</button></div>
 </section>
}

function BlobIntro(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const stage=useRef<HTMLDivElement>(null);
 const feed=useRef<(()=>void)|null>(null);
 const pauseScene=useRef<((paused:boolean)=>void)|null>(null);
 const [ready,setReady]=useState(false);
 const [fed,setFed]=useState(0);
 const [paused,setPaused]=useState(false);
 const [reducedMotion,setReducedMotion]=useState(false);
 const [unavailable,setUnavailable]=useState(false);
 useEffect(()=>{
  const element=canvas.current;
  const host=stage.current;
  if(!element||!host)return;
  let disposed=false;
  let cleanup:(()=>void)|undefined;
  import("./symbiote-scene").then(({createSymbioteScene})=>{
   if(disposed)return;
   const scene=createSymbioteScene(element,host,count=>setFed(count));
   cleanup=scene.dispose;
   feed.current=scene.feed;
   pauseScene.current=scene.setPaused;
   setPaused(scene.reducedMotion);
   setReducedMotion(scene.reducedMotion);
   setReady(true);
  }).catch(()=>{if(!disposed)setUnavailable(true)});
  return()=>{disposed=true;feed.current=null;pauseScene.current=null;cleanup?.()};
 },[]);
 return <section className="idea-playground" aria-labelledby="idea-title">
  <div className="idea-copy"><p className="label">A little idea, made tangible</p><h2 id="idea-title">Every design starts with an idea. Feed it.</h2><p>An idea grows when you give it attention. Feed this one and watch it take shape.</p><div className="idea-actions"><button type="button" className="idea-feed" disabled={!ready||fed>=10} onClick={()=>feed.current?.()}>{fed>=10?"Idea fully grown":"Feed the idea"}</button><button type="button" className="idea-pause" disabled={!ready||reducedMotion} aria-pressed={paused} onClick={()=>{const next=!paused;pauseScene.current?.(next);setPaused(next)}}>{reducedMotion?"Reduced motion enabled":paused?"Resume animation":"Pause animation"}</button></div><p className="idea-status" role="status">{unavailable?"The interactive preview is unavailable on this device.":!ready?"Preparing your idea…":fed>=10?"Fully grown. Take that curiosity into the projects below.":fed?`Idea fed ${fed} of 10 times. Keep feeding your curiosity.`:"Ready when you are."}</p></div>
  <div className="idea-stage" ref={stage}><canvas ref={canvas} aria-hidden="true"/><span className="idea-hint">Move to explore · Tap to feed</span></div>
 </section>
}

export default function Home(){
 return <main id="top">
  <a className="skip-link" href="#work">Skip to selected work</a>
  <nav className="site-nav" aria-label="Primary navigation"><a className="brand" href="#top">Ma / George</a><span className="nav-role">Spatial + Industrial Designer</span><div className="nav-links"><a href="#work">Projects</a><a href="#photography">Photography</a><a href="#contact">Contact</a></div></nav>
  <header className="hero">
   <div className="hero-intro"><Label>Ma Shun Ngai George / Singapore / Portfolio 2026</Label><div className="hero-copy"><h1>Spatial + Industrial Designer</h1></div></div>
   <BlobIntro/>
   <HeroSlideshow/>
  </header>
  <section className="proof-strip" aria-label="Portfolio summary"><a href="#work"><strong>{projects.length}</strong><span>Case studies across interiors, products and services</span></a><a href="#experience"><strong>2</strong><span>Design internships at SpaceLogic and M Moser Associates</span></a><a href="#press"><strong>Press</strong><span>Featured by The Straits Times</span></a></section>
  <section className="about-grid" id="about"><Label>Profile / 00</Label><h2>Designing across scales.</h2><div><p>I design spaces, products and services around real behaviour. I am Ma Shun Ngai George, an interdisciplinary spatial and industrial designer interested in how planning, material choices and human behaviour reshape everyday experience.</p><blockquote className="profile-quote">“The idea begins as a small form in your head. It becomes real when you draw it, test it and share it.”</blockquote></div><ul><li>Spatial design</li><li>Industrial design</li><li>Inclusive design</li><li>Photography</li></ul></section>
  <section className="experience" id="experience" aria-labelledby="experience-title"><header><Label>Experience / 02</Label><h2 id="experience-title">Industry practice.</h2></header><ol><li><span>01</span><strong>SpaceLogic</strong><span>Design internship</span></li><li><span>02</span><strong>M Moser Associates</strong><span>Design internship</span></li></ol></section>
  <section className="project-index" id="work"><header><Label>Selected projects / 01-{String(projects.length).padStart(2,"0")}</Label><h2>Work Index</h2></header><div className="index-list">{projects.map(project=><a href={`/projects/${project.id}/`} key={project.id}><span>{project.number}</span><strong>{project.title}</strong><span>{project.discipline}</span><span>{project.year}</span><b>↗</b></a>)}</div></section>
  <section className="press-feature" id="press" aria-labelledby="press-title">
   <div className="press-meta"><Label>Press / 01</Label><span>The Straits Times</span><time dateTime="2023-09-08">08.09.2023</time></div>
   <div className="press-story"><Label>Now Is Not The Time / Mirror Maze</Label><h2 id="press-title">A young designer’s view of legacy.</h2><p>The Straits Times featured Mr George Ma as one of 10 NYP students involved in creating the exhibition’s mirror-maze installation.</p></div>
   <blockquote className="press-quote">“After this project, through the research and all, it made me realise that what he did in the past influenced whatever that happens now.”<cite>Mr George Ma</cite></blockquote>
   <a className="press-link" href="https://www.straitstimes.com/singapore/immersive-exhibition-shares-lee-kuan-yew-s-life-and-legacy-with-the-young" target="_blank" rel="noreferrer">Read the article <span aria-hidden="true">↗</span></a>
   <div className="press-visuals">
    <figure><img src="https://cassette.sphdigital.com.sg/image/straitstimes/0ef02c706a6b15fefc55cf03585f9351cebed67ce1114edd68362e53698faf56" alt="Now Is Not The Time immersive exhibition in Singapore" referrerPolicy="no-referrer" loading="lazy" decoding="async"/><figcaption><span>01</span>Exhibition overview <cite>ST Photo: Ng Sor Luan</cite></figcaption></figure>
    <figure><img src="https://cassette.sphdigital.com.sg/image/straitstimes/edac579e3c78c6b0eee02337a7cc5f1b3ad707660c7c9d2aa977a1c96bdc72d7" alt="Mirror maze installation at the Now Is Not The Time exhibition" referrerPolicy="no-referrer" loading="lazy" decoding="async"/><figcaption><span>02</span>Mirror maze installation <cite>ST Photo: Ng Sor Luan</cite></figcaption></figure>
   </div>
  </section>
  <PhotoOrbit photos={photographs}/>
  <footer className="site-footer" id="contact"><div><Label>Contact / Singapore</Label><h2>Let’s discuss a role or project.</h2></div><a className="email" href="mailto:georgema2011@gmail.com">georgema2011@gmail.com ↗</a><div className="footer-line"><span>© 2026 Ma Shun Ngai George</span><a href="https://github.com/georgema2011-dot">GitHub</a><a href="#top">Back to top ↑</a></div></footer>
 </main>
}

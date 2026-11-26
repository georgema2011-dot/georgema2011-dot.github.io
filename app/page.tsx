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
 { id: "hip-reduction-simulator", label: "Healthcare product", title: "Hip Reduction Simulator", alt: "Physical hip-reduction training simulator with lower limb model and resistance mechanism" },
];
const gallery = [...previews.slice(0,3).map(preview => projects.find(item => item.id === preview.id)!),
 ...projects.filter(item => !previews.slice(0,3).some(preview => preview.id === item.id))];

function HeroSlideshow(){
 const [start,setStart] = useState(0);
 const [paused,setPaused] = useState(false);
 const [hoveredOrFocused,setHoveredOrFocused] = useState(false);
 const [pageVisible,setPageVisible] = useState(true);
 const [reducedMotion,setReducedMotion] = useState(false);
 const move = (step:number) => setStart(index => (index + step + gallery.length) % gallery.length);
 useEffect(()=>{
  const query=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>setReducedMotion(query.matches);
  update();
  query.addEventListener("change",update);
  const updateVisibility=()=>setPageVisible(!document.hidden);
  updateVisibility();
  document.addEventListener("visibilitychange",updateVisibility);
  return()=>{query.removeEventListener("change",update);document.removeEventListener("visibilitychange",updateVisibility)};
 },[]);
 useEffect(()=>{
  if(paused||hoveredOrFocused||reducedMotion||!pageVisible)return;
  const interval=window.setInterval(()=>move(1),8000);
  return()=>window.clearInterval(interval);
 },[paused,hoveredOrFocused,reducedMotion,pageVisible]);
 return <section className="project-trio" aria-label="Selected projects" aria-roledescription="carousel" onMouseEnter={()=>setHoveredOrFocused(true)} onMouseLeave={()=>setHoveredOrFocused(false)} onFocusCapture={()=>setHoveredOrFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setHoveredOrFocused(false)}}>
  <div className="trio-grid" aria-live="off">
   {[0,1,2].map(offset => {
    const item = gallery[(start + offset) % gallery.length];
    const preview = previews.find(entry => entry.id === item.id);
    return <a href={`/projects/${item.id}/`} key={item.id}>
     <img src={preview ? `/projects/${item.id}/preview.webp` : item.boards[0].src} alt={preview?.alt ?? item.boards[0].alt}/>
     <small>{preview?.label ?? item.discipline}</small><strong>{preview?.title ?? item.title}</strong>
    </a>;
   })}
  </div>
  <div className="trio-nav"><a href="#work">All {projects.length} projects ↓</a><button type="button" className="trio-pause" onClick={()=>setPaused(value=>!value)} aria-pressed={paused} aria-label={reducedMotion?"Reduced motion is enabled":paused?"Play project carousel":"Pause project carousel"} disabled={reducedMotion}>{reducedMotion?"still":paused?"play":"pause"}</button><button type="button" onClick={()=>move(-1)} aria-label="Previous projects">←</button><button type="button" onClick={()=>move(1)} aria-label="Next projects">→</button></div>
 </section>
}

function BlobIntro(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const stage=useRef<HTMLDivElement>(null);
 const feed=useRef<(()=>void)|null>(null);
 const pauseScene=useRef<((paused:boolean)=>void)|null>(null);
 const [ready,setReady]=useState(false);
 const [reaction,setReaction]=useState("");
 const [spark,setSpark]=useState<{x:number;y:number;id:number}|null>(null);
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
   const scene=createSymbioteScene(element,host,count=>setReaction(["a little spark.","ooh. an idea.","that's the spirit.","keep it curious."][count%4]));
   cleanup=scene.dispose;
   feed.current=scene.feed;
   pauseScene.current=scene.setPaused;
   setPaused(scene.reducedMotion);
   setReducedMotion(scene.reducedMotion);
   setReady(true);
  }).catch(()=>{if(!disposed)setUnavailable(true)});
  return()=>{disposed=true;feed.current=null;pauseScene.current=null;cleanup?.()};
 },[]);
 useEffect(()=>{
  if(!reaction&&!spark)return;
  const timeout=setTimeout(()=>{setReaction("");setSpark(null)},1600);
  return()=>clearTimeout(timeout);
 },[reaction,spark]);
 return <section className="idea-playground" aria-labelledby="idea-title">
  <div className="idea-copy"><p className="label">A thought in progress</p><h2 id="idea-title">Every design starts with an idea.</h2><p>Give it a little curiosity. Let it take shape.</p></div>
  <div className="idea-play"><div className="idea-stage" ref={stage} role="button" tabIndex={ready?0:-1} aria-label="Play with the idea. Tap or press Enter or Space to give it a little spark." aria-disabled={!ready} onPointerDown={event=>{if(!ready||event.button!==0)return;const rect=event.currentTarget.getBoundingClientRect();setSpark({x:event.clientX-rect.left,y:event.clientY-rect.top,id:performance.now()})}} onKeyDown={event=>{if(ready&&(event.key==="Enter"||event.key===" ")){event.preventDefault();if(!event.repeat){feed.current?.();setSpark({x:event.currentTarget.clientWidth/2,y:event.currentTarget.clientHeight*.45,id:performance.now()})}}}}><canvas ref={canvas} aria-hidden="true"/>{spark&&<span key={spark.id} className="idea-spark" aria-hidden="true" style={{left:spark.x,top:spark.y}}>✳</span>}<span className="idea-hint">{unavailable?"This little idea is taking a break.":!ready?"a thought is forming…":reaction||"psst. try a little tap."}</span></div><span className="idea-live" role="status">{reaction}</span><button type="button" className="idea-pause" disabled={!ready||reducedMotion} aria-label={reducedMotion?"Reduced motion enabled":paused?"Resume animation":"Pause animation"} aria-pressed={paused} onClick={()=>{const next=!paused;pauseScene.current?.(next);setPaused(next)}}>{reducedMotion?"still":paused?"play":"pause"}</button></div>
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

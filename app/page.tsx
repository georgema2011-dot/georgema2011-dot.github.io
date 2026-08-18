"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

type Project = { id:string; number:string; title:string; discipline:string; year:string; statement:string; description:string; boards:Array<{src:string;alt:string;caption:string}> };

const projects:Project[]=[
 {id:"japandi",number:"01",title:"Japandi Retreat",discipline:"Hospitality",year:"2024",statement:"Home away from home.",description:"An open resort room organised as a quiet sequence of arrival, bathing and rest. Concrete, timber and filtered light protect privacy without closing the interior down.",boards:[
  {src:"/portfolio/page-04.jpg",alt:"Japandi resort room with two beds on a raised timber platform",caption:"Spatial atmosphere / material study"},
  {src:"/portfolio/page-05.jpg",alt:"Japandi floor plan and bathroom studies",caption:"Plan, arrival sequence and bathroom studies"}]},
 {id:"masks",number:"02",title:"Looking Through the Masks of the City",discipline:"Urban intervention",year:"2024",statement:"A city of façades.",description:"A crochet studio at Clarke Quay Central uses layered thresholds, woven bamboo and collective making to study the identities a city reveals throughout the day.",boards:[
  {src:"/portfolio/page-06.jpg",alt:"Layered city collage with Chinese opera masks",caption:"Urban slice / mask study"},
  {src:"/portfolio/page-08.jpg",alt:"Wearable sound experiment and audio data",caption:"Sound mapping / social intensity"},
  {src:"/portfolio/page-16.jpg",alt:"Crochet studio with bamboo walls and suspended wave installation",caption:"Final intervention / collective display"}]},
 {id:"union",number:"03",title:"The Union",discipline:"Public space",year:"2023",statement:"Protection without separation.",description:"An undulating canopy and concentric seating gather people beneath an existing tree, turning the shaded ground into a shared room without erasing its natural centre.",boards:[
  {src:"/portfolio/page-19.jpg",alt:"Technical presentation of a white canopy beneath a large tree",caption:"Canopy system / public seating"}]},
 {id:"watergrounds",number:"04",title:"Watergrounds",discipline:"Play",year:"2023",statement:"A familiar form, reimagined.",description:"The silhouette of a water tower becomes a climbable landmark. Mesh, structure and wet-play elements connect the playground to both park and skyline.",boards:[
  {src:"/portfolio/page-20.jpg",alt:"Technical drawings of a water-tower playground",caption:"Top view, isometric and elevation"},
  {src:"/portfolio/page-21.jpg",alt:"Purple climbing structure in a landscaped park",caption:"Water tower playground / final view"}]},
 {id:"asda",number:"05",title:"ASDA 2022",discipline:"Inclusive interior",year:"2022",statement:"Dignity across generations.",description:"A multi-generational bathroom coordinates reach, assistance, air and privacy. Support elements are integrated into the architecture instead of added as afterthoughts.",boards:[
  {src:"/portfolio/page-22.jpg",alt:"Accessible multi-generational bathroom with warm timber and concrete finishes",caption:"Interior proposal / accessible vanity"},
  {src:"/portfolio/page-23.jpg",alt:"Dimensioned bathroom plans and elevations",caption:"Plans and elevations"},
  {src:"/portfolio/page-24.jpg",alt:"Bathroom details and material mood board",caption:"Details, finishes and material study"}]}
];

const photographs=[
 ["scandinavia-van.webp","Norway","Roadside pause"],["scandinavia-pass.webp","Norway","Open distance"],["scandinavia-road.webp","Norway","Through the valley"],
 ["copenhagen-arcade.webp","Copenhagen","After hours"],["copenhagen-street.webp","Copenhagen","Corner study"],["copenhagen-shore.webp","Copenhagen","The quiet edge"],
 ["hong-kong-motion.webp","Hong Kong","Velocity"],["hong-kong-temple.webp","Hong Kong","Threshold"],["hong-kong-reflection.webp","Hong Kong","Passing image"],
 ["hong-kong-courtyard.webp","Hong Kong","Gathering"],["hong-kong-market.webp","Hong Kong","Street room"],["hong-kong-density.webp","Hong Kong","Compression"]
];

function Label({children}:{children:React.ReactNode}){return <p className="label">{children}</p>}

function BlobIntro(){
 return <div className="blob-intro" aria-hidden="true">
  <i className="blob-shadow"/>
  <i className="blob-drop drop-one"/>
  <i className="blob-drop drop-two"/>
  <div className="landing-blob"><i/></div>
 </div>
}

function ProjectDossier({project,index}:{project:Project;index:number}){
 return <article className="dossier" id={project.id}>
  <header className="dossier-head">
   <div className="dossier-number"><Label>Project</Label><span>{project.number}</span></div>
   <div className="dossier-title"><Label>{project.discipline} / {project.year}</Label><h2>{project.title}</h2></div>
   <div className="dossier-copy"><p className="statement">{project.statement}</p><p>{project.description}</p></div>
  </header>
  <div className={`board-grid board-grid-${project.boards.length}`}>
   {project.boards.map((board,boardIndex)=><figure className={`board board-${boardIndex+1}`} key={board.src}>
    <img src={board.src} alt={board.alt} loading={index===0&&boardIndex===0?"eager":"lazy"}/>
    <figcaption><span>{project.number}.{String(boardIndex+1).padStart(2,"0")}</span><span>{board.caption}</span></figcaption>
   </figure>)}
  </div>
 </article>
}

function PhotoArchive(){
 const track=useRef<HTMLDivElement>(null);
 const raf=useRef(0);
 const [active,setActive]=useState(0);
 useEffect(()=>()=>{if(raf.current)cancelAnimationFrame(raf.current)},[]);
 const move=(next:number)=>{
  const index=Math.max(0,Math.min(next,photographs.length-1));
  const slide=track.current?.querySelectorAll<HTMLElement>(".photo-slide")[index];
  slide?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",inline:"center",block:"nearest"});
  setActive(index);
 };
 const sync=()=>{
  if(raf.current)return;
  raf.current=requestAnimationFrame(()=>{
   raf.current=0;
   const node=track.current;if(!node)return;
   const center=node.scrollLeft+node.clientWidth/2;
   const slides=[...node.querySelectorAll<HTMLElement>(".photo-slide")];
   const next=slides.reduce((best,slide,index)=>Math.abs(slide.offsetLeft+slide.offsetWidth/2-center)<Math.abs(slides[best].offsetLeft+slides[best].offsetWidth/2-center)?index:best,0);
   setActive(next);
  });
 };
 return <section className="photo-archive" id="photography">
  <header className="archive-head">
   <div><Label>Project 06 / Personal study</Label><h2>Photography<br/>Archive</h2></div>
   <p>Fragments from Scandinavia, Copenhagen and Hong Kong. Quiet edges, crowded light and places carrying evidence of time.</p>
   <div className="archive-controls"><span>{String(active+1).padStart(2,"0")} / {String(photographs.length).padStart(2,"0")}</span><button onClick={()=>move(active-1)} disabled={active===0} aria-label="Previous photograph">←</button><button onClick={()=>move(active+1)} disabled={active===photographs.length-1} aria-label="Next photograph">→</button></div>
  </header>
  {/* The region is intentionally focusable so keyboard users can operate the horizontal archive. */}
  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
  <div className="photo-track" ref={track} onScroll={sync} tabIndex={0} onKeyDown={event=>{if(event.key==="ArrowLeft")move(active-1);if(event.key==="ArrowRight")move(active+1)}} aria-label="Photography archive" role="region" aria-roledescription="carousel">
   {photographs.map(([file,place,title],index)=><figure className="photo-slide" key={file} aria-label={`${index+1} of ${photographs.length}: ${title}`} role="group" aria-roledescription="slide"><img src={`/photo-dump/web/${file}`} alt={`${title}, ${place}`} loading={index<2?"eager":"lazy"}/><figcaption><span>{String(index+1).padStart(3,"0")}</span><span>{title}</span><span>{place}</span></figcaption></figure>)}
  </div>
 </section>
}

export default function Home(){
 return <main id="top">
  <nav className="site-nav" aria-label="Primary navigation"><a className="brand" href="#top">Ma / George</a><span className="nav-role">Interior + Spatial Designer</span><div className="nav-links"><a href="#work">Projects</a><a href="#photography">Photography</a><a href="#contact">Contact</a></div></nav>
  <header className="hero">
   <div className="hero-intro"><BlobIntro/><Label>Singapore / 01°17′N / Portfolio 2026</Label><blockquote className="hero-quote">“The idea begins as a small form in your head. It becomes real when you draw it, test it and share it.”</blockquote><h1>Spaces are<br/>never neutral.</h1></div>
   <figure className="hero-image"><img src="/portfolio/page-16.jpg" alt="Interior installation with woven bamboo walls"/><figcaption>Selected spatial study / 2024</figcaption></figure>
   <div className="hero-index"><span>01—05</span><p>Interior, public space, play and inclusive design.</p><a href="#work">View projects ↓</a></div>
  </header>
  <section className="about-grid" id="about"><Label>Profile / 00</Label><h2>Designing spaces that connect people, place and possibility.</h2><p>I am Ma Shun Ngai George, an interior and spatial designer interested in how planning, material choices and human behaviour reshape everyday experience.</p><ul><li>Interior</li><li>Spatial</li><li>Inclusive design</li><li>Photography</li></ul></section>
  <section className="project-index" id="work"><header><Label>Selected projects / 01—05</Label><h2>Work Index</h2></header><div className="index-list">{projects.map(project=><a href={`#${project.id}`} key={project.id}><span>{project.number}</span><strong>{project.title}</strong><span>{project.discipline}</span><span>{project.year}</span><b>↘</b></a>)}</div></section>
  {projects.map((project,index)=><ProjectDossier project={project} index={index} key={project.id}/>)}
  <PhotoArchive/>
  <footer className="site-footer" id="contact"><div><Label>Contact / Singapore</Label><h2>Let’s shape<br/>what’s next.</h2></div><a className="email" href="mailto:georgem2011@gmail.com">georgem2011@gmail.com ↗</a><div className="footer-line"><span>© 2026 Ma Shun Ngai George</span><a href="https://github.com/georgema2011-dot">GitHub</a><a href="#top">Back to top ↑</a></div></footer>
 </main>
}

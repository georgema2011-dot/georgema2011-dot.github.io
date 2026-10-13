export type Project = {
  id: string;
  number: string;
  title: string;
  discipline: string;
  year: string;
  statement: string;
  description: string;
  document?: { href: string; label: string };
  facts?: Array<{ label: string; value: string }>;
  boards: Array<{ src: string; alt: string; caption: string }>;
};

const scaLabPages = [
  { page: 1, caption: "Cover" }, { page: 4, caption: "Design concept" },
  { page: 5, caption: "Spatial programme" }, { page: 7, caption: "Land and water testing terrain" },
  { page: 11, caption: "Viewing and control area" }, { page: 13, caption: "Innovation workshop" },
  { page: 15, caption: "Cloud control application" },
];

export const projects: Project[] = [
  { id:"japandi", number:"01", title:"Japandi Retreat", discipline:"Hospitality interior", year:"2024", statement:"Home away from home.", description:"An L-shaped resort room separates arrival, bathing and sleep. A bathroom wall screens the entrance, while concrete, timber and filtered openings create privacy without closing the room.", facts:[
    {label:"Focus",value:"Privacy, arrival and rest"},{label:"Method",value:"Plan sequencing and material study"},{label:"Output",value:"Hospitality interior proposal"}], boards:[
    {src:"/portfolio/page-04.jpg",alt:"Japandi resort room with two beds on a raised timber platform",caption:"Spatial atmosphere / material study"},
    {src:"/portfolio/page-05.jpg",alt:"Japandi floor plan and bathroom studies",caption:"Plan, arrival sequence and bathroom studies"}]},
  { id:"masks", number:"02", title:"Looking Through the Masks of the City", discipline:"Urban intervention", year:"2024", statement:"A city of façades.", description:"Sound recordings map Clarke Quay Central across the day. The study becomes a crochet studio built around layered thresholds, woven bamboo and collective making.", facts:[
    {label:"Focus",value:"Urban identity and collective making"},{label:"Method",value:"Sound mapping and layered thresholds"},{label:"Output",value:"Crochet studio intervention"}], boards:[
    {src:"/portfolio/page-06.jpg",alt:"Layered city collage with Chinese opera masks",caption:"Urban slice / mask study"},
    {src:"/portfolio/page-08.jpg",alt:"Wearable sound experiment and audio data",caption:"Sound mapping / social intensity"},
    {src:"/portfolio/page-16.jpg",alt:"Crochet studio with bamboo walls and suspended wave installation",caption:"Final intervention / collective display"}]},
  { id:"union", number:"03", title:"The Union", discipline:"Public space", year:"2023", statement:"Protection without separation.", description:"An irregular canopy expands the usable seating beneath an existing tree, manages water build-up and keeps the tree as the gathering point.", facts:[
    {label:"Focus",value:"Sheltered gathering around an existing tree"},{label:"Method",value:"Canopy and concentric seating study"},{label:"Output",value:"Public-space proposal"}], boards:[
    {src:"/portfolio/page-19.jpg",alt:"Technical presentation of a white canopy beneath a large tree",caption:"Canopy system / public seating"}]},
  { id:"watergrounds", number:"04", title:"Watergrounds", discipline:"Play design", year:"2023", statement:"A familiar form, reimagined.", description:"A water-tower silhouette becomes a climbable landmark on a hill. Mesh climbing surfaces, wet-play elements and an elevated outlook connect the playground to park and skyline.", facts:[
    {label:"Focus",value:"Play, landmark and context"},{label:"Method",value:"Typology study and technical drawing"},{label:"Output",value:"Climbing and wet-play proposal"}], boards:[
    {src:"/portfolio/page-20.jpg",alt:"Technical drawings of a water-tower playground",caption:"Top view, isometric and elevation"},
    {src:"/portfolio/page-21.jpg",alt:"Purple climbing structure in a landscaped park",caption:"Water tower playground / final view"}]},
  { id:"asda", number:"05", title:"Multi-Generational Bathroom", discipline:"Inclusive interior", year:"2022", statement:"Dignity across generations.", description:"Created for the American Standard Design Award Competition brief, this compact bathroom coordinates reach, circulation, assistance and privacy for children, adults, older users and future wheelchair use.", facts:[
    {label:"Focus",value:"Multigenerational dignity"},{label:"Method",value:"Reach, assistance and privacy planning"},{label:"Output",value:"Competition interior proposal"}], boards:[
    {src:"/portfolio/page-22.jpg",alt:"Accessible multi-generational bathroom with warm timber and concrete finishes",caption:"Interior proposal / accessible vanity"},
    {src:"/portfolio/page-23.jpg",alt:"Dimensioned bathroom plans and elevations",caption:"Plans and elevations"},
    {src:"/portfolio/page-24.jpg",alt:"Bathroom details and material mood board",caption:"Details, finishes and material study"}]},
  { id:"sca-lab", number:"06", title:"SCA-Lab", discipline:"Spatial + interaction design", year:"Academic study", statement:"Anywhere. Anytime. Always in control.", description:"A two-level remote-control vehicle lab at Junction 8's roof garden combines making, workshops and community areas with adaptable drone, land-vehicle and aquatic test zones, supported by a connected control app.", document:{href:"/projects/sca-lab/sca-lab-presentation.pdf",label:"View original presentation deck"}, facts:[
    {label:"Focus",value:"Remote-control communities"},{label:"Method",value:"Spatial programme and interaction flow"},{label:"Output",value:"Roof-garden lab and control app"}], boards:scaLabPages.map(({page,caption})=>({src:`/projects/sca-lab/page-${String(page).padStart(2,"0")}.webp`,alt:`SCA-Lab presentation page ${page}: ${caption}`,caption}))},
  { id:"eye-accessories", number:"07", title:"Eye( )accessories", discipline:"Industrial design", year:"2025", statement:"Perspective, shifted.", description:"A fully 3D-printed eyewear concept shifts support from the nose bridge to the head. The face-fitting frame explores swappable lens modules and a flip-up configuration.", document:{href:"/projects/eye-accessories/industrial-design-showcase.pdf",label:"View original showcase"}, facts:[
    {label:"Focus",value:"Modular face fit"},{label:"Method",value:"3D printing and component system"},{label:"Output",value:"Adjustable eyewear concept"}], boards:[
    {src:"/projects/eye-accessories/page-01.webp",alt:"Eye accessories head-mounted eyewear prototype and concept overview",caption:"Product concept / form exploration"},
    {src:"/projects/eye-accessories/page-02.webp",alt:"Eye accessories 3D-printed modular eyewear detail",caption:"Face fitting / swappable lens system"}]},
  { id:"somepen", number:"08", title:"SOMEPEN", discipline:"Industrial design", year:"2026", statement:"Four colours. One movement.", description:"A 4.5 cm finger-mounted pen for work that involves writing while moving. Four thumb-operated buttons select common D1 refills, while an elastomer ring holds the form on the finger between notes.", document:{href:"https://canva.link/anjyqxd33b0vm5l",label:"View original Canva presentation"}, facts:[
    {label:"Focus",value:"Mobile note-taking"},{label:"Method",value:"Wearable grip and common D1 refills"},{label:"Output",value:"Four-colour writing tool"}], boards:[
    {src:"/projects/somepen/page-01.webp",alt:"Transparent finger-mounted SOMEPEN with four coloured thumb controls",caption:"Product hero / four-colour mechanism"},
    {src:"/projects/somepen/page-02.webp",alt:"SOMEPEN use study and exploded view showing the grip, shell, buttons and refill system",caption:"Exploded system / grip and refill architecture"},
    {src:"/projects/somepen/page-03.webp",alt:"SOMEPEN shown in use by healthcare and delivery workers",caption:"Use cases / healthcare and delivery work"}]},
  { id:"nus-coop", number:"09", title:"NUS Co-op", discipline:"Service + spatial design", year:"2026", statement:"Refocusing on the community.", description:"In a three-person team, the NUS Co-op experience was mapped across website and store touchpoints. The proposal connects a clearer digital journey, delivery or pickup choices and a zoned community retail layout.", document:{href:"https://canva.link/r4joa1k4tm5g8qe",label:"View original Canva presentation"}, facts:[
    {label:"Format",value:"Three-person team project"},{label:"Scope",value:"Digital, service and spatial"},{label:"Output",value:"Omnichannel service and zoned store"}], boards:[
    {src:"/projects/nus-coop/page-2.webp",alt:"NUS Co-op project overview with a collaged view of the redesigned community store",caption:"Project overview / community focus"},
    {src:"/projects/nus-coop/page-5.webp",alt:"Student persona and research profile for the NUS Co-op service redesign",caption:"Research / student persona"},
    {src:"/projects/nus-coop/page-18.webp",alt:"Service-design synthesis identifying information clarity, focus and system efficiency as core issues",caption:"Synthesis / core service problem"},
    {src:"/projects/nus-coop/page-21.webp",alt:"Redesigned NUS Co-op website showing a unified online brand experience",caption:"Digital touchpoint / unified online experience"},
    {src:"/projects/nus-coop/page-23.webp",alt:"Connected online ordering and store collection journey for NUS Co-op",caption:"Omnichannel system / connected service"},
    {src:"/projects/nus-coop/page-27.webp",alt:"NUS Co-op zoning plan showing connected community, merchandise, collaboration and collection areas",caption:"Spatial zoning / connected community touchpoints"}]},
];

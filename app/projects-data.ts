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
  { id:"japandi", number:"01", title:"Japandi Retreat", discipline:"Hospitality", year:"2024", statement:"Home away from home.", description:"An open resort room organised as a quiet sequence of arrival, bathing and rest. Concrete, timber and filtered light protect privacy without closing the interior down.", boards:[
    {src:"/portfolio/page-04.jpg",alt:"Japandi resort room with two beds on a raised timber platform",caption:"Spatial atmosphere / material study"},
    {src:"/portfolio/page-05.jpg",alt:"Japandi floor plan and bathroom studies",caption:"Plan, arrival sequence and bathroom studies"}]},
  { id:"masks", number:"02", title:"Looking Through the Masks of the City", discipline:"Urban intervention", year:"2024", statement:"A city of façades.", description:"A crochet studio at Clarke Quay Central uses layered thresholds, woven bamboo and collective making to study the identities a city reveals throughout the day.", boards:[
    {src:"/portfolio/page-06.jpg",alt:"Layered city collage with Chinese opera masks",caption:"Urban slice / mask study"},
    {src:"/portfolio/page-08.jpg",alt:"Wearable sound experiment and audio data",caption:"Sound mapping / social intensity"},
    {src:"/portfolio/page-16.jpg",alt:"Crochet studio with bamboo walls and suspended wave installation",caption:"Final intervention / collective display"}]},
  { id:"union", number:"03", title:"The Union", discipline:"Public space", year:"2023", statement:"Protection without separation.", description:"An undulating canopy and concentric seating gather people beneath an existing tree, turning the shaded ground into a shared room without erasing its natural centre.", boards:[
    {src:"/portfolio/page-19.jpg",alt:"Technical presentation of a white canopy beneath a large tree",caption:"Canopy system / public seating"}]},
  { id:"watergrounds", number:"04", title:"Watergrounds", discipline:"Play", year:"2023", statement:"A familiar form, reimagined.", description:"The silhouette of a water tower becomes a climbable landmark. Mesh, structure and wet-play elements connect the playground to both park and skyline.", boards:[
    {src:"/portfolio/page-20.jpg",alt:"Technical drawings of a water-tower playground",caption:"Top view, isometric and elevation"},
    {src:"/portfolio/page-21.jpg",alt:"Purple climbing structure in a landscaped park",caption:"Water tower playground / final view"}]},
  { id:"asda", number:"05", title:"ASDA 2022", discipline:"Inclusive interior", year:"2022", statement:"Dignity across generations.", description:"A multi-generational bathroom coordinates reach, assistance, air and privacy. Support elements are integrated into the architecture instead of added as afterthoughts.", boards:[
    {src:"/portfolio/page-22.jpg",alt:"Accessible multi-generational bathroom with warm timber and concrete finishes",caption:"Interior proposal / accessible vanity"},
    {src:"/portfolio/page-23.jpg",alt:"Dimensioned bathroom plans and elevations",caption:"Plans and elevations"},
    {src:"/portfolio/page-24.jpg",alt:"Bathroom details and material mood board",caption:"Details, finishes and material study"}]},
  { id:"sca-lab", number:"06", title:"SCA-Lab", discipline:"Spatial + interaction design", year:"Academic study", statement:"Anywhere. Anytime. Always in control.", description:"A hybrid recreational and innovation space for remote-control vehicle enthusiasts and newcomers at Junction 8's roof garden. The proposal combines testing terrains, drone and boat zones, workshops, community viewing, retail support and a connected mobile control system.", document:{href:"/projects/sca-lab/sca-lab-presentation.pdf",label:"View original presentation deck"}, boards:scaLabPages.map(({page,caption})=>({src:`/projects/sca-lab/page-${String(page).padStart(2,"0")}.webp`,alt:`SCA-Lab presentation page ${page}: ${caption}`,caption}))},
  { id:"eye-accessories", number:"07", title:"Eye( )accessories", discipline:"Industrial design", year:"2025", statement:"Perspective, shifted.", description:"A fully 3D-printed eyewear concept worn from the head rather than resting on the nose bridge. The face-fitting system explores modularity through swappable lens frames, replaceable lenses and an adjustable flip-up configuration.", document:{href:"/projects/eye-accessories/industrial-design-showcase.pdf",label:"View original showcase"}, boards:[
    {src:"/projects/eye-accessories/page-01.webp",alt:"Eye accessories head-mounted eyewear prototype and concept overview",caption:"Product concept / form exploration"},
    {src:"/projects/eye-accessories/page-02.webp",alt:"Eye accessories 3D-printed modular eyewear detail",caption:"Face fitting / swappable lens system"}]},
  { id:"somepen", number:"08", title:"SOMEPEN", discipline:"Industrial design", year:"2026", statement:"Four colours. One movement.", description:"A compact wearable writing tool for people who work while moving. The finger-mounted form accepts common D1 refills, gives thumb access to four ink colours, and keeps the hand available for carrying, handling and rapid note-taking.", document:{href:"https://canva.link/anjyqxd33b0vm5l",label:"View original Canva presentation"}, boards:[
    {src:"/projects/somepen/page-01.webp",alt:"SOMEPEN finger-mounted pen with four-colour mechanism",caption:"Product hero / four-colour mechanism"},
    {src:"/projects/somepen/page-02.webp",alt:"Exploded view of SOMEPEN grip and D1 refill architecture",caption:"Exploded system / grip and refill architecture"},
    {src:"/projects/somepen/page-03.webp",alt:"SOMEPEN in use during healthcare and delivery work",caption:"Use cases / healthcare and delivery work"}]},
  { id:"nus-coop", number:"09", title:"NUS Co-op", discipline:"Service + spatial design", year:"2026", statement:"Refocusing on the community.", description:"A team service-design proposal that reframes the campus co-op around students and staff. Journey mapping reveals friction across the online store, shop layout and service touchpoints, then connects a clearer digital experience with a zoned, community-focused physical store.", document:{href:"https://canva.link/r4joa1k4tm5g8qe",label:"View original Canva presentation"}, boards:[
    {src:"/projects/nus-coop/page-2.webp",alt:"NUS Co-op project overview with community focus",caption:"Project overview / community focus"},
    {src:"/projects/nus-coop/page-5.webp",alt:"Student persona from NUS Co-op research",caption:"Research / student persona"},
    {src:"/projects/nus-coop/page-18.webp",alt:"Synthesis of the core NUS Co-op service problem",caption:"Synthesis / core service problem"},
    {src:"/projects/nus-coop/page-21.webp",alt:"Unified online experience for the NUS Co-op digital touchpoint",caption:"Digital touchpoint / unified online experience"},
    {src:"/projects/nus-coop/page-23.webp",alt:"Connected omnichannel service system for NUS Co-op",caption:"Omnichannel system / connected service"},
    {src:"/projects/nus-coop/page-28.webp",alt:"Final zoned community store proposal for NUS Co-op",caption:"Final spatial proposal / community store"}]},
  { id:"somepen", number:"08", title:"SOMEPEN", discipline:"Industrial design", year:"2026", statement:"Four colours. One movement.", description:"A compact wearable writing tool for people who work while moving. The finger-mounted form accepts common D1 refills, gives thumb access to four ink colours, and keeps the hand available for carrying, handling and rapid note-taking.", document:{href:"https://canva.link/anjyqxd33b0vm5l",label:"View original Canva presentation"}, facts:[
    {label:"Brief",value:"Mobile note-taking"},{label:"System",value:"Four D1 refills"},{label:"Users",value:"Healthcare, delivery, technical and teaching staff"}], boards:[
    {src:"/projects/somepen/page-01.webp",alt:"Transparent finger-mounted SOMEPEN with four coloured thumb controls",caption:"Product hero / four-colour mechanism"},
    {src:"/projects/somepen/page-02.webp",alt:"SOMEPEN use study and exploded view showing the grip, shell, buttons and refill system",caption:"Exploded system / grip and refill architecture"},
    {src:"/projects/somepen/page-03.webp",alt:"SOMEPEN shown in use by healthcare and delivery workers",caption:"Use cases / healthcare and delivery work"}]},
  { id:"nus-coop", number:"09", title:"NUS Co-op", discipline:"Service + spatial design", year:"2026", statement:"Refocusing on the community.", description:"A team service-design proposal that reframes the campus co-op around students and staff. Journey mapping reveals friction across the online store, shop layout and service touchpoints, then connects a clearer digital experience with a zoned, community-focused physical store.", document:{href:"https://canva.link/r4joa1k4tm5g8qe",label:"View original Canva presentation"}, facts:[
    {label:"Format",value:"Team project"},{label:"Scope",value:"Digital, service and spatial"},{label:"Focus",value:"Students, staff and campus community"}], boards:[
    {src:"/projects/nus-coop/page-2.webp",alt:"NUS Co-op project overview with a collaged view of the redesigned community store",caption:"Project overview / community focus"},
    {src:"/projects/nus-coop/page-5.webp",alt:"Student persona and research profile for the NUS Co-op service redesign",caption:"Research / student persona"},
    {src:"/projects/nus-coop/page-18.webp",alt:"Service-design synthesis identifying information clarity, focus and system efficiency as core issues",caption:"Synthesis / core service problem"},
    {src:"/projects/nus-coop/page-21.webp",alt:"Redesigned NUS Co-op website showing a unified online brand experience",caption:"Digital touchpoint / unified online experience"},
    {src:"/projects/nus-coop/page-23.webp",alt:"Connected online ordering and store collection journey for NUS Co-op",caption:"Omnichannel system / connected service"},
    {src:"/projects/nus-coop/page-28.webp",alt:"Final axonometric visual of the redesigned NUS Co-op community store",caption:"Final spatial proposal / community store"}]},
];

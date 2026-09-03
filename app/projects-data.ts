export type Project = {
  id: string;
  number: string;
  title: string;
  discipline: string;
  year: string;
  statement: string;
  description: string;
  document?: { href: string; label: string };
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
];

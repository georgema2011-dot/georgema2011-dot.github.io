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
  demo?: { href: string; label: string };
  boards: Array<{ src: string; alt: string; caption: string; note?: string }>;
};

const scaLabPages = [
  { page: 1, caption: "Cover" }, { page: 4, caption: "Design concept" },
  { page: 5, caption: "Spatial programme" }, { page: 7, caption: "Land and water testing terrain" },
  { page: 11, caption: "Viewing and control area" }, { page: 13, caption: "Innovation workshop" },
  { page: 15, caption: "Cloud control application" },
];

export const projects: Project[] = [
  { id:"hip-reduction-simulator", number:"11", title:"Hip Reduction Simulator", discipline:"Healthcare product + simulation", year:"2026", statement:"See one. Do one. Teach one.", description:"A physical training simulator for hip-reduction procedures, featuring adjustable resistance, tactile feedback at reduction and configurable scenarios.", document:{href:"/projects/hip-reduction-simulator/hip-reduction-simulator-presentation.pdf",label:"View original presentation"}, facts:[
    {label:"Focus",value:"Practical hip-reduction training"},{label:"Method",value:"Adjustable resistance, tactile feedback and configurable scenarios"},{label:"Output",value:"Physical training simulator"},{label:"Team",value:"Celia Myers, George Ma and Jared Sim"}], boards:[
    {src:"/projects/hip-reduction-simulator/page-07.webp",alt:"Hip Reduction Simulator physical lower-limb training prototype with resistance mechanism",caption:"Prototype overview / physical training simulator"},
    {src:"/projects/hip-reduction-simulator/page-08.webp",alt:"Hip Reduction Simulator adjustable resistance control with prototype details",caption:"Feature 01 / adjustable resistance"},
    {src:"/projects/hip-reduction-simulator/page-09.webp",alt:"Hip Reduction Simulator tactile feedback demonstration during reduction",caption:"Feature 02 / tactile feedback at reduction"},
    {src:"/projects/hip-reduction-simulator/page-11.webp",alt:"Hip Reduction Simulator individual and team practice demonstration",caption:"Feature 04 / individual and team practice"},
    {src:"/projects/hip-reduction-simulator/page-14.webp",alt:"Hip Reduction Simulator configured for hospital-bed scenario practice",caption:"Feature 07 / configurable scenarios"},
    {src:"/projects/hip-reduction-simulator/page-16.webp",alt:"Hip Reduction Simulator user-testing results as reported in the presentation",caption:"Reported user-testing result / confidence outcome"}]},
  { id:"visual-bridge", number:"10", title:"Visual Bridge: ACL Visualisation through the Visio Pro", discipline:"Spatial computing + interaction", year:"2026", statement:"Making knee anatomy easier to understand.", description:"A spatial-computing education prototype for newly diagnosed ACL patients. The project explores layered knee anatomy and a spatial app flow to explain the injury and what comes next. Patient-specific damage and leg-linked movement are proposed next steps.", document:{href:"/projects/visual-bridge/visual-bridge-presentation.pdf",label:"View original presentation"}, demo:{href:"https://youtu.be/hFE74-Hjoec",label:"Watch the project demo"}, facts:[
    {label:"Brief",value:"ACL patient education"},{label:"Platform",value:"Apple Vision Pro"},{label:"Status",value:"Academic prototype, Semester 1 AY 2026/2027"}], boards:[
    {src:"/projects/visual-bridge/page-07.webp",alt:"Visual Bridge app flow showing sequential spatial knee anatomy views",caption:"App flow / spatial anatomy exploration"},
    {src:"/projects/visual-bridge/page-03.webp",alt:"Visual Bridge brief asking how newly diagnosed ACL patients can understand their knee injury and next steps",caption:"Design brief / understanding the diagnosis"},
    {src:"/projects/visual-bridge/page-04.webp",alt:"Target audience for Visual Bridge ACL patient education",caption:"Audience / patients seeking diagnosis awareness"},
    {src:"/projects/visual-bridge/page-06.webp",alt:"Rationale for isolating overlapping anatomical layers in spatial computing",caption:"Spatial rationale / anatomy in layers"},
    {src:"/projects/visual-bridge/page-10.webp",alt:"Proposed future directions for patient-specific anatomy and leg-linked movement",caption:"Future concepts / patient-specific and movement-linked models"},
    {src:"/projects/visual-bridge/page-11.webp",alt:"Project reflections on device testing, information delivery and user interviews",caption:"Reflection / platform, delivery and user feedback"}]},
  { id:"japandi", number:"01", title:"Japandi Retreat", discipline:"Compact residential interior", year:"2024", statement:"A smaller home, with room for everyday life.", description:"A one-room apartment study exploring how a compact home can feel open and homely while supporting different activities. The L-shaped layout organises circulation, while partitions create privacy without fully enclosing each area. A raised tatami platform accommodates the fixed beds and an adjacent space for reading and studying, reducing the need for a separate desk.", facts:[
    {label:"Brief",value:"Multifunctional living in a compact home"},{label:"Approach",value:"Circulation, partial separation and a tatami platform"},{label:"Output",value:"Residential layout proposal"}], boards:[
    {src:"/portfolio/page-04.jpg",alt:"Compact residential bedroom with two fixed beds and an adjacent activity area on a raised tatami platform",caption:"Spatial atmosphere / material study"},
    {src:"/portfolio/page-05.jpg",alt:"L-shaped apartment plan with bathroom near the entrance and beds and adjacent activity area on the right",caption:"Plan, arrival sequence and bathroom studies",note:"The raised tatami platform accommodates the fixed beds and an adjacent area for reading and studying. The L-shaped layout and partitions create privacy between activities while aiming to keep the compact home open and connected."}]},
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
  { id:"somepen", number:"08", title:"SOMEPEN", discipline:"Conceptual industrial design", year:"2026", statement:"Four colours. One movement.", description:"A conceptual proposal for a 4.5 cm finger-mounted pen for work that involves writing while moving. It explores four thumb-operated controls for common D1 refills and an elastomer ring that keeps the tool close between notes.", document:{href:"https://canva.link/anjyqxd33b0vm5l",label:"View original Canva presentation"}, facts:[
    {label:"Concept",value:"Mobile note-taking"},{label:"Explores",value:"Wearable grip and common D1 refills"},{label:"Proposal",value:"Four-colour writing tool"}], boards:[
    {src:"/projects/somepen/page-01.webp",alt:"Transparent finger-mounted SOMEPEN with four coloured thumb controls",caption:"Product hero / four-colour mechanism"},
    {src:"/projects/somepen/page-02.webp",alt:"SOMEPEN use study and exploded view showing the grip, shell, buttons and refill system",caption:"Exploded system / grip and refill architecture"},
    {src:"/projects/somepen/page-03.webp",alt:"SOMEPEN shown in use by healthcare and delivery workers",caption:"Use cases / healthcare and delivery work"}]},
  { id:"nus-coop", number:"09", title:"NUS Co-op", discipline:"Service + spatial design", year:"2026", statement:"Turning retail touchpoints into a campus service.", description:"A three-person academic proposal to reconnect NUS Co-op with its community purpose. Student and frontline-staff journey mapping surfaced unclear stock information, cluttered navigation and operational overload. The proposal combines a simpler online experience, delivery or pickup choices, wider store circulation, expanded storage and flexible student-market fixtures.", document:{href:"https://canva.link/r4joa1k4tm5g8qe",label:"View full proposal"}, facts:[
    {label:"Format",value:"Three-person academic proposal"},{label:"Research",value:"Student and staff journey maps"},{label:"Scope",value:"Digital, service and spatial"},{label:"Status",value:"Unimplemented concept proposal"}], boards:[
    {src:"/projects/nus-coop/page-2.webp",alt:"NUS Co-op proposal cover showing the project focus on returning to community",caption:"Project proposition / returning to community"},
    {src:"/projects/nus-coop/page-5.webp",alt:"Stephanie, a representative student persona, with her needs, behaviours and pain points",caption:"Research / student journey"},
    {src:"/projects/nus-coop/page-18.webp",alt:"Service-design synthesis showing information clarity, focus and system efficiency as the core issues",caption:"Synthesis / service problem"},
    {src:"/projects/nus-coop/page-21.webp",alt:"Before-and-after NUS Co-op navigation showing a simplified online structure",caption:"Digital touchpoint / clearer navigation"},
    {src:"/projects/nus-coop/page-23.webp",alt:"Online order screen and in-store collection point illustrating the connected service proposal",caption:"Omnichannel system / delivery and pickup"},
    {src:"/projects/nus-coop/page-27.webp",alt:"Zoning plan for the NUS Co-op proposal showing student entrepreneurship, merchandise and pickup areas",caption:"Spatial proposal / zones and flow"},
    {src:"/projects/nus-coop/page-28.webp",alt:"Axonometric rendering of the proposed NUS Co-op community retail layout",caption:"Final proposal / community retail layout"}]},
];

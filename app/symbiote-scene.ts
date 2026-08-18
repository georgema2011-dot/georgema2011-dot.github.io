import * as THREE from "three";

type Droplet={mesh:THREE.Mesh;velocity:THREE.Vector3;age:number};

const vertexShader=`
 uniform float uTime;
 uniform float uWobble;
 varying vec3 vNormalW;
 varying vec3 vView;
 void main(){
  vec3 p=position;
  float wave=sin(p.y*5.0+uTime*2.3)*sin(p.x*4.0-uTime*1.7);
  float tendril=pow(max(0.0,sin(p.y*3.2+p.x*2.4+uTime)),6.0);
  p+=normal*(wave*.055+tendril*.09)*uWobble;
  vec4 world=modelMatrix*vec4(p,1.0);
  vNormalW=normalize(mat3(modelMatrix)*normal);
  vView=cameraPosition-world.xyz;
  gl_Position=projectionMatrix*viewMatrix*world;
 }`;

const fragmentShader=`
 uniform vec3 uInk;
 uniform float uTime;
 varying vec3 vNormalW;
 varying vec3 vView;
 void main(){
  vec3 n=normalize(vNormalW);
  vec3 v=normalize(vView);
  float fresnel=pow(1.0-max(dot(n,v),0.0),2.4);
  float sheen=.08+.5*fresnel+.08*sin(uTime*1.5+n.y*7.0);
  vec3 color=mix(uInk,vec3(.32,.35,.37),sheen);
  gl_FragColor=vec4(color,.97);
 }`;

function material(){
 return new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0},uWobble:{value:1},uInk:{value:new THREE.Color(0x090b0c)}},
  vertexShader,fragmentShader,transparent:true
 });
}

export function createSymbioteScene(canvas:HTMLCanvasElement,host:HTMLElement){
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(42,1,.1,30);
 camera.position.set(0,.7,8);
 camera.lookAt(0,-.35,0);

 scene.add(new THREE.HemisphereLight(0xf4f7f8,0x222426,2.2));
 const rim=new THREE.DirectionalLight(0xffffff,3.2);
 rim.position.set(-3,5,4);
 scene.add(rim);
 const side=new THREE.PointLight(0x899aa3,7,14);
 side.position.set(4,1,3);
 scene.add(side);

 const groundY=-2.15;
 const floor=new THREE.Mesh(
  new THREE.PlaneGeometry(18,8),
  new THREE.MeshBasicMaterial({color:0x292929,transparent:true,opacity:.035,side:THREE.DoubleSide})
 );
 floor.rotation.x=-Math.PI/2;
 floor.position.y=groundY-.06;
 floor.position.z=-.6;
 scene.add(floor);
 const shadow=new THREE.Mesh(
  new THREE.CircleGeometry(1,48),
  new THREE.MeshBasicMaterial({color:0x090909,transparent:true,opacity:.2,depthWrite:false})
 );
 shadow.rotation.x=-Math.PI/2;
 shadow.position.set(-2,groundY-.025,0);
 scene.add(shadow);
 const trailGeometry=new THREE.CircleGeometry(.34,28);
 const trailMaterial=new THREE.MeshBasicMaterial({color:0x090b0c,transparent:true,opacity:.12,depthWrite:false});
 const trail=Array.from({length:7},(_,index)=>{
  const mark=new THREE.Mesh(trailGeometry,trailMaterial);
  mark.rotation.x=-Math.PI/2;
  mark.position.set(-5.05+index*.48,groundY-.018,.04*Math.sin(index));
  mark.scale.set(1.3-index*.055,.28+index*.025,1);
  mark.visible=false;
  scene.add(mark);
  return mark;
 });

 const mainGeometry=new THREE.SphereGeometry(.68,56,40);
 const dropGeometry=new THREE.SphereGeometry(.18,20,14);
 const mainMaterial=material();
 const dropMaterial=material();
 dropMaterial.uniforms.uWobble.value=1.4;
 const organism=new THREE.Group();
 const core=new THREE.Mesh(mainGeometry,mainMaterial);
 organism.add(core);
 const lobes=[
  new THREE.Mesh(new THREE.SphereGeometry(.34,32,24),mainMaterial),
  new THREE.Mesh(new THREE.SphereGeometry(.25,28,20),mainMaterial),
  new THREE.Mesh(new THREE.SphereGeometry(.2,24,18),mainMaterial)
 ];
 lobes.forEach(lobe=>organism.add(lobe));
 organism.position.set(reduced?-2:-5.35,groundY+(reduced?.67:.24),0);
 organism.scale.setScalar(reduced?1:.35);
 scene.add(organism);

 const pointer=new THREE.Vector2(-.4,0);
 const target=new THREE.Vector3(-2,0,0);
 const velocity=new THREE.Vector3();
 const pull=new THREE.Vector3();
 const droplets:Droplet[]=[];
 let growth=1;
 let growthTarget=1;
 let squash=0;
 let grounded=true;
 let jumpClock=.7;
 let width=1;
 let height=1;
 let raf=0;
 let last=performance.now();
 let hidden=document.hidden;
 const introDuration=4.2;
 let introTime=reduced?introDuration:0;

 const setPointer=(event:PointerEvent)=>{
  const rect=host.getBoundingClientRect();
  pointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));
  const visibleHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
  target.x=THREE.MathUtils.clamp(pointer.x*visibleHeight*camera.aspect*.5,-4.6,4.6);
  target.z=THREE.MathUtils.clamp(-pointer.y*.7,-.8,.8);
 };

 const spawn=(event:PointerEvent)=>{
  if(event.button!==0||reduced||introTime<introDuration)return;
  setPointer(event);
  if(droplets.length>=18){
   const old=droplets.shift();
   if(old)scene.remove(old.mesh);
  }
  const mesh=new THREE.Mesh(dropGeometry,dropMaterial);
  mesh.position.set(target.x,THREE.MathUtils.clamp(pointer.y*2.4,-1.25,2.1),target.z+.15);
  const size=THREE.MathUtils.randFloat(.65,1.15);
  mesh.scale.setScalar(size);
  scene.add(mesh);
  droplets.push({mesh,velocity:new THREE.Vector3(THREE.MathUtils.randFloatSpread(.8),THREE.MathUtils.randFloat(1.6,3.2),THREE.MathUtils.randFloatSpread(.6)),age:0});
 };

 const resize=()=>{
  const rect=host.getBoundingClientRect();
  width=Math.max(1,Math.round(rect.width));
  height=Math.max(1,Math.round(rect.height));
  renderer.setSize(width,height,false);
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
 };

 const update=(time:number)=>{
  raf=requestAnimationFrame(update);
  if(hidden)return;
  const dt=Math.min(.033,(time-last)/1000||.016);
  last=time;
  const elapsed=time/1000;
  introTime=Math.min(introDuration,introTime+dt);
  mainMaterial.uniforms.uTime.value=elapsed;
  dropMaterial.uniforms.uTime.value=elapsed;

  const entering=introTime<introDuration;
  const introProgress=THREE.MathUtils.clamp(introTime/introDuration,0,1);
  const introEase=1-Math.pow(1-introProgress,3);
  const introScale=.35+.65*THREE.MathUtils.smoothstep(introProgress,.36,1);
  const crawl=Math.sin(introProgress*Math.PI*10);
  const contraction=Math.max(0,crawl);
  const dx=target.x-organism.position.x;
  if(entering){
   organism.position.x=THREE.MathUtils.lerp(-5.35,-2.05,introEase)+Math.sin(introProgress*Math.PI*6)*.07;
   organism.position.z=Math.sin(introProgress*Math.PI*4)*.08;
   organism.position.y=groundY+.67*introScale*(1-contraction*.18);
   velocity.set(0,0,0);
   trail.forEach((mark,index)=>mark.visible=introProgress>index/(trail.length+2));
   trailMaterial.opacity=.06+.1*(1-introProgress*.45);
  }else{
   velocity.x+=dx*5.8*dt;
   velocity.x*=Math.pow(.15,dt);
   velocity.z+=(target.z-organism.position.z)*3.2*dt;
   velocity.z*=Math.pow(.12,dt);
   jumpClock-=dt;
   if(grounded&&jumpClock<=0){
    velocity.y=2.7+Math.min(1.4,Math.abs(dx)*.22);
    grounded=false;
    jumpClock=THREE.MathUtils.randFloat(.72,1.2);
   }
   velocity.y-=7.8*dt;
   organism.position.addScaledVector(velocity,dt);
   trailMaterial.opacity=Math.max(0,trailMaterial.opacity-dt*.045);
  }
  const radius=.67*growth;
  const floorLevel=groundY+radius;
  if(!entering&&organism.position.y<=floorLevel){
   organism.position.y=floorLevel;
   if(velocity.y<-.6)squash=Math.min(.28,Math.abs(velocity.y)*.045);
   velocity.y=0;
   grounded=true;
  }
  squash+=(-squash)*Math.min(1,dt*9);
  growth+=((growthTarget-growth)*Math.min(1,dt*4));
  if(entering){
   organism.scale.set(introScale*(1+contraction*.42),introScale*(1-contraction*.25),introScale*(1+contraction*.12));
   organism.rotation.z=Math.sin(introProgress*Math.PI*8)*.055;
  }else{
   organism.scale.set(growth*(1+squash),growth*(1-squash*.72),growth*(1+squash*.35));
   organism.rotation.z=THREE.MathUtils.lerp(organism.rotation.z,-velocity.x*.045,Math.min(1,dt*5));
  }
  core.rotation.y=elapsed*.16;
  lobes[0].position.set(Math.sin(elapsed*1.7)*.42,-.28,Math.cos(elapsed*1.4)*.2);
  lobes[1].position.set(-.38,Math.sin(elapsed*2.1)*.2,.12);
  lobes[2].position.set(.34,.28+Math.cos(elapsed*1.8)*.12,-.12);
  lobes.forEach((lobe,index)=>lobe.scale.set(1+Math.sin(elapsed*2.2+index)*.12,1-Math.sin(elapsed*2.2+index)*.08,1));

  shadow.position.x=organism.position.x;
  shadow.position.z=organism.position.z;
  const activeScale=entering?introScale:growth;
  const activeFloor=groundY+.67*activeScale;
  const altitude=Math.max(0,organism.position.y-activeFloor);
  const shadowScale=activeScale*(1.05+altitude*.12);
  shadow.scale.set(shadowScale,shadowScale*.48,1);
  (shadow.material as THREE.MeshBasicMaterial).opacity=.2/(1+altitude*.65);

  for(let i=droplets.length-1;i>=0;i--){
   const drop=droplets[i];
   drop.age+=dt;
   if(drop.age<.38){
    drop.velocity.y-=7.2*dt;
   }else{
    pull.copy(organism.position).sub(drop.mesh.position);
    const distance=pull.length();
    drop.velocity.addScaledVector(pull.normalize(),(5.5+drop.age*2.8)*dt);
    drop.velocity.multiplyScalar(Math.pow(.22,dt));
    if(distance<radius*.88+.2){
     scene.remove(drop.mesh);
     droplets.splice(i,1);
     growthTarget=Math.min(1.68,growthTarget+.075);
     squash=-.12;
     continue;
    }
   }
   drop.mesh.position.addScaledVector(drop.velocity,dt);
   drop.mesh.rotation.x+=dt*2;
   drop.mesh.rotation.y+=dt*1.4;
  }
  renderer.render(scene,camera);
 };

 const visibility=()=>{hidden=document.hidden;last=performance.now()};
 const observer=new ResizeObserver(resize);
 observer.observe(host);
 host.addEventListener("pointermove",setPointer);
 host.addEventListener("pointerdown",spawn);
 document.addEventListener("visibilitychange",visibility);
 resize();
 if(reduced){renderer.render(scene,camera)}else{raf=requestAnimationFrame(update)}

 return()=>{
  cancelAnimationFrame(raf);
  observer.disconnect();
  host.removeEventListener("pointermove",setPointer);
  host.removeEventListener("pointerdown",spawn);
  document.removeEventListener("visibilitychange",visibility);
  scene.traverse(object=>{
   if(object instanceof THREE.Mesh){
    object.geometry.dispose();
    const mats=Array.isArray(object.material)?object.material:[object.material];
    mats.forEach(mat=>mat.dispose());
   }
  });
  renderer.dispose();
 };
}

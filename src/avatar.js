import * as THREE from 'three';

const palettes = {
  marc: { skin:0xd9a580, hair:0x39332e, shirt:0x35596a, iris:0x59614e },
  sophie: { skin:0xe8b393, hair:0x553326, shirt:0x9b665c, iris:0x557e78 },
  karim: { skin:0xc48e67, hair:0x28211e, shirt:0x294e5b, iris:0x64422b }
};
const mat = (color,roughness=.65) => new THREE.MeshStandardMaterial({color,roughness});
function ellipsoid(parent, material, xyz, scale) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1,40,32),material);
  mesh.position.set(...xyz); mesh.scale.set(...scale); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function line(parent,points,material,radius=.018) {
  const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,24,radius,8,false),material); parent.add(mesh); return mesh;
}
function box(parent,color,pos,scale) {
  const m=new THREE.Mesh(new THREE.BoxGeometry(...scale),mat(color));m.position.set(...pos);m.receiveShadow=true;m.castShadow=true;parent.add(m);return m;
}
export class AvatarStage {
  constructor(container, persona='karim') {
    this.container=container;this.state='idle';this.mood=50;this.gesture='neutral';this.motion=true;this.pointer={x:0,y:0};this.lastWord=0;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#ddd6c8');
    this.camera=new THREE.PerspectiveCamera(31,1,.1,40);this.camera.position.set(0,1.94,6.5);this.camera.lookAt(0,1.8,0);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
    container.appendChild(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','Client virtuel 3D animé');this.renderer.domElement.setAttribute('role','img');
    this.scene.add(new THREE.HemisphereLight(0xfff4e0,0x697879,2.25));
    const key=new THREE.DirectionalLight(0xffead3,3.3);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.001;this.scene.add(key);
    const fill=new THREE.DirectionalLight(0xe4f0ff,1.4);fill.position.set(4,2,3);this.scene.add(fill);
    const rim=new THREE.DirectionalLight(0xffe9bd,2);rim.position.set(2,4,-2);this.scene.add(rim);
    this.room=new THREE.Group();this.scene.add(this.room);
    box(this.room,0xd6cbbc,[0,2,-2.2],[14,7,.15]);
    box(this.room,0xece6d9,[-2.5,2.9,-2.05],[1.7,2.7,.09]);
    box(this.room,0xb3c9c4,[-2.5,2.9,-1.98],[1.55,2.55,.05]);
    box(this.room,0xf8f2e7,[-2.5,2.9,-1.92],[.065,2.55,.06]);
    box(this.room,0xf8f2e7,[-2.5,2.9,-1.92],[1.55,.065,.06]);
    box(this.room,0xa58368,[2,1,-1.6],[1.5,.1,.6]);
    box(this.room,0xe3d4b9,[1.8,1.2,-1.6],[.22,.35,.24]);box(this.room,0x41655d,[2.1,1.24,-1.6],[.18,.42,.24]);
    const plant=mat(0x638578); const pot=mat(0xd6b89e);
    ellipsoid(this.room,pot,[2.55,.56,-1.5],[.32,.5,.32]);
    for(let i=0;i<9;i++){const a=i*2.4;const leaf=ellipsoid(this.room,plant,[2.55+Math.cos(a)*.24,1.25+i*.085,-1.5+Math.sin(a)*.2],[.13,.39,.06]);leaf.rotation.z=Math.cos(a)*.65;}
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);
    this.pointerHandler=e=>{const r=container.getBoundingClientRect();this.pointer={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};
    container.addEventListener('pointermove',this.pointerHandler);
    this.setPersona(persona);this.resize();this.renderer.setAnimationLoop(t=>this.animate(t/1000));
  }
  resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.position.z=this.camera.aspect<.8?7.9:6.5;this.camera.updateProjectionMatrix();}
  setPersona(id){
    if(this.person){this.scene.remove(this.person);this.person.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material && !Array.isArray(o.material))o.material.dispose();});}
    this.id=id;this.mood=50; const p=palettes[id]; const female=id==='sophie';
    const skin=mat(p.skin,.57),hair=mat(p.hair,.8),shirt=mat(p.shirt,.83),white=mat(0xfffaf2,.35),iris=mat(p.iris,.38),pupil=mat(0x161919,.25),lip=mat(female?0xb66d67:0xb57b65,.58);
    this.person=new THREE.Group();this.scene.add(this.person);
    ellipsoid(this.person,mat(0x3b4947),[0,.83,-.36],[.94,1.0,.25]);
    this.torso=new THREE.Group();this.person.add(this.torso);
    ellipsoid(this.torso,shirt,[0,.64,0],[.81,.94,.39]);
    for(const s of [-1,1]) {const arm=ellipsoid(this.torso,shirt,[s*.74,.67,-.025],[.3,.68,.3]);arm.rotation.z=s*.13;}
    ellipsoid(this.torso,skin,[0,1.57,.015],[.23,.38,.23]);
    for(const s of [-1,1]){
      const collar=ellipsoid(this.torso,shirt,[s*.22,1.35,.3],[.24,.075,.18]);collar.rotation.z=s*.48;
      line(this.torso,[[s*.08,1.34,.35],[s*.2,1.1,.385],[s*.37,1.29,.3]],mat(id==='sophie'?0xbd8c7c:0x72909a),.012);
    }
    line(this.torso,[[0,1.08,.4],[0,.74,.398],[0,.35,.38]],mat(id==='sophie'?0x89574f:0x264451),.007);
    for(let i=0;i<3;i++)ellipsoid(this.torso,mat(0xd8d1b8),[0,1.0-i*.25,.407],[.021,.021,.011]);
    this.head=new THREE.Group();this.head.position.set(0,2.16,.06);this.person.add(this.head);
    const skull=ellipsoid(this.head,skin,[0,0,0],[female?.535:.57,.745,.485]);
    // Narrow jaw and broad forehead are sculpted into the base geometry.
    const pos=skull.geometry.attributes.position;
    for(let i=0;i<pos.count;i++){const y=pos.getY(i);if(y<-.15)pos.setX(i,pos.getX(i)*(1+(y+.15)*.18));}
    skull.geometry.computeVertexNormals();
    for(const s of [-1,1]){
      ellipsoid(this.head,skin,[s*.555,-.025,-.005],[.105,.2,.1]);
      ellipsoid(this.head,mat(female?0xcb8f78:0xbb8064),[s*.589,-.03,.075],[.041,.112,.016]);
      ellipsoid(this.head,skin,[s*.295,-.145,.351],[.215,.205,.108]);
    }
    this.eyes=[];this.brows=[];
    for(const s of [-1,1]){
      const eye=new THREE.Group();eye.position.set(s*.238,.11,.414);this.head.add(eye);
      ellipsoid(eye,mat(0xb98168),[0,0,-.008],[.175,.15,.065]);
      const blink=new THREE.Group();eye.add(blink);
      ellipsoid(blink,white,[0,0,.017],[.152,.112,.07]);
      const gaze=new THREE.Group();gaze.position.set(-s*.015,0,.069);blink.add(gaze);
      ellipsoid(gaze,iris,[0,0,0],[.070,.076,.018]);
      ellipsoid(gaze,pupil,[0,0,.016],[.034,.041,.008]);
      ellipsoid(gaze,mat(0xffffff,.1),[-.02,.03,.022],[.015,.015,.005]);
      line(blink,[[-.149,.009,.035],[-.08,.094,.06],[.04,.104,.065],[.145,.024,.033]],hair,female?.013:.008);
      const lid=ellipsoid(eye,skin,[0,0,.045],[.154,.114,.063]);lid.visible=false;
      this.eyes.push({blink,gaze,lid});
      const brow=new THREE.Group();brow.position.set(s*.235,.31,.41);this.head.add(brow);
      line(brow,[[-.135,-s*.012,-.035],[-.06,.026,0],[.04,.032,0],[.135,-s*.018,-.031]],hair,female?.023:.03);this.brows.push(brow);
    }
    ellipsoid(this.head,skin,[0,.013,.45],[.081,.19,.102]);
    ellipsoid(this.head,skin,[0,-.105,.545],[.113,.081,.106]);
    for(const s of [-1,1]){ellipsoid(this.head,skin,[s*.09,-.128,.495],[.052,.046,.064]);ellipsoid(this.head,mat(0x99624d),[s*.065,-.155,.535],[.025,.012,.021]);}
    if(id==='karim'){
      // A close, stylized beard follows the lower facial volume.
      const beard=ellipsoid(this.head,hair,[0,-.39,.266],[.39,.253,.145]);
      ellipsoid(this.head,skin,[0,-.255,.385],[.278,.122,.083]);
      for(const s of [-1,1]){const side=ellipsoid(this.head,hair,[s*.419,-.233,.248],[.047,.176,.045]);side.rotation.z=-s*.35;}
    }
    this.mouth=new THREE.Group();this.mouth.position.set(0,-.316,.455);this.head.add(this.mouth);
    this.cavity=ellipsoid(this.mouth,mat(0x522d2b),[0,0,0],[.172,.014,.018]);
    this.teeth=ellipsoid(this.mouth,white,[0,.004,.014],[.137,.026,.012]);this.teeth.visible=false;
    this.upperLip=line(this.mouth,[[-.17,0,0],[-.075,.008,.016],[0,.002,.021],[.075,.008,.016],[.17,0,0]],lip,.014);
    this.lowerLip=line(this.mouth,[[-.166,0,0],[-.08,-.022,.013],[0,-.026,.018],[.08,-.022,.013],[.166,0,0]],lip,.018);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(1,48,32,0,Math.PI*2,0,Math.PI*.31),hair);cap.scale.set(.581,.8,.505);cap.position.set(0,.015,-.018);this.head.add(cap);
    if(female){
      ellipsoid(this.head,hair,[0,.03,-.32],[.56,.71,.29]);
      ellipsoid(this.head,hair,[.1,-.39,-.49],[.29,.41,.2]);
      for(let i=0;i<6;i++){const lock=ellipsoid(this.head,hair,[-.38+i*.085,.48+i*.024,.297],[.118,.29,.08]);lock.rotation.z=-.9;}
      for(const s of [-1,1]){const side=ellipsoid(this.head,hair,[s*.5,.14,.04],[.074,.39,.15]);side.rotation.z=s*.08;ellipsoid(this.head,mat(0xc2a46e,.25),[s*.589,-.18,.084],[.022,.03,.018]);}
    }else{
      for(let i=0;i<8;i++){const lock=ellipsoid(this.head,hair,[-.42+i*.111,.61+Math.sin(i/8*Math.PI)*.1,.15],[.095,.245,.285]);lock.rotation.z=-.48;}
      for(const s of [-1,1])ellipsoid(this.head,hair,[s*.509,.25,-.043],[.06,.23,.26]);
      if(id==='marc'){const grey=mat(0x9a9387);for(const s of [-1,1])for(let i=0;i<5;i++)line(this.head,[[s*(.495+i*.004),.21+i*.015,.13],[s*.53,.32+i*.012,.07]],grey,.007);}
    }
    this.setState('idle');
  }
  setState(state){this.state=state;}
  setMood(mood,gesture='neutral'){this.mood=mood;this.gesture=gesture;this.gestureUntil=performance.now()/1000+2;}
  word(){this.lastWord=performance.now()/1000;}
  animate(t){
    if(document.hidden)return;
    const moving=this.motion;const speaking=this.state==='speaking';const thinking=this.state==='thinking';
    this.torso.position.y=moving?Math.sin(t*1.65)*.008:0;
    this.head.position.y=2.16+(moving?Math.sin(t*1.65)*.008:0);
    const nod=this.gesture==='nod'&&t<this.gestureUntil?Math.sin(t*7)*.045:0;
    const rx=moving?(Math.sin(t*.67)*.017+this.pointer.y*.045+nod):0;
    const ry=moving?(Math.sin(t*.43)*.035+this.pointer.x*.09):0;
    this.head.rotation.x=THREE.MathUtils.lerp(this.head.rotation.x,rx,.08);this.head.rotation.y=THREE.MathUtils.lerp(this.head.rotation.y,ry,.06);
    this.head.rotation.z=moving?(thinking?.055:Math.sin(t*.7)*.012):0;
    const cycle=t%4.7;const blink=moving&&cycle>.04&&cycle<.2?Math.max(.03,Math.abs(cycle-.12)/.08):1;
    this.eyes.forEach(({blink:b,gaze,lid})=>{b.scale.y=blink;lid.visible=blink<.15;gaze.position.x=THREE.MathUtils.lerp(gaze.position.x,moving?this.pointer.x*.025:0,.05);});
    this.brows.forEach((b,i)=>{const s=i===0?-1:1;const tense=this.mood<35;b.rotation.z=tense?s*.18:thinking?-s*.08:0;b.position.y=.31+(speaking?Math.sin(t*3)*.008:0);});
    // Approximate speech rhythm: browser speech synthesis provides no phonemes.
    const open=speaking ? .02+(Math.sin(t*17)*.5+.5)*.04+(Math.sin(t*27)*.5+.5)*.02 : 0;
    this.cavity.scale.y=.012+open;this.teeth.visible=speaking||this.mood>65;
    this.teeth.position.y=open*.38;this.lowerLip.position.y=-open;
    this.mouth.scale.x=this.mood>65?1.12:1;this.upperLip.position.y=this.mood>65?.008:0;
    this.renderer.render(this.scene,this.camera);
  }
  dispose(){this.renderer.setAnimationLoop(null);this.resizeObserver.disconnect();this.container.removeEventListener('pointermove',this.pointerHandler);this.scene.traverse(o=>{o.geometry?.dispose();if(o.material?.dispose)o.material.dispose();});this.renderer.dispose();this.renderer.domElement.remove();}
}

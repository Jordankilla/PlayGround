import * as THREE from 'three';

const canvas=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#a9d8c8');
scene.fog=new THREE.FogExp2('#a9d8c8',.027);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,120);
camera.position.set(0,10.5,13.8);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight,false);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
scene.add(new THREE.HemisphereLight('#e7ffef','#598678',2.1));
const sun=new THREE.DirectionalLight('#fff4d5',3.3);sun.position.set(-7,13,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.bias=-.0002;scene.add(sun);
const fill=new THREE.DirectionalLight('#80d8cc',1.25);fill.position.set(8,5,-10);scene.add(fill);
const mat=(color,extra={})=>new THREE.MeshToonMaterial({color,...extra});
const groundMat=mat('#77aa7d');
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90,90,90),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.12;ground.receiveShadow=true;scene.add(ground);
// Gentle meadow rings and winding path create a readable play space.
const path=new THREE.Mesh(new THREE.RingGeometry(3.1,5.25,80),mat('#a8bd87',{side:THREE.DoubleSide}));path.rotation.x=-Math.PI/2;path.position.y=-.105;scene.add(path);
const clearing=new THREE.Mesh(new THREE.CircleGeometry(3.15,64),mat('#8cba86',{side:THREE.DoubleSide}));clearing.rotation.x=-Math.PI/2;clearing.position.y=-.1;scene.add(clearing);
// Small pastel flecks scattered over the meadow.
const flowerMat=[mat('#fff0b0'),mat('#e6b5d3'),mat('#d7eff2')];
for(let i=0;i<190;i++){const a=Math.random()*Math.PI*2,r=4.8+Math.random()*18,x=Math.cos(a)*r,z=Math.sin(a)*r;const f=new THREE.Mesh(new THREE.SphereGeometry(.055+Math.random()*.045,7,6),flowerMat[i%3]);f.position.set(x,-.035,z);f.scale.y=.35;scene.add(f)}
const trunkMat=mat('#765748'),leafMats=[mat('#286c5d'),mat('#367f68'),mat('#4b9271'),mat('#588f68')];
function makeTree(x,z,scale=1){const group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(scale);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.21,1.4,7),trunkMat);trunk.position.y=.6;trunk.castShadow=true;group.add(trunk);for(let n=0;n<3;n++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.72-n*.085,1),leafMats[(Math.random()*leafMats.length)|0]);crown.position.set((Math.random()-.5)*.24,1.28+n*.49,(Math.random()-.5)*.2);crown.scale.set(1,1.15,.88);crown.castShadow=true;group.add(crown)}scene.add(group);return group}
// Deliberate open center, dense painterly tree edge.
for(let i=0;i<66;i++){const a=i/66*Math.PI*2+(Math.random()-.5)*.11,r=11+Math.random()*8;makeTree(Math.cos(a)*r,Math.sin(a)*r,.78+Math.random()*.65)}
for(let i=0;i<21;i++){let x=(Math.random()-.5)*37,z=(Math.random()-.5)*37;if(Math.hypot(x,z)<9)continue;makeTree(x,z,.62+Math.random()*.5)}
// Oversized clover rocks anchor the clearing edges.
for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=6+Math.random()*1.7;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.38+Math.random()*.35,0),mat(i%2?'#9cba94':'#839f86'));rock.position.set(Math.cos(a)*r,.15,Math.sin(a)*r);rock.scale.y=.65;rock.rotation.set(Math.random(),Math.random(),Math.random());rock.castShadow=true;scene.add(rock)}
// A few softly glowing drifting motes.
const moteMat=new THREE.MeshBasicMaterial({color:'#e4ffb4'});const motes=[];for(let i=0;i<28;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.035,8,7),moteMat);m.position.set((Math.random()-.5)*24,.5+Math.random()*3,(Math.random()-.5)*24);scene.add(m);motes.push({mesh:m,phase:Math.random()*8})}

const player=new THREE.Group();scene.add(player);player.position.set(0,0,0);
const slime=new THREE.Group();player.add(slime);
const bodyMat=new THREE.MeshToonMaterial({color:'#54d7d1',gradientMap:null});
const body=new THREE.Mesh(new THREE.SphereGeometry(.72,32,24),bodyMat);body.scale.set(1.05,.82,.92);body.position.y=.62;body.castShadow=true;body.receiveShadow=true;slime.add(body);
const underside=new THREE.Mesh(new THREE.SphereGeometry(.7,24,16),mat('#3bb8bd'));underside.scale.set(1.02,.37,.9);underside.position.set(0,.27,0);slime.add(underside);
const eyeMat=new THREE.MeshToonMaterial({color:'#183943'}),shineMat=new THREE.MeshBasicMaterial({color:'#f4ffff'});
function addEye(x){const eye=new THREE.Mesh(new THREE.SphereGeometry(.085,16,12),eyeMat);eye.position.set(x,.71,.64);eye.scale.set(.79,1.15,.55);slime.add(eye);const shine=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),shineMat);shine.position.set(x-.018,.743,.682);slime.add(shine)}addEye(-.23);addEye(.23);
const smile=new THREE.Mesh(new THREE.TorusGeometry(.105,.018,8,18,Math.PI),eyeMat);smile.position.set(0,.49,.665);smile.rotation.z=Math.PI;slime.add(smile);
const blushMat=new THREE.MeshBasicMaterial({color:'#ff9caa',transparent:true,opacity:.75});for(const x of [-.39,.39]){const cheek=new THREE.Mesh(new THREE.SphereGeometry(.075,12,8),blushMat);cheek.position.set(x,.52,.57);cheek.scale.set(1,.55,.3);slime.add(cheek)}
const shadow=new THREE.Mesh(new THREE.CircleGeometry(.74,32),new THREE.MeshBasicMaterial({color:'#285c50',transparent:true,opacity:.22,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.01;player.add(shadow);
// Star wisp collectible, with orbiting pinpricks and a warm halo.
const wisps=[];const wispPoints=[[-7,-6],[5,-9],[9,-1],[-9,2],[5,7],[-2,10],[11,8]];
function makeWisp(x,z,i){const g=new THREE.Group();g.position.set(x,.95,z);const core=new THREE.Mesh(new THREE.OctahedronGeometry(.32,1),new THREE.MeshBasicMaterial({color:'#fff3ae'}));core.material.transparent=true;core.material.opacity=.95;g.add(core);const halo=new THREE.Mesh(new THREE.SphereGeometry(.46,16,12),new THREE.MeshBasicMaterial({color:'#ffe987',transparent:true,opacity:.12,depthWrite:false}));g.add(halo);for(let j=0;j<3;j++){const bead=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),new THREE.MeshBasicMaterial({color:'#fffde8'}));const ang=j*Math.PI*2/3;bead.position.set(Math.cos(ang)*.49,Math.sin(ang)*.33,0);g.add(bead)}scene.add(g);wisps.push({group:g,baseY:.95,phase:i*1.7,collected:false})}
wispPoints.forEach(([x,z],i)=>makeWisp(x,z,i));
const enemies=[];
function makeMushroom(x,z,i){const g=new THREE.Group();g.position.set(x,0,z);const stalk=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.36,4,10),mat('#e6d3ad'));stalk.position.y=.3;stalk.castShadow=true;g.add(stalk);const cap=new THREE.Mesh(new THREE.SphereGeometry(.43,20,12),mat(i%2?'#ee8e79':'#d987a7'));cap.scale.y=.48;cap.position.y=.65;cap.castShadow=true;g.add(cap);for(const dx of [-.15,.15]){const e=new THREE.Mesh(new THREE.SphereGeometry(.043,8,8),eyeMat);e.position.set(dx,.35,.19);g.add(e)}scene.add(g);enemies.push({group:g,phase:i*2.4,speed:.58+Math.random()*.16,stun:0})}
makeMushroom(-8,-2,0);makeMushroom(8,5,1);makeMushroom(-3,12,2);
const keys={};let playing=false,won=false,pulseCooldown=0,toastTimer=0,elapsed=0,joy={x:0,y:0};
const toast=document.querySelector('#toast');const countEl=document.querySelector('#wisp-count');
function showToast(text){toast.textContent=text;toast.classList.add('show');toastTimer=2.3}
const audio={ctx:null,enabled:true};function chime(){if(!audio.enabled)return;try{audio.ctx??=new AudioContext();if(audio.ctx.state==='suspended')audio.ctx.resume();const t=audio.ctx.currentTime;[660,880,1100].forEach((hz,i)=>{const o=audio.ctx.createOscillator(),gain=audio.ctx.createGain();o.type='sine';o.frequency.value=hz;gain.gain.setValueAtTime(.0001,t+i*.075);gain.gain.exponentialRampToValueAtTime(.055,t+i*.075+.02);gain.gain.exponentialRampToValueAtTime(.0001,t+i*.075+.38);o.connect(gain);gain.connect(audio.ctx.destination);o.start(t+i*.075);o.stop(t+i*.075+.4)})}catch(e){}}
function pulse(){if(!playing||pulseCooldown>0)return;pulseCooldown=2.5;document.querySelector('#pulse-ready').textContent='...';document.querySelector('#pulse-button').classList.add('cooldown');const wave=new THREE.Mesh(new THREE.RingGeometry(.3,.48,40),new THREE.MeshBasicMaterial({color:'#baffea',transparent:true,opacity:.9,side:THREE.DoubleSide}));wave.rotation.x=-Math.PI/2;wave.position.set(player.position.x,.12,player.position.z);scene.add(wave);let age=0;const hit=enemies.filter(e=>e.group.position.distanceTo(player.position)<4.2);hit.forEach(e=>{e.stun=2.2;showToast('The pufflings are feeling dizzy!')});
 const grow=()=>{age+=.07;wave.scale.setScalar(1+age*3.1);wave.material.opacity=Math.max(0,.9-age*.43);if(age<1.6)requestAnimationFrame(grow);else{scene.remove(wave);wave.geometry.dispose();wave.material.dispose()}};grow()}
document.querySelector('#pulse-button').addEventListener('click',pulse);document.querySelector('#mobile-pulse').addEventListener('click',pulse);
document.querySelector('#sound-toggle').addEventListener('click',e=>{audio.enabled=!audio.enabled;e.currentTarget.querySelector('span').textContent=audio.enabled?'SOUND ON':'SOUND OFF';if(audio.enabled)chime()});
function resetGame(){document.querySelector('#game-shell').classList.remove('is-intro');playing=true;won=false;player.position.set(0,0,0);wisps.forEach(w=>{w.collected=false;w.group.visible=true});enemies.forEach(e=>{e.stun=0});countEl.textContent='0';document.querySelector('#progress-fill').style.width='0%';document.querySelector('#end-screen').classList.add('hidden');document.querySelector('#intro-screen').classList.add('hidden');showToast('Find the seven star wisps!')}
document.querySelector('#start-button').addEventListener('click',()=>{resetGame();if(audio.ctx?.state==='suspended')audio.ctx.resume()});document.querySelector('#again-button').addEventListener('click',resetGame);
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Space'||e.code==='KeyE')pulse()});addEventListener('keyup',e=>keys[e.code]=false);addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
const joyEl=document.querySelector('#joystick'),knob=document.querySelector('.joy-knob');let joyPointer=null;
joyEl.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joyEl.setPointerCapture(e.pointerId);moveJoy(e)});joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)moveJoy(e)});function moveJoy(e){const r=joyEl.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),max=31,f=Math.min(1,max/(len||1));joy.x=dx*f/max;joy.y=dy*f/max;knob.style.transform=`translate(${joy.x*max}px,${joy.y*max}px)`}function endJoy(e){if(e.pointerId===joyPointer){joyPointer=null;joy.x=joy.y=0;knob.style.transform=''}}joyEl.addEventListener('pointerup',endJoy);joyEl.addEventListener('pointercancel',endJoy);

const clock=new THREE.Clock();
function update(dt){elapsed+=dt;if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.classList.remove('show')}
 pulseCooldown=Math.max(0,pulseCooldown-dt);if(pulseCooldown===0){document.querySelector('#pulse-ready').textContent='READY';document.querySelector('#pulse-button').classList.remove('cooldown')}
 const ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x;
 const iz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joy.y;
 const len=Math.hypot(ix,iz),speed=(keys.ShiftLeft||keys.ShiftRight?7.4:5.15);
 if(playing&&len>.07){const nx=ix/Math.max(1,len),nz=iz/Math.max(1,len);player.position.x+=nx*speed*dt;player.position.z+=nz*speed*dt;player.position.x=THREE.MathUtils.clamp(player.position.x,-16,16);player.position.z=THREE.MathUtils.clamp(player.position.z,-16,16);slime.rotation.y=Math.atan2(nx,nz);}
 const moving=playing&&len>.07;const bounce=moving?Math.abs(Math.sin(elapsed*12))*.18:Math.sin(elapsed*2.7)*.035;
 slime.position.y=bounce;slime.scale.y=1-(moving?Math.abs(Math.sin(elapsed*12))*.12:0);body.scale.x=1.05+(moving?Math.sin(elapsed*12)*.035:0);
 camera.position.lerp(new THREE.Vector3(player.position.x,10.5,player.position.z+13.8),1-Math.pow(.001,dt));camera.lookAt(player.position.x,.1,player.position.z);
 wisps.forEach(w=>{if(w.collected)return;w.group.position.y=w.baseY+Math.sin(elapsed*2.3+w.phase)*.16;w.group.rotation.y=elapsed*.72+w.phase;w.group.children[0].rotation.y=elapsed*1.6;if(playing&&w.group.position.distanceTo(new THREE.Vector3(player.position.x,.75,player.position.z))<1.12){w.collected=true;w.group.visible=false;const n=wisps.filter(v=>v.collected).length;countEl.textContent=n;document.querySelector('#progress-fill').style.width=`${n/7*100}%`;chime();showToast(n===7?'Every wisp found — the forest knows your name!':'A star wisp joins your story!');if(n===7){won=true;setTimeout(()=>{if(won)document.querySelector('#end-screen').classList.remove('hidden')},1200)}}});
 enemies.forEach(e=>{const p=e.group.position;if(!playing){e.group.position.y=Math.sin(elapsed*2+e.phase)*.035;return}if(e.stun>0){e.stun-=dt;e.group.rotation.z=Math.sin(elapsed*12)*.23;return}e.group.rotation.z=0;const dx=player.position.x-p.x,dz=player.position.z-p.z,d=Math.hypot(dx,dz);if(d>1.05){p.x+=dx/(d||1)*e.speed*dt;p.z+=dz/(d||1)*e.speed*dt;e.group.rotation.y=Math.atan2(dx,dz)}else if(d>0){player.position.x+=dx/(d||1)*2.1*dt;player.position.z+=dz/(d||1)*2.1*dt;if(Math.random()<.018)showToast('A puffling gave you a playful bump!')}});
 motes.forEach(m=>{m.mesh.position.y=.6+Math.sin(elapsed*1.3+m.phase)*.35;m.mesh.position.x+=Math.sin(elapsed*.35+m.phase)*.0009});
}
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04);update(dt);renderer.render(scene,camera)}
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?48:42;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight,false)}
addEventListener('resize',resize);resize();frame();
requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('#loading').classList.add('done')));

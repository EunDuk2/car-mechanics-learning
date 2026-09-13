import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const $=s=>document.querySelector(s);
const data=[
['body','차체 패널','Body panels','차체·실내','#92a9b8','◈','탑승 공간과 주요 장치를 감싸는 외장입니다. 보닛, 루프, 도어, 트렁크와 앞뒤 범퍼로 구성됩니다.','차량 외곽','외장 패널 · 도어 · 보닛 · 트렁크',[0,1.35,0]],
['glass','유리·램프','Glazing & lighting','차체·실내','#92a9b8','◇','앞뒤 유리와 측면 유리는 시야를 확보하고, 헤드램프와 후미등은 주행 시 조명과 신호 역할을 합니다.','차체 상부 / 앞뒤','윈드실드 · 사이드 윈도 · LED 램프',[0,2.25,0]],
['chassis','차체 골격','Body structure','섀시·제동','#69b8bd','▱','차량의 기본 구조를 지지합니다. 바닥 패널과 크로스멤버가 동력계, 서스펜션, 실내 부품을 연결합니다.','차량 하부','바닥 패널 · 사이드멤버 · 크로스멤버',[0,-.15,0]],
['engine','가솔린 엔진','Inline-four gasoline engine','동력·구동','#ea9f53','▥','공기와 휘발유의 혼합기를 점화해 동력을 만듭니다. 직렬 4기통 엔진을 가로로 배치한 개념 모델입니다.','앞쪽 엔진룸','실린더 블록 · 헤드 · 흡기 · 점화 플러그',[1.35,.75,.1]],
['transmission','변속기·구동축','Transmission & drive shafts','동력·구동','#ea9f53','⚙','엔진의 회전을 주행 속도에 맞게 바꾸고, 차동기어와 좌우 구동축을 통해 앞바퀴로 전달합니다.','엔진 옆 / 앞바퀴 사이','변속기 · 디퍼렌셜 · 드라이브 샤프트',[.8,.15,-1.1]],
['cooling','냉각 시스템','Cooling system','동력·구동','#ea9f53','▤','냉각수가 엔진에서 받은 열을 라디에이터로 옮기고, 주행풍과 팬이 열을 외부로 내보냅니다.','엔진룸 앞쪽','라디에이터 · 냉각 팬 · 냉각 호스',[1.65,.25,0]],
['suspension','서스펜션·조향','Suspension & steering','섀시·제동','#69b8bd','⌁','스프링과 댐퍼가 노면 충격을 줄이고 바퀴의 접지를 돕습니다. 전륜 스트럿과 후륜 빔을 단순화했습니다.','각 바퀴 안쪽','스프링 · 댐퍼 · 암 · 조향 랙',[0,.15,1.3]],
['wheels','휠·타이어','Wheels & tires','섀시·제동','#69b8bd','◉','타이어가 노면과 맞닿아 가속·제동·조향 힘을 전달합니다. 휠은 타이어를 지지하고 허브에 연결됩니다.','차량 네 모서리','타이어 · 알로이 휠 · 휠 허브',[0,0,0]],
['brakes','브레이크','Disc brake system','섀시·제동','#69b8bd','⊙','캘리퍼가 패드를 디스크에 눌러 회전 에너지를 열로 바꾸고 속도를 줄입니다. 네 바퀴 디스크 형식의 개념 표현입니다.','각 휠 안쪽','브레이크 디스크 · 캘리퍼 · 패드',[0,0,0]],
['interior','시트·실내','Cabin & seating','차체·실내','#92a9b8','▧','운전자와 탑승자를 위한 공간입니다. 시트, 대시보드, 스티어링 휠과 센터 콘솔을 표현했습니다.','차체 중앙 탑승 공간','앞좌석 · 뒷좌석 · 대시보드 · 스티어링 휠',[-.5,1.25,-1.8]],
['fuel','연료 탱크','Fuel storage','연료·전기','#aa96d4','▰','휘발유를 저장하고 연료 펌프를 통해 엔진으로 공급합니다. 후방 바닥 아래의 탱크를 단순화했습니다.','뒷좌석 아래','연료 탱크 · 펌프 · 연료 라인',[-.8,-.1,-1.3]],
['exhaust','배기 시스템','Exhaust system','동력·구동','#ea9f53','≈','연소 가스를 엔진에서 뒤쪽으로 배출합니다. 촉매는 유해 배출 성분을 줄이고 소음기는 배기음을 완화합니다.','엔진부터 차체 하부·후방','배기 매니폴드 · 촉매 · 파이프 · 소음기',[-.4,-.12,1.25]],
['battery','12V 배터리','12-volt battery','연료·전기','#aa96d4','▣','엔진 시동을 위한 전력을 공급하고 조명과 차량 전장 장치를 지원하는 저전압 배터리입니다.','앞쪽 엔진룸','배터리 본체 · 양극 / 음극 단자',[1.0,1.1,1.25]]
].map(([id,name,en,category,color,icon,desc,location,includes,offset])=>({id,name,en,category,color,icon,desc,location,includes,offset}));
const scene=new THREE.Scene();const host=$('#canvas');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});}catch(e){$('#loading').textContent='WebGL을 사용할 수 없습니다. Chrome에서 하드웨어 가속을 켠 뒤 다시 열어주세요.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;host.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(6.8,4.6,7.6);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.7,0);controls.enableDamping=true;controls.minDistance=2.3;controls.maxDistance=19;controls.maxPolarAngle=Math.PI*.87;controls.autoRotateSpeed=.6;
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xe7f5ff,0x9caeb7,2));const key=new THREE.DirectionalLight(0xfff7e9,3.2);key.position.set(3,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.normalBias=.035;scene.add(key);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=-.07;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(16,32,0xcbd9df,0xe0e8eb);grid.position.y=-.065;grid.material.transparent=true;grid.material.opacity=.38;scene.add(grid);
const car=new THREE.Group();scene.add(car);const groups={};const moving=[];const pickables=[];let selected='body',explosion=0,targetExplosion=0,transparent=false,solo=null;
for(const d of data){const g=new THREE.Group();g.userData.id=d.id;car.add(g);groups[d.id]=g;moving.push({object:g,base:g.position.clone(),offset:new THREE.Vector3(...d.offset)});}
const mat=(color,metalness=.3,roughness=.35,opacity=1)=>new THREE.MeshStandardMaterial({color,metalness,roughness,transparent:opacity<1,opacity,side:THREE.DoubleSide});
const paint=mat('#7894a8',.75,.25),dark=mat('#263b48',.4,.4),glass=mat('#304b5b',.65,.13,.73),metal=mat('#a3b4bc',.8,.3),rubber=mat('#242b30',.02,.88),orange=mat('#dc9b59',.6,.35),teal=mat('#56a8ad',.55,.35),purple=mat('#9c8bbc',.35,.4),seat=mat('#4a535b',.1,.8),red=mat('#da555b',.45,.3);
const lightMat=mat('#e9fbff',.4,.1);lightMat.emissive.set('#b8edff');lightMat.emissiveIntensity=.7;const tailMat=mat('#a92a3d',.3,.2);tailMat.emissive.set('#ea243c');tailMat.emissiveIntensity=.8;
function mesh(group,geo,m,pos=[0,0,0],rotation){const o=new THREE.Mesh(geo,m.clone());o.position.set(...pos);if(rotation)o.rotation.set(...rotation);o.castShadow=true;o.receiveShadow=true;group.add(o);let parent=group;while(parent&&!parent.userData.id)parent=parent.parent;o.userData.id=parent?.userData.id;pickables.push(o);return o;}
const box=(g,size,pos,m=metal,rot)=>mesh(g,new THREE.BoxGeometry(...size),m,pos,rot);
const cyl=(g,r,h,pos,m=metal,rot=[0,0,Math.PI/2])=>mesh(g,new THREE.CylinderGeometry(r,r,h,32),m,pos,rot);
function panel(g,points,m){const geo=new THREE.BufferGeometry();const a=[];for(let i=1;i<points.length-1;i++)a.push(...points[0],...points[i],...points[i+1]);geo.setAttribute('position',new THREE.Float32BufferAttribute(a,3));geo.computeVertexNormals();return mesh(g,geo,m);}
function tube(g,points,r,m){return mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),40,r,8,false),m);}
// X points forward, Y upward, Z across the vehicle. Dimensions are illustrative.
const body=groups.body;
for(const s of [-1,1]){
 const shape=new THREE.Shape();shape.moveTo(-2.34,.48);shape.lineTo(-2.34,.83);shape.lineTo(-1.82,1.01);shape.lineTo(.95,1.04);shape.lineTo(2.32,.82);shape.lineTo(2.35,.48);shape.lineTo(1.74,.48);shape.absarc(1.36,.48,.38,0,Math.PI,false);shape.lineTo(-.98,.48);shape.absarc(-1.36,.48,.38,0,Math.PI,false);shape.lineTo(-2.34,.48);
 const p=mesh(body,new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:1,steps:1}),paint,[0,0,s*.86]);
 if(s<0)p.position.z=-.915;
 tube(body,[[-1.83,1,s*.86],[-.97,1.47,s*.69],[.35,1.48,s*.69],[1.06,1.02,s*.86]],.027,paint);
 tube(body,[[-.255,1.04,s*.877],[-.255,1.46,s*.7]],.025,paint);
 // Window cutouts overlay the thin outer pillars.
 panel(groups.glass,[[.91,1.045,s*.87],[.32,1.427,s*.715],[-.22,1.43,s*.715],[-.22,1.045,s*.885]],glass);
 panel(groups.glass,[[-.29,1.045,s*.885],[-.29,1.43,s*.715],[-.92,1.415,s*.72],[-1.62,1.045,s*.877]],glass);
 box(body,[2.45,.065,.075],[-.24,.45,s*.905],dark);
 tube(body,[[.99,1.01,s*.916],[.52,.75,s*.919],[-1.1,.63,s*.918]],.007,dark);
 tube(body,[[-.22,1.035,s*.925],[-.23,.54,s*.925]],.006,dark);
 for(const x of [-.55,.58])box(body,[.16,.025,.02],[x,.97,s*.934],metal);
 box(body,[.23,.1,.16],[.78,1.11,s*1.0],paint,[0,s*.15,0]);
 box(groups.glass,[.5,.035,.12],[2.11,.86,s*.64],lightMat,[0,0,-.1]);
 box(groups.glass,[.11,.075,.48],[-2.32,.85,s*.59],tailMat);
}
panel(body,[[1.03,1.035,-.865],[1.03,1.035,.865],[2.3,.84,.83],[2.3,.84,-.83]],paint);
box(body,[1.33,.045,1.38],[-.31,1.47,0],paint);
panel(groups.glass,[[1.035,1.04,-.85],[1.035,1.04,.85],[.35,1.45,.69],[.35,1.45,-.69]],glass);
panel(groups.glass,[[-.99,1.44,-.69],[-.99,1.44,.69],[-1.8,1.02,.84],[-1.8,1.02,-.84]],glass);
panel(body,[[-1.82,1.01,-.87],[-1.82,1.01,.87],[-2.34,.86,.83],[-2.34,.86,-.83]],paint);
box(body,[.1,.25,1.72],[2.31,.6,0],paint);box(body,[.1,.25,1.72],[-2.31,.6,0],paint);
box(body,[.016,.17,1.36],[2.37,.66,0],dark);for(let i=-6;i<=6;i++)box(body,[.02,.13,.012],[2.385,.66,i*.096],metal);
box(body,[.025,.075,.29],[2.39,.66,0],mat('#d9e4e9'));box(body,[.025,.075,.29],[-2.37,.69,0],mat('#d9e4e9'));
box(groups.glass,[.025,.024,1.4],[-2.38,.89,0],tailMat);
// Chassis and structural members
box(groups.chassis,[3.93,.09,1.55],[-.15,.4,0],dark);for(const z of [-.65,.65])box(groups.chassis,[4,.1,.09],[0,.34,z],teal);for(const x of [-1.36,0,1.36])box(groups.chassis,[.1,.1,1.65],[x,.34,0],metal);
// Engine: transverse block, cam cover, four coil packs, intake runners
box(groups.engine,[.57,.35,.73],[1.32,.72,.04],orange);box(groups.engine,[.65,.12,.78],[1.32,.96,.04],dark);for(let i=0;i<4;i++){box(groups.engine,[.22,.04,.09],[1.32,1.04,-.23+i*.18],orange);tube(groups.engine,[[1.15,.99,-.23+i*.18],[.96,.86,-.23+i*.18],[1.07,.69,-.23+i*.18]],.04,metal);}cyl(groups.engine,.18,.75,[1.34,.6,.06],metal,[Math.PI/2,0,0]);box(groups.engine,[.32,.13,.28],[1.69,.78,-.46],dark);
box(groups.transmission,[.55,.34,.38],[1.29,.62,-.58],orange);cyl(groups.transmission,.23,.26,[1.29,.6,-.37],metal,[Math.PI/2,0,0]);cyl(groups.transmission,.034,1.67,[1.36,.43,0],metal,[Math.PI/2,0,0]);
box(groups.cooling,[.07,.45,1.12],[1.98,.66,0],dark);for(let i=0;i<13;i++)box(groups.cooling,[.08,.017,1.04],[2.0,.46+i*.032,0],metal);for(const z of [-.28,.28]){cyl(groups.cooling,.19,.06,[1.92,.67,z],dark);for(let a=0;a<4;a++)box(groups.cooling,[.02,.3,.055],[1.875,.67,z],metal,[a*Math.PI/4,0,0]);}tube(groups.cooling,[[1.95,.86,.46],[1.7,.87,.56],[1.46,.78,.41]],.036,rubber);
// Wheels and their own outward disassembly vectors
for(const x of [-1.36,1.36])for(const s of [-1,1]){
 const wg=new THREE.Group();wg.position.set(x,.355,s*.88);groups.wheels.add(wg);moving.push({object:wg,base:wg.position.clone(),offset:new THREE.Vector3(x*.2,0,s*1.2)});
 mesh(wg,new THREE.TorusGeometry(.267,.087,16,64),rubber,[0,0,0]);cyl(wg,.232,.16,[0,0,0],dark,[Math.PI/2,0,0]);
 mesh(wg,new THREE.TorusGeometry(.221,.014,8,48),metal,[0,0,s*.088]);cyl(wg,.07,.18,[0,0,0],metal,[Math.PI/2,0,0]);
 for(let j=0;j<10;j++){const a=j*Math.PI/5;box(wg,[.035,.18,.025],[Math.sin(a)*.135,Math.cos(a)*.135,s*.102],metal,[0,0,-a+.12]);}
 for(let j=0;j<5;j++){const a=j*Math.PI*2/5;cyl(wg,.012,.015,[Math.sin(a)*.047,Math.cos(a)*.047,s*.115],dark,[Math.PI/2,0,0]);}
 const bg=new THREE.Group();bg.position.set(x,.355,s*.75);groups.brakes.add(bg);moving.push({object:bg,base:bg.position.clone(),offset:new THREE.Vector3(x*.2,.08,s*.65)});
 cyl(bg,.19,.035,[0,0,0],metal,[Math.PI/2,0,0]);cyl(bg,.07,.065,[0,0,0],dark,[Math.PI/2,0,0]);box(bg,[.095,.19,.085],[.145,0,0],red);
 for(let j=0;j<14;j++){const a=j*Math.PI/7;cyl(bg,.009,.038,[Math.sin(a)*.15,Math.cos(a)*.15,0],dark,[Math.PI/2,0,0]);}
 const sg=groups.suspension;cyl(sg,.035,.4,[x,.57,s*.64],metal,[0,0,0]);const pts=[];for(let j=0;j<=100;j++){let t=j/100;pts.push([x+Math.cos(t*Math.PI*12)*.075,.49+t*.25,s*.64+Math.sin(t*Math.PI*12)*.075]);}tube(sg,pts,.012,teal);tube(sg,[[x-.2,.33,s*.38],[x,.33,s*.72],[x+.16,.33,s*.39]],.028,teal);
}
box(groups.suspension,[.11,.1,1.36],[-1.36,.32,0],teal);cyl(groups.suspension,.04,1.25,[1.08,.42,0],dark,[Math.PI/2,0,0]);
// Passenger cabin
for(const z of [-.43,.43]){box(groups.interior,[.58,.14,.55],[.05,.59,z],seat);box(groups.interior,[.14,.58,.55],[-.24,.91,z],seat,[0,0,-.12]);box(groups.interior,[.13,.19,.29],[-.28,1.26,z],seat);}
box(groups.interior,[.53,.16,1.28],[-1.03,.61,0],seat);box(groups.interior,[.14,.53,1.28],[-1.32,.9,0],seat,[0,0,-.18]);for(const z of [-.43,.43])box(groups.interior,[.13,.17,.28],[-1.36,1.23,z],seat);
box(groups.interior,[.35,.22,1.5],[.72,.91,0],dark);box(groups.interior,[.67,.25,.21],[.1,.66,0],dark);mesh(groups.interior,new THREE.TorusGeometry(.145,.017,12,40),dark,[.45,1.04,.43],[0,Math.PI/2,.2]);box(groups.interior,[.024,.14,.27],[.52,1.09,.05],mat('#4c8597'));
// Fuel and exhaust
box(groups.fuel,[.75,.17,1.02],[-.96,.28,0],purple);tube(groups.fuel,[[-1,.32,-.52],[-.3,.32,-.6],[.6,.36,-.6],[1.1,.58,-.35]],.015,purple);
tube(groups.exhaust,[[1.28,.58,.36],[1.05,.26,.25],[.4,.22,.23],[-.7,.22,.23],[-1.6,.23,.29],[-2.38,.24,.49]],.035,metal);cyl(groups.exhaust,.09,.4,[.57,.23,.23],orange);box(groups.exhaust,[.47,.15,.36],[-1.83,.24,.32],metal);cyl(groups.exhaust,.06,.22,[-2.3,.24,.49],dark);
box(groups.battery,[.33,.3,.29],[1.23,.77,.6],purple);box(groups.battery,[.35,.035,.31],[1.23,.94,.6],dark);box(groups.battery,[.055,.035,.055],[1.31,.97,.67],red);box(groups.battery,[.055,.035,.055],[1.13,.97,.67],metal);
// Keep engine and battery under the sloping hood in the assembled model.
for (const id of ['engine','battery']) {
  groups[id].position.y = id === 'engine' ? -.15 : -.07;
  moving.find(entry => entry.object === groups[id]).base.copy(groups[id].position);
}
// Preserve original material states for selection and transparency.
for(const m of pickables){m.userData.original={opacity:m.material.opacity,transparent:m.material.transparent,emissive:m.material.emissive.clone(),intensity:m.material.emissiveIntensity};}
function updateMaterials(){for(const m of pickables){const o=m.userData.original;const shell=['body','glass'].includes(m.userData.id);m.material.opacity=transparent&&shell?.13:o.opacity;m.material.transparent=transparent&&shell?true:o.transparent;m.material.depthWrite=!(transparent&&shell);m.material.emissive.copy(o.emissive);m.material.emissiveIntensity=o.intensity;if(m.userData.id===selected&&!['body','glass'].includes(selected)){m.material.emissive.set(data.find(d=>d.id===selected).color);m.material.emissiveIntensity=.18;}m.material.needsUpdate=true;}}
function renderList(){const q=$('#search').value.trim().toLowerCase();$('#parts').innerHTML='';let n=0;for(const d of data){if(!`${d.name} ${d.en}`.toLowerCase().includes(q))continue;n++;const row=document.createElement('div');row.className='part-row'+(selected===d.id?' selected':'');row.innerHTML=`<button aria-pressed="${selected===d.id}"><i class="dot" style="background:${d.color}"></i>${d.name}</button><button class="eye" title="${d.name} 표시 전환" aria-label="${d.name} 표시 전환" aria-pressed="${groups[d.id].visible}">${groups[d.id].visible?'◉':'○'}</button>`;row.firstChild.onclick=()=>select(d.id);row.lastChild.onclick=()=>{solo=null;groups[d.id].visible=!groups[d.id].visible;renderList();renderDetail();};$('#parts').appendChild(row);}if(!n)$('#parts').textContent='검색 결과가 없습니다.';$('#count').textContent=`${n}개 시스템`;}
function renderDetail(){const d=data.find(d=>d.id===selected);$('#detail').innerHTML=`<div class="component-icon" style="color:${d.color}">${d.icon}</div><span class="component-category">${d.category}</span><h2>${d.name}</h2><div class="english">${d.en}</div><p class="description">${d.desc}</p><div class="detail-box"><b>장착 위치</b><p>${d.location}</p></div><div class="detail-box"><b>주요 구성 부품</b><p>${d.includes}</p></div><div class="detail-actions"><button id="focus">부품 확대</button><button id="isolate">${solo===selected?'전체 보기':'이 부품만 보기'}</button></div>`;$('#focus').onclick=()=>focusPart();$('#isolate').onclick=()=>{solo=solo===selected?null:selected;for(const d of data)groups[d.id].visible=!solo||d.id===solo;renderList();renderDetail();};}
function select(id){selected=id;updateMaterials();renderList();renderDetail();}
function focusPart(){const g=groups[selected];g.visible=true;const b=new THREE.Box3().setFromObject(g);const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3()).length();controls.target.copy(c);camera.position.copy(c).add(new THREE.Vector3(1,.7,1).normalize().multiplyScalar(Math.max(2.5,s*1.45)));renderList();}
function setExplosion(v){targetExplosion=v;$('#explode').value=Math.round(v*100);$('#explode-value').textContent=`${Math.round(v*100)}%`;$('#assembled').classList.toggle('active',v===0);$('#exploded').classList.toggle('active',v>0);$('#view-title').textContent=v?'부품을 분리해서 살펴보기':'완성차 둘러보기';if(v>.2&&camera.position.distanceTo(controls.target)<10)camera.position.copy(controls.target).add(camera.position.clone().sub(controls.target).normalize().multiplyScalar(11.5));}
function view(type){const vectors={perspective:[6.8,4.6,7.6],side:[0,2,9],front:[9,1.7,0],top:[0,10,.001]};controls.target.set(0,explosion>.1?1:.7,0);camera.position.set(...vectors[type]);if(explosion>.1)camera.position.multiplyScalar(1.25);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===type));}
$('#explode').oninput=e=>setExplosion(+e.target.value/100);$('#assembled').onclick=()=>setExplosion(0);$('#exploded').onclick=()=>setExplosion(1);$('#transparent').onchange=e=>{transparent=e.target.checked;updateMaterials();};$('#inside').onclick=()=>{$('#transparent').checked=true;transparent=true;updateMaterials();select('engine');};$('#search').oninput=renderList;document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('#rotate').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('#rotate').classList.toggle('active',controls.autoRotate);$('#rotate').setAttribute('aria-pressed',controls.autoRotate);};$('#reset').onclick=()=>{solo=null;for(const d of data)groups[d.id].visible=true;setExplosion(0);transparent=false;$('#transparent').checked=false;$('#label-toggle').checked=false;controls.autoRotate=false;$('#rotate').classList.remove('active');$('#rotate').setAttribute('aria-pressed','false');$('#search').value='';view('perspective');select('body');};$('#capture').onclick=()=>{renderer.render(scene,camera);const link=document.createElement('a');link.download='auto-atlas-avante.png';link.href=renderer.domElement.toDataURL('image/png');link.click();};
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||e.button!==0)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickables).find(h=>{let obj=h.object;while(obj){if(!obj.visible)return false;obj=obj.parent;}return !(transparent&&['body','glass'].includes(h.object.userData.id));});if(hit)select(hit.object.userData.id);});
const labelNodes={};for(const d of data){let node=document.createElement('span');node.className='part-label';node.textContent=d.name;$('#labels').appendChild(node);labelNodes[d.id]=node;}
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();select('body');$('#loading').remove();
let last=0;function animate(time){requestAnimationFrame(animate);let dt=Math.min((time-last)/1000,.1);last=time;explosion=THREE.MathUtils.lerp(explosion,targetExplosion,1-Math.exp(-dt*6));for(const m of moving)m.object.position.copy(m.base).addScaledVector(m.offset,explosion);controls.update();renderer.render(scene,camera);for(const d of data){const node=labelNodes[d.id];node.style.display=$('#label-toggle').checked&&groups[d.id].visible?'block':'none';if(node.style.display==='none')continue;const p=new THREE.Box3().setFromObject(groups[d.id]).getCenter(new THREE.Vector3());p.project(camera);if(p.z>1||p.z< -1){node.style.display='none';continue;}node.style.left=`${(p.x*.5+.5)*host.clientWidth}px`;node.style.top=`${(-p.y*.5+.5)*host.clientHeight}px`;}}requestAnimationFrame(animate);
window.__atlas={scene,camera,groups,data,getState:()=>({selected,explosion,targetExplosion,transparent,solo}),renderer};

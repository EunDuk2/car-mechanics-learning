import * as T from 'three';
import {cylinderState} from './engine-motion.js';
const TAU=Math.PI*2;
export function steeringState(phase){const shift=.18*Math.sin(TAU*phase),length=Math.hypot(1.3,.25,.38),angles=[];for(const sign of [-1,1]){let theta=0;for(let i=0;i<12;i++){const dx=sign*2.5+.32*Math.sin(theta)-(sign*1.2+shift),dz=.8+.32*Math.cos(theta)-1.5,f=dx*dx+.25*.25+dz*dz-length*length,df=2*dx*.32*Math.cos(theta)-2*dz*.32*Math.sin(theta);theta-=f/df;}angles.push(theta);}return {shift,length,angles};}
const FLOW={
 'power-path':[['source-engine','drive-flywheel'],['drive-flywheel','friction-disc','input-gear'],['input-gear','output-gear','output-shaft','diff-case'],['diff-case','axle-left','wheel-left'],['diff-case','axle-right','wheel-right']],
 air:[['snorkel','air-filter','turbo-inlet','compressor','hot-charge','intercooler','cold-charge','throttle','intake-manifold'],['exhaust-manifold','turbine','downpipe','catalyst']],
 cooling:[['water-pump','engine-assembly','upper-coolant','radiator','lower-coolant','water-pump']],
 oil:[['engine-assembly','oil-filter','oil-cooler','turbo-oil','engine-assembly']],
 fuel:[['fuel-supply','hpfp','fuel-line','fuel-rail','injector-0'],['ecu','ignition-coil-0']],
 electric:[['battery','battery-cable','fuse-base','starter'],['alternator','battery'],['crank-sensor','ecu','harness']],
 'brake-supply':[['brake-reservoir','brake-master','abs'],['vacuum-pump','brake-booster']],
 accessory:[['ac-compressor','condenser','ac-lines']],power:[['engine-assembly','transmission','shaft-left'],['transmission','shaft-right']]
};
export function createSystemMotion(system,model){const parts=Object.fromEntries(model.parts.map(p=>[p.userData.id,p])),effects=new T.Group();effects.name='Functional flow indicators';model.root.add(effects);let streams=[],lessonId='',originals=[],coupled=true,heldAngle=0;const sourceParts=parts['source-engine']?Object.fromEntries(parts['source-engine'].userData.engineModel.parts.map(p=>[p.userData.id,p])):null;
 model.parts.forEach(p=>p.traverse(m=>{originals.push({m,pos:m.position.clone(),rot:m.quaternion.clone(),scale:m.scale.clone()});}));
 function reset(){for(const o of originals){o.m.position.copy(o.pos);o.m.quaternion.copy(o.rot);o.m.scale.copy(o.scale);}effects.visible=false;}
 function center(id){model.root.updateMatrixWorld(true);return new T.Box3().setFromObject(parts[id]).getCenter(new T.Vector3());}
 function setup(id){reset();coupled=true;heldAngle=0;lessonId=id;for(const o of [...effects.children]){o.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});effects.remove(o);}streams=[];
 for(const [j,path]of (FLOW[id]||[]).entries()){const ids=path.filter(id=>parts[id]);if(ids.length<2)continue;const points=ids.map(center);points.forEach(p=>p.y+=.12);const curve=new T.CatmullRomCurve3(points,false,'centripetal');const color=j%2?0xd09355:0x309eab;const tube=new T.Mesh(new T.TubeGeometry(curve,80,.008,5,false),new T.MeshBasicMaterial({color,transparent:true,opacity:.55,depthWrite:false}));effects.add(tube);const dots=[];for(let i=0;i<7;i++){const dot=new T.Mesh(new T.SphereGeometry(.034,10,8),new T.MeshBasicMaterial({color}));effects.add(dot);dots.push(dot);}streams.push({curve,dots});}
 if(system==='suspension'&&id==='damper'){
 const curve=new T.CatmullRomCurve3([[.18,1.2,.12],[.18,1.6,.12],[.18,2.1,.12]].map(p=>new T.Vector3(...p))),dots=[];
 effects.add(new T.Mesh(new T.TubeGeometry(curve,24,.006,5,false),new T.MeshBasicMaterial({color:0x299fa5,transparent:true,opacity:.4})));
 for(let i=0;i<6;i++){const dot=new T.Mesh(new T.SphereGeometry(.024,10,8),new T.MeshBasicMaterial({color:0x299fa5}));effects.add(dot);dots.push(dot);}streams.push({curve,dots});
 }
 }
 function rotate(id,a,axis='x'){if(parts[id])parts[id].rotation[axis]=a;}
 function move(id,y){if(parts[id])parts[id].position.y=parts[id].userData.base.y+y;}
 function pose(t){const a=t*TAU;effects.visible=true;for(const s of streams)s.dots.forEach((d,i)=>{let u=(t+i/s.dots.length)%1;if(lessonId==='damper'&&Math.cos(a)<0)u=1-u;d.position.copy(s.curve.getPointAt(u));});
 let info={phase:t,stage:Math.min(lessonId==='power-path'?5:3,Math.floor(t*(lessonId==='power-path'?6:4)))};
 if(system==='bay'){
 if(lessonId==='air'){rotate('turbo-shaft',a*5);const flap=parts.throttle?.children[1];if(flap)flap.rotation.x=Math.PI/2+.5+.25*Math.sin(a);}
 if(lessonId==='cooling'){const fans=parts['cooling-fans'];for(let i=0;i<fans.children.length;i++){const original=originals.find(o=>o.m===fans.children[i]),m=fans.children[i],cx=original.pos.x<0?-.65:.65;const p=original.pos.clone().sub(new T.Vector3(cx,0,0)).applyAxisAngle(new T.Vector3(0,0,1),a*3).add(new T.Vector3(cx,0,0));m.position.copy(p);m.quaternion.setFromAxisAngle(new T.Vector3(0,0,1),a*3).multiply(original.rot);}}

 if(['accessory','electric'].includes(lessonId)){const pulley=parts.alternator.children.at(-1);pulley.rotation.x=a*3;if(lessonId==='accessory')parts['ac-compressor'].children[1].rotation.x=a*2;}
 if(lessonId==='fuel')info.pulse=Math.floor(t*4)+1; // Sequential command indicator only; no false housing movement.
 }else if(system==='suspension'){
 if(['spring','damper'].includes(lessonId)){const travel=.18*Math.sin(a);info.travel=travel;const moving=['lower-seat','damper','working-tube','base-valve','knuckle','hub-bearing','hub'];for(const id of moving)move(id,travel);const coil=parts.coil;coil.position.y=coil.userData.base.y+travel/2;coil.scale.y=(1.22-travel)/1.22;const boot=parts.boot;boot.position.y=boot.userData.base.y+travel/2;boot.scale.y=(.92-travel)/.92;info.direction=Math.cos(a)>=0?'압축 방향':'신장 방향';}
 if(lessonId==='brake'){let pressure=t<.25?0:t<.5?(t-.25)*4:t<.75?1:(1-t)*4;info.pressure=pressure;const omega=TAU/.375,u=t-.25;const turn=t<.25?t*omega:t<.5?omega*(.25+u-2*u*u):TAU;rotate('disc',turn,'z');rotate('hub',turn,'z');parts['pad--1'].position.z=.47+.04*pressure;parts['pad-1'].position.z=.71-.04*pressure;parts['brake-piston'].position.z=.4+.04*pressure;}
 }else if(system==='drivetrain'){
 const whole=lessonId==='power-path';const clutch=lessonId==='clutch',input=whole&&!coupled?heldAngle:clutch?(t<.25?0:t<.75?(t-.25)*TAU*2:TAU):a*2;
 rotate('drive-flywheel',a*2);rotate('friction-disc',input);rotate('pressure-plate',a*2);rotate('diaphragm',a*2);rotate('input-shaft',input);rotate('input-gear',input);rotate('output-gear',-input/2);rotate('output-shaft',-input/2);
 if(clutch){const press=t<.25?t*4:t<.75?1:(1-t)*4;parts['pressure-plate'].position.x=-1.95+.1*(1-press);parts['diaphragm'].scale.x=1-.18*(1-press);parts['release-bearing'].position.x=-1.68-.08*(1-press);info.clutch=press>.99?'연결':'분리/전환';}
 const caseAngle=whole?-input/2:a*2;let left=caseAngle,right=caseAngle;if(lessonId==='diff'){left-=.5*Math.sin(a);right+=.5*Math.sin(a);}rotate('diff-case',caseAngle);rotate('diff-ring',caseAngle);rotate('spider',caseAngle);rotate('side-left',left);rotate('side-right',right);for(const [side,turn]of [['left',left],['right',right]]){rotate('axle-'+side,turn);rotate('cv-'+side,turn);rotate('wheel-'+side,turn);}
 info.input=input;info.output=-input/2;info.caseAngle=caseAngle;info.left=left;info.right=right;
 if(whole){
 info.coupled=coupled;info.engine=a*2;
 parts['pressure-plate'].position.x=-1.95+(coupled?0:.1);parts['release-bearing'].position.x=-1.68-(coupled?0:.08);
 streams.forEach((s,i)=>s.dots.forEach(d=>d.visible=coupled||i===0));
 if(sourceParts){sourceParts.crank.rotation.x=a*2;sourceParts['cam--1'].rotation.x=a;sourceParts['cam-1'].rotation.x=a;
 for(let i=0;i<4;i++){const state=cylinderState(t*720,i),basePin=.65+(i===0||i===3?.22:-.22)+.78,delta=state.pistonPinY-basePin;
 for(const id of [`piston-${i}`,`pin-${i}`,...[0,1,2].map(j=>`ring-${i}-${j}`)])sourceParts[id].position.y=sourceParts[id].userData.base.y+delta;
 for(const id of [`rod-${i}`,`rod-cap-${i}`]){const p=sourceParts[id];p.position.y=state.pinY;p.position.z=state.pinZ;p.rotation.x=state.rodAngle;}
 for(const side of [-1,1])for(let j=0;j<2;j++){const lift=side<0?state.intake:state.exhaust,v=sourceParts[`valve-${side}-${i}-${j}`],s=sourceParts[`spring-${side}-${i}-${j}`];v.position.y=v.userData.base.y-lift;s.children[0].scale.y=(.24-lift)/.24;s.children[0].position.y=-lift/2;s.children[1].position.y=.13-lift;}
 }}
 }
 if(lessonId==='steer'){const st=steeringState(t);info.steering=st;parts.rack.position.x=st.shift;rotate('pinion',-st.shift/.1,'z');rotate('steering-wheel',-st.shift/.1,'z');for(let i=0;i<2;i++){const sign=i===0?-1:1,side=i===0?'left':'right',theta=st.angles[i];parts['steer-'+side].rotation.y=theta;parts['wheel-'+side].rotation.set(0,theta,0);const from=new T.Vector3(sign*1.2+st.shift,.55,1.5),to=new T.Vector3(sign*2.5+.32*Math.sin(theta),.8,.8+.32*Math.cos(theta));const mesh=parts['tie-'+side].children[0];mesh.position.copy(from.clone().add(to).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),to.clone().sub(from).normalize());}}
 }
 model.root.updateMatrixWorld(true);return info;}
 return {setup,pose,reset,effects,setCoupled:(value,t)=>{if(!value)heldAngle=t*TAU*2;coupled=value;}};}

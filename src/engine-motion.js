import * as T from 'three';
import {STROKES} from './engine-learning-data.js';
export const PHASE_OFFSETS=[0,180,540,360]; // Illustrative firing sequence 1–3–4–2; not verified OEM timing.
export const R=.22,L=.78,AXIS_Y=.65;
export function cylinderState(degrees,index=0){
 const phase=((degrees+PHASE_OFFSETS[index])%720+720)%720,angle=(degrees+(index===1||index===2?180:0))*Math.PI/180;
 const pinY=AXIS_Y+R*Math.cos(angle),pinZ=R*Math.sin(angle),dy=Math.sqrt(L*L-pinZ*pinZ);
 const intake=phase>0&&phase<180?.115*Math.sin(phase*Math.PI/180)**2:0;
 const exhaust=phase>540&&phase<720?.115*Math.sin((phase-540)*Math.PI/180)**2:0;
 return {phase,stroke:Math.floor(phase/180),pinY,pinZ,pistonPinY:pinY+dy,rodAngle:Math.atan2(-pinZ,dy),intake,exhaust,spark:phase>=358&&phase<378};
}
export function makeEngineMotion(model){
 const byId=Object.fromEntries(model.parts.map(p=>[p.userData.id,p]));
 const effects=new T.Group();effects.name='Educational cycle indicators';model.root.add(effects);
 const gas=[],sparks=[],arrows=[];
 for(let i=0;i<4;i++){
  const x=-1.38+i*.92;
  const volume=new T.Mesh(new T.CylinderGeometry(.315,.315,1,32),new T.MeshBasicMaterial({color:STROKES[0].color,transparent:true,opacity:.2,depthWrite:false}));volume.position.x=x;effects.add(volume);gas.push(volume);
  const spark=new T.Mesh(new T.SphereGeometry(.055,12,8),new T.MeshBasicMaterial({color:0xffe995}));spark.position.set(x,2.075,0);effects.add(spark);sparks.push(spark);
  const inlet=new T.ArrowHelper(new T.Vector3(0,-.18,.98).normalize(),new T.Vector3(x,2.2,-.9),.7,0x369cbe,.12,.075);
  const outlet=new T.ArrowHelper(new T.Vector3(0,.18,.98).normalize(),new T.Vector3(x,2.08,.15),.7,0x8993a5,.12,.075);
  effects.add(inlet,outlet);arrows.push([inlet,outlet]);
 }
 const curve=new T.CatmullRomCurve3([[0,.51,0],[0,2.78,-.56],[0,3.07,-.28],[0,3.07,.28],[0,2.78,.56],[0,.51,0]].map(p=>new T.Vector3(...p)),true,'centripetal');
 const timing=byId.timing,chainCount=100;timing.children.forEach(m=>{m.userData.motionPosition=m.position.clone();m.userData.motionQuaternion=m.quaternion.clone();});
 for(const side of [-1,1]){const cam=byId['cam-'+side];for(let i=0;i<4;i++){const peak=(side<0?90:630)-PHASE_OFFSETS[i],phi=Math.PI-peak*Math.PI/360;for(let j=0;j<2;j++){const m=cam.children[1+i*2+j];m.userData.motionPosition=m.position.clone();m.position.y=.035*Math.cos(phi);m.position.z=.035*Math.sin(phi);}}}
 function reset(){effects.visible=false;for(const p of model.parts){p.rotation.set(0,0,0);p.position.copy(p.userData.base);p.scale.set(1,1,1);if(p.userData.id.startsWith('spring-')){p.children[0].scale.y=1;p.children[0].position.y=0;p.children[1].position.y=.13;}}timing.children.forEach(m=>{m.position.copy(m.userData.motionPosition);m.quaternion.copy(m.userData.motionQuaternion);});}
 const v=new T.Vector3(),q=new T.Quaternion(),axis=new T.Vector3(1,0,0);
 function pose(degrees,single=false,indicators=true){effects.visible=indicators;const a=degrees*Math.PI/180;byId.crank.rotation.x=a;byId.flywheel.rotation.x=a;byId['cam--1'].rotation.x=a/2;byId['cam-1'].rotation.x=a/2;
  const states=[];
  for(let i=0;i<4;i++){
   const state=cylinderState(degrees,i);states.push(state);const basePin=AXIS_Y+(i===0||i===3?R:-R)+L,delta=state.pistonPinY-basePin;
   for(const id of [`piston-${i}`,`pin-${i}`,...[0,1,2].map(j=>`ring-${i}-${j}`)])byId[id].position.y=byId[id].userData.base.y+delta;
   for(const id of [`rod-${i}`,`rod-cap-${i}`]){const p=byId[id];p.position.y=state.pinY;p.position.z=state.pinZ;p.rotation.x=state.rodAngle;}
   for(const side of [-1,1])for(let j=0;j<2;j++){const lift=side<0?state.intake:state.exhaust,valve=byId[`valve-${side}-${i}-${j}`],spring=byId[`spring-${side}-${i}-${j}`];valve.position.y=valve.userData.base.y-lift;spring.children[0].scale.y=(.24-lift)/.24;spring.children[0].position.y=-lift/2;spring.children[1].position.y=.13-lift;}
   const crown=state.pistonPinY+.32,height=Math.max(.01,2.12-crown);gas[i].position.y=crown+height/2;gas[i].scale.y=height;gas[i].material.color.set(STROKES[state.stroke].color);gas[i].material.opacity=state.stroke===2?.32:.18;gas[i].visible=!single||i===0;sparks[i].visible=(!single||i===0)&&state.spark;arrows[i][0].visible=(!single||i===0)&&state.intake>.005;arrows[i][1].visible=(!single||i===0)&&state.exhaust>.005;
  }
  const travel=a*.14/curve.getLength();for(let i=0;i<chainCount;i++)timing.children[i].position.copy(curve.getPointAt((i/chainCount+travel)%1));
  q.setFromAxisAngle(axis,a);for(let i=chainCount;i<timing.children.length;i++){const m=timing.children[i];v.copy(m.userData.motionPosition).sub(new T.Vector3(0,.65,0)).applyQuaternion(q).add(new T.Vector3(0,.65,0));m.position.copy(v);m.quaternion.copy(q).multiply(m.userData.motionQuaternion);}
  model.root.updateMatrixWorld(true);return states;
 }
 reset();return {pose,reset,effects,byId};
}

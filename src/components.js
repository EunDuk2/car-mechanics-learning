import * as THREE from 'three';
// Connected components preserve source faces; vertices are welded for connectivity only.
export function connectedComponents(geometry,weld=true){
 const p=geometry.attributes.position,ix=geometry.index?.array||Uint32Array.from({length:p.count},(_,i)=>i),parent=new Int32Array(p.count),pos=new Map();
 for(let i=0;i<p.count;i++){const key=`${Math.round(p.getX(i)*1e5)},${Math.round(p.getY(i)*1e5)},${Math.round(p.getZ(i)*1e5)}`;if(weld&&pos.has(key))parent[i]=pos.get(key);else{pos.set(key,i);parent[i]=i;}}
 const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 for(let i=0;i<ix.length;i+=3){let a=root(ix[i]),b=root(ix[i+1]),c=root(ix[i+2]);parent[b]=a;parent[c]=a;}
 const components=new Map();for(let i=0;i<ix.length;i+=3){const r=root(ix[i]);if(!components.has(r))components.set(r,[]);components.get(r).push(ix[i],ix[i+1],ix[i+2]);}
 return [...components.values()].map(indices=>{const bounds=new THREE.Box3(),v=new THREE.Vector3();for(const i of indices)bounds.expandByPoint(v.fromBufferAttribute(p,i));return{indices,bounds,center:bounds.getCenter(new THREE.Vector3()),size:bounds.getSize(new THREE.Vector3())};}).sort((a,b)=>b.indices.length-a.indices.length);
}

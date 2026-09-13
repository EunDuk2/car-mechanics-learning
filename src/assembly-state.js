export const ASSEMBLY_VERSION=1;
export function inspectAssembly(catalog,placements){
 const occupied=new Map();for(const [id,p] of Object.entries(placements)){if(!catalog.some(c=>c.id===id)||!p.slot)continue;const ids=occupied.get(p.slot)||[];ids.push(id);occupied.set(p.slot,ids);}
 const results=catalog.map(part=>{const p=placements[part.id],issues=[];if(!p)issues.push('missing');else{if(p.slot!==part.id)issues.push(p.slot?'wrong-slot':'unseated');if(p.rotation.some(a=>Math.abs(((a%360)+540)%360-180)>.5))issues.push('rotation');if(p.slot&&occupied.get(p.slot)?.length>1)issues.push('occupied');}return {id:part.id,name:part.name,category:part.category,issues,slot:p?.slot||null};});
 const correct=results.filter(r=>!r.issues.length).length,missing=results.filter(r=>r.issues.includes('missing')).length;
 return {total:catalog.length,correct,missing,incorrect:catalog.length-correct-missing,score:Math.round(correct/catalog.length*100),passed:correct===catalog.length,results};
}
export function validPlacements(value,ids){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.entries(value).every(([id,p])=>ids.has(id)&&p&&(!p.slot||ids.has(p.slot))&&Array.isArray(p.rotation)&&p.rotation.length===3&&p.rotation.every(n=>Number.isFinite(n))&&Array.isArray(p.position)&&p.position.length===3&&p.position.every(n=>Number.isFinite(n)&&Math.abs(n)<100));}
export const ISSUE_LABELS={missing:'빠진 부품','wrong-slot':'다른 부품 자리에 배치',unseated:'조립 자리에 체결되지 않음',rotation:'기준 방향과 다름',occupied:'같은 자리에 부품 중복'};

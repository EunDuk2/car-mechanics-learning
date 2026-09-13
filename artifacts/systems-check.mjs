import fs from 'node:fs';
export async function checkSystems(page){const report={};await page.setViewportSize({width:1500,height:1000});
 for(const [system,count,lessons]of [['bay',85,9],['suspension',29,4],['drivetrain',36,6]]){
 await page.goto('http://127.0.0.1:5173/mechanics.html?system='+system);await page.waitForFunction(()=>window.__mechanics?.parts.length>0);if(await page.evaluate(()=>window.__mechanics.parts.length)!==count)throw Error('System coverage '+system);if(await page.locator('[data-system-lesson]').count()!==lessons)throw Error('Lesson coverage '+system);
 report[system]={parts:count,lessons,checks:[]};
 for(let i=0;i<lessons;i++){
 await page.locator(`[data-system-lesson="${i}"]`).click();await page.locator('#sys-progress').fill('375');await page.waitForTimeout(80);
 const state=await page.evaluate(()=>window.__mechanics.getSystemLearning());if(!state.active||state.index!==i||Math.abs(state.phase-.375)>.001)throw Error('System lesson state');
 if(!await page.locator('.part-learning').isVisible())throw Error('Missing part education');
 const finite=await page.evaluate(()=>window.__mechanics.parts.every(p=>[p.position.x,p.position.y,p.position.z,p.rotation.x,p.rotation.y,p.rotation.z,p.scale.x,p.scale.y,p.scale.z].every(Number.isFinite)));if(!finite)throw Error('Nonfinite pose');
 await page.locator('#sys-quiz summary').click();await page.locator('[data-sys-answer="0"]').click();if(!await page.locator('#sys-feedback').textContent())throw Error('System quiz feedback');
 if((system==='bay'&&[0,1,3,4].includes(i))||system!=='bay')await page.screenshot({path:`artifacts/system-${system}-${state.lesson}.png`});
 report[system].checks.push(state.lesson);
 }
 await page.locator('#sys-play').click();const initial=await page.evaluate(()=>window.__mechanics.getSystemLearning().phase);await page.waitForTimeout(500);const moving=await page.evaluate(()=>window.__mechanics.getSystemLearning().phase);if(moving===initial)throw Error('System play');await page.locator('#sys-play').click();const stopped=await page.evaluate(()=>window.__mechanics.getSystemLearning().phase);await page.waitForTimeout(100);if(await page.evaluate(()=>window.__mechanics.getSystemLearning().phase)!==stopped)throw Error('System pause');
 await page.locator('#sys-structure').click();if((await page.evaluate(()=>window.__mechanics.getSystemLearning())).active)throw Error('System stop');
 if(await page.evaluate(()=>window.__mechanics.parts.some(p=>p.rotation.x!==0||p.rotation.y!==0||p.rotation.z!==0)))throw Error('Restore structural rotation');
 }
 // Verify actual displayed steering-link endpoints and the exact kinematic invariants.
 const errors=[];
 for(const step of [0,125,250,375,500,625,750,875,999]){
 await page.locator('[data-system-lesson="3"]').click();await page.locator('#sys-progress').fill(String(step));
 const result=await page.evaluate(()=>{const a=window.__mechanics,by=Object.fromEntries(a.parts.map(p=>[p.userData.id,p])),st=a.getSystemLearning().metrics.steering;const errors=[];a.scene.updateMatrixWorld(true);for(const [i,side]of ['left','right'].entries()){const sign=i===0?-1:1,m=by['tie-'+side].children[0],height=m.geometry.parameters.height;const start=m.localToWorld(m.position.clone().set(0,-height/2,0)),end=m.localToWorld(m.position.clone().set(0,height/2,0));const rack=m.position.clone().set(sign*1.2+st.shift,.55,1.5),arm=m.position.clone().set(sign*2.5+.32*Math.sin(st.angles[i]),.8,.8+.32*Math.cos(st.angles[i]));if(start.distanceTo(rack)>1e-5||end.distanceTo(arm)>1e-5)errors.push('tie endpoints '+side);if(Math.abs(start.distanceTo(end)-st.length)>1e-5)errors.push('tie length '+side);}return errors;});errors.push(...result);
 await page.locator('[data-system-lesson="1"]').click();await page.locator('#sys-progress').fill(String(step));if(!await page.evaluate(()=>{const p=Object.fromEntries(window.__mechanics.parts.map(p=>[p.userData.id,p]));return Math.abs(p['input-gear'].rotation.x/2+p['output-gear'].rotation.x)<1e-8;}))errors.push('gear ratio');
 await page.locator('[data-system-lesson="2"]').click();await page.locator('#sys-progress').fill(String(step));if(!await page.evaluate(()=>{const p=Object.fromEntries(window.__mechanics.parts.map(p=>[p.userData.id,p]));return Math.abs((p['side-left'].rotation.x+p['side-right'].rotation.x)/2-p['diff-case'].rotation.x)<1e-8;}))errors.push('differential average');
 }
 if(errors.length)throw Error(JSON.stringify(errors));report.invariants='gear ratio, differential average, steering link endpoints/length at nine poses';
 await page.goto('http://127.0.0.1:5173/mechanics.html?system=suspension');await page.waitForFunction(()=>window.__mechanics?.system==='suspension');await page.locator('[data-system-lesson="0"]').click();
 for(const step of [0,250,500,750]){await page.locator('#sys-progress').fill(String(step));if(!await page.evaluate(()=>{const p=Object.fromEntries(window.__mechanics.parts.map(p=>[p.userData.id,p]));return Math.abs(p.coil.position.y+.61*p.coil.scale.y-3.19)<1e-7&&p.mount.position.y===3.6;}))throw Error('Spring top constraint');}
 for(const system of ['bay','suspension','drivetrain']){await page.goto('http://127.0.0.1:5173/mechanics.html?system='+system);await page.waitForFunction(s=>window.__mechanics?.system===s,system);await page.locator('#sys-learn').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Systems mobile overflow');await page.screenshot({path:`artifacts/system-${system}-mobile.png`,fullPage:true});await page.setViewportSize({width:1500,height:1000});}
 fs.writeFileSync('artifacts/systems-validation.json',JSON.stringify(report,null,2));return report;
}

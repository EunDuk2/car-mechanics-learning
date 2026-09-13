import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1500,height:1000},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
if(process.argv.includes('--suspension-assembly-only')){await(await import('./suspension-assembly-check.mjs')).checkSuspensionAssembly(page);console.log(JSON.stringify({errors,suspensionAssembly:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--assembly-hints-only')){await(await import('./assembly-hints-check.mjs')).checkHints(page);console.log(JSON.stringify({errors,hints:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--assembly-only')){await(await import('./assembly-check.mjs')).checkAssembly(page);console.log(JSON.stringify({errors,assembly:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--questions-only')){await(await import('./questions-check.mjs')).checkQuestions(page);console.log(JSON.stringify({errors,questions:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--selection-only')){await(await import('./selection-check.mjs')).checkSelection(page);console.log(JSON.stringify({errors,selection:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--power-only')){await(await import('./power-path-check.mjs')).checkPowerPath(page);console.log(JSON.stringify({errors,powerPath:'passed'}));await browser.close();process.exit(errors.length?1:0);}
if(process.argv.includes('--systems-only')){await(await import('./systems-check.mjs')).checkSystems(page);console.log(JSON.stringify({errors,systems:'passed'}));await browser.close();process.exit(errors.length?1:0);}
await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>window.__atlas,{},{timeout:60000});await page.waitForTimeout(1500);
let stats=await page.evaluate(()=>({triangles:window.__atlas.sourceTriangles,groups:window.__atlas.data.length,rendered:window.__atlas.getVisibleTriangles(),parts:window.__atlas.data.map(d=>({id:d.id,triangles:window.__atlas.groups[d.id].userData.triangles}))}));
if(stats.triangles!==258192||stats.rendered!==258192)throw Error('Source geometry conservation');
await page.screenshot({path:'artifacts/detailed-assembled.png'});
await page.locator('#exploded').click();await page.waitForTimeout(1300);await page.locator('#label-toggle').check();await page.screenshot({path:'artifacts/detailed-exploded.png'});
if(await page.locator('#explode-value').textContent()!=='100%')throw Error('Explosion');
await page.locator('#engine-view').click();await page.waitForTimeout(1300);await page.screenshot({path:'artifacts/detailed-engine.png'});
if((await page.evaluate(()=>window.__atlas.getState())).openAmount.hood<.95)throw Error('Hood open');
await page.locator('#cabin-view').click();await page.waitForTimeout(1300);await page.screenshot({path:'artifacts/detailed-cabin.png'});
if((await page.evaluate(()=>window.__atlas.getState())).openAmount.doors<.95)throw Error('Doors open');
await page.locator('#brakes-view').click();await page.waitForTimeout(1200);await page.screenshot({path:'artifacts/detailed-brakes.png'});
await page.locator('#reset').click();await page.locator('#search').fill('엔진 상부');await page.locator('#parts button').first().click();await page.locator('#isolate').click();await page.waitForTimeout(600);await page.screenshot({path:'artifacts/detailed-engine-cover.png'});
if(await page.evaluate(()=>Object.values(window.__atlas.groups).filter(g=>g.visible).length)!==1)throw Error('isolate');
await page.locator('#show-all').click();await page.locator('#reset').click();await page.locator('#transparent').check();await page.locator('#wireframe').check();await page.locator('#section').check();await page.locator('#section-position').fill('30');if(!await page.evaluate(()=>window.__atlas.renderer.localClippingEnabled))throw Error('Clipping');
await page.locator('#reset').click();if((await page.evaluate(()=>window.__atlas.getState())).transparent)throw Error('Reset transparency');
await page.locator('[data-category="휠·제동"]').click();if(await page.locator('.part-row').count()!==8)throw Error('Category filter');await page.locator('[data-category="전체"]').click();await page.locator('#search').fill('뒤 도어');if(await page.locator('.part-row').count()!==2)throw Error('Search');await page.locator('#search').fill('');
for(const v of ['side','front','top','perspective'])await page.locator(`[data-view="${v}"]`).click();
await page.locator('#rotate').click();if(await page.locator('#rotate').getAttribute('aria-pressed')!=='true')throw Error('Auto rotation');await page.locator('#rotate').click();
await page.locator('#sources-button').click();if(!await page.locator('#sources').isVisible())throw Error('Sources dialog');await page.screenshot({path:'artifacts/sources.png'});await page.keyboard.press('Escape');
const download=page.waitForEvent('download');await page.locator('#capture').click();await(await download).saveAs('artifacts/detailed-export.png');
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'artifacts/detailed-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
await page.setViewportSize({width:1500,height:1000});
await page.goto('http://127.0.0.1:5173/mechanics.html?system=engine');
await page.waitForFunction(()=>window.__mechanics);
await page.waitForTimeout(1000);
if(!(await page.evaluate(()=>window.__mechanics.getState())).learning)throw Error('Engine learning default');
await page.screenshot({path:'artifacts/engine-learning-intake.png'});
const selectionColor=await page.evaluate(()=>{
 const a=window.__mechanics,chosen=a.parts.find(p=>p.userData.id===a.getState().selected);return chosen.children[0].material.color.getHexString();
});if(selectionColor!=='ef3530')throw Error('Selected part red');
await page.locator('[data-part="crank"]').click();
if(!await page.evaluate(()=>{const a=window.__mechanics,p=a.parts.find(p=>p.userData.id==='piston-0'),c=a.parts.find(p=>p.userData.id==='crank');return p.children[0].material.color.equals(p.children[0].material.userData.selectionBase.color)&&c.children.every(m=>m.material.color.getHexString()==='ef3530');}))throw Error('Selection color restore');
await page.screenshot({path:'artifacts/engine-selection-red.png'});
await page.locator('[data-part="piston-0"]').click();

const motionChecks=[];
for(const degrees of [0,45,90,135,180,270,360,450,540,630,720]){
 await page.locator('#cycle-angle').fill(String(degrees));
 const result=await page.evaluate(()=>{
  const a=window.__mechanics,parts=Object.fromEntries(a.parts.map(p=>[p.userData.id,p]));a.scene.updateMatrixWorld(true);
  const errors=[];
  for(let i=0;i<4;i++){
   const r=parts['rod-'+i],pin=parts['pin-'+i],crank=parts.crank;
   const small=r.localToWorld(r.position.clone().set(0,.78,0));
   const expected=pin.getWorldPosition(pin.position.clone());
   if(small.distanceTo(expected)>1e-6)errors.push('rod wrist '+i);
   const big=r.getWorldPosition(r.position.clone()),cp=crank.localToWorld(crank.position.clone().set(-1.38+i*.92,i===0||i===3?.22:-.22,0));
   if(big.distanceTo(cp)>1e-6)errors.push('rod crank '+i);
   if(Math.abs(small.distanceTo(big)-.78)>1e-6)errors.push('rod length '+i);
  }
  if(Math.abs(parts['cam--1'].rotation.x*2-parts.crank.rotation.x)>1e-8)errors.push('2:1 ratio');
  return {degrees:a.getState().cycleAngle,states:a.getCycle(),errors};
 });
 if(result.errors.length)throw Error('Kinematics '+JSON.stringify(result));motionChecks.push(result);
}
for(const [degree,stroke,intake,exhaust]of [[90,0,true,false],[270,1,false,false],[450,2,false,false],[630,3,false,true]]){
 await page.locator('#cycle-angle').fill(String(degree));const s=await page.evaluate(()=>window.__mechanics.getCycle()[0]);if(s.stroke!==stroke||(s.intake>0)!==intake||(s.exhaust>0)!==exhaust)throw Error('Stroke synchronization');
}
await page.locator('[data-stroke="2"]').click();await page.screenshot({path:'artifacts/engine-learning-power.png'});
await page.locator('#play-cycle').click();const beforeMotion=await page.evaluate(()=>window.__mechanics.getState().cycleAngle);await page.waitForTimeout(700);const afterMotion=await page.evaluate(()=>window.__mechanics.getState().cycleAngle);if(Math.abs(afterMotion-beforeMotion)<5)throw Error('Playback motion');await page.locator('#play-cycle').click();const paused=await page.evaluate(()=>window.__mechanics.getState().cycleAngle);await page.waitForTimeout(250);if(await page.evaluate(()=>window.__mechanics.getState().cycleAngle)!==paused)throw Error('Pause');
await page.locator('#cycle-speed').selectOption('.5');await page.locator('#next-stroke').click();
await page.locator('[data-lesson="2"]').click();if((await page.evaluate(()=>window.__mechanics.getState())).singleCylinder)throw Error('Four cylinder lesson');await page.locator('#cycle-angle').fill('90');await page.screenshot({path:'artifacts/engine-learning-valves.png'});
if(new Set(await page.evaluate(()=>window.__mechanics.getCycle().map(s=>s.stroke))).size!==4)throw Error('Cylinder phase distribution');
await page.locator('#lesson-quiz summary').click();await page.locator('[data-answer="0"]').click();if(!await page.locator('#quiz-feedback').textContent())throw Error('Quiz feedback');await page.locator('[data-answer="2"]').click();if(!await page.locator('[data-answer="2"]').evaluate(n=>n.classList.contains('correct')))throw Error('Quiz correct');
await page.locator('[data-lesson="4"]').click();if(!await page.locator('#energy-path').isVisible())throw Error('Vehicle power path');await page.screenshot({path:'artifacts/engine-learning-output.png'});
await page.locator('[data-lesson="1"]').click();await page.locator('[data-related="pin-0"]').click();if((await page.evaluate(()=>window.__mechanics.getState())).selected!=='pin-0')throw Error('Learning related navigation');await page.locator('#related-view').click();if((await page.evaluate(()=>window.__mechanics.getState())).learning)throw Error('Related assembly view');
await page.locator('#learning-mode').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);await page.screenshot({path:'artifacts/engine-learning-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Learning mobile overflow');await page.setViewportSize({width:1500,height:1000});
await page.locator('#structure-mode').click();await page.locator('#restore').click();
fs.writeFileSync('artifacts/engine-learning-validation.json',JSON.stringify({errors,motionChecks,checks:'rod endpoint constraints, constant rod length, crank/cam ratio, synchronized valve states, phase distribution, playback/pause, scrub, lessons, quizzes, linked parts, structure restoration, mobile'},null,2));
const mechanics={engine:await page.evaluate(()=>window.__mechanics.parts.length)};
if(mechanics.engine<75)throw Error('Engine depth');
await page.screenshot({path:'artifacts/mechanics-engine.png'});
await page.locator('#explode-all').click();await page.waitForTimeout(1000);
await page.locator('#labels').click();await page.screenshot({path:'artifacts/mechanics-engine-exploded.png'});
if((await page.evaluate(()=>window.__mechanics.getState())).amount<.99)throw Error('Detailed explosion');
await page.locator('#search').fill('피스톤 핀');if(await page.locator('[data-part]').count()!==4)throw Error('Detailed search');
await page.locator('[data-part="pin-0"]').click();await page.locator('#isolate').click();
if((await page.evaluate(()=>window.__mechanics.getState())).visible!==1)throw Error('Detailed isolate');
await page.locator('#restore').click();await page.locator('#search').fill('');
await page.locator('#internals').click();if(await page.evaluate(()=>window.__mechanics.parts.some(p=>p.userData.shell&&p.visible)))throw Error('Internal preset');
await page.locator('#restore').click();await page.locator('#assemble').click();await page.locator('#ghost').uncheck();await page.waitForTimeout(1000);
await page.screenshot({path:'artifacts/mechanics-engine-assembled.png'});
await page.locator('[data-system="suspension"]').click();await page.waitForTimeout(700);
mechanics.suspension=await page.evaluate(()=>window.__mechanics.parts.length);
if(mechanics.suspension<25)throw Error('Suspension depth');
await page.screenshot({path:'artifacts/mechanics-suspension.png'});
await page.locator('#explode-all').click();await page.waitForTimeout(1000);await page.screenshot({path:'artifacts/mechanics-suspension-exploded.png'});
await page.locator('#search').fill('피스톤 밸브');await page.locator('[data-part="piston-valve"]').click();await page.locator('#focus').click();await page.locator('#family').click();
if(!await page.evaluate(()=>window.__mechanics.parts.filter(p=>p.visible).every(p=>p.userData.category==='댐퍼 내부')))throw Error('Family filter');
await page.locator('#restore').click();await page.locator('#search').fill('');await page.locator('#assemble').click();await page.locator('#ghost').uncheck();await page.locator('#labels').click();await page.waitForTimeout(1000);await page.screenshot({path:'artifacts/mechanics-suspension-assembled.png'});
await page.locator('#wire').check();if(!await page.evaluate(()=>window.__mechanics.parts[0].children[0].material.wireframe))throw Error('Mechanics wireframe');await page.locator('#wire').uncheck();
const md=page.waitForEvent('download');await page.locator('#capture').click();await(await md).saveAs('artifacts/mechanics-export.png');
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:'artifacts/mechanics-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mechanics mobile overflow');
await page.setViewportSize({width:1500,height:1000});
await page.goto('http://127.0.0.1:5173/mechanics.html?system=bay');await page.waitForFunction(()=>window.__mechanics?.system==='bay');await page.waitForTimeout(900);
const bay=await page.evaluate(()=>({groups:window.__mechanics.parts.length,categories:[...new Set(window.__mechanics.parts.map(p=>p.userData.category))],engineChildCount:window.__mechanics.parts.find(p=>p.userData.id==='engine-assembly').children[0].children.length}));
if(bay.groups<75||bay.engineChildCount!==80)throw Error('Bay hierarchy / coverage');
await page.screenshot({path:'artifacts/engine-bay-overview.png'});
await page.locator('#assemble').click();await page.locator('#top').click();await page.waitForTimeout(900);await page.screenshot({path:'artifacts/engine-bay-top.png'});
await page.locator('#explode-all').click();await page.locator('#labels').click();await page.waitForTimeout(1100);await page.screenshot({path:'artifacts/engine-bay-exploded.png'});
await page.locator('#search').fill('필터');if(await page.locator('[data-part]').count()!==2)throw Error('Bay search');
await page.locator('#search').fill('흡기 필터');await page.locator('[data-part="air-filter"]').click();await page.locator('#family').click();
if(!await page.evaluate(()=>window.__mechanics.parts.filter(p=>p.visible).every(p=>p.userData.category==='흡기 · 과급')))throw Error('Bay family');
await page.locator('#ghost').check();await page.waitForTimeout(500);await page.screenshot({path:'artifacts/engine-bay-intake.png'});
await page.locator('#restore').click();await page.locator('#search').fill('엔진 본체');await page.locator('[data-part="engine-assembly"]').click();await page.locator('#isolate').click();
const bayBefore=await page.evaluate(()=>window.__mechanics.getState());await page.locator('#drill').click();await page.waitForFunction(()=>window.__mechanics.system==='engine');
if(await page.evaluate(()=>window.__mechanics.parts.length)!==80)throw Error('Drill into original engine');
await page.locator('#back-bay').click();await page.waitForFunction(()=>window.__mechanics.system==='bay');
const bayAfter=await page.evaluate(()=>window.__mechanics.getState());if(bayAfter.selected!==bayBefore.selected||bayAfter.target!==bayBefore.target||bayAfter.visible!==1||bayAfter.solo!=='engine-assembly')throw Error('Bay return state');
await page.locator('#restore').click();await page.locator('#search').fill('타워');await page.locator('[data-part]').first().click();await page.locator('#drill').click();await page.waitForFunction(()=>window.__mechanics.system==='suspension');
if(await page.evaluate(()=>window.__mechanics.parts.length)!==29)throw Error('Suspension hierarchy');
await page.locator('#back-bay').click();await page.locator('#search').fill('');await page.locator('#assemble').click();await page.locator('#ghost').uncheck();await page.locator('#home').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(900);await page.screenshot({path:'artifacts/engine-bay-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Bay mobile overflow');
fs.writeFileSync('artifacts/engine-bay-validation.json',JSON.stringify({errors,...bay,checks:'component coverage, nested engine, assembly/explosion, top view, search, family filter, engine/suspension drill-down, saved return state, mobile'},null,2));
await page.locator('header .return').click();await page.waitForFunction(()=>window.__atlas,{},{timeout:60000});
if(await page.evaluate(()=>window.__atlas.sourceTriangles)!==258192)throw Error('Return to preserved vehicle');
fs.writeFileSync('artifacts/mechanics-validation.json',JSON.stringify({errors,...mechanics,checks:'individual parts, search, isolate, family filter, explode, assemble, housing visibility, internals, wireframe, export, mobile, return to original car'},null,2));
await (await import('./systems-check.mjs')).checkSystems(page);
await (await import('./power-path-check.mjs')).checkPowerPath(page);
fs.writeFileSync('artifacts/validation.json',JSON.stringify({errors,...stats,checks:'source triangles preserved, explode, hood, doors, engine and cabin presets, brakes, selection, isolation, clipping, wireframe, reset, search and category filter, camera views, rotation, sources dialog, PNG export, mobile layout'},null,2));
console.log(JSON.stringify({errors,triangles:stats.triangles,groups:stats.groups,checks:'all passed'}));await browser.close();if(errors.length)process.exit(1);

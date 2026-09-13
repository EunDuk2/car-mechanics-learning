import assert from 'node:assert/strict';
export async function checkSelection(page){
 for(const system of ['engine','bay','suspension','drivetrain','car']){
  await page.goto(system==='car'?'http://127.0.0.1:5173/':`http://127.0.0.1:5173/mechanics.html?system=${system}${system==='drivetrain'?'&lesson=power-path':''}`);
  await page.waitForFunction(()=>window.__mechanics||window.__atlas);
  await page.locator(system==='car'?'#hide-selected':'#hide').click();
  const inspect=()=>page.evaluate(()=>{const a=window.__mechanics||window.__atlas,parts=a.parts||Object.values(a.groups);return {selected:a.getState().selected,visible:parts.filter(p=>p.visible).map(p=>p.userData.id),colors:parts.flatMap(p=>{const c=[];p.traverse(m=>{if(m.isMesh)c.push([m.material.color.getHexString(),m.material.opacity]);});return c;})};});
  const before=await inspect();await page.locator('#search').fill('xyz-no-match');
  await page.locator('#select-all').click();await page.locator('#select-all').click();
  assert.equal(await page.locator('#select-all').getAttribute('aria-pressed'),'true');
  assert(await page.evaluate(()=>{const a=window.__mechanics||window.__atlas,ps=a.parts||Object.values(a.groups);return ps.every(p=>p.visible)&&a.getState().allSelected;}));
  assert((await inspect()).colors.every(c=>c[0]==='ef3530'&&c[1]===1));
  if(system==='drivetrain'){await page.locator('#sys-next').click();assert.equal(await page.locator('#select-all').getAttribute('aria-pressed'),'true');}
  await page.locator('#undo-selection').click();assert.deepEqual(await inspect(),before);assert(await page.locator('#undo-selection').isDisabled());
  await page.locator('#search').fill('');await page.locator('#select-all').click();
  if(system==='engine'){await page.screenshot({path:'artifacts/selection-all-engine.png'});await page.locator('[data-part="crank"]').click();assert.equal(await page.locator('#select-all').getAttribute('aria-pressed'),'false');await page.locator('#undo-selection').click();assert.deepEqual(await inspect(),before);}
  if(system==='bay'){await page.locator('[data-system="suspension"]').click();assert(await page.locator('#undo-selection').isDisabled());assert.equal(await page.locator('#select-all').getAttribute('aria-pressed'),'false');}
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/selection-mobile.png',fullPage:true});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
}

import assert from 'node:assert/strict';
export async function checkHints(page){
 await page.goto('http://127.0.0.1:5173/assembly.html');await page.waitForFunction(()=>window.__assembly);
 const state=()=>page.evaluate(()=>window.__assembly.getState());
 assert.equal((await state()).hints,false);assert.deepEqual((await state()).visibleReferences,[]);
 await page.locator('[data-part="piston-0"]').click();assert.deepEqual((await state()).visibleReferences,[]);assert(!(await page.locator('#target-slot').textContent()).includes('피스톤'));assert.equal(await page.locator('#target-slot').inputValue(),'');
 await page.locator('#part-hint').click();assert.deepEqual((await state()).visibleReferences,['piston-0']);assert.equal(await page.locator('#target-slot').inputValue(),'');assert(await page.locator('#place-slot').isDisabled());
 await page.locator('[data-part="block"]').click();assert.deepEqual((await state()).visibleReferences,[]);
 await page.locator('#hints').check();assert.equal((await state()).visibleReferences.length,80);await page.locator('#hints').uncheck();assert.deepEqual((await state()).visibleReferences,[]);
 await page.locator('#target-slot').selectOption('head');await page.locator('#place-slot').click();assert.equal((await state()).placements.block.slot,'head');await page.locator('#check').click();const a=(await state()).attempts[0];assert.equal(a.hints,false);assert.deepEqual(a.hintUsage,{allViews:1,parts:['piston-0']});assert((await page.locator('.report-label').textContent()).includes('전체 1회 / 개별 1회'));await page.locator('#history-close').click();
 await page.reload();await page.waitForFunction(()=>window.__assembly);assert.deepEqual((await state()).visibleReferences,[]);assert.deepEqual((await state()).hintUsage,a.hintUsage);
 await page.locator('#restart').click();await page.locator('#restart-yes').click();assert.deepEqual((await state()).hintUsage,{allViews:0,parts:[]});assert.equal((await state()).attempts.length,1);assert(await page.locator('#undo').isDisabled());
 await page.screenshot({path:'artifacts/assembly-challenge.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/assembly-challenge-mobile.png',fullPage:true});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {validBranch,validMessage,validAttribution} from './git-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.stderr.write(fs.readFileSync(path.join(root,'GIT_WORKFLOW.md'),'utf8'));
assert(validBranch('feat/42-engine-assembly'));assert(!validBranch('main'));assert(!validBranch('Feature/Bad_Name'));
assert(validMessage('feat(assembly): 조립 기록 저장'));assert(validMessage('fix!: 저장 형식 수정'));assert(!validMessage('update things'));assert(!validMessage('feat: '+'a'.repeat(73)));
assert(!validAttribution('feat: 변경\n\nCo-authored-by: Codex <bot@example.invalid>'));assert(!validAttribution('fix: 수정\n\n🤖 Generated with Codex'));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'car-git-policy-')),repo=path.join(temp,'project'),remote=path.join(temp,'remote.git');fs.mkdirSync(repo);
const env={...process.env,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_AUTHOR_NAME:'Workflow Test',GIT_AUTHOR_EMAIL:'workflow@example.invalid',GIT_COMMITTER_NAME:'Workflow Test',GIT_COMMITTER_EMAIL:'workflow@example.invalid',GIT_TERMINAL_PROMPT:'0'};
// Fixture commands are the documented internal exception; no user's repository is committed or pushed.
function run(command,args,options={}){return spawnSync(command,args,{cwd:repo,encoding:'utf8',env,...options});}
function ok(r){assert.equal(r.status,0,r.stderr);return r;}
try{
 for(const name of ['scripts','.githooks','.codex','GIT_WORKFLOW.md','.car-git-workflow'])fs.cpSync(path.join(root,name),path.join(repo,name),{recursive:true});
 for(const f of fs.readdirSync(path.join(repo,'.githooks')))fs.chmodSync(path.join(repo,'.githooks',f),0o755);fs.chmodSync(path.join(repo,'scripts/git'),0o755);
 fs.writeFileSync(path.join(repo,'.git-author.json'),JSON.stringify({name:'Workflow Test',email:'workflow@example.invalid'}));
 ok(run('node',['scripts/setup-git.mjs']));assert.equal(ok(run('git',['symbolic-ref','--short','HEAD'])).stdout.trim(),'main');
 const status=ok(run('./scripts/git',['status','--porcelain']));assert(status.stderr.includes('# Git 작업 규칙'));assert(!status.stdout.includes('# Git 작업 규칙'));
 fs.writeFileSync(path.join(repo,'seed.txt'),'seed\n');ok(run('git',['add','seed.txt']));ok(run('git',['commit','-m','chore: 최초 등록']));
 ok(run('git',['init','--bare',remote]));ok(run('git',['remote','add','origin',remote]));ok(run('git',['push','origin','main']));
 fs.writeFileSync(path.join(repo,'seed.txt'),'change\n');ok(run('git',['add','seed.txt']));const onMain=run('git',['commit','-m','fix: 수정']);assert.notEqual(onMain.status,0);assert(onMain.stderr.includes('작업 브랜치'));
 ok(run('git',['switch','-c','fix/seed']));const invalid=run('git',['commit','-m','bad message']);assert.notEqual(invalid.status,0);assert(invalid.stderr.includes('72자'));
 const bot=run('git',['commit','-m','fix: 수정'],{env:{...env,GIT_AUTHOR_NAME:'Codex',GIT_AUTHOR_EMAIL:'bot@example.invalid'}});assert.notEqual(bot.status,0);assert(bot.stderr.includes('사용자 계정'));
 const coauthor=run('git',['commit','-m','fix: 수정\n\nCo-authored-by: Codex <bot@example.invalid>']);assert.notEqual(coauthor.status,0);
 ok(run('git',['commit','-m','fix: 수정']));ok(run('git',['push','origin','fix/seed']));const direct=run('git',['push','origin','HEAD:main']);assert.notEqual(direct.status,0);assert(direct.stderr.includes('main 직접'));
 fs.writeFileSync(path.join(repo,'seed.txt'),'trailing   \n');ok(run('git',['add','seed.txt']));assert.notEqual(run('git',['commit','-m','fix: 공백 오류']).status,0);
 const hook=command=>{const r=ok(run('python3',['.codex/hooks/git-policy.py'],{input:JSON.stringify({tool_name:'Bash',tool_input:{command}})}));return JSON.parse(r.stdout);};
 assert.equal(hook('git status').hookSpecificOutput.permissionDecision,'deny');assert.equal(hook('/usr/bin/git log').hookSpecificOutput.permissionDecision,'deny');
 assert.equal(hook('./scripts/git status').hookSpecificOutput.permissionDecision,undefined);assert(hook('./scripts/git status').hookSpecificOutput.additionalContext.includes('# Git 작업 규칙'));
 assert.equal(hook('npm run git -- status').hookSpecificOutput.permissionDecision,undefined);assert.equal(hook('./scripts/git status; git log').hookSpecificOutput.permissionDecision,'deny');assert.deepEqual(hook('npm run build'),{});
 const cfg=JSON.parse(fs.readFileSync(path.join(repo,'.codex/hooks.json'),'utf8'));const launch=cfg.hooks.PreToolUse[0].hooks[0].command;const nested=ok(run('sh',['-c',launch],{cwd:path.join(repo,'src').replace(/src$/,'scripts'),input:JSON.stringify({tool_name:'Bash',tool_input:{command:'git status'}})}));assert.equal(JSON.parse(nested.stdout).hookSpecificOutput.permissionDecision,'deny');
 if(spawnSync('zsh',['--version']).status===0){const shell=ok(run('zsh',['-fc','source ./scripts/git-shell.zsh\ngit status --porcelain']));assert(shell.stderr.includes('# Git 작업 규칙'));}
 const missing=path.join(temp,'missing');fs.mkdirSync(path.join(missing,'scripts'),{recursive:true});fs.copyFileSync(path.join(repo,'scripts/git'),path.join(missing,'scripts/git'));fs.chmodSync(path.join(missing,'scripts/git'),0o755);assert.notEqual(run(path.join(missing,'scripts/git'),['status']).status,0);
 console.log('Git workflow: branch, commit, staged diff, push, wrapper, shell, Codex hook tests passed.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}

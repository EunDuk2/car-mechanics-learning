import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.stderr.write(fs.readFileSync(path.join(root,'GIT_WORKFLOW.md'),'utf8'));
const git=args=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});if(r.status)throw Error(r.stderr);return r.stdout.trim();};
if(!fs.existsSync(path.join(root,'.git'))){if(process.argv.includes('--if-repository'))process.exit(0);git(['init','-b','main']);}
const actual=git(['rev-parse','--show-toplevel']);if(fs.realpathSync(actual)!==fs.realpathSync(root))throw Error('상위 저장소를 변경하지 않습니다.');
const configured=spawnSync('git',['config','--local','--get','core.hooksPath'],{cwd:root,encoding:'utf8'}).stdout.trim();
if(configured&&configured!=='.githooks')throw Error('기존 hooksPath를 자동으로 덮어쓰지 않습니다: '+configured);
for(const name of fs.readdirSync(path.join(root,'.githooks')))fs.chmodSync(path.join(root,'.githooks',name),0o755);
fs.chmodSync(path.join(root,'scripts/git'),0o755);
git(['config','--local','core.hooksPath','.githooks']);
console.log('프로젝트 Git 훅 활성화 완료: .githooks');

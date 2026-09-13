import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const TYPES='feat|fix|docs|refactor|test|chore|perf|ci|build|revert|hotfix';
export function validBranch(name){return new RegExp(`^(${TYPES})/[a-z0-9]+(?:-[a-z0-9]+)*$`).test(name);}
export function validAttribution(message){return !/(?:^|\n)\s*(?:Co-authored-by\s*:|(?:🤖\s*)?Generated\s+(?:with|by)\b)/i.test(message);}
export function validMessage(message){const subject=message.split(/\r?\n/)[0];return validAttribution(message)&&[...subject].length<=72&&new RegExp(`^(${TYPES})(\\([a-z0-9-]+\\))?!?: \\S.*$`).test(subject);}
function fail(text){console.error(text);process.exit(1);}
function git(args,optional=false){const r=spawnSync('git',args,{encoding:'utf8'});if(r.error)throw r.error;if(r.status&&!optional)fail(r.stderr||'Git 검사 실패');return r;}
function showPolicy(){const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.stderr.write(fs.readFileSync(path.join(root,'GIT_WORKFLOW.md'),'utf8'));}
function checkBranch(){const branch=git(['symbolic-ref','--quiet','--short','HEAD'],true).stdout.trim();const initial=git(['rev-parse','--verify','HEAD'],true).status!==0;if(branch==='main'&&initial)return;if(!validBranch(branch))fail('작업 브랜치가 필요합니다. 예: feat/engine-assembly. main 직접 커밋은 최초 1회만 허용합니다.');}
function authorPolicy(){return JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.git-author.json'),'utf8'));}
function checkIdentity(name,email){const expected=authorPolicy();if(name!==expected.name||email!==expected.email)fail('작성자·커미터는 .git-author.json의 사용자 계정만 허용합니다.');}
function checkCurrentIdentity(){for(const key of ['GIT_AUTHOR_IDENT','GIT_COMMITTER_IDENT']){const raw=git(['var',key]).stdout.trim(),m=raw.match(/^(.*) <([^<>]+)> -?\d+ [+-]\d{4}$/);if(!m)fail('커밋 작성자 정보를 확인할 수 없습니다.');checkIdentity(m[1],m[2]);}}
function checkOutgoing(sha,remoteSha){
 const args=['rev-list',sha];if(!/^0+$/.test(remoteSha)&&git(['cat-file','-e',remoteSha+'^{commit}'],true).status===0)args.push('^'+remoteSha);else args.push('--not','--remotes');
 for(const hash of git(args).stdout.trim().split('\n').filter(Boolean)){const [an,ae,cn,ce,message]=git(['show','-s','--format=%an%x00%ae%x00%cn%x00%ce%x00%B',hash]).stdout.split('\0');checkIdentity(an,ae);checkIdentity(cn,ce);if(!validAttribution(message))fail('공동 작성자·자동 생성 표기가 있는 커밋은 푸시할 수 없습니다.');}
}
export function main(mode,arg){
 showPolicy();
 if(mode==='commit-msg'){checkCurrentIdentity();if(!validMessage(fs.readFileSync(arg,'utf8')))fail('커밋 제목은 type(scope): 설명 형식, 72자 이하로 작성하며 공동 작성자·자동 생성 표기를 넣지 마세요. 예: fix(assembly): 자리 힌트 노출 수정');}
 else if(mode==='pre-commit'||mode==='pre-merge-commit'){checkCurrentIdentity();checkBranch();git(['diff','--cached','--check']);}
 else if(mode==='pre-push'){
  for(const line of fs.readFileSync(0,'utf8').trim().split('\n').filter(Boolean)){
   const [localRef,localSha,remoteRef,remoteSha]=line.split(/\s+/);
   if(localSha&&!/^0+$/.test(localSha))checkOutgoing(localSha,remoteSha);
   if(remoteRef==='refs/heads/main'||remoteRef==='refs/heads/master'){
    const bootstrap=remoteRef==='refs/heads/main'&&localRef==='refs/heads/main'&&/^0+$/.test(remoteSha)&&!/^0+$/.test(localSha)&&git(['rev-list','--count',localSha]).stdout.trim()==='1';
    if(!bootstrap)fail('main 직접 푸시·삭제는 금지합니다. 작업 브랜치를 푸시하고 PR로 합치세요.');
   }else if(remoteRef?.startsWith('refs/heads/')&&!validBranch(remoteRef.slice(11)))fail('원격 브랜치 이름은 feat/설명 같은 작업 브랜치 형식을 사용하세요.');
  }
 }else if(mode==='ci'){
  if(process.env.PR_TITLE&&!validMessage(process.env.PR_TITLE))fail('PR 제목이 Conventional Commits 형식이 아닙니다.');
  if(process.env.PR_BRANCH&&!validBranch(process.env.PR_BRANCH))fail('PR 브랜치 이름이 작업 브랜치 형식이 아닙니다.');
 }else if(mode!=='read')fail('알 수 없는 Git 검사 모드');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main(process.argv[2],process.argv[3]);}catch(e){fail('Git 정책 확인 실패: '+e.message);}}

# Git 작업 규칙 · car-mechanics-learning

Git 명령을 실행하기 전에 이 문서를 확인한다. 자동화 에이전트도 동일하게 적용한다.

## 브랜치: GitHub Flow

- `main`은 실행 가능한 기준 브랜치다. 평소에는 직접 커밋·푸시하지 않고 PR로 합친다.
- 작업마다 최신 `main`에서 짧은 브랜치를 만든다. 별도 `develop`은 두지 않는다.
- 이름은 `<type>/<설명>`: 소문자 영문·숫자·하이픈을 사용한다.
- type: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`, `hotfix`.
- 예: `feat/engine-assembly`, `fix/42-hidden-hints`, `docs/git-workflow`.
- 한 브랜치와 PR은 한 목적을 다룬다. PR은 `main`으로 보내고 Squash merge 후 브랜치를 삭제한다.
- 첫 연결만 예외: 아직 커밋이 없는 `main`에서 최초 커밋 1개를 만들고, 비어 있는 원격의 `main`을 처음 생성할 수 있다. 이후에는 PR을 사용한다.

## 커밋: Conventional Commits

형식: `type(scope): 설명`. scope는 생략 가능하며, 제목은 72자 이하로 작성한다.

```text
feat(assembly): 엔진 조립 검사 기록 추가
fix(engine): 선택 시 정답 위치 노출 수정
docs: Git 작업 규칙 정리
chore: 프로젝트 최초 등록
```

- 기능은 `feat`, 오류 수정은 `fix`, 문서는 `docs`, 동작 변화 없는 정리는 `refactor`를 쓴다.
- 검증은 `test`, 성능은 `perf`, 도구 설정은 `chore`, CI는 `ci`, 빌드는 `build`, 되돌리기는 `revert`를 쓴다.
- scope 예: `engine`, `assembly`, `questions`, `drivetrain`, `ui`, `repo`. 설명은 한국어도 가능하다.
- 호환성 파괴 변경은 `feat(storage)!: ...`처럼 `!`와 본문의 `BREAKING CHANGE: ...`로 설명한다.
- 한 커밋에는 한 가지 의미 있는 변경을 담는다. 관련 없는 수정·자동 생성 파일을 섞지 않는다.
- 필요하면 본문에 변경 이유·검증 내용·`Closes #번호`를 적는다. PR 제목도 같은 형식을 쓴다.

## 작성자: 사용자 계정만 사용

- Author와 Committer는 모두 `.git-author.json`의 `EunDuk2` 계정으로 기록한다. 이 파일에는 GitHub 비공개 커밋 이메일만 보관한다.
- 에이전트·봇을 작성자나 공동 작성자로 추가하지 않는다. `Co-authored-by:` 및 `Generated with/by ...` 같은 자동 생성 표기를 커밋 메시지에 넣지 않는다.
- 저장소 로컬 `user.name` / `user.email`을 사용한다. 다른 계정의 작성자 옵션이나 환경 변수로 바꾸지 않는다.
- commit 훅은 실제 Author·Committer와 메시지를 확인하고, push 훅은 전송할 커밋의 작성자와 본문을 다시 확인한다.
- 사용자 계정 변경은 사용자가 요청한 경우에만 정책 파일과 로컬 Git 설정을 함께 변경한다.

## 일상 작업 순서

터미널에서는 프로젝트용 `git` 함수 또는 `./scripts/git`을 사용한다. 자동화·비대화형 셸은 반드시 `./scripts/git`을 사용한다. `npm run git -- <인자>`도 같다.

```sh
./scripts/git status --short --branch
./scripts/git switch main
./scripts/git pull --ff-only origin main
./scripts/git switch -c feat/engine-assembly
# 구현하고 변경에 필요한 검증 실행
./scripts/git diff
./scripts/git add src/assembly.js
./scripts/git diff --cached
./scripts/git commit -m "feat(assembly): 조립 동작 추가"
./scripts/git push -u origin feat/engine-assembly
```

작업 트리가 깨끗한지 먼저 확인한다. 다른 사람의 변경을 덮어쓰지 않는다. 이미 공유한 브랜치는 원칙적으로 rebase하지 않는다. 원격과 갈라졌다면 원인을 확인하고 작업 브랜치에 `origin/main`을 merge한다. 공유 이력 수정·강제 푸시·원격 삭제·파괴적인 초기화는 사용자에게 해당 작업이 명시적으로 승인된 범위에서만 한다. 훅 오류는 원인을 수정하며 `--no-verify`나 훅 경로 변경으로 우회하지 않는다.

## 검증과 PR

- PR에는 문제와 변경 후 동작, 검증 방법·결과를 적는다. 화면 변경은 필요한 스크린샷을 첨부한다.
- 기본 검증: `npm run build`. Git 도구 변경: `node scripts/test-git-workflow.mjs` (npm 설정 등록 후 `npm run test:git-workflow`도 가능).
- 조립 변경은 `node artifacts/check.mjs --assembly-only`, 힌트 변경은 `--assembly-hints-only`, 질문 변경은 `--questions-only`, 동력 전달 변경은 `--power-only` 등 영향 범위를 검증한다. 이 브라우저 검증들은 현재 로컬 Chrome과 개발 서버를 사용한다.
- 저장 형식 변경 시 기존 localStorage 기록의 호환성을 확인한다.
- `node_modules/`, `dist/`, 개인 환경 파일·비밀값·학습 기록 내보내기 파일은 커밋하지 않는다.
- 대형 3D 자산을 추가·교체할 때는 기존 출처·라이선스 기록도 함께 확인한다.

## 문서 확인 장치와 훅

- `scripts/git`: Git 실행 **전에 이 문서 전문을 stderr로 출력**한다. 문서가 없으면 실행하지 않는다. Git의 stdout과 종료 코드는 유지한다.
- `scripts/git-shell.zsh`: 프로젝트 안에서 일반 `git` 명령을 위 래퍼로 연결한다. 새 터미널부터 적용되며, 열린 터미널은 `source scripts/git-shell.zsh`를 한 번 실행한다. 다른 프로젝트에는 적용하지 않는다.
- `.githooks/`: commit·push·rebase·merge 전에 문서를 표시한다. 커밋 브랜치·메시지 형식, staged 공백 오류, `main` 직접 푸시를 검사한다.
- `.codex/hooks.json`: Git 관련 도구 실행 전에 문서 전문을 모델 문맥에 넣는다. 일반 Git 셸 호출은 래퍼 사용을 요구한다. Codex에서 새 프로젝트를 열고 `/hooks`로 이 정의를 검토·신뢰해야 실행된다. 신뢰 설정을 자동으로 우회하지 않는다.
- `AGENTS.md`: status·diff·log 같은 조회까지 문서 확인과 래퍼 사용을 요구한다.
- 새 clone에서는 `npm ci`의 prepare가 로컬 훅을 연결한다. 수동 연결은 `npm run setup:git`이며, 아직 저장소가 없으면 `main`으로 로컬 초기화한다. 원격 생성·등록·커밋·푸시는 하지 않는다.

Git에는 모든 명령의 실행 전 공통 훅이 없다. 따라서 일반 터미널은 셸 함수, 자동화는 래퍼, Codex는 사전 도구 훅으로 보완한다. `/usr/bin/git` 직접 실행, 다른 셸, GUI의 조회, 임의 프로그램 내부 호출까지 시스템 전체에서 강제하는 보안 경계는 아니다. 사람의 실제 이해 여부도 자동 판정하지 않는다. GitHub에서의 강제 규칙은 아래 원격 보호 설정으로 완성한다.

## 초기 변경사항 분리

첫 커밋은 Git 문서·훅·작성자 정책만 등록한다. 다음은 앱 실행 기반, 부품 모델·학습, 질문 게시판, 조립 실습처럼 목적별로 나눈다. 각 커밋에 필요한 의존 파일을 함께 포함한다. 앱 실행 파일과 package.json을 등록하는 커밋에서 npm 스크립트와 빌드 CI도 함께 등록한다. 첫 Git 설정 커밋은 Node.js로 `node scripts/setup-git.mjs` / `node scripts/test-git-workflow.mjs`를 직접 실행해 검증할 수 있다.

## GitHub 연결 후 설정

1. 기본 브랜치를 `main`으로 정한다. 기존 로컬 이력을 보낼 경우 README를 생성하지 않은 빈 원격으로 시작한다.
2. 원격 URL을 확인한 뒤 `./scripts/git remote add origin <URL>`로 연결한다. 최초 커밋·푸시는 작업자가 별도로 수행한다.
3. 초기 등록 후 `main` 보호 규칙: PR 필수, `build`와 `git-policy` 검사 필수, force push·삭제 금지, 대화 해결 필수. 리뷰어가 있으면 승인 1개를 요구한다. 1인 프로젝트는 자신이 승인할 수 없으므로 타인 승인 조건을 강제로 켜지 않는다.
4. Squash merge를 사용하고 머지 후 작업 브랜치 자동 삭제를 켠다. PR 제목을 squash 커밋 제목으로 사용한다.
5. 이 설정은 아직 원격에 적용되지 않았다. 저장소 생성 후 GitHub 요금제·저장소 공개 범위에서 지원되는 보호 기능을 확인한다.

## 근거

- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [Git hooks](https://git-scm.com/docs/githooks)
- [Codex hooks와 신뢰 검토](https://learn.chatgpt.com/docs/hooks)

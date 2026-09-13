"""Inject repository Git policy and require the documented shell wrapper."""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
try:
    event = json.load(sys.stdin)
except (ValueError, TypeError):
    print('Git policy hook: invalid event input', file=sys.stderr)
    sys.exit(2)

name = str(event.get('tool_name', ''))
args = event.get('tool_input', {})
command = str(args.get('command', args.get('cmd', ''))) if isinstance(args, dict) else str(args)
# Matches plain Git, absolute binaries, and wrappers; never executes input.
git_pattern = r'(?<![\w-])(?:[^\s"\'`;()]+/)?git(?=[\s"\'`;)\]]|$)'
is_git = bool(re.search(git_pattern, command)) or 'github' in name.lower()
if not is_git:
    print('{}')
    sys.exit(0)
try:
    policy = (root / 'GIT_WORKFLOW.md').read_text(encoding='utf-8')
    if not policy.strip():
        raise ValueError('empty document')
except (OSError, ValueError) as error:
    print('GIT_WORKFLOW.md를 읽을 수 없어 Git 작업을 중단합니다: ' + str(error), file=sys.stderr)
    sys.exit(2)

output = {'hookEventName': 'PreToolUse', 'additionalContext': policy}
# A narrow convenience check, not a parser/security boundary for arbitrary code.
remaining = re.sub(r'(?<![\w-])(?:[^\s"\'`;()]+/)?scripts/git(?=[\s"\'`;)\]]|$)', 'POLICY_WRAPPER', command)
remaining = re.sub(r'\bnpm\s+run\s+git\s+--', 'POLICY_WRAPPER', remaining)
if re.search(git_pattern, remaining) and 'github' not in name.lower():
    output['permissionDecision'] = 'deny'
    output['permissionDecisionReason'] = 'GIT_WORKFLOW.md 확인 후 ./scripts/git 또는 npm run git -- 로 실행하세요. 조회 명령도 동일합니다.'
print(json.dumps({'hookSpecificOutput': output}, ensure_ascii=False))

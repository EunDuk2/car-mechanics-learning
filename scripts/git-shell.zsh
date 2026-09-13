# Source once per interactive shell. Only this project's working tree is wrapped.
function git() {
  local car_git_dir="$PWD"
  while [[ "$car_git_dir" != / ]]; do
    if [[ -f "$car_git_dir/.car-git-workflow" ]]; then
      if [[ ! -x "$car_git_dir/scripts/git" ]]; then
        print -u2 'Git 중단: 프로젝트 Git 래퍼를 실행할 수 없습니다.'
        return 1
      fi
      "$car_git_dir/scripts/git" "$@"
      return $?
    fi
    car_git_dir="${car_git_dir:h}"
  done
  command git "$@"
}

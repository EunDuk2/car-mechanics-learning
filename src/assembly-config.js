export const ASSEMBLY_LABS = {
  engine: {
    name: '엔진',
    key: 'auto-atlas.engine-assembly.v1',
    label: 'ENGINE ASSEMBLY LAB',
    bench: 'YOUR ENGINE / BUILD SPACE',
    initialPart: 'block',
    search: '피스톤, 점화 플러그…',
    scope: '실제 정비 조립 순서·체결 토크·공차·타이밍 위상은 검사하지 않습니다.',
    note: '예: 2번 피스톤의 오일 링을 빠뜨렸다. 압축 링과 역할을 다시 확인하기.',
  },
  suspension: {
    name: '전륜·제동',
    key: 'auto-atlas.suspension-assembly.v1',
    label: 'FRONT SUSPENSION & BRAKE ASSEMBLY LAB',
    bench: 'FRONT SUSPENSION & BRAKES / BUILD SPACE',
    initialPart: 'knuckle',
    search: '브레이크 패드, 코일 스프링…',
    scope: '한쪽 전륜의 일반 맥퍼슨 구조 참고 모델입니다. 실제 정비 순서·체결 토크·스프링 압축·브레이크 유압·휠 얼라인먼트는 검사하지 않습니다.',
    note: '예: 안쪽과 바깥쪽 브레이크 패드 자리를 바꿨다. 디스크와 캘리퍼의 연결 관계 복습하기.',
  },
};

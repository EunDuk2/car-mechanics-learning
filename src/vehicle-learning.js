export function vehicleLearning(d){let why='',together='',route='bay',label='엔진룸 계통 학습';const id=d.id;
 if(id.startsWith('wheel-')){why='타이어는 노면과 접촉해 구동·제동·횡방향 힘을 전달합니다.';together='휠·허브·베어링·구동축이 회전을 연결하고 서스펜션이 위치와 접지를 돕습니다.';route='drivetrain';label='구동축·타이어·조향 학습';}
 else if(id.startsWith('brake-')){why='회전하는 디스크와 패드의 마찰로 운동 에너지를 열로 바꿉니다.';together='페달·마스터 실린더·유압 모듈·캘리퍼가 함께 제동력을 전달합니다. 전륜 참고 모델로 기본 원리를 학습합니다.';route='suspension';label='패드·피스톤 제동 학습';}
 else if(id==='steering'){why='운전자가 원하는 방향을 회전 입력으로 전달합니다.';together='컬럼·피니언·랙·타이로드·너클을 거쳐 바퀴 방향이 바뀝니다.';route='drivetrain';label='랙·타이로드 조향 학습';}
 else if(id==='console'){why='운전자가 변속 등 차량 기능을 조작할 접점을 제공합니다.';together='변속 조작은 기계 연결 또는 전자 제어를 통해 구동계의 연결 상태를 바꿉니다.';route='drivetrain';label='클러치·기어 학습';}
 else if(id==='engine'){why='연료의 에너지를 회전력으로 바꾸고 필요한 보조 계통을 연결합니다.';together='흡기·연료·점화·냉각·윤활·제어·배기가 함께 작동해야 안정적으로 출력을 냅니다.';}
 else if(id==='engine-cover'){why='엔진 상부를 보호하고 소음·외관 관리에 관여합니다.';together='커버와 엔진 본체의 역할은 다릅니다. 압력을 받는 헤드와 밸브 구동은 내부 학습에서 볼 수 있습니다.';route='engine';label='엔진 내부 학습';}
 else if(id==='exhaust'){why='연소한 가스를 차량 외부로 배출하는 경로의 끝입니다.';together='매니폴드·터빈·촉매·배관·소음기를 거쳐 배출됩니다. 완성차 원본에는 끝단만 있습니다.';}
 else if(['headlights','taillights'].includes(id)){why=id==='headlights'?'운전자의 전방 시야와 차량의 존재를 알리는 데 쓰입니다.':'후방에 위치·제동 등의 정보를 알립니다.';together='전원·퓨즈·스위치·제어기와 광학 장치가 함께 작동합니다. 배광과 램프 회로 자체는 이 표면 모델에 없습니다.';}
 else if(['spoiler','sills','front-bumper','rear-bumper'].includes(id)){why='차체 주변 공기 흐름·외관·주변 장치의 보호와 배치를 구성합니다.';together='범퍼 외피만으로 충돌 구조 전체를 알 수는 없습니다. 전면 개구부는 열교환기와 공기 유도 계통의 배치에도 관계합니다.';}
 else if(id.startsWith('door-')||['hood','trunk'].includes(id)){why='필요할 때 탑승·정비·적재 공간에 접근하고 닫힌 상태에서 외부 환경을 차단합니다.';together='힌지·래치·씰·차체 개구부가 함께 움직임과 고정을 담당합니다. 열림 동작은 기존 화면의 체크박스로 볼 수 있습니다.';}
 else if(['seat-left','seat-right','rear-seats'].includes(id)){why='탑승자의 자세와 하중을 지지하는 공간을 제공합니다.';together='쿠션·프레임·차체 장착부·안전벨트 등이 함께 작용합니다. 이 모델은 표면이며 충돌·안전장치 작동 모델이 아닙니다.';}
 else if(id==='dashboard'){why='속도·경고·차량 상태를 운전자에게 전달하고 조작부를 배치합니다.';together='센서·제어기·디스플레이가 상태 정보를 연결하고 송풍구는 실내 공조와 연결됩니다.';}
 else{why='차량의 공간·경계·주변 부품 위치를 구성하고 외부 환경과 탑승 공간을 나눕니다.';together='차체 골격·부품 장착부·유리·씰·트림과 함께 기능합니다. 원본 표면만으로 강성·하중 경로를 해석할 수는 없습니다.';}
 return `<div class="detail-box"><b>왜 필요한가요?</b><p>${why}</p><b>함께 작동하는 구성</b><p>${together}</p><a class="bay-detail-link" href="/mechanics.html?system=${route}">${label} →</a></div>`;
}

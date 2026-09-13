export const MODEL_SOURCE='https://sketchfab.com/3d-models/2024-hyundai-elantra-n-4ba1b1b0eb844e318cc708ada1f2f51f';
export const OFFICIAL_SOURCE='https://www.hyundainews.com/models/hyundai-elantra-2024-elantra_n';
const items=[
['body','차체·펜더','Body & fenders','외장',[0,.55,0],'차량 외곽의 차체 표면, 펜더와 필러입니다. 원본 모델의 곡면과 패널 라인을 유지했습니다.','외장 표면 모델이며 내부 보강재와 용접 구조는 완전하게 포함되지 않습니다.'],
['hood','보닛','Hood','외장',[.65,1.65,0],'엔진룸 위를 덮는 보닛입니다. 원본의 바깥 곡면과 안쪽 형상을 분리해 관찰할 수 있습니다.','보닛 열기는 시각적 힌지 근사 동작입니다.'],
['roof','루프·천장','Roof & headliner','외장',[0,2.1,0],'차체 지붕과 실내 천장 라이너입니다. 분리하면 좌석과 대시보드를 위에서 볼 수 있습니다.','분해도는 구조 설명을 위한 이동이며 실제 정비 분리 순서가 아닙니다.'],
['trunk','트렁크 리드','Trunk lid','외장',[-.7,1.25,0],'트렁크의 덮개와 부속 표면입니다. 후방 램프와 스포일러를 별도로 살펴볼 수 있습니다.','원본 메시 경계와 위치를 기준으로 묶은 시각적 그룹입니다.'],
['spoiler','리어 스포일러','Rear spoiler','외장',[-1.1,1.65,0],'N 모델의 후방 윙 스포일러입니다. 날개와 지지부의 실제 모델링 형상을 보존했습니다.','공력 성능을 계산하는 해석 모델은 아닙니다.'],
['door-fl','운전석 앞 도어','Front left door','외장',[.2,.25,-1.25],'도어 패널, 안쪽 트림, 창문과 미러 주변 형상을 묶었습니다. 도어 열기로 탑승 공간을 볼 수 있습니다.','좌우는 차량에 탑승해 전방을 바라보는 기준입니다. 도어 그룹 분류에는 공간 기준 추정이 포함됩니다.'],
['door-fr','조수석 앞 도어','Front right door','외장',[.2,.25,1.25],'조수석 도어의 외판과 실내 트림, 유리를 확인할 수 있습니다.','좌우는 탑승자 기준입니다. 일부 연결 트림은 차체 그룹에 남아 있습니다.'],
['door-rl','운전석 뒤 도어','Rear left door','외장',[-.3,.35,-1.3],'뒷좌석으로 연결되는 도어와 창문, 손잡이 및 도어 트림입니다.','시각적 부품 그룹이며 제조사의 부품 번호 단위가 아닙니다.'],
['door-rr','조수석 뒤 도어','Rear right door','외장',[-.3,.35,1.3],'뒷좌석 조수석 쪽 도어와 창문, 손잡이 및 트림입니다.','시각적 부품 그룹이며 제조사의 부품 번호 단위가 아닙니다.'],
['glass','앞·뒤 유리','Front & rear glazing','외장',[0,1.3,0],'앞유리와 뒷유리입니다. 원본의 곡률, 프레임 및 유리 재질을 유지합니다.','측면 창문은 각 도어에 포함됩니다.'],
['front-bumper','앞 범퍼·그릴','Front fascia & grille','외장',[1.6,.15,0],'전면 범퍼, 그릴과 하단 스플리터입니다. 2024 N 외형 모델의 촘촘한 그릴과 공기 통로 형상을 관찰하세요.','냉각 덕트 내부 전체가 모델링된 것은 아닙니다.'],
['rear-bumper','뒤 범퍼·디퓨저','Rear fascia & diffuser','외장',[-1.5,.15,0],'후면 범퍼와 하단 디퓨저입니다. 배기구 끝단은 별도 그룹으로 구성했습니다.','충돌 흡수재와 내부 빔 전체는 포함되지 않습니다.'],
['sills','사이드 스커트','Side skirts','외장',[0,-.05,0],'차량 측면 하단의 스커트와 N 특유의 색상 포인트입니다.','원본 시각 모델을 사용했습니다.'],
['headlights','헤드램프','Headlamp assemblies','외장',[1.25,.7,0],'전면 램프의 렌즈와 내부 발광부를 함께 살펴볼 수 있습니다.','광학 배광을 재현하는 모델은 아닙니다.'],
['taillights','리어 램프','Rear light assemblies','외장',[-1.25,.65,0],'차량 후방 램프의 렌즈와 장식 형상입니다.','표면과 재질을 위한 모델이며 전기 배선은 포함되지 않습니다.'],
['engine','엔진룸·보조장치','Engine bay & ancillaries','동력',[1.15,.65,0],'다운로드 원본에 실제로 들어 있는 엔진룸 메시입니다. 호스, 커넥터, 탱크와 상부 장치들의 표면 형상이 포함돼 있습니다.','엔진 내부, 피스톤·크랭크축, 변속기 내부는 원본에 없습니다. 아래쪽 일부는 외관용 폐쇄 표면입니다.'],
['engine-cover','엔진 상부 커버','Upper engine cover','동력',[1.15,1.35,0],'엔진 상부의 커버와 인접한 작은 형상을 원본 엔진룸에서 분리했습니다.','커버 아래의 완전한 실린더 블록을 의미하지 않습니다. 명칭 분류는 형상·위치 기준입니다.'],
['underbody','하부 표면·휠하우스','Underbody surfaces','차체',[0,-.02,0],'원본에 포함된 하부 표면과 휠하우스, 일부 내측 패널입니다.','충돌 해석용 차체 골격이나 완전한 서스펜션 CAD가 아닙니다.'],
['cabin','실내 바닥·트림','Cabin floor & trim','실내',[-.2,.3,0],'탑승 공간 바닥과 나머지 실내 트림을 표현한 원본 메시입니다.','여러 부품이 연결된 원본 형상은 하나의 그룹에 남겨 두었습니다.'],
['dashboard','대시보드·디스플레이','Dashboard & displays','실내',[.5,1.15,0],'계기판, 대시보드, 디스플레이와 송풍구의 상세 표면 모델입니다.','뒤쪽 HVAC 덕트와 내부 전장 모듈은 포함되지 않습니다.'],
['steering','스티어링 휠','Steering wheel','실내',[.4,1.4,-.85],'스티어링 휠의 림과 버튼 주변을 별도로 관찰할 수 있습니다.','전체 조향 랙과 조향축을 재현한 모델은 아닙니다.'],
['seat-left','운전석 시트','Driver seat','실내',[-.3,1.0,-.85],'N 스포츠 시트의 등받이, 쿠션과 인접한 조절 부품의 표면 모델입니다.','내부 프레임·에어백·폼 단면은 포함되지 않습니다.'],
['seat-right','조수석 시트','Passenger seat','실내',[-.3,1.0,.85],'조수석 스포츠 시트의 쿠션, 등받이와 관련 트림입니다.','부품 분류는 원본의 위치와 메시 연결 관계에 근거합니다.'],
['rear-seats','뒷좌석·후방 트림','Rear seating & trim','실내',[-.9,.8,0],'뒷좌석과 주변 후방 트림을 원본의 표면 형상으로 살펴볼 수 있습니다.','연료 탱크와 시트 내부 구조는 별도로 모델링되어 있지 않습니다.'],
['console','센터 콘솔','Center console','실내',[.1,1.1,.2],'시트 사이의 센터 콘솔, 변속 조작부와 작은 실내 부품들입니다.','이 외형만으로 실제 변속기의 내부 형식을 확인할 수는 없습니다.'],
['exhaust','배기구 끝단','Exhaust outlets','동력',[-1.45,.2,0],'원본에 포함된 좌우 배기구 끝단입니다.','차체 아래의 전체 배기 파이프·촉매·소음기 모델은 포함되지 않습니다.'],
...['fl','fr','rl','rr'].map((p,i)=>['wheel-'+p,['앞 왼쪽','앞 오른쪽','뒤 왼쪽','뒤 오른쪽'][i]+' 휠·타이어','Wheel & tire '+p.toUpperCase(),'휠·제동',[i<2?.3:-.3,0,i%2?1.7:-1.7],'원본의 타이어 트레드, 휠 스포크, 허브와 체결부를 확대해 보세요.','완성 휠 어셈블리를 분리했습니다. 타이어 내부 코드와 고무 단면은 없습니다.']),
...['fl','fr','rl','rr'].map((p,i)=>['brake-'+p,['앞 왼쪽','앞 오른쪽','뒤 왼쪽','뒤 오른쪽'][i]+' 브레이크','Brake '+p.toUpperCase(),'휠·제동',[i<2?.3:-.3,.12,i%2?.95:-.95],'다운로드 원본의 캘리퍼와 휠 메시에서 분리한 디스크 표면입니다. 휠을 숨기면 자세히 보입니다.','유압 회로, 내부 피스톤과 패드의 완전한 구조는 포함되지 않습니다.'])
];
const colors={'외장':'#8cb3ca','동력':'#dfa062','차체':'#8c9ca7','실내':'#ad9cca','휠·제동':'#5bb8b3'};
export const catalog=items.map(([id,name,en,category,offset,desc,limit])=>({id,name,en,category,offset,desc,limit,color:colors[category],source:MODEL_SOURCE}));
export function classify(name,c){
 const {x,y,z}=c.center,s=c.size,b=c.bounds,az=Math.abs(z);const side=z<0?'l':'r';
 if(/Wheel_1A_/.test(name)){const corner=(x>0?'f':'r')+side;return s.x>.3&&s.x<.42&&s.y>.3&&s.y<.42&&s.z<.07?'brake-'+corner:'wheel-'+corner;}
 if(/Calliper/.test(name))return 'brake-'+(x>0?'f':'r')+side;
 if(/Engine_Engine/.test(name)){
  if(x<.85)return x< -1.4?'trunk':'body';
  if(b.min.x>1.35&&b.max.x<1.82&&b.min.z>-.12&&b.max.z<.47&&y>.765&&s.y<.16)return 'engine-cover';
  return 'engine';
 }
 if(/Grille[348]_/.test(name))return 'engine';
 if(/Light_|red_glass/.test(name))return x>0?'headlights':'taillights';
 if(/Window/.test(name)){
  if(x>1.4)return 'headlights';if(x< -1.9)return 'taillights';
  if(az>.59&&s.z<.5)return 'door-'+(x>-.27?'f':'r')+side;
  return 'glass';
 }
 if(/Grille[12]_/.test(name))return 'front-bumper';
 if(/Interior|SeatBelt|Grille[5679]_/.test(name)){
  if(y>1.24&&s.z>.9)return 'roof';
  if(az>.63&&x> -1.35&&x<.95&&s.x<1.4&&s.z<.4)return 'door-'+(x>-.27?'f':'r')+side;
  if(x>.31&&x<.55&&y>.71&&y<1.08&&z<-.2&&z>-.54&&s.x<.26&&s.z<.34)return 'steering';
  if(x>.46&&y>.52)return 'dashboard';
  if(x<.44&&x>-.53&&az>.1&&az<.64&&b.max.x<.45&&b.min.y>.27)return z<0?'seat-left':'seat-right';
  if(x<-.65&&y>.4&&y<1.23)return 'rear-seats';
  if(az<.19&&x<.5&&x>-.45&&y<.8&&y>.35)return 'console';
  return 'cabin';
 }
 if(/Base_Base/.test(name)){if(y>1&&s.z>1)return 'glass';if(x>1.6)return 'headlights';if(x< -1.9)return 'taillights';return 'underbody';}
 if(x< -2.12&&y<.39&&az>.5&&s.z<.3)return 'exhaust';
 if(y>1.30&&x> -1.3&&x<.5)return 'roof';
 if(x< -2.02&&y>1.01)return 'spoiler';
 if(b.min.x>.99&&b.max.x<2.16&&y>.775&&s.y<.35&&s.z>.95)return 'hood';
 if(x< -1.85&&y>.73&&s.x<.65)return 'trunk';
 if(x>1.89&&y<.68)return 'front-bumper';
 if(x< -1.73&&y<.73)return 'rear-bumper';
 if(s.x>1.5&&az>.75&&y<.28)return 'sills';
 if(az>.6&&x> -1.32&&x<.94&&s.x<1.42&&s.z<.55&&y>.27)return 'door-'+(x>-.27?'f':'r')+side;
 if(x>1.08&&x<1.94&&az<.74&&s.x<.8&&y>.65&&y<.94)return 'engine';
 return 'body';
}

import {CURRICULUM} from './systems-curriculum.js';
// Every existing peripheral part is assigned an explicit functional consequence and links.
const bayRows=`
engine-assembly|연소 압력을 회전 출력으로 바꾸지 못하면 구동계에 동력을 공급할 수 없습니다.|transmission intake-manifold exhaust-manifold
mount-right mount-left mount-lower|파워트레인의 위치 유지와 진동 절연이 나빠집니다.|engine-assembly transmission subframe
snorkel airbox-base airbox-lid|흡기 유로의 지지·밀봉이 나빠져 이물질 유입이나 흡입 저항 문제가 생길 수 있습니다.|air-filter turbo-inlet
 air-filter|오염 입자가 엔진으로 들어가거나 막힘으로 공기 공급이 제한됩니다.|airbox-base airbox-lid turbo-inlet
turbo-inlet|압축기 입구의 공기 공급과 밀봉이 나빠집니다.|air-filter compressor
compressor|공기를 모아 압축·토출하는 유로가 유지되지 않습니다.|turbo-shaft turbine hot-charge
turbo-shaft|배기의 에너지를 압축기로 전달하지 못합니다.|turbine compressor turbo-oil
turbine|배기가 터빈 휠을 효율적으로 구동하기 어렵습니다.|exhaust-manifold turbo-shaft downpipe
wastegate|터빈으로 가는 배기 에너지를 의도대로 조절하기 어렵습니다.|turbine ecu map
bypass|스로틀이 닫힐 때 과급 공기의 재순환 제어가 나빠질 수 있습니다.|compressor throttle turbo-inlet
exhaust-manifold|배기 수집과 터빈으로의 에너지 전달에 누설·손실이 생길 수 있습니다.|engine-assembly turbine
heat-shield|복사·대류 열이 주변 배선과 부품에 더 전달될 수 있습니다.|turbine exhaust-manifold harness
downpipe|배기 전달의 누설·막힘이 생겨 배압과 주변 열환경이 달라질 수 있습니다.|turbine catalyst
catalyst|배출가스 정화 성능을 잃을 수 있습니다. 촉매가 엔진의 동력을 만드는 것은 아닙니다.|downpipe oxygen
oxygen|배기 조성에 대한 피드백 정보가 부정확해질 수 있습니다.|catalyst ecu
intercooler|압축 공기의 온도를 충분히 낮추기 어렵습니다.|compressor hot-charge cold-charge
hot-charge cold-charge|과급 공기 누설·저항으로 실린더에 공급되는 공기가 달라질 수 있습니다.|compressor intercooler throttle
throttle|운전자 요구와 제어 명령에 따른 공기량 조절이 어려워집니다.|cold-charge intake-manifold ecu
intake-manifold|각 실린더에 공기를 분배하는 유로와 밀봉이 나빠집니다.|throttle engine-assembly map
map|제어기가 흡기 상태를 올바르게 판단하기 어려워집니다.|intake-manifold ecu
radiator|엔진에서 온 열을 외기로 충분히 방출하기 어렵습니다.|upper-coolant lower-coolant cooling-fans
fan-shroud|팬의 공기가 열교환기를 통과하도록 유도하는 효과가 줄어듭니다.|radiator cooling-fans
cooling-fans|정차·저속에서 방열에 필요한 풍량이 부족할 수 있습니다.|radiator fan-shroud ecu
coolant-tank overflow-hose|냉각수 체적 변화의 수용과 회수·잔량 관리가 나빠질 수 있습니다.|radiator upper-coolant
upper-coolant lower-coolant|냉각수 누설·막힘으로 엔진과 라디에이터 사이 순환이 나빠집니다.|water-pump radiator thermostat
water-pump|냉각수의 강제 순환이 부족해집니다.|engine-assembly thermostat lower-coolant
thermostat|냉각수 경로를 온도에 맞게 조절하지 못해 예열·냉각이 나빠질 수 있습니다.|water-pump radiator coolant-sensor
heater-hoses|실내 히터로의 열 전달과 냉각수 밀봉에 문제가 생길 수 있습니다.|engine-assembly water-pump
oil-filter|윤활유 속 이물질이 마찰부에 도달하거나 공급 저항이 커질 수 있습니다.|engine-assembly oil-cooler
oil-cooler|윤활유의 열 관리가 나빠질 수 있습니다.|oil-filter engine-assembly
dipstick|오일량을 확인할 수단을 잃습니다. 게이지 자체가 오일을 순환시키지는 않습니다.|engine-assembly oil-filter
turbo-oil|터보 베어링의 윤활·열 관리와 오일 회수가 나빠집니다.|turbo-shaft oil-filter
turbo-coolant|터보 센터 하우징의 열 관리가 나빠질 수 있습니다.|turbo-shaft water-pump
hpfp|직분사에 필요한 고압 연료를 공급하기 어렵습니다.|fuel-supply fuel-line fuel-rail
fuel-line fuel-supply|필요한 연료 유량과 압력 전달이 누설·저항으로 나빠집니다.|hpfp fuel-rail
fuel-rail|각 인젝터로 연료를 분배하고 압력을 유지하기 어렵습니다.|hpfp injector-0 injector-1 injector-2 injector-3
injector-0 injector-1 injector-2 injector-3|분사량·시기·분무가 나빠져 해당 실린더의 연소가 불안정해질 수 있습니다.|fuel-rail ecu engine-assembly
ignition-coil-0 ignition-coil-1 ignition-coil-2 ignition-coil-3|점화 플러그에 필요한 고전압을 만들기 어려워집니다.|battery ecu engine-assembly
purge|연료 증발가스를 회수·제어하는 기능이 나빠질 수 있습니다.|intake-manifold ecu
pcv|크랭크케이스 가스의 배출·회수와 압력 관리가 나빠집니다.|engine-assembly intake-manifold
battery|정지 상태에서 시동·제어기에 필요한 전력을 공급하기 어렵습니다.|starter alternator battery-cable
battery-tray|배터리의 고정과 진동 지지가 나빠집니다.|battery subframe
battery-cable|전원 공급·접지 경로의 저항이나 단선으로 전장 기능이 나빠집니다.|battery fuse-base starter
fuse-base|과전류 보호·전력 분배 기능이 나빠집니다.|battery-cable ecu harness
fuse-lid|퓨즈·릴레이가 수분과 이물질에 더 노출될 수 있습니다.|fuse-base
 ecu|센서 정보를 바탕으로 연료·점화·과급을 조율하는 기능을 잃습니다.|harness crank-sensor injector-0 ignition-coil-0
harness|센서 정보와 제어 명령·전력이 필요한 곳에 전달되지 않을 수 있습니다.|ecu crank-sensor ignition-coil-0
alternator|엔진 운전 중 충전·전력 공급이 부족할 수 있습니다.|belt battery
starter|엔진이 스스로 연소를 시작하기 위한 초기 회전을 만들기 어렵습니다.|battery engine-assembly
transmission|회전 속도·토크를 주행 조건에 맞춰 전달하기 어렵습니다.|engine-assembly shaft-left shaft-right
shaft-left shaft-right|차동기어에서 휠까지 토크를 전달하지 못할 수 있습니다.|transmission
ac-compressor|냉매를 압축·순환시켜 실내 열을 옮기기 어렵습니다.|belt condenser ac-lines
belt|엔진 회전을 보조 장치로 전달하기 어렵습니다.|engine-assembly alternator ac-compressor
condenser|압축된 냉매가 외기로 열을 충분히 방출하기 어렵습니다.|ac-compressor ac-lines
ac-lines|냉매 회로의 밀봉과 장치 간 연결이 나빠집니다.|ac-compressor condenser
brake-booster|페달 조작력의 보조가 줄어들 수 있습니다.|vacuum-pump brake-master
brake-master|페달 입력을 휠 제동에 필요한 유압으로 전달하기 어렵습니다.|brake-booster brake-reservoir abs
brake-reservoir|마스터 실린더의 유체 공급·체적 보상이 나빠질 수 있습니다.|brake-master
abs|각 휠의 제동 압력을 제어하는 기능이 나빠질 수 있습니다.|brake-master ecu
washer|워셔액 저장·분사가 나빠져 시야 확보를 돕기 어렵습니다.|battery fuse-base
vacuum-pump|진공식 제동 보조 계통의 진공 공급이 부족할 수 있습니다.|brake-booster engine-assembly
crank-sensor cam-sensor|회전 위치·속도·위상 정보를 바탕으로 한 분사·점화 제어가 나빠집니다.|engine-assembly ecu harness
knock-sensor|노킹 관련 진동 정보를 얻기 어려워 점화 제어의 피드백이 나빠집니다.|engine-assembly ecu
coolant-sensor|엔진 온도에 따른 냉각·운전 제어가 나빠질 수 있습니다.|thermostat ecu cooling-fans
oil-sensor|윤활 압력 상태를 감지·알리는 정보가 부정확해질 수 있습니다.|engine-assembly ecu
cowl|실내와 엔진룸의 경계·차폐·지지 역할을 잃을 수 있습니다.|heat-shield engine-assembly
subframe|파워트레인·현가 연결의 하중 지지와 위치 유지가 나빠집니다.|mount-lower tower-r tower-l
tower-r tower-l|스트럿 상부 하중을 차체에 전달하고 위치를 유지하기 어렵습니다.|subframe
`;
const suspensionRows=`
mount|스트럿 상부의 차체 연결과 진동 절연이 나빠집니다.|mount-bearing upper-seat
mount-bearing|조향할 때 스트럿 상부의 상대 회전이 어려워집니다.|mount upper-seat knuckle
upper-seat lower-seat|스프링 끝을 지지하고 하중을 전달하기 어렵습니다.|coil isolator damper
isolator|스프링과 시트 사이 금속 접촉·소음이 늘어날 수 있습니다.|coil upper-seat
coil|차량 하중을 탄성으로 지지하고 변위를 수용하기 어렵습니다.|upper-seat lower-seat damper
boot|로드와 씰이 먼지·이물질에 더 노출됩니다.|rod seal
bump|큰 압축 변위 끝에서 충격을 완화하기 어렵습니다.|rod damper mount
 damper|내부 유체와 구조를 유지하며 감쇠 장치를 지지하기 어렵습니다.|working-tube rod piston-valve
working-tube|피스톤의 유체 제어 공간과 안내 면이 유지되지 않습니다.|piston-valve base-valve damper
rod|차체측과 내부 피스톤 사이 움직임을 전달하기 어렵습니다.|mount piston-valve seal
seal|로드 안내와 유체 밀봉이 나빠져 감쇠 성능을 잃을 수 있습니다.|rod working-tube
piston-valve|왕복할 때 유체 통과 저항으로 감쇠력을 만드는 기능이 나빠집니다.|rod working-tube base-valve
base-valve|내통과 저장 공간 사이 유체 흐름의 제어가 나빠집니다.|working-tube damper piston-valve
knuckle|현가·조향·회전 부품의 연결 위치와 하중 전달이 무너집니다.|damper ball hub-bearing tie
hub-bearing|바퀴 회전축의 하중 지지와 원활한 회전이 나빠집니다.|knuckle hub
hub|휠과 디스크를 회전축에 고정하고 토크를 전달하기 어렵습니다.|hub-bearing disc cv
 disc|패드와 마찰하며 제동 토크·방열을 제공하기 어렵습니다.|pad--1 pad-1 caliper hub
caliper|패드와 피스톤을 지지하고 디스크를 누르는 힘을 전달하기 어렵습니다.|brake-piston pad--1 pad-1
pad--1 pad-1|디스크와 마찰하여 회전을 줄이는 기능이 나빠집니다.|disc caliper brake-piston
brake-piston|유압을 패드의 누름 힘으로 바꾸기 어렵습니다.|caliper pad--1 disc
arm|차체와 너클 사이 하부 위치를 지지하기 어렵습니다.|bushing-0 bushing-1 ball
bushing-0 bushing-1|암의 제한된 회전과 진동 절연·위치 유지가 나빠집니다.|arm ball
ball|암과 너클의 상대 각도를 허용하면서 하중을 전달하기 어렵습니다.|arm knuckle
 tie|조향 입력을 너클로 전달하기 어렵습니다.|knuckle ball
endlink|좌우 현가의 상대 움직임을 스태빌라이저로 전달하기 어렵습니다.|damper arm
cv|조향·상하 운동 중 각도가 변해도 토크를 전달하는 기능이 나빠집니다.|hub knuckle
`;
function parse(rows){const map={};for(const line of rows.trim().split('\n')){const [ids,without,refs]=line.trim().split('|');for(const id of ids.trim().split(/\s+/))map[id]={without,related:refs.split(' ')};}return map;}
const maps={bay:parse(bayRows),suspension:parse(suspensionRows)};
export function systemFact(system,part,parts){if(system==='drivetrain')return part.userData.education;const entry=maps[system]?.[part.userData.id];if(!entry)return null;const refs=entry.related.filter(id=>id!==part.userData.id&&parts.some(p=>p.userData.id===id));return {why:part.userData.desc,together:refs.slice(0,2).map(id=>{const p=parts.find(p=>p.userData.id===id);return p.userData.name+': '+p.userData.desc.split('. ')[0]+'.';}).join(' '),without:entry.without,related:refs};}
export function lessonForPart(system,id){return CURRICULUM[system]?.findIndex(l=>l.ids.includes(id))??-1;}

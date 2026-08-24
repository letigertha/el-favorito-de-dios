(()=>{
'use strict';

const DIG_KEY='efd_digital_game_v19';
const DIG_VERSION=19;

const NAMES={
  1:'EL PERFECCIONISTA',2:'LA ENCANTADORA',3:'EL TRIUNFADOR',
  4:'LA ARTISTA',5:'EL INVESTIGADOR',6:'LA PREVENCIONISTA',
  7:'LA ILUSIONISTA',8:'EL PROTECTOR',9:'LA IMPERTURBABLE'
};
const VIRTUES={1:'Disciplina',2:'Empatía',3:'Adaptabilidad',4:'Sensibilidad',5:'Conocimiento',6:'Previsión',7:'Ingenio',8:'Fuerza',9:'Armonía'};
const DEFECTS={1:'Ira',2:'Orgullo',3:'Vanidad',4:'Envidia',5:'Avaricia',6:'Cobardía',7:'Gula',8:'Lujuria',9:'Pereza'};
const WINGS={1:[9,2],2:[1,3],3:[2,4],4:[3,5],5:[4,6],6:[5,7],7:[6,8],8:[7,9],9:[8,1]};
const ARROWS={1:[4,7],2:[4,8],3:[6,9],4:[1,2],5:[7,8],6:[3,9],7:[1,5],8:[2,5],9:[3,6]};
const TEMPS={
  mental:{label:'🧠 MENTAL',cls:'mental',chars:[5,6,7]},
  emotional:{label:'❤️ EMOCIONAL',cls:'emotional',chars:[2,3,4]},
  visceral:{label:'👊 VISCERAL',cls:'visceral',chars:[8,9,1]}
};

const POS={
  9:[50,6],1:[78,16],2:[92,40],3:[82,72],4:[63,91],
  5:[37,91],6:[18,72],7:[8,40],8:[22,16]
};
const OUTER=[[9,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]];
const INNER=[[1,4],[4,2],[2,8],[8,5],[5,7],[7,1],[3,6],[6,9],[9,3]];
const OUTER_TYPES=['instinct','things','choose','instinct','things','choose','instinct','things','choose'];
const INNER_TYPES=['things','choose','instinct','things','choose','instinct','things','choose','instinct'];

let modeScreen, setupScreen, digitalScreen, digOverlay;
let dig=null;
let digOverlayReturn=null;

function injectCSS(){
  const s=document.createElement('style');
  s.id='digitalBoardV19Styles';
  s.textContent=`
  .mode-hero,.dig-hero{position:relative;overflow:hidden;border:1px solid rgba(35,231,255,.28);border-radius:22px;background:radial-gradient(circle at 0% 0%,rgba(35,231,255,.12),transparent 38%),radial-gradient(circle at 100% 100%,rgba(140,82,255,.13),transparent 42%),#0a0a12;padding:20px 18px;margin-bottom:14px}
  .mode-hero:before,.dig-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--cyan),var(--violet),var(--magenta))}
  .mode-kicker,.dig-kicker{margin:0 0 7px;color:var(--cyan);font-size:.65rem;font-weight:950;letter-spacing:.17em}
  .mode-title,.dig-title{margin:0 0 8px;font-size:clamp(1.55rem,7vw,2.15rem);line-height:1;font-weight:950}
  .mode-sub,.dig-sub{margin:0;color:#c5c7d1;line-height:1.45;font-size:.9rem}
  .mode-stack{display:grid;gap:11px}
  .mode-choice{width:100%;min-height:86px;border-radius:19px;background:#0a0a11;color:#fff;text-align:left;padding:15px 16px;border:1px solid rgba(255,255,255,.12);cursor:pointer}
  .mode-choice strong{display:block;font-size:1.04rem}.mode-choice small{display:block;margin-top:5px;color:#aeb1be;font-size:.72rem;line-height:1.35}
  .mode-choice.physical{border-color:rgba(255,216,61,.42)}.mode-choice.digital{border-color:rgba(35,231,255,.55);box-shadow:0 0 25px rgba(35,231,255,.05)}
  .dig-setup-box{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.025);border-radius:18px;padding:15px;margin-bottom:11px}
  .dig-setup-box h3{margin:0 0 10px;font-size:.92rem}
  .dig-select,.dig-name-input{width:100%;height:48px;border-radius:13px;border:1px solid rgba(255,255,255,.15);background:#08080e;color:#fff;padding:0 12px;font:inherit;outline:none}
  .dig-name-grid{display:grid;gap:8px;margin-top:10px}
  .dig-start{width:100%;min-height:57px;margin-top:4px}
  .dig-topline{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
  .dig-turn{flex:1;border:1px solid rgba(255,255,255,.10);border-radius:17px;background:rgba(255,255,255,.025);padding:13px}
  .dig-turn .tiny{font-size:.62rem;color:#858999;font-weight:900;letter-spacing:.12em}.dig-turn h2{margin:4px 0 5px;font-size:1.2rem}.dig-turn p{margin:0;color:#b5b8c5;font-size:.78rem}
  .dig-temp{display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;font-size:.65rem;font-weight:950;border:1px solid rgba(255,255,255,.12)}
  .dig-temp.mental{color:#92c4ff;background:rgba(47,140,255,.08)}.dig-temp.emotional{color:#ff9ab0;background:rgba(255,64,95,.08)}.dig-temp.visceral{color:#ffe68b;background:rgba(255,216,61,.08)}
  .dig-progress{min-width:74px;border:1px solid rgba(109,255,186,.22);border-radius:17px;background:rgba(109,255,186,.045);padding:12px 10px;text-align:center}
  .dig-progress strong{display:block;font-size:1.35rem;color:var(--green)}.dig-progress small{font-size:.58rem;color:#aab0b8;font-weight:900;letter-spacing:.08em}
  .dig-board-shell{position:relative;width:100%;aspect-ratio:1;border-radius:24px;border:1px solid rgba(35,231,255,.18);background:radial-gradient(circle at 50% 45%,rgba(140,82,255,.09),transparent 43%),rgba(5,5,9,.84);overflow:hidden;box-shadow:inset 0 0 45px rgba(35,231,255,.03)}
  .dig-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
  .dig-lines line{stroke:rgba(166,176,206,.23);stroke-width:1.2}.dig-lines line.inner{stroke:rgba(140,82,255,.31);stroke-width:1.5}
  .dig-node{position:absolute;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:999px;cursor:default;z-index:2;transition:.18s ease}
  .dig-node.char{width:44px;height:44px;border:1px solid rgba(35,231,255,.42);background:#0b0d15;color:#fff;font-size:1.05rem;font-weight:950;box-shadow:0 0 18px rgba(35,231,255,.06)}
  .dig-node.action{width:31px;height:31px;border:1px solid rgba(255,255,255,.14);background:#0c0c13;font-size:.88rem}
  .dig-node.action.instinct{border-color:rgba(47,140,255,.55)}.dig-node.action.things{border-color:rgba(255,216,61,.55)}.dig-node.action.choose{border-color:rgba(255,64,95,.55)}
  .dig-node.reachable{cursor:pointer;transform:translate(-50%,-50%) scale(1.12);box-shadow:0 0 0 3px rgba(109,255,186,.14),0 0 25px rgba(109,255,186,.35);border-color:rgba(109,255,186,.9)}
  .dig-node.current{box-shadow:0 0 0 3px rgba(255,255,255,.08),0 0 24px rgba(255,255,255,.15)}
  .dig-tokens{position:absolute;left:50%;top:100%;transform:translate(-50%,3px);display:flex;gap:2px;white-space:nowrap}
  .dig-token{min-width:16px;height:16px;padding:0 4px;border-radius:999px;display:grid;place-items:center;font-size:.48rem;font-weight:950;color:#050509;background:#fff;border:1px solid rgba(0,0,0,.2)}
  .dig-controls{display:grid;grid-template-columns:1.25fr .75fr;gap:9px;margin-top:11px}
  .dig-roll{min-height:56px;border-radius:16px;border:1px solid rgba(35,231,255,.55);background:linear-gradient(90deg,rgba(35,231,255,.12),rgba(140,82,255,.12)),#0a0a11;color:#fff;font-weight:950;cursor:pointer}
  .dig-roll:disabled{opacity:.48;cursor:default}
  .dig-die{min-height:56px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);display:grid;place-items:center;font-size:1.35rem;font-weight:950}
  .dig-msg{margin:9px 2px 0;color:#b9bdca;font-size:.78rem;line-height:1.4;min-height:22px}
  .dig-tools{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}
  .dig-tool{min-height:46px;border-radius:13px;border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.025);color:#eef0f6;font-size:.69rem;font-weight:900;cursor:pointer;padding:7px}
  .dig-order{margin-top:11px;border-top:1px solid rgba(255,255,255,.08);padding-top:10px;display:flex;gap:6px;overflow:auto}
  .dig-order-chip{flex:0 0 auto;padding:6px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.10);font-size:.61rem;color:#aeb1bc}.dig-order-chip.active{color:#fff;border-color:rgba(109,255,186,.45);background:rgba(109,255,186,.06)}
  .dig-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);display:none;align-items:flex-end;justify-content:center;padding:12px}
  .dig-overlay.show{display:flex}
  .dig-modal{width:min(100%,680px);max-height:90dvh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:#090910;padding:18px;box-shadow:0 25px 80px rgba(0,0,0,.55)}
  .dig-modal-kicker{margin:0 0 6px;color:var(--cyan);font-size:.62rem;font-weight:950;letter-spacing:.15em}
  .dig-modal h2{margin:0 0 10px;font-size:1.35rem;line-height:1.1}.dig-modal p{line-height:1.48}
  .dig-private{border:1px solid rgba(255,216,61,.22);background:rgba(255,216,61,.045);border-radius:13px;padding:10px 11px;color:#fff2b5;font-size:.78rem;margin-bottom:12px}
  .dig-goal-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:11px 0}
  .dig-goal{padding:8px 4px;border-radius:11px;border:1px solid rgba(255,255,255,.10);text-align:center;font-size:.62rem;color:#9195a3}.dig-goal.done{color:#dffff0;border-color:rgba(109,255,186,.38);background:rgba(109,255,186,.06)}.dig-goal strong{display:block;font-size:.76rem;color:#fff;margin-bottom:3px}
  .dig-modal-actions{display:grid;gap:8px;margin-top:13px}.dig-modal-actions.two{grid-template-columns:1fr 1fr}
  .dig-action-btn{min-height:48px;border-radius:13px;border:1px solid rgba(35,231,255,.30);background:rgba(35,231,255,.055);color:#fff;font-weight:950;cursor:pointer;padding:10px}
  .dig-action-btn.ghost{border-color:rgba(255,255,255,.11);background:rgba(255,255,255,.025);color:#b8bbc6}
  .dig-action-btn.good{border-color:rgba(109,255,186,.38);background:rgba(109,255,186,.065);color:#dffff0}
  .dig-action-btn.bad{border-color:rgba(255,64,95,.35);background:rgba(255,64,95,.06);color:#ffd6de}
  .dig-question{font-size:1.03rem;font-weight:850;line-height:1.43;margin:8px 0 12px}
  .dig-option{display:flex;gap:10px;padding:11px;border:1px solid rgba(255,255,255,.10);border-radius:12px;margin-bottom:7px;line-height:1.4;font-size:.87rem}.dig-option.correct{border-color:rgba(109,255,186,.52);background:rgba(109,255,186,.06)}
  .dig-letter{flex:0 0 27px;height:27px;border-radius:8px;display:grid;place-items:center;background:rgba(255,255,255,.06);font-weight:950}
  .dig-answer{display:none;margin-top:10px;padding:10px;border-radius:11px;background:rgba(109,255,186,.07);border:1px solid rgba(109,255,186,.23);color:#dffff0;font-weight:900}.dig-answer.show{display:block}
  .dig-resource-row{display:grid;grid-template-columns:1fr auto 1fr;gap:7px;align-items:stretch;margin-bottom:7px}
  .dig-resource{border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:9px}.dig-resource.target{border-color:rgba(109,255,186,.24);background:rgba(109,255,186,.035)}
  .dig-resource strong{display:block;font-size:.76rem}.dig-resource small{display:block;color:#868a98;font-size:.58rem;margin-top:2px}
  .dig-counter{display:flex;align-items:center;gap:5px;margin-top:7px}.dig-counter button{width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:#11111a;color:#fff;font-weight:950}.dig-counter span{min-width:18px;text-align:center;font-weight:950}
  .dig-vs{display:grid;place-items:center;color:#656977;font-size:.56rem;font-weight:950}
  .dig-effect-card{border:1px solid rgba(255,255,255,.11);border-radius:16px;background:rgba(255,255,255,.025);padding:14px;margin:10px 0}.dig-effect-card h3{margin:0 0 7px}.dig-effect-card .fl{color:#989ca9;font-style:italic;font-size:.82rem}.dig-effect-card .ef{font-weight:800;line-height:1.48}
  .dig-win{text-align:center;padding:10px 0}.dig-win .crown{font-size:3rem}.dig-win h2{font-size:1.7rem;margin:8px 0}.dig-win p{color:#c9ccd6}
  @media(max-width:430px){.dig-node.char{width:39px;height:39px}.dig-node.action{width:28px;height:28px}.dig-tools{grid-template-columns:1fr 1fr}.dig-tools .dig-tool:last-child{grid-column:1/-1}}
  `;
  document.head.appendChild(s);
}

function buildScreens(){
  const home=document.getElementById('home');
  modeScreen=document.createElement('main');
  modeScreen.id='modeChooser';
  modeScreen.className='screen';
  modeScreen.innerHTML=`
    <section class="mode-hero">
      <p class="mode-kicker">ELIGE CÓMO QUIERES JUGAR</p>
      <h2 class="mode-title">Una partida. Dos maneras.</h2>
      <p class="mode-sub">El tablero puede seguir mandando desde la mesa… o mudarse entero al móvil.</p>
    </section>
    <div class="mode-stack">
      <button class="mode-choice physical" id="modePhysical"><strong>🎲 JUGAR CON TABLERO FÍSICO</strong><small>La miniweb funciona como hasta ahora: preguntas, acciones, Cartas Guardadas y Bonus Track.</small></button>
      <button class="mode-choice digital" id="modeDigital"><strong>🕹️ JUGAR TODO EN LA APP</strong><small>Tablero digital, fichas, dado, turnos, Personajes secretos y recursos. Un solo dispositivo, estilo pass & play.</small></button>
    </div>
    <button class="btn btn-ghost" id="modeBack" style="margin-top:12px">← VOLVER</button>`;
  home.parentNode.insertBefore(modeScreen,home);

  setupScreen=document.createElement('main');
  setupScreen.id='digitalSetup';
  setupScreen.className='screen';
  setupScreen.innerHTML=`
    <section class="dig-hero">
      <p class="dig-kicker">MODO DIGITAL · PASS & PLAY</p>
      <h2 class="dig-title">Preparar partida</h2>
      <p class="dig-sub">La app sortea orden, Temperamento e identidad. Cada Personaje empieza en su propio punto del Eneagrama con su Virtud y su Defecto.</p>
    </section>
    <div class="dig-setup-box">
      <h3>👥 ¿Cuántos jugadores?</h3>
      <select class="dig-select" id="digPlayerCount">
        <option value="1">1 jugador</option><option value="2" selected>2 jugadores</option><option value="3">3 jugadores</option><option value="4">4 jugadores</option>
      </select>
      <div class="dig-name-grid" id="digNames"></div>
    </div>
    <button class="btn btn-primary dig-start" id="digCreate">🎲 CREAR PARTIDA</button>
    <button class="btn btn-ghost" id="digSetupBack" style="margin-top:8px">← VOLVER</button>`;
  home.parentNode.insertBefore(setupScreen,home);

  digitalScreen=document.createElement('main');
  digitalScreen.id='digitalGame';
  digitalScreen.className='screen';
  home.parentNode.insertBefore(digitalScreen,home);

  digOverlay=document.createElement('div');
  digOverlay.id='digOverlay';
  digOverlay.className='dig-overlay';
  digOverlay.innerHTML='<div class="dig-modal" id="digModal"></div>';
  document.body.appendChild(digOverlay);
}

function allScreens(){
  return [document.getElementById('introScreen'),modeScreen,setupScreen,digitalScreen,document.getElementById('home'),document.getElementById('game')].filter(Boolean);
}
function activate(screen){
  allScreens().forEach(s=>s.classList.remove('active'));
  screen.classList.add('active');
  document.body.classList.remove('intro-mode');
  const reset=document.getElementById('resetTop');
  if(reset)reset.style.display=(screen===document.getElementById('home')||screen===document.getElementById('game'))?'':'none';
  scrollTo(0,0);
}
function showModes(){
  activate(modeScreen);
  const resume=document.getElementById('digResume');
  if(resume)resume.remove();
  if(loadDig()){
    const b=document.createElement('button');
    b.id='digResume';
    b.className='mode-choice digital';
    b.innerHTML='<strong>▶ CONTINUAR PARTIDA DIGITAL</strong><small>Retoma exactamente donde la dejaste.</small>';
    document.querySelector('.mode-stack').appendChild(b);
    b.onclick=()=>{dig=loadDig();renderDigitalGame()};
  }
}
function showSetup(){
  activate(setupScreen);
  renderNameInputs();
}
function renderNameInputs(){
  const count=Number(document.getElementById('digPlayerCount').value||2);
  const box=document.getElementById('digNames');
  const old=[...box.querySelectorAll('input')].map(x=>x.value);
  box.innerHTML='';
  for(let i=0;i<count;i++){
    const input=document.createElement('input');
    input.className='dig-name-input';
    input.maxLength=22;
    input.placeholder=`Jugador ${i+1}`;
    input.value=old[i]||'';
    box.appendChild(input);
  }
}

function d6(){return 1+Math.floor(Math.random()*6)}
function roll3(){return [d6(),d6(),d6()]}
function uniqueOrderRoll(players){
  let pending=players.slice();
  while(true){
    pending.forEach(p=>{p.orderDice=roll3();p.orderSum=p.orderDice.reduce((a,b)=>a+b,0)});
    const groups={};
    pending.forEach(p=>(groups[p.orderSum]??=[]).push(p));
    const ties=Object.values(groups).filter(g=>g.length>1).flat();
    if(!ties.length)break;
    pending=ties;
  }
}
function temperamentRoll(){
  let vals={mental:d6(),emotional:d6(),visceral:d6()};
  while(true){
    const mx=Math.max(...Object.values(vals));
    const tied=Object.keys(vals).filter(k=>vals[k]===mx);
    if(tied.length===1)return {key:tied[0],rolls:vals};
    tied.forEach(k=>vals[k]=d6());
  }
}
function randomFrom(a){return a[Math.floor(Math.random()*a.length)]}
function blankCounts(){const x={};for(let n=1;n<=9;n++)x[n]=0;return x}
function createDigitalGame(){
  const inputs=[...document.querySelectorAll('#digNames input')];
  const players=inputs.map((input,i)=>({
    id:`p${Date.now()}_${i}`,
    name:input.value.trim()||`Jugador ${i+1}`,
    virtues:blankCounts(),defects:blankCounts(),effects:[]
  }));
  uniqueOrderRoll(players);
  players.sort((a,b)=>b.orderSum-a.orderSum);
  players.forEach(p=>{
    const tr=temperamentRoll();
    p.temperament=tr.key;
    p.tempRolls=tr.rolls;
    p.character=randomFrom(TEMPS[tr.key].chars);
    p.pos=`c${p.character}`;
    p.virtues[p.character]=1;
    p.defects[p.character]=1;
  });
  dig={version:DIG_VERSION,players,turnIndex:0,die:null,reachable:[],message:'Pulsa TIRAR DADO para empezar.',winner:null,createdAt:Date.now()};
  saveDig();
  showSetupSummary();
}
function showSetupSummary(){
  openOverlay(`
    <p class="dig-modal-kicker">ORDEN DE JUEGO</p>
    <h2>🎲 El sistema ya ha hecho el papeleo</h2>
    <div class="dig-private">Las identidades siguen siendo secretas. Cada jugador podrá consultar la suya cuando sea su turno. Nada de mirar por encima del hombro, animales.</div>
    ${dig.players.map((p,i)=>`<div class="dig-effect-card"><strong>${i+1}. ${escD(p.name)}</strong><br><span class="dig-temp ${TEMPS[p.temperament].cls}">${TEMPS[p.temperament].label}</span><p style="margin:7px 0 0;color:#a8abb8;font-size:.76rem">Orden: ${p.orderDice.join(' + ')} = <strong>${p.orderSum}</strong></p></div>`).join('')}
    <div class="dig-modal-actions"><button class="dig-action-btn good" id="digBegin">▶ EMPEZAR</button></div>`);
  document.getElementById('digBegin').onclick=()=>{closeOverlay();renderDigitalGame()};
}
function saveDig(){localStorage.setItem(DIG_KEY,JSON.stringify(dig))}
function loadDig(){try{const x=JSON.parse(localStorage.getItem(DIG_KEY)||'null');return x&&x.version===DIG_VERSION?x:null}catch(e){return null}}
function escD(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function currentPlayer(){return dig.players[dig.turnIndex]}

function buildGraph(){
  const nodes={},adj={};
  Object.entries(POS).forEach(([n,[x,y]])=>nodes[`c${n}`]={id:`c${n}`,kind:'char',n:Number(n),x,y});
  const addEdge=(a,b,type,prefix,idx,inner=false)=>{
    const [ax,ay]=POS[a],[bx,by]=POS[b],id=`${prefix}${a}_${b}`;
    nodes[id]={id,kind:'action',action:type,x:(ax+bx)/2,y:(ay+by)/2,inner};
    for(const k of [`c${a}`,id,`c${b}`])adj[k]??=[];
    adj[`c${a}`].push(id);adj[id].push(`c${a}`);adj[id].push(`c${b}`);adj[`c${b}`].push(id);
  };
  OUTER.forEach((e,i)=>addEdge(e[0],e[1],OUTER_TYPES[i],'o',i,false));
  INNER.forEach((e,i)=>addEdge(e[0],e[1],INNER_TYPES[i],'i',i,true));
  return {nodes,adj};
}
const GRAPH=buildGraph();

function reachable(start,steps){
  let ends=new Set();
  function dfs(node,left,seen){
    if(left===0){ends.add(node);return}
    for(const nx of GRAPH.adj[node]||[]){
      if(seen.has(nx))continue;
      const nseen=new Set(seen);nseen.add(nx);
      dfs(nx,left-1,nseen);
    }
  }
  dfs(start,steps,new Set([start]));
  return [...ends];
}
function iconForAction(k){return k==='instinct'?'🔵':k==='things'?'🟡':'🔴'}
function labelForAction(k){return k==='instinct'?'INSTINTO':k==='things'?'COSAS QUE PASAN':'ELIGE TÚ'}

function renderBoardSVG(){
  const lines=[];
  [...OUTER.map(e=>[...e,false]),...INNER.map(e=>[...e,true])].forEach(([a,b,inner])=>{
    const [x1,y1]=POS[a],[x2,y2]=POS[b];
    lines.push(`<line class="${inner?'inner':''}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"></line>`);
  });
  return `<svg class="dig-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${lines.join('')}</svg>`;
}
function nodeHTML(node){
  const p=currentPlayer();
  const tokens=dig.players.filter(pl=>pl.pos===node.id).map(pl=>`<span class="dig-token">${escD(pl.name.slice(0,2).toUpperCase())}</span>`).join('');
  const reach=(dig.reachable||[]).includes(node.id);
  const cur=p.pos===node.id;
  const cls=`dig-node ${node.kind}${node.kind==='action'?' '+node.action:''}${reach?' reachable':''}${cur?' current':''}`;
  const title=node.kind==='char'?`${NAMES[node.n]} · ${VIRTUES[node.n]}`:labelForAction(node.action);
  const body=node.kind==='char'?node.n:iconForAction(node.action);
  return `<button class="${cls}" data-dnode="${node.id}" style="left:${node.x}%;top:${node.y}%" title="${escD(title)}">${body}<span class="dig-tokens">${tokens}</span></button>`;
}
function targetNums(char){return [...new Set([char,...WINGS[char],...ARROWS[char]])]}
function progressOf(p){return targetNums(p.character).filter(n=>(p.virtues[n]||0)>0).length}

function renderDigitalGame(){
  if(!dig)dig=loadDig();
  if(!dig)return showSetup();
  activate(digitalScreen);
  const p=currentPlayer();
  const progress=progressOf(p);
  digitalScreen.innerHTML=`
    <div class="dig-topline">
      <div class="dig-turn">
        <div class="tiny">TURNO ${dig.turnIndex+1} DE ${dig.players.length}</div>
        <h2>${escD(p.name)}</h2>
        <span class="dig-temp ${TEMPS[p.temperament].cls}">${TEMPS[p.temperament].label}</span>
      </div>
      <div class="dig-progress"><strong>${progress}/5</strong><small>OBJETIVO</small></div>
    </div>
    <div class="dig-board-shell" id="digBoard">
      ${renderBoardSVG()}
      ${Object.values(GRAPH.nodes).map(nodeHTML).join('')}
    </div>
    <div class="dig-controls">
      <button class="dig-roll" id="digRoll" ${dig.reachable?.length?'disabled':''}>🎲 ${dig.reachable?.length?'ELIGE DESTINO':'TIRAR DADO'}</button>
      <div class="dig-die">${dig.die??'—'}</div>
    </div>
    <p class="dig-msg">${escD(dig.message||'')}</p>
    <div class="dig-tools">
      <button class="dig-tool" id="digIdentity">👁 MI PERSONAJE</button>
      <button class="dig-tool" id="digResources">🎒 MIS RECURSOS</button>
      <button class="dig-tool" id="digEffects">⚡ EFECTOS</button>
    </div>
    <div class="dig-order">${dig.players.map((pl,i)=>`<span class="dig-order-chip ${i===dig.turnIndex?'active':''}">${i+1}. ${escD(pl.name)} · ${TEMPS[pl.temperament].label}</span>`).join('')}</div>
    <button class="btn btn-ghost" id="digExit" style="margin-top:12px">← MENÚ DE JUEGO</button>`;

  document.getElementById('digRoll').onclick=rollDigital;
  document.getElementById('digIdentity').onclick=showPrivateIdentity;
  document.getElementById('digResources').onclick=()=>showResources(null);
  document.getElementById('digEffects').onclick=showEffects;
  document.getElementById('digExit').onclick=showModes;
  document.querySelectorAll('[data-dnode].reachable').forEach(b=>b.onclick=()=>moveTo(b.dataset.dnode));
  if(dig.winner)showWin(dig.players.find(x=>x.id===dig.winner));
}
function rollDigital(){
  const p=currentPlayer();
  const d=d6();
  dig.die=d;
  dig.reachable=reachable(p.pos,d);
  dig.message=`Has sacado ${d}. Elige uno de los destinos iluminados.`;
  saveDig();renderDigitalGame();
}
function moveTo(nodeId){
  if(!(dig.reachable||[]).includes(nodeId))return;
  const p=currentPlayer();
  p.pos=nodeId;
  dig.reachable=[];
  dig.message='';
  saveDig();renderDigitalGame();
  setTimeout(()=>resolveLanding(nodeId),160);
}
function resolveLanding(nodeId){
  const node=GRAPH.nodes[nodeId];
  if(!node)return finishTurn();
  if(node.kind==='char')showLandingChoice(node.n);
  else showDigitalAction(node.action);
}

function openOverlay(html){
  document.getElementById('digModal').innerHTML=html;
  digOverlay.classList.add('show');
}
function closeOverlay(){digOverlay.classList.remove('show');digOverlayReturn=null}
function finishTurn(){
  const winner=dig.players.find(checkWin);
  if(winner){dig.winner=winner.id;saveDig();closeOverlay();renderDigitalGame();return}
  dig.turnIndex=(dig.turnIndex+1)%dig.players.length;
  dig.die=null;dig.reachable=[];dig.message='Pulsa TIRAR DADO.';
  saveDig();closeOverlay();renderDigitalGame();
}
function checkWin(p){return targetNums(p.character).every(n=>(p.virtues[n]||0)>0)}
function showWin(p){
  if(!p)return;
  openOverlay(`<div class="dig-win"><div class="crown">👑</div><p class="dig-modal-kicker">5 / 5 COMPLETADO</p><h2>${escD(p.name)} es EL FAVORITO DE DIOS</h2><p>Ha reunido la Virtud de su Personaje, sus dos Alas y sus dos Flechas.</p><div class="dig-modal-actions"><button class="dig-action-btn good" id="digWinClose">VER TABLERO</button><button class="dig-action-btn ghost" id="digNewGame">NUEVA PARTIDA DIGITAL</button></div></div>`);
  document.getElementById('digWinClose').onclick=()=>digOverlay.classList.remove('show');
  document.getElementById('digNewGame').onclick=()=>{localStorage.removeItem(DIG_KEY);dig=null;closeOverlay();showSetup()};
}

function showPrivateIdentity(){
  const p=currentPlayer();
  const targets=targetNums(p.character);
  openOverlay(`
    <p class="dig-modal-kicker">SOLO ${escD(p.name).toUpperCase()}</p>
    <h2>🔐 Tu Personaje</h2>
    <div class="dig-private">Que nadie mire. Si alguien mira, no es deducción: es ser un rata.</div>
    <div class="dig-effect-card">
      <h3>${NAMES[p.character]}</h3>
      <span class="dig-temp ${TEMPS[p.temperament].cls}">${TEMPS[p.temperament].label}</span>
      <p><strong>✨ Virtud propia:</strong> ${VIRTUES[p.character]}</p>
      <p><strong>☠️ Defecto:</strong> ${DEFECTS[p.character]}</p>
      <p><strong>🪽 Alas:</strong> ${WINGS[p.character].map(n=>VIRTUES[n]).join(' · ')}</p>
      <p><strong>⚡ Flechas:</strong> ${ARROWS[p.character].map(n=>VIRTUES[n]).join(' · ')}</p>
    </div>
    <div class="dig-goal-grid">${targets.map(n=>`<div class="dig-goal ${(p.virtues[n]||0)>0?'done':''}"><strong>${n}</strong>${escD(VIRTUES[n])}</div>`).join('')}</div>
    <div class="dig-modal-actions"><button class="dig-action-btn good" id="digHideIdentity">🙈 OCULTAR</button></div>`);
  document.getElementById('digHideIdentity').onclick=closeOverlay;
}

function showLandingChoice(n){
  openOverlay(`
    <p class="dig-modal-kicker">HAS CAÍDO EN ${n}</p>
    <h2>${NAMES[n]}</h2>
    <p>Elige cómo quieres jugar esta casilla.</p>
    <div class="dig-modal-actions">
      <button class="dig-action-btn" id="digSpecificQ">🎯 PREGUNTA DE ${NAMES[n]}</button>
      <button class="dig-action-btn" id="digIdentityQ">🔎 ¿QUIÉN ES?</button>
    </div>`);
  document.getElementById('digSpecificQ').onclick=()=>showDigitalQuestion(n);
  document.getElementById('digIdentityQ').onclick=()=>showDigitalQuestion('identity');
}
function digPick(pool,key){
  let a=remaining(pool,key);
  if(!a.length){
    const s=state();delete s[key];save(s);a=remaining(pool,key);
  }
  if(!a.length)return null;
  const q=a[Math.floor(Math.random()*a.length)];
  mark(key,q.id);
  return q;
}
function showDigitalQuestion(type){
  const pool=qPool(type==='identity'?IDENTITY:type);
  const q=digPick(pool,`dig19_q_${type}`);
  if(!q){openOverlay('<h2>Sin preguntas disponibles</h2><div class="dig-modal-actions"><button class="dig-action-btn" id="digNoQ">CONTINUAR</button></div>');document.getElementById('digNoQ').onclick=finishTurn;return}
  const chip=type==='identity'?'🔎 ¿QUIÉN ES?':NAMES[type];
  openOverlay(`
    <p class="dig-modal-kicker">${chip}</p>
    <h2 class="dig-question">${escD(q.pregunta)}</h2>
    ${['A','B','C'].map(l=>`<div class="dig-option" data-digopt="${l}"><span class="dig-letter">${l}</span><div>${escD(q.opciones[l])}</div></div>`).join('')}
    <div class="dig-answer" id="digAnswer">RESPUESTA CORRECTA: ${q.correcta}</div>
    <div class="dig-modal-actions" id="digQuestionActions"><button class="dig-action-btn" id="digReveal">VER RESPUESTA</button></div>`);
  document.getElementById('digReveal').onclick=()=>{
    document.getElementById('digAnswer').classList.add('show');
    document.querySelector(`[data-digopt="${q.correcta}"]`)?.classList.add('correct');
    document.getElementById('digQuestionActions').innerHTML=`
      <div class="dig-modal-actions two" style="margin-top:0">
        <button class="dig-action-btn good" id="digCorrect">✅ ACERTÉ</button>
        <button class="dig-action-btn bad" id="digWrong">❌ FALLÉ</button>
      </div>`;
    document.getElementById('digCorrect').onclick=()=>applyQuestionResult(type,q,true);
    document.getElementById('digWrong').onclick=()=>applyQuestionResult(type,q,false);
  };
}
function applyQuestionResult(type,q,ok){
  const p=currentPlayer();
  if(type==='identity'){
    if(ok)p.virtues[q.eneatipo]=(p.virtues[q.eneatipo]||0)+1;
  }else{
    if(ok)p.virtues[type]=(p.virtues[type]||0)+1;
    else p.defects[type]=(p.defects[type]||0)+1;
  }
  saveDig();finishTurn();
}

function cardText(c){return Object.values(c||{}).filter(v=>typeof v==='string').join(' ').toLowerCase()}
function digitalCompatible(c){
  const t=cardText(c);
  const bad=[
    'ordena el mazo','ordenar el mazo','baraja el mazo','barajar el mazo',
    'carta superior del mazo','carta de arriba del mazo','fondo del mazo',
    'primeras cartas del mazo','primeras 3 cartas','primeras tres cartas'
  ];
  return !bad.some(x=>t.includes(x));
}
function pickCompatible(pool,key){
  let compatible=pool.filter(digitalCompatible);
  if(!compatible.length)compatible=pool;
  return digPick(compatible,key);
}
function digitalInstinctCard(){
  const choices=['efecto','reto'];
  if(dig.players.length>=3)choices.push('quien');
  const kind=randomFrom(choices);
  if(kind==='efecto')return {kind,c:pickCompatible(DATA.instinto_efectos,'dig19_inst_ef')};
  if(kind==='reto')return {kind,c:pickCompatible(DATA.instinto_retos,'dig19_inst_ret')};
  return {kind,c:pickCompatible(DATA.instinto_quien,'dig19_inst_qmp')};
}
function showDigitalAction(kind){
  let title='',body='',saveMeta=null;
  if(kind==='choose'){
    const c=pickCompatible(DATA.elige_tu,'dig19_choose');
    title='🔴 ELIGE TÚ';
    body=`<div class="dig-effect-card"><p class="ef">${escD(c?.texto||'No quedan cartas compatibles.')}</p></div>`;
    if(c)saveMeta={title:'ELIGE TÚ',effect:c.texto};
  }else if(kind==='things'){
    const c=pickCompatible(DATA.cosas_que_pasan,'dig19_things');
    title='🟡 COSAS QUE PASAN';
    body=c?`<div class="dig-effect-card"><h3>${escD(c.titulo)}</h3><p class="fl">${escD(c.frase)}</p><p class="ef">${escD(c.efecto)}</p></div>`:'<p>No quedan cartas compatibles.</p>';
    if(c)saveMeta={title:c.titulo,effect:c.efecto};
  }else{
    const r=digitalInstinctCard(),c=r.c;
    title=r.kind==='efecto'?'🔵 INSTINTO · PODER':r.kind==='reto'?'🔵 INSTINTO · RETO':'🔵 INSTINTO · ¿QUIÉN ES MÁS PROBABLE?';
    if(!c)body='<p>No quedan cartas compatibles.</p>';
    else if(r.kind==='efecto'){
      body=`<div class="dig-effect-card"><h3>${escD(c.titulo)}</h3><p class="fl">${escD(c.frase)}</p><p class="ef">${escD(c.efecto)}</p></div>`;
      saveMeta={title:c.titulo,effect:c.efecto};
    }else if(r.kind==='reto'){
      body=`<div class="dig-effect-card"><h3>${escD(c.titulo)}</h3><p class="ef">${escD(c.instruccion)}${c.extra?'<br><br>'+escD(c.extra):''}</p><p class="ef">✅ ${escD(c.superado)}<br>❌ ${escD(c.fallado)}</p></div>`;
    }else{
      body=`<div class="dig-effect-card"><h3>${escD(c.pregunta)}</h3><p class="ef">👉 Señala a un jugador.</p><p style="font-size:.78rem;color:#b8bbc6">⚖️ Si el resto está de acuerdo, dale un Defecto o roba una Virtud. Si no está de acuerdo, el señalado te entrega un Defecto o te exige una Virtud.</p></div>`;
    }
  }
  const savedBtn=saveMeta?'<button class="dig-action-btn" id="digSaveEffect">💾 GUARDAR EFECTO</button>':'';
  const render=()=> {
    openOverlay(`
      <p class="dig-modal-kicker">CASILLA DEL TABLERO</p>
      <h2>${title}</h2>${body}
      <div class="dig-modal-actions">
        ${savedBtn}
        <button class="dig-action-btn" id="digAdjust">🎒 AJUSTAR RECURSOS</button>
        <button class="dig-action-btn good" id="digActionDone">✅ RESUELTO · FIN DE TURNO</button>
      </div>`);
    if(saveMeta)document.getElementById('digSaveEffect').onclick=()=>{const p=currentPlayer();p.effects.push({...saveMeta,id:`e${Date.now()}`});saveDig();document.getElementById('digSaveEffect').textContent='✓ GUARDADO';document.getElementById('digSaveEffect').disabled=true};
    document.getElementById('digAdjust').onclick=()=>{digOverlayReturn=render;showResources(render)};
    document.getElementById('digActionDone').onclick=finishTurn;
  };
  render();
}

function showResources(backFn){
  const p=currentPlayer(),targets=new Set(targetNums(p.character));
  const render=()=>{
    openOverlay(`
      <p class="dig-modal-kicker">SOLO ${escD(p.name).toUpperCase()}</p>
      <h2>🎒 Recursos</h2>
      <div class="dig-private">Usa + y − para aplicar robos, regalos, pérdidas o efectos que todavía no estén automatizados. Aquí no hacen falta cartas físicas.</div>
      ${[1,2,3,4,5,6,7,8,9].map(n=>`
        <div class="dig-resource-row">
          <div class="dig-resource ${targets.has(n)?'target':''}"><strong>✨ ${n} · ${VIRTUES[n]} ${targets.has(n)?'⭐':''}</strong><small>Virtud</small><div class="dig-counter"><button data-res="v" data-n="${n}" data-d="-1">−</button><span>${p.virtues[n]||0}</span><button data-res="v" data-n="${n}" data-d="1">+</button></div></div>
          <div class="dig-vs">/</div>
          <div class="dig-resource"><strong>☠️ ${n} · ${DEFECTS[n]}</strong><small>Defecto</small><div class="dig-counter"><button data-res="d" data-n="${n}" data-d="-1">−</button><span>${p.defects[n]||0}</span><button data-res="d" data-n="${n}" data-d="1">+</button></div></div>
        </div>`).join('')}
      <div class="dig-modal-actions">
        <button class="dig-action-btn good" id="digResourcesDone">${backFn?'← VOLVER A LA CARTA':'🙈 OCULTAR'}</button>
      </div>`);
    document.querySelectorAll('[data-res]').forEach(b=>b.onclick=()=>{
      const n=Number(b.dataset.n),delta=Number(b.dataset.d),obj=b.dataset.res==='v'?p.virtues:p.defects;
      obj[n]=Math.max(0,(obj[n]||0)+delta);saveDig();render();
    });
    document.getElementById('digResourcesDone').onclick=()=>{
      if(checkWin(p)){dig.winner=p.id;saveDig();closeOverlay();renderDigitalGame();return}
      if(backFn)backFn();else closeOverlay();
    };
  };
  render();
}
function showEffects(){
  const p=currentPlayer();
  const render=()=>{
    openOverlay(`
      <p class="dig-modal-kicker">SOLO ${escD(p.name).toUpperCase()}</p>
      <h2>⚡ Efectos guardados</h2>
      ${p.effects.length?p.effects.map(e=>`<div class="dig-effect-card"><h3>${escD(e.title)}</h3><p class="ef">${escD(e.effect)}</p><button class="dig-action-btn ghost" data-del-eff="${e.id}">USAR / DESCARTAR</button></div>`).join(''):'<p style="color:#9da0ad">No tienes efectos pendientes.</p>'}
      <div class="dig-modal-actions"><button class="dig-action-btn good" id="digEffectsClose">🙈 OCULTAR</button></div>`);
    document.querySelectorAll('[data-del-eff]').forEach(b=>b.onclick=()=>{p.effects=p.effects.filter(e=>e.id!==b.dataset.delEff);saveDig();render()});
    document.getElementById('digEffectsClose').onclick=closeOverlay;
  };render();
}

function hookExisting(){
  const start=document.getElementById('startGame');
  if(start)start.onclick=showModes;
  document.getElementById('modePhysical').onclick=()=>{activate(document.getElementById('home'));showHome();const r=document.getElementById('resetTop');if(r)r.style.display=''};
  document.getElementById('modeDigital').onclick=showSetup;
  document.getElementById('modeBack').onclick=()=>{
    allScreens().forEach(s=>s.classList.remove('active'));
    document.getElementById('introScreen').classList.add('active');
    document.body.classList.add('intro-mode');scrollTo(0,0);
  };
  document.getElementById('digPlayerCount').onchange=renderNameInputs;
  document.getElementById('digCreate').onclick=createDigitalGame;
  document.getElementById('digSetupBack').onclick=showModes;
  renderNameInputs();
}

injectCSS();
buildScreens();
hookExisting();

})();
(()=>{'use strict';
const GATE_ID='efdTurnGateV25';
const LAST_KEY='efd_turn_gate_last_player_v25';
let suppress=false;
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function ensureGate(){
  if(document.getElementById(GATE_ID))return document.getElementById(GATE_ID);
  const style=document.createElement('style');
  style.textContent=`
  #${GATE_ID}{position:fixed;inset:0;z-index:30000;display:none;place-items:center;padding:22px;background:radial-gradient(circle at 20% 10%,rgba(35,231,255,.12),transparent 32%),radial-gradient(circle at 80% 90%,rgba(140,82,255,.16),transparent 38%),#050509;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  #${GATE_ID}.show{display:grid}
  #${GATE_ID} .gate-card{width:min(100%,520px);border:1px solid rgba(35,231,255,.36);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015)),#0a0a12;padding:26px 20px;text-align:center;box-shadow:0 24px 90px rgba(0,0,0,.55)}
  #${GATE_ID} .gate-kicker{margin:0 0 10px;color:#23e7ff;font-size:.7rem;font-weight:950;letter-spacing:.18em}
  #${GATE_ID} .gate-icon{font-size:2.8rem;margin:2px 0 12px}
  #${GATE_ID} h2{margin:0 0 10px;font-size:clamp(1.65rem,7vw,2.35rem);line-height:1.02}
  #${GATE_ID} .gate-copy{margin:0 0 6px;color:#bfc3d0;line-height:1.5}
  #${GATE_ID} .gate-player{margin:14px 0 20px;font-size:clamp(1.25rem,6vw,1.75rem);font-weight:950;color:#fff}
  #${GATE_ID} .gate-btn{width:100%;min-height:56px;border-radius:15px;border:1px solid rgba(35,231,255,.65);background:linear-gradient(90deg,#23e7ff,#80f4ff);color:#030609;font-weight:950;font-size:.95rem;cursor:pointer}
  #${GATE_ID} .gate-note{margin:12px 0 0;color:#737887;font-size:.73rem;line-height:1.4}
  `;
  document.head.appendChild(style);
  const el=document.createElement('div');el.id=GATE_ID;
  document.body.appendChild(el);return el;
}
function activeTurnName(){
  const tops=[...document.querySelectorAll('.v24top')];
  const top=tops.find(x=>x.offsetParent!==null)||tops[tops.length-1];
  if(!top)return null;
  const small=top.querySelector('small');
  if(!small)return null;
  const txt=small.textContent.trim();
  const m=txt.match(/TURNO\s*[·:]\s*(.+)$/i);
  return m?m[1].trim():null;
}
function boardVisible(){
  const top=document.querySelector('.v24top');
  return !!(top&&top.offsetParent!==null);
}
function showGate(name,initial=false){
  if(!name)return;
  const gate=ensureGate();
  gate.innerHTML=`<section class="gate-card"><p class="gate-kicker">${initial?'INICIO DE TURNO':'CAMBIO DE JUGADOR'}</p><div class="gate-icon">📱</div><h2>${initial?'Tu turno está listo':'Pasa el móvil'}</h2><p class="gate-copy">${initial?'Antes de ver tu tablero, confirma que eres tú.':'Que nadie cotillee el tablero, recursos o identidad ajena.'}</p><div class="gate-player">${esc(name)}</div><button class="gate-btn" id="efdGateOpen">SOY ${esc(name.toUpperCase())} · VER MI TURNO</button><p class="gate-note">La pantalla del jugador anterior queda oculta hasta confirmar.</p></section>`;
  gate.classList.add('show');
  document.getElementById('efdGateOpen').onclick=()=>{gate.classList.remove('show');sessionStorage.setItem(LAST_KEY,name)};
}
function check(){
  if(suppress||!boardVisible())return;
  const name=activeTurnName();if(!name)return;
  const last=sessionStorage.getItem(LAST_KEY);
  if(last!==name){suppress=true;showGate(name,!last);setTimeout(()=>{suppress=false},0)}
}
const observer=new MutationObserver(check);
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',()=>{sessionStorage.removeItem(LAST_KEY);setTimeout(check,0)});
setTimeout(check,0);
})();
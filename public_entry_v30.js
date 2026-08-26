(()=>{'use strict';
// V30: la primera pantalla presenta la historia y explica los dos modos de juego.
if(window.__efdPublicEntryV30)return;
window.__efdPublicEntryV30=true;

const STYLE_ID='efdWelcomeStyles';
const SCREEN_ID='efdWelcome';
let welcome=null;

function addStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
body.efd-welcome-mode #resetTop{display:none}
.efd-welcome{padding-bottom:8px}
.efd-welcome .guide-hero{margin-top:2px}
.efd-story{margin:0 0 14px;padding:16px 15px;border:1px solid rgba(255,43,214,.24);border-radius:17px;background:linear-gradient(135deg,rgba(255,43,214,.07),rgba(140,82,255,.06));color:#e5e6ed;font-size:.94rem;line-height:1.55}
.efd-story strong{color:#fff}
.efd-steps{display:grid;gap:8px;margin:0 0 14px;counter-reset:efd-step}
.efd-step{counter-increment:efd-step;display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:start;padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.025);color:#d4d6df;font-size:.88rem;line-height:1.42}
.efd-step:before{content:counter(efd-step);width:32px;height:32px;display:grid;place-items:center;border-radius:10px;border:1px solid rgba(35,231,255,.35);background:rgba(35,231,255,.07);color:var(--cyan);font-weight:950}
.efd-step strong{display:block;margin-bottom:2px;color:#fff}
.efd-objective{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}
.efd-objective div{padding:11px;border:1px solid rgba(255,216,61,.22);border-radius:12px;background:rgba(255,216,61,.04);color:#fff3b0;font-size:.82rem;line-height:1.38}
.efd-objective strong{display:block;margin-bottom:3px;color:#fff}
.efd-start{margin-top:14px;min-height:58px;font-size:1rem;box-shadow:0 0 28px rgba(35,231,255,.12)}
.efd-first-note{margin:10px 4px 0;color:#777b8c;text-align:center;font-size:.7rem;line-height:1.4}
@media(max-width:390px){.efd-objective{grid-template-columns:1fr}}
`;
  document.head.appendChild(style);
}

function deactivateAll(){
  document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active'));
}

function showWelcome(){
  if(!welcome)return;
  deactivateAll();
  welcome.classList.add('active');
  document.body.classList.remove('intro-mode','battle-mode');
  document.body.classList.add('efd-welcome-mode');
  window.scrollTo(0,0);
}

function openModeChoice(){
  const start=document.getElementById('startGame');
  if(!start)return;
  welcome?.classList.remove('active');
  document.body.classList.remove('efd-welcome-mode');
  start.click();
  window.scrollTo(0,0);
}

function buildWelcome(modeScreen){
  welcome=document.createElement('main');
  welcome.id=SCREEN_ID;
  welcome.className='screen efd-welcome';
  welcome.setAttribute('aria-labelledby','efdWelcomeTitle');
  welcome.innerHTML=`
    <section class="guide-hero">
      <p class="guide-kicker">ANTES DE EMPEZAR</p>
      <h2 class="guide-title" id="efdWelcomeTitle">📖 HISTORIA Y CÓMO SE JUEGA</h2>
      <p class="guide-sub">Conoce el universo del juego y elige después si usarás el tablero físico o jugarás completamente en la app.</p>
    </section>

    <div class="section-label">LA HISTORIA</div>
    <section class="efd-story">
      <strong>Nueve Personajes entran en un tablero donde nadie es perfecto.</strong>
      Cada identidad posee una Virtud que la impulsa y un Defecto que puede frenarla. Las Alas y las Flechas conectan unos Personajes con otros, mientras las preguntas, las decisiones y las cosas que pasan ponen a prueba a cada jugador. Avanzar no basta: tendrás que entender tu mapa, adaptarte al caos y reunir lo que necesitas para convertirte en <strong>EL FAVORITO DE DIOS</strong>.
    </section>

    <div class="section-label">LA PARTIDA, EN 4 PASOS</div>
    <div class="efd-steps">
      <div class="efd-step"><div><strong>Elige cómo jugar</strong>Usa el tablero físico con sus dados y cartas, o deja que la app gestione toda la partida.</div></div>
      <div class="efd-step"><div><strong>Recibe una identidad secreta</strong>Cada Personaje tiene una Virtud principal, un Defecto y conexiones propias mediante Alas y Flechas.</div></div>
      <div class="efd-step"><div><strong>Avanza y resuelve la casilla</strong>Encontrarás preguntas, Instinto, Cosas que pasan y decisiones de ELIGE TÚ. Un acierto puede darte una Virtud; un fallo puede añadirte un Defecto.</div></div>
      <div class="efd-step"><div><strong>Construye tu camino hacia la victoria</strong>Consigue los recursos de tu objetivo, protege lo que has ganado y sobrevive a los efectos del tablero y del resto de jugadores.</div></div>
    </div>

    <details class="rule-details" open>
      <summary>🕹️ SI JUEGAS TODO EN LA APP</summary>
      <div class="detail-body">
        <p>Escribe los nombres de los jugadores. La app asignará y mostrará en privado el Personaje secreto de cada uno.</p>
        <p>En tu turno, pulsa <strong>AVANZAR 1 CASILLA</strong>, elige una dirección y resuelve lo que aparezca. Pasa el móvil solo cuando la app anuncie el siguiente jugador.</p>
        <p>La app guarda y aplica automáticamente Virtudes, Defectos, Impulsos y efectos; nadie los edita a mano.</p>
        <div class="guide-note">🏆 Ganas al completar las 5 Virtudes de tu mapa: tu Virtud principal, 2 Alas y 2 Flechas.</div>
      </div>
    </details>

    <details class="rule-details">
      <summary>🎲 SI USAS EL TABLERO FÍSICO</summary>
      <div class="detail-body">
        <p>Prepara tablero, fichas, dados y mazos. En cada turno tira el dado de tu Temperamento, avanza y usa en la app el bloque que corresponda a la casilla.</p>
        <p>Resuelve Situaciones reuniendo sus 3 Virtudes sin tener el Defecto que las bloquea.</p>
        <div class="efd-objective">
          <div><strong>🎯 MODO NORMAL</strong>3 Situaciones resueltas y 0 Defectos.</div>
          <div><strong>💀 MODO DIFÍCIL</strong>5 Situaciones resueltas y 0 Defectos.</div>
        </div>
        <p class="guide-note">Dentro del modo físico encontrarás el reglamento completo en CÓMO SE JUEGA.</p>
      </div>
    </details>

    <button class="btn btn-primary efd-start" id="efdEnterGame">CONTINUAR Y ELEGIR MODO</button>
    <p class="efd-first-note">Estas instrucciones estarán disponibles siempre que vuelvas a esta pantalla.</p>`;
  modeScreen.parentNode.insertBefore(welcome,modeScreen);
  document.getElementById('efdEnterGame').onclick=openModeChoice;
}

function install(){
  const start=document.getElementById('startGame');
  const digitalChoice=document.getElementById('v24dig');
  const modeScreen=digitalChoice?.closest('main');
  if(!start||!digitalChoice||!modeScreen)return false;

  addStyles();
  welcome=document.getElementById(SCREEN_ID);
  if(!welcome)buildWelcome(modeScreen);

  const back=document.getElementById('v24back');
  if(back){
    back.style.display='';
    back.textContent='← VOLVER A INSTRUCCIONES';
    back.onclick=showWelcome;
  }

  showWelcome();
  return true;
}

let tries=0;
const timer=setInterval(()=>{
  tries++;
  if(install()||tries>120)clearInterval(timer);
},25);
})();

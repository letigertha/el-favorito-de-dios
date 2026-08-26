(()=>{'use strict';
const MARK='efd-private-board-v26';
let busy=false;
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function activeName(){
  const tops=[...document.querySelectorAll('.v24top')].filter(x=>x.offsetParent!==null);
  const top=tops[tops.length-1];
  const small=top?.querySelector('small');
  if(!small)return null;
  const m=small.textContent.trim().match(/TURNO\s*[·:]\s*(.+)$/i);
  return m?m[1].trim():null;
}
function initials(name){return String(name||'YO').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'YO'}
function sanitize(){
  if(busy)return;
  const board=[...document.querySelectorAll('.v24board')].find(x=>x.offsetParent!==null);
  if(!board)return;
  busy=true;
  try{
    if(!board.classList.contains(MARK))board.classList.add(MARK);
    // Elimina solo las fichas generadas por el tablero. La ficha privada que
    // añadimos aquí se conserva para que el MutationObserver pueda estabilizarse.
    board.querySelectorAll('.v24token:not(.efd-own-token)').forEach(x=>x.remove());
    const name=activeName();
    const here=board.querySelector('.v24node.current');
    const ownTokens=[...board.querySelectorAll('.v24token.efd-own-token')];
    let token=ownTokens.shift()||null;
    ownTokens.forEach(x=>x.remove());
    if(name&&here){
      const label=initials(name);
      if(!token){
        token=document.createElement('span');
        token.className='v24token efd-own-token';
      }
      if(token.parentElement!==here)here.appendChild(token);
      if(token.textContent!==label)token.textContent=label;
      if(token.getAttribute('aria-label')!==`Ficha de ${name}`)token.setAttribute('aria-label',`Ficha de ${name}`);
    }else if(token){
      token.remove();
    }
    // Nunca dejamos metadatos visuales de posiciones rivales.
    board.querySelectorAll('[data-opponent],[data-player-position],[data-other-player]').forEach(x=>x.removeAttribute('data-opponent'));
  }finally{busy=false}
}
const style=document.createElement('style');
style.textContent=`
.${MARK} .v24token{display:none!important}
.${MARK} .v24token.efd-own-token{display:block!important}
`;
document.head.appendChild(style);
const observer=new MutationObserver(()=>queueMicrotask(sanitize));
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',()=>setTimeout(sanitize,0));
setTimeout(sanitize,0);
})();

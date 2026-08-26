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
    board.classList.add(MARK);
    board.querySelectorAll('.v24token').forEach(x=>x.remove());
    const name=activeName();
    const here=board.querySelector('.v24node.current');
    if(name&&here){
      const t=document.createElement('span');
      t.className='v24token efd-own-token';
      t.textContent=initials(name);
      t.setAttribute('aria-label',`Ficha de ${name}`);
      here.appendChild(t);
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
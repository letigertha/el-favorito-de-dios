(()=>{'use strict';
// V27: acceso público. La antigua introducción de cumpleaños ya no forma parte del flujo.
function enterPublicHome(){
  const start=document.getElementById('startGame');
  const digitalChoice=document.getElementById('v24dig');
  if(!start||!digitalChoice)return false;
  document.body.classList.remove('intro-mode');
  const intro=document.getElementById('introScreen');
  if(intro)intro.classList.remove('active');
  const back=document.getElementById('v24back');
  if(back)back.style.display='none';
  start.click();
  return true;
}
let tries=0;
const timer=setInterval(()=>{
  tries++;
  if(enterPublicHome()||tries>120)clearInterval(timer);
},25);
})();
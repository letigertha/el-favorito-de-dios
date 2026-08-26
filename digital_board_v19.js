(()=>{'use strict';
// V26 bootloader: lógica estable + cambio privado de jugador + tablero estrictamente privado.
const base='https://cdn.jsdelivr.net/gh/letigertha/el-favorito-de-dios@24e60689b420cebd3402dcbdbd28e76f0324bc6d/digital_board_v19.js';
function load(src,done){const s=document.createElement('script');s.src=src;s.async=false;if(done)s.onload=done;s.onerror=()=>{console.error('No se pudo cargar',src)};document.head.appendChild(s)}
load(base,()=>load('./turn_gate_v25.js?v=25b',()=>load('./privacy_v26.js?v=26')));
})();
from pathlib import Path

p = Path('index.html')
text = p.read_text(encoding='utf-8')

if "efd_saved_cards_v1" in text:
    print('V16 ya aplicada; no hay cambios.')
    raise SystemExit(0)

def rep(old, new, label):
    global text
    if old not in text:
        raise SystemExit(f'Ancla no encontrada: {label}')
    text = text.replace(old, new, 1)

saved_css = r'''
.saved-label{margin-top:22px}
.saved-entry{position:relative;width:100%;min-height:72px;border-radius:18px;border:1px solid rgba(109,255,186,.42);background:linear-gradient(100deg,rgba(109,255,186,.08),rgba(35,231,255,.06)),#0a0a11;color:#fff;text-align:left;padding:13px 56px 13px 58px;font-weight:950;letter-spacing:.04em;cursor:pointer}
.saved-entry .saved-icon{position:absolute;left:17px;top:50%;transform:translateY(-50%);font-size:1.45rem}
.saved-entry strong{display:block;font-size:1rem}.saved-entry small{display:block;margin-top:4px;color:#aeb4c2;font-size:.68rem;letter-spacing:.03em}
.saved-badge{position:absolute;right:16px;top:50%;transform:translateY(-50%);min-width:30px;height:30px;padding:0 8px;border-radius:999px;display:grid;place-items:center;background:rgba(109,255,186,.12);border:1px solid rgba(109,255,186,.35);color:var(--green);font-size:.78rem;font-weight:950}
.btn-save{border:1px solid rgba(109,255,186,.42);background:rgba(109,255,186,.07);color:#dffff0}
.btn-save:disabled{opacity:.58}
.saved-hero{position:relative;overflow:hidden;border:1px solid rgba(109,255,186,.28);border-radius:21px;background:radial-gradient(circle at 0% 0%,rgba(109,255,186,.11),transparent 38%),radial-gradient(circle at 100% 100%,rgba(35,231,255,.09),transparent 40%),#0a0a12;padding:20px 18px;margin-bottom:13px}
.saved-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--green),var(--cyan),var(--violet))}
.saved-kicker{margin:0 0 7px;color:var(--green);font-size:.66rem;font-weight:950;letter-spacing:.17em}
.saved-title{margin:0 0 8px;font-size:clamp(1.55rem,7vw,2.15rem);line-height:1;font-weight:950}
.saved-sub{margin:0;color:#c5c7d1;line-height:1.44;font-size:.9rem}
.saved-card{border:1px solid rgba(109,255,186,.20);border-radius:18px;background:rgba(255,255,255,.025);padding:15px;margin-bottom:10px}
.saved-card-head{display:flex;gap:9px;align-items:flex-start;justify-content:space-between;margin-bottom:9px}
.saved-owner{display:inline-block;padding:6px 9px;border-radius:999px;background:rgba(109,255,186,.08);border:1px solid rgba(109,255,186,.24);color:#dffff0;font-size:.67rem;font-weight:950;letter-spacing:.06em}
.saved-kind{font-size:.63rem;color:#8f93a2;font-weight:900;letter-spacing:.08em;text-align:right}
.saved-card h3{margin:0 0 7px;font-size:1.02rem;line-height:1.2}
.saved-card .saved-flavor{margin:0 0 9px;color:#9ea2af;font-style:italic;font-size:.84rem;line-height:1.42}
.saved-card .saved-effect{margin:0;color:#eceef4;font-size:.91rem;line-height:1.48;font-weight:750}
.saved-card-actions{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px}
.saved-card-actions button{min-height:44px;border-radius:12px;padding:9px 11px;font-size:.76rem;font-weight:950;cursor:pointer}
.saved-use{border:1px solid rgba(109,255,186,.35);background:rgba(109,255,186,.08);color:#dffff0}
.saved-delete{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#aeb1bf}
.saved-empty{border:1px dashed rgba(255,255,255,.14);border-radius:17px;padding:22px 16px;text-align:center;color:#9da0ad;line-height:1.5}
.save-owner-input{width:100%;height:48px;margin-top:10px;border-radius:13px;border:1px solid rgba(109,255,186,.30);background:#08080e;color:#fff;padding:0 13px;font:inherit;outline:none}
.save-owner-input:focus{border-color:rgba(109,255,186,.70);box-shadow:0 0 0 3px rgba(109,255,186,.08)}
'''
rep('.bonus-label{margin-top:22px}', saved_css + '\n.bonus-label{margin-top:22px}', 'CSS')

rep('''</div>\n<div class="section-label bonus-label">BONUS TRACK</div>''', '''</div>\n<div class="section-label saved-label">EN JUEGO</div>\n<button class="saved-entry" id="savedBtn"><span class="saved-icon">🎒</span><strong>CARTAS GUARDADAS</strong><small>Efectos pendientes · sobreviven a cambios de Personaje</small><span class="saved-badge" id="savedCount">0</span></button>\n<div class="section-label bonus-label">BONUS TRACK</div>''', 'HOME')

modal = '''<div class="modal" id="resetModal"><div class="modal-box"><h2>¿Nueva partida?</h2><p>Se borrará el historial de preguntas y cartas utilizadas. Todos los mazos volverán a estar completos.</p><div class="modal-actions"><button class="btn btn-primary" id="confirmReset">SÍ, REINICIAR</button><button class="btn btn-ghost" id="cancelReset">CANCELAR</button></div></div></div>'''
rep(modal, modal + '''\n<div class="modal" id="saveModal"><div class="modal-box"><h2>🎒 Guardar carta</h2><p>¿A qué jugador pertenece este efecto?</p><input class="save-owner-input" id="saveOwner" maxlength="30" placeholder="Nombre o Jugador 1"><div class="modal-actions"><button class="btn btn-primary" id="confirmSave">GUARDAR</button><button class="btn btn-ghost" id="cancelSave">CANCELAR</button></div></div></div>''', 'modal')

rep("const STORAGE_KEY='efd_full_game_v1';", "const STORAGE_KEY='efd_full_game_v1';\nconst SAVED_KEY='efd_saved_cards_v1';\nlet pendingSave=null;", 'storage')

helpers = r'''
function loadSavedCards(){try{return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}catch(e){return []}}
function saveSavedCards(cards){localStorage.setItem(SAVED_KEY,JSON.stringify(cards));updateSavedCount()}
function updateSavedCount(){let el=document.getElementById('savedCount');if(el)el.textContent=loadSavedCards().length}
function savedSourceKey(kind,id){return `${kind}:${id}`}
function isCardSaved(sourceKey){return loadSavedCards().some(x=>x.sourceKey===sourceKey)}
function saveButton(sourceKey){let done=isCardSaved(sourceKey);return `<button class="btn btn-save" id="saveCardBtn" ${done?'disabled':''}>${done?'✓ GUARDADA':'💾 GUARDAR CARTA / EFECTO'}</button>`}
function bindSaveButton(meta){
  let b=document.getElementById('saveCardBtn');
  if(!b||b.disabled)return;
  b.onclick=()=>openSaveCard(meta);
}
function openSaveCard(meta){
  pendingSave=meta;
  saveOwner.value='';
  saveModal.classList.add('show');
  setTimeout(()=>saveOwner.focus(),80);
}
function closeSaveCard(){saveModal.classList.remove('show');pendingSave=null}
function confirmSaveCard(){
  if(!pendingSave)return closeSaveCard();
  let owner=(saveOwner.value||'').trim()||'Jugador';
  let cards=loadSavedCards();
  if(!cards.some(x=>x.sourceKey===pendingSave.sourceKey)){
    cards.push({
      uid:`s_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      owner,
      sourceKey:pendingSave.sourceKey,
      kind:pendingSave.kind,
      title:pendingSave.title||'Carta guardada',
      flavor:pendingSave.flavor||'',
      effect:pendingSave.effect||'',
      savedAt:Date.now()
    });
    saveSavedCards(cards);
  }
  closeSaveCard();
  let b=document.getElementById('saveCardBtn');
  if(b){b.textContent='✓ GUARDADA';b.disabled=true}
}
function removeSavedCard(uid){
  saveSavedCards(loadSavedCards().filter(x=>x.uid!==uid));
  showSavedCards();
}
function showSavedCards(){
  enter();
  let cards=loadSavedCards();
  let body=cards.length?cards.map(c=>`
    <section class="saved-card">
      <div class="saved-card-head">
        <span class="saved-owner">👤 ${esc(c.owner)}</span>
        <span class="saved-kind">${esc(c.kind)}</span>
      </div>
      <h3>${esc(c.title)}</h3>
      ${c.flavor?`<p class="saved-flavor">${esc(c.flavor)}</p>`:''}
      <p class="saved-effect">${esc(c.effect)}</p>
      <div class="saved-card-actions">
        <button class="saved-use" data-saved-use="${esc(c.uid)}">⚡ USAR / FINALIZAR</button>
        <button class="saved-delete" data-saved-delete="${esc(c.uid)}">🗑</button>
      </div>
    </section>`).join(''):`<div class="saved-empty">Todavía no hay nada guardado.<br>Cuando aparezca un efecto que deba durar, reservarse o usarse más adelante, pulsa <strong>💾 GUARDAR CARTA / EFECTO</strong>.</div>`;

  gameContent.innerHTML=`
    <section class="saved-hero">
      <p class="saved-kicker">MEMORIA DE PARTIDA</p>
      <h2 class="saved-title">🎒 CARTAS GUARDADAS</h2>
      <p class="saved-sub">Aquí viven los efectos que todavía no han terminado. Pertenecen al jugador, no al Personaje.</p>
    </section>
    ${body}
    <button class="btn btn-ghost battle-back" id="savedBack">← VOLVER AL MENÚ PRINCIPAL</button>`;

  document.getElementById('savedBack').onclick=showHome;
  document.querySelectorAll('[data-saved-use]').forEach(b=>b.onclick=()=>removeSavedCard(b.dataset.savedUse));
  document.querySelectorAll('[data-saved-delete]').forEach(b=>b.onclick=()=>removeSavedCard(b.dataset.savedDelete));
}
'''
rep('function showHome(){', helpers + '\nfunction showHome(){', 'helpers')

rep("document.getElementById('instinctCount').textContent=`${ir} / ${DATA.instinto_efectos.length+DATA.instinto_retos.length+DATA.instinto_quien.length} disponibles`}", "document.getElementById('instinctCount').textContent=`${ir} / ${DATA.instinto_efectos.length+DATA.instinto_retos.length+DATA.instinto_quien.length} disponibles`;updateSavedCount()}", 'contador')

old_choose = "function drawChoose(){let c=pick(DATA.elige_tu,'elige');if(!c)return exhausted('ELIGE TÚ');enter();let r=remaining(DATA.elige_tu,'elige').length;gameContent.innerHTML=head('🔴 ELIGE TÚ',`${r} restantes`,'chip-red')+`<section class=\"card red\"><p class=\"choose-text\">${esc(c.texto)}</p></section><div class=\"actions\"><button class=\"btn btn-red\" id=\"again\">OTRO ELIGE TÚ</button>${backButton()}</div>`;document.getElementById('again').onclick=drawChoose;bindBack()}"
new_choose = "function drawChoose(){let c=pick(DATA.elige_tu,'elige');if(!c)return exhausted('ELIGE TÚ');enter();let r=remaining(DATA.elige_tu,'elige').length,sk=savedSourceKey('elige',c.id);gameContent.innerHTML=head('🔴 ELIGE TÚ',`${r} restantes`,'chip-red')+`<section class=\"card red\"><p class=\"choose-text\">${esc(c.texto)}</p></section><div class=\"actions\">${saveButton(sk)}<button class=\"btn btn-red\" id=\"again\">OTRO ELIGE TÚ</button>${backButton()}</div>`;bindSaveButton({sourceKey:sk,kind:'ELIGE TÚ',title:'ELIGE TÚ',effect:c.texto});document.getElementById('again').onclick=drawChoose;bindBack()}"
rep(old_choose, new_choose, 'drawChoose')

old_things = "function drawThings(){let c=pick(DATA.cosas_que_pasan,'cosas');if(!c)return exhausted('COSAS QUE PASAN');enter();let r=remaining(DATA.cosas_que_pasan,'cosas').length;gameContent.innerHTML=head('🟡 COSAS QUE PASAN',`${r} restantes`,'chip-yellow')+`<section class=\"card yellow\"><h2 class=\"action-title\">${esc(c.titulo)}</h2><p class=\"flavor\">${esc(c.frase)}</p><p class=\"effect\">${esc(c.efecto)}</p></section><div class=\"actions\"><button class=\"btn btn-yellow\" id=\"again\">OTRA COSA QUE PASA</button>${backButton()}</div>`;document.getElementById('again').onclick=drawThings;bindBack()}"
new_things = "function drawThings(){let c=pick(DATA.cosas_que_pasan,'cosas');if(!c)return exhausted('COSAS QUE PASAN');enter();let r=remaining(DATA.cosas_que_pasan,'cosas').length,sk=savedSourceKey('cosas',c.id);gameContent.innerHTML=head('🟡 COSAS QUE PASAN',`${r} restantes`,'chip-yellow')+`<section class=\"card yellow\"><h2 class=\"action-title\">${esc(c.titulo)}</h2><p class=\"flavor\">${esc(c.frase)}</p><p class=\"effect\">${esc(c.efecto)}</p></section><div class=\"actions\">${saveButton(sk)}<button class=\"btn btn-yellow\" id=\"again\">OTRA COSA QUE PASA</button>${backButton()}</div>`;bindSaveButton({sourceKey:sk,kind:'COSAS QUE PASAN',title:c.titulo,flavor:c.frase,effect:c.efecto});document.getElementById('again').onclick=drawThings;bindBack()}"
rep(old_things, new_things, 'drawThings')

old_inst = "function renderInstinctEffect(c){gameContent.innerHTML=head('🔵 INSTINTO · PODER',`${instinctRemaining()} restantes`,'chip-blue')+`<section class=\"card blue\"><span class=\"subtype\">${subtypeLabel(c.subtipo)}</span><h2 class=\"action-title\">${esc(c.titulo)}</h2><p class=\"flavor\">${esc(c.frase)}</p><p class=\"effect\">${esc(c.efecto)}</p></section>${instActions()}`;document.getElementById('again').onclick=drawInstinct;bindBack()}"
new_inst = "function renderInstinctEffect(c){let sk=savedSourceKey('instinto',c.id);gameContent.innerHTML=head('🔵 INSTINTO · PODER',`${instinctRemaining()} restantes`,'chip-blue')+`<section class=\"card blue\"><span class=\"subtype\">${subtypeLabel(c.subtipo)}</span><h2 class=\"action-title\">${esc(c.titulo)}</h2><p class=\"flavor\">${esc(c.frase)}</p><p class=\"effect\">${esc(c.efecto)}</p></section><div class=\"actions\">${saveButton(sk)}<button class=\"btn btn-blue\" id=\"again\">OTRO INSTINTO</button>${backButton()}</div>`;bindSaveButton({sourceKey:sk,kind:`INSTINTO · ${subtypeLabel(c.subtipo)}`,title:c.titulo,flavor:c.frase,effect:c.efecto});document.getElementById('again').onclick=drawInstinct;bindBack()}"
rep(old_inst, new_inst, 'renderInstinctEffect')

rep("function openReset(){resetModal.classList.add('show')}function closeReset(){resetModal.classList.remove('show')}function resetAll(){localStorage.removeItem(STORAGE_KEY);closeReset();showHome()}", "function openReset(){resetModal.classList.add('show')}function closeReset(){resetModal.classList.remove('show')}function resetAll(){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(SAVED_KEY);closeReset();showHome()}", 'reset')

rep("document.getElementById('startGame').onclick=showHome;", """document.getElementById('startGame').onclick=showHome;\ndocument.getElementById('savedBtn').onclick=showSavedCards;\ndocument.getElementById('confirmSave').onclick=confirmSaveCard;\ndocument.getElementById('cancelSave').onclick=closeSaveCard;\nsaveModal.onclick=e=>{if(e.target===saveModal)closeSaveCard()};\nsaveOwner.addEventListener('keydown',e=>{if(e.key==='Enter')confirmSaveCard()});""", 'listeners')

text = text.replace('Se borrará el historial de preguntas y cartas utilizadas. Todos los mazos volverán a estar completos.', 'Se borrará el historial de preguntas, cartas utilizadas y cartas guardadas. Todos los mazos volverán a estar completos.', 1)

checks = ['id="savedBtn"', 'efd_saved_cards_v1', 'function showSavedCards()', '💾 GUARDAR CARTA / EFECTO', '📖 CÓMO SE JUEGA', 'LA BATALLA FINAL']
for x in checks:
    if x not in text:
        raise SystemExit(f'Verificación fallida: {x}')

p.write_text(text, encoding='utf-8')
print('V16 aplicada correctamente a index.html')

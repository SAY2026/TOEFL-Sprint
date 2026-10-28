/* 配对乐 — Duolingo "Match Madness" style word-pair game, plus a better voice picker.
   Uses main-app globals: state, persist, GL, listsFor, sel, listWords, playWord, addWrong, bookItems, WMAP, go. */
(function(){
const Q=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

/* ---------- better browser voice ---------- */
const PREF=[/Ava.*Multilingual/i,/Andrew.*Multilingual/i,/Emma.*Multilingual/i,/Aria.*Online/i,/Jenny.*Online/i,/Guy.*Online/i,/Online.*Natural/i,/Natural/i,/Google US English/i,/Samantha/i,/Alex/i,/Karen/i,/Daniel/i,/Google UK English Female/i,/en[-_]US/i,/^en/i];
function englishVoices(){try{return speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){return []}}
function bestVoice(){const vs=englishVoices();if(!vs.length)return null;if(state.voice){const v=vs.find(x=>x.name===state.voice);if(v)return v}for(const re of PREF){const v=vs.find(x=>re.test(x.name)||re.test(x.lang));if(v)return v}return vs[0]}
window.pickVoice=bestVoice;
// sentence-by-sentence speech sounds more natural than one long utterance
window.speakBetter=function(text,done){try{speechSynthesis.cancel()}catch(e){}try{AU.pause()}catch(e){}
  const parts=(String(text).match(/[^.!?]+[.!?]+["”’)]?\s*|[^.!?]+$/g)||[text]).map(s=>s.trim()).filter(Boolean);
  const v=bestVoice();let i=0;const next=()=>{if(i>=parts.length){done&&done(true);return}const u=new SpeechSynthesisUtterance(parts[i++]);u.lang="en-US";u.rate=state.rate||0.92;u.pitch=1;if(v)u.voice=v;u.onend=next;u.onerror=()=>{done&&done(false)};speechSynthesis.speak(u)};next()};
function voiceSelector(){
  const vs=englishVoices();if(!vs.length)return"";const cur=bestVoice();
  return `<label class="hint">朗读声音 <select id="voiceSel" style="font:inherit;font-size:13px;padding:3px 6px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);max-width:260px">${vs.map(v=>`<option value="${esc(v.name)}"${cur&&cur.name===v.name?" selected":""}>${esc(v.name.replace(/Microsoft |Google /,""))}${/Natural|Online|Multilingual/i.test(v.name)?" ★":""}</option>`).join("")}</select></label> <button class="say" id="voiceTry">试听</button> <span class="hint">★ = 神经语音(Edge/Chrome 自带,最自然)</span>`;
}
function mountVoiceUI(){const host=document.querySelector(".date-row");if(!host||Q("#voiceSel")||Q("#voiceHost"))return;const d=document.createElement("div");d.id="voiceHost";d.className="date-row";d.innerHTML=voiceSelector();host.after(d);
  const s=Q("#voiceSel");if(s)s.onchange=()=>{state.voice=s.value;persist()};const t=Q("#voiceTry");if(t)t.onclick=()=>window.speakBetter("Students who want to join the debate club should register online before Friday.")}
try{speechSynthesis.addEventListener("voiceschanged",()=>{const h=Q("#voiceHost");if(h)h.remove();mountVoiceUI()})}catch(e){}
setTimeout(mountVoiceUI,800);setTimeout(mountVoiceUI,3000);
// route the app's generic speak() through the better voice (keeps real MP3 playback untouched)
try{if(typeof speak==="function"){window.__speakOrig=speak;speak=function(t){window.speakBetter(t)}}}catch(e){}

/* ---------- 配对乐 ---------- */
const ROUND=5, TOTAL=30, SECS=75;
let g=null,tick=null;
function pool(){
  let ws=[];try{ws=listWords(listsFor(sel))}catch(e){}
  let book=[];try{book=bookItems().map(([k])=>k).filter(k=>k.startsWith("w:")||k.startsWith("g:")).map(k=>{const [t,a,b]=k.split(":");if(t==="g"){const w=GL[+a]?.w[+b];return w?{...w,li:+a,wi:+b}:null}return WMAP[a.toLowerCase()]||null}).filter(Boolean)}catch(e){}
  if(ws.length<ROUND*2){try{ws=ws.concat(listWords(GL.map((_,i)=>i).slice(0,8)))}catch(e){}}
  const seen=new Set();const out=[];for(const w of [...book,...rnd(ws)]){const k=w.w.toLowerCase();if(seen.has(k))continue;seen.add(k);out.push(w);if(out.length>=TOTAL)break}
  return out;
}
function start(){const words=pool();if(words.length<ROUND){Q("#view").innerHTML=`<div class="card"><h3>今天的词还没加载</h3><p class="muted">先打开一次「单词 List」,再回来配对。</p></div>`;return}
  g={words,i:0,ok:0,bad:0,combo:0,best:0,left:[],right:[],selL:null,selR:null,t:SECS,done:false,wrong:[]};nextSet();render();
  clearInterval(tick);tick=setInterval(()=>{if(!g||g.done){clearInterval(tick);return}g.t--;const e=Q("#mtT");if(e){e.textContent=g.t;e.classList.toggle("over",g.t<=10)}if(g.t<=0)finish()},1000)}
function nextSet(){const s=g.words.slice(g.i,g.i+ROUND);g.i+=s.length;g.left=rnd(s).map(w=>({w,id:w.w}));g.right=rnd(s).map(w=>({w,id:w.w}))}
function render(){
  const M=state.match||{};
  Q("#view").innerHTML=`<div class="card mt-wrap"><div class="row" style="justify-content:space-between;margin-top:0"><div><div class="eyebrow">配对乐 · 单词 ↔ 中文</div><h2>${g?`第 ${Math.min(g.i,g.words.length)} / ${g.words.length} 词`:"今天的词,限时配对"}</h2></div>
  ${g&&!g.done?`<div class="row" style="margin-top:0"><span class="mt-stat">✓ <b id="mtOk">${g.ok}</b></span><span class="mt-stat">🔥 <b id="mtCombo">${g.combo}</b></span><span class="mk-timer" id="mtT">${g.t}</span></div>`:""}</div>
  ${!g?`<p class="muted">像多邻国的「配对乐」:左边英文、右边中文,点一个再点另一个,配对成功就消失。每轮 5 对,共 ${TOTAL} 词,${SECS} 秒。配错的词自动进错题本;配对成功会播放原声。${M.best?`<br>最好成绩:<b>${M.best}</b> 对 · 最快 ${M.fast||"—"} 秒`:""}</p>
   <p class="hint">词源:今天的 Word List + 错题本里的单词;不够时补前几个 List。</p><div class="row"><button class="primary" id="mtStart">开始</button><button class="ghost" onclick="go('vocab')">先去听单词</button></div>`
  :g.done?`<div class="mt-end"><div class="mt-big">${g.ok} 对</div><div class="muted">${g.bad} 次配错 · 最长连击 ${g.best} · 用时 ${SECS-Math.max(0,g.t)} 秒</div>
   ${g.wrong.length?`<div class="hint" style="margin-top:8px">进错题本的词:${g.wrong.map(w=>`<b>${esc(w.w)}</b> ${esc(w.z)}`).join(" · ")}</div>`:`<div class="okbox" style="margin-top:8px">全对——这些词今天可以放过了。</div>`}
   <div class="row"><button class="primary" id="mtAgain">再来一轮</button><button class="ghost" onclick="go('book')">看错题本</button></div></div>`
  :`<div class="mt-board"><div class="mt-col" id="mtL">${g.left.map((x,i)=>`<button class="mt-tile${g.selL===i?" sel":""}${x.gone?" gone":""}" data-l="${i}" ${x.gone?"disabled":""}>${esc(x.w.w)}</button>`).join("")}</div>
    <div class="mt-col" id="mtR">${g.right.map((x,i)=>`<button class="mt-tile zh${g.selR===i?" sel":""}${x.gone?" gone":""}" data-r="${i}" ${x.gone?"disabled":""}>${esc(x.w.z)}</button>`).join("")}</div></div>
   <div class="hint" style="margin-top:8px">点左边一个英文,再点右边对应的中文。</div>`}</div>`;
  const s=Q("#mtStart");if(s)s.onclick=start;const a=Q("#mtAgain");if(a)a.onclick=start;
  document.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{g.selL=+b.dataset.l;check();});
  document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{g.selR=+b.dataset.r;check();});
}
function flash(sel,cls){const e=Q(sel);if(!e)return;e.classList.add(cls);setTimeout(()=>e.classList.remove(cls),350)}
function check(){
  if(g.selL==null||g.selR==null){render();return}
  const L=g.left[g.selL],R=g.right[g.selR];
  if(L.id===R.id){L.gone=R.gone=true;g.ok++;g.combo++;g.best=Math.max(g.best,g.combo);try{if(L.w.li!=null&&GL[L.w.li]?.a)playWord(L.w.li,L.w)}catch(e){}
    g.selL=g.selR=null;render();flash(`[data-l="${g.left.indexOf(L)}"]`,"hit");flash(`[data-r="${g.right.indexOf(R)}"]`,"hit");
    if(g.left.every(x=>x.gone)){if(g.i>=g.words.length){finish();return}setTimeout(()=>{nextSet();render()},250)}
  }else{g.bad++;g.combo=0;try{addWrong("w:"+L.w.w)}catch(e){}if(!g.wrong.find(w=>w.w===L.w.w))g.wrong.push(L.w);
    const l=g.selL,r=g.selR;g.selL=g.selR=null;render();flash(`[data-l="${l}"]`,"miss");flash(`[data-r="${r}"]`,"miss")}
}
function finish(){if(!g||g.done)return;g.done=true;clearInterval(tick);const M=state.match=state.match||{hist:[]};const used=SECS-Math.max(0,g.t);
  if(g.ok>(M.best||0)||(g.ok===(M.best||0)&&used<(M.fast||1e9))){M.best=g.ok;M.fast=used}M.hist=[...(M.hist||[]),{d:new Date().toISOString().slice(0,10),ok:g.ok,bad:g.bad,s:used}].slice(-60);persist();render()}
window.vMatch=function(){g=null;clearInterval(tick);render()};
const css=document.createElement("style");css.textContent=`
.mt-stat{font-size:14px;color:var(--ink2)}.mt-stat b{font-family:var(--mono);color:var(--ink)}
.mt-board{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.mt-col{display:flex;flex-direction:column;gap:8px}
.mt-tile{font:inherit;font-size:16px;min-height:52px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);cursor:pointer;padding:8px 10px;text-align:center;transition:transform .12s,background .15s,opacity .25s}
.mt-tile:not(.zh){font-family:var(--display);font-size:19px;font-weight:600}
.mt-tile.zh{font-size:15px}
.mt-tile.sel{border-color:var(--accent);background:var(--accent-soft)}
.mt-tile.hit{background:var(--ok-soft);border-color:var(--ok);transform:scale(1.04)}
.mt-tile.miss{background:var(--warn-soft);border-color:var(--warn);animation:mtshake .3s}
.mt-tile.gone{opacity:0;pointer-events:none}
@keyframes mtshake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.mt-end{text-align:center;padding:18px 0}.mt-big{font-family:var(--display);font-size:44px;font-weight:600}
@media (max-width:420px){.mt-tile{font-size:14px;min-height:46px}.mt-tile:not(.zh){font-size:17px}}`;document.head.appendChild(css);
})();

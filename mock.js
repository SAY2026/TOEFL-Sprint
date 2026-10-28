/* Add-on module: 时间表 (6-hour schedule), 模考 (full 2026-format practice tests), 阅读 (reading drills).
   Loaded after the main app script; uses its globals: state, persist, sample, db, go. Everything else is private. */
(function(){
const Q=s=>document.querySelector(s);
const VIEW=()=>document.getElementById("view");
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const dkey=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rnd(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuf(arr,key){const r=rnd(hash(key));const a=arr.map((v,i)=>[v,i]);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const pctBand=p=>p>=.95?6:p>=.88?5.5:p>=.8?5:p>=.7?4.5:p>=.6?4:p>=.5?3.5:p>=.4?3:p>=.3?2.5:2;
const half=x=>Math.round(x*2)/2;
const MK=()=>{state.mk=state.mk||{runs:{},results:[],blocks:{}};return state.mk};
const ai=()=>{try{return sample}catch(e){return null}};
const store=()=>{try{return db}catch(e){return null}};
let GEN={},RSETS=[];
async function loadExtra(){const d=store();if(!d)return;try{const g=await d.collection("mocks").get();g.docs.forEach(x=>GEN[x.id]=x.data())}catch(e){}try{const r=await d.doc("mk/readsets").get();if(r.exists)RSETS=r.data().sets||[]}catch(e){}}
setTimeout(loadExtra,1500);

/* ---------- speech (multi-voice) + timer ---------- */
let voices=[];const lv=()=>{try{voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){}};try{lv();speechSynthesis.addEventListener("voiceschanged",lv)}catch(e){}
function hush(){try{speechSynthesis.cancel()}catch(e){}try{AU.pause()}catch(e){}}
function say(parts,done){hush();let i=0,fired=false;const fin=ok=>{if(!fired){fired=true;done&&done(ok)}};
  if(!("speechSynthesis" in window)){fin(false);return}
  const next=()=>{if(i>=parts.length)return fin(true);const [vi,t]=parts[i++];const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=(state.rate||0.9);if(voices.length)u.voice=voices[vi%voices.length];u.onend=next;u.onerror=()=>fin(false);try{speechSynthesis.speak(u)}catch(e){fin(false)}};next()}
let tmr=null;
function timer(el,mins){if(tmr)clearInterval(tmr);const end=Date.now()+mins*6e4;const tick=()=>{if(!document.body.contains(el)){clearInterval(tmr);tmr=null;return}const s=Math.round((end-Date.now())/1e3),a=Math.abs(s);el.textContent=(s<0?"+":"")+String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0");el.classList.toggle("over",s<0)};tick();tmr=setInterval(tick,1000)}
function stopT(){if(tmr){clearInterval(tmr);tmr=null}}

/* ================= 时间表 ================= */
function plan(date){
  const wd=date.getDay(),mockDay=wd===3||wd===6,light=wd===0;
  const A=light?["单词：只复习错题本里的单词,30 分钟","读一篇你喜欢的英文文章,出声读,30 分钟","休息——周日的轻量是刻意安排:睡眠和休息在巩固这一周的记忆"]:[
   "05:00–06:00 单词 List:先听原声跟读,再听写(「单词 List」栏)。错词自动进错题本。",
   "06:00–06:45 课文:当天 3 篇里的 1–2 篇,理解做题 → 逐句背(「课文」栏)。",
   "06:45–07:30 阅读限时:一套「阅读」栏里的练习,计时 20 分钟;每道错题写一句「正确答案为什么对」。",
   "07:30–08:00 句子 10 个:熟读 → 首字母背 → 默写(「句子」栏)。"];
  const B=light?["自由。想做的话:一道面试题,45 秒,在「AI 批改」里评分。"]:[
   "09:00–09:45 范文:读懂结构 → 首字母背 → 填空默写(「范文」栏)。",
   "09:45–10:30 写作:一封邮件(限时 7 分钟)+ 一篇学术讨论(限时 10 分钟),贴进「AI 批改」,按范文重写一次。",
   "10:30–11:20 口语:面试题 6 道,每道 45 秒,出声答并用手机录音;挑 2 道打字进「AI 批改」。",
   "11:20–12:00 刷题:「刷题」栏的补全单词 + 速测 + 综合卷。"];
  const C=mockDay?["17:00–18:30 整套模考(「模考」栏),四部分连做、计时、不暂停。","18:30–19:00 复盘:看全部听力原文,写下丢分最多的三处,加入错题本。"]:light?["休息。"]:[
   "17:00–17:20 单词第二轮:把早上的新词再过一遍(同日间隔复习)。",
   "17:20–18:20 最弱项专练:上一次模考分最低的那一部分。",
   "18:20–19:00 错题本重做 + 听一段课文原声跟读。"];
  return{A,B,C,mockDay,light};
}
window.vPlan=function(){
  const k=dkey(),b=(MK().blocks[k]||{}),p=plan(new Date());
  const blk=(id,time,title,items)=>`<div class="mk-block ${b[id]?"done":""}"><div class="mk-time">${time}</div><div><label class="mk-head"><input type="checkbox" data-mb="${id}" ${b[id]?"checked":""}> ${title}</label><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>`;
  const ph=new Date()<new Date(2026,10,16)?"第一阶段 · 到 11 月中旬首考:总分 5.0、口语 4.5(普林斯顿 MPP / 威斯康星 / TC 线;斯坦福已豁免)":"第二阶段 · 到 12 月二考:总分 5.5、口语 5.0(哈佛 Ed.M. 线)";
  VIEW().innerHTML=`<div class="mk-grid"><div class="mk-stack">
   <div class="card"><div class="eyebrow">${esc(ph)}</div><h2 style="margin-top:4px">${new Date().toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"long"})}</h2><div class="hint" style="margin-top:4px">每天 6 小时:早 3 小时输入、上午 3 小时输出,傍晚 2 小时模考或复盘${p.mockDay?' · <span class="pill">今天模考</span>':''}${p.light?' · <span class="pill">轻量日</span>':''}</div></div>
   ${blk("a","05:00–08:00","输入:单词、课文、阅读、句子",p.A)}
   ${blk("b","09:00–12:00","输出:范文、写作、口语、刷题",p.B)}
   ${blk("c","17:00–19:00",p.mockDay?"整套模考":"复习与最弱项",p.C)}
   <div class="row"><button class="ghost small" onclick="go('mock')">打开模考</button><button class="ghost small" onclick="go('read')">打开阅读</button><button class="ghost small" onclick="go('coach')">打开 AI 批改</button></div>
  </div><div class="mk-stack">
   <div class="card"><div class="eyebrow">为什么这样安排(科学记忆法)</div><dl class="mk-sci">
    <dt>间隔重复</dt><dd>新词在快要忘记之前回来:当天傍晚、次日、3 天、7 天、16 天。只复习到期的,比整表重读快得多。</dd>
    <dt>提取练习</dt><dd>自测胜过重读。每一段都以你「产出一个答案」结束,而不是读一个答案。</dd>
    <dt>同日第二轮</dt><dd>17:00 的单词复习,是早上新词在同一天内的第一次间隔。</dd>
    <dt>交错练习</dt><dd>阅读题型按星期轮换;混合练习做起来更难,但迁移到真实考试更好。</dd>
    <dt>生成效应</dt><dd>用新词自己造句、默写范文,比抄定义记得牢。</dd>
    <dt>睡眠</dt><dd>记忆在睡眠中巩固。5 点起床意味着 21:30 左右要睡;周日刻意减量。</dd>
   </dl></div>
   <div class="card"><div class="eyebrow">一周两套模考</div><p class="muted" style="margin:6px 0 0">周三、周六 17:00。内置两套原创 2026 新题型整卷;之后每周用 AI 写一套新卷(约 3 分钟)。</p></div>
  </div></div>`;
  document.querySelectorAll("[data-mb]").forEach(cb=>cb.onchange=()=>{const m=MK();m.blocks[k]={...(m.blocks[k]||{}),[cb.dataset.mb]:cb.checked};persist();window.vPlan()});
};

/* ================= 模考 ================= */
const SEC=[["reading","阅读","R",27],["listening","听力","L",27],["writing","写作","W",23],["speaking","口语","S",8]];
let cur=null,cs="reading";
const allMocks=()=>[...(typeof MOCKS!=="undefined"?MOCKS:[]),...Object.values(GEN).sort((a,b)=>(a.created||0)-(b.created||0))];
window.vMock=function(){
  if(cur)return runner();stopT();
  const L=allMocks(),runs=MK().runs;
  VIEW().innerHTML=`<div class="mk-stack"><div class="card"><div class="eyebrow">每周两套 · 周三、周六 17:00</div><h2 style="margin-top:4px">整套模考(2026 新题型)</h2>
  <p class="muted" style="margin:6px 0 0">阅读(补全单词、生活短文、学术文章)· 听力(选择回应、对话、通知、学术讲座,播放一次)· 写作(连词成句、邮件、学术讨论)· 口语(听后复述、面试)。约 85 分钟。题目为原创模拟题,不是 ETS 真题;官方免费整卷见页底链接。</p></div>
  <div class="card"><div class="mk-tw"><table class="mk-t"><thead><tr><th>试卷</th><th>阅读</th><th>听力</th><th>写作</th><th>口语</th><th>总分</th><th></th></tr></thead><tbody>
  ${L.map(m=>{const r=runs[m.id]||{};const c=x=>r[x]?`<td class="n">${r[x].band.toFixed(1)}</td>`:`<td class="muted">—</td>`;const o=["R","L","W","S"].every(x=>r[x])?half((r.R.band+r.L.band+r.W.band+r.S.band)/4):null;return`<tr><td>${esc(m.title.replace("Practice Test","模考"))}${m.gen?' <span class="pill">AI 编写</span>':''}</td>${c("R")}${c("L")}${c("W")}${c("S")}<td class="n">${o?`<b>${o.toFixed(1)}</b>`:"—"}</td><td><button class="primary small" data-op="${m.id}">${Object.keys(r).length?"继续/重做":"开始"}</button></td></tr>`}).join("")}
  </tbody></table></div>
  <div class="row" style="margin-top:12px"><button class="ghost" id="mkGen">用 AI 写一套新模考</button><span class="hint" id="mkGenS">约 2–4 分钟,消耗你的 Claude 用量。</span></div></div>
  ${MK().results.length?`<div class="card"><div class="eyebrow">成绩记录</div><div class="mk-tw"><table class="mk-t" style="margin-top:6px"><thead><tr><th>日期</th><th>试卷</th><th>R</th><th>L</th><th>W</th><th>S</th><th>总</th></tr></thead><tbody>${[...MK().results].sort((a,b)=>a.date<b.date?-1:1).map(r=>`<tr><td class="n">${r.date.slice(5)}</td><td>${esc((allMocks().find(m=>m.id===r.mock)||{title:r.mock}).title.replace("Practice Test","模考"))}</td><td class="n">${r.R}</td><td class="n">${r.L}</td><td class="n">${r.W}</td><td class="n">${r.S}</td><td class="n"><b>${r.O.toFixed(1)}</b></td></tr>`).join("")}</tbody></table></div><div class="hint" style="margin-top:6px">目标:11 月中旬 5.0(口语 4.5)· 12 月 5.5(口语 5.0)。分数为估算。</div></div>`:""}
  </div>`;
  document.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>{cur=allMocks().find(m=>m.id===b.dataset.op);cs="reading";runner()});
  Q("#mkGen").onclick=genMock;
};
function runner(){
  const m=cur,r=MK().runs[m.id]||{};hush();
  VIEW().innerHTML=`<div class="card"><div class="row" style="justify-content:space-between"><div><div class="eyebrow">${esc(m.title.replace("Practice Test","模考"))}</div><h2>${SEC.find(s=>s[0]===cs)[1]}</h2></div><div class="row"><span class="mk-timer" id="mkT">--:--</span><button class="ghost small" id="mkBack">全部试卷</button></div></div>
  <div class="mk-sectabs">${SEC.map(([k,n,c])=>`<button data-sc="${k}" class="${k===cs?"on":""}">${n}${r[c]?` <b>${r[c].band.toFixed(1)}</b>`:""}</button>`).join("")}</div><div id="mkSec"></div></div>`;
  Q("#mkBack").onclick=()=>{cur=null;hush();window.vMock()};
  document.querySelectorAll("[data-sc]").forEach(b=>b.onclick=()=>{cs=b.dataset.sc;runner()});
  const [k,,code,mins]=SEC.find(s=>s[0]===cs);timer(Q("#mkT"),mins);
  ({reading:secR,listening:secL,writing:secW,speaking:secS})[k](Q("#mkSec"),m[k],m.id,code);
}
function record(mid,code,band,detail){const M=MK();M.runs[mid]={...(M.runs[mid]||{}),[code]:{band,detail,date:dkey()}};const r=M.runs[mid];
  if(["R","L","W","S"].every(x=>r[x])){const O=half((r.R.band+r.L.band+r.W.band+r.S.band)/4);M.results=M.results.filter(x=>x.mock!==mid);M.results.push({date:dkey(),mock:mid,R:r.R.band,L:r.L.band,W:r.W.band,S:r.S.band,O})}persist()}
function mcq(q,key,n){return `<div class="mk-q" data-q="${key}"><div class="mk-qt">${n}. ${esc(q.q)}</div>${shuf(q.o,key).map(([t,oi])=>`<label class="mk-opt"><input type="radio" name="${key}" value="${oi}"> <span>${esc(t)}</span></label>`).join("")}</div>`}
function gradeMC(root){let right=0,total=0;root.querySelectorAll("[data-q]").forEach(d=>{total++;const s=d.querySelector("input:checked");d.querySelectorAll(".mk-opt").forEach(o=>{const i=o.querySelector("input");if(i.value==="0")o.classList.add("right");else if(i.checked)o.classList.add("wrong");i.disabled=true});if(s&&s.value==="0")right++});return{right,total}}
function parseC(t){const out=[];const re=/\[([^|\]]*)\|([^\]]*)\]/g;let last=0,m;while((m=re.exec(t))){out.push({x:t.slice(last,m.index)});out.push({a:m[1],b:m[2]});last=re.lastIndex}out.push({x:t.slice(last)});return out}
function ctest(t,key){let n=0;return `<div class="mk-ctest">`+parseC(t).map(p=>p.x!==undefined?esc(p.x):`${esc(p.a)}<input type="text" data-c="${key}${n++}" data-ans="${esc(p.b)}" size="${Math.max(2,p.b.length+1)}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="缺失字母">`).join("")+`</div>`}
function gradeC(root){let r=0,t=0;root.querySelectorAll("[data-c]").forEach(i=>{t++;const ok=i.value.trim().toLowerCase()===i.dataset.ans.toLowerCase();if(ok)r++;i.classList.add(ok?"right":"wrong");if(!ok){i.value=(i.value||"_")+" → "+i.dataset.ans;i.size=Math.max(i.size,i.value.length)}i.disabled=true});return{right:r,total:t}}
function readingHTML(R,key){let n=0;return `<h3>补全单词 Complete the Words</h3><p class="hint">补上每个词缺失的后半部分。</p>${R.ctest.map((t,i)=>`<div class="passage" style="margin-bottom:10px">${ctest(t,key+"c"+i+"_")}</div>`).join("")}
 <h3 style="margin-top:16px">生活短文 Read in Daily Life</h3>${R.daily.map((d,i)=>`<div class="passage" style="margin-top:10px;white-space:pre-wrap">${esc(d.text)}</div>${d.qs.map((x,j)=>mcq(x,key+"d"+i+"_"+j,++n)).join("")}`).join("")}
 <h3 style="margin-top:16px">学术文章 Read an Academic Text</h3>${R.academic.map((a,i)=>`<div class="eyebrow" style="margin-top:12px">${esc(a.title||"")}</div><div class="passage" style="margin-top:4px;white-space:pre-wrap">${esc(a.text)}</div>${a.qs.map((x,j)=>mcq(x,key+"a"+i+"_"+j,++n)).join("")}`).join("")}`}
function secR(el,R,mid,code,after){
  el.innerHTML=readingHTML(R,mid+"R")+`<div class="row" style="margin-top:14px"><button class="primary" id="mkSub">交卷(阅读)</button><span id="mkRes"></span></div>`;
  Q("#mkSub").onclick=()=>{const c=gradeC(el),m=gradeMC(el),right=c.right+m.right,total=c.total+m.total,band=pctBand(right/total);Q("#mkRes").innerHTML=`<span class="band">${band.toFixed(1)}</span> <span class="muted">${right}/${total} · 补全单词 ${c.right}/${c.total} · 选择题 ${m.right}/${m.total}</span>`;Q("#mkSub").disabled=true;stopT();if(code)record(mid,code,band,{right,total});after&&after(band)};
}
function secL(el,L,mid,code){
  let n=0;const P=[];const pb=(id,parts)=>{P.push([id,parts]);return `<div class="row" style="margin-top:10px"><button class="ghost small" id="${id}">▶ 播放(仅一次)</button><span class="hint" id="${id}s"></span></div>`};
  let h=`<div class="note">每段录音只播放一次,和真实考试一样。戴耳机。交卷后显示原文。</div><h3 style="margin-top:12px">选择回应 Listen and Choose a Response</h3>`;
  h+=L.responses.map((r,i)=>pb("mkr"+i,[[1,r.say]])+mcq({q:"选出最自然的回应。",o:r.o},mid+"Lr"+i,++n)+`<div class="mk-tr" hidden>${esc(r.say)}</div>`).join("");
  h+=`<h3 style="margin-top:16px">对话 Listen to a Conversation</h3>`+L.convos.map((c,i)=>{const sp=[...new Set(c.lines.map(l=>l[0]))];return pb("mkc"+i,c.lines.map(l=>[sp.indexOf(l[0]),l[1]]))+c.qs.map((x,j)=>mcq(x,mid+"Lc"+i+"_"+j,++n)).join("")+`<div class="mk-tr" hidden>${esc(c.lines.map(l=>l[0]+": "+l[1]).join("\n"))}</div>`}).join("");
  h+=`<h3 style="margin-top:16px">通知 Listen to an Announcement</h3>`+L.announce.map((a,i)=>pb("mka"+i,[[2,a.text]])+a.qs.map((x,j)=>mcq(x,mid+"La"+i+"_"+j,++n)).join("")+`<div class="mk-tr" hidden>${esc(a.text)}</div>`).join("");
  h+=`<h3 style="margin-top:16px">学术讲座 Listen to an Academic Talk</h3>`+L.talks.map((a,i)=>pb("mkt"+i,[[3,a.text]])+a.qs.map((x,j)=>mcq(x,mid+"Lt"+i+"_"+j,++n)).join("")+`<div class="mk-tr" hidden>${esc(a.text)}</div>`).join("");
  el.innerHTML=h+`<div class="row" style="margin-top:14px"><button class="primary" id="mkSub">交卷(听力)</button><span id="mkRes"></span></div>`;
  P.forEach(([id,parts])=>{const b=Q("#"+id);b.onclick=()=>{b.disabled=true;Q("#"+id+"s").textContent="播放中…";say(parts,ok=>{const s=Q("#"+id+"s");if(s)s.textContent=ok?"播放完毕":"此浏览器无法朗读——交卷后看原文作答"})}});
  Q("#mkSub").onclick=()=>{hush();const m=gradeMC(el);el.querySelectorAll(".mk-tr").forEach(t=>t.hidden=false);const band=pctBand(m.right/m.total);Q("#mkRes").innerHTML=`<span class="band">${band.toFixed(1)}</span> <span class="muted">${m.right}/${m.total}</span>`;Q("#mkSub").disabled=true;stopT();record(mid,code,band,m)};
}
const WR="You are a TOEFL iBT (2026 format) writing rater for an adult Chinese-speaking learner. Score on the 1–6 scale in half-band steps using the official descriptors.";
const selfRate=(id,label)=>`<span class="hint">${label}</span><select id="${id}">${[1,2,3,3.5,4,4.5,5,5.5,6].map(v=>`<option${v===4?" selected":""}>${v}</option>`).join("")}</select>`;
function secW(el,W,mid,code){
  const ord={};
  el.innerHTML=`<h3>连词成句 Build a Sentence</h3><p class="hint">按顺序点选词块回答问题;点已放好的词块可以撤回。</p>
  ${W.build.map((b,i)=>{ord[i]=[];return `<div class="mk-q"><div class="mk-qt">${i+1}. “${esc(b.c)}”</div><div class="mk-built" id="mkbt${i}"></div><div class="mk-chips">${shuf(b.a,mid+"b"+i).map(([t,oi])=>`<button class="mk-chip" data-bi="${i}" data-oi="${oi}">${esc(t)}</button>`).join("")}</div></div>`}).join("")}
  <h3 style="margin-top:16px">邮件 Write an Email · 7 分钟</h3><div class="passage" style="white-space:pre-wrap">${esc(W.email)}</div><textarea id="mkE" style="margin-top:8px;width:100%;min-height:120px" placeholder="Dear …"></textarea><div class="hint" id="mkEn">0 词</div>
  <h3 style="margin-top:16px">学术讨论 Academic Discussion · 10 分钟</h3><div class="passage" style="white-space:pre-wrap"><b>Professor:</b> ${esc(W.disc.prof)}\n\n${W.disc.posts.map(p=>"<b>"+esc(p[0])+":</b> "+esc(p[1])).join("\n\n")}</div><textarea id="mkD" style="margin-top:8px;width:100%;min-height:140px" placeholder="你的帖子(100 词以上)"></textarea><div class="hint" id="mkDn">0 词</div>
  <div class="row" style="margin-top:14px"><button class="primary" id="mkSub">交卷(写作)</button><span class="hint" id="mkS"></span></div><div id="mkRes" class="out" style="white-space:normal"></div>`;
  [["#mkE","#mkEn"],["#mkD","#mkDn"]].forEach(([t,l])=>Q(t).oninput=()=>Q(l).textContent=Q(t).value.trim().split(/\s+/).filter(Boolean).length+" 词");
  const draw=i=>{const bt=Q("#mkbt"+i);bt.innerHTML=ord[i].map((oi,p)=>`<button class="mk-chip" data-rm="${i}" data-p="${p}">${esc(W.build[i].a[oi])}</button>`).join("");el.querySelectorAll(`[data-bi="${i}"]`).forEach(c=>c.classList.toggle("used",ord[i].includes(+c.dataset.oi)));bt.querySelectorAll("[data-rm]").forEach(c=>c.onclick=()=>{ord[i].splice(+c.dataset.p,1);draw(i)})};
  el.querySelectorAll("[data-oi]").forEach(c=>c.onclick=()=>{const i=+c.dataset.bi,oi=+c.dataset.oi;if(!ord[i].includes(oi)){ord[i].push(oi);draw(i)}});
  Q("#mkSub").onclick=async()=>{Q("#mkSub").disabled=true;stopT();
    let br=0;W.build.forEach((b,i)=>{const ok=ord[i].length===b.a.length&&ord[i].every((v,j)=>v===j);if(ok)br++;Q("#mkbt"+i).insertAdjacentHTML("afterend",`<div class="hint" style="color:var(--${ok?"ok":"warn"})">${ok?"正确":"答案:"+esc(b.a.join(" "))}</div>`)});
    const bb=pctBand(br/W.build.length),em=Q("#mkE").value.trim(),di=Q("#mkD").value.trim();let eb=null,db2=null,fb="";const S=ai();
    if(S&&(em||di)){Q("#mkS").textContent="AI 正在批改邮件和讨论帖…(20–60 秒)";
      try{const r=await S.json(`${WR}
Grade TWO responses.
TASK A — Write an Email (7 minutes; must address every bullet; appropriate register; about 80–120 words):
${W.email}
RESPONSE A:
${em||"(no response)"}

TASK B — Academic Discussion (10 minutes; clear position, developed reason with example, engages a classmate, 100+ words):
Professor: ${W.disc.prof}
${W.disc.posts.map(p=>p[0]+": "+p[1]).join("\n")}
RESPONSE B:
${di||"(no response)"}

Reply with ONLY JSON: {"email":{"band":number,"fixes":[3 strings quoting her words with corrections, explanation in Chinese],"model":string},"disc":{"band":number,"fixes":[3 strings],"model":string},"one_thing":string in Chinese}. An empty response scores 1.`,{cache:false});
        eb=+r.email?.band||1;db2=+r.disc?.band||1;const Lst=a=>"<ul>"+(a||[]).map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
        fb=`<h4>邮件 · ${eb.toFixed(1)}</h4>${Lst(r.email?.fixes)}<details><summary class="hint">范文</summary><div class="passage" style="white-space:pre-wrap">${esc(r.email?.model)}</div></details><h4>学术讨论 · ${db2.toFixed(1)}</h4>${Lst(r.disc?.fixes)}<details><summary class="hint">范文</summary><div class="passage" style="white-space:pre-wrap">${esc(r.disc?.model)}</div></details><h4>最先要改的一个习惯</h4><div>${esc(r.one_thing)}</div>`;
      }catch(e){fb=`<div class="note">AI 批改没有完成(${esc(e.code||"error")}),请在下面自评。</div>`}}
    const fin=()=>{const band=half(bb*.2+eb*.35+db2*.45);Q("#mkS").innerHTML=`<span class="band">${band.toFixed(1)}</span> <span class="muted">连词成句 ${br}/${W.build.length}</span>`;Q("#mkRes").innerHTML=fb;record(mid,code,band,{br,eb,db:db2})};
    if(eb===null){Q("#mkRes").innerHTML=fb+`<div class="row" style="margin-top:8px">${selfRate("mkse","自评 邮件")}${selfRate("mksd","讨论")}<button class="ghost small" id="mkSave">保存</button></div>`;Q("#mkSave").onclick=()=>{eb=+Q("#mkse").value;db2=+Q("#mksd").value;fin()};return}
    fin()};
}
const wds=s=>s.toLowerCase().replace(/[^a-z0-9' ]/g," ").split(/\s+/).filter(Boolean);
function lcs(a,b){const d=Array.from({length:a.length+1},()=>new Array(b.length+1).fill(0));for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=a[i-1]===b[j-1]?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);return d[a.length][b.length]}
function secS(el,SP,mid,code){
  el.innerHTML=`<div class="note">本页不能录音。每一题<b>先出声说</b>(可以用手机录下来回听),再把你说的打出来。打字检查记忆和内容,手机录音检查发音。</div>
  <h3 style="margin-top:14px">听后复述 Listen and Repeat</h3>${SP.repeat.map((s,i)=>`<div class="mk-q"><div class="row"><b>${i+1}.</b><button class="ghost small" id="mkp${i}">▶ 播放一次</button><span class="hint" id="mkp${i}s"></span></div><input type="text" id="mkpt${i}" style="width:100%;margin-top:6px" placeholder="出声复述后,把你说的打出来"><div class="hint" id="mkpr${i}"></div></div>`).join("")}
  <h3 style="margin-top:16px">面试 Take an Interview · 每题 45 秒,无准备</h3>${SP.interview.map((q,i)=>`<div class="mk-q"><div class="row"><b>${i+1}.</b><button class="ghost small" id="mki${i}">▶ 听题并开始 45 秒</button><span class="mk-timer" id="mkit${i}" style="font-size:14px">00:45</span></div><div class="hint" id="mkiq${i}" hidden>${esc(q)}</div><textarea id="mkia${i}" style="width:100%;min-height:70px;margin-top:6px" placeholder="说完后,把你说的打出来"></textarea></div>`).join("")}
  <div class="row" style="margin-top:14px"><button class="primary" id="mkSub">交卷(口语)</button><span class="hint" id="mkS"></span></div><div id="mkRes" class="out" style="white-space:normal"></div>`;
  SP.repeat.forEach((s,i)=>{const b=Q("#mkp"+i);b.onclick=()=>{b.disabled=true;Q("#mkp"+i+"s").textContent="播放中…";say([[i,s]],ok=>{const x=Q("#mkp"+i+"s");if(x)x.textContent=ok?"现在出声复述":"无法朗读,跳过此题"})}});
  SP.interview.forEach((q,i)=>{const b=Q("#mki"+i);b.onclick=()=>{b.disabled=true;Q("#mkiq"+i).hidden=false;say([[0,q]],()=>{let s=45;const t=Q("#mkit"+i);const h=setInterval(()=>{if(!document.body.contains(t)){clearInterval(h);return}s--;t.textContent="00:"+String(Math.max(0,s)).padStart(2,"0");if(s<=0){clearInterval(h);t.classList.add("over");t.textContent="停"}},1000)})}});
  Q("#mkSub").onclick=async()=>{Q("#mkSub").disabled=true;stopT();hush();
    let acc=0;SP.repeat.forEach((s,i)=>{const a=wds(s),b=wds(Q("#mkpt"+i).value),sc=a.length?lcs(a,b)/a.length:0;acc+=sc;Q("#mkpr"+i).innerHTML=`${Math.round(sc*100)}% · “${esc(s)}”`});
    const rb=pctBand(acc/SP.repeat.length),ans=SP.interview.map((q,i)=>({q,a:Q("#mkia"+i).value.trim()}));let ib=null,fb="";const S=ai();
    if(S&&ans.some(x=>x.a)){Q("#mkS").textContent="AI 正在批改面试回答…(20–60 秒)";
      try{const r=await S.json(`You are a TOEFL iBT (2026 format) speaking rater. The learner gave four 45-second spoken interview answers with no preparation; below are her own transcripts. Judge: direct answer, a reason, a concrete example, a finished last sentence, grammar and vocabulary range. Ignore transcript punctuation.
${ans.map((x,i)=>`Q${i+1}: ${x.q}\nA${i+1}: ${x.a||"(no answer)"}`).join("\n\n")}
Reply with ONLY JSON: {"band": number (1–6, half steps, overall for the four), "fixes":[3 strings quoting her words with corrections, explanation in Chinese], "model": string (a model answer to Q1, about 100 words), "one_thing": string in Chinese}.`,{cache:false});
        ib=+r.band||1;fb=`<h4>面试 · ${ib.toFixed(1)}</h4><ul>${(r.fixes||[]).map(x=>"<li>"+esc(x)+"</li>").join("")}</ul><details><summary class="hint">第 1 题范例回答</summary><div class="passage" style="white-space:pre-wrap">${esc(r.model)}</div></details><h4>最先要改的一个习惯</h4><div>${esc(r.one_thing)}</div>`;
      }catch(e){fb=`<div class="note">AI 批改没有完成(${esc(e.code||"error")})。</div>`}}
    const fin=()=>{const band=half(rb*.4+ib*.6);Q("#mkS").innerHTML=`<span class="band">${band.toFixed(1)}</span> <span class="muted">听后复述 ${Math.round(acc/SP.repeat.length*100)}%</span>`;Q("#mkRes").innerHTML=fb;record(mid,code,band,{rep:acc/SP.repeat.length,ib})};
    if(ib===null){Q("#mkRes").innerHTML=fb+`<div class="row" style="margin-top:8px">${selfRate("mksi","自评 面试")}<button class="ghost small" id="mkSave">保存</button></div>`;Q("#mkSave").onclick=()=>{ib=+Q("#mksi").value;fin()};return}
    fin()};
}

/* ---------- AI 编写新卷 ---------- */
const SCHEMA={
reading:`{"ctest":[2 strings, each a 60-90 word paragraph where exactly 10 words (from the second sentence on) are written as [firstpart|missingpart], e.g. "The [cit|y] grew"],"daily":[2 objects {"text": a 40-120 word notice, email, message or ad,"qs":[2 or 3 objects {"q":string,"o":[4 options, CORRECT ANSWER FIRST]}]}],"academic":[2 objects {"title":string,"text": a 190-230 word academic passage in 3 paragraphs separated by \\n\\n,"qs":[5 objects {"q","o":[4, CORRECT FIRST]}: main idea, detail, vocabulary in context, inference, purpose]}]}`,
listening:`{"responses":[8 objects {"say": one spoken sentence,"o":[4 possible replies, the natural pragmatic reply FIRST]}],"convos":[2 objects {"lines":[[speaker,text], 6-8 turns, campus life],"qs":[2 objects {"q","o":[4, CORRECT FIRST]}]}],"announce":[1 object {"text": 80-110 words,"qs":[2 objects]}],"talks":[2 objects {"text": a 130-180 word academic mini-lecture,"qs":[3 objects]}]}`,
writing:`{"build":[8 objects {"c": a short question someone asks,"a":[3-5 chunks that, in this order, form a natural answer]}],"email": a situation plus "Write an email to NAME. In your email:" and three bullet points (use \\n and •),"disc":{"prof": a professor's discussion question on education, technology or society,"posts":[["Name1", 2-3 sentence post],["Name2", 2-3 sentence post taking a different view]]}}`,
speaking:`{"repeat":[7 campus or daily-life sentences growing from 7 to 18 words],"interview":[4 personal-experience or opinion questions on learning, work, community or technology]}`};
async function genMock(){const S=ai();if(!S){Q("#mkGenS").textContent="这个视图里 AI 不可用。";return}
  const b=Q("#mkGen");b.disabled=true;const id="g"+Date.now().toString(36),mock={id,title:"Practice Test "+(allMocks().length+1),gen:true,created:Date.now()};
  const avoid=allMocks().flatMap(m=>(m.reading?.academic||[]).map(a=>a.title)).join("; ");
  try{for(const k of ["reading","listening","writing","speaking"]){Q("#mkGenS").textContent="正在编写"+({reading:"阅读",listening:"听力",writing:"写作",speaking:"口语"})[k]+"部分…";
      const r=await S.json(`Write ORIGINAL practice material for the ${k} section of the TOEFL iBT in its 2026 format (not copied from ETS), at an upper-intermediate to advanced level (target band 5–5.5). Varied topics: campus life, education, science, society, development — avoid these titles: ${avoid}. Plain, natural, error-free English. Return ONLY JSON of this shape:\n${SCHEMA[k]}`,{cache:false});
      if(!r||typeof r!=="object")throw{code:"invalid_json"};mock[k]=r}
    if(!mock.reading?.ctest||!mock.listening?.responses||!mock.writing?.build||!mock.speaking?.repeat)throw{code:"invalid_json"};
    GEN[id]=mock;const d=store();if(d){try{await d.collection("mocks").doc(id).set(mock)}catch(e){}}
    Q("#mkGenS").textContent="已完成:"+mock.title.replace("Practice Test","模考");setTimeout(window.vMock,600);
  }catch(e){const x=Q("#mkGenS");if(x)x.textContent=({not_granted:"你拒绝了本页使用 AI。",rate_limited:"请求太多,稍后再试。",invalid_json:"返回格式不对,再试一次。"})[e.code]||"没有完成,再试一次。";if(b)b.disabled=false}}

/* ================= 阅读 ================= */
let rd=null;
window.vRead=function(){
  const bank=allMocks().map(m=>({id:m.id,title:m.title.replace("Practice Test","模考")+" · 阅读",R:m.reading}));
  if(rd){VIEW().innerHTML=`<div class="card"><div class="row" style="justify-content:space-between"><div><div class="eyebrow">阅读限时练习 · 20 分钟</div><h2>${esc(rd.title)}</h2></div><div class="row"><span class="mk-timer" id="mkT">--:--</span><button class="ghost small" id="mkBack">返回</button></div></div><div id="mkSec" style="margin-top:10px"></div></div>`;
    Q("#mkBack").onclick=()=>{rd=null;stopT();window.vRead()};timer(Q("#mkT"),20);
    secR(Q("#mkSec"),rd.R,rd.id+"-drill",null,band=>{const M=MK();M.drills=[...(M.drills||[]),{d:dkey(),t:rd.title,b:band}].slice(-60);persist()});return}
  stopT();const M=MK();
  VIEW().innerHTML=`<div class="mk-stack"><div class="card"><div class="eyebrow">05:00–08:00 时段 · 06:45–07:30</div><h2 style="margin-top:4px">阅读题库(2026 新题型)</h2><p class="muted" style="margin:6px 0 0">每套 = 2 段补全单词 + 生活短文 + 2 篇学术文章,限时 20 分钟。每道错题写一句「正确答案为什么对」,不写「我为什么错」。这里的题是按新题型原创的模拟题;ETS 真题受版权保护,官方免费真题请用下面的链接。</p>
   <div class="row" style="margin-top:10px"><button class="primary" id="mkGR">AI 新出一套阅读</button><span class="hint" id="mkGRS">约 1 分钟。</span></div></div>
   <div class="card"><div class="mk-tw"><table class="mk-t"><thead><tr><th>套题</th><th>内容</th><th>最近成绩</th><th></th></tr></thead><tbody>
   ${[...bank,...RSETS].map(b=>{const last=(M.drills||[]).filter(x=>x.t===b.title).slice(-1)[0];return `<tr><td>${esc(b.title)}</td><td class="muted">2 补全 · ${b.R.daily.length} 短文 · ${b.R.academic.length} 学术</td><td class="n">${last?last.b.toFixed(1):"—"}</td><td><button class="ghost small" data-rd="${b.id}">打开</button></td></tr>`}).join("")}
   </tbody></table></div></div>
   <div class="card"><div class="eyebrow">官方与免费整卷</div><div style="margin-top:8px;line-height:2"><a href="https://www.ets.org/toefl/test-takers/ibt/prepare/sample-test-jan-2026-1.html" target="_blank" rel="noopener">ETS 官方免费整卷(2026)</a> · <a href="https://www.ets.org/toefl/test-takers/ibt/prepare/toefl-testready.html" target="_blank" rel="noopener">ETS TestReady</a> · <a href="https://tstprep.com/articles/toefl/complete-practice-test-for-the-toefl-test/" target="_blank" rel="noopener">TST Prep 免费整卷</a> · <a href="https://www.toeflresources.com/blog/2026_toefl_format_revealed/" target="_blank" rel="noopener">2026 新题型说明</a></div></div></div>`;
  document.querySelectorAll("[data-rd]").forEach(b=>b.onclick=()=>{rd=[...bank,...RSETS].find(x=>x.id===b.dataset.rd);window.vRead()});
  Q("#mkGR").onclick=async()=>{const S=ai();if(!S){Q("#mkGRS").textContent="这个视图里 AI 不可用。";return}Q("#mkGR").disabled=true;Q("#mkGRS").textContent="正在编写…";
    try{const r=await S.json(`Write ORIGINAL TOEFL iBT 2026-format reading practice (not ETS material), band 5–5.5 level, on education, development, science or society. Return ONLY JSON:\n${SCHEMA.reading}`,{cache:false});if(!r?.ctest||!r?.academic)throw{code:"invalid_json"};
      const set={id:"rs"+Date.now().toString(36),title:"AI 阅读 "+(RSETS.length+1),R:r};RSETS=[...RSETS,set].slice(-20);const d=store();if(d){try{await d.doc("mk/readsets").set({sets:RSETS})}catch(e){}}rd=set;window.vRead()}
    catch(e){Q("#mkGRS").textContent="没有完成("+(e.code||"error")+"),再试一次。";Q("#mkGR").disabled=false}};
};
})();

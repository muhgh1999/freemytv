const C=window.CFG,TZ='Asia/Riyadh',SAVER=location.hash=='#saver';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const A=window.Android||{launch(){},apps:()=>'[]',input(){},settings(){}};
const n=x=>new Intl.NumberFormat('ar-EG').format(x);
const DF=o=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab',{timeZone:TZ,...o});
const fDate=DF({weekday:'long',day:'numeric',month:'long'}),fTime=DF({hour:'numeric',minute:'2-digit',hour12:true}),fYmd=new Intl.DateTimeFormat('en-CA',{timeZone:TZ});
const ymd=d=>fYmd.format(d);
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const load=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const J=async(u,o)=>{const r=await fetch(u,o);if(!r.ok)throw r.status;return r.json()};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tp=d=>{const o={};fTime.formatToParts(d).forEach(p=>o[p.type]=p.value);return o};
const hm=t=>{const p=tp(new Date(`${ymd(new Date())}T${t}:00+03:00`));return p.hour+':'+p.minute};
const K=['Fajr','Dhuhr','Asr','Maghrib','Isha'],AR=['الفجر','الظهر','العصر','المغرب','العشاء'];
const TA={'Al Hilal':'الهلال','Al Nassr':'النصر','Al Ahli':'الأهلي','Al Ittihad':'الاتحاد','Al Ettifaq':'الاتفاق','Al Taawoun':'التعاون','Al Fateh':'الفتح','Al Fayha':'الفيحاء','Al Qadsiah':'القادسية','Al Shabab':'الشباب','Al Raed':'الرائد','Al Khaleej':'الخليج','Damac':'ضمك','Al Okhdood':'الأخدود','Al Riyadh':'الرياض','Al Kholood':'الخلود','Al Orobah':'العروبة','Neom':'نيوم','Real Madrid':'ريال مدريد','Barcelona':'برشلونة','Liverpool':'ليفربول','Manchester City':'مانشستر سيتي','Manchester United':'مانشستر يونايتد','Arsenal':'أرسنال','Chelsea':'تشيلسي'};
const LG=[{n:'السعودي',t:'الدوري السعودي',id:4668},{n:'الإنجليزي',t:'الدوري الإنجليزي الممتاز',id:4328},{n:'الإسباني',t:'الدوري الإسباني',id:4335},{n:'أبطال أوروبا',t:'دوري أبطال أوروبا',id:4480},{n:'أبطال آسيا',t:'دوري أبطال آسيا',id:0}];
const ICON={Netflix:'NETFLIX','ثمانية':'◆',Arena:'◉'};
const LGX=/saudi|english premier|spanish la liga|uefa champions|afc champions/i;
const WC=c=>c==0?'صافٍ':c<3?'غائم جزئيًا':c==3?'غائم':c<50?'ضباب':c<70?'ممطر':c<80?'ثلج':c<90?'زخات مطر':'عاصف';
let P={},W=load('wx'),M=null,E=load('eps'),TB={},apps=load('apps')||C.apps,LGi=0,nx=null,lastDay='',lastNx='',cur={r:0,c:0},hold,held=0,pg=0,pk=null;

function tick(){const d=new Date(),p=tp(d);
 $$('.t-date').forEach(e=>e.textContent=fDate.format(d));
 $$('.t-clock').forEach(e=>e.textContent=p.hour+':'+p.minute);
 $$('.t-ap').forEach(e=>e.textContent=p.dayPeriod||'');
 $$('.t-dt').forEach(e=>e.textContent=fDate.format(d)+'  ·  '+fTime.format(d));
 const k=ymd(d);if(k!=lastDay){lastDay=k;ensurePray();renderCd();getEps()}
 nx=nextPray();const key=nx?nx.i+nx.d:'';if(key!=lastNx){lastNx=key;renderPray();renderNext()}}
async function ensurePray(){for(const off of[0,1]){const d=ymd(new Date(Date.now()+off*864e5));if(P[d])continue;const c=load('p'+d);if(c){P[d]=c;continue}
 try{const[y,m,dd]=d.split('-'),j=await J(`https://api.aladhan.com/v1/timings/${dd}-${m}-${y}?latitude=${C.lat}&longitude=${C.lon}&method=4`),t=j.data.timings;P[d]=Object.fromEntries(K.map(k=>[k,t[k].slice(0,5)]));save('p'+d,P[d])}catch(e){}}
 lastNx=''}
function nextPray(){const now=Date.now();for(const off of[0,1]){const d=ymd(new Date(now+off*864e5)),T=P[d];if(!T)continue;for(let i=0;i<5;i++){const at=new Date(`${d}T${T[K[i]]}:00+03:00`);if(at>now)return{i,d,at}}}return null}
function renderPray(){const T=P[ymd(new Date())],e=$('#pl');if(!e)return;e.innerHTML=K.map((k,i)=>`<div class="pr${nx&&nx.i==i&&nx.d==ymd(new Date())?' nx':''}"><span>${AR[i]}</span><b>${T?hm(T[k]):'—'}</b></div>`).join('')}
function renderNext(){$$('.nx').forEach(e=>e.innerHTML=nx?`الصلاة القادمة <b>${AR[nx.i]} · ${fTime.format(nx.at)}</b>`:'')}
function ramadan(){const H=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{timeZone:TZ,month:'numeric',day:'numeric',year:'numeric'}),g=DF({day:'numeric',month:'long'}),p=d=>Object.fromEntries(H.formatToParts(d).map(x=>[x.type,x.value]));
 const t=p(new Date());if(t.month=='9')return{t:'رمضان مبارك',d:'اليوم '+n(t.day)};
 for(let i=1;i<=400;i++){const d=new Date(Date.now()+i*864e5),q=p(d);if(q.month=='9'&&q.day=='1')return{t:`باقي على رمضان ${n(parseInt(q.year))}هـ · متوقع ${g.format(d)}`,d:`${n(i)} ${i<11?'أيام':'يومًا'}`}}
 return{t:'',d:''}}
function renderCd(){const r=ramadan();$$('.cd-t').forEach(e=>e.textContent=r.t);$$('.cd-d').forEach(e=>e.textContent=r.d)}
async function getWx(){try{const j=await J(`https://api.open-meteo.com/v1/forecast?latitude=${C.lat}&longitude=${C.lon}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=${TZ}`);W={t:Math.round(j.current.temperature_2m),c:j.current.weather_code,d:j.current.is_day,h:Math.round(j.daily.temperature_2m_max[0]),l:Math.round(j.daily.temperature_2m_min[0])};save('wx',W)}catch(e){}renderWx()}
function renderWx(){const w=W;$$('.t-wx').forEach(e=>e.innerHTML=w?`${esc(C.city)} <span class="g">${w.d?'☀':'☾'}</span> ${n(w.t)}° ${WC(w.c)}<span class="hl"> &nbsp; العظمى ${n(w.h)}° &nbsp; الصغرى ${n(w.l)}°</span>`:esc(C.city)+' —');
 const c=$('#wxc');if(c)c.innerHTML=w?`<h3>${esc(C.city)} · حالة الجو</h3><div class="big">${n(w.t)}°</div><p>${WC(w.c)} · العظمى ${n(w.h)}° · الصغرى ${n(w.l)}°</p>`:'<h3>حالة الجو</h3><p class="mu">غير متاح</p>'}
async function getMatches(){const d=ymd(new Date());try{const j=await J(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${d}&s=Soccer`);
 M=(j.events||[]).filter(e=>LGX.test(e.strLeague)&&e.strTimestamp).map(e=>({h:e.strHomeTeam,a:e.strAwayTeam,hb:e.strHomeTeamBadge,ab:e.strAwayTeamBadge,at:e.strTimestamp+'Z',hs:e.intHomeScore,as:e.intAwayScore})).filter(m=>ymd(new Date(m.at))==d).sort((a,b)=>new Date(a.at)-new Date(b.at));save('m',{d,M})}
 catch(e){const c=load('m');M=c&&c.d==d?c.M:null}renderMatches()}
function renderMatches(){const bd=(t,b)=>`<span class="bd">${esc((t||'?')[0])}${b?`<img src="${esc(b)}/tiny" alt="">`:''}</span>`;
 let h='<div class="hd"><h3>مباريات اليوم</h3><small class="mu">الموعد والنتيجة</small></div>';
 if(!M)h+='<p class="mu">تعذّر تحميل المباريات</p>';else if(!M.length)h+='<p class="mu">لا توجد مباريات اليوم في الدوريات المختارة</p>';
 else h+=M.slice(0,6).map(m=>{const sc=m.hs!=null&&m.hs!=='';return `<div class="mr"><span class="tmn">${bd(m.h,m.hb)}${TA[m.h]||esc(m.h)}</span><span class="tm">${sc?n(m.hs)+' - '+n(m.as):fTime.format(new Date(m.at))}</span><span class="tmn">${TA[m.a]||esc(m.a)}${bd(m.a,m.ab)}</span></div>`}).join('');
 $('#mt').innerHTML=h}
const season=()=>{const[y,m]=ymd(new Date()).split('-').map(Number);return m>=7?`${y}-${y+1}`:`${y-1}-${y}`};
async function getTable(i){const L=LG[i];if(!L.id)return;try{const j=await J(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${L.id}&s=${season()}`);if(!j.table)throw 0;TB[i]={r:j.table.slice(0,10),at:new Date().toISOString()};save('tb'+i,TB[i])}catch(e){TB[i]=TB[i]||load('tb'+i)}if(i==LGi)renderTable()}
function renderTable(){const L=LG[LGi],T=TB[LGi]||load('tb'+LGi);$$('#lgt .f').forEach((e,i)=>e.classList.toggle('sel',i==LGi));
 let h=`<div class="hd"><h2>${L.t}</h2><small class="mu">${T?'آخر تحديث '+fTime.format(new Date(T.at)):''}</small></div>`;
 if(!L.id)h+='<p class="mu">هذا الدوري يحتاج مصدر بيانات إضافي</p>';else if(!T)h+='<p class="mu">جاري التحميل…</p>';
 else h+='<div class="tr th"><span>#</span><span>النادي</span><span>لعب</span><span>فاز</span><span>تعادل</span><span>خسر</span><span>النقاط</span></div>'+T.r.map((x,i)=>`<div class="tr"><span>${n(x.intRank||i+1)}</span><span>${TA[x.strTeam]||esc(x.strTeam)}</span><span>${n(x.intPlayed)}</span><span>${n(x.intWin)}</span><span>${n(x.intDraw)}</span><span>${n(x.intLoss)}</span><span>${n(x.intPoints)}</span></div>`).join('');
 $('#tbl').innerHTML=h}
const TH={'Content-Type':'application/json','trakt-api-version':'2'};
async function getEps(){let t=load('tk');if(!C.traktId||!t)return renderEps();
 try{if(t.created_at+t.expires_in<Date.now()/1e3+864e3){t=await J('https://api.trakt.tv/oauth/token',{method:'POST',headers:TH,body:JSON.stringify({refresh_token:t.refresh_token,client_id:C.traktId,...(C.traktSecret?{client_secret:C.traktSecret}:{}),redirect_uri:'urn:ietf:wg:oauth:2.0:oob',grant_type:'refresh_token'})});save('tk',t)}
 const j=await J(`https://api.trakt.tv/calendars/my/shows/${ymd(new Date())}/14`,{headers:{...TH,'trakt-api-key':C.traktId,Authorization:'Bearer '+t.access_token}});
 E=j.slice(0,3).map(x=>({s:x.show.title,se:x.episode.season,ep:x.episode.number,at:x.first_aired}));save('eps',E)}catch(e){E=load('eps')}renderEps()}
function renderEps(){const c=$('#eps'),t=load('tk');let h=`<div class="hd"><h3>حلقاتك القادمة</h3><small class="mu">${t?'Trakt متصل':'Trakt غير متصل'}</small></div>`;
 if(!C.traktId)h+='<p class="mu">أضف traktId في config.js</p>';
 else if(!t)h+='<div class="row"><div class="f pill" data-a="trakt">ربط Trakt</div></div>';
 else if(!E)h+='<p class="mu">تعذّر التحميل</p>';else if(!E.length)h+='<p class="mu">لا حلقات قادمة خلال ١٤ يومًا</p>';
 else h+=E.map(x=>{const dd=Math.round((new Date(ymd(new Date(x.at)))-new Date(ymd(new Date())))/864e5);return `<div class="ep"><div class="ps">${esc(x.s.slice(0,8))}</div><div class="ei"><b>${esc(x.s)}</b><small>الموسم ${n(x.se)} · الحلقة ${n(x.ep)}</small></div><small class="when">${dd<=0?'اليوم':dd==1?'غدًا':'بعد '+n(dd)+' أيام'}</small></div>`}).join('');
 c.innerHTML=h;if(pg==2)focus(cur.r,cur.c)}
async function traktLink(){const c=$('#eps');if(!C.traktId){c.innerHTML='<p class="mu">أضف traktId في config.js ثم أعد البناء</p>';return}
 try{const d=await J('https://api.trakt.tv/oauth/device/code',{method:'POST',headers:TH,body:JSON.stringify({client_id:C.traktId})});
  c.innerHTML=`<h3>ربط Trakt</h3><p>افتح ${esc(d.verification_url)} من جوالك وأدخل الرمز</p><div class="big g">${esc(d.user_code)}</div>`;
  const end=Date.now()+d.expires_in*1e3;
  while(Date.now()<end){await new Promise(r=>setTimeout(r,d.interval*1e3));
   try{const t=await J('https://api.trakt.tv/oauth/device/token',{method:'POST',headers:TH,body:JSON.stringify({code:d.device_code,client_id:C.traktId,...(C.traktSecret?{client_secret:C.traktSecret}:{})})});save('tk',t);return getEps()}catch(e){if([404,409,410,418].includes(e))break}}
 }catch(e){}renderEps()}
function renderDock(){$$('.dock').forEach(d=>d.innerHTML=apps.map((a,i)=>`<div class="f tile" data-a="app" data-i="${i}"><i>${ICON[a.n]||'▶'}</i><b>${a.n?esc(a.n):'+ إضافة'}</b></div>`).join(''))}
const pkOpen=()=>$('#pick').classList.contains('on');
const rows=()=>$$(pkOpen()?'#pick .row':'.page.on .row').map(r=>[...r.querySelectorAll('.f')]).filter(r=>r.length);
function focus(r,c){const R=rows();if(!R.length)return;r=Math.max(0,Math.min(R.length-1,r));c=Math.max(0,Math.min(R[r].length-1,c));$$('.focus').forEach(x=>x.classList.remove('focus'));cur={r,c};const el=R[r][c];el.classList.add('focus');el.scrollIntoView({block:'nearest'})}
function go(p){pg=Math.max(0,Math.min(3,p));$$('.page').forEach((e,i)=>e.classList.toggle('on',i==pg));$('#dots').textContent=n(pg+1)+' / '+n(4)+'   ·   تنقّل بالأسهم';focus(0,pg==3?LGi:0)}
function openPick(mode,i){pk={mode,i,back:{...cur}};let L=[];try{L=JSON.parse(A.apps())}catch(e){}L.sort((a,b)=>a.n.localeCompare(b.n,'ar'));
 $('#pick h2').textContent=mode=='launch'?'كل التطبيقات':'اختر التطبيق رقم '+n(i+1);
 $('#pick .list').innerHTML=L.map(a=>`<div class="row"><div class="f pi" data-a="pick" data-p="${esc(a.p)}" data-n="${esc(a.n)}">${esc(a.n)}</div></div>`).join('');
 $('#pick').classList.add('on');focus(0,0)}
function closePick(){$('#pick').classList.remove('on');cur=pk.back;focus(cur.r,cur.c)}
function act(el){const d=el.dataset;switch(d.a){
 case'app':{const a=apps[+d.i];a&&a.p?A.launch(a.p):openPick('assign',+d.i);break}
 case'in':A.input(d.v);break;case'all':openPick('launch');break;case'set':A.settings();break;
 case'lg':LGi=+d.i;renderTable();getTable(LGi);break;
 case'trakt':traktLink();break;
 case'pick':if(pk.mode=='launch')A.launch(d.p);else{apps[pk.i]={n:d.n,p:d.p};save('apps',apps);renderDock()}closePick();break}}
addEventListener('keydown',e=>{if(SAVER)return;const k=e.key;
 if(k=='Enter'){e.preventDefault();if(!e.repeat){held=0;clearTimeout(hold);hold=setTimeout(()=>{const el=$('.focus');if(el&&el.dataset.a=='app'&&!pkOpen()){held=1;openPick('assign',+el.dataset.i)}},700)}return}
 const R=rows();if(!R.length)return;const{r,c}=cur;
 if(k=='ArrowDown')focus(r+1,c);else if(k=='ArrowUp')focus(r-1,c);
 else if(k=='ArrowRight'){if(c>0)focus(r,c-1);else if(!pkOpen())go(pg-1)}
 else if(k=='ArrowLeft'){if(c<R[r].length-1)focus(r,c+1);else if(!pkOpen())go(pg+1)}
 else if(k=='PageUp')go(pg-1);else if(k=='PageDown')go(pg+1);else return;
 e.preventDefault()});
addEventListener('keyup',e=>{if(SAVER||e.key!='Enter')return;clearTimeout(hold);if(!held){const el=$('.focus');el&&act(el)}held=0});
window.onBack=()=>{if(pkOpen())closePick();else if(pg>0)go(pg==3?2:0)};
window.onShow=()=>{if(!SAVER){go(0);getWx();getMatches();getEps()}};
$('#lgt').innerHTML=LG.map((l,i)=>`<div class="f lt" data-a="lg" data-i="${i}">${l.n}</div>`).join('');
renderDock();renderWx();renderCd();tick();setInterval(tick,1000);setInterval(ensurePray,6e4);getWx();setInterval(getWx,9e5);
if(SAVER){$$('.page').forEach(e=>e.classList.toggle('on',e.id=='p5'))}
else{go(0);renderMatches();renderTable();renderEps();getMatches();setInterval(getMatches,12e4);getTable(0);setInterval(()=>getTable(LGi),6e5);setInterval(getEps,18e5)}

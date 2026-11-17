(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P='/pdccarguide/';
const S={get(k,d){try{const v=localStorage.getItem('pdc.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('pdc.'+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let tx=S.get('tx',null),query='';
const BADGE={bad:['b-bad','[DANGER: STOP]'],warn:['b-warn','[CAUTION]'],ok:['b-ok','[PASSED]'],info:['b-info','[STATUS]']};
const bd=k=>`<span class="badge ${BADGE[k][0]}">${BADGE[k][1]}</span>`;

const BLOW=[['Battery','Terminals tight and clean, no corrosion, fluid level OK.'],['Lights','Headlights, brake, signal, hazard and reverse lights all work.'],['Oil','Dipstick between min and max, engine off and level ground.'],['Water','Radiator coolant and washer fluid topped up (engine cold).'],['Brakes','Pedal firm, handbrake holds, brake fluid at level.'],['Air','Check tires including spare (use the pressure on the door placard).'],['Gas','Enough fuel for the session; gauge reads correctly.'],['Engine','Listen at idle for knocks, check belts and leaks.'],['Tire','Tread depth, sidewall damage, lug nuts tight.'],['Self','Rested, sober, licensed, glasses on, phone silenced.']];
const COCK=['Doors closed and locked; bags secured.','Seat: knee slightly bent at full pedal, wrist rests on top of wheel with back against seat.','Steering wheel height: top of wheel at shoulder level, view of the dash clear.','Mirrors: rearview frames the back window; side mirrors show a sliver of your car and the horizon.','Seatbelt on, shoulder strap across the collarbone.','Gear in Neutral (MT) or Park (AT), handbrake on, then start.'];
const LIGHTS=[['oil','Oil pressure','bad','Stop and switch off. Do not drive.'],['battery','Charging system','bad','Charging fault. Head to a shop soon.'],['engine','Check engine','warn','Get it scanned. Steady is service; flashing is serious.'],['abs','ABS','warn','Brakes work but without anti-lock.'],['beam','High beam','info','High beams are on. Dip for oncoming cars.']];
const TXN={MT:[['Find the biting point','With the engine idling, ease the clutch up slowly until the revs dip and the car wants to creep. Hold there and note the pedal height.'],['Smooth upshifts','About 2500 rpm: 1→2 at ~15–20 km/h, 2→3 at ~30, 3→4 at ~45, 4→5 at ~60. Lift the gas, clutch down, shift, clutch up smoothly, gas on.'],['Downshift and rev-match','Brake first, clutch in, blip the throttle as you select the lower gear, release smoothly.'],['Prevent stalls','Press the clutch fully before stopping. Add a little gas as you release in 1st. If it shudders, push the clutch in and restart.'],['Hill start (handbrake)','Handbrake on, 1st gear, find the biting point, add gas, release the handbrake as the car holds, then go.']],
AT:[['Know the selector','P park, R reverse, N neutral, D drive, S/L for sport or low gears on hills. Press the brake to shift out of P.'],['Use creep wisely','Release the brake to crawl in a car park. Brake to stop; never rely on gas against the brake.'],['One foot only','Right foot for gas and brake. Two-foot driving causes sudden jerks and hides brake lights.'],['Smooth throttle','Squeeze, don’t stomp. Kickdown happens if the pedal is floored.'],['Hills','Use L or S on long downhills to let the engine help hold speed.']]};
const MAN=[['Parallel parking (3-point method)',['Pull alongside the front car, 1 m apart, rear bumpers aligned.','Reverse slowly with full lock toward the curb until your car is at 45° (the other car’s headlight shows in your mirror).','Straighten the wheel and reverse until your front clears the rear of the front car.','Full lock away from the curb, tuck in, then straighten and centre the car.'],0],
['90° bay: forward or reverse',['Signal, move wide to the far side of the bay, parallel to the row.','Pick the reference point: the bay line meets your rear door post or mirror.','Turn in with full lock when the reference point arrives, then straighten as the car lines up.','Reverse bays: look over your shoulder; stop with the car centred and the handbrake on.'],0],
['Three-point turn and U-turn',['Signal, pull to the right edge and check mirrors and blind spots.','Full left lock across the road, stop near the curb.','Reverse with full right lock; stop short of the curb.','Full left lock and drive away. U-turn only where signs allow it.'],0],
['Hill start and curb rules',['Uphill with curb: turn wheels away from the curb so the car rolls back to it.','Downhill or no curb uphill: turn wheels toward the curb on downhill, to the road edge when uphill.','Always leave in a low gear and handbrake on when parked.'],0],
['Lane change: MSM + shoulder check',['Mirror: rearview and side mirror.','Signal for at least 3 seconds.','Shoulder check at the blind spot. Maneuver smoothly and cancel the signal.'],0]];
const ROW=[['Uncontrolled intersection','The vehicle on the right goes first; if you arrive together, yield to the right. Slow down and look both ways.'],['Roundabout / rotunda','Yield to traffic already in the circle (usually from the right). Signal when exiting.'],['Emergency vehicles','Move to the side and stop. Don’t block intersections.'],['Pedestrian crossings','Stop for people waiting or crossing. Don’t overtake a stopped vehicle at a crossing.'],['Yellow box junction','Enter only if your exit is clear. Don’t stop inside the box.']];
const SIGNS=[['Stop','Regulatory','Come to a complete stop, yield, then go.'],['Yield / Give way','Priority','Slow down and give way to traffic on the main road.'],['Speed limit','Regulatory','Do not exceed the posted speed.'],['No entry','Regulatory','Do not enter this road.'],['No parking','Regulatory','Don’t park here.'],['Pedestrian crossing','Warning','Be ready to stop.'],['Sharp curve','Warning','Slow before the bend.'],['Slippery road','Warning','Reduce speed, avoid sudden moves.'],['Double yellow line','Marking','No overtaking.'],['Broken white line','Marking','Overtaking allowed if safe.'],['Zebra crossing','Marking','Pedestrians have priority.']];
const EMER=[['Tire blowout',['Grip the wheel firmly and don’t slam the brakes.','Ease off the gas and steer straight.','Slow gradually, signal, and move to a safe spot.','Hazards on; change the tire only on firm ground.']],['Brake failure',['Pump the brake pedal quickly.','Downshift to use engine braking.','Apply the handbrake gradually; don’t lock the rear wheels.','Use a safe run-off or rub the side on a soft barrier, and call for help.']],['Engine overheating',['Turn the heater to maximum to shed heat.','Pull over and switch off.','Wait 30 minutes before opening the hood or radiator cap.','Top up coolant when cool and call for help.']],['Hydroplaning / skidding',['Don’t brake or jerk the steering.','Lift off the gas.','Look and steer where you want to go.','Slow down once you regain grip.']],['Night glare',['Look to the left edge of your lane.','Dim your dash lights; clean the windshield.','Slow down if you can’t see; never stare at the lights.']]];
const RUB=['Pre-drive checks','Cockpit setup','Starting engine','Moving off','Gear shifting','Clutch/throttle control','Steering control','Mirror use','Signalling','Lane position','Speed control','Following distance','Observation at junctions','Right of way','Roundabouts','Turning','Hill start','Parallel parking','Bay parking','Three-point turn','Stopping','Road signs and markings','Pedestrians','Awareness and attitude','Completion and parking'];
const FAILS=['Hit a cone or curb','Failed to yield','Dangerous maneuver or examiner intervened','Disobeyed a traffic sign or signal'];
const MASTERY=['Parallel','Bay','K-turn','Hill start','Lane change'];

// ---- UI helpers ----
function toast(msg,action,fn){const t=document.createElement('div');t.className='toast';t.textContent=msg;if(action){const b=document.createElement('button');b.className='btn';b.textContent=action;b.style.marginInlineStart='8px';b.onclick=fn;t.append(b)}$('#toasts').append(t);setTimeout(()=>t.remove(),action?12000:3500)}
function modal(html){const m=$('#modal');m.innerHTML='<div role="dialog" aria-modal="true" aria-labelledby="mt">'+html+'</div>';m.hidden=false;const f=$('button,input',m);f&&f.focus();m._prev=document.activeElement}
function closeModal(){const m=$('#modal');m.hidden=true;m.innerHTML='';m._prev&&m._prev.focus&&m._prev.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal()});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal()});
function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const c=['#38BDF8','#F59E0B','#10B981'];for(let i=0;i<30;i++){const d=document.createElement('i');d.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-10px;width:8px;height:8px;background:${c[i%3]};z-index:99;pointer-events:none`;document.body.append(d);d.animate([{transform:'translateY(0)'},{transform:`translate(${Math.random()*80-40}px,100vh)`}],{duration:1400+Math.random()*800,easing:'ease-in'}).onfinish=()=>d.remove()}}
const step=(s,i)=>`<li>${esc(s)}</li>`;
const empty=()=>`<div class="empty card"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="28" cy="28" r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 40l14 14" stroke="currentColor" stroke-width="4"/></svg><h3>Nothing matches “${esc(query)}”</h3><p>Try a different word or clear the search.</p><button class="btn primary" data-reset>Reset filters</button></div>`;
const match=s=>!query||s.toLowerCase().includes(query.toLowerCase());
const tipFor=()=>tx?TXN[tx]:TXN.MT;

// ---- views ----
const V={};
V.dashboard=()=>{const b=S.get('blow',[]).length,logs=S.get('logs',[]),hrs=logs.reduce((a,l)=>a+l.h,0),sc=S.get('lastScore',null);
return `<section class="grid"><article class="card"><h2>Welcome back</h2><p>Mode: <strong>${tx==='AT'?'Automatic':'Manual'}</strong>. Work through each module before your assessment.</p><a class="btn primary" href="#pre-drive">Start pre-drive</a></article>
<article class="card row"><div class="ring" style="--p:${b*10}"><b>${b}/10</b></div><div><h3>BLOWBAGETS</h3><p class="cap">${b===10?'All checks complete.':'Checks left: '+(10-b)}</p></div></article>
<article class="card"><h3>Practice hours</h3><p><strong>${hrs.toFixed(1)}</strong> of 8 hours logged.</p><div class="bar"><i style="inline-size:${Math.min(100,hrs/8*100)}%"></i></div><a href="#assessment">Open logbook</a></article>
<article class="card"><h3>Mock exam</h3><p>${sc===null?'Not taken yet.':'Last score: '+sc+'/25'}</p><a class="btn" href="#assessment">Take mock exam</a></article></section><div id="inst"></div>`};
V['pre-drive']=()=>{const done=S.get('blow',[]);const t=tipFor().filter(x=>match(x[0]+x[1]));
return `<section class="card"><div class="row"><div class="ring" style="--p:${done.length*10}"><b>${done.length}/10</b></div><div><h2>BLOWBAGETS check</h2><p class="cap">Tick each item before you drive.</p></div><button class="btn" id="rb">Reset</button></div>
${BLOW.map((x,i)=>`<label class="chk" ><input type="checkbox" data-b="${i}" ${done.includes(i)?'checked':''}><span><strong>${x[0]}</strong>: ${x[1]}</span></label>`).join('')}</section>
<section class="card" style="margin-block:16px"><h2>Cockpit drill</h2><ol>${COCK.map(step).join('')}</ol></section>
<section class="card"><h2>Dashboard lights</h2><div class="lights">${LIGHTS.map(l=>`<div><svg aria-hidden="true"><use href="assets/dashboard-symbols.svg#${l[0]}"/></svg><br><strong>${l[1]}</strong><br>${bd(l[2])}<p class="cap">${l[3]}</p></div>`).join('')}</div></section>
<section style="margin-block:16px"><h2>${tx==='AT'?'Automatic':'Manual'} transmission</h2>${t.length?t.map(x=>`<details><summary>${x[0]}</summary><div>${x[1]}</div></details>`).join(''):empty()}</section>`};
V.maneuvers=()=>{const m=MAN.filter(x=>match(x[0]+x[1].join(' ')));return `<div class="svgbox"><img src="assets/parking-diagrams.svg" alt="Parallel and 90 degree parking diagrams" width="600" height="160"></div>`+(m.length?m.map(x=>`<details open><summary>${x[0]}</summary><div><ol>${x[1].map(step).join('')}</ol></div></details>`).join(''):empty())};
V.rules=()=>{const sg=SIGNS.filter(x=>match(x.join(' '))),rw=ROW.filter(x=>match(x.join(' ')));
return `<section class="card"><h2>3-second following distance</h2><label for="spd">Speed: <output id="so">60</output> km/h</label><input id="spd" type="range" min="20" max="120" step="5" value="60">
<div class="seg" role="group" aria-label="Conditions" style="margin-block:8px"><button data-c="3" aria-pressed="true">Dry</button><button data-c="6" aria-pressed="false">Heavy rain</button><button data-c="4" aria-pressed="false">Night</button></div><p id="dist" aria-live="polite"></p></section>
<h2 style="margin-top:24px">Right of way</h2>${rw.map(x=>`<details><summary>${x[0]}</summary><div>${x[1]}</div></details>`).join('')||''}
<h2 style="margin-top:24px">Road signs and markings</h2><div class="svgbox"><img src="assets/road-signs.svg" alt="Stop, yield, speed limit and warning signs" width="400" height="110"></div>
${sg.length?`<div class="grid" style="margin-top:12px">${sg.map(x=>`<article class="card"><h3>${x[0]}</h3><span class="badge b-info">${x[1]}</span><p>${x[2]}</p></article>`).join('')}</div>`:empty()}`};
V.emergency=()=>{const e=EMER.filter(x=>match(x[0]+x[1].join(' ')));return `<p>${bd('bad')} Stay calm. Hazards on, then work down the steps.</p>`+(e.length?e.map(x=>`<details><summary>${x[0]}</summary><div><ol>${x[1].map(step).join('')}</ol></div></details>`).join(''):empty())};
V.assessment=()=>{const sc=S.get('sheet',{}),fl=S.get('fails',[]),logs=S.get('logs',[]),ms=S.get('mastery',[]),hrs=logs.reduce((a,l)=>a+l.h,0);
return `<section class="card"><h2>Mock practical exam</h2><p class="cap">Tick each skill you performed cleanly. Need 20/25 and no automatic fail.</p>
${RUB.map((x,i)=>`<label class="chk"><input type="checkbox" data-r="${i}" ${sc[i]?'checked':''}><span>${x}</span></label>`).join('')}
<h3 style="margin-top:16px">Automatic fail triggers</h3>${FAILS.map((x,i)=>`<label class="chk"><input type="checkbox" data-f="${i}" ${fl.includes(i)?'checked':''}><span>${x}</span></label>`).join('')}
<div id="res" role="status" aria-live="polite"></div><div class="row"><button class="btn primary" id="fin">Check result</button><button class="btn" id="rs">Reset sheet</button></div></section>
<section class="card" style="margin-top:16px"><h2>Practice logbook</h2><p><strong>${hrs.toFixed(1)}</strong> hours logged.</p><div class="bar"><i style="inline-size:${Math.min(100,hrs/8*100)}%"></i></div>
<div class="row" style="margin-block:12px"><label>Hours<br><input id="lh" type="number" min="0.25" max="12" step="0.25" inputmode="decimal" placeholder="1.5"></label><label>Notes<br><input id="ln" placeholder="Parking lot, parallel"></label><button class="btn primary" id="la">Add session</button></div><p id="lerr" class="b-bad" role="alert"></p>
<h3>Maneuver mastery</h3><div class="row">${MASTERY.map(m=>`<button class="chip" data-m="${m}" aria-pressed="${ms.includes(m)}">${m}</button>`).join('')}</div>
<ul>${logs.slice(-10).reverse().map(l=>`<li>${esc(l.d)}: ${l.h} h. ${esc(l.n)}</li>`).join('')}</ul><div class="row"><button class="btn" onclick="print()">Print summary</button><button class="btn" id="exp">Export JSON</button></div></section>`};

// ---- router ----
const TITLES={dashboard:'Home','pre-drive':'Pre-drive and transmission',maneuvers:'Maneuvers',rules:'Rules and signs',emergency:'Emergency',assessment:'Mock test and logbook'};
function route(){let v=(location.hash||'').slice(1);if(!v){const q=new URLSearchParams(location.search).get('view');if(q&&V[q])v=q}if(!V[v])v='dashboard';
$$('.navlink').forEach(a=>a.dataset.view===v?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));$('#title').textContent=TITLES[v];document.title=TITLES[v]+' | PDC Guide 2026';
const el=$('#view');el.innerHTML=V[v]();bind(v);el.animate([{opacity:0},{opacity:1}],{duration:200,easing:'cubic-bezier(.22,1,.36,1)'});scrollTo(0,0);if(v==='dashboard')showInstall();$('#main').focus()}
function bind(v){const el=$('#view');
$$('[data-reset]',el).forEach(b=>b.onclick=()=>{query='';$('#q').value='';route()});
if(v==='pre-drive'){$$('[data-b]',el).forEach(c=>c.onchange=()=>{let d=new Set(S.get('blow',[]));c.checked?d.add(+c.dataset.b):d.delete(+c.dataset.b);S.set('blow',[...d]);const y=scrollY;route();scrollTo(0,y);if(d.size===10){confetti();toast('All 10 checks done. You’re ready to drive.')}});$('#rb').onclick=()=>{S.set('blow',[]);route()}}
if(v==='rules'){const u=()=>{const s=+$('#spd').value,c=+($('[data-c][aria-pressed=true]').dataset.c);$('#so').textContent=s;$('#dist').innerHTML=`Keep about <strong>${Math.round(s/3.6*c)} m</strong> (${c} seconds) behind the car ahead. ${c>3?bd('warn')+' Extra gap for conditions.':''}`};$('#spd').oninput=u;$$('[data-c]').forEach(b=>b.onclick=()=>{$$('[data-c]').forEach(x=>x.setAttribute('aria-pressed',x===b));u()});u()}
if(v==='assessment'){const sheet=()=>{const o={};$$('[data-r]').forEach(c=>o[c.dataset.r]=c.checked);S.set('sheet',o);S.set('fails',$$('[data-f]').filter(c=>c.checked).map(c=>+c.dataset.f))};$$('[data-r],[data-f]').forEach(c=>c.onchange=sheet);
$('#fin').onclick=()=>{sheet();const n=$$('[data-r]').filter(c=>c.checked).length,f=$$('[data-f]').some(c=>c.checked),ok=n>=20&&!f;S.set('lastScore',n);$('#res').innerHTML=`<p>${ok?bd('ok')+' Pass':bd('bad')+' Not yet'}: <strong>${n}/25</strong>${f?'. An automatic fail was ticked.':n<20?'. You need at least 20.':'.'}</p>`;if(ok){confetti();toast('Mock exam passed!')}};
$('#rs').onclick=()=>{S.set('sheet',{});S.set('fails',[]);route()};
$('#la').onclick=()=>{const h=parseFloat($('#lh').value);if(!(h>0&&h<=12)){$('#lerr').textContent='Enter hours between 0.25 and 12.';$('#lh').focus();return}const l=S.get('logs',[]);l.push({d:new Date().toLocaleDateString(),h,n:$('#ln').value});S.set('logs',l);route();toast('Session added.')};
$$('[data-m]').forEach(b=>b.onclick=()=>{const m=new Set(S.get('mastery',[]));m.has(b.dataset.m)?m.delete(b.dataset.m):m.add(b.dataset.m);S.set('mastery',[...m]);route()});
$('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({logs:S.get('logs',[]),mastery:S.get('mastery',[])},null,2)],{type:'application/json'}));a.download='pdc-progress.json';a.click()}}}
addEventListener('hashchange',route);
$('#q').addEventListener('input',e=>{query=e.target.value.trim();const v=(location.hash||'#dashboard').slice(1);if(v==='dashboard'&&query){location.hash='#rules';return}route()});

// ---- theme, mode ----
function theme(t){document.documentElement.dataset.theme=t;S.set('theme',t);$('#tc').media='';$('#tc').content=t==='dark'?'#0B1120':'#F8FAFC'}
const st=S.get('theme',null);if(st)theme(st);
$('#theme').onclick=()=>theme((document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))==='dark'?'light':'dark');
function setTx(m){tx=m;S.set('tx',m);$$('[data-tx]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tx===m))}
$$('[data-tx]').forEach(b=>b.onclick=()=>{setTx(b.dataset.tx);route()});if(tx)setTx(tx);

// ---- PWA install, status, SW ----
let dip=null;const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!navigator.standalone;
function showInstall(){const h=$('#inst');if(!h||S.get('instDismiss',false)||matchMedia('(display-mode:standalone)').matches)return;
if(dip)h.innerHTML=`<article class="card"><h3>Install for offline use</h3><p>Add the guide to your device.</p><div class="row"><button class="btn primary" id="ib">Install app</button><button class="btn" id="id">Not now</button></div></article>`;
else if(ios)h.innerHTML=`<article class="card"><h3>Add to Home Screen</h3><p>Tap Share, then <strong>Add to Home Screen</strong>.</p><button class="btn" id="id">Got it</button></article>`;
const b=$('#ib');b&&(b.onclick=async()=>{dip.prompt();await dip.userChoice;dip=null;h.innerHTML=''});const d=$('#id');d&&(d.onclick=()=>{S.set('instDismiss',true);h.innerHTML=''})}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;showInstall()});
function net(){const n=$('#net'),on=navigator.onLine;n.textContent=on?'Online':'Offline ready';n.classList.toggle('off',!on)}addEventListener('online',net);addEventListener('offline',net);net();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register(P+'sw.js',{scope:P}).then(r=>{const ask=w=>toast('Update available.','Reload',()=>w.postMessage('SKIP_WAITING'));if(r.waiting&&navigator.serviceWorker.controller)ask(r.waiting);r.addEventListener('updatefound',()=>{const w=r.installing;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)ask(w)})});let rl;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!rl){rl=1;location.reload()}})}).catch(()=>{}));

// ---- onboarding ----
function onboard(){if(S.get('onboarded',false))return;modal(`<h2 id="mt">Welcome, student driver</h2><p>Which car are you learning in? We’ll tailor the tips.</p><div class="row"><button class="btn primary" data-pick="MT">Manual</button><button class="btn primary" data-pick="AT">Automatic</button></div>`);
$$('[data-pick]').forEach(b=>b.onclick=()=>{setTx(b.dataset.pick);S.set('onboarded',true);closeModal();route()})}
route();onboard();
})();

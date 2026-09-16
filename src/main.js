import { OFFERS, offerSheet, scenarioFor } from './offer.js';
import './style.css';
import logoUrl from './assets/my-partner-school.png?inline';
import { AvatarStage } from './avatar.js';
import { PERSONAS } from './personas.js';
import { demoReply } from './demo.js';

const $=id=>document.getElementById(id);
const icons={mic:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>',send:'<svg viewBox="0 0 24 24"><path d="m4 4 17 8-17 8 3-8-3-8ZM7 12h14"/></svg>'};
document.querySelector('#app').innerHTML=`
<header class="topbar"><a class="brand" href="./"><img class="brand-logo" src="${logoUrl}" alt="My Partner School" width="300" height="93"><span class="brand-title">Studio de vente<small>SIMULATIONS IMMERSIVES</small></span></a><div class="top-status"><span class="status-dot"></span> Espace d’entraînement <span class="version">PILOTE 04</span></div></header>
<div class="browser-advice"><strong>Google Chrome recommandé sur ordinateur pour cet essai.</strong> Les voix varient selon l’appareil, y compris dans Chrome sur Android. Écoutez un essai avant l’entretien. Si aucune voix adaptée n’est reconnue, continuez en texte ou choisissez une voix après écoute.</div>
<main class="layout"><aside class="sidebar"><div class="section-label">VOTRE MISE EN SITUATION</div><h1>Une vraie conversation.<br><em>Un terrain d’essai.</em></h1><p class="intro">Entraînez-vous à découvrir, convaincre et négocier face à un client virtuel.</p>
<div class="section-label clients-label">01 — CHOISIR SON INTERLOCUTEUR</div><div id="personas" class="personas"></div>
<div class="session-settings"><label for="offerChoice">02 — Choisir l’offre à vendre</label><select id="offerChoice"></select><p>Le client et l’offre restent fixes pendant l’entretien.</p></div><div class="brief"><span class="section-label">VOTRE MISSION</span><h2 id="missionTitle"></h2><p id="mission"></p><details><summary>Consulter le dossier client</summary><div id="dossier"></div></details></div>
<div class="offer-prep"><span class="section-label">AVANT DE COMMENCER</span><p>Préparation libre, hors chronomètre. Entretien conseillé : 5 à 8 minutes. Objectif : une prochaine étape, pas une résolution technique.</p><details open><summary>Votre fiche commerciale · à garder sous les yeux</summary><div id="offerSheet"></div></details></div><div class="session-settings"><label for="engine">Mode de simulation</label><select id="engine"><option value="demo">Aperçu sans IA · réponses limitées</option><option value="cloudflare">IA Cloudflare · quota gratuit</option><option value="ai">IA Anthropic · payante</option></select><p id="engineNote">Réponses prédéfinies pour essayer les avatars. Pas d’évaluation pédagogique.</p><div id="accessWrap" hidden><label for="accessCode">Code de session fourni par le formateur</label><input id="accessCode" type="password" autocomplete="off" maxlength="128" placeholder="Votre code de session"></div></div>
<div class="sidebar-foot">Solutions de formation · Vente B2B<br><span>4 clients · 6 offres · 24 situations</span></div></aside>
<section class="workspace" aria-label="Entretien"><div class="workspace-heading"><div><span class="section-label">03 — À VOUS DE JOUER</span><h2>Face à votre client</h2></div><button id="reset" class="text-button">Nouvelle session ↗</button></div>
<div class="stage-shell"><div id="stage"></div><div id="graphicsError" hidden>Le portrait n’est pas disponible dans ce navigateur. L’entretien reste accessible en texte.</div><div class="stage-top"><span id="modeBadge" class="glass-badge">DÉMONSTRATION</span><button id="motion" class="glass-button" aria-pressed="true">Mouvements : oui</button></div><div class="stage-bottom"><div><div class="name-line"><span class="live-dot"></span><h3 id="clientName"></h3></div><p id="clientRole"></p></div><span id="stateBadge" role="status">Prêt à vous recevoir</span></div><div id="subtitle" class="subtitle" hidden></div></div>
<div class="session-strip"><span id="turns">0 échange</span><div class="mood-wrap"><span>Climat</span><meter id="mood" min="0" max="100" value="50" aria-label="Climat de l’entretien"></meter><span id="moodLabel">Neutre</span></div><span id="timer">00:00</span></div>
<div id="notice" class="notice" role="status">Commencez la session : votre client prendra la parole.</div>
<div class="conversation-head"><span class="section-label">FIL DE L’ENTRETIEN</span><label><input id="voice" type="checkbox" checked> Voix du client</label><label><input id="handsfree" type="checkbox"> Mains libres</label></div>
<div class="voice-settings"><label for="voiceChoice">Voix de ce personnage</label><select id="voiceChoice" aria-describedby="voiceInfo"></select><button type="button" id="testVoice" class="secondary">Écouter un essai</button><small id="voiceInfo" role="status"></small></div>
<div id="messages" class="messages" role="log" aria-label="Transcription de l’entretien" aria-live="polite"><p class="empty">Votre conversation s’affichera ici.</p></div>
<form id="composer" class="composer"><button type="button" id="mic" title="Prendre la parole" aria-label="Prendre la parole au micro" disabled>${icons.mic}</button><label class="sr-only" for="input">Votre réplique</label><textarea id="input" rows="2" maxlength="4000" placeholder="Posez une question à votre client…" disabled></textarea><button id="send" type="submit" title="Envoyer" aria-label="Envoyer la réplique" disabled>${icons.send}</button></form>
<div class="bottom-actions"><span id="voiceHelp">Micro facultatif · Vous pouvez aussi écrire.</span><button id="start" class="primary">Commencer l’entretien <span>→</span></button><button id="interrupt" class="secondary" hidden>Interrompre la voix</button><button id="finish" class="secondary" hidden>Terminer et débriefer</button></div>
</section></main>
<footer>Client virtuel animé · Expressions illustrées · Voix sans synchronisation labiale · Les échanges IA sont transmis à Cloudflare ou Anthropic selon le mode choisi. Aucun enregistrement audio n’est stocké par l’application.</footer>
<dialog id="results"><div class="results-top"><span class="section-label">04 — PRENDRE DU RECUL</span><button id="closeResults" aria-label="Fermer le débriefing">×</button></div><h2 id="resultTitle">Votre débriefing</h2><p id="resultNote"></p><div id="scores" class="scores"></div><div id="feedback"></div><details class="pilot-feedback" open><summary>Votre retour sur cet essai (facultatif)</summary><label for="pilotUseful">Cet exercice vous aide-t-il à vous entraîner ?</label><select id="pilotUseful"><option value="">Non renseigné</option><option>Oui</option><option>En partie</option><option>Non</option></select><label for="pilotRealism">Le client vous a-t-il semblé crédible ?</label><select id="pilotRealism"><option value="">Non renseigné</option><option>Oui</option><option>En partie</option><option>Non</option></select><label for="pilotComment">Ce qui vous a aidé ou gêné</label><textarea id="pilotComment" maxlength="2000" rows="3"></textarea><small>Inclus dans le fichier « Télécharger l’entretien ». Rien n’est envoyé automatiquement ; transmettez ce fichier à votre formateur.</small></details><div class="dialog-actions"><button id="export" class="secondary">Télécharger l’entretien</button><button id="retryEval" class="primary" hidden>Réessayer l’analyse</button><button id="restart" class="primary">Recommencer</button></div></dialog>`;

let selectedOffer=OFFERS[0],cloudflareReady=false;
OFFERS.forEach(o=>{const option=document.createElement('option');option.value=o.id;option.textContent=o.name;$('offerChoice').append(option);});$('offerChoice').value=selectedOffer.id;
let selected=PERSONAS[0],avatar=null,active=false,busy=false,ended=false,history=[],mood=50,generation=0,requestController=null,startedAt=0,evaluation=null;
let speaking=false,recognizing=false,recognition=null,utterance=null,recognitionGeneration=0,autoTimer=null,speechTimer=null,ready=false;
try{avatar=new AvatarStage($('stage'),selected.id);}catch(e){$('graphicsError').hidden=false;console.warn('Portrait indisponible',e);}
if(matchMedia('(prefers-reduced-motion: reduce)').matches){if(avatar)avatar.motion=false;$('motion').textContent='Mouvements : non';$('motion').setAttribute('aria-pressed','false');}
const missions={marc:'Défendre la valeur de votre offre',sophie:'Faire émerger le besoin réel',karim:'Convaincre en allant à l’essentiel',claire:'Négocier des concessions réciproques'};
function notify(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
function state(name,label){avatar?.setState(name);$('stateBadge').textContent=label;$('mic').classList.toggle('listening',name==='listening');}
function controls(){
  $('input').disabled=!active||ended||busy;$('send').disabled=!active||ended||busy;
  $('mic').disabled=!recognition||!active||ended||busy;
  $('finish').hidden=!active||ended;$('finish').disabled=busy;
  $('start').hidden=active||ended;$('interrupt').hidden=!speaking;
  $('engine').disabled=active||ended;$('offerChoice').disabled=active||ended;$('accessCode').disabled=active||ended;
  document.querySelectorAll('.persona-card').forEach(b=>b.disabled=active);
}
function addMessage(role,content){
  $('messages').querySelector('.empty')?.remove();const div=document.createElement('div');div.className='message '+role;
  const label=document.createElement('span');label.textContent=role==='user'?'Vous':selected.name.split(' ')[0];
  const text=document.createElement('p');text.textContent=content;div.append(label,text);$('messages').append(div);$('messages').scrollTop=$('messages').scrollHeight;
}
function refreshMood(delta=0,gesture='neutral'){mood=Math.max(0,Math.min(100,mood+delta*8));$('mood').value=mood;$('moodLabel').textContent=mood<35?'Réservé':mood>65?'Engagé':'Neutre';avatar?.setMood(mood,gesture);$('turns').textContent=`${history.filter(m=>m.role==='user').length} échange(s)`;}
function selectPersona(p){
  selected={...p,...scenarioFor(p,selectedOffer)};$('offerSheet').textContent=offerSheet(selectedOffer);const brief=selected;avatar?.setPersona(p.id);$('clientName').textContent=p.name;$('clientRole').textContent=p.role+' · '+p.company;
  $('missionTitle').textContent=missions[p.id];$('mission').textContent=brief.fiche[1].split(' : ')[1]||brief.fiche[1];$('dossier').replaceChildren();refreshVoices();
  brief.fiche.forEach(t=>{const el=document.createElement('p');el.textContent=t;$('dossier').append(el);});
  document.querySelectorAll('.persona-card').forEach(b=>{b.classList.toggle('selected',b.dataset.id===p.id);b.setAttribute('aria-pressed',String(b.dataset.id===p.id));});refreshMood();
}
PERSONAS.forEach((p,i)=>{const b=document.createElement('button');b.className='persona-card';b.dataset.id=p.id;b.innerHTML=`<span class="persona-initial p-${p.id}">${p.name.split(' ').map(n=>n[0]).join('')}</span><span class="persona-copy"><strong>${p.name}</strong><small>${p.role}</small><em>${p.tag}</em></span><span class="persona-index">0${i+1}</span>`;b.onclick=()=>{if(!active){resetSession();selectPersona(p);}};$('personas').append(b);});

let voiceChoices={};
try{const saved=JSON.parse(localStorage.getItem('mps-profile-voices-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))voiceChoices=saved;}catch{}
const voiceKey=v=>JSON.stringify([v.voiceURI,v.name,v.lang]);
function refreshVoices(){const menu=$('voiceChoice');menu.replaceChildren();const voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>v.lang?.toLowerCase()==='fr-fr');const add=(value,text)=>{const o=document.createElement('option');o.value=value;o.textContent=text;menu.append(o);};add('','Automatique · voix du personnage');[...voices].sort((a,b)=>Number(b.lang.startsWith('fr'))-Number(a.lang.startsWith('fr'))||a.name.localeCompare(b.name,'fr')).forEach(v=>add(voiceKey(v),v.name+' · '+v.lang+(v.localService?' · appareil':' · en ligne')));const saved=voiceChoices[selected.id];const missing=saved&&!voices.some(v=>voiceKey(v)===saved);if(missing)add(saved,'Voix mémorisée indisponible · choisissez une voix');menu.value=saved||'';menu.disabled=!window.speechSynthesis;$('voiceInfo').textContent=!window.speechSynthesis?'Voix indisponible dans ce navigateur.':missing?'La voix mémorisée n’est pas disponible ici.':chooseVoice()?voices.length+' voix de France · écoutez un essai pour valider le timbre.':'Aucune voix adaptée reconnue automatiquement. Choisissez et écoutez une voix de France, ou poursuivez en texte.';}
function chooseVoice(){
 const voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>v.lang?.toLowerCase()==='fr-fr');
 const french=voices;
 const android=typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent);
 const normalize=name=>name.normalize('NFC').trim().toLowerCase();
 const manual=voices.find(v=>voiceKey(v)===voiceChoices[selected.id]);
 // Exact names are assigned by the trainer after listening; numbered Google voices have no gender metadata.
 const preferred=(!android?(selected.preferredVoiceNames||[]):[]).map(name=>french.find(v=>normalize(v.name)===normalize(name))).find(Boolean);
 const known=french.filter(v=>selected.voiceNameHints.some(h=>normalize(v.name).split(/[^a-zà-ÿ]+/).includes(normalize(h))));
 const fallback=known.find(v=>/premium|enhanced|améliorée|natural/i.test(v.name))||known[0];
 return manual||preferred||fallback||null;
}
$('testVoice').onclick=()=>{cancelVoice();const voice=chooseVoice();if(!voice){notify('Choisissez une voix dans la liste pour écouter un essai.',true);return;}const u=new SpeechSynthesisUtterance('Bonjour, je suis '+selected.name+'. Je vous écoute. Quelle solution souhaitez-vous me proposer ?');u.voice=voice;u.lang='fr-FR';u.rate=.98;u.pitch=1;u.onerror=()=>notify('Cette voix ne peut pas être lue. Essayez une autre voix ou continuez en texte.',true);window.speechSynthesis.speak(u);};
$('voiceChoice').onchange=()=>{cancelVoice();voiceChoices[selected.id]=$('voiceChoice').value;try{localStorage.setItem('mps-profile-voices-v1',JSON.stringify(voiceChoices));}catch{}refreshVoices();notify('Voix choisie. Elle sera utilisée à la prochaine réplique du client.');};
window.speechSynthesis?.addEventListener('voiceschanged',refreshVoices);
window.addEventListener('focus',refreshVoices);

function cancelVoice(){
  clearTimeout(autoTimer);clearTimeout(speechTimer);utterance=null;speaking=false;
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  recognitionGeneration++;if(recognition){try{recognition.abort();}catch{}}recognizing=false;
  if(active&&!ended&&!busy)state('idle','À vous de parler');controls();
}
function scheduleListening(){clearTimeout(autoTimer);if($('handsfree').checked&&active&&!ended&&!busy)autoTimer=setTimeout(startListening,350);}
function speak(text){
  cancelVoice();$('subtitle').textContent=text;$('subtitle').hidden=false;
  if(!$('voice').checked||!window.speechSynthesis){state('idle','À vous de parler');scheduleListening();return;}
  const token=generation;const u=new SpeechSynthesisUtterance(text);utterance=u;u.lang='fr-FR';u.rate=.98;u.pitch=1;
  u.voice=chooseVoice();if(!u.voice){utterance=null;state('idle','Réponse disponible en texte');refreshVoices();notify('Aucune voix adaptée reconnue : choisissez une voix de France après écoute, ou poursuivez au clavier.');return;}u.lang=u.voice.lang;
  const done=(error=false)=>{if(token!==generation||utterance!==u)return;clearTimeout(speechTimer);utterance=null;speaking=false;state('idle','À vous de parler');controls();if(error)notify('La voix est indisponible. La réponse reste lisible ; vous pouvez continuer en texte.',true);else scheduleListening();};
  u.onstart=()=>{if(token!==generation||utterance!==u)return;speaking=true;state('speaking','Votre client parle');controls();};
  u.onboundary=()=>avatar?.word();u.onend=()=>done();u.onerror=()=>done(true);
  speaking=true;state('speaking','Votre client parle');controls();window.speechSynthesis.speak(u);
  speechTimer=setTimeout(()=>{if(utterance===u){done(true);window.speechSynthesis.cancel();}},Math.max(20000,text.length*180));
}
const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(Recognition){recognition=new Recognition();recognition.lang='fr-FR';recognition.continuous=false;recognition.interimResults=true;}
else {$('handsfree').disabled=true;$('voiceHelp').textContent='Micro non pris en charge ici : utilisez le clavier.';}
function startListening(){
  if(!recognition||!active||ended||busy)return;cancelVoice();recognition=new Recognition();recognition.lang='fr-FR';recognition.continuous=false;recognition.interimResults=true;const token=++recognitionGeneration;let finalText='';let failed=false;
  recognition.onresult=e=>{if(token!==recognitionGeneration)return;let partial='';finalText='';for(let i=0;i<e.results.length;i++){if(e.results[i].isFinal)finalText+=e.results[i][0].transcript;else partial+=e.results[i][0].transcript;}$('input').value=finalText||partial;};
  recognition.onerror=e=>{if(token!==recognitionGeneration)return;failed=true;recognizing=false;state('idle','Micro arrêté');notify(e.error==='not-allowed'?'Autorisez le micro dans votre navigateur, ou continuez au clavier.':e.error==='no-speech'?'Aucune parole détectée. Cliquez sur le micro pour réessayer.':'Le micro est indisponible. Vous pouvez continuer au clavier.',true);};
  recognition.onend=()=>{if(token!==recognitionGeneration)return;recognizing=false;state('idle','À vous de parler');if(finalText.trim()&&!failed){$('input').value=finalText;send();}else controls();};
  try{recognition.start();recognizing=true;state('listening','Je vous écoute…');notify('Parlez naturellement. Votre réplique sera envoyée après votre pause.');}catch{notify('Le micro se termine encore. Réessayez dans un instant.',true);}
}
async function api(action,messages){
  const controller=new AbortController();requestController=controller;const timer=setTimeout(()=>controller.abort(),55000);
  try{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Access-Code':$('accessCode').value},body:JSON.stringify({action,persona:selected.id,offer:selectedOffer.id,provider:$('engine').value==='cloudflare'?'cloudflare':'anthropic',messages}),signal:controller.signal});
    const data=await response.json();if(!response.ok)throw new Error(data.error||'Service indisponible.');return data;
  }finally{clearTimeout(timer);if(requestController===controller)requestController=null;}
}
async function send(){
  const text=$('input').value.trim();if(!active||ended||busy||!text)return;
  if(text.length>4000){notify('Limitez votre réplique à 4 000 caractères.',true);return;}
  if(history.filter(m=>m.role==='user').length>=30){notify('Les 30 échanges sont atteints. Terminez pour consulter le débriefing.');return;}
  cancelVoice();const token=generation;busy=true;controls();state('thinking','Votre client réfléchit…');notify('Votre client prépare sa réponse.');
  const candidate=[...history,{role:'user',content:text}];
  try{
    const result=$('engine').value==='demo'?await new Promise(resolve=>setTimeout(()=>resolve(demoReply(selected.id,text,candidate.length,candidate,selectedOffer.id)),650)):await api('chat',candidate);
    if(token!==generation)return;
    history=candidate;history.push({role:'assistant',content:result.reply,expression:result.expression||'neutral',expression_source:result.expression_source||'model'});addMessage('user',text);addMessage('assistant',result.reply);$('input').value='';busy=false;refreshMood(result.mood_delta,result.gesture);avatar?.setExpression?.(result.expression);controls();
    notify($('engine').value==='demo'?'Démonstration : réponses prédéfinies. Activez le mode IA pour un entretien personnalisé.':'À vous de poursuivre. Écoutez, questionnez, puis proposez une suite.');speak(result.reply);
  }catch(e){if(token!==generation)return;busy=false;state('idle','Réponse interrompue');notify(e.name==='AbortError'?'Délai dépassé. Votre réplique est conservée ; vous pouvez la renvoyer.':e.message,true);controls();}
}
function start(){
  if($('engine').value!=='demo'&&!$('accessCode').value.trim()){notify('Saisissez le code de session du formateur.',true);$('accessCode').focus();return;}
  active=true;ended=false;startedAt=Date.now();history=[{role:'assistant',content:selected.greeting}];addMessage('assistant',selected.greeting);controls();notify('L’entretien a commencé. Vous pouvez répondre au micro ou au clavier.');speak(selected.greeting);
}
function resetSession(){
  $('export').disabled=false;$('export').textContent='Télécharger l’entretien';
  generation++;requestController?.abort();cancelVoice();active=false;ended=false;busy=false;history=[];mood=50;evaluation=null;startedAt=0;
  $('pilotUseful').value='';$('pilotRealism').value='';$('pilotComment').value='';$('messages').innerHTML='<p class="empty">Votre conversation s’affichera ici.</p>';$('input').value='';$('subtitle').hidden=true;$('timer').textContent='00:00';$('results').close();refreshMood();state('idle','Prêt à vous recevoir');controls();notify('Commencez la session : votre client prendra la parole.');
}
function feedbackSection(title,items){const h=document.createElement('h3');h.textContent=title;const ul=document.createElement('ul');items.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.append(li);});$('feedback').append(h,ul);}
async function finish(){
  if(busy)return;ended=true;cancelVoice();controls();state('idle','Entretien terminé');$('results').showModal();$('scores').replaceChildren();$('feedback').replaceChildren();$('retryEval').hidden=true;
  if($('engine').value==='demo'||!history.some(m=>m.role==='user')){
    $('resultTitle').textContent=$('engine').value==='demo'?'Votre essai est terminé':'Entretien sans réplique';$('resultNote').textContent=$('engine').value==='demo'?'Le mode démonstration ne produit pas de note. Passez au mode IA pour obtenir un débriefing basé sur vos échanges.':'Répondez au client lors de votre prochaine session pour obtenir une évaluation.';
    feedbackSection('Pour votre prochain entretien',[missions[selected.id],'Obtenir un prochain pas concret : un objectif, une date et un interlocuteur.']);return;
  }
  const token=generation;busy=true;evaluation=null;$('export').disabled=true;$('export').textContent='Analyse en cours…';$('resultTitle').textContent='Analyse de votre entretien…';$('resultNote').textContent='Évaluation indicative : exemples de l’échange et pistes de progrès, à discuter avec le formateur.';
  try{const result=await api('evaluate',history);if(token!==generation)return;evaluation=result;
    const third=selected.id==='marc'?'Objection prix':selected.id==='sophie'?'Clarification du doute':selected.id==='claire'?'Négociation et contreparties':'Concision et pertinence';
    const cats=[['decouverte','Découverte'],['argumentation','Argumentation'],['objection',third],['ecoute','Écoute active'],['closing','Prochain pas']];
    const total=cats.reduce((a,[key])=>a+evaluation[key],0);$('resultTitle').textContent=`Votre débriefing · ${total} / 25`;$('resultNote').textContent=evaluation.verdict;
    cats.forEach(([key,label])=>{const card=document.createElement('div');card.className='score';const title=document.createElement('span');title.textContent=label;const value=document.createElement('strong');value.textContent=evaluation[key]+' / 5';card.append(title,value);$('scores').append(card);});
    feedbackSection('Ce qui a fonctionné',evaluation.points_forts);feedbackSection('À travailler',evaluation.axes_progres);
    for(const detail of evaluation.details||[]){
      const label=cats.find(([key])=>key===detail.critere)?.[1]||detail.critere;
      feedbackSection(label+' · Pourquoi cette note ?',[detail.constat,...detail.preuves.map(p=>`Tour ${p.tour} — ${history[p.tour-1]?.role==='user'?'Commercial':'Client'} : « ${p.citation} »`),'Pour progresser : '+detail.conseil]);
    }
    if(evaluation.limites_simulation?.length)feedbackSection('Limites du client virtuel à prendre en compte',evaluation.limites_simulation);
  }catch(e){if(token!==generation)return;$('resultTitle').textContent='Analyse indisponible';$('resultNote').textContent=e.message;$('retryEval').hidden=false;
  }finally{if(token===generation){busy=false;$('export').disabled=false;$('export').textContent=evaluation?'Télécharger l’entretien et le débriefing':'Télécharger l’entretien sans évaluation';controls();}}
}
function sessionExport(){return {version:'pilote-2026-09-16-b',date:new Date().toISOString(),client:selected.name,offre:selectedOffer.name,offreId:selectedOffer.id,retourPilote:{utilite:$('pilotUseful').value,realisme:$('pilotRealism').value,commentaire:$('pilotComment').value},mode:$('engine').value,conversation:history,evaluation,evaluation_status:evaluation?'complete':$('engine').value==='demo'?'not_applicable':busy?'pending':'unavailable',evaluation_indicative:true};}
function exportSession(){if(busy){notify('Attendez la fin de l’analyse avant de télécharger.',true);return;}const data=sessionExport();const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`entretien-${selected.id}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('start').onclick=start;$('reset').onclick=()=>{if(!history.some(m=>m.role==='user')||confirm('Recommencer et effacer cet entretien ?'))resetSession();};$('restart').onclick=resetSession;
$('finish').onclick=finish;$('retryEval').onclick=finish;$('closeResults').onclick=()=>$('results').close();$('export').onclick=exportSession;
$('composer').onsubmit=e=>{e.preventDefault();send();};$('input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send();}};
$('mic').onclick=()=>{if(recognizing){recognition.stop();}else startListening();};$('interrupt').onclick=()=>{cancelVoice();state('idle','À vous de parler');scheduleListening();};
$('voice').onchange=()=>{if(!$('voice').checked){cancelVoice();scheduleListening();}};
$('handsfree').onchange=()=>{if($('handsfree').checked)notify('Mains libres : le micro s’ouvrira après la réponse du client. Votre navigateur peut traiter la dictée via son propre service.');else{clearTimeout(autoTimer);if(recognizing)cancelVoice();}};
$('motion').onclick=()=>{if(!avatar)return;avatar.motion=!avatar.motion;$('motion').textContent='Mouvements : '+(avatar.motion?'oui':'non');$('motion').setAttribute('aria-pressed',String(avatar.motion));};
function engineInfo(){const mode=$('engine').value,ai=mode!=='demo';$('accessWrap').hidden=!ai;$('modeBadge').textContent=mode==='cloudflare'?'IA CLOUDFLARE':mode==='ai'?'IA ANTHROPIC':'RÉPLIQUES PRÉDÉFINIES';$('engineNote').textContent=mode==='cloudflare'?(cloudflareReady?'IA disponible. Quota quotidien partagé sur Workers Free ; arrêt si épuisé. Saisissez le code formateur.':'Après déploiement, configurez le code formateur dans Cloudflare. Le compte doit rester Workers Free pour éviter les dépassements payants.'):mode==='ai'?(ready?'Anthropic configuré : les appels consomment du crédit.':'Ce moteur payant nécessite une clé Anthropic dans Cloudflare.'):'APERÇU SANS IA : réponses limitées et parfois répétitives. Ce mode ne permet pas d’évaluer la qualité d’un entretien. Pour le pilote, choisissez IA Cloudflare.';}
$('engine').onchange=engineInfo;
$('offerChoice').onchange=()=>{if(active||ended){$('offerChoice').value=selectedOffer.id;return;}const offer=OFFERS.find(o=>o.id===$('offerChoice').value);if(!offer)return;resetSession();selectedOffer=offer;selectPersona(PERSONAS.find(p=>p.id===selected.id));};
setInterval(()=>{if(active&&!ended&&startedAt){const seconds=Math.floor((Date.now()-startedAt)/1000);$('timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}},1000);
window.addEventListener('pagehide',()=>{generation++;requestController?.abort();cancelVoice();});
selectPersona(selected);controls();engineInfo();
fetch('/api/status').then(r=>r.ok?r.json():null).then(data=>{ready=!!data?.ready;cloudflareReady=!!data?.cloudflareReady;if(location.protocol!=='file:')engineInfo();}).catch(()=>{});
if(location.protocol==='file:'){$('engine').value='demo';engineInfo();$('engine').querySelector('option[value="ai"]').disabled=true;$('engine').querySelector('option[value="cloudflare"]').disabled=true;$('engineNote').textContent='Démonstration autonome. Le mode IA sera disponible une fois le dossier installé sur Cloudflare.';}

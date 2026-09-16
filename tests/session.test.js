// Lifecycle tests run without a browser. Graphics and speech devices are stubbed;
// these checks do not replace a visual or real microphone acceptance test.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {OFFERS,offerSheet,scenarioFor} from '../src/offer.js';
import {PERSONAS} from '../src/personas.js';
import {demoReply} from '../src/demo.js';

test('entrée : erreur conserve la page d’accès, validation ouvre Cloudflare et sortie efface le code',async()=>{
 let allow=false,calls=0;
 const h=harness(async(url,opts)=>{
  if(url==='/api/status')return Response.json({cloudflareReady:true});
  assert.equal(url,'/api/access');assert.equal(opts.headers['X-Access-Code'],'secret');calls++;
  return allow?Response.json({authenticated:true,provider:'cloudflare'}):Response.json({error:'Code de session incorrect.'},{status:401});
 });
 h.run('authenticated=false');h.run('start()');assert.equal(h.run('active'),false);
 h.get('entryCode').value='secret';await h.run('enterStudio()');assert.equal(h.run('authenticated'),false);assert.match(h.get('entryNotice').textContent,/incorrect/);
 allow=true;await h.run('enterStudio()');assert.equal(h.run('authenticated'),true);assert.equal(h.get('studio').hidden,false);assert.equal(h.get('entry').hidden,true);assert.equal(h.get('engine').value,'cloudflare');assert.equal(h.get('entryCode').value,'');assert.equal(calls,2);
 h.get('logout').onclick();assert.equal(h.get('accessCode').value,'');assert.equal(h.get('studio').hidden,true);assert.equal(h.run('authenticated'),false);
});
test('lecture de l’historique : un message client ne déplace pas le lecteur remonté',()=>{
 const h=harness();const log=h.get('messages');log.scrollHeight=1800;log.clientHeight=600;log.scrollTop=200;
 h.run('addMessage("assistant","Une réponse")');assert.equal(log.scrollTop,200);
 log.scrollTop=1190;h.run('addMessage("assistant","La suite")');assert.equal(log.scrollTop,1800);
});

test('export pendant analyse bloqué puis débriefing conservé',async()=>{
 let release;
 const result={decouverte:3,argumentation:3,objection:3,ecoute:4,closing:2,verdict:'Bilan.',points_forts:[],axes_progres:[],details:[],limites_simulation:[]};
 const h=harness(async(url,opts)=>{
   if(url==='/api/status')return Response.json({cloudflareReady:true});
   if(JSON.parse(opts.body).action==='evaluate')return new Promise(resolve=>{release=()=>resolve(Response.json(result));});
   return Response.json({reply:'Je suis d’accord.',expression:'agreement',expression_source:'text_rules'});
 });
 h.get('engine').value='cloudflare';h.get('accessCode').value='test';h.run('start()');h.get('input').value='Quelle est votre priorité ?';await h.run('send()');
 const pending=h.run('finish()');assert.equal(h.get('export').disabled,true);h.run('exportSession()');assert.match(h.get('notice').textContent,/Attendez/);
 release();await pending;assert.equal(h.get('export').disabled,false);
 assert.equal(h.run('sessionExport().evaluation.verdict'),'Bilan.');assert.equal(h.run('sessionExport().evaluation_status'),'complete');assert.equal(h.run('sessionExport().conversation.at(-1).expression'),'agreement');
});

function harness(fetcher=async()=>Response.json({ready:true}),speech=null,userAgent='Desktop'){
  const elements=new Map();
  class Element{
    constructor(){this.children=[];this.value='';this.hidden=false;this.disabled=false;this.checked=false;this.dataset={};this.textContent='';this.style={};this.classList={toggle(){},add(){},remove(){}};}
    set innerHTML(html){this._html=html;this.children=[];for(const id of html.matchAll(/id="([^"]+)"/g)){if(!elements.has(id[1]))elements.set(id[1],new Element());}}
    get innerHTML(){return this._html||'';}
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=children;}
    querySelector(){return null;}
    setAttribute(){} focus(){} remove(){} click(){this.onclick?.();} showModal(){this.open=true;} close(){this.open=false;}
  }
  elements.set('app',new Element());
  const document={querySelector:()=>elements.get('app'),getElementById:id=>elements.get(id),createElement:()=>new Element(),querySelectorAll:()=>elements.get('personas')?.children||[]};
  const timers=new Map();let next=0;const timeout=(f,ms)=>{const id=++next;timers.set(id,{f,ms});return id;};
  class FakeAvatar{constructor(){this.motion=true;}setPersona(){}setState(s){this.state=s;}setMood(){}word(){}}
  const context=vm.createContext({navigator:{userAgent},document,window:{addEventListener(){},speechSynthesis:speech},SpeechSynthesisUtterance:function(text){this.text=text;},localStorage:{getItem(){return null;},setItem(){}},location:{protocol:'https:'},matchMedia:()=>({matches:false}),AvatarStage:FakeAvatar,logoUrl:"test-logo.png",OFFERS,offerSheet,scenarioFor,PERSONAS,demoReply,console,confirm:()=>true,setTimeout:timeout,clearTimeout:id=>timers.delete(id),setInterval(){},fetch:fetcher,AbortController,AbortSignal,Blob,URL});
  const code=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
  vm.runInContext(code,context);
  vm.runInContext('authenticated=true',context);
  elements.get('engine').value='demo';
  return {context,get:id=>elements.get(id),run:s=>vm.runInContext(s,context),tick(ms){for(const[id,t]of [...timers])if(t.ms===ms){timers.delete(id);t.f();}}};
}
test('une session démo produit un dialogue, sans note pédagogique inventée',async()=>{
  const h=harness();h.get('start').click();assert.equal(h.run('active'),true);assert.equal(h.run('history.length'),1);
  h.get('input').value='Quelles sont vos pannes ?';const sent=h.run('send()');assert.equal(h.run('busy'),true);h.tick(650);await sent;
  assert.equal(h.run('history.length'),3);assert.match(h.run('history[2].content'),/commerciaux/);assert.equal(h.get('input').value,'');
  await h.run('finish()');assert.match(h.get('resultNote').textContent,/ne produit pas de note/);assert.equal(h.get('scores').children.length,0);
});
test('double envoi évité pendant une réponse',async()=>{const h=harness();h.run('start()');h.get('input').value='Bonjour';const sent=h.run('send()');await h.run('send()');h.tick(650);await sent;assert.equal(h.run('history.length'),3);});
test('une réponse tardive ne pollue pas une nouvelle session',async()=>{const h=harness();h.run('start()');h.get('input').value='Une question';const sent=h.run('send()');h.run('resetSession()');h.tick(650);await sent;assert.equal(h.run('history.length'),0);assert.equal(h.run('active'),false);assert.equal(h.get('input').disabled,true);});
test('erreur IA : réplique conservée, historique inchangé, nouvel envoi possible',async()=>{const h=harness(async(url)=>url==='/api/status'?Response.json({ready:true}):Response.json({error:'Code de session incorrect.'},{status:401}));h.get('engine').value='ai';h.get('accessCode').value='wrong';h.run('start()');h.get('input').value='Quel est votre besoin ?';await h.run('send()');assert.equal(h.get('input').value,'Quel est votre besoin ?');assert.equal(h.run('history.length'),1);assert.equal(h.run('busy'),false);assert.equal(h.get('send').disabled,false);assert.match(h.get('notice').textContent,/Code de session/);});
test('le mode IA envoie l’identifiant du client et aucun prompt système',async()=>{let payload;const h=harness(async(url,opts)=>{if(url==='/api/status')return Response.json({ready:true});payload=JSON.parse(opts.body);return Response.json({reply:'Je vous écoute.',mood_delta:1,gesture:'nod'});});h.get('engine').value='ai';h.get('accessCode').value='code';h.run('start()');h.get('input').value='Bonjour';await h.run('send()');assert.equal(payload.persona,'marc');assert.equal(payload.system,undefined);assert.equal(payload.action,'chat');assert.equal(h.run('history.length'),3);});
test('changer de client met à jour sa mission et le dossier',()=>{const h=harness();h.run('selectPersona(PERSONAS[1])');assert.equal(h.get('clientName').textContent,'Sophie Vasseur');assert.match(h.get('missionTitle').textContent,/besoin réel/);assert.equal(h.get('dossier').children.length,3);});
test('sans code le mode IA ne démarre pas',()=>{const h=harness();h.get('engine').value='ai';h.run('start()');assert.equal(h.run('active'),false);assert.match(h.get('notice').textContent,/code de session/);});
test('les quatre profils jouent jusqu’au débriefing en mode sans clé',async()=>{for(const id of ['marc','sophie','karim','claire']){const h=harness();h.run(`selectPersona(PERSONAS.find(p=>p.id==='${id}'))`);h.run('start()');for(const text of ['Quelle est votre priorité ?','Je propose une vérification avec notre production.','Quel volume en contrepartie ?','Récapitulons notre accord conditionnel.']){h.get('input').value=text;const sent=h.run('send()');h.tick(650);await sent;}assert.equal(h.run('history.length'),9);assert.ok(h.run('history.every(m=>typeof m.content==="string"&&m.content.length>0)'));await h.run('finish()');assert.equal(h.run('ended'),true);assert.equal(h.get('scores').children.length,0);}});

test('voix choisie par profil, liste tardive et remplacement si indisponible',()=>{let voices=[],spoken;const speech={getVoices:()=>voices,addEventListener(){},cancel(){},speak:u=>{spoken=u}};const h=harness(undefined,speech);voices=[{voiceURI:'a',name:'Audrey',lang:'fr-FR',localService:true},{voiceURI:'b',name:'English',lang:'en-US',localService:true}];h.run('refreshVoices()');assert.equal(h.get('voiceChoice').children.length,2);h.get('voiceChoice').value=JSON.stringify(['b','English','en-US']);h.get('voiceChoice').onchange();h.get('voice').checked=true;h.run('speak("Bonjour")');assert.equal(spoken,undefined);assert.equal(h.run('chooseVoice()'),null);h.run('selectPersona(PERSONAS[3])');h.run('speak("Bonjour")');assert.equal(spoken.voice.name,'Audrey');voices=[];h.run('speak("Bonjour")');assert.equal(h.run('chooseVoice()'),null);});
test('une voix numérotée inconnue nécessite un genre confirmé même si préférée',()=>{let voices=[{name:'Google français 4 (Natural)',lang:'fr-FR',voiceURI:'g'},{name:'Thomas',lang:'fr-FR',voiceURI:'t'}];const h=harness(undefined,{getVoices:()=>voices,addEventListener(){},cancel(){}});h.run("selected={...selected,preferredVoiceNames:['Google français 4 (Natural)']}");assert.equal(h.run('chooseVoice().name'),'Thomas');h.get('voiceChoice').value=JSON.stringify(['g','Google français 4 (Natural)','fr-FR']);h.get('voiceChoice').onchange();assert.equal(h.run('chooseVoice()'),null);h.get('voiceGender').value='male';h.get('voiceGender').onchange();assert.equal(h.run('chooseVoice().name'),'Google français 4 (Natural)');h.get('voiceGender').value='female';h.get('voiceGender').onchange();assert.equal(h.run('chooseVoice()'),null);});

test('Android : voix générique bloquée jusqu’à confirmation et accent canadien exclu',()=>{let voices=[{name:'Google français',lang:'fr-FR',voiceURI:'generic'},{name:'Thomas',lang:'fr-CA',voiceURI:'canada'},{name:'Google français 5 (Natural)',lang:'fr-FR',voiceURI:'number'}];const h=harness(undefined,{getVoices:()=>voices,addEventListener(){},cancel(){},speak(){throw Error('Ne doit pas parler sans voix validée');}},'Android');assert.equal(h.run('chooseVoice()'),null);h.get('voice').checked=true;h.run('start()');assert.equal(h.run('active'),true);assert.equal(h.run('speaking'),false);h.get('voiceChoice').value=JSON.stringify(['generic','Google français','fr-FR']);h.get('voiceChoice').onchange();assert.equal(h.run('chooseVoice()'),null);h.get('voiceGender').value='male';h.get('voiceGender').onchange();assert.equal(h.run('chooseVoice().voiceURI'),'generic');h.run('selectPersona(PERSONAS[1])');assert.equal(h.run('chooseVoice()'),null);voices=[{name:'Audrey',lang:'fr-CA',voiceURI:'ca'}];assert.equal(h.run('chooseVoice()'),null);});
test('la fiche de préparation est visible avant le chronomètre',()=>{const h=harness();assert.match(h.get('offerSheet').textContent,/1 800/);assert.equal(h.run('startedAt'),0);assert.equal(h.run('active'),false);});
test('24 combinaisons : contexte, offre fixe, dialogue et bilan sans clé',async()=>{for(const p of PERSONAS)for(const o of OFFERS){const h=harness();h.get('offerChoice').value=o.id;h.get('offerChoice').onchange();h.run(`selectPersona(PERSONAS.find(p=>p.id==='${p.id}'))`);assert.match(h.get('offerSheet').textContent,new RegExp(o.brand));assert.ok(h.get('dossier').children[0].textContent.includes(o.subject));h.run('start()');assert.equal(h.get('offerChoice').disabled,true);h.get('offerChoice').value=o.id==='training'?'coffee':'training';h.get('offerChoice').onchange();assert.equal(h.run('selectedOffer.id'),o.id);h.get('input').value='Quelle est votre priorité ?';const sent=h.run('send()');h.tick(650);await sent;assert.equal(h.run('history.length'),3);await h.run('finish()');assert.equal(h.get('scores').children.length,0);}});
test('Cloudflare sélectionné explicitement : offre envoyée et pas de clé Anthropic requise côté client',async()=>{let payload;const h=harness(async(url,opts)=>{if(url==='/api/status')return Response.json({ready:false,cloudflareReady:false});payload=JSON.parse(opts.body);return Response.json({reply:'Parlons des coffrets.',expression:'thinking'});});h.get('offerChoice').value='gifts';h.get('offerChoice').onchange();h.get('engine').value='cloudflare';h.get('accessCode').value='pilote';h.run('start()');h.get('input').value='Quel est votre besoin ?';await h.run('send()');assert.equal(payload.provider,'cloudflare');assert.equal(payload.offer,'gifts');assert.equal(h.run('history.length'),3);});

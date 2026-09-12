// Lifecycle tests run without a browser. Graphics and speech devices are stubbed;
// these checks do not replace a visual or real microphone acceptance test.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {PERSONAS} from '../src/personas.js';
import {demoReply} from '../src/demo.js';

function harness(fetcher=async()=>Response.json({ready:true})){
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
  const context=vm.createContext({document,window:{addEventListener(){}},location:{protocol:'https:'},matchMedia:()=>({matches:false}),AvatarStage:FakeAvatar,PERSONAS,demoReply,console,confirm:()=>true,setTimeout:timeout,clearTimeout:id=>timers.delete(id),setInterval(){},fetch:fetcher,AbortController,Blob,URL});
  const code=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
  vm.runInContext(code,context);
  elements.get('engine').value='demo';
  return {context,get:id=>elements.get(id),run:s=>vm.runInContext(s,context),tick(ms){for(const[id,t]of [...timers])if(t.ms===ms){timers.delete(id);t.f();}}};
}
test('une session démo produit un dialogue, sans note pédagogique inventée',async()=>{
  const h=harness();h.get('start').click();assert.equal(h.run('active'),true);assert.equal(h.run('history.length'),1);
  h.get('input').value='Quelles sont vos pannes ?';const sent=h.run('send()');assert.equal(h.run('busy'),true);h.tick(650);await sent;
  assert.equal(h.run('history.length'),3);assert.match(h.run('history[2].content'),/arrêt/);assert.equal(h.get('input').value,'');
  await h.run('finish()');assert.match(h.get('resultNote').textContent,/ne produit pas de note/);assert.equal(h.get('scores').children.length,0);
});
test('double envoi évité pendant une réponse',async()=>{const h=harness();h.run('start()');h.get('input').value='Bonjour';const sent=h.run('send()');await h.run('send()');h.tick(650);await sent;assert.equal(h.run('history.length'),3);});
test('une réponse tardive ne pollue pas une nouvelle session',async()=>{const h=harness();h.run('start()');h.get('input').value='Une question';const sent=h.run('send()');h.run('resetSession()');h.tick(650);await sent;assert.equal(h.run('history.length'),0);assert.equal(h.run('active'),false);assert.equal(h.get('input').disabled,true);});
test('erreur IA : réplique conservée, historique inchangé, nouvel envoi possible',async()=>{const h=harness(async(url)=>url==='/api/status'?Response.json({ready:true}):Response.json({error:'Code de session incorrect.'},{status:401}));h.get('engine').value='ai';h.get('accessCode').value='wrong';h.run('start()');h.get('input').value='Quel est votre besoin ?';await h.run('send()');assert.equal(h.get('input').value,'Quel est votre besoin ?');assert.equal(h.run('history.length'),1);assert.equal(h.run('busy'),false);assert.equal(h.get('send').disabled,false);assert.match(h.get('notice').textContent,/Code de session/);});
test('le mode IA envoie l’identifiant du client et aucun prompt système',async()=>{let payload;const h=harness(async(url,opts)=>{if(url==='/api/status')return Response.json({ready:true});payload=JSON.parse(opts.body);return Response.json({reply:'Je vous écoute.',mood_delta:1,gesture:'nod'});});h.get('engine').value='ai';h.get('accessCode').value='code';h.run('start()');h.get('input').value='Bonjour';await h.run('send()');assert.equal(payload.persona,'marc');assert.equal(payload.system,undefined);assert.equal(payload.action,'chat');assert.equal(h.run('history.length'),3);});
test('changer de client met à jour sa mission et le dossier',()=>{const h=harness();h.run('selectPersona(PERSONAS[1])');assert.equal(h.get('clientName').textContent,'Sophie Vasseur');assert.match(h.get('missionTitle').textContent,/besoin réel/);assert.equal(h.get('dossier').children.length,3);});
test('sans code le mode IA ne démarre pas',()=>{const h=harness();h.get('engine').value='ai';h.run('start()');assert.equal(h.run('active'),false);assert.match(h.get('notice').textContent,/code de session/);});

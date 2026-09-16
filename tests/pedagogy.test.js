import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handle,parseResult,verifyEvidence,expressionFor} from '../server/worker.js';
import {OFFERS} from '../src/offer.js';
const keys=['decouverte','argumentation','objection','ecoute','closing'];
const evaluation={...Object.fromEntries(keys.map(k=>[k,3])),verdict:'Bilan indicatif.',points_forts:[],axes_progres:[],details:keys.map(critere=>({critere,constat:'Une question est posée.',conseil:'Préciser le résultat attendu.',preuves:[{tour:1,citation:'Quelle est votre priorité ?'}]})),limites_simulation:[]};
test('régression Karim : preuves client seules et faux reproche de questions fermées rejetés',()=>{
 const bad=structuredClone(evaluation);bad.details=[{critere:'decouverte',constat:'Des questions fermées limitent la découverte.',preuves:[{tour:1,citation:'à quelle fréquence'},{tour:2,citation:'quel est le nombre'}]}];
 assert.throws(()=>verifyEvidence(bad,[{role:'user',content:'à quelle fréquence'},{role:'user',content:'quel est le nombre'}]),/CF_EVALUATION_UNSUPPORTED/);
 assert.throws(()=>verifyEvidence(evaluation,[{role:'assistant',content:'Quelle est votre priorité ?'}]),/CF_EVALUATION_UNSUPPORTED/);
});
test('24 situations : règles de dialogue, fiche et évaluation étayée',async()=>{
 for(const persona of ['marc','sophie','karim','claire'])for(const offer of OFFERS)for(const action of ['chat','evaluate']){
 const req=new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Access-Code':'test'},body:JSON.stringify({action,persona,offer:offer.id,provider:'cloudflare',messages:[{role:'user',content:'Quelle est votre priorité ?'}]})});
 const result=await handle(req,{ACCESS_CODE:'test',CLOUDFLARE_AI_ENABLED:'true',AI:{run:async(model,input)=>{
 const prompt=input.messages[0].content;
 assert.ok(prompt.includes(offer.brand));
 if(action==='chat'){assert.ok(prompt.includes('ne décrit pas ce que le commercial a dit'));assert.ok(prompt.includes('ne répète pas un doute vague'));assert.ok(prompt.includes('deux réunions de quatre heures'));return {response:'Je dois réfléchir.'};}
 assert.ok(prompt.includes('limites_simulation'));assert.ok(input.guided_json.required.includes('details'));assert.ok(input.messages[1].content.includes('[Tour 1] Commercial'));
 return {response:evaluation};
 }}});
 assert.equal(result.status,200,persona+' '+offer.id+' '+action);
 }
});
test('une citation inventée ou mal attribuée ne valide pas le débriefing',()=>{
 const parsed=parseResult(JSON.stringify(evaluation),'evaluate');
 assert.equal(verifyEvidence(parsed,[{content:'Quelle est votre priorité ?'}]),parsed);
 assert.throws(()=>verifyEvidence(parsed,[{content:'Bonjour.'}]),/Citation/);
 const bad=structuredClone(evaluation);bad.details[0].critere='closing';
 assert.throws(()=>parseResult(JSON.stringify(bad),'evaluate'),/Justifications/);
});
test('expressions prudentes : réserves et négations priment sur accord',()=>{
 for(const [text,expected] of [["Je suis d'accord.",'agreement'],["Je ne suis pas d'accord.",'neutral'],["Je suis d'accord, mais je dois vérifier.",'skeptical'],['Cela ne me convient pas.','refusal'],['Je ne veux pas poursuivre.','refusal'],['Votre réponse ne répond pas à mon besoin.','dissatisfied'],['Je suis ravie !','joy'],['Je ne suis pas ravie.','neutral'],['Je vais en parler avec mon équipe.','thinking'],['Quel suivi est prévu ?','thinking'],['Merci.','neutral']])assert.equal(expressionFor(text),expected,text);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseCloudflareResult,parseCloudflareChat,handle} from '../server/worker.js';
const data={reply:'Quels besoins avez-vous identifiés ?',expression:'thinking'};
test('dialogue en texte simple : conserve les paroles sans inventer de score',async()=>{
 const reply='Nous sommes cinq et nous souhaitons mieux découvrir les besoins.';
 assert.deepEqual(parseCloudflareChat({response:reply}),{reply,mood_delta:0,gesture:'neutral',expression:'neutral',expression_source:'text_rules'});
 assert.equal(parseCloudflareChat({choices:[{message:{content:reply}}]}).reply,reply);
 assert.throws(()=>parseCloudflareChat({response:'{"reply":'}));
 const req=new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Access-Code':'test'},body:JSON.stringify({action:'chat',persona:'sophie',provider:'cloudflare',messages:[{role:'user',content:'Combien êtes-vous ?'}]})});
 const result=await handle(req,{ACCESS_CODE:'test',CLOUDFLARE_AI_ENABLED:'true',AI:{run:async(model,input)=>{
 assert.equal(input.guided_json,undefined);
 assert.ok(!input.messages[0].content.includes('JSON uniquement'));
 return {response:reply};
 }}});
 assert.equal(result.status,200);assert.equal((await result.json()).reply,reply);
});
test('lecture de plusieurs enveloppes sans modifier la réplique',()=>{
 for(const answer of [{response:JSON.stringify(data)},{response:data},{choices:[{message:{content:JSON.stringify(data)},finish_reason:'stop'}]},{result:{response:JSON.stringify(data)}},data,JSON.stringify(data),{choices:[{message:{content:[{type:'text',text:JSON.stringify(data)}]}}]}]){
 assert.equal(parseCloudflareResult(answer,'chat').reply,data.reply);
 }
});
test('les réponses absentes, coupées et les faux débriefings restent rejetés',()=>{
 assert.throws(()=>parseCloudflareResult({},'chat'),/CF_OUTPUT_MISSING/);
 assert.throws(()=>parseCloudflareResult({choices:[{finish_reason:'length',message:{content:JSON.stringify(data)}}]},'chat'),/CF_OUTPUT_TRUNCATED/);
 assert.throws(()=>parseCloudflareResult({response:'Bonjour'},'chat'));
 assert.throws(()=>parseCloudflareResult({response:{verdict:'Très bien'}},'evaluate'),/incomplète/);
});

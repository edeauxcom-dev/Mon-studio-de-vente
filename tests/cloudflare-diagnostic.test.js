import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handle} from '../server/worker.js';
const request=()=>new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Access-Code':'test'},body:JSON.stringify({action:'chat',persona:'sophie',provider:'cloudflare',offer:'training',messages:[{role:'assistant',content:'Bonjour.'},{role:'user',content:'Quel est votre budget ?'}]})});
test('Cloudflare reçoit un dialogue alterné démarrant par le commercial',async()=>{
 const result=await handle(request(),{ACCESS_CODE:'test',CLOUDFLARE_AI_ENABLED:'true',AI:{run:async(model,input)=>{
 assert.deepEqual(input.messages.map(m=>m.role),['system','user','assistant','user']);
 assert.equal(input.messages.at(-1).content,'Quel est votre budget ?');
 return {response:'{"reply":"Parlons du budget."}'};
 }}});
 assert.equal(result.status,200);
});
test('diagnostic distinct, sans répétition automatique ni fuite de contenu',async()=>{
 for(const [failure,expected] of [['quota exceeded','CF_QUOTA'],['invalid input schema','CF_INPUT_REJECTED'],['private unknown error','CF_REQUEST_FAILED'],[null,'CF_RESPONSE_INVALID']]){
 let calls=0;
 const result=await handle(request(),{ACCESS_CODE:'test',CLOUDFLARE_AI_ENABLED:'true',AI:{run:async()=>{calls++;if(failure)throw Error(failure);return {response:'{"reply":"invalid private output'};}}});
 const data=await result.json();assert.equal(data.code,expected);assert.equal(calls,1);assert.equal(result.status,503);assert.ok(!data.error.includes('private'));
 }
});

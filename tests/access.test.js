import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handle} from '../server/worker.js';
test('accès vérifié sans appel IA et mode propriétaire imposé côté serveur',async()=>{
 let calls=0;const env={ACCESS_CODE:'secret',CLOUDFLARE_AI_ENABLED:'true',STUDIO_PROVIDER:'cloudflare',AI:{run(){calls++;}}};
 for(const [code,status] of [['wrong',401],['secret',200]]){
 const r=await handle(new Request('https://example.com/api/access',{method:'POST',headers:{'X-Access-Code':code}}),env);assert.equal(r.status,status);if(status===200)assert.equal((await r.json()).authenticated,true);
 }
 const badOrigin=await handle(new Request('https://example.com/api/access',{method:'POST',headers:{'X-Access-Code':'secret',Origin:'https://other.com'}}),env);assert.equal(badOrigin.status,403);
 const r=await handle(new Request('https://example.com/api/chat',{method:'POST',headers:{'X-Access-Code':'secret','Content-Type':'application/json'},body:JSON.stringify({provider:'anthropic',action:'chat',persona:'marc',messages:[{role:'user',content:'Bonjour'}]})}),env);assert.equal(r.status,403);assert.equal(calls,0);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';

function stage(){
  class Renderer{
    constructor(){this.domElement={setAttribute(){},remove(){}};this.shadowMap={};}
    setPixelRatio(){}setSize(){}setAnimationLoop(callback){this.callback=callback;}dispose(){}
    render(scene){scene.updateMatrixWorld(true);scene.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),'All transforms must stay finite'));}
  }
  const context=vm.createContext({THREE:{...THREE,WebGLRenderer:Renderer},devicePixelRatio:1,document:{hidden:false},performance:{now:()=>0},ResizeObserver:class{observe(){}disconnect(){}},container:{clientWidth:800,clientHeight:480,appendChild(){},addEventListener(){},removeEventListener(){}}});
  vm.runInContext(fs.readFileSync(new URL('../src/avatar.js',import.meta.url),'utf8').replace(/^import .*;\n/,'').replace('export class AvatarStage','class AvatarStage'),context);
  return vm.runInContext('new AvatarStage(container)',context);
}
test('les trois personnages se construisent et animent sans transformations invalides',()=>{const s=stage();for(const id of ['marc','sophie','karim']){s.setPersona(id);for(const state of ['idle','listening','thinking','speaking']){s.setState(state);for(const t of [.1,1,2,5])s.animate(t);}assert.equal(s.eyes.length,2);assert.equal(s.brows.length,2);}s.dispose();});
test('bouche animée pendant la parole, retour au repos, remplacement sans accumulation',()=>{const s=stage();s.setPersona('marc');const count=s.scene.children.length;s.setState('idle');s.animate(1);const resting=s.cavity.scale.y;s.setState('speaking');s.animate(2);assert.ok(s.cavity.scale.y>resting);assert.equal(s.teeth.visible,true);s.setState('idle');s.animate(3);assert.equal(s.cavity.scale.y,resting);s.setPersona('sophie');s.setPersona('marc');assert.equal(s.scene.children.length,count);s.dispose();});

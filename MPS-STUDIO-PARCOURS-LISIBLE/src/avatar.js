import marc from './assets/profiles/marc.png';
import sophie from './assets/profiles/sophie.png';
import karim from './assets/profiles/karim.png';
import claire from './assets/profiles/claire.png';
const images={marc,sophie,karim,claire};
const frames={neutral:0,speaking:1,thinking:2,dissatisfied:3,refusal:4,agreement:5,skeptical:6,joy:7,sadness:8};
export class AvatarStage{
 constructor(container,id='marc'){this.container=container;this.element=document.createElement('div');this.element.className='illustrated-client';this.element.setAttribute('role','img');container.append(this.element);this._motion=true;this.setPersona(id);}
 set motion(value){this._motion=!!value;this.element.classList.toggle('moving',this._motion);}
 get motion(){return this._motion;}
 setPersona(id){this.id=images[id]?id:'marc';this.element.style.backgroundImage='url("'+images[this.id]+'")';this.expression='neutral';this.state='idle';this.motion=this._motion;this.render();}
 setState(state){this.state=state;this.render();}
 setMood(mood,gesture='neutral'){this.expression=gesture==='firm'?'refusal':mood<35?'dissatisfied':gesture==='question'?'skeptical':gesture==='think'?'thinking':mood>65?'agreement':'neutral';this.render();}
 setExpression(expression){if(expression in frames){this.expression=expression;this.render();}}
 word(){}
 render(){const expression=this.state==='thinking'?'thinking':this.state==='listening'?'neutral':this.state==='speaking'&&this.expression==='neutral'?'speaking':this.expression;const frame=frames[expression]??0;this.element.style.backgroundPosition=(frame%3*50)+'% '+(Math.floor(frame/3)*50)+'%';this.element.setAttribute('aria-label','Portrait de '+this.id+' · '+expression);}
 dispose(){this.element.remove();}
}

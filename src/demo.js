import {offerById} from './offer.js';
// Rule-based practice only: never produce an AI score in this mode.
function trainingReply(id,text,turn,history=[]){
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const t=norm(text),previous=norm(history.filter(m=>m.role==='user').slice(0,-1).map(m=>m.content).join(' '));
 const question=/\?|comment|quel|pourquoi|combien|parlez/.test(t),next=/rendez.vous|prochain|creneau|recapitul|formal|accord|signer/.test(t),ack=/si je comprends|reformul|vous dites/.test(t);
 const result=(reply,expression='neutral',mood_delta=0)=>({reply,expression,mood_delta,gesture:mood_delta>0?'nod':expression==='refusal'?'firm':'question'});
 if(/(garanti|promets|certain)/.test(t)&&/(ventes|chiffre d.affaires|deux semaines|2 semaines)/.test(t))return result('Sur quoi repose cette garantie ? Je préfère une proposition réaliste et une vérification plutôt qu’une promesse non confirmée.','refusal',-2);
 if(id==='claire'){
  const discovery=/priorit|contrainte|pourquoi|combien|effectif|personne|participant|groupe/.test(previous);
  const reciprocal=/deux groupes|2 groupes/.test(previous+' '+t)&&/5\s*%|cinq pour cent|1710|1 710/.test(previous+' '+t);
  const conditional=/verifi|sous reserve|a confirmer|quatre semaines|4 semaines/.test(previous+' '+t);
  if(/(accorde|offre|accepte|fais|propose).*(10\s*%|dix pour cent)/.test(t))return result('Cette remise dépasse les conditions annoncées. Je préfère une proposition que vous êtes réellement autorisé à tenir.','skeptical',-2);
  if(next){if(discovery&&reciprocal&&conditional)return result('D’accord pour étudier deux groupes à 1 710 euros HT chacun, sous réserve de validation interne et de confirmation des dates. Envoyez-moi le récapitulatif des engagements et des conditions.','agreement',2);return result('Avant de formaliser, clarifions le nombre de groupes, la remise autorisée et la date à confirmer. Nous n’avons pas encore un accord complet.','refusal',-1);}
  if(/priorit|contrainte|pourquoi/.test(t))return result('Le premier groupe est prioritaire. Deux semaines seraient idéales, mais je peux examiner quatre semaines si nous n’avons pas d’autre créneau.','thinking',1);
  if(/effectif|personne|participant|combien|groupe/.test(t))return result('Il pourrait y avoir deux groupes de six personnes. Le second est moins urgent. Quel effet cela aurait-il sur vos conditions ?','neutral',1);
  if(/contrepart|en echange|engagement|5\s*%|cinq pour cent/.test(t))return result('Un engagement sur deux groupes peut être envisageable. Précisez le prix de chaque groupe et les dates restant à confirmer.','thinking',1);
  if(/verifi|sous reserve|date|planning/.test(t))return result('Très bien, vérifiez le planning avant de me confirmer une date. Nous pouvons avancer sur le périmètre et les conditions en parallèle.','neutral',1);
  if(/remise|rabais/.test(t))return result('Je demande dix pour cent. Quelle concession pouvez-vous réellement proposer, et contre quel engagement de notre part ?','skeptical',0);
  return result('Je souhaite une remise et une date plus proche. Quelles priorités souhaitez-vous clarifier pour construire une proposition réaliste ?','thinking',0);
 }
 const discovery=/priorit|difficul|objectif|besoin|situation|equipe|frein|probleme/.test(previous);
 if(next)return discovery?result(id==='karim'?'D’accord pour un point de quinze minutes centré sur les mises en situation et la prochaine étape en entretien. Quel créneau proposez-vous, à confirmer ?':'Un second rendez-vous me convient pour préciser le programme et vérifier les disponibilités. Quel objectif et quel créneau proposez-vous ?','agreement',1):result('Avant de fixer la suite, j’aimerais que vous compreniez mieux notre priorité. Que souhaitez-vous savoir sur les entretiens de mon équipe ?','thinking',0);
 if(id==='marc')return /prix|cher|cout|budget|remise/.test(t)?result('Une autre formation est annoncée à 1 500 euros HT. Je n’ai pas encore vérifié si le suivi est inclus. Comment comparer les deux offres ?','skeptical',0):question?result('Mes six commerciaux accordent trop vite des remises quand on les compare à un concurrent. Je voudrais qu’ils sachent mieux défendre la valeur de notre offre.','neutral',1):/mise.*situation|suivi|entrain/.test(t)?result('L’entraînement et le suivi peuvent faire la différence. Expliquez-moi comment ils se rapportent à la difficulté que je viens de décrire.','thinking',1):result('Quel bénéfice concret de votre formation répond à notre difficulté, au-delà du prix ?','skeptical',-1);
 if(id==='sophie')return ack?result('Oui : ils présentent trop tôt notre offre et repartent souvent sans prochaine étape. C’est sur ces deux points que je veux les aider.','agreement',1):question?result('Mes cinq commerciaux parlent beaucoup de nos produits, mais découvrent peu les priorités du client. Les entretiens se terminent souvent sans suite claire.','neutral',1):result('Avant de détailler votre programme, assurons-nous que nous parlons bien de la difficulté de mon équipe.','dissatisfied',-1);
 return question?result('Mes huit commerciaux ont besoin de mieux conclure les échanges par une prochaine étape précise. Je veux surtout de la pratique, en limitant le temps hors terrain.','neutral',1):t.length>230?result('Je vous arrête : soyez plus concis. Quel élément de votre offre répond directement à ma priorité ?','dissatisfied',-1):result('Quel bénéfice concret et quel format proposez-vous pour répondre à notre priorité ?','thinking',0);
}

export function demoReply(id,text,turn,history=[],offerId='training'){
 const o=offerById(offerId);if(!o)throw new Error('Offre inconnue.');
 if(offerId==='training')return trainingReply(id,text,turn,history);
 const t=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const previous=history.filter(m=>m.role==='user').slice(0,-1).map(m=>m.content).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const question=/\?|comment|quel|pourquoi|combien/.test(t),next=/rendez.vous|prochain|recapitul|accord|signer|formal/.test(t);
 const reply=(text,expression='neutral',mood_delta=0)=>({reply:text,expression,mood_delta,gesture:mood_delta>0?'nod':'question'});
 if(/garanti|promets/.test(t))return reply('Avant de m’engager, je souhaite vérifier ce qui est réellement confirmé dans votre offre. Évitons une promesse que vous ne pouvez pas tenir.','skeptical',-1);
 if(id==='claire'){
  if(/(10\s*%|dix pour cent)/.test(t)&&/offre|accorde|accepte|propose/.test(t))return reply('Cette remise dépasse vos conditions annoncées. Quelle proposition pouvez-vous réellement tenir ?','refusal',-2);
  if(next){const discovered=/priorit|besoin|quantite|volume|combien|engagement/.test(previous);const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const volume=normal(o.volume).split(' ').filter(w=>w.length>2).every(w=>(previous+' '+t).includes(w));const concession=/5\s*%|cinq pour cent/.test(previous+' '+t);if(discovered&&volume&&concession&&/verifi|confirmer|reserve/.test(previous+' '+t))return reply('Nous pouvons avancer sur cette proposition conditionnelle. Récapitulons : '+o.discount+' Le calendrier et notre engagement restent à confirmer.','agreement',2);return reply('Il reste à préciser notre engagement en contrepartie, le prix applicable et le calendrier avant de formaliser.','refusal',-1);}
  if(/quantite|volume|combien|engagement|perimetre/.test(t))return reply('Nous pourrions envisager '+o.volume+'. Quelles conditions précises cela permettrait-il ?','thinking',1);
  if(/priorit|besoin|pourquoi/.test(t))return reply('Notre enjeu est le suivant : '+o.need+'. Le calendrier compte, mais je préfère un délai fiable à une promesse.','neutral',1);
  if(/contrepart|remise|5\s*%/.test(t))return reply('Précisez la contrepartie attendue et le prix final. Je peux envisager un engagement si le calendrier est vérifié.','thinking',0);
  return reply('Nous négocions '+o.name.toLowerCase()+'. Je demande une remise et une date plus proche : que souhaitez-vous clarifier ?','skeptical',0);
 }
 if(next)return /priorit|besoin|difficul|usage|objectif/.test(previous)?reply('D’accord pour une prochaine étape centrée sur notre priorité. Précisez son objectif et une date à confirmer.','agreement',1):reply('Avant de convenir de la suite, clarifions ce que nous attendons de cette offre.','thinking',0);
 if(id==='marc'&&/prix|cher|cout|remise|budget/.test(t))return reply('Un concurrent annonce environ quinze pour cent de moins, mais je n’ai pas encore tous les détails. Comparons notamment '+o.value+'.','skeptical',0);
 if(question)return reply('Notre situation : '+o.need+'. '+(id==='karim'?'Quel bénéfice concret pouvez-vous relier à cette priorité ?':'Que souhaitez-vous préciser avant de nous conseiller ?'),'neutral',1);
 if(/si je comprends|reformul/.test(t))return reply('Oui, vous avez bien identifié notre attente. Quel élément de votre offre y répond directement ?','agreement',1);
 return reply(id==='sophie'?'Avant de présenter toutes les options, aidons-nous à préciser les usages attendus.':id==='karim'?'Soyez concis : quel bénéfice de cette offre répond à notre priorité ?':'Je souhaite comprendre la valeur de votre offre pour notre situation.','thinking',0);
}

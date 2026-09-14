export function demoReply(id, text, turn, history=[]) {
  const question=/\?|comment|quel|pourquoi|combien|parlez|expliquez/i.test(text);
  const next=/rendez.vous|diagnostic|audit|visite|prochaine|créneau/i.test(text);
  const price=/prix|cher|coût|budget|rabais|remise/i.test(text);
  const acknowledge=/si je comprends|reformul|donc|vous dites/i.test(text);
  if(id==='claire'){
    const previous=history.filter(m=>m.role==='user').slice(0,-1).map(m=>m.content).join(' ');
    const discover=/priorit|impératif|imperatif|contrainte|pourquoi|quel.*délai|quelle.*date/i;
    const reciprocal=/contrepart|en échange|en echange|volume|acompte|engagement annuel|commande groupée/i;
    const plan=/fractionn|première ligne|premiere ligne|production|vérifi|verifi|sous réserve|sous reserve/i;
    const close=/accord|récapitul|recapitul|formal|confirm|signature|signer/i;
    let reply,expression,mood_delta;
    if(close.test(text)&&discover.test(previous)&&reciprocal.test(previous+' '+text)&&plan.test(previous+' '+text)){reply="D’accord sur le principe : une première ligne prioritaire et une seconde à six semaines, sous réserve de validation par votre production. Envoyez-moi le récapitulatif du prix, de notre contrepartie et du calendrier pour validation interne.";expression='agreement';mood_delta=2;}
    else if(/garanti|promets|certain/i.test(text)&&/délai|livr|semaine/i.test(text)&&!plan.test(text)){reply="Je ne peux pas accepter une promesse sans vérification. Faites confirmer ce délai par votre production avant de me demander un engagement.";expression='refusal';mood_delta=-2;}
    else if(reciprocal.test(text)){reply="Nous pouvons envisager une commande groupée ou un engagement sur les consommables, sous validation interne. Quelle concession précise proposez-vous en contrepartie, et comment sécurisez-vous la première livraison ?";expression='thinking';mood_delta=1;}
    else if(plan.test(text)){reply="Une livraison fractionnée peut convenir : la première ligne doit repartir dans quatre semaines, la seconde peut attendre six semaines. Faites valider cette organisation et précisons les contreparties.";expression='joy';mood_delta=1;}
    else if(discover.test(text)){reply="La date de remise en route de la première ligne est prioritaire. Pour la seconde, six semaines restent possibles. Le budget compte, mais un retard coûterait davantage.";expression='neutral';mood_delta=1;}
    else if(/remise|rabais|réduction/i.test(text)&&/accord|offre|fais|propos|accept/i.test(text)){reply="Vous acceptez cette remise sans condition ? Dans ce cas, pouvez-vous aussi prendre en charge la livraison urgente ? Je veux comprendre les limites de votre proposition.";expression='skeptical';mood_delta=-1;}
    else if(close.test(text)){reply="Nous ne sommes pas encore d’accord : il reste à clarifier le calendrier, le prix et les engagements de chacun avant de formaliser.";expression='refusal';mood_delta=-1;}
    else if(question){reply="Je demande dix pour cent de remise et une livraison en quatre semaines au lieu de six. Que souhaitez-vous clarifier pour construire une proposition réaliste ?";expression='thinking';mood_delta=0;}
    else{reply="Je vous écoute, mais votre réponse ne traite pas encore mes conditions de prix et de livraison. Quelle marge de négociation proposez-vous ?";expression='dissatisfied';mood_delta=-1;}
    return {reply,expression,mood_delta,gesture:mood_delta>0?'nod':'question'};
  }
  const replies={
    marc: next?"Une visite sur site, pourquoi pas. Précisez ce que vous allez mesurer et combien de temps cela prendra.":price?"Filtrotech me propose quinze pour cent de moins. Qu'est-ce qui justifie votre différence de prix ?":question?"On a un arrêt environ une fois par mois. Ce qui m'intéresse, c'est le temps d'immobilisation et votre délai d'intervention.":"Soyons concrets. En quoi votre solution répond-elle aux pannes de ma ligne ?",
    sophie: next?"Un diagnostic me semblerait utile. Qu'allez-vous vérifier pour distinguer un problème de filtration d'une usure machine ?":acknowledge?"Oui, c'est bien ça : la baisse de rendement et les pièces hors tolérance. Je veux comprendre leur cause avant d'investir.":question?"Certaines pièces sont hors tolérance depuis quelques mois. Je ne sais pas encore si cela vient de l'air ou des machines.":"Je comprends votre proposition, mais je ne suis pas certaine que la filtration soit la cause. Comment peut-on le vérifier ?",
    karim: next?"Proposez un créneau court avec un objectif précis. Je veux savoir comment vous éviterez une interruption d'activité.":question?"Ma priorité, c'est que les entrepôts restent opérationnels. Quel délai d'intervention pouvez-vous garantir ?":text.length>230?"Je vous arrête : j'ai peu de temps. Quel est le bénéfice concret pour la continuité d'activité ?":"Allez à l'essentiel. Comment votre offre réduit-elle le risque d'arrêt ?"
  };
  return {reply:replies[id],mood_delta:question||acknowledge||next?1:-1,expression:next?'thinking':acknowledge?'agreement':question?'neutral':id==='karim'&&text.length>230?'dissatisfied':'skeptical',gesture:question?'nod':'question'};
}

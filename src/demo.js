export function demoReply(id, text, turn) {
  const question=/\?|comment|quel|pourquoi|combien|parlez|expliquez/i.test(text);
  const next=/rendez.vous|diagnostic|audit|visite|prochaine|créneau/i.test(text);
  const price=/prix|cher|coût|budget|rabais|remise/i.test(text);
  const acknowledge=/si je comprends|reformul|donc|vous dites/i.test(text);
  const replies={
    marc: next?"Une visite sur site, pourquoi pas. Précisez ce que vous allez mesurer et combien de temps cela prendra.":price?"Filtrotech me propose quinze pour cent de moins. Qu'est-ce qui justifie votre différence de prix ?":question?"On a un arrêt environ une fois par mois. Ce qui m'intéresse, c'est le temps d'immobilisation et votre délai d'intervention.":"Soyons concrets. En quoi votre solution répond-elle aux pannes de ma ligne ?",
    sophie: next?"Un diagnostic me semblerait utile. Qu'allez-vous vérifier pour distinguer un problème de filtration d'une usure machine ?":acknowledge?"Oui, c'est bien ça : la baisse de rendement et les pièces hors tolérance. Je veux comprendre leur cause avant d'investir.":question?"Certaines pièces sont hors tolérance depuis quelques mois. Je ne sais pas encore si cela vient de l'air ou des machines.":"Je comprends votre proposition, mais je ne suis pas certaine que la filtration soit la cause. Comment peut-on le vérifier ?",
    karim: next?"Proposez un créneau court avec un objectif précis. Je veux savoir comment vous éviterez une interruption d'activité.":question?"Ma priorité, c'est que les entrepôts restent opérationnels. Quel délai d'intervention pouvez-vous garantir ?":text.length>230?"Je vous arrête : j'ai peu de temps. Quel est le bénéfice concret pour la continuité d'activité ?":"Allez à l'essentiel. Comment votre offre réduit-elle le risque d'arrêt ?"
  };
  return {reply:replies[id],mood_delta:question||acknowledge||next?1:-1,gesture:question?'nod':'question'};
}

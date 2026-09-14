# Prise en compte de la conversation mobile — 14 septembre 2026

La conversation fournie est conservée localement dans design/conversation-mobile-budget-reference.txt. Ses affirmations sur la synchronisation des applications et ses estimations ne constituent pas des observations du présent simulateur.

## État réel du code
Navigateur → Worker Cloudflare → Anthropic. La clé reste un secret Cloudflare. Un appel par réplique apprenant, puis un appel de débriefing si demandé. Chaque réplique renvoie tout l’historique actuel avec le scénario et la fiche. Limite : 30 échanges. Il n’y a actuellement ni résumé automatique ni cache de prompt explicite. Les optimisations ne doivent pas supprimer les éléments nécessaires à l’évaluation.

## Modèles configurables
Le modèle existant est conservé : ANTHROPIC_MODEL, sinon claude-sonnet-4-6. Deux variables Cloudflare facultatives permettent de choisir séparément ANTHROPIC_CHAT_MODEL pour la conversation et ANTHROPIC_EVAL_MODEL pour l’analyse. Elles priment sur ANTHROPIC_MODEL. Aucune clé supplémentaire n’est nécessaire pour cette séparation, sous réserve d’accès aux modèles sur le compte.

Haiku 4.5 est une option à tester pour les dialogues : identifiant claude-haiku-4-5-20251001. La documentation Anthropic consultée indique 1 $/million de tokens d’entrée et 5 $/million de tokens de sortie. Source officielle : https://platform.claude.com/docs/en/models/overview . Les tarifs sont à revérifier au moment du pilote. Aucun achat ni changement automatique de modèle n’a été effectué.

## Mesurer avant d’extrapoler
La clé n’est pas un quota de tokens à racheter. Les appels consomment le budget du compte fournisseur. Les chiffres de la conversation mobile (0,025 $ ou 0,02 à 0,08 $ par entretien) étaient des hypothèses, pas une mesure de ce code.

Pour N appels, les instructions fixes sont transmises N fois et l’historique croît à chaque tour. Calculer le coût sur la somme des entrées et sorties de tous les appels, débriefing compris. Pour Haiku sans cache, formule indicative en dollars : total_tokens_entree / 1 000 000 + 5 × total_tokens_sortie / 1 000 000. Cette formule ne doit pas être appliquée à Sonnet.

Faire un petit pilote identifié dans la console Anthropic, relever la consommation et le nombre d’entretiens terminés, puis calculer le coût moyen et sa variabilité. Réserver le cache ou le résumé de l’historique à une étape ultérieure après validation du comportement. Les tokens ne sont pas encore enregistrés dans l’export du simulateur ; consulter la console fournisseur. Aucun nombre d’entretiens garanti pour un montant de crédit n’est annoncé.

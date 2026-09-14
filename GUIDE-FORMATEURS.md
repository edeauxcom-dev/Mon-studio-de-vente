# Studio de vente — version illustrée, 4 profils

## Mettre à jour le dépôt existant

1. Décompressez MPS-STUDIO-4-PROFILS-GITHUB.zip.
2. Ouvrez le dépôt Mon-studio-de-vente, onglet Code, à la racine.
3. Add file → Upload files : glissez le CONTENU du dossier décompressé (les dossiers src, server, tests, scripts et les fichiers à leur côté). Ne glissez ni le ZIP ni son dossier enveloppe. Ne supprimez pas les dossiers existants.
4. Commit changes sur main. Cloudflare doit démarrer une nouvelle construction si la connexion GitHub est active.
5. Attendez la réussite du nouveau déploiement, puis ouvrez le site et actualisez la page.

Cloudflare : nom mon-studio-de-vente ; commande de construction pnpm run test && pnpm run build ; commande de déploiement pnpm exec wrangler deploy ; racine /.
Les secrets ANTHROPIC_API_KEY et ACCESS_CODE se règlent dans Cloudflare, jamais dans GitHub. Les conserver s’ils sont déjà configurés. GitHub stocke le code ; Cloudflare héberge le simulateur et son API. GitHub Pages seul ne permet pas le mode IA.

## Faire essayer aux formateurs

Ouvrir https://mon-studio-de-vente.edeaux-com.workers.dev/ après le déploiement.

- Choisir Marc (objection prix), Sophie (besoin flou), Karim (concision) ou Claire (négociation avec contreparties).
- Lire la mission et le dossier client.
- Choisir une voix parmi celles proposées par le navigateur. La préférence est locale à chaque navigateur et personnage ; les voix ne sont pas distribuées aux autres postes.
- Sélectionner le mode. Sans clé : répliques prédéfinies réactives, aucune note. Avec IA : code de session requis, réponses libres et débriefing sur cinq critères.
- Commencer l’entretien, répondre au clavier ou au micro si disponible. Le clavier reste utilisable sans reconnaissance vocale.
- Terminer et débriefer, puis télécharger la transcription si utile. La transcription peut contenir les propos saisis : ne pas y mettre d’informations confidentielles lors de ces essais.

## Scénario de Claire

Claire achète pour deux lignes de production. Elle demande 10 % de remise et quatre semaines de délai au lieu de six. L’objectif est de découvrir ses priorités, rechercher des concessions réciproques et vérifier la faisabilité avant de formaliser un accord conditionnel. Le débriefing IA évalue spécifiquement la négociation et les contreparties. Le dossier apprenant ne dévoile pas toutes les marges internes du personnage.

## Vérifications recommandées pendant le test formateur

Essayer une question de découverte, une réponse peu pertinente et une proposition de prochaine étape. Vérifier la pertinence de la réplique, l’expression et la continuité du dialogue. Pour Claire, comparer un rabais sans contrepartie à une proposition conditionnelle construite. Essayer arrêt de la voix, nouvelle session et export de transcription. Évaluer les retours IA comme une aide pédagogique, non comme une certification.

## État de livraison

29 tests automatiques réussis : quatre parcours de session, scénario Claire, expressions, choix des voix, protections et validation serveur. Compilation de production et vérification de déploiement Cloudflare sans publication réussies. Aucun appel réel payant à Anthropic effectué pendant la vérification ; aucun déploiement distant réalisé. Le rendu dans un navigateur réel, l’écoute des voix et le microphone restent à valider sur les postes des formateurs.

Les expressions sont des illustrations sélectionnées par le moteur de dialogue, avec une respiration visuelle légère ; il ne s’agit pas d’une vidéo ni d’une synchronisation labiale. Les modes sans clé et IA restent explicitement distingués dans l’interface.


## Voix attribuées par défaut

- Karim : Chrome OS français 5 (fr-FR).
- Sophie : Chrome OS français 1 (fr-FR).
- Marc : Google français 5 (Natural) (fr-FR).
- Claire : Chrome OS français 4 (fr-FR).

Ces voix sont sélectionnées en mode Automatique lorsqu’elles sont accessibles au navigateur. Un choix manuel mémorisé reste prioritaire : sélectionner Automatique pour retrouver la voix attribuée. Sinon, une voix française connue correspondant au personnage est recherchée, puis une voix française disponible. Le genre ne peut pas être garanti si aucune voix connue n’est proposée par le navigateur. Chrome sur ordinateur est recommandé pour cet essai, sans garantie de catalogue identique entre appareils.

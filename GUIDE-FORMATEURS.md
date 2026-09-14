# Pilote V4 — 4 clients × 6 offres, IA Cloudflare

## 1. Déposer le nouveau paquet sur GitHub
Décompressez MPS-STUDIO-PILOTE-V4-24-SITUATIONS.zip. Dans le dépôt Mon-studio-de-vente, onglet Code, choisissez Add file → Upload files et déposez tout le CONTENU du dossier à la racine : src, server, tests, scripts et les fichiers associés. Validez Commit changes sur main. Ne déposez pas le ZIP ni le dossier enveloppe.

Cloudflare doit construire et déployer automatiquement. Nom : mon-studio-de-vente. Construction : pnpm run test && pnpm run build. Déploiement : pnpm exec wrangler deploy. Racine : /. Le fichier wrangler.jsonc contient désormais la liaison Workers AI nommée AI et CLOUDFLARE_AI_ENABLED=true.

## 2. Créer le code formateur — aucune clé Anthropic nécessaire
Sur Cloudflare : Workers & Pages → mon-studio-de-vente → Settings → Variables and Secrets (Variables et secrets).
Ajouter une variable de type Secret :
- Nom exact : ACCESS_CODE
- Valeur : un code que vous choisissez et conservez pour ce pilote. Préférez plusieurs mots ou une suite difficile à deviner.
Enregistrer et déployer si Cloudflare le demande. Ne mettez pas ce code dans GitHub et ne l’envoyez pas à l’assistant. Il sera communiqué directement aux 2 ou 3 apprenants sélectionnés. S’il existe déjà, conservez-le ou remplacez-le : aucune seconde clé n’est nécessaire.

Ouvrir ensuite https://mon-studio-de-vente.edeaux-com.workers.dev/ . Vérifier l’en-tête PILOTE 04, les six offres et le mode IA Cloudflare. La présence de AI se vérifie aussi dans l’onglet Bindings du Worker. Si l’interface indique une configuration absente, vérifier ACCESS_CODE, la liaison AI et la réussite du dernier déploiement.

## 3. Tester une vraie conversation
1. Choisir Marc, Sophie, Karim ou Claire.
2. Choisir une offre : formation, café/boissons, journée d’équipe, coworking, coffrets cadeaux ou pack bureau/fauteuil.
3. Lire la fiche et le contexte AVANT le chronomètre. Chaque offre donne périmètre, prix, délais et concessions autorisées. Préparation libre ; entretien conseillé de 5 à 8 minutes, sans coupure automatique.
4. Choisir IA Cloudflare, saisir le code formateur, essayer la voix puis commencer. Le dialogue et les expressions réagissent aux réponses générées. Les choix client/offre sont fixes pendant la session.
5. Terminer et débriefer. Le débriefing porte sur la même combinaison client/offre. Il doit être discuté avec le formateur, pas assimilé à une certification.
6. Remplir les deux questions de retour et le commentaire facultatif. Télécharger l’entretien puis transmettre le fichier au formateur. Le fichier contient le client, l’offre, le mode, le dialogue, le débriefing et le retour du testeur ; aucun code d’accès.

Le fichier local DEMO-OUVRIR.html permet seulement l’essai à répliques prédéfinies. L’IA nécessite la version déployée. La galerie PROFILS-ILLUSTRES-DEMO.html est une ancienne présentation visuelle, pas le pilote complet.

## Gratuité et limites
Vous avez confirmé utiliser Workers Free. Cloudflare accorde 10 000 Neurons par jour, partagés au niveau du compte, avec remise à zéro à 00:00 UTC. Sur Free, le dépassement bloque les appels ; sur Paid, les dépassements peuvent être facturés. Ne passez pas à Workers Paid pour ce pilote sans revoir le budget. Aucun nombre d’entretiens n’est garanti par ce quota.
Modèle choisi : @cf/mistralai/mistral-small-3.1-24b-instruct. Aucun appel Anthropic n’est effectué en cas d’erreur Cloudflare. Le message utilisateur est conservé ; une réponse incomplète n’est pas remplacée par une fausse réponse IA. Le mode Anthropic reste explicitement payant et séparé.
Sources : https://developers.cloudflare.com/workers-ai/platform/pricing/ ; https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/ ; https://developers.cloudflare.com/workers-ai/configuration/bindings/ . Vérifiées le 14 septembre 2026.

## Voix et portraits
Les quatre portraits et leurs neuf expressions sont conservés. Voix fr-FR uniquement. Android ne reçoit pas automatiquement une voix numérotée d’ordinateur ni une voix générique de genre inconnu. Si aucune voix connue n’est disponible, choisir et écouter une voix ou poursuivre en texte. Les voix ne sont pas générées par le moteur conversationnel. Le timbre réel reste à vérifier sur chaque appareil.

## Recueil du pilote
Commencer par 2 ou 3 apprenants. Leur demander une situation commune pour comparer les réactions, puis une seconde combinaison libre. Relever : comprennent-ils l’offre ? Le client tient-il compte des réponses ? Y a-t-il une objection incohérente, une répétition ou un chiffre inventé ? Le retour aide-t-il à recommencer ? Ont-ils envie d’un nouvel essai ?

Les quotas par formateur/jour/semaine/mois ne sont PAS encore développés. Cette idée est conservée pour une prochaine étape, avec attribution de sessions, suivi de consommation et financement MPS après validation du pilote. Pour l’instant : un code partagé au petit groupe, quota Cloudflare global.

## Vérification de livraison
40 tests automatiques réussis, dont les 24 combinaisons en parcours de démonstration, les deux fournisseurs séparés, l’absence de repli payant, les erreurs de quota simulées, le débriefing, les scénarios et les voix Android simulées. Compilation et déploiement à blanc réussis. Les appels IA ont été simulés dans les tests : la disponibilité effective du modèle sur votre compte, la qualité de ses réponses françaises et le rendu/son sur les appareils restent à vérifier en ligne avant l’envoi aux apprenants. Aucun déploiement distant n’a été effectué par l’assistant.

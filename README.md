# Studio de vente — pilote commercial et voix Android

## Mettre en ligne
Décompresser MPS-STUDIO-VENTE-PILOTE-V3.zip. Dans GitHub / Mon-studio-de-vente / Code / Add file / Upload files, déposer tout le CONTENU du dossier à la racine (src, server, tests, scripts et fichiers associés). Valider Commit changes sur main. Attendre le nouveau déploiement Cloudflare puis actualiser le site.

Configuration conservée : Worker mon-studio-de-vente ; construction pnpm run test && pnpm run build ; déploiement pnpm exec wrangler deploy ; racine /. Les clés restent dans Cloudflare. Aucun secret à déposer dans GitHub.

## Objet de l’essai
Les apprenants vendent une offre fictive de formation CAP VENTE, sans expertise industrielle ni diagnostic technique. La fiche commerciale est ouverte avant l’entretien et reste consultable. Préparation non chronométrée ; 5 à 8 minutes conseillées, 5 pour Karim, aucune coupure automatique. Obtenir une prochaine étape pertinente suffit : aucune signature ni résolution complète du problème n’est exigée.

Offre : une journée de 6 heures à distance, 4 à 8 participants, questionnaire préparatoire, entraînements, fiche méthode et suivi collectif de 45 minutes deux semaines après. Prix : 1 800 € HT par groupe ; délai usuel à partir de quatre semaines. Maximum 5 % contre deux groupes fermes : 1 710 € HT par groupe. Date rapprochée à vérifier. Aucun résultat de vente garanti.

- Marc : comparaison de prix et défense de la valeur.
- Sophie : clarification du besoin avant de présenter l’offre.
- Karim : argumentation ciblée et prochaine étape en temps court.
- Claire : contreparties, marge autorisée et date à confirmer.

La fiche est partagée avec le moteur IA et le débriefing pour éviter des exigences hors contexte. Les détails de motivation du client ne sont pas tous révélés à l’apprenant au départ.

## Voix, notamment sur Android
Seules les voix déclarées fr-FR sont proposées. Les voix fr-CA sont exclues, y compris une ancienne sélection mémorisée. Une voix générique ne permet pas de connaître son genre : elle n’est pas sélectionnée automatiquement.
Sur ordinateur, les quatre préférences validées sont conservées lorsqu’elles sont disponibles : Karim Chrome OS français 5 ; Sophie Chrome OS français 1 ; Marc Google français 5 (Natural) ; Claire Chrome OS français 4.
Sur Android, ces voix numérotées ne sont PAS automatiquement réputées équivalentes : une voix connue correspondant au profil est recherchée. À défaut, aucune voix n’est lancée automatiquement. Choisir une voix dans la liste, utiliser Écouter un essai, puis conserver le choix ou poursuivre en texte. La préférence manuelle est mémorisée par personnage dans ce navigateur. Le navigateur ne garantit ni le genre ni l’accent réel des voix : l’écoute sur le poste reste nécessaire.

## Déroulement du pilote
1. Lire la fiche, choisir un client, essayer une voix.
2. Sans clé : répliques prédéfinies basées sur des règles simples, sans note. Ce mode valide surtout interface et déroulement, pas la pertinence d’un dialogue IA libre.
3. Mode IA : ANTHROPIC_API_KEY et ACCESS_CODE requis dans Cloudflare. Donner uniquement le code de session aux formateurs. Les appels Anthropic sont payants.
4. Mener l’entretien au clavier ou au micro disponible. Terminer et exporter la transcription et le débriefing.
5. Le formateur compare le débriefing avec les propos réels, en vérifiant le respect de la fiche, la pertinence commerciale et la cohérence des réactions.

## Vérifications de livraison
33 tests automatiques passent : parcours des quatre clients, conditions de Claire, fiche avant chronomètre, scénarios et évaluation partageant la fiche, sélection vocale simulée sur Android, exclusion fr-CA, expressions et validations serveur. Compilation et déploiement Cloudflare à blanc réussis. Aucun appel Anthropic payant ni publication distante effectué. L’écoute sur un vrai Android et la fiabilité pédagogique des retours IA nécessitent encore un essai formateur en conditions réelles.

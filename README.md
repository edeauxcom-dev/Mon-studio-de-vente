# MPS — Studio de vente avec avatars 3D

Version pilote préparée le 12 septembre 2026 à partir du simulateur TechnoFlux fourni. Les trois scénarios originaux sont conservés. Netlify a été remplacé par un Worker Cloudflare avec les fichiers du site. Aucun compte externe n’a été créé et aucun site n’a été publié.

## Essayer immédiatement

Ouvrir **DEMO-OUVRIR.html** dans un navigateur récent. Ce fichier est inclus dans le ZIP de livraison ; il contient l’interface et la 3D. Choisir un client, cliquer sur « Commencer l’entretien », puis écrire une réplique. L’utilisation au clavier ne demande ni installation ni clé.

Le mode démonstration utilise des réponses prédéfinies : il permet de découvrir les personnages et les commandes, mais ne simule pas un raisonnement IA et ne fournit pas de note. La synthèse vocale dépend des voix françaises installées. Le microphone est à essayer sur le site HTTPS après installation ; les navigateurs peuvent le restreindre pour un fichier local.

## Ce qui est livré

- Trois personnages 3D dessinés en code : Marc, Sophie et Karim, dans un décor de bureau.
- Mouvements de tête, respiration légère, clignements, regard, sourcils et bouche animée pendant la voix.
- Discussion texte, lecture vocale française, dictée et option mains libres par alternance écoute/réponse.
- Interruption manuelle de la voix, transcription et export JSON de l’entretien.
- Débriefing IA sur cinq critères adaptés au client ; aucune note simulée en mode démonstration.
- API Anthropic exécutée côté Cloudflare, clé secrète côté serveur, code de session partagé pour accéder au mode IA.
- Configuration Cloudflare, verrouillage des dépendances et vérifications GitHub Actions.

Le rendu est un prototype 3D stylisé construit avec des formes et courbes, plus simple que la référence fournie. Il n’atteint pas la qualité d’un personnage sculpté et texturé par un artiste. La bouche s’anime selon un rythme approximatif pendant la parole : il n’y a pas de synchronisation phonème par phonème. Les interruptions spontanées par la voix, l’analyse de la webcam, les comptes apprenants et la sauvegarde centralisée ne sont pas implémentés.

## Installation GitHub + Cloudflare sans terminal

1. Créer un dépôt GitHub privé nommé, par exemple, `mps-simulateur-avatars`. Y déposer **le contenu du dossier** (pas seulement le ZIP). `package.json`, `wrangler.jsonc`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `index.html`, `src/` et `server/` doivent être à la racine. Inclure aussi `tests/`, `scripts/` et `.github/`. Ne pas transférer `node_modules/`, `.dev.vars`, `.wrangler/` ni un fichier contenant une vraie clé. Le fichier de démonstration n’est pas nécessaire au site hébergé.
2. Dans Cloudflare, créer une application **Workers** et connecter ce dépôt GitHub. Utiliser la branche principale choisie dans GitHub. Les libellés du tableau de bord peuvent varier. Les valeurs à renseigner sont :

   | Champ | Valeur |
   |---|---|
   | Nom du Worker | `mps-simulateur-avatars` |
   | Répertoire racine | Racine du dépôt |
   | Commande de construction / Build command | `pnpm run test && pnpm run build` |
   | Commande de déploiement / Deploy command | `pnpm exec wrangler deploy` |
   | Variable de build `NODE_VERSION` | `24` |
   | Variable de build `PNPM_VERSION` | `11.19.0` |

   Le nom du Worker doit correspondre à `name` dans `wrangler.jsonc`. Si vous choisissez un autre nom, modifier les deux. Le dossier des fichiers produits est déjà défini comme `dist` dans cette configuration.
3. Le premier déploiement permet déjà la démonstration. Dans les paramètres **Variables et secrets du Worker à l’exécution**, ajouter deux secrets :

   | Secret | Contenu |
   |---|---|
   | `ANTHROPIC_API_KEY` | Votre clé API Anthropic avec des crédits disponibles |
   | `ACCESS_CODE` | Un code long choisi par vous, à donner uniquement aux participants |

   Les ajouter aux secrets d’exécution, pas seulement aux variables de construction. Appliquer/déployer les changements de configuration si Cloudflare le demande. `ANTHROPIC_MODEL` est déjà défini dans `wrangler.jsonc`. Aucun secret n’est à inscrire dans le code ni à transmettre dans une conversation.
4. Ouvrir l’adresse HTTPS fournie par Cloudflare. Choisir **Entretien avec l’IA**, saisir le code de session et commencer. Après un échange, terminer pour vérifier le débriefing. Lier GitHub à Cloudflare permet ensuite de publier les mises à jour du dépôt par le système de builds Cloudflare.

Références officielles : [intégration Git Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/), [configuration des builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [secrets d’exécution](https://developers.cloudflare.com/workers/configuration/secrets/), [fichiers statiques du Worker](https://developers.cloudflare.com/workers/static-assets/).

## Utilisation par le formateur

Pour Marc, travailler la découverte technique et la défense de la valeur face à un concurrent moins cher. Pour Sophie, aider à préciser la cause du problème avant de proposer une solution. Pour Karim, cibler rapidement la continuité d’activité.

Le code de session est une protection simple pour un pilote encadré, pas un système de comptes individuels. Le changer dans Cloudflare quand nécessaire. Chaque appel IA et débriefing utilise votre API Anthropic ; le site ne mesure pas les coûts et ne dispose pas de quota par apprenant. La session est limitée à 30 répliques apprenant et 60 000 caractères d’historique côté serveur.

Les conversations restent en mémoire dans l’onglet et sont perdues à la fermeture ou lors d’une remise à zéro. L’export est manuel. En mode IA, le texte de l’entretien est envoyé à Anthropic. La dictée peut utiliser le service vocal du navigateur ; l’application ne conserve pas d’enregistrement audio. Les polices du site hébergé sont chargées depuis Google Fonts ; la démo autonome utilise des polices de secours locales.

## Essai de réception après installation

1. Essayer les trois clients en démonstration ; vérifier le visage et les mouvements.
2. Activer le mode IA : poser une question sur les pannes de Marc, vérifier une réponse contextuelle.
3. Tester « Voix du client » avec une voix française installée, puis « Interrompre la voix ».
4. Autoriser le micro sur HTTPS, dicter une phrase ; vérifier le texte et la réponse. Tester mains libres avec un casque.
5. Terminer une session de Sophie : le troisième critère doit être « Clarification du doute ».
6. Télécharger l’entretien, puis recommencer ; aucun message précédent ne doit réapparaître.

## Développement local

Node.js 24 et pnpm 11.19.0. Dans le dossier :

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm preview
```

`pnpm preview` lance le Worker local via Wrangler (avec les fichiers compilés). Pour l’IA locale, copier `.dev.vars.example` vers `.dev.vars` puis y renseigner vos secrets. Ce fichier est exclu de Git. `pnpm dev` lance uniquement l’interface Vite : le mode démonstration y fonctionne, l’API complète nécessite Wrangler.

Autres commandes :

```sh
pnpm demo                     # reconstruit DEMO-OUVRIR.html
pnpm exec wrangler deploy --dry-run
pnpm exec wrangler login
pnpm deploy                   # construit puis publie réellement
```

## Organisation du code

| Fichier | Rôle |
|---|---|
| `src/avatar.js` | Construction et animation des personnages et du décor |
| `src/main.js` | Interface, session, voix, dictée, export, débriefing |
| `src/style.css` | Mise en page adaptative |
| `src/personas.js` | Fiches publiques des trois clients |
| `src/demo.js` | Réponses prédéfinies explicitement identifiées |
| `server/personas.js` | Scénarios et règles originales complets |
| `server/worker.js` | API Cloudflare, validation, appel IA et critères |
| `wrangler.jsonc` | Hébergement Cloudflare Workers et fichiers du site |
| `.github/workflows/check.yml` | Tests et compilation à chaque push/PR |

Pour ajouter un client : compléter le scénario serveur, sa fiche publique, sa palette/son apparence, sa mission et son comportement de démonstration. Les règles cachées du scénario doivent rester dans `server/` ; ne pas importer ce fichier dans l’interface.

## Vérifications et limites de validation

21 tests automatiques réussis : validation serveur, protection par code, limites de taille, critères spécifiques, erreurs fournisseur, démarrage, double envoi, réinitialisation et réponses tardives. Compilation de production réussie ; préparation Cloudflare `deploy --dry-run` réussie.

Les tests de session utilisent un environnement DOM simulé et ne valident pas l’affichage. L’aperçu navigateur n’a pas pu être inspecté, car le contrôle de sécurité de l’outil de navigation était indisponible. Aucun test visuel ni essai réel du microphone/haut-parleur n’est donc déclaré réussi. L’API réelle n’a pas été appelée sans votre clé ; le déploiement et les Actions GitHub n’ont pas été exécutés sur vos comptes.

La [reconnaissance vocale](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) reste dépendante du navigateur ; le clavier est toujours prévu en secours. La [synthèse vocale](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) utilise les voix disponibles sur l’appareil. Une voix différente pour chaque profil ne peut donc pas être garantie partout.

## Dépannage

- **Le site affiche la démonstration seulement :** vérifier les deux secrets d’exécution du Worker, puis sélectionner le mode IA.
- **Code de session incorrect :** entrer exactement la valeur d’`ACCESS_CODE`, sans espace ajouté.
- **Service IA refusé :** vérifier la clé, les crédits API et le modèle configuré.
- **Micro indisponible :** utiliser l’adresse HTTPS, vérifier l’autorisation du navigateur, puis reprendre au clavier si nécessaire.
- **Voix absente :** activer « Voix du client » et vérifier les voix françaises installées. Les sous-titres restent visibles.
- **3D absente :** essayer un navigateur récent avec WebGL2/accélération graphique disponible ; l’entretien texte reste utilisable.
- **GitHub seul n’exécute pas l’IA :** ce dossier utilise GitHub pour le code et Cloudflare Workers pour le site et l’API.

Les dépendances tierces conservent leurs licences respectives. Three.js est sous licence MIT ; voir `THIRD-PARTY-NOTICES.txt`.

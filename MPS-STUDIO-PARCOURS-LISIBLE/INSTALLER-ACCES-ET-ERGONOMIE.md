# Studio : accès, ergonomie et voix

Décompressez MPS-STUDIO-ACCES-ERGONOMIE-VOIX.zip, puis téléversez son contenu à la racine du dépôt GitHub (Add file → Upload files). Il faut inclure src, server, tests, scripts et wrangler.jsonc. Validez le commit et attendez le déploiement Cloudflare. Ne supprimez pas le code ACCESS_CODE enregistré dans Cloudflare.

L'adresse du studio et votre code restent les mêmes. La page d'entrée valide le code par bouton ou touche Entrée auprès du serveur, sans appel au modèle. Le studio apparaît après validation. Le code n'est enregistré ni dans l'URL ni dans le stockage du navigateur ; il reste uniquement en mémoire dans la page jusqu'à la sortie ou l'actualisation. Le serveur protège toujours les appels IA. Les images et fichiers statiques ne sont pas des documents confidentiels protégés par cette page.

Cloudflare est l'unique moteur proposé aux apprenants. STUDIO_PROVIDER=cloudflare dans wrangler.jsonc bloque aussi les appels Anthropic côté serveur. Aucun changement de forfait n'est nécessaire. Cette page ne garantit pas que le quota IA est disponible ; elle vérifie le code et la configuration.

Sur grand écran, mission/dossier/offre, portrait et conversation sont disposés en trois zones. Le dossier et le portrait restent accessibles lors du défilement ; l'historique dispose de 680 pixels de hauteur, extensibles à 1 000. Le nombre de messages visibles dépend de leur longueur. Sur petit écran, un bouton ouvre le dossier et les zones s'empilent. Un nouveau message ne ramène pas en bas un lecteur qui relit l'historique. Le bouton « Revenir aux derniers échanges » permet de revenir au présent.

Les voix françaises sont reconnues par leur nom connu ou les préférences déjà validées ; les noms génériques/numérotés inconnus nécessitent une écoute et une confirmation féminine/masculine. Sur Android, les préférences numérotées de l'ordinateur ne sont pas présumées équivalentes. Une voix confirmée du mauvais genre ne sera pas utilisée pour le personnage. Si aucune voix adaptée n'est disponible, le dialogue continue en texte. Le navigateur ne permet pas de créer une voix manquante ni de certifier son genre acoustique : une écoute sur les appareils de test reste nécessaire. Les confirmations sont mémorisées uniquement dans ce navigateur.

Vérification : tests automatisés du contrôle d'accès, du verrouillage du moteur, du défilement, des voix et des précédentes fonctionnalités. L'aperçu navigateur local a été bloqué par sa vérification de sécurité ; le rendu visuel et le son réels restent à vérifier après publication.

Test formateur : essayer un code erroné, puis le bon code avec Entrée ; vérifier les trois zones sur ordinateur ; choisir et écouter une voix ; tester sa confirmation ; démarrer un entretien ; remonter l'historique ; terminer, exporter le débriefing et quitter le studio.

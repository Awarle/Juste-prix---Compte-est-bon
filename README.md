# JUSTE PRIX
# Objectifs
Créer un petit jeu en TypeScript, inspiré du concept du Juste Prix, dans lequel l'utilisateur doit deviner un nombre généré aléatoirement par l'ordinateur, avec un nombre de tentatives limité.

# Consignes
# 🎮 Principe du jeu :

Le programme génère un nombre cible aléatoire entre 1 et 100.
L’utilisateur tente de deviner ce nombre en entrant des propositions.
À chaque tentative, l’ordinateur indique si le nombre proposé est trop haut, trop bas ou correct.

# ✅ Tâches à réaliser :

1. Générer un nombre aléatoire entre 1 et 100.
2. Permettre à l’utilisateur d’entrer un nombre.
3. Comparer le nombre proposé avec le nombre cible.
4. Afficher un message : “Trop haut”, “Trop bas” ou “Bravo !”.
5. Si l’utilisateur trouve le bon nombre ou atteint la limite d’essais (10 par défaut), afficher le résultat final et proposer de rejouer.
6. 
# 💻 Interface utilisateur (console) :

Le jeu doit s’exécuter dans le terminal (via `ts-node` ou compilé avec Node.js).
Des messages interactifs doivent guider l’utilisateur à chaque tour.

# ⚠️ Gestion des erreurs :

Vérifier que l’entrée de l’utilisateur est bien un nombre.
Empêcher les caractères invalides ou lettres d’être interprétés.
Limiter à 10 tentatives maximum pour plus de défi.

# 🧭 Étapes proposées :

Initialiser le nombre cible avec Math.floor(Math.random() * 100) + 1.
Créer une boucle demandant une saisie utilisateur avec readline ou prompt-sync.
Comparer la valeur entrée avec la cible.
Compter les essais et gérer les cas de victoire/défaite.
Proposer de rejouer à la fin de la partie.

# 🔗 Ressources utiles :

Librairies Node.js pour la lecture console (readline, prompt-sync).
Utilisation des types TypeScript pour sécuriser les entrées.

# ✅ Bonus
Plage personnalisée : Laisser le joueur choisir les bornes min et max du nombre à deviner (ex: entre 1 et 500).
Mode difficile : Limiter les essais à 5.
Score et statistiques : Implémenter un score cumulé, afficher les victoires/défaites, et proposer une fonctionnalité de "rejouer".

# LE COMPTE EST BON
# Objectifs
Créer un mini-jeu en TypeScript inspiré du jeu télévisé Le Compte est Bon, où vous devrez atteindre un nombre cible en combinant un ensemble de nombres avec des opérations mathématiques de base (+, -, *, /), directement en ligne de commande.

# Consignes
# 🎮 Principe du jeu :

Le programme génère un nombre cible aléatoire entre 1 et 100.
Il génère ensuite 5 nombres aléatoires compris entre 1 et 20.
Le joueur doit tenter d’atteindre le nombre cible en combinant les nombres avec des opérations mathématiques de base.

# 🧪 Exemple :

Nombre cible : 75
Nombres donnés : [3, 10, 5, 15, 7]
Exemple d'opération possible : (10 * 7) + 5

# ✅ Tâches principales :

1. Générer un nombre cible aléatoire.
2. Générer 5 nombres aléatoires.
3. Permettre à l'utilisateur de saisir une expression (ex: 10 * 7 + 5).
4. Calculer et afficher le résultat à chaque tentative.
5. Indiquer si le nombre cible est atteint ou non.
6. 
# 💻 Interface utilisateur (console) :

Le jeu se joue en terminal, via ts-node ou un fichier compilé.
Le joueur peut entrer une opération utilisant les nombres fournis, deux par deux, jusqu’à atteindre le résultat ou abandonner.

# ⚠️ Gestion des erreurs :

Empêcher les divisions par zéro.
Vérifier que seuls les nombres disponibles sont utilisés.
Empêcher les opérations non valides (syntaxe incorrecte, caractères interdits, etc.).

# 🧭 Étapes recommandées :

Créer la génération aléatoire du nombre cible (entre 1 et 100).
Créer un tableau de 5 nombres aléatoires entre 1 et 20.
Afficher les nombres disponibles et le nombre cible à l’utilisateur.
Lire une expression entrée par l’utilisateur (via `readline` ou `prompt-sync`).
Évaluer l’expression mathématique (sans utiliser `eval`).
Afficher le résultat et indiquer si la cible est atteinte.

# 🔗 Ressources utiles :

Modules Node.js comme readline ou prompt-sync.
Parsing d’expressions mathématiques en TypeScript (ex: via une librairie type-safe ou fonction maison).

# ✅ Bonus
Limiter le nombre d’essais : Autoriser 5 essais maximum pour deviner le bon résultat.
Personnalisation : Proposer à l'utilisateur de choisir les plages de valeurs pour les nombres générés.
Mode score : Ajouter un score cumulatif, avec la possibilité de rejouer plusieurs parties consécutives.

"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
/**
 * Renvoie un nombre aléatoire entier entre min et max (inclus).
 * @param min Le minimum (inclus)
 * @param max Le maximum (inclus)
 * @returns Un entier aléatoire entre min et max.
 */
function getRandomNumber(min, max) {
    // Math.random() génère un nombre entre 0 (inclus) et 1 (exclus).
    // La formule permet d'obtenir un entier dans l'intervalle souhaité.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Génère le nombre secret entre 1 et 100.
// Note : le typage explicite n'est pas nécessaire ici car TypeScript l'infère.
var secretNumber = getRandomNumber(1, 100);
// Nombre maximal d'essais autorisés et compteur d'essais.
var maxAttempts = 10;
var attempts = 0;
// Création de l'interface readline pour récupérer les entrées utilisateur via la console.
var rl = readline.createInterface({
    input: process.stdin, // Flux d'entrée standard (le clavier)
    output: process.stdout, // Flux de sortie standard (la console)
});
// Affichage des messages de bienvenue et des instructions du jeu.
console.log('Bienvenue au jeu du Juste Prix !');
console.log('Devinez le nombre entre 1 et 100. Vous avez 10 essais.');
/**
 * Fonction récursive qui demande à l'utilisateur de saisir un nombre et vérifie la réponse.
 */
function askGuess() {
    // Si le nombre d'essais a atteint la limite, on affiche un message de fin de jeu.
    if (attempts >= maxAttempts) {
        console.log("Dommage, vous avez \u00E9puis\u00E9 vos essais. Le nombre \u00E9tait ".concat(secretNumber, "."));
        rl.close();
        return;
    }
    // Prépare le texte de la question pour rester sous la limite de 100 caractères.
    var promptText = "Essai ".concat(attempts + 1, "/").concat(maxAttempts, " : Entrez votre nombre : ");
    rl.question(promptText, function (input) {
        // Convertit la saisie en nombre entier.
        var guess = parseInt(input, 10);
        // Vérifie que la saisie est un nombre valide.
        if (Number.isNaN(guess)) {
            console.log('Veuillez entrer un nombre valide.');
            askGuess(); // Redemande une saisie sans incrémenter le compteur.
            return;
        }
        // Incrémente le compteur d'essais.
        attempts += 1;
        // Compare le nombre saisi avec le nombre secret.
        if (guess === secretNumber) {
            // Affiche un message de félicitations sur plusieurs lignes pour respecter la limite.
            console.log("F\u00E9licitations ! Vous avez trouv\u00E9 le nombre ".concat(secretNumber, " ")
                + "en ".concat(attempts, " essais."));
            rl.close();
        }
        else if (guess < secretNumber) {
            console.log("C'est plus !");
            askGuess();
        }
        else {
            console.log("C'est moins !");
            askGuess();
        }
    });
}
// Démarre le jeu en appelant la fonction askGuess.
askGuess();

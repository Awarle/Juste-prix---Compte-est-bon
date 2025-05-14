/// <reference types="node" />

import * as readline from 'readline';

/**
 * Renvoie un nombre aléatoire entier entre min et max (inclus).
 * @param min Le minimum (inclus)
 * @param max Le maximum (inclus)
 * @returns Un entier aléatoire entre min et max.
 */
function getRandomNumber(min: number, max: number): number {
  // Math.random() génère un nombre entre 0 (inclus) et 1 (exclus).
  // La formule permet d'obtenir un entier dans l'intervalle souhaité.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Génère le nombre secret entre 1 et 100.
// Note : le typage explicite n'est pas nécessaire ici car TypeScript l'infère.
const secretNumber = getRandomNumber(1, 100);

// Nombre maximal d'essais autorisés et compteur d'essais.
const maxAttempts: number = 10;
let attempts: number = 0;

// Création de l'interface readline pour récupérer les entrées utilisateur via la console.
const rl = readline.createInterface({
  input: process.stdin, // Flux d'entrée standard (le clavier)
  output: process.stdout, // Flux de sortie standard (la console)
});

// Affichage des messages de bienvenue et des instructions du jeu.
console.log('Bienvenue au jeu du Juste Prix !');
console.log('Devinez le nombre entre 1 et 100. Vous avez 10 essais.');

/**
 * Fonction récursive qui demande à l'utilisateur de saisir un nombre et vérifie la réponse.
 */
function askGuess(): void {
  // Si le nombre d'essais a atteint la limite, on affiche un message de fin de jeu.
  if (attempts >= maxAttempts) {
    console.log(
      `Dommage, vous avez épuisé vos essais. Le nombre était ${secretNumber}.`,
    );
    rl.close();
    return;
  }

  // Prépare le texte de la question pour rester sous la limite de 100 caractères.
  const promptText = `Essai ${attempts + 1}/${maxAttempts} : Entrez votre nombre : `;
  rl.question(promptText, (input: string) => {
    // Convertit la saisie en nombre entier.
    const guess: number = parseInt(input, 10);

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
      console.log(
        `Félicitations ! Vous avez trouvé le nombre ${secretNumber} `
        + `en ${attempts} essais.`,
      );
      rl.close();
    } else if (guess < secretNumber) {
      console.log("C'est plus !");
      askGuess();
    } else {
      console.log("C'est moins !");
      askGuess();
    }
  });
}

// Démarre le jeu en appelant la fonction askGuess.
askGuess();

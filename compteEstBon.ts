/// <reference types="node" />

import * as readline from 'readline';

/* 
   Fonctions utilitaires : génération de nombres aléatoires
    */

/**
 * Renvoie un entier aléatoire entre min et max (inclus).
 * @param min Le minimum (inclus)
 * @param max Le maximum (inclus)
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 
   Fonctions pour parser et évaluer une expression mathématique
   */

/**
 * Tokenize une expression mathématique.
 * Reconnaît les nombres (séquence de chiffres), opérateurs (+, -, *, /) et parenthèses.
 * @param expr L'expression à tokeniser
 * @returns Un tableau de tokens
 */
function tokenize(expr: string): string[] {
  // Expression régulière pour extraire les nombres, opérateurs et parenthèses.
  const regex = /(\d+|[+\-*/()])/g;
  const tokens = expr.match(regex);
  if (!tokens) {
    throw new Error('Expression vide ou invalide.');
  }
  return tokens;
}

/**
 * Convertit un tableau de tokens d'une expression en notation polonaise inverse (RPN)
 * via l'algorithme de Shunting-yard.
 * @param tokens Les tokens de l'expression
 * @returns Le tableau de tokens en RPN
 */
function toRPN(tokens: string[]): string[] {
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  // Définition de la priorité et associativité des opérateurs
  const precedence: { [op: string]: number } = {
    '+': 1, '-': 1, '*': 2, '/': 2,
  };

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      // Si le token est un nombre, l'ajouter directement à la file de sortie.
      outputQueue.push(token);
    } else if ('+-*/'.includes(token)) {
      // Si le token est un opérateur
      while (
        operatorStack.length > 0
        && '+-*/'.includes(operatorStack[operatorStack.length - 1])
        && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      // Dépile jusqu'à trouver une parenthèse ouvrante
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Parenthèses mal appariées.');
      }
      // Retire la parenthèse ouvrante
      operatorStack.pop();
    } else {
      throw new Error(`Token invalide rencontré : ${token}`);
    }
  }

  // Ajoute les opérateurs restants dans la file de sortie
  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === '(' || op === ')') {
      throw new Error('Parenthèses mal appariées.');
    }
    outputQueue.push(op);
  }
  return outputQueue;
}

/**
 * Évalue une expression en notation polonaise inverse.
 * @param rpnTokens Les tokens en RPN
 * @returns Le résultat numérique de l'expression
 */
function evaluateRPN(rpnTokens: string[]): number {
  const stack: number[] = [];
  for (const token of rpnTokens) {
    if (/^\d+$/.test(token)) {
      // Convertit le token en nombre et l'empile
      stack.push(parseInt(token, 10));
    } else if ('+-*/'.includes(token)) {
      // Dépile les deux derniers nombres
      if (stack.length < 2) {
        throw new Error('Expression invalide.');
      }
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result: number;
      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          if (b === 0) {
            throw new Error('Division par zéro détectée.');
          }
          result = a / b;
          break;
        default:
          throw new Error(`Opérateur inconnu: ${token}`);
      }
      // Empile le résultat de l'opération
      stack.push(result);
    } else {
      throw new Error(`Token inattendu dans RPN: ${token}`);
    }
  }
  if (stack.length !== 1) {
    throw new Error("Expression invalide à l'évaluation.");
  }
  return stack[0];
}

/**
 * Évalue une expression mathématique donnée en chaîne de caractères.
 * Utilise la tokenisation, conversion en RPN et évaluation RPN.
 * @param expr L'expression à évaluer
 * @returns Le résultat numérique
 */
function evaluateExpression(expr: string): number {
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  return evaluateRPN(rpn);
}

/**
 * Vérifie que les nombres utilisés dans l'expression font partie
 * de ceux disponibles et ne sont pas utilisés plus de fois qu'autorisé.
 * @param tokens Les tokens de l'expression
 * @param availableNumbers Le tableau des nombres disponibles
 */
function validateNumbersUsed(tokens: string[], availableNumbers: number[]): void {
  // Compte la fréquence de chaque nombre dans availableNumbers
  const availableFreq: { [key: string]: number } = {};
  for (const num of availableNumbers) {
    const key = num.toString();
    availableFreq[key] = (availableFreq[key] || 0) + 1;
  }

  // Parcourt les tokens pour vérifier les nombres
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      if (!availableFreq[token]) {
        throw new Error(`Le nombre ${token} n'est pas disponible ou est utilisé en excès.`);
      }
      availableFreq[token] -= 1;
    }
  }
}

/* 
   Partie "jeu" : gestion de l'interface utilisateur et logique de jeu
    */

// Nombre d'essais maximum autorisés (bonus)
const maxTries: number = 5;

// Génère le nombre cible (entre 1 et 100)
const target: number = getRandomNumber(1, 100);
// Génère 5 nombres aléatoires (entre 1 et 20)
const availableNumbers: number[] = [];
for (let i = 0; i < 5; i += 1) { // Modification ici : "i += 1" remplace "i++"
  availableNumbers.push(getRandomNumber(1, 20));
}

// Crée l'interface readline pour la saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Affiche les informations du jeu à l'utilisateur
console.log("Bienvenue dans 'Le Compte est Bon' !");
console.log(`Nombre cible : ${target}`);
console.log(`Nombres disponibles : [${availableNumbers.join(', ')}]`);

/**
 * Fonction qui demande à l'utilisateur de saisir une expression,
 * vérifie sa validité, l'évalue et affiche le résultat.
 * Elle autorise jusqu'à maxTries essais.
 * @param tries Le nombre d'essais déjà effectués
 */
function askExpression(tries: number): void {
  if (tries >= maxTries) {
    console.log('Vous avez épuisé tous vos essais. Fin du jeu.');
    rl.close();
    return;
  }

  rl.question("Entrez une expression (ex: 10 * 7 + 5) ou 'q' pour quitter : ", (input: string) => {
    if (input.trim().toLowerCase() === 'q') {
      console.log('Vous avez abandonné. Fin du jeu.');
      rl.close();
      return;
    }

    try {
      // Tokenisation de l'expression pour pouvoir vérifier l'utilisation des nombres
      const tokens = tokenize(input);
      validateNumbersUsed(tokens, availableNumbers);

      // Évalue l'expression
      const result = evaluateExpression(input);
      console.log(`Résultat de l'expression : ${result}`);

      if (Math.abs(result - target) < 1e-9) {
        console.log('Bravo ! Vous avez atteint le nombre cible !');
        rl.close();
      } else {
        console.log("Ce n'est pas le bon résultat.");
        // On propose un nouvel essai
        askExpression(tries + 1);
      }
    } catch (error: any) {
      // En cas d'erreur (expression invalide, division par zéro, etc.)
      console.log(`Erreur: ${error.message}`);
      // On propose un nouvel essai
      askExpression(tries + 1);
    }
  });
}

// Démarre le jeu avec 0 essai effectué.
askExpression(0);

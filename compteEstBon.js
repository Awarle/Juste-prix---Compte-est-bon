"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
/* ============================================================
   Fonctions utilitaires : génération de nombres aléatoires
   ============================================================ */
/**
 * Renvoie un entier aléatoire entre min et max (inclus).
 * @param min Le minimum (inclus)
 * @param max Le maximum (inclus)
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/* ============================================================
   Fonctions pour parser et évaluer une expression mathématique
   sans utiliser eval (algorithme Shunting-yard)
   ============================================================ */
/**
 * Tokenize une expression mathématique.
 * Reconnaît les nombres (séquence de chiffres), opérateurs (+, -, *, /) et parenthèses.
 * @param expr L'expression à tokeniser
 * @returns Un tableau de tokens
 */
function tokenize(expr) {
    // Expression régulière pour extraire les nombres, opérateurs et parenthèses.
    var regex = /(\d+|[+\-*/()])/g;
    var tokens = expr.match(regex);
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
function toRPN(tokens) {
    var outputQueue = [];
    var operatorStack = [];
    // Définition de la priorité et associativité des opérateurs
    var precedence = {
        '+': 1, '-': 1, '*': 2, '/': 2,
    };
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (/^\d+$/.test(token)) {
            // Si le token est un nombre, l'ajouter directement à la file de sortie.
            outputQueue.push(token);
        }
        else if ('+-*/'.includes(token)) {
            // Si le token est un opérateur
            while (operatorStack.length > 0
                && '+-*/'.includes(operatorStack[operatorStack.length - 1])
                && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
        else if (token === '(') {
            operatorStack.push(token);
        }
        else if (token === ')') {
            // Dépile jusqu'à trouver une parenthèse ouvrante
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0) {
                throw new Error('Parenthèses mal appariées.');
            }
            // Retire la parenthèse ouvrante
            operatorStack.pop();
        }
        else {
            throw new Error("Token invalide rencontr\u00E9 : ".concat(token));
        }
    }
    // Ajoute les opérateurs restants dans la file de sortie
    while (operatorStack.length > 0) {
        var op = operatorStack.pop();
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
function evaluateRPN(rpnTokens) {
    var stack = [];
    for (var _i = 0, rpnTokens_1 = rpnTokens; _i < rpnTokens_1.length; _i++) {
        var token = rpnTokens_1[_i];
        if (/^\d+$/.test(token)) {
            // Convertit le token en nombre et l'empile
            stack.push(parseInt(token, 10));
        }
        else if ('+-*/'.includes(token)) {
            // Dépile les deux derniers nombres
            if (stack.length < 2) {
                throw new Error('Expression invalide.');
            }
            var b = stack.pop();
            var a = stack.pop();
            var result = void 0;
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
                    throw new Error("Op\u00E9rateur inconnu: ".concat(token));
            }
            // Empile le résultat de l'opération
            stack.push(result);
        }
        else {
            throw new Error("Token inattendu dans RPN: ".concat(token));
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
function evaluateExpression(expr) {
    var tokens = tokenize(expr);
    var rpn = toRPN(tokens);
    return evaluateRPN(rpn);
}
/**
 * Vérifie que les nombres utilisés dans l'expression font partie
 * de ceux disponibles et ne sont pas utilisés plus de fois qu'autorisé.
 * @param tokens Les tokens de l'expression
 * @param availableNumbers Le tableau des nombres disponibles
 */
function validateNumbersUsed(tokens, availableNumbers) {
    // Compte la fréquence de chaque nombre dans availableNumbers
    var availableFreq = {};
    for (var _i = 0, availableNumbers_1 = availableNumbers; _i < availableNumbers_1.length; _i++) {
        var num = availableNumbers_1[_i];
        var key = num.toString();
        availableFreq[key] = (availableFreq[key] || 0) + 1;
    }
    // Parcourt les tokens pour vérifier les nombres
    for (var _a = 0, tokens_2 = tokens; _a < tokens_2.length; _a++) {
        var token = tokens_2[_a];
        if (/^\d+$/.test(token)) {
            if (!availableFreq[token]) {
                throw new Error("Le nombre ".concat(token, " n'est pas disponible ou est utilis\u00E9 en exc\u00E8s."));
            }
            availableFreq[token] -= 1;
        }
    }
}
/* ============================================================
   Partie "jeu" : gestion de l'interface utilisateur et logique de jeu
   ============================================================ */
// Nombre d'essais maximum autorisés (bonus)
var maxTries = 5;
// Génère le nombre cible (entre 1 et 100)
var target = getRandomNumber(1, 100);
// Génère 5 nombres aléatoires (entre 1 et 20)
var availableNumbers = [];
for (var i = 0; i < 5; i += 1) { // Modification ici : "i += 1" remplace "i++"
    availableNumbers.push(getRandomNumber(1, 20));
}
// Crée l'interface readline pour la saisie utilisateur
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Affiche les informations du jeu à l'utilisateur
console.log("Bienvenue dans 'Le Compte est Bon' !");
console.log("Nombre cible : ".concat(target));
console.log("Nombres disponibles : [".concat(availableNumbers.join(', '), "]"));
/**
 * Fonction qui demande à l'utilisateur de saisir une expression,
 * vérifie sa validité, l'évalue et affiche le résultat.
 * Elle autorise jusqu'à maxTries essais.
 * @param tries Le nombre d'essais déjà effectués
 */
function askExpression(tries) {
    if (tries >= maxTries) {
        console.log('Vous avez épuisé tous vos essais. Fin du jeu.');
        rl.close();
        return;
    }
    rl.question("Entrez une expression (ex: 10 * 7 + 5) ou 'q' pour quitter : ", function (input) {
        if (input.trim().toLowerCase() === 'q') {
            console.log('Vous avez abandonné. Fin du jeu.');
            rl.close();
            return;
        }
        try {
            // Tokenisation de l'expression pour pouvoir vérifier l'utilisation des nombres
            var tokens = tokenize(input);
            validateNumbersUsed(tokens, availableNumbers);
            // Évalue l'expression
            var result = evaluateExpression(input);
            console.log("R\u00E9sultat de l'expression : ".concat(result));
            if (Math.abs(result - target) < 1e-9) {
                console.log('Bravo ! Vous avez atteint le nombre cible !');
                rl.close();
            }
            else {
                console.log("Ce n'est pas le bon résultat.");
                // On propose un nouvel essai
                askExpression(tries + 1);
            }
        }
        catch (error) {
            // En cas d'erreur (expression invalide, division par zéro, etc.)
            console.log("Erreur: ".concat(error.message));
            // On propose un nouvel essai
            askExpression(tries + 1);
        }
    });
}
// Démarre le jeu avec 0 essai effectué.
askExpression(0);

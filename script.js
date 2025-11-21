document.getElementById('generate-btn').addEventListener('click', generatePassword);

function generatePassword() {
    // 1. Définition des jeux de caractères
    const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const DIGITS = "0123456789";
    const SYMBOLS = "!@#$%^&*()-_+=<>?";

    // 2. Récupérer les options de l'utilisateur
    const length = parseInt(document.getElementById('length').value);
    const useLowercase = document.getElementById('lowercase').checked;
    const useUppercase = document.getElementById('uppercase').checked;
    const useDigits = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;

    let allChars = "";

    if (useLowercase) allChars += LOWERCASE;
    if (useUppercase) allChars += UPPERCASE;
    if (useDigits) allChars += DIGITS;
    if (useSymbols) allChars += SYMBOLS;

    const outputElement = document.getElementById('password-output');

    // Vérification d'erreurs
    if (allChars.length === 0 || length <= 0) {
        outputElement.value = "Erreur: Sélectionnez au moins une option et une longueur valide.";
        return;
    }

    if (length < 8 || length > 32) {
        outputElement.value = "Erreur: Longueur doit être entre 8 et 32.";
        return;
    }

    let password = "";

    // 3. Garantir au moins un caractère de chaque type sélectionné
    if (useLowercase) password += getRandomChar(LOWERCASE);
    if (useUppercase) password += getRandomChar(UPPERCASE);
    if (useDigits) password += getRandomChar(DIGITS);
    if (useSymbols) password += getRandomChar(SYMBOLS);

    // 4. Remplir le reste du mot de passe
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(allChars);
    }

    // 5. Mélanger la chaîne (pour que les caractères obligatoires ne soient pas au début)
    password = shuffleString(password);

    // 6. Afficher le résultat
    outputElement.value = password;
}

// Fonction utilitaire pour obtenir un caractère aléatoire d'une chaîne
function getRandomChar(charSet) {
    // Math.random() génère un nombre entre 0 et 1.
    // Math.floor() l'arrondit à l'entier inférieur.
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
}

// Fonction utilitaire pour mélanger une chaîne de caractères
function shuffleString(str) {
    let array = str.split(''); // Convertir la chaîne en tableau de caractères
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échanger les éléments
    }
    return array.join(''); // Reconvertir le tableau en chaîne
}
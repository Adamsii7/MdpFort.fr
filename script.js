document.addEventListener('DOMContentLoaded', () => {
    // Lie le bouton Générer à la fonction principale
    document.getElementById('generate-btn').addEventListener('click', generatePassword);

    // Lie le bouton Copier à la fonction de copie
    document.getElementById('copy-btn').addEventListener('click', copyPassword);

    // Lie le bouton du thème à la fonction de bascule
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Lie le bouton Accepter du bandeau de cookies
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);

    // Initialisation au chargement de la page
    initTheme();
    initCookieBanner();
});


// =================================================================
// LOGIQUE PRINCIPALE DU GÉNÉRATEUR
// =================================================================

function generatePassword() {
    // ... (Votre logique de génération de mot de passe existante) ...
    // Le code existant ici est correct et ne nécessite pas de modification majeure

    const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const DIGITS = "0123456789";
    const SYMBOLS = "!@#$%^&*()-_+=<>?";

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

    if (allChars.length === 0 || length <= 0) {
        outputElement.value = "Erreur: Sélectionnez au moins une option.";
        return;
    }

    let password = "";
    // Garantir au moins un caractère de chaque type
    if (useLowercase) password += getRandomChar(LOWERCASE);
    if (useUppercase) password += getRandomChar(UPPERCASE);
    if (useDigits) password += getRandomChar(DIGITS);
    if (useSymbols) password += getRandomChar(SYMBOLS);

    // Remplir le reste
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(allChars);
    }

    password = shuffleString(password);
    outputElement.value = password;
}

function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
}

function shuffleString(str) {
    let array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}


// =================================================================
// FONCTION COPIER (Nouveau)
// =================================================================

function copyPassword() {
    const output = document.getElementById('password-output');

    // Utilise l'API du presse-papiers (moderne et sécurisée)
    navigator.clipboard.writeText(output.value)
        .then(() => {
            // Feedback visuel temporaire
            const copyBtn = document.getElementById('copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copié!";

            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1000); // Rétablit le texte après 1 seconde
        })
        .catch(err => {
            // Fallback (méthode de secours moins fiable)
            output.select();
            document.execCommand('copy');
            alert("Mot de passe copié ! (Méthode de secours)");
        });
}


// =================================================================
// GESTION DU THÈME (Nouveau)
// =================================================================

function initTheme() {
    // Vérifie la préférence enregistrée ou le mode par défaut du système
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').textContent = '🌙 Passer au Sombre';
    } else {
        document.getElementById('theme-toggle').textContent = '☀️ Passer au Clair';
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');

    // Enregistre la préférence
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // Met à jour le texte du bouton
    document.getElementById('theme-toggle').textContent = isLight ? '🌙 Passer au Sombre' : '☀️ Passer au Clair';
}


// =================================================================
// BANDEAU DE COOKIES (Nouveau)
// =================================================================

const COOKIE_KEY = 'cookies_accepted';

function initCookieBanner() {
    // Affiche le bandeau uniquement si l'utilisateur n'a pas encore accepté
    if (localStorage.getItem(COOKIE_KEY) !== 'true') {
        document.getElementById('cookie-banner').style.display = 'flex';
    }
}

function acceptCookies() {
    // Enregistre l'acceptation
    localStorage.setItem(COOKIE_KEY, 'true');
    // Cache le bandeau
    document.getElementById('cookie-banner').style.display = 'none';
}
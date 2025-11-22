document.addEventListener('DOMContentLoaded', () => {
    // Lie les événements aux boutons
    document.getElementById('generate-btn').addEventListener('click', generatePassword);
    document.getElementById('copy-btn').addEventListener('click', copyPassword);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);

    // Initialisation au chargement de la page
    initTheme();
    initCookieBanner();
});


// =================================================================
// LOGIQUE PRINCIPALE DU GÉNÉRATEUR
// =================================================================

function generatePassword() {
    const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const DIGITS = "0123456789";
    const SYMBOLS = "!@#$%^&*()-_+=<>?";

    // Récupère les options
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

    if (allChars.length === 0 || length < 8 || length > 32) {
        outputElement.value = "Erreur: Longueur invalide ou aucune option sélectionnée.";
        return;
    }

    let password = "";

    // Garantir au moins un caractère de chaque type sélectionné
    if (useLowercase) password += getRandomChar(LOWERCASE);
    if (useUppercase) password += getRandomChar(UPPERCASE);
    if (useDigits) password += getRandomChar(DIGITS);
    if (useSymbols) password += getRandomChar(SYMBOLS);

    // Remplir le reste
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(allChars);
    }

    // Mélanger et afficher
    password = shuffleString(password);
    outputElement.value = password;
}

function getRandomChar(charSet) {
    // Utilise Math.random() pour la génération d'index
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
// FONCTION COPIER
// =================================================================

function copyPassword() {
    const output = document.getElementById('password-output');

    // Utilise l'API du presse-papiers (moderne)
    navigator.clipboard.writeText(output.value)
        .then(() => {
            const copyBtn = document.getElementById('copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copié!";

            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1000);
        })
        .catch(err => {
            // Fallback (pour les navigateurs très anciens ou si l'API est bloquée)
            output.select();
            document.execCommand('copy');
            alert("Mot de passe copié ! (Méthode de secours)");
        });
}


// =================================================================
// GESTION DU THÈME
// =================================================================

function initTheme() {
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

    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    document.getElementById('theme-toggle').textContent = isLight ? '🌙 Passer au Sombre' : '☀️ Passer au Clair';
}


// =================================================================
// BANDEAU DE COOKIES
// =================================================================

const COOKIE_KEY = 'cookies_accepted';

function initCookieBanner() {
    if (localStorage.getItem(COOKIE_KEY) !== 'true') {
        document.getElementById('cookie-banner').style.display = 'flex';
    }
}

function acceptCookies() {
    localStorage.setItem(COOKIE_KEY, 'true');
    document.getElementById('cookie-banner').style.display = 'none';
}
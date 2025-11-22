document.addEventListener('DOMContentLoaded', () => {
    // --- Initialisation des éléments ---
    const passwordOutput = document.getElementById('password-output');
    const lengthInput = document.getElementById('length');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Checkboxes
    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');

    // Strength Indicator
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');


    // --- 1. GESTION DE LA FORCE DU MOT DE PASSE (Révisé pour 100% et 5 niveaux) ---

    function checkPasswordStrength(password) {
        if (!password) return 0;

        let score = 0;
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        // Score basé sur la longueur (Jusqu'à 50 points)
        if (length >= 8) score += 10;
        if (length >= 12) score += 15;
        if (length >= 16) score += 25; // Maximum 50 points ici

        // Score basé sur la variété (Jusqu'à 50 points)
        const charTypes = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
        score += (charTypes * 12.5); // 4 types * 12.5 = 50 points maximum

        // Limite à 100
        if (score > 100) score = 100;
        return Math.floor(score);
    }

    function updateStrengthIndicator(score) {
        let strength = 'Très Faible';
        let className = 'very-weak';

        // Nouvelles catégories
        if (score >= 85) { // Atteignable avec 16+ char et 4 types
            strength = 'Ultra Fort';
            className = 'very-strong';
        } else if (score >= 65) {
            strength = 'Fort';
            className = 'strong';
        } else if (score >= 40) {
            strength = 'Moyen';
            className = 'medium';
        } else if (score >= 20) {
            strength = 'Faible';
            className = 'weak';
        }

        strengthBar.className = `strength-bar ${className}`;
        strengthBar.style.width = `${score}%`;
        strengthLabel.textContent = strength;
    }


    // --- 2. LOGIQUE DE GÉNÉRATION ET COPIE ---

    function generatePassword() {
        const len = lengthInput.value;
        let charset = '';
        let password = '';

        if (uppercase.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers.checked) charset += '0123456789';
        if (symbols.checked) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (charset === '') {
            passwordOutput.value = 'Sélectionnez au moins un type de caractère.';
            updateStrengthIndicator(0);
            return;
        }

        // Assurer au moins un de chaque type sélectionné
        const charGenerators = [];
        if (uppercase.checked) charGenerators.push(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
        if (lowercase.checked) charGenerators.push(() => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
        if (numbers.checked) charGenerators.push(() => '0123456789'[Math.floor(Math.random() * 10)]);
        if (symbols.checked) charGenerators.push(() => '!@#$%^&*()_+~`|}{[]:;?><,./-='[Math.floor(Math.random() * 32)]);

        // Générer le mot de passe en s'assurant qu'il contient au moins un de chaque type sélectionné
        for (let i = 0; i < len; i++) {
            if (i < charGenerators.length) {
                password += charGenerators[i]();
            } else {
                password += charset[Math.floor(Math.random() * charset.length)];
            }
        }

        // Mélanger le mot de passe pour garantir l'aléatoire
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        passwordOutput.value = password;

        // Met à jour l'indicateur de force
        const strengthScore = checkPasswordStrength(password);
        updateStrengthIndicator(strengthScore);
    }

    // --- 3. GESTION DES ÉVÉNEMENTS (Ajout de la saisie manuelle) ---

    // Événement pour la saisie manuelle de mot de passe (analyse de force)
    passwordOutput.addEventListener('input', () => {
        const manualPassword = passwordOutput.value;
        const strengthScore = checkPasswordStrength(manualPassword);
        updateStrengthIndicator(strengthScore);
    });

    // Événements de génération (bouton, longueur, checkboxes)
    generateBtn.addEventListener('click', generatePassword);
    lengthInput.addEventListener('input', generatePassword);
    [uppercase, lowercase, numbers, symbols].forEach(checkbox => {
        checkbox.addEventListener('change', generatePassword);
    });

    copyBtn.addEventListener('click', () => {
        if (passwordOutput.value && passwordOutput.value !== 'Sélectionnez au moins un type de caractère.') {
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copié!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        }
    });

    // --- 4. GESTION DU THÈME ET COOKIES ---

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '🌙 Passer au Sombre';
        } else {
            document.body.classList.remove('light-theme');
            themeToggle.textContent = '☀️ Passer au Clair';
        }
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.textContent = isLight ? '🌙 Passer au Sombre' : '☀️ Passer au Clair';
    });

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');

    function loadCookieConsent() {
        const consentGiven = localStorage.getItem('cookiesAccepted');

        if (consentGiven === 'true') {
            cookieBanner.style.display = 'none';
        } else {
            cookieBanner.style.display = 'flex';
        }
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Initialisation au chargement de la page ---
    loadTheme();
    loadCookieConsent();
    generatePassword(); // Génère le mot de passe initial et affiche sa force
});
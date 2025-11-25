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

    // Cookie & Modal Elements
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const privacyModal = document.getElementById('privacy-modal');
    const openModalBtn = document.getElementById('open-privacy-modal');
    const closeModalBtn = document.querySelector('#privacy-modal .close-btn');
    const openSettingsBtn = document.getElementById('open-settings-btn');


    // ----------------------------------------------------------------------
    // --- 1. GESTION DU THÈME, COOKIES ET MODALE (Fiabilisé) ---
    // ----------------------------------------------------------------------

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

    function updateSettingsButtonVisibility() {
        // Affiche le bouton flottant UNIQUEMENT si le consentement a été donné
        const consentGiven = localStorage.getItem('cookiesAccepted') === 'true';
        if (openSettingsBtn) {
            openSettingsBtn.style.display = consentGiven ? 'flex' : 'none';
        }
    }

    function loadCookieConsent() {
        const consentGiven = localStorage.getItem('cookiesAccepted');

        if (cookieBanner) {
            if (consentGiven === 'true') {
                cookieBanner.style.display = 'none';
            } else {
                cookieBanner.style.display = 'flex'; // Affichage si pas encore accepté
            }
        }
        updateSettingsButtonVisibility(); // Mise à jour de la visibilité du bouton flottant
    }

    // Gestion du clic pour ACCEPTER
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
            updateSettingsButtonVisibility();
        });
    }

    // Logique pour ouvrir la MODALE DE CONFIDENTIALITÉ
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            if (privacyModal) privacyModal.style.display = 'block';
        });
    }

    // Logique pour fermer la MODALE
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (privacyModal) privacyModal.style.display = 'none';
        });
    }

    // Fermeture de la modale en cliquant en dehors
    window.addEventListener('click', (event) => {
        if (event.target == privacyModal) {
            privacyModal.style.display = 'none';
        }
    });

    // Logique du bouton FLOTTANT (Réinitialiser/Rouvrir le bandeau de cookies)
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            localStorage.removeItem('cookiesAccepted'); // Réinitialiser le consentement
            if (cookieBanner) {
                cookieBanner.style.display = 'flex'; // Réafficher la bannière
            }
            updateSettingsButtonVisibility(); // Masquer le bouton flottant
        });
    }

    // Gestion du changement de thème
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.textContent = isLight ? '🌙 Passer au Sombre' : '☀️ Passer au Clair';
    });


    // ----------------------------------------------------------------------
    // --- 2. GESTION DE LA FORCE DU MOT DE PASSE ---
    // ----------------------------------------------------------------------

    function checkPasswordStrength(password) {
        if (!password) return 0;
        let score = 0;
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (length >= 8) score += 10;
        if (length >= 12) score += 15;
        if (length >= 16) score += 25;

        const charTypes = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
        score += (charTypes * 12.5);

        if (score > 100) score = 100;
        return Math.floor(score);
    }

    function updateStrengthIndicator(score) {
        let strength = 'Très Faible';
        let className = 'very-weak';

        if (score >= 85) {
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


    // ----------------------------------------------------------------------
    // --- 3. LOGIQUE DE GÉNÉRATION ET COPIE ---
    // ----------------------------------------------------------------------

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

        const charGenerators = [];
        if (uppercase.checked) charGenerators.push(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
        if (lowercase.checked) charGenerators.push(() => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
        if (numbers.checked) charGenerators.push(() => '0123456789'[Math.floor(Math.random() * 10)]);
        if (symbols.checked) charGenerators.push(() => '!@#$%^&*()_+~`|}{[]:;?><,./-='[Math.floor(Math.random() * 32)]);

        for (let i = 0; i < len; i++) {
            if (i < charGenerators.length) {
                password += charGenerators[i]();
            } else {
                password += charset[Math.floor(Math.random() * charset.length)];
            }
        }

        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        passwordOutput.value = password;

        const strengthScore = checkPasswordStrength(password);
        updateStrengthIndicator(strengthScore);
    }

    // --- 4. GESTION DES ÉVÉNEMENTS ---
    passwordOutput.addEventListener('input', () => {
        const manualPassword = passwordOutput.value;
        const strengthScore = checkPasswordStrength(manualPassword);
        updateStrengthIndicator(strengthScore);
    });

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

    // --- Initialisation au chargement de la page ---
    loadTheme();
    loadCookieConsent();
    generatePassword();
});
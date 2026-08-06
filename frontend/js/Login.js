// login.js
// Depende de api.js já estar carregado antes deste script (ver <script> em login.html)

const form = document.querySelector('form');
const errorEl = document.getElementById('formError');
const [emailInput, passwordInput] = document.querySelectorAll('.input-field input');
const rememberCheckbox = document.getElementById('remember');

// Se o usuário já está logado (token salvo de uma sessão anterior), pula direto pro dashboard
if (isLoggedIn()) window.location.href = 'dashboard.html';

function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function hideError() {
    errorEl.style.display = 'none';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do form (recarregar a página)
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        // Login não usa apiFetch porque ainda não existe token nesse momento
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.status === 401) return showError('E-mail ou senha incorretos.');
        if (res.status === 400) return showError('Preenche e-mail e senha.');
        if (!res.ok) return showError('Erro ao entrar. Tenta de novo em instantes.');

        const data = await res.json(); // { acessToken, refreshToken }
        saveTokens(data, rememberCheckbox.checked);
        window.location.href = 'dashboard.html';
    } catch (error) {
        // Cai aqui se o backend estiver fora do ar ou CORS bloquear a chamada
        console.error(error);
        showError('Não consegui falar com o servidor. Ele está rodando?');
    }
});
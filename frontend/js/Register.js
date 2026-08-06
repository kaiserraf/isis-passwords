// register.js
requireAuth(); // Redireciona pro login se não houver sessão ativa — essa rota exige autenticação no backend

const form = document.querySelector('form');
const errorEl = document.getElementById('formError');
const successEl = document.getElementById('formSuccess');
const [nameInput, emailInput, passwordInput] = document.querySelectorAll('.input-field input');

function showError(message) {
    successEl.style.display = 'none';
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function showSuccess(message) {
    errorEl.style.display = 'none';
    successEl.textContent = message;
    successEl.style.display = 'block';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // O backend chama esse campo de "passwordHash" no corpo da requisição
    // (nome ruim — o valor aqui é a senha em texto puro, o hash é feito no servidor)
    const body = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        passwordHash: passwordInput.value
    };

    try {
        const res = await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (!res) return; // apiFetch já redirecionou pro login (sessão expirada)

        if (res.status === 400) return showError('Não deu pra criar esse acesso. Confere os dados.');
        if (!res.ok) return showError('Erro ao criar o acesso. Tenta de novo.');

        form.reset();
        showSuccess('Acesso criado! Já pode usar esse e-mail e senha pra entrar.');
    } catch (error) {
        console.error(error);
        showError('Não consegui falar com o servidor. Ele está rodando?');
    }
});
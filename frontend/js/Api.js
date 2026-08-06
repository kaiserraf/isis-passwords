// api.js
// Camada única de comunicação com o backend. Todo fetch do frontend passa por aqui,
// pra não espalhar lógica de token/URL repetida em cada página.

const API_BASE_URL = 'http://localhost:3000'; // Ajuste aqui se o backend rodar em outra porta/host

/*
  Onde os tokens ficam guardados:
  - Se "lembrar cadastro" estiver marcado no login -> localStorage (sobrevive fechar o navegador)
  - Se não estiver marcado -> sessionStorage (some ao fechar a aba)
  A escolha de qual dos dois usar fica salva separadamente em localStorage (isisRemember),
  porque essa decisão em si precisa "lembrar" mesmo entre sessões.
*/
function getStorage() {
    const remember = localStorage.getItem('isisRemember') === 'true';
    return remember ? localStorage : sessionStorage;
}

function saveTokens({ acessToken, refreshToken }, remember) {
    localStorage.setItem('isisRemember', remember ? 'true' : 'false');
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('isisAccessToken', acessToken);
    storage.setItem('isisRefreshToken', refreshToken);
}

function getAccessToken() {
    return getStorage().getItem('isisAccessToken');
}

function getRefreshToken() {
    return getStorage().getItem('isisRefreshToken');
}

function clearTokens() {
    localStorage.removeItem('isisAccessToken');
    localStorage.removeItem('isisRefreshToken');
    localStorage.removeItem('isisRemember');
    sessionStorage.removeItem('isisAccessToken');
    sessionStorage.removeItem('isisRefreshToken');
}

function isLoggedIn() {
    return Boolean(getAccessToken());
}

// Tenta trocar o refreshToken por um novo par de tokens (access + refresh, com rotação).
// Retorna true se conseguiu, false se o refresh token também já expirou/é inválido.
async function tryRefresh() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) return false;

    const data = await res.json();
    const remember = localStorage.getItem('isisRemember') === 'true';
    saveTokens(data, remember);
    return true;
}

/*
  Wrapper de fetch para rotas protegidas (tudo que exige login):
  1. Anexa o Authorization: Bearer <accessToken> automaticamente.
  2. Se a resposta vier 401 (access token expirado), tenta renovar via refresh
     token UMA vez e repete a chamada original.
  3. Se o refresh também falhar, limpa os tokens e manda pro login.
  `retry` existe só pra evitar loop infinito caso o refresh "funcione" mas o
  novo token ainda assim seja rejeitado.
*/
async function apiFetch(path, options = {}, retry = true) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getAccessToken();
    if (token) headers['authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (res.status === 401 && retry) {
        const refreshed = await tryRefresh();
        if (refreshed) return apiFetch(path, options, false);

        clearTokens();
        window.location.href = 'login.html';
        return null;
    }

    return res;
}

// Redireciona pro login se não houver token — chame no topo de páginas protegidas
// (dashboard.html, register.html) antes de fazer qualquer outra coisa.
function requireAuth() {
    if (!isLoggedIn()) window.location.href = 'login.html';
}

async function logout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        // Best effort: mesmo se essa chamada falhar, limpamos os tokens locais de qualquer forma
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        }).catch(() => {});
    }
    clearTokens();
    window.location.href = 'login.html';
}
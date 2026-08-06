// dashboard.js
requireAuth(); // Sem sessão, nem carrega a lista — manda direto pro login

const listEl = document.getElementById('passwordList');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('newPasswordBtn').addEventListener('click', () => openFormModal());

// Fecha o modal clicando fora dele (no overlay, não no card do modal em si)
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
});

function closeModal() {
    modalOverlay.classList.add('hidden');
    modalContent.innerHTML = '';
}

function openModal(html) {
    modalContent.innerHTML = html;
    modalOverlay.classList.remove('hidden');
}

// ===== Carregar e renderizar a lista =====
// GET /password devolve todos os campos, incluindo passwordEncrypted (ainda criptografado) —
// a lista só usa service/username/fav/createdAt; a senha em si só é buscada sob demanda
// via GET /password/:id (openViewModal), que é a única rota que decripta.
async function loadPasswords() {
    const res = await apiFetch('/password');
    if (!res) return;

    if (res.status === 204) return renderList([]); // backend manda 204 quando não há nenhuma senha
    if (!res.ok) {
        listEl.innerHTML = '<p class="empty-state">Erro ao carregar as senhas.</p>';
        return;
    }

    const passwords = await res.json();
    renderList(passwords);
}

function renderList(passwords) {
    if (passwords.length === 0) {
        listEl.innerHTML = '<p class="empty-state">Nenhuma senha cadastrada ainda.</p>';
        return;
    }

    // Favoritas primeiro, depois por nome do serviço
    const sorted = [...passwords].sort((a, b) => {
        if (a.fav !== b.fav) return a.fav ? -1 : 1;
        return a.service.localeCompare(b.service);
    });

    listEl.innerHTML = sorted.map(cardHtml).join('');

    // Reatribui os eventos depois de recriar o HTML (innerHTML apaga os listeners antigos)
    sorted.forEach((p) => {
        document.getElementById(`fav-${p.id}`).addEventListener('click', () => toggleFav(p));
        document.getElementById(`view-${p.id}`).addEventListener('click', () => openViewModal(p.id));
        document.getElementById(`edit-${p.id}`).addEventListener('click', () => openFormModal(p));
        document.getElementById(`del-${p.id}`).addEventListener('click', () => deletePassword(p.id));
    });
}

function cardHtml(p) {
    return `
        <div class="password-card">
            <div class="info">
                <span class="service">${escapeHtml(p.service)}</span>
                <span class="username">${escapeHtml(p.username)}</span>
            </div>
            <div class="actions">
                <button id="fav-${p.id}" class="fav-star ${p.fav ? '' : 'inactive'}" title="Favoritar">★</button>
                <button id="view-${p.id}">Ver</button>
                <button id="edit-${p.id}">Editar</button>
                <button id="del-${p.id}">Excluir</button>
            </div>
        </div>
    `;
}

// Evita que service/username com HTML dentro (ex: "<script>") quebrem a página ao serem injetados via innerHTML
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Ver senha (decriptar sob demanda) =====
async function openViewModal(id) {
    openModal('<p>Carregando...</p>');
    const res = await apiFetch(`/password/${id}`);
    if (!res) return;

    if (!res.ok) {
        openModal('<p class="form-error" style="display:block">Não foi possível carregar essa senha.</p>');
        return;
    }

    const p = await res.json(); // aqui passwordEncrypted já vem DECRIPTADO (texto puro) pelo backend
    openModal(`
        <h3>${escapeHtml(p.service)}</h3>
        <p class="username" style="margin-bottom:15px">${escapeHtml(p.username)}</p>
        <div class="revealed-password">
            <span id="revealedValue">${escapeHtml(p.passwordEncrypted)}</span>
            <button id="copyBtn">Copiar</button>
        </div>
        <div class="modal-actions">
            <button class="secondary" id="closeViewBtn">Fechar</button>
        </div>
    `);

    document.getElementById('closeViewBtn').addEventListener('click', closeModal);
    document.getElementById('copyBtn').addEventListener('click', async () => {
        await navigator.clipboard.writeText(p.passwordEncrypted);
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 1500);
    });
}

// ===== Criar / editar (mesmo formulário, muda o que faz no submit) =====
function openFormModal(existing) {
    const isEdit = Boolean(existing);
    openModal(`
        <h3>${isEdit ? 'Editar senha' : 'Nova senha'}</h3>
        <form id="passwordForm">
            <div class="input-field">
                <input type="text" id="serviceInput" value="${isEdit ? escapeHtml(existing.service) : ''}" required>
                <label>Serviço</label>
            </div>
            <div class="input-field">
                <input type="text" id="usernameInput" value="${isEdit ? escapeHtml(existing.username) : ''}" required>
                <label>Usuário / e-mail</label>
            </div>
            <div class="input-field">
                <input type="text" id="passwordInput" placeholder="${isEdit ? 'Deixe em branco pra manter a atual' : 'Deixe em branco pra gerar uma senha aleatória'}">
                <label>Senha</label>
            </div>
            <div class="modal-actions">
                <button type="button" class="secondary" id="cancelBtn">Cancelar</button>
                <button type="submit">${isEdit ? 'Salvar' : 'Criar'}</button>
            </div>
        </form>
    `);

    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('passwordForm').addEventListener('submit', (event) => {
        event.preventDefault();
        isEdit ? submitEdit(existing.id) : submitCreate();
    });
}

async function submitCreate() {
    const body = {
        service: document.getElementById('serviceInput').value.trim(),
        username: document.getElementById('usernameInput').value.trim(),
        passwordEncrypted: document.getElementById('passwordInput').value // nome do campo é assim no backend, mesmo enviando texto puro (ele criptografa lá)
    };

    const res = await apiFetch('/password/register', { method: 'POST', body: JSON.stringify(body) });
    if (!res) return;
    if (!res.ok) return alert('Não foi possível criar a senha.');

    closeModal();
    loadPasswords();
}

async function submitEdit(id) {
    const body = {
        service: document.getElementById('serviceInput').value.trim(),
        username: document.getElementById('usernameInput').value.trim()
    };
    const newPassword = document.getElementById('passwordInput').value;
    if (newPassword) body.passwordEncrypted = newPassword; // só manda se o usuário digitou uma nova

    const res = await apiFetch(`/password/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    if (!res) return;
    if (!res.ok) return alert('Não foi possível salvar as alterações.');

    closeModal();
    loadPasswords();
}

async function toggleFav(p) {
    const res = await apiFetch(`/password/${p.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fav: !p.fav })
    });
    if (!res) return;
    if (!res.ok) return alert('Não foi possível favoritar.');
    loadPasswords();
}

async function deletePassword(id) {
    if (!confirm('Excluir essa senha? Não tem como desfazer.')) return;

    const res = await apiFetch(`/password/${id}`, { method: 'DELETE' });
    if (!res) return;
    if (!res.ok) return alert('Não foi possível excluir.');
    loadPasswords();
}

loadPasswords();
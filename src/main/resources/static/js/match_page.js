
// Dados iniciais do perfil
const profileData = {
    myProfile: {
        name: "Carlos Silva",
        age: 28,
        interests: ["geek", "sports"],
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    desiredProfile: {
        minAge: 25,
        maxAge: 32,
        interests: ["geek", "party"]
    },
    matchProfile: {
        name: "Ana Oliveira",
        age: 27,
        interests: ["geek", "party", "sports"],
        photo: "https://randomuser.me/api/portraits/women/44.jpg"
    }
};

// Elementos DOM
const matchButton = document.getElementById('matchButton');
const backButton = document.getElementById('backButton');
const loading = document.getElementById('loading');
const matchResult = document.getElementById('matchResult');
const matchPercentage = document.getElementById('matchPercentage');

// Elementos de perfil
const myProfileName = document.getElementById('myProfileName');
const matchProfileName = document.getElementById('matchProfileName');
const myProfileImg = document.getElementById('myProfileImg');
const matchProfileImg = document.getElementById('matchProfileImg');

// Elementos modais
const profileModal = document.getElementById('profileModal');
const editMyProfileModal = document.getElementById('editMyProfileModal');
const editDesiredProfileModal = document.getElementById('editDesiredProfileModal');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const closeButtons = document.querySelectorAll('.close-btn');

// Botões de edição
const editMyProfileBtn = document.getElementById('editMyProfile');
const editDesiredProfileBtn = document.getElementById('editDesiredProfile');

// Botões de ação
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

// Formulários
const myProfileForm = document.getElementById('myProfileForm');
const desiredProfileForm = document.getElementById('desiredProfileForm');

// Elementos de detalhes do modal
const modalMyName = document.getElementById('modalMyName');
const modalMyAge = document.getElementById('modalMyAge');
const modalMyInterests = document.getElementById('modalMyInterests');
const modalDesiredAge = document.getElementById('modalDesiredAge');
const modalDesiredInterests = document.getElementById('modalDesiredInterests');

// Inicialização
function initPage() {
    updateProfileDisplay();
}

// Atualizar exibição do perfil
function updateProfileDisplay() {
    // Atualizar dados na página principal
    matchProfileName.textContent = profileData.matchProfile.name;
    myProfileImg.src = profileData.myProfile.photo;
    matchProfileImg.src = profileData.matchProfile.photo;

    // Atualizar dados no modal de detalhes
    modalMyAge.textContent = `${profileData.myProfile.age} anos`;
    modalDesiredAge.textContent = `${profileData.desiredProfile.minAge}-${profileData.desiredProfile.maxAge} anos`;

    // Atualizar interesses no modal
    updateInterestsDisplay(modalMyInterests, profileData.myProfile.interests);
    updateInterestsDisplay(modalDesiredInterests, profileData.desiredProfile.interests);
}

// Atualizar exibição de interesses
function updateInterestsDisplay(container, interests) {
    container.innerHTML = '';

    interests.forEach(interest => {
        const tag = document.createElement('span');
        tag.className = `tag ${interest}`;

        switch (interest) {
            case 'geek':
                tag.textContent = 'Geek';
                break;
            case 'sports':
                tag.textContent = 'Esportes';
                break;
            case 'party':
                tag.textContent = 'Festa';
                break;
        }

        container.appendChild(tag);
    });
}

// Calcular porcentagem de match
function calculateMatchPercentage() {
    const myInterests = profileData.myProfile.interests;
    const desiredInterests = profileData.desiredProfile.interests;
    const matchInterests = profileData.matchProfile.interests;

    // Verificar interesses em comum
    const commonInterests = matchInterests.filter(interest =>
        myInterests.includes(interest) && desiredInterests.includes(interest)
    );

    // Verificar idade dentro da faixa desejada
    const ageMatch = profileData.matchProfile.age >= profileData.desiredProfile.minAge &&
        profileData.matchProfile.age <= profileData.desiredProfile.maxAge;

    // Cálculo baseado em interesses comuns e idade
    const interestScore = (commonInterests.length / Math.max(myInterests.length, desiredInterests.length)) * 70;
    const ageScore = ageMatch ? 30 : 0;

    return Math.min(100, Math.round(interestScore + ageScore));
}

// Event Listeners
matchButton.addEventListener('click', () => {
    // Esconder botões e mostrar animação
    matchButton.style.display = 'none';
    document.querySelector('.edit-buttons').style.display = 'none';
    loading.style.display = 'flex';

    // Simular busca por match
    setTimeout(() => {
        loading.style.display = 'none';

        // Calcular porcentagem de match
        const percentage = calculateMatchPercentage();
        matchPercentage.textContent = `${percentage}%`;

        // Mostrar resultado
        matchResult.style.display = 'block';
    }, 3000);
});

backButton.addEventListener('click', () => {
    // Voltar ao estado inicial
    matchResult.style.display = 'none';
    matchButton.style.display = 'block';
    document.querySelector('.edit-buttons').style.display = 'flex';
});

// Abrir modal ao clicar nas fotos de perfil
myProfileImg.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

matchProfileImg.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

// Botões para abrir modais de edição
editMyProfileBtn.addEventListener('click', () => {
    editMyProfileModal.style.display = 'flex';

    // Preencher formulário com dados atuais
    document.getElementById('myName').value = profileData.myProfile.name;
    document.getElementById('myAge').value = profileData.myProfile.age;

    // Marcar checkboxes de interesses
    document.querySelectorAll('input[name="myInterest"]').forEach(checkbox => {
        checkbox.checked = profileData.myProfile.interests.includes(checkbox.value);
    });
});

editDesiredProfileBtn.addEventListener('click', () => {
    editDesiredProfileModal.style.display = 'flex';

    // Preencher formulário com dados atuais
    document.getElementById('minAge').value = profileData.desiredProfile.minAge;
    document.getElementById('maxAge').value = profileData.desiredProfile.maxAge;

    // Marcar checkboxes de interesses
    document.querySelectorAll('input[name="desiredInterest"]').forEach(checkbox => {
        checkbox.checked = profileData.desiredProfile.interests.includes(checkbox.value);
    });
});

// Fechar modais
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        profileModal.style.display = 'none';
        editMyProfileModal.style.display = 'none';
        editDesiredProfileModal.style.display = 'none';
        deleteAccountModal.style.display = 'none';
    });
});

// Fechar modais ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        profileModal.style.display = 'none';
        editMyProfileModal.style.display = 'none';
        editDesiredProfileModal.style.display = 'none';
        deleteAccountModal.style.display = 'none';
    }
});

// Abrir modal de exclusão
deleteAccountBtn.addEventListener('click', () => {
    deleteAccountModal.style.display = 'flex';
});

// Cancelar exclusão
cancelDeleteBtn.addEventListener('click', () => {
    deleteAccountModal.style.display = 'none';
});

// Confirmar exclusão
confirmDeleteBtn.addEventListener('click', () => {
    alert('Conta excluída com sucesso! (simulação)');
    deleteAccountModal.style.display = 'none';
});

// Logout
logoutBtn.addEventListener('click', () => {
    // Simulação: redireciona para a página de login
    alert('Você foi desconectado com sucesso! (simulação)');
    // window.location.href = 'index.html';
});

if (myProfileForm) {
    myProfileForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Remova esta linha se quiser o comportamento padrão
        
        // Aqui você pode adicionar validações adicionais se necessário
        console.log("Formulário enviado!");
        
        // Envia o formulário
        this.submit();
    });
}

// Manipular envio do formulário de exclusão
if (document.getElementById('deleteForm')) {
    document.getElementById('deleteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (confirm('Tem certeza que deseja excluir sua conta permanentemente?')) {
            // Adiciona um input hidden para o método DELETE
            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'DELETE';
            this.appendChild(methodInput);
            
            // Envia o formulário
            this.submit();
        }
    });
}

// Atualize o event listener do botão de delete para abrir o modal
document.getElementById('deleteAccountBtn').addEventListener('click', function(e) {
    e.preventDefault();
    deleteAccountModal.style.display = 'flex';
});

// Iniciar página
initPage();

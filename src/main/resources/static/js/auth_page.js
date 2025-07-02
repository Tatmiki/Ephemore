document.addEventListener('DOMContentLoaded', function() {
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Verificar se há erro para manter o formulário visível
    const urlParams = new URLSearchParams(window.location.search);
    const showLoginForm = urlParams.get('showLoginForm');
    
    if (showLoginForm) {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }

    if (showLogin && showRegister && registerForm && loginForm) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });

        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
});
// Redirect if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

function showTab(tab) {
    const loginForm =
        document.getElementById('loginForm');
    const registerForm =
        document.getElementById('registerForm');
    const loginTab =
        document.getElementById('loginTab');
    const registerTab =
        document.getElementById('registerTab');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
    hideAlert();
}

function showAlert(message, type) {
    const alertBox =
        document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = 'alert ' + type;
    alertBox.style.display = 'block';
}

function hideAlert() {
    const alertBox =
        document.getElementById('alertBox');
    alertBox.style.display = 'none';
}

async function handleLogin() {
    const email =
        document.getElementById(
            'loginEmail').value.trim();
    const password =
        document.getElementById(
            'loginPassword').value.trim();

    if (!email || !password) {
        showAlert(
            'Please fill in all fields!', 'error');
        return;
    }

    try {
        const data = await apiCall(
            '/auth/login', 'POST',
            { email, password });

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);

        showAlert('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        showAlert(
            error.message || 'Login failed!',
            'error');
    }
}

async function handleRegister() {
    const name =
        document.getElementById(
            'regName').value.trim();
    const email =
        document.getElementById(
            'regEmail').value.trim();
    const password =
        document.getElementById(
            'regPassword').value.trim();

    if (!name || !email || !password) {
        showAlert(
            'Please fill in all fields!', 'error');
        return;
    }

    try {
        const data = await apiCall(
            '/auth/register', 'POST',
            { name, email, password });

        showAlert(
            'Account created! Please login.',
            'success');
        setTimeout(() => showTab('login'), 1500);

    } catch (error) {
        showAlert(
            error.message || 'Registration failed!',
            'error');
    }
}
// Form validation and UI state management
class AuthUI {
    constructor() {
        this.isLogin = true;
        this.form = document.getElementById('authForm');
        this.usernameField = document.getElementById('usernameField');
        this.email = document.getElementById('email');
        this.password = document.getElementById('password');
        this.username = document.getElementById('username');
        this.submitBtn = document.querySelector('.submit-btn');
        this.submitText = document.getElementById('submitText');
        this.spinner = document.querySelector('.spinner');
        this.toggleAuthBtn = document.getElementById('toggleAuth');
        this.authTitle = document.getElementById('authTitle');
        this.togglePasswordBtn = document.getElementById('togglePassword');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.toggleAuthBtn.addEventListener('click', () => this.toggleAuthMode());
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());

        // Real-time validation
        this.email.addEventListener('input', () => this.validateEmail());
        this.password.addEventListener('input', () => this.validatePassword());
        this.username?.addEventListener('input', () => this.validateUsername());
    }

    toggleAuthMode() {
        this.isLogin = !this.isLogin;
        this.authTitle.textContent = this.isLogin ? 'Welcome Back' : 'Create Account';
        this.submitText.textContent = this.isLogin ? 'Sign In' : 'Sign Up';
        this.toggleAuthBtn.textContent = this.isLogin 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in';

        this.usernameField.classList.toggle('hidden', this.isLogin);
        this.clearErrors();
        this.form.reset();
    }

    togglePasswordVisibility() {
        const type = this.password.type === 'password' ? 'text' : 'password';
        this.password.type = type;
        
        this.togglePasswordBtn.innerHTML = type === 'password' 
            ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>'
            : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>';
    }

    validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(this.email.value);
        this.setFieldValidation(this.email, isValid, 'Please enter a valid email address');
        return isValid;
    }

    validatePassword() {
        const isValid = this.password.value.length >= 8;
        this.setFieldValidation(this.password, isValid, 'Password must be at least 8 characters');
        return isValid;
    }

    validateUsername() {
        if (!this.username) return true;
        const isValid = this.username.value.length >= 3;
        this.setFieldValidation(this.username, isValid, 'Username must be at least 3 characters');
        return isValid;
    }

    setFieldValidation(field, isValid, errorMessage) {
        const errorElement = field.parentElement.parentElement.querySelector('.error-message');
        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
        document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const url = this.isLogin ? 'login.php' : 'register.php';
        const formData = new FormData();
        formData.append('email', this.email.value);
        formData.append('password', this.password.value);
        if (!this.isLogin) formData.append('username', this.username.value);

        this.submitBtn.disabled = true;
        this.submitText.classList.add('hidden');
        this.spinner.classList.remove('hidden');

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                alert(result.success);
                this.form.reset();
            } else {
                alert(result.error || 'An error occurred');
            }
        } catch (error) {
            alert('Server error, please try again later');
        } finally {
            this.submitBtn.disabled = false;
            this.submitText.classList.remove('hidden');
            this.spinner.classList.add('hidden');
        }
    }
}

// Initialize the auth UI
new AuthUI();

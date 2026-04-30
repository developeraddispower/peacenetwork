// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// ============ DOM ELEMENTS ============
const authContainer = document.getElementById('authContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');

const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = document.getElementById('loadingMessage');
const successModal = document.getElementById('successModal');

// ============ FORM SWITCHING ============
document.querySelectorAll('.switch-form').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetForm = link.dataset.target;
        
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Show target form
        document.getElementById(targetForm).classList.add('active');
    });
});

// Forgot password link
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    forgotPasswordForm.classList.add('active');
});

// ============ TOGGLE PASSWORD VISIBILITY ============
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// ============ PASSWORD STRENGTH METER ============
const registerPassword = document.getElementById('registerPassword');
const strengthBar = document.getElementById('strengthBar');

if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) strength++;
        
        strengthBar.className = 'strength-bar';
        
        switch(strength) {
            case 0:
            case 1:
                strengthBar.classList.add('weak');
                break;
            case 2:
            case 3:
                strengthBar.classList.add('medium');
                break;
            case 4:
                strengthBar.classList.add('strong');
                break;
        }
    });
}

// ============ REGISTRATION STEPS ============
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextStepBtn = document.getElementById('nextStep');
const prevStepBtn = document.getElementById('prevStep');
const stepIndicators = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');

if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
        // Validate step 1
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        
        let isValid = true;
        
        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        } else {
            clearError('firstName');
        }
        
        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        } else {
            clearError('lastName');
        }
        
        if (!email) {
            showError('registerEmail', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('registerEmail', 'Please enter a valid email');
            isValid = false;
        } else {
            clearError('registerEmail');
        }
        
        if (!password) {
            showError('registerPassword', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('registerPassword', 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError('registerPassword');
        }
        
        if (isValid) {
            step1.classList.remove('active');
            step2.classList.add('active');
            
            // Update step indicators
            stepIndicators[0].classList.add('completed');
            stepIndicators[1].classList.add('active');
            if (stepLines[0]) stepLines[0].classList.add('completed');
        }
    });
}

if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        
        stepIndicators[0].classList.remove('completed');
        stepIndicators[1].classList.remove('active');
        if (stepLines[0]) stepLines[0].classList.remove('completed');
    });
}

// ============ ERROR HANDLING ============
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input) input.classList.add('error');
    if (errorElement) errorElement.textContent = message;
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input) input.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============ SHOW LOADING ============
function showLoading(message = 'Processing...') {
    loadingMessage.textContent = message;
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// ============ SHOW SUCCESS MODAL ============
function showSuccess(title, message, redirectUrl = null) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    successModal.classList.add('show');
    
    const successBtn = document.getElementById('successBtn');
    if (redirectUrl) {
        successBtn.onclick = () => {
            window.location.href = redirectUrl;
        };
    }
}

// ============ LOGIN FORM SUBMISSION ============
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate
        let isValid = true;
        
        if (!email) {
            showError('loginEmail', 'Email is required');
            isValid = false;
        } else {
            clearError('loginEmail');
        }
        
        if (!password) {
            showError('loginPassword', 'Password is required');
            isValid = false;
        } else {
            clearError('loginPassword');
        }
        
        if (!isValid) return;
        
        showLoading('Signing in...');
        
        try {
            // Firebase Authentication
            // const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Demo credentials check
            if (email === 'student@peace.com' && password === 'Student123!') {
                hideLoading();
                showSuccess('Welcome Back!', 'Redirecting to your dashboard...', 'student-dashboard.html');
            } else if (email === 'admin@peace.com' && password === 'Admin123!') {
                hideLoading();
                showSuccess('Welcome Admin!', 'Redirecting to admin panel...', 'admin-dashboard.html');
            } else {
                // For demo, accept any valid format
                // Check if email contains 'admin' for admin access
                if (email.includes('admin')) {
                    hideLoading();
                    showSuccess('Welcome Admin!', 'Redirecting to admin panel...', 'admin-dashboard.html');
                } else {
                    hideLoading();
                    showSuccess('Welcome!', 'Redirecting to your dashboard...', 'student-dashboard.html');
                }
            }
            
            // Store session
            const userData = {
                email: email,
                role: email.includes('admin') ? 'admin' : 'student',
                name: email.split('@')[0],
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(userData));
            }
            
        } catch (error) {
            hideLoading();
            showError('loginPassword', 'Invalid email or password. Try student@peace.com / Student123!');
            console.error('Login error:', error);
        }
    });
}

// ============ REGISTER FORM SUBMISSION ============
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const country = document.getElementById('country').value;
        const role = document.getElementById('role').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate step 2
        let isValid = true;
        
        if (!country) {
            showError('country', 'Please select your country');
            isValid = false;
        } else {
            clearError('country');
        }
        
        if (!role) {
            showError('role', 'Please select your interest');
            isValid = false;
        } else {
            clearError('role');
        }
        
        if (!agreeTerms) {
            showError('terms', 'You must agree to the terms');
            isValid = false;
        } else {
            clearError('terms');
        }
        
        if (!isValid) return;
        
        showLoading('Creating your account...');
        
        try {
            // Gather all form data
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('registerEmail').value.trim(),
                password: document.getElementById('registerPassword').value,
                country: country,
                role: role,
                interests: Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                    .map(cb => cb.value),
                createdAt: new Date().toISOString()
            };
            
            // Firebase Registration
            // const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            // await setDoc(doc(db, 'users', userCredential.user.uid), formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            hideLoading();
            showSuccess('Account Created!', 'Welcome to Pan-African Peace Network!', 'student-dashboard.html');
            
            // Store session
            sessionStorage.setItem('currentUser', JSON.stringify({
                ...formData,
                role: 'student'
            }));
            
            // Reset form
            signupForm.reset();
            
        } catch (error) {
            hideLoading();
            if (error.code === 'auth/email-already-in-use') {
                showError('registerEmail', 'This email is already registered');
            } else {
                alert('Registration failed. Please try again.');
            }
            console.error('Registration error:', error);
        }
    });
}

// ============ RESET PASSWORD FORM ============
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value.trim();
        
        if (!email) {
            showError('resetEmail', 'Email is required');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('resetEmail', 'Please enter a valid email');
            return;
        }
        
        clearError('resetEmail');
        showLoading('Sending reset link...');
        
        try {
            // Firebase Password Reset
            // await sendPasswordResetEmail(auth, email);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            hideLoading();
            alert('Password reset link sent! Check your email.');
            resetPasswordForm.reset();
            
            // Switch back to login
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            loginForm.classList.add('active');
            
        } catch (error) {
            hideLoading();
            showError('resetEmail', 'Email not found. Please check and try again.');
            console.error('Reset password error:', error);
        }
    });
}

// ============ SOCIAL LOGIN ============
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        showLoading('Connecting...');
        
        try {
            // Firebase Social Login
            // const provider = new GoogleAuthProvider();
            // const result = await signInWithPopup(auth, provider);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            hideLoading();
            
            const isGoogle = btn.classList.contains('google-btn');
            const provider = isGoogle ? 'Google' : 'Facebook';
            
            showSuccess(`Welcome!`, `Successfully signed in with ${provider}`, 'student-dashboard.html');
            
        } catch (error) {
            hideLoading();
            alert('Social login failed. Please try email login.');
            console.error('Social login error:', error);
        }
    });
});

// ============ CHECK REMEMBERED USER ============
document.addEventListener('DOMContentLoaded', () => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        if (userData.email === 'student@peace.com') {
            document.getElementById('loginEmail').value = userData.email;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // Check if already logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    }
    
    console.log('🔐 Auth page loaded!');
    console.log('Demo Credentials:');
    console.log('  Student: student@peace.com / Student123!');
    console.log('  Admin: admin@peace.com / Admin123!');
});

// ============ CLOSE MODAL ON OUTSIDE CLICK ============
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

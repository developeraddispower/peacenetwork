// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');

// Character counter
const textarea = document.getElementById('contactMessage');
const charCount = document.querySelector('.char-count');

if (textarea && charCount) {
    textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        charCount.textContent = `${count}/${textarea.maxLength || 1000}`;
        
        if (count > (textarea.maxLength || 1000) * 0.9) {
            charCount.style.color = '#CE1126';
        } else {
            charCount.style.color = '#999';
        }
    });
}

// Real-time validation
const inputs = document.querySelectorAll('#contactName, #contactEmail, #contactSubject, #contactMessage');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(input) {
    const fieldId = input.id;
    const errorElement = document.getElementById(fieldId === 'contactName' ? 'nameError' : 
                                            fieldId === 'contactEmail' ? 'emailError' :
                                            fieldId === 'contactSubject' ? 'subjectError' : 'messageError');
    
    if (!input.value.trim()) {
        showFieldError(input, errorElement, 'This field is required');
        return false;
    }
    
    if (fieldId === 'contactEmail') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showFieldError(input, errorElement, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (fieldId === 'contactMessage' && input.value.trim().length < 10) {
        showFieldError(input, errorElement, 'Message must be at least 10 characters');
        return false;
    }
    
    clearFieldError(input, errorElement);
    return true;
}

function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (errorElement) errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorElement) errorElement.textContent = '';
}

// Form submission
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    // Gather form data
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        country: document.getElementById('contactCountry').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value.trim(),
        newsletter: document.getElementById('newsletterSignup').checked,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Firebase submission
        // await addDoc(collection(db, 'messages'), formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success modal
        successModal.classList.add('show');
        
        // Reset form
        contactForm.reset();
        document.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
        if (charCount) charCount.textContent = '0/1000';
        
    } catch (error) {
        showToast('Failed to send message. Please try again.', 'error');
        console.error('Submission error:', error);
    } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }
});

// Close success modal
successClose?.addEventListener('click', () => {
    successModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

// ============ FAQ ACCORDION ============
const faqCards = document.querySelectorAll('.faq-card');

faqCards.forEach(card => {
    const header = card.querySelector('.faq-header');
    
    header.addEventListener('click', () => {
        // Close other FAQs
        faqCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                otherCard.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        card.classList.toggle('active');
    });
});

// ============ SOCIAL LINK HOVER EFFECTS ============
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(8px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// ============ OFFICE CARD HOVER ============
document.querySelectorAll('.office-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.contact-toast');
    if (existingToast) existingToast.remove();
    
    const colors = {
        success: '#00923F',
        error: '#CE1126',
        warning: '#F57C00',
        info: '#333'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = 'contact-toast';
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        font-size: 0.95rem;
        max-width: 400px;
    `;
    
    document.body.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('📬 Contact page loaded!');
    console.log('We look forward to hearing from you!');
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

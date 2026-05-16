// ============ INITIALIZE ANIMATIONS ============
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out'
});

// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============ MODERN MOBILE NAVIGATION ============
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

overlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// ============ STATS COUNTER ANIMATION ============
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for stats
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
}

// ============ LIKE BUTTON FUNCTIONALITY ============
document.querySelectorAll('.btn-like').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('liked');
        const icon = this.querySelector('i');
        const countText = this.textContent.trim();
        const count = parseInt(countText) || 0;
        
        if (this.classList.contains('liked')) {
            this.innerHTML = `<i class="fas fa-heart"></i> ${count + 1}`;
        } else {
            this.innerHTML = `<i class="far fa-heart"></i> ${count - 1}`;
        }
    });
});

// ============ QUICK OPINION FORM ============
const opinionForm = document.getElementById('quick-opinion-form');
if (opinionForm) {
    opinionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: opinionForm.querySelector('input[placeholder="Your Name"]')?.value || '',
            country: opinionForm.querySelector('input[placeholder="Your Country"]')?.value || '',
            topic: opinionForm.querySelector('select')?.value || '',
            message: opinionForm.querySelector('textarea')?.value || ''
        };
        
        // Basic validation
        if (!formData.name || !formData.country || !formData.topic || !formData.message) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        
        const submitBtn = opinionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Firebase submission
            // await addDoc(collection(db, 'opinions'), {
            //     ...formData,
            //     timestamp: serverTimestamp(),
            //     status: 'pending'
            // });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showToast('Your voice has been added to our book!', 'success');
            opinionForm.reset();
            
        } catch (error) {
            showToast('Error submitting. Please try again.', 'error');
            console.error(error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============ NEWSLETTER FORM ============
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput?.value;
        
        if (email) {
            showToast('Thank you for subscribing!', 'success');
            newsletterForm.reset();
        }
    });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ============ TICKER PAUSE ON HOVER ============
const ticker = document.querySelector('.ticker');
if (ticker) {
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const colors = {
        success: '#1B9C3D',
        error: '#D63031',
        warning: '#E8B931',
        info: '#0A2647'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        background: colors[type],
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        fontSize: '0.95rem',
        fontWeight: '500',
        maxWidth: '400px'
    });
    
    document.body.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============ BACK TO TOP BUTTON ============
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
Object.assign(backToTopBtn.style, {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'var(--primary, #0A2647)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    zIndex: '999',
    opacity: '0',
    visibility: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ ADD ANIMATION STYLES ============
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// ============ INITIALIZATION LOG ============
console.log('🕊️ Pan-African Peace Network - Modern UI Ready!');
console.log('🌍 Building the Africa We Want');

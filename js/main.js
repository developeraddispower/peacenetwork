// Initialize animations
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Stats counter animation
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

// Intersection Observer for stats animation
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    observer.observe(statsSection);
}

// Like button functionality
document.querySelectorAll('.btn-like').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('liked');
        const icon = this.querySelector('i');
        const count = parseInt(this.textContent.trim());
        
        if (this.classList.contains('liked')) {
            this.innerHTML = `<i class="fas fa-heart"></i> ${count + 1}`;
        } else {
            this.innerHTML = `<i class="far fa-heart"></i> ${count - 1}`;
        }
    });
});

// Quick opinion form submission
const opinionForm = document.getElementById('quick-opinion-form');
if (opinionForm) {
    opinionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: e.target[0].value,
            country: e.target[1].value,
            topic: e.target[2].value,
            message: e.target[3].value
        };
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Here you would send to Firebase
            // await addDoc(collection(db, 'opinions'), {
            //     ...formData,
            //     timestamp: serverTimestamp(),
            //     status: 'pending'
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Thank you! Your voice has been added to our book.');
            opinionForm.reset();
            
        } catch (error) {
            alert('Error submitting. Please try again.');
            console.error(error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        alert('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Ticker pause on hover
const ticker = document.querySelector('.ticker');
if (ticker) {
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
}

console.log('🕊️ Pan-African Peace Network - Ready!');

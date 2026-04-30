// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// ============ TESTIMONIAL SLIDER ============
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');

let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev);
}

// Event listeners
if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-advance slides
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const slider = document.querySelector('.testimonials-slider');
if (slider) {
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
    const counters = document.querySelectorAll('.impact-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPlus = target.includes('+');
        const isK = target.includes('K');
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        
        const updateCount = () => {
            const current = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const increment = Math.ceil(numericTarget / speed);
            
            if (current < numericTarget) {
                let newValue = current + increment;
                if (newValue > numericTarget) newValue = numericTarget;
                
                let displayValue = newValue.toString();
                if (isK && newValue >= 1000) {
                    displayValue = (newValue / 1000).toFixed(1) + 'K';
                } else if (isK) {
                    displayValue = newValue.toString();
                }
                if (isPlus && newValue === numericTarget) {
                    displayValue += '+';
                }
                
                counter.textContent = displayValue;
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start at 0
        counter.textContent = '0';
        updateCount();
    });
}

// Intersection Observer for counters
const impactSection = document.querySelector('.impact-section');
if (impactSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(impactSection);
}

// ============ TIMELINE ANIMATION ============
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.6s ease-out';
    timelineObserver.observe(item);
});

// ============ VALUE CARDS HOVER EFFECT ============
document.querySelectorAll('.value-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.value-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.value-icon i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ============ PARTNER LOGO HOVER ============
document.querySelectorAll('.partner-logo').forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    });
});

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
    console.log('🌍 About page loaded!');
    console.log('Pan-African Peace Network - Building the Africa We Want');
});

// ============ KEYBOARD NAVIGATION FOR SLIDER ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// ============ DOM ELEMENTS ============
const enrollBtns = document.querySelectorAll('#enrollBtn, #sidebarEnrollBtn, #ctaEnrollBtn');
const previewBtns = document.querySelectorAll('#previewBtn, .preview-overlay, .image-overlay');
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const enrollModal = document.getElementById('enrollModal');
const modalClose = document.querySelectorAll('.modal-close');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const bookmarkBtn = document.querySelector('.bookmark-course');
const previewLessons = document.querySelectorAll('.preview-lesson');
const shareBtns = document.querySelectorAll('.share-btn');

// ============ ACCORDION FUNCTIONALITY ============
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Close all accordions
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked accordion if it wasn't active
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});

// Open first accordion by default
if (accordionHeaders.length > 0) {
    accordionHeaders[0].parentElement.classList.add('active');
}

// ============ ENROLL FUNCTIONALITY ============
enrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Check if user is logged in
        const currentUser = sessionStorage.getItem('currentUser');
        
        if (!currentUser) {
            // Redirect to login
            window.location.href = 'login.html?redirect=course-detail.html';
            return;
        }
        
        // Show enrollment confirmation
        enrollModal.classList.add('show');
        
        // Change button text
        enrollBtns.forEach(b => {
            b.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            b.style.background = '#00923F';
            b.disabled = true;
        });
    });
});

// ============ START LEARNING ============
document.getElementById('startLearningBtn')?.addEventListener('click', () => {
    enrollModal.classList.remove('show');
    // In production, redirect to first lesson
    showToast('Starting first lesson...', 'success');
});

document.getElementById('goToDashboardBtn')?.addEventListener('click', () => {
    enrollModal.classList.remove('show');
    window.location.href = 'student-dashboard.html';
});

// ============ VIDEO PREVIEW ============
previewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        videoModal.classList.add('show');
        // Sample video - replace with actual course preview
        videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    });
});

// Lesson preview buttons
previewLessons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoModal.classList.add('show');
        videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    });
});

// ============ CLOSE MODALS ============
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.classList.remove('show');
        
        // Stop video
        if (modal === videoModal) {
            videoFrame.src = '';
        }
    });
});

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        if (e.target === videoModal) {
            videoFrame.src = '';
        }
    }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
            if (modal === videoModal) {
                videoFrame.src = '';
            }
        });
    }
});

// ============ BOOKMARK COURSE ============
if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.color = '#FCD116';
            showToast('Course bookmarked!', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.color = 'white';
            showToast('Bookmark removed', 'info');
        }
    });
}

// ============ SHARE FUNCTIONALITY ============
shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const url = window.location.href;
        const title = 'Introduction to Peace Studies | Pan-African Peace Network';
        const text = 'Check out this free course on peace studies!';
        
        if (btn.classList.contains('facebook')) {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (btn.classList.contains('twitter')) {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        } else if (btn.classList.contains('whatsapp')) {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        } else if (btn.classList.contains('linkedin')) {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (btn.classList.contains('copy-link')) {
            navigator.clipboard.writeText(url)
                .then(() => showToast('Link copied to clipboard!', 'success'))
                .catch(() => showToast('Failed to copy link', 'error'));
        }
    });
});

// ============ REVIEW HELPFUL BUTTONS ============
document.querySelectorAll('.review-actions button').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.querySelector('.fa-thumbs-up')) {
            const count = parseInt(this.textContent.match(/\d+/)?.[0] || 0);
            this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${count + 1})`;
            this.style.color = '#00923F';
            showToast('Marked as helpful!', 'success');
        }
    });
});

// ============ LOAD MORE REVIEWS ============
const loadMoreReviews = document.querySelector('.load-more-reviews');
loadMoreReviews?.addEventListener('click', () => {
    const reviewsList = document.querySelector('.reviews-list');
    
    // Simulate loading more reviews
    loadMoreReviews.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreReviews.disabled = true;
    
    setTimeout(() => {
        const newReview = document.createElement('div');
        newReview.className = 'review-item';
        newReview.innerHTML = `
            <div class="review-header">
                <img src="assets/images/avatar${Math.floor(Math.random() * 4) + 1}.jpg" alt="Student">
                <div>
                    <strong>New Student</strong>
                    <span>Just now</span>
                </div>
                <div class="review-rating">
                    ${Array(5).fill('<i class="fas fa-star"></i>').join('')}
                </div>
            </div>
            <p>This course exceeded my expectations. The content is well-structured and the instructor is very knowledgeable. I highly recommend it to anyone interested in peace studies.</p>
            <div class="review-actions">
                <button><i class="far fa-thumbs-up"></i> Helpful (0)</button>
                <button><i class="far fa-flag"></i> Report</button>
            </div>
        `;
        
        reviewsList.appendChild(newReview);
        loadMoreReviews.innerHTML = '<i class="fas fa-plus"></i> Load More Reviews';
        loadMoreReviews.disabled = false;
        
        showToast('More reviews loaded!', 'success');
    }, 1500);
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.course-toast');
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
    toast.className = 'course-toast';
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

// ============ SMOOTH SCROLL TO SECTIONS ============
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
    // Check if already enrolled
    const enrolled = sessionStorage.getItem('enrolled_course_peace101');
    if (enrolled) {
        enrollBtns.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            btn.style.background = '#00923F';
            btn.disabled = true;
        });
    }
    
    console.log('📖 Course Detail page loaded!');
    console.log('Course: Introduction to Peace Studies');
    console.log('Instructor: Dr. Fatima Ouedraogo');
});

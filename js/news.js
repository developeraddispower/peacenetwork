// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// ============ NEWS FILTERING ============
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');
const newsSearch = document.getElementById('newsSearch');
const categoryLinks = document.querySelectorAll('.category-list a');

let currentFilter = 'all';
let searchTerm = '';

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        filterNews();
    });
});

// Search
newsSearch?.addEventListener('input', debounce(() => {
    searchTerm = newsSearch.value.toLowerCase();
    filterNews();
}, 300));

// Category sidebar links
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.dataset.filter;
        currentFilter = filter;
        
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        filterNews();
        
        // Scroll to filters on mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.news-filters').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });
});

// Filter function
function filterNews() {
    newsCards.forEach(card => {
        const categories = card.dataset.category.toLowerCase();
        const cardText = card.textContent.toLowerCase();
        
        let shouldShow = true;
        
        // Category filter
        if (currentFilter !== 'all' && !categories.includes(currentFilter)) {
            shouldShow = false;
        }
        
        // Search filter
        if (searchTerm && !cardText.includes(searchTerm)) {
            shouldShow = false;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
        
        // Animate visible cards
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.5s ease-out';
        }
    });
    
    // Show no results message
    const visibleCards = document.querySelectorAll('.news-card[style*="block"], .news-card:not([style])');
    const loadMoreBtn = document.getElementById('loadMoreNews');
    
    if (visibleCards.length === 0) {
        if (loadMoreBtn && !document.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search fa-3x"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter</p>
            `;
            loadMoreBtn.parentElement.insertBefore(noResults, loadMoreBtn);
            loadMoreBtn.style.display = 'none';
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
        if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
    }
}

// ============ LOAD MORE NEWS ============
const loadMoreBtn = document.getElementById('loadMoreNews');
loadMoreBtn?.addEventListener('click', () => {
    const newsGrid = document.getElementById('newsGrid');
    
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more articles
    setTimeout(() => {
        const newArticles = [
            {
                image: 'news7.jpg',
                category: 'Peace',
                categoryClass: 'peace',
                date: 'Jan 28, 2024',
                readTime: '6 min read',
                title: 'Interfaith Dialogue Initiative Bridges Religious Divides',
                excerpt: 'Religious leaders from across Africa gathered to promote interfaith understanding and cooperation.',
                views: '1.8k',
                comments: '56'
            },
            {
                image: 'news8.jpg',
                category: 'Community',
                categoryClass: 'community',
                date: 'Jan 25, 2024',
                readTime: '4 min read',
                title: 'Rural Communities Embrace Peace Education Programs',
                excerpt: 'Villages in Tanzania and Kenya adopt innovative peace education curricula in local schools.',
                views: '920',
                comments: '34'
            },
            {
                image: 'news9.jpg',
                category: 'Events',
                categoryClass: 'events',
                date: 'Jan 20, 2024',
                readTime: '3 min read',
                title: 'African Artists Unite for Peace Exhibition in Dakar',
                excerpt: 'Over 100 artists showcase works promoting peace and unity at the Biennale.',
                views: '1.3k',
                comments: '42'
            }
        ];
        
        newArticles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.setAttribute('data-category', article.categoryClass);
            card.setAttribute('data-aos', 'fade-up');
            card.innerHTML = `
                <div class="news-card-image">
                    <img src="assets/images/${article.image}" alt="${article.title}">
                    <span class="card-category">${article.category}</span>
                </div>
                <div class="news-card-content">
                    <div class="card-meta">
                        <span><i class="far fa-calendar"></i> ${article.date}</span>
                        <span><i class="far fa-clock"></i> ${article.readTime}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="card-footer">
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        <div class="card-stats">
                            <span><i class="far fa-eye"></i> ${article.views}</span>
                            <span><i class="far fa-comment"></i> ${article.comments}</span>
                        </div>
                    </div>
                </div>
            `;
            newsGrid.appendChild(card);
        });
        
        loadMoreBtn.innerHTML = '<i class="fas fa-sync"></i> Load More Articles';
        loadMoreBtn.disabled = false;
        
        // Re-trigger AOS
        AOS.refresh();
        
        showToast('More articles loaded!', 'success');
    }, 1500);
});

// ============ EVENT REGISTRATION ============
const eventModal = document.getElementById('eventModal');
const eventModalTitle = document.getElementById('eventModalTitle');
const registerButtons = document.querySelectorAll('.register-event');
const modalClose = document.querySelectorAll('.modal-close');
const eventForm = document.getElementById('eventRegistrationForm');

registerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const eventName = btn.dataset.event === 'summit2024' 
            ? 'Pan-African Peace Summit 2024' 
            : 'Upcoming Event';
        
        eventModalTitle.textContent = `Register for ${eventName}`;
        eventModal.classList.add('show');
    });
});

// Close modals
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        eventModal.classList.remove('show');
    });
});

window.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        eventModal.classList.remove('show');
    }
});

// Event registration form
eventForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = eventForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        eventModal.classList.remove('show');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        eventForm.reset();
        
        showToast('Successfully registered for the event! Check your email.', 'success');
    }, 1500);
});

// ============ SIDEBAR NEWSLETTER ============
const sidebarNewsletter = document.querySelector('.sidebar-newsletter');
sidebarNewsletter?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
        
        showToast('Subscribed successfully!', 'success');
    }, 1000);
});

// ============ TAG CLOUD ============
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        const tagText = tag.textContent.replace('#', '').toLowerCase();
        
        // Set as search term
        if (newsSearch) {
            newsSearch.value = tagText;
            searchTerm = tagText;
            filterNews();
        }
        
        // Scroll to top of news
        document.querySelector('.news-grid-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
});

// ============ READ MORE LINKS ============
document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.news-card');
        const title = card.querySelector('h3').textContent;
        
        showToast(`Opening: ${title}`, 'info');
    });
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.news-toast');
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
    toast.className = 'news-toast';
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

// ============ DEBOUNCE UTILITY ============
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('📰 News page loaded!');
    console.log('Stay informed about peace and unity across Africa');
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    .no-results {
        text-align: center;
        padding: 4rem 2rem;
        color: #888;
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
    }
    
    .no-results h3 {
        margin-bottom: 0.5rem;
        color: #666;
    }
`;
document.head.appendChild(style);

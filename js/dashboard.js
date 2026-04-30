// ============ INITIALIZATION ============
AOS.init({
    duration: 800,
    once: true
});

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    initializeDashboard(userData);
});

// ============ INITIALIZE DASHBOARD ============
function initializeDashboard(userData) {
    // Update user info
    document.getElementById('studentName').textContent = userData.name || 'Student';
    document.getElementById('studentEmail').textContent = userData.email;
    document.getElementById('welcomeName').textContent = userData.name || 'Student';
    
    // Check if admin
    if (userData.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}

// ============ SIDEBAR TOGGLE (Mobile) ============
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarToggle = document.getElementById('sidebarToggle');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ============ PAGE NAVIGATION ============
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const pageContents = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');

const pageTitles = {
    'overview': 'Dashboard Overview',
    'my-courses': 'My Courses',
    'my-voices': 'My Voices',
    'certificates': 'My Certificates',
    'bookmarks': 'Bookmarked Voices',
    'profile': 'Profile Settings'
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show selected page
        const pageName = link.dataset.page;
        pageContents.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            pageTitle.textContent = pageTitles[pageName] || pageName;
            
            // Initialize chart if overview page
            if (pageName === 'overview') {
                setTimeout(initializeProgressChart, 300);
            }
        }
        
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });
});

// View all links
document.querySelectorAll('.view-all[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = link.dataset.page;
        
        // Trigger nav click
        const navLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (navLink) {
            navLink.click();
        }
    });
});

// ============ COURSE TABS ============
const tabBtns = document.querySelectorAll('.tab-btn');
const courseCards = document.querySelectorAll('.enrolled-course-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        
        courseCards.forEach(card => {
            if (tab === 'all') {
                card.style.display = 'block';
            } else {
                card.style.display = card.dataset.status === tab ? 'block' : 'none';
            }
        });
        
        // Re-trigger animations
        AOS.refresh();
    });
});

// ============ NOTIFICATIONS ============
const notificationBtn = document.querySelector('.notification-btn');
const notificationDropdown = document.querySelector('.notification-dropdown');

if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.style.display = 
            notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });
}

// Close notification dropdown on outside click
document.addEventListener('click', (e) => {
    if (notificationDropdown && !notificationBtn?.contains(e.target)) {
        notificationDropdown.style.display = 'none';
    }
});

// Mark notification as read
document.querySelectorAll('.notification-item.unread').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.remove('unread');
        updateNotificationBadge();
    });
});

function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Mark all as read
const markAllRead = document.querySelector('.notification-header a');
if (markAllRead) {
    markAllRead.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        updateNotificationBadge();
    });
}

// ============ PROGRESS CHART ============
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (window.progressChartInstance) {
        window.progressChartInstance.destroy();
    }
    
    const chart = ctx.getContext('2d');
    
    window.progressChartInstance = new Chart(chart, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Hours Learned',
                data: [2, 3.5, 2, 4, 3, 5, 4.5],
                borderColor: '#00923F',
                backgroundColor: 'rgba(0, 146, 63, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00923F',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Quizzes Completed',
                data: [1, 2, 1, 2, 1, 3, 2],
                borderColor: '#FCD116',
                backgroundColor: 'rgba(252, 209, 22, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FCD116',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Chart period change
const chartPeriod = document.querySelector('.chart-period');
if (chartPeriod) {
    chartPeriod.addEventListener('change', () => {
        // Update chart data based on period
        const chart = window.progressChartInstance;
        if (!chart) return;
        
        // Simulate different data for different periods
        const dataMap = {
            'This Week': {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data1: [2, 3.5, 2, 4, 3, 5, 4.5],
                data2: [1, 2, 1, 2, 1, 3, 2]
            },
            'This Month': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data1: [12, 15, 18, 22],
                data2: [5, 8, 10, 12]
            },
            'This Year': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data1: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
                data2: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38]
            }
        };
        
        const selected = dataMap[chartPeriod.value];
        chart.data.labels = selected.labels;
        chart.data.datasets[0].data = selected.data1;
        chart.data.datasets[1].data = selected.data2;
        chart.update();
    });
}

// Initialize chart on load
setTimeout(initializeProgressChart, 500);

// ============ PROFILE NAVIGATION ============
const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
const profileForms = document.querySelectorAll('.profile-form');

profileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        profileNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const profileSection = btn.dataset.profile;
        profileForms.forEach(form => form.classList.remove('active'));
        
        const targetForm = document.getElementById(profileSection + 'Form');
        if (targetForm) {
            targetForm.classList.add('active');
        }
    });
});

// ============ PROFILE FORM SUBMISSION ============
document.querySelectorAll('.profile-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;
        
        // Simulate save
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success toast
            showToast('Changes saved successfully!', 'success');
        }, 1500);
    });
});

// ============ CHANGE AVATAR ============
const changeAvatarBtn = document.querySelector('.change-avatar');
const profileAvatar = document.getElementById('profileAvatar');
const sidebarAvatar = document.querySelector('.user-avatar');

if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    if (profileAvatar) profileAvatar.src = imageUrl;
                    if (sidebarAvatar) sidebarAvatar.src = imageUrl;
                    showToast('Profile photo updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    });
}

// ============ BOOKMARK REMOVAL ============
document.querySelectorAll('.remove-bookmark').forEach(btn => {
    btn.addEventListener('click', function() {
        const bookmarkItem = this.closest('.bookmark-item');
        bookmarkItem.style.opacity = '0';
        bookmarkItem.style.transform = 'translateX(50px)';
        bookmarkItem.style.transition = 'all 0.3s';
        
        setTimeout(() => {
            bookmarkItem.remove();
            showToast('Bookmark removed', 'info');
        }, 300);
    });
});

// ============ CONTINUE LEARNING BUTTONS ============
document.querySelectorAll('.btn-small, .btn-primary.btn-small').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.textContent.includes('Continue')) {
            e.preventDefault();
            const courseName = this.closest('.current-course-item, .enrolled-course-card')
                ?.querySelector('h4, h3')?.textContent || 'course';
            
            showToast(`Opening ${courseName}...`, 'info');
            
            // Redirect to course detail
            setTimeout(() => {
                window.location.href = 'course-detail.html';
            }, 1000);
        }
    });
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.dashboard-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `dashboard-toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Add styles dynamically
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#00923F' : '#333'};
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
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add animation keyframes
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

// ============ LOGOUT ============
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            // Clear session
            sessionStorage.removeItem('currentUser');
            
            // Firebase sign out
            // auth.signOut();
            
            showToast('Logging out...', 'info');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    });
}

// ============ RESPONSIVE HANDLING ============
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    // Ctrl + number for page navigation
    if (e.ctrlKey) {
        const pages = ['overview', 'my-courses', 'my-voices', 'certificates', 'bookmarks', 'profile'];
        const num = parseInt(e.key);
        
        if (num >= 1 && num <= pages.length) {
            e.preventDefault();
            const navLink = document.querySelector(`.nav-link[data-page="${pages[num - 1]}"]`);
            if (navLink) navLink.click();
        }
    }
});

console.log('🎓 Student Dashboard loaded successfully!');

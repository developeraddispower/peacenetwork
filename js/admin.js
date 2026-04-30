// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.role !== 'admin') {
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    // Initialize admin
    initializeAdmin(userData);
    initializeCharts();
    initializeDataTables();
});

function initializeAdmin(userData) {
    document.getElementById('adminName').textContent = userData.name || 'Admin';
    
    // Update pending count
    updatePendingCount();
}

// ============ SIDEBAR TOGGLE ============
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const adminSidebar = document.getElementById('adminSidebar');

menuToggle?.addEventListener('click', () => {
    adminSidebar.classList.toggle('open');
});

sidebarClose?.addEventListener('click', () => {
    adminSidebar.classList.remove('open');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!adminSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            adminSidebar.classList.remove('open');
        }
    }
});

// ============ PAGE NAVIGATION ============
const navLinks = document.querySelectorAll('.admin-nav-link[data-page]');
const adminPages = document.querySelectorAll('.admin-page');
const adminPageTitle = document.getElementById('adminPageTitle');

const pageTitles = {
    'overview': 'Dashboard Overview',
    'opinions': 'Opinion Moderation',
    'courses': 'Course Management',
    'users': 'User Management',
    'gallery': 'Gallery Management',
    'news': 'News Management',
    'analytics': 'Platform Analytics',
    'settings': 'Platform Settings'
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page
        const pageName = link.dataset.page;
        adminPages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            adminPageTitle.textContent = pageTitles[pageName];
            
            // Reinitialize charts if needed
            if (pageName === 'analytics') {
                setTimeout(initializeAnalyticsCharts, 300);
            }
        }
        
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
            adminSidebar.classList.remove('open');
        }
    });
});

// ============ NOTIFICATIONS ============
const notifBtn = document.querySelector('.notif-btn');
const notifDropdown = document.querySelector('.notif-dropdown');

notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.style.display = 
        notifDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
    if (notifDropdown && !notifBtn?.contains(e.target)) {
        notifDropdown.style.display = 'none';
    }
});

// ============ CHARTS ============
function initializeCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'New Users',
                    data: [120, 150, 180, 220, 280, 350, 420, 500, 580, 650, 720, 800],
                    borderColor: '#00923F',
                    backgroundColor: 'rgba(0, 146, 63, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00923F',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Active Users',
                    data: [80, 100, 130, 160, 200, 250, 300, 380, 450, 520, 600, 680],
                    borderColor: '#FCD116',
                    backgroundColor: 'rgba(252, 209, 22, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FCD116',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
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
    
    // Opinions Pie Chart
    const opinionsPieCtx = document.getElementById('opinionsPieChart');
    if (opinionsPieCtx) {
        new Chart(opinionsPieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Peace', 'Love', 'Unity', 'Pan-Africanism'],
                datasets: [{
                    data: [1560, 1230, 1450, 990],
                    backgroundColor: [
                        '#00923F',
                        '#CE1126',
                        '#F57C00',
                        '#1565C0'
                    ],
                    borderWidth: 2,
                    borderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function initializeAnalyticsCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx && !trafficCtx.chart) {
        new Chart(trafficCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Page Views',
                    data: [5200, 4800, 6100, 5500, 7200, 3800, 2900],
                    backgroundColor: '#00923F'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Countries Chart
    const countriesCtx = document.getElementById('countriesChart');
    if (countriesCtx && !countriesCtx.chart) {
        new Chart(countriesCtx, {
            type: 'bar',
            data: {
                labels: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia'],
                datasets: [{
                    label: 'Users',
                    data: [4200, 2800, 3500, 3100, 2400],
                    backgroundColor: [
                        '#00923F',
                        '#FCD116',
                        '#CE1126',
                        '#1565C0',
                        '#F57C00'
                    ]
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Chart period change
const chartFilter = document.querySelector('.chart-filter');
chartFilter?.addEventListener('change', (e) => {
    const period = e.target.value;
    showToast(`Chart updated to ${period}`, 'info');
    // In production, fetch new data based on period
});

// ============ DATA TABLES ============
function initializeDataTables() {
    // Initialize DataTables if available
    if (typeof $.fn.DataTable !== 'undefined') {
        $('#opinionsTable').DataTable({
            pageLength: 10,
            order: [[5, 'desc']],
            responsive: true
        });
        
        $('#coursesTable').DataTable({
            pageLength: 10,
            order: [[3, 'desc']],
            responsive: true
        });
        
        $('#usersTable').DataTable({
            pageLength: 10,
            order: [[5, 'desc']],
            responsive: true
        });
    }
}

// ============ OPINION MANAGEMENT ============
const opinionModal = document.getElementById('opinionModal');
const modalClose = document.querySelectorAll('.modal-close');

// View opinion details
document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const author = row.cells[1].textContent;
        const country = row.cells[2].textContent;
        const topic = row.cells[3].textContent;
        const message = row.querySelector('.message-cell').textContent;
        
        document.getElementById('modalAuthor').textContent = author;
        document.getElementById('modalCountry').textContent = country;
        document.getElementById('modalTopic').textContent = topic;
        document.getElementById('modalMessage').textContent = message;
        
        opinionModal.classList.add('show');
    });
});

// Approve opinion
document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const statusCell = row.querySelector('.status');
        
        if (confirm('Approve this opinion?')) {
            statusCell.textContent = 'Approved';
            statusCell.className = 'status approved';
            updatePendingCount();
            showToast('Opinion approved successfully!', 'success');
        }
    });
});

// Reject opinion
document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const statusCell = row.querySelector('.status');
        const feedback = prompt('Reason for rejection (optional):');
        
        if (confirm('Reject this opinion?')) {
            statusCell.textContent = 'Rejected';
            statusCell.className = 'status rejected';
            updatePendingCount();
            showToast('Opinion rejected.', 'info');
        }
    });
});

// Modal approve
document.getElementById('modalApprove')?.addEventListener('click', () => {
    opinionModal.classList.remove('show');
    updatePendingCount();
    showToast('Opinion approved!', 'success');
});

// Modal reject
document.getElementById('modalReject')?.addEventListener('click', () => {
    opinionModal.classList.remove('show');
    updatePendingCount();
    showToast('Opinion rejected.', 'info');
});

// Select all checkboxes
document.getElementById('selectAll')?.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.opinion-check');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

// Bulk approve
document.getElementById('bulkApprove')?.addEventListener('click', () => {
    const checked = document.querySelectorAll('.opinion-check:checked');
    if (checked.length === 0) {
        alert('Please select opinions to approve');
        return;
    }
    
    if (confirm(`Approve ${checked.length} selected opinions?`)) {
        checked.forEach(cb => {
            const row = cb.closest('tr');
            const statusCell = row.querySelector('.status');
            statusCell.textContent = 'Approved';
            statusCell.className = 'status approved';
        });
        updatePendingCount();
        showToast(`${checked.length} opinions approved!`, 'success');
    }
});

// Close modals
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('show');
    });
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Update pending count
function updatePendingCount() {
    const pendingCount = document.querySelectorAll('.status.pending').length;
    const pendingBadge = document.querySelector('.pending-count');
    if (pendingBadge) {
        pendingBadge.textContent = pendingCount;
        pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
}

// ============ COURSE MANAGEMENT ============
const courseModal = document.getElementById('courseModal');
const addCourseBtn = document.getElementById('addCourseBtn');
const courseForm = document.getElementById('courseForm');

// Add course button
addCourseBtn?.addEventListener('click', () => {
    document.getElementById('courseModalTitle').textContent = 'Add New Course';
    courseForm?.reset();
    courseModal.classList.add('show');
});

// Edit course
document.querySelectorAll('#coursesTable .btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        document.getElementById('courseModalTitle').textContent = 'Edit Course';
        // Populate form with row data
        courseModal.classList.add('show');
    });
});

// Delete course
document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        if (confirm('Are you sure you want to delete this item?')) {
            row.style.opacity = '0';
            row.style.transition = 'opacity 0.3s';
            setTimeout(() => row.remove(), 300);
            showToast('Item deleted successfully!', 'success');
        }
    });
});

// Save course
courseForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = courseForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        courseModal.classList.remove('show');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast('Course saved successfully!', 'success');
    }, 1500);
});

// ============ GALLERY UPLOAD ============
const uploadImageBtn = document.getElementById('uploadImageBtn');
const uploadPlaceholder = document.querySelector('.upload-placeholder');

uploadImageBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.addEventListener('change', (e) => {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addGalleryImage(event.target.result);
            };
            reader.readAsDataURL(files[i]);
        }
        showToast(`${files.length} images uploaded!`, 'success');
    });
    
    input.click();
});

uploadPlaceholder?.addEventListener('click', () => {
    uploadImageBtn?.click();
});

function addGalleryImage(src) {
    const galleryGrid = document.querySelector('.gallery-grid');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${src}" alt="Gallery">
        <div class="gallery-overlay">
            <button class="btn-delete"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Insert before upload placeholder
    const placeholder = galleryGrid.querySelector('.upload-placeholder');
    galleryGrid.insertBefore(item, placeholder);
    
    // Add delete functionality
    item.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('Delete this image?')) {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.3s';
            setTimeout(() => item.remove(), 300);
        }
    });
}

// Delete gallery image
document.querySelectorAll('.gallery-overlay .btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = btn.closest('.gallery-item');
        if (confirm('Delete this image?')) {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.3s';
            setTimeout(() => item.remove(), 300);
        }
    });
});

// ============ USER MANAGEMENT ============
const userSearch = document.getElementById('userSearch');
const userRole = document.getElementById('userRole');

userSearch?.addEventListener('input', () => {
    const searchTerm = userSearch.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

userRole?.addEventListener('change', () => {
    const role = userRole.value;
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        if (role === 'all') {
            row.style.display = '';
        } else {
            const userRoleText = row.cells[3].textContent.toLowerCase();
            row.style.display = userRoleText.includes(role) ? '' : 'none';
        }
    });
});

// ============ NEWS MANAGEMENT ============
const addNewsBtn = document.getElementById('addNewsBtn');

addNewsBtn?.addEventListener('click', () => {
    const title = prompt('News article title:');
    if (!title) return;
    
    const content = prompt('News article content:');
    if (!content) return;
    
    addNewsArticle(title, content);
    showToast('News article added!', 'success');
});

function addNewsArticle(title, content) {
    const newsList = document.querySelector('.news-list');
    const article = document.createElement('div');
    article.className = 'news-item';
    article.innerHTML = `
        <div class="news-item-header">
            <h3>${title}</h3>
            <span>Published: ${new Date().toLocaleDateString()}</span>
        </div>
        <p>${content}</p>
        <div class="news-actions">
            <button class="btn btn-small btn-edit">Edit</button>
            <button class="btn btn-small btn-delete">Delete</button>
        </div>
    `;
    
    newsList.insertBefore(article, newsList.firstChild);
    
    // Add event listeners to new buttons
    article.querySelector('.btn-edit').addEventListener('click', () => {
        const newTitle = prompt('Edit title:', title);
        if (newTitle) {
            article.querySelector('h3').textContent = newTitle;
            article.querySelector('span').textContent = 
                `Published: ${new Date().toLocaleDateString()} (edited)`;
        }
    });
    
    article.querySelector('.btn-delete').addEventListener('click', function() {
        if (confirm('Delete this article?')) {
            article.style.opacity = '0';
            article.style.transition = 'opacity 0.3s';
            setTimeout(() => article.remove(), 300);
        }
    });
}

// ============ SETTINGS ============
const settingsForm = document.querySelector('.settings-form');
settingsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
});

// ============ LOGOUT ============
document.getElementById('adminLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentUser');
        showToast('Logging out...', 'info');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.admin-toast');
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
    toast.className = 'admin-toast';
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

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // Ctrl + number for navigation
    if (e.ctrlKey) {
        const pages = ['overview', 'opinions', 'courses', 'users', 'gallery', 'news', 'analytics', 'settings'];
        const num = parseInt(e.key);
        
        if (num >= 1 && num <= pages.length) {
            e.preventDefault();
            const navLink = document.querySelector(`.admin-nav-link[data-page="${pages[num - 1]}"]`);
            if (navLink) navLink.click();
        }
    }
});

// ============ SEARCH FUNCTIONALITY ============
const adminSearch = document.getElementById('adminSearch');
adminSearch?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const currentPage = document.querySelector('.admin-page.active');
    
    if (!currentPage) return;
    
    const table = currentPage.querySelector('table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

console.log('👑 Admin Dashboard loaded successfully!');
console.log('Demo Login: admin@peace.com / Admin123!');

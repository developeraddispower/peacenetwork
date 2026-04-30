// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const searchInput = document.getElementById('searchCourse');
const categoryFilter = document.getElementById('categoryFilter');
const levelFilter = document.getElementById('levelFilter');
const durationFilter = document.getElementById('durationFilter');
const sortCourses = document.getElementById('sortCourses');
const coursesGrid = document.getElementById('coursesGrid');
const loadMoreBtn = document.getElementById('loadMoreCourses');
const activeFilters = document.getElementById('activeFilters');
const previewBtn = document.querySelector('.preview-btn');
const videoModal = document.getElementById('videoModal');
const closeModal = document.querySelector('.close-modal');

// Course data (will be fetched from Firebase)
const allCourses = [
    {
        id: 'peace101',
        title: 'Introduction to Peace Studies',
        category: 'peace',
        level: 'beginner',
        duration: 'short',
        weeks: 4,
        lessons: 12,
        enrolled: 1234,
        rating: 4.5,
        reviews: 1200,
        instructor: 'Dr. Fatima Ouedraogo',
        image: 'assets/images/course-peace101.jpg',
        description: 'Learn the foundations of peacebuilding and conflict analysis.'
    },
    {
        id: 'africanhistory',
        title: 'African Liberation Movements',
        category: 'history',
        level: 'intermediate',
        duration: 'medium',
        weeks: 6,
        lessons: 18,
        enrolled: 890,
        rating: 4.9,
        reviews: 890,
        instructor: 'Prof. John Akol',
        image: 'assets/images/course-africanhistory.jpg',
        description: 'Explore the struggles and triumphs of African independence.'
    },
    {
        id: 'leadership101',
        title: 'Grassroots Community Organizing',
        category: 'leadership',
        level: 'beginner',
        duration: 'medium',
        weeks: 5,
        lessons: 15,
        enrolled: 654,
        rating: 4.2,
        reviews: 654,
        instructor: 'Mama Esther Wanjiru',
        image: 'assets/images/course-leadership.jpg',
        description: 'Develop skills to mobilize communities for positive change.'
    },
    {
        id: 'mediation101',
        title: 'Mediation & Dialogue Facilitation',
        category: 'conflict',
        level: 'intermediate',
        duration: 'medium',
        weeks: 6,
        lessons: 16,
        enrolled: 432,
        rating: 4.6,
        reviews: 432,
        instructor: 'Dr. Emmanuel Diallo',
        image: 'assets/images/course-conflict.jpg',
        description: 'Master the art of mediating conflicts in communities.'
    },
    {
        id: 'africanart',
        title: 'African Art as Resistance',
        category: 'culture',
        level: 'all',
        duration: 'short',
        weeks: 3,
        lessons: 9,
        enrolled: 321,
        rating: 4.8,
        reviews: 321,
        instructor: 'Prof. Aminata Sow',
        image: 'assets/images/course-culture.jpg',
        description: 'Discover how African artists use craft for social change.'
    },
    {
        id: 'africandevelopment',
        title: 'African Solutions for African Development',
        category: 'development',
        level: 'advanced',
        duration: 'long',
        weeks: 8,
        lessons: 20,
        enrolled: 189,
        rating: 4.1,
        reviews: 189,
        instructor: 'Dr. Yaw Boateng',
        image: 'assets/images/course-development.jpg',
        description: 'Explore indigenous approaches to sustainable development.'
    }
];

let currentFilters = {
    search: '',
    category: 'all',
    level: 'all',
    duration: 'all',
    sort: 'popular'
};

// Filter courses
function filterCourses() {
    let filtered = [...allCourses];
    
    // Apply search
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(course => 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.instructor.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(course => course.category === currentFilters.category);
    }
    
    // Apply level filter
    if (currentFilters.level !== 'all') {
        filtered = filtered.filter(course => 
            course.level === currentFilters.level || course.level === 'all'
        );
    }
    
    // Apply duration filter
    if (currentFilters.duration !== 'all') {
        filtered = filtered.filter(course => course.duration === currentFilters.duration);
    }
    
    // Apply sort
    switch(currentFilters.sort) {
        case 'newest':
            filtered.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            filtered.sort((a, b) => b.enrolled - a.enrolled);
    }
    
    displayCourses(filtered);
    updateActiveFilters();
}

// Display courses
function displayCourses(courses) {
    // Keep existing course cards (first 6)
    const existingCards = coursesGrid.querySelectorAll('.course-card');
    
    // Show/hide load more button
    if (courses.length <= 6) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    // For demo, we'll just show/hide existing cards
    existingCards.forEach(card => {
        const category = card.dataset.category;
        const level = card.dataset.level;
        const duration = card.dataset.duration;
        
        let shouldShow = true;
        
        if (currentFilters.category !== 'all' && category !== currentFilters.category) {
            shouldShow = false;
        }
        if (currentFilters.level !== 'all' && level !== currentFilters.level && level !== 'all') {
            shouldShow = false;
        }
        if (currentFilters.duration !== 'all' && duration !== currentFilters.duration) {
            shouldShow = false;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
    
    // Show message if no courses found
    const noResults = coursesGrid.querySelector('.no-results');
    if (courses.length === 0 && !noResults) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search fa-3x"></i>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search terms</p>
        `;
        coursesGrid.appendChild(noResultsDiv);
    } else if (noResults && courses.length > 0) {
        noResults.remove();
    }
}

// Update active filters display
function updateActiveFilters() {
    activeFilters.innerHTML = '';
    
    if (currentFilters.category !== 'all') {
        addFilterTag('Category: ' + categoryFilter.options[categoryFilter.selectedIndex].text, 'category');
    }
    if (currentFilters.level !== 'all') {
        addFilterTag('Level: ' + levelFilter.options[levelFilter.selectedIndex].text, 'level');
    }
    if (currentFilters.duration !== 'all') {
        addFilterTag('Duration: ' + durationFilter.options[durationFilter.selectedIndex].text, 'duration');
    }
}

function addFilterTag(text, filterType) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
    tag.addEventListener('click', () => {
        switch(filterType) {
            case 'category':
                categoryFilter.value = 'all';
                currentFilters.category = 'all';
                break;
            case 'level':
                levelFilter.value = 'all';
                currentFilters.level = 'all';
                break;
            case 'duration':
                durationFilter.value = 'all';
                currentFilters.duration = 'all';
                break;
        }
        filterCourses();
    });
    activeFilters.appendChild(tag);
}

// Event Listeners
searchInput.addEventListener('input', debounce(() => {
    currentFilters.search = searchInput.value;
    filterCourses();
}, 300));

categoryFilter.addEventListener('change', (e) => {
    currentFilters.category = e.target.value;
    filterCourses();
});

levelFilter.addEventListener('change', (e) => {
    currentFilters.level = e.target.value;
    filterCourses();
});

durationFilter.addEventListener('change', (e) => {
    currentFilters.duration = e.target.value;
    filterCourses();
});

sortCourses.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    filterCourses();
});

// Category card click
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        categoryFilter.value = category;
        currentFilters.category = category;
        filterCourses();
        
        // Scroll to courses grid
        document.querySelector('.all-courses').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
});

// Load more courses
loadMoreBtn.addEventListener('click', () => {
    // In real implementation, this would load more courses from Firebase
    alert('Loading more courses...');
    // For demo, show all hidden courses
    document.querySelectorAll('.course-card').forEach(card => {
        card.style.display = 'block';
    });
    loadMoreBtn.style.display = 'none';
});

// Preview video modal
if (previewBtn) {
    previewBtn.addEventListener('click', () => {
        videoModal.classList.add('show');
        // Sample video URL - replace with actual course preview
        const iframe = videoModal.querySelector('iframe');
        iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        videoModal.classList.remove('show');
        const iframe = videoModal.querySelector('iframe');
        iframe.src = '';
    });
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('show');
        const iframe = videoModal.querySelector('iframe');
        iframe.src = '';
    }
});

// Enroll button click handler
document.querySelectorAll('.btn-small, .btn-primary[href*="course-detail"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.includes('login.html')) {
            // Will redirect to login if not authenticated
            console.log('Redirecting to login...');
        }
    });
});

// Debounce utility
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    filterCourses();
    
    console.log('📚 Courses page loaded successfully!');
    console.log(`Total courses available: ${allCourses.length}`);
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const voiceCards = document.querySelectorAll('.voice-card');
const searchInput = document.getElementById('searchVoices');
const sortSelect = document.getElementById('sortVoices');
const voicesGrid = document.getElementById('voicesGrid');
const loadMoreBtn = document.getElementById('loadMoreVoices');
const addVoiceForm = document.getElementById('addVoiceForm');

// Sample voices data (will be replaced with Firebase data)
const sampleVoices = [
    {
        id: 1,
        name: 'Chiamaka Eze',
        country: 'Lagos, Nigeria 🇳🇬',
        topic: 'peace',
        message: 'Peace is the foundation upon which we build our future. Without it, all other achievements are meaningless.',
        likes: 178,
        timestamp: '2024-01-15'
    },
    {
        id: 2,
        name: 'Abdul Rahman',
        country: 'Cairo, Egypt 🇪🇬',
        topic: 'unity',
        message: 'From the pyramids to the great Zimbabwe, our unity tells a story of greatness that spans millennia.',
        likes: 245,
        timestamp: '2024-01-14'
    },
    {
        id: 3,
        name: 'Fatima Toure',
        country: 'Bamako, Mali 🇲🇱',
        topic: 'love',
        message: 'Love is the universal language that transcends borders, tribes, and languages across our beautiful continent.',
        likes: 312,
        timestamp: '2024-01-13'
    },
    {
        id: 4,
        name: 'David Mwangi',
        country: 'Nairobi, Kenya 🇰🇪',
        topic: 'panafricanism',
        message: 'Pan-Africanism is not about erasing our differences but celebrating them while standing united in purpose.',
        likes: 189,
        timestamp: '2024-01-12'
    },
    {
        id: 5,
        name: 'Aisha Mohammed',
        country: 'Addis Ababa, Ethiopia 🇪🇹',
        topic: 'peace',
        message: 'True peace comes from within. When we find peace in our hearts, we can share it with our communities.',
        likes: 267,
        timestamp: '2024-01-11'
    },
    {
        id: 6,
        name: 'Jean-Paul Ndayishimiye',
        country: 'Bujumbura, Burundi 🇧🇮',
        topic: 'unity',
        message: 'A single stick breaks easily, but a bundle of sticks is unbreakable. This is the power of African unity.',
        likes: 156,
        timestamp: '2024-01-10'
    },
    {
        id: 7,
        name: 'Grace Mensah',
        country: 'Accra, Ghana 🇬🇭',
        topic: 'panafricanism',
        message: 'We are the children of Nkrumah, the dreamers of a united Africa. Our time is now to make that dream reality.',
        likes: 423,
        timestamp: '2024-01-09'
    },
    {
        id: 8,
        name: 'Thabo Molefe',
        country: 'Gaborone, Botswana 🇧🇼',
        topic: 'love',
        message: 'Love for our continent is the fuel that drives positive change. Let us love Africa into greatness.',
        likes: 198,
        timestamp: '2024-01-08'
    }
];

let currentFilter = 'all';
let currentSort = 'recent';
let currentPage = 1;
const voicesPerPage = 6;

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPage = 1;
        filterAndSortVoices();
    });
});

// Search functionality
searchInput.addEventListener('input', debounce(() => {
    currentPage = 1;
    filterAndSortVoices();
}, 300));

// Sort functionality
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    filterAndSortVoices();
});

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Filter and sort voices
function filterAndSortVoices() {
    let filteredVoices = [...sampleVoices];
    const searchTerm = searchInput.value.toLowerCase();
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filteredVoices = filteredVoices.filter(voice => voice.topic === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredVoices = filteredVoices.filter(voice => 
            voice.message.toLowerCase().includes(searchTerm) ||
            voice.name.toLowerCase().includes(searchTerm) ||
            voice.country.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sort
    switch(currentSort) {
        case 'popular':
            filteredVoices.sort((a, b) => b.likes - a.likes);
            break;
        case 'oldest':
            filteredVoices.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'recent':
        default:
            filteredVoices.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    displayVoices(filteredVoices);
}

// Display voices
function displayVoices(voices) {
    const start = 0;
    const end = currentPage * voicesPerPage;
    const voicesToShow = voices.slice(start, end);
    
    // Clear existing cards (except first 4 sample cards)
    const existingCards = voicesGrid.querySelectorAll('.voice-card:not([data-category])');
    existingCards.forEach(card => card.remove());
    
    // Show/hide load more button
    if (voices.length <= end) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    // Add new voice cards
    voicesToShow.forEach((voice, index) => {
        const card = createVoiceCard(voice, index);
        voicesGrid.appendChild(card);
        
        // Trigger animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
    
    // Re-initialize like buttons
    initializeLikeButtons();
}

// Create voice card HTML
function createVoiceCard(voice, index) {
    const card = document.createElement('div');
    card.className = 'voice-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const categoryClass = voice.topic;
    const categoryEmoji = {
        peace: '☮️',
        love: '❤️',
        unity: '🤝',
        panafricanism: '🌍'
    };
    
    card.innerHTML = `
        <div class="voice-card-inner">
            <div class="voice-quote-icon">
                <i class="fas fa-quote-right"></i>
            </div>
            <p class="voice-text">"${voice.message}"</p>
            <div class="voice-author">
                <img src="assets/images/avatar${(index % 4) + 1}.jpg" alt="${voice.name}">
                <div class="author-info">
                    <strong>${voice.name}</strong>
                    <span>${voice.country}</span>
                </div>
            </div>
            <div class="voice-meta">
                <span class="category-badge ${categoryClass}">${categoryEmoji[voice.topic]} ${voice.topic.charAt(0).toUpperCase() + voice.topic.slice(1)}</span>
                <button class="like-btn-mini">
                    <i class="far fa-heart"></i> ${voice.likes}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Initialize like buttons
function initializeLikeButtons() {
    document.querySelectorAll('.like-btn-mini, .like-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('liked');
            
            const icon = this.querySelector('i');
            const span = this.querySelector('span') || this;
            let currentLikes = parseInt(this.textContent.trim().match(/\d+/)?.[0] || 0);
            
            if (this.classList.contains('liked')) {
                if (icon) {
                    icon.className = 'fas fa-heart';
                }
                if (span && span !== this) {
                    span.textContent = currentLikes + 1;
                } else {
                    this.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
                }
                
                // Add animation
                this.style.animation = 'none';
                this.offsetHeight;
                this.style.animation = 'pulse 0.3s ease-in-out';
            } else {
                if (icon) {
                    icon.className = 'far fa-heart';
                }
                if (span && span !== this) {
                    span.textContent = currentLikes;
                }
            }
        });
    });
}

// Load more voices
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    filterAndSortVoices();
    
    // Scroll to newly loaded content
    setTimeout(() => {
        const lastCard = voicesGrid.querySelector('.voice-card:last-child');
        if (lastCard) {
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 300);
});

// Add voice form submission
if (addVoiceForm) {
    addVoiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const name = form.querySelector('input[type="text"]').value;
        const country = form.querySelector('select').value;
        const topic = form.querySelector('input[name="topic"]:checked')?.value;
        const message = form.querySelector('textarea').value;
        
        if (!topic) {
            alert('Please select a topic');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;
        
        try {
            // Here you would add to Firebase
            // await addDoc(collection(db, 'opinions'), {
            //     name,
            //     country,
            //     topic,
            //     message,
            //     likes: 0,
            //     timestamp: serverTimestamp(),
            //     status: 'pending'
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            alert('Thank you! Your voice has been added to Our Book. It will appear after review.');
            form.reset();
            form.querySelector('.char-count').textContent = '0/500';
            
        } catch (error) {
            alert('Error adding your voice. Please try again.');
            console.error(error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Character counter
const textarea = document.querySelector('textarea[maxlength]');
const charCount = document.querySelector('.char-count');

if (textarea && charCount) {
    textarea.addEventListener('input', () => {
        const remaining = textarea.value.length;
        charCount.textContent = `${remaining}/${textarea.maxLength}`;
        
        if (remaining > textarea.maxLength * 0.9) {
            charCount.style.color = '#CE1126';
        } else {
            charCount.style.color = '#999';
        }
    });
}

// Share functionality
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (navigator.share) {
            navigator.share({
                title: 'Voices from Pan-African Peace Network',
                text: 'Read inspiring voices of peace and unity from across Africa',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert('Share this page: ' + window.location.href));
        }
    });
});

// Bookmark functionality
document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.innerHTML = '<i class="far fa-bookmark"></i> Save';
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    filterAndSortVoices();
    
    // Voice card hover effect
    voiceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

console.log('📖 Our Book page loaded successfully!');

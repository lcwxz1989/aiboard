document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const resources = [
        {
            id: "1",
            name: "OpenAI",
            url: "https://openai.com",
            description: "OpenAI is an AI research laboratory.",
            category: "website",
            tags: ["AI", "Research", "GPT"],
            addedDate: new Date(),
            imageUrl: "images/default.png"
        },
        {
            id: "2",
            name: "AI News Today",
            url: "https://example.com/ai-news",
            description: "Latest news about artificial intelligence.",
            category: "news",
            tags: ["News", "Updates"],
            addedDate: new Date(),
            imageUrl: "images/default.png"
        },
        {
            id: "3",
            name: "Google AI",
            url: "https://ai.google",
            description: "Google's artificial intelligence research and applications.",
            category: "website",
            tags: ["AI", "Research", "Machine Learning"],
            addedDate: new Date(),
            imageUrl: "images/default.png"
        },
        {
            id: "4",
            name: "MIT Technology Review",
            url: "https://www.technologyreview.com/topic/artificial-intelligence/",
            description: "AI news and insights from MIT Technology Review.",
            category: "news",
            tags: ["News", "Research", "Technology"],
            addedDate: new Date(),
            imageUrl: "images/default.png"
        }
    ];

    // Load resources from localStorage if available
    let storedResources = localStorage.getItem('aiResources');
    if (storedResources) {
        try {
            const parsedResources = JSON.parse(storedResources);
            // Convert string dates back to Date objects
            parsedResources.forEach(resource => {
                resource.addedDate = new Date(resource.addedDate);
            });
            resources.push(...parsedResources);
        } catch (e) {
            console.error('Error parsing stored resources:', e);
        }
    }

    // Function to render resources
    function renderResources() {
        const websitesGrid = document.getElementById('websites-grid');
        const newsGrid = document.getElementById('news-grid');
        
        // Clear existing content
        websitesGrid.innerHTML = '';
        newsGrid.innerHTML = '';
        
        // Filter and render resources
        resources.forEach(resource => {
            const card = createResourceCard(resource);
            
            if (resource.category === 'website') {
                websitesGrid.appendChild(card);
            } else if (resource.category === 'news') {
                newsGrid.appendChild(card);
            }
        });
    }
    
    // Function to create a resource card
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.setAttribute('data-tags', resource.tags.join(' ').toLowerCase());
        
        const tagsHtml = resource.tags.map(tag => 
            `<span class="tag" onclick="searchByTag('${tag}')">${tag}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="resource-image">
                <img src="${resource.imageUrl}" alt="${resource.name}" onerror="this.src='images/default.png'">
            </div>
            <div class="resource-content">
                <h3>${resource.name}</h3>
                <p>${resource.description}</p>
                <div class="resource-tags">
                    ${tagsHtml}
                </div>
                <a href="${resource.url}" target="_blank" class="visit-button">
                    ${resource.category === 'website' ? 'Visit Site' : 'Read More'}
                </a>
            </div>
        `;
        
        return card;
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const resourceCards = document.querySelectorAll('.resource-card');
        
        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                tags.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Make searchByTag available globally
    window.searchByTag = function(tag) {
        searchInput.value = tag;
        performSearch();
    };
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Form submission for adding new resources
    const resourceForm = document.getElementById('resource-form');
        // Form submission for adding new resources
    
    resourceForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Create a new resource object from form data
        const newResource = {
            id: Date.now().toString(),
            name: document.getElementById('name').value,
            url: document.getElementById('url').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            addedDate: new Date(),
            imageUrl: document.getElementById('imageUrl').value || 'images/default.png'
        };
        
        // Add the new resource to the array
        resources.push(newResource);
        
        // Save to localStorage
        saveResources();
        
        // Re-render the resources
        renderResources();
        
        // Reset the form
        resourceForm.reset();
        
        // Show success message
        alert('Resource added successfully!');
    });
    
    // Function to save resources to localStorage
    function saveResources() {
        // Only save user-added resources (not the initial sample data)
        const userResources = resources.slice(4);
        localStorage.setItem('aiResources', JSON.stringify(userResources));
    }
    
    // Initialize the page
    renderResources();
    
    // Add some popular AI websites as quick links
    const popularSites = [
        { name: "ChatGPT", url: "https://chat.openai.com" },
        { name: "Bard", url: "https://bard.google.com" },
        { name: "Hugging Face", url: "https://huggingface.co" },
        { name: "Midjourney", url: "https://www.midjourney.com" }
    ];
    
    // You could add a section for quick links if desired
    // This is optional and can be implemented later
    });
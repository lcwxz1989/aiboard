document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
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
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Form submission for adding new resources
    const resourceForm = document.getElementById('resource-form');
    
    resourceForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            url: document.getElementById('url').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            imageUrl: document.getElementById('imageUrl').value || '/static/images/default.png'
        };
        
        // Send the data to the server
        fetch('/api/resources/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Resource added successfully!');
            resourceForm.reset();
            // Reload the page to show the new resource
            window.location.reload();
        })
        .catch(error => {
            console.error('Error adding resource:', error);
            alert('Error adding resource. Please try again.');
        });
    });
    
    // Add filter functionality by tags
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.toLowerCase();
            searchInput.value = tagText;
            performSearch();
        });
    });
});
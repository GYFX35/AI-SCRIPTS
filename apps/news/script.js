document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentCategory = 'all';

    // Mock data for tech news
    const mockNews = [
        {
            title: "Microsoft Announces New Surface Devices",
            description: "The latest Surface laptops and tablets feature improved performance and AI capabilities.",
            category: "microsoft",
            tag: "Microsoft",
            image: "https://images.unsplash.com/photo-1588702547919-26089e690cee?w=400&h=250&fit=crop",
            link: "https://www.microsoft.com"
        },
        {
            title: "iOS 18: Everything You Need to Know",
            description: "Apple's next mobile OS update brings massive customization options and new AI features.",
            category: "ios",
            tag: "iOS",
            image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=250&fit=crop",
            link: "https://www.apple.com/ios"
        },
        {
            title: "Android 15 Beta 2 is Now Available",
            description: "Google releases the second beta of Android 15, focusing on security and performance.",
            category: "android",
            tag: "Android",
            image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=250&fit=crop",
            link: "https://www.android.com"
        },
        {
            title: "Microsoft Copilot Integration in Windows",
            description: "Windows users can now access advanced AI features directly from their desktop.",
            category: "microsoft",
            tag: "Microsoft",
            image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=250&fit=crop",
            link: "https://www.microsoft.com/copilot"
        },
        {
            title: "New iPhone Features Leaked",
            description: "Rumors suggest the next iPhone will have a significantly improved camera system.",
            category: "ios",
            tag: "iOS",
            image: "https://images.unsplash.com/photo-1556656793-062ff98782ee?w=400&h=250&fit=crop",
            link: "https://www.apple.com/iphone"
        },
        {
            title: "Google Pixel 9 Pro Fold Impressions",
            description: "Google's latest foldable phone sets a new standard for Android hardware.",
            category: "android",
            tag: "Android",
            image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=250&fit=crop",
            link: "https://store.google.com/product/pixel_9_pro"
        }
    ];

    function displayNews(category) {
        newsContainer.innerHTML = '';
        const filteredNews = category === 'all'
            ? mockNews
            : mockNews.filter(item => item.category === category);

        if (filteredNews.length === 0) {
            newsContainer.innerHTML = '<div class="loading">No news found for this category.</div>';
            return;
        }

        filteredNews.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="news-content">
                    <span class="news-tag">${item.tag}</span>
                    <h2 class="news-title">${item.title}</h2>
                    <p class="news-description">${item.description}</p>
                    <a href="${item.link}" class="news-link" target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
            `;
            newsContainer.appendChild(card);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            displayNews(currentCategory);
        });
    });

    // Initial display
    setTimeout(() => {
        displayNews('all');
    }, 500); // Simulate network delay
});

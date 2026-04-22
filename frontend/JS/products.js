// Check login
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Show welcome message
const userName = localStorage.getItem('name');
if (userName) {
    const el = document.getElementById('welcomeUser');
    if (el) el.textContent = 'Hi, ' + userName + '!';
    const banner = document.getElementById('welcomeBanner');
    if (banner) banner.textContent = userName + '!';
}

// Load categories
async function loadCategories() {
    try {
        const categories = await apiCall('/categories');
        const filter = document.getElementById('categoryFilter');

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'cat-chip';
            btn.textContent = cat.name;
            btn.onclick = () => loadByCategory(cat.id, btn);
            filter.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading categories', error);
    }
}

// Load all products
async function loadProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = getSkeletonHTML();

    document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
    const allBtn = document.getElementById('allBtn');
    if (allBtn) allBtn.classList.add('active');

    const title = document.getElementById('sectionTitle');
    if (title) title.textContent = 'All Products';

    try {
        const data = await apiCall('/products?page=0&size=50');
        renderProducts(data.content || data);
    } catch (error) {
        container.innerHTML = '<div class="error-state">😕 Failed to load products. Please try again.</div>';
    }
}

// Load by category
async function loadByCategory(categoryId, btn) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = getSkeletonHTML();

    document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const title = document.getElementById('sectionTitle');
    if (title) title.textContent = btn.textContent;

    try {
        const products = await apiCall('/products/category/' + categoryId);
        renderProducts(products);
    } catch (error) {
        container.innerHTML = '<div class="error-state">😕 Failed to load products.</div>';
    }
}

// Search — desktop
async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    runSearch(query);
}

// Search — mobile
async function searchProductsMobile() {
    const query = document.getElementById('searchInputMobile').value.trim();
    // Sync both inputs
    document.getElementById('searchInput').value = query;
    runSearch(query);
}

// Search on Enter key — desktop
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchProducts();
});

// Search on Enter key — mobile
document.getElementById('searchInputMobile').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchProductsMobile();
});

// Core search function — FIXED
async function runSearch(query) {
    if (!query) {
        loadProducts();
        return;
    }

    const container = document.getElementById('productsContainer');
    container.innerHTML = getSkeletonHTML();

    const title = document.getElementById('sectionTitle');
    if (title) title.textContent = 'Results for "' + query + '"';

    // Reset category buttons
    document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));

    try {
        // Use encodeURIComponent to handle spaces and special chars
        const products = await apiCall('/products/search?name=' + encodeURIComponent(query));
        renderProducts(products);
    } catch (error) {
        container.innerHTML = '<div class="error-state">😕 Search failed. Please try again.</div>';
    }
}

// Product image mapping
function getProductImage(name, imageUrl) {
    if (imageUrl && imageUrl !== 'null' && imageUrl !== '') return imageUrl;

    const images = {
        'iPhone 15':            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'Dell Inspiron 15':     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        "Men's Cotton T-Shirt": 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'Running Shoes':        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'The Alchemist':        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
        'Java Programming':     'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop'
    };

    return images[name] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop';
}

// Fake discount for display (Flipkart style)
function getDiscount(price) {
    const discounts = [10, 15, 20, 25, 30, 35, 40];
    // deterministic based on price
    const idx = Math.floor(price / 1000) % discounts.length;
    return discounts[idx];
}

function getOriginalPrice(price) {
    const disc = getDiscount(price);
    return Math.round(price / (1 - disc / 100));
}

function getStars(price) {
    const ratings = [3.8, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7];
    return ratings[Math.floor(price / 5000) % ratings.length];
}

function getReviewCount(price) {
    const base = Math.floor(price / 100);
    return (base * 7 + 132).toLocaleString();
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '★';
    if (half) html += '½';
    return html;
}

// Render products — Flipkart style
function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    const countEl = document.getElementById('productCount');

    if (!products || products.length === 0) {
        if (countEl) countEl.textContent = '';
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛍️</div>
                <p>No products found!</p>
                <button onclick="loadProducts()" class="btn-back">Browse All Products</button>
            </div>`;
        return;
    }

    if (countEl) countEl.textContent = products.length + ' items';

    container.innerHTML = '<div class="products-grid">' +
        products.map(p => {
            const disc = getDiscount(p.price);
            const original = getOriginalPrice(p.price);
            const stars = getStars(p.price);
            const reviews = getReviewCount(p.price);
            const imgUrl = getProductImage(p.name, p.imageUrl);

            return `
            <div class="product-card" onclick="openProduct(${p.id})">
                <div class="product-img-wrap">
                    <img src="${imgUrl}"
                        alt="${p.name}"
                        onerror="this.src='https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop'"
                    />
                    <span class="discount-badge">${disc}% off</span>
                    ${p.stockQuantity < 5 ? '<span class="low-stock">Only ' + p.stockQuantity + ' left!</span>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-category">${p.category ? p.category.name : ''}</div>
                    <div class="rating-row">
                        <span class="stars">${renderStars(stars)}</span>
                        <span class="rating-val">${stars}</span>
                        <span class="review-count">(${reviews})</span>
                    </div>
                    <div class="price-row">
                        <span class="price">₹${p.price.toLocaleString()}</span>
                        <span class="original-price">₹${original.toLocaleString()}</span>
                        <span class="disc-text">${disc}% off</span>
                    </div>
                    <div class="free-delivery">✅ Free Delivery</div>
                    <div class="card-actions" onclick="event.stopPropagation()">
                        <button class="btn-add-cart" onclick="addToCart(${p.id}, '${p.name}')">
                            🛒 Add to Cart
                        </button>
                        <button class="btn-buy-now" onclick="buyNow(${p.id}, '${p.name}', ${p.price})">
                            ⚡ Buy Now
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('') +
        '</div>';
}

// Open product detail (future use)
function openProduct(id) {
    // placeholder for product detail page
}

// Add to cart
async function addToCart(productId, productName) {
    try {
        await apiCall('/cart/add', 'POST', { productId, quantity: 1 }, true);
        showToast('🛒 ' + productName + ' added to cart!');
        updateCartCount();
    } catch (error) {
        showToast('❌ Failed to add to cart!');
    }
}

// Buy Now — add to cart then go to cart page
async function buyNow(productId, productName, price) {
    try {
        showToast('⚡ Adding ' + productName + '...');
        await apiCall('/cart/add', 'POST', { productId, quantity: 1 }, true);
        // Small delay so user sees toast, then redirect
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 800);
    } catch (error) {
        showToast('❌ Failed. Please try again!');
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const cart = await apiCall('/cart', 'GET', null, true);
        const count = cart.items ? cart.items.length : 0;
        const el = document.getElementById('cartCount');
        if (el) el.textContent = count;
    } catch (error) {
        console.error('Cart count error');
    }
}

// Skeleton loader HTML
function getSkeletonHTML() {
    return `<div class="loading-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    </div>`;
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Initialize
loadCategories();
loadProducts();
updateCartCount();
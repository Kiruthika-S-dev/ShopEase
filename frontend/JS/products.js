// Check login
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Show welcome message
const name = localStorage.getItem('name');
if (name) {
    document.getElementById('welcomeUser')
        .textContent = 'Hi, ' + name + '!';
}

// Load categories
async function loadCategories() {
    try {
        const categories = await apiCall(
            '/categories');
        const filter = document.getElementById(
            'categoryFilter');

        categories.forEach(cat => {
            const btn = document.createElement(
                'button');
            btn.className = 'category-btn';
            btn.textContent = cat.name;
            btn.onclick = () =>
                loadByCategory(cat.id, btn);
            filter.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading categories');
    }
}

// Load all products
async function loadProducts() {
    const container = document.getElementById(
        'productsContainer');
    container.innerHTML =
        '<div class="loading">Loading products...</div>';

    // Reset active button
    document.querySelectorAll('.category-btn')
        .forEach(b => b.classList.remove('active'));
    document.getElementById('allBtn')
        .classList.add('active');

    try {
        const data = await apiCall(
            '/products?page=0&size=20');
        renderProducts(data.content);
    } catch (error) {
        container.innerHTML =
            '<div class="loading">Failed to load products.</div>';
    }
}

// Load by category
async function loadByCategory(categoryId, btn) {
    const container = document.getElementById(
        'productsContainer');
    container.innerHTML =
        '<div class="loading">Loading...</div>';

    document.querySelectorAll('.category-btn')
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    try {
        const products = await apiCall(
            '/products/category/' + categoryId);
        renderProducts(products);
    } catch (error) {
        container.innerHTML =
            '<div class="loading">Failed to load.</div>';
    }
}

// Search products
async function searchProducts() {
    const query = document.getElementById(
        'searchInput').value.trim();
    if (!query) {
        loadProducts();
        return;
    }

    const container = document.getElementById(
        'productsContainer');
    container.innerHTML =
        '<div class="loading">Searching...</div>';

    try {
        const products = await apiCall(
            '/products/search?name=' + query);
        renderProducts(products);
    } catch (error) {
        container.innerHTML =
            '<div class="loading">Search failed.</div>';
    }
}

// Search on Enter key
document.getElementById('searchInput')
    .addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });

// Real product images map
function getProductImage(name, imageUrl) {
    if (imageUrl && imageUrl !== 'null' && imageUrl !== '') return imageUrl;
    
    const images = {
        'iPhone 15':            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center',
        'Dell Inspiron 15':     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
        "Men's Cotton T-Shirt": 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
        'Running Shoes':        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
        'The Alchemist':        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=center',
        'Java Programming':     'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop&crop=center'
    };
    
    return images[name] ||
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&crop=center';
}

// Render products
function renderProducts(products) {
    const container = document.getElementById('productsContainer');

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🛍️</div>
                <p>No products found!</p>
            </div>`;
        return;
    }

    container.innerHTML =
        '<div class="products-grid">' +
        products.map((p) => `
            <div class="product-card">
                <div class="product-img" style="padding:0; overflow:hidden; height:200px;">
                    <img src="${getProductImage(p.name, p.imageUrl)}"
                        alt="${p.name}"
                        style="width:100%; height:100%;
                        object-fit:cover;
                        border-radius:12px 12px 0 0;"
                        onerror="this.parentElement.innerHTML='🛍️'"
                    />
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-category">
                        ${p.category ? p.category.name : ''}
                    </div>
                    <div class="product-price">
                        ₹${p.price.toLocaleString()}
                    </div>
                    <div style="font-size:12px; color:#888; margin-bottom:10px">
                        Stock: ${p.stockQuantity}
                    </div>
                    <button class="btn-add-cart"
                        onclick="addToCart(${p.id}, '${p.name}')">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>`
        ).join('') +
        '</div>';
}

// Add to cart
async function addToCart(productId, productName) {
    try {
        await apiCall('/cart/add', 'POST',
            { productId, quantity: 1 }, true);
        showToast(
            productName + ' added to cart! 🛒');
        updateCartCount();
    } catch (error) {
        showToast('Failed to add to cart!');
    }
}

// Update cart count in navbar
async function updateCartCount() {
    try {
        const cart = await apiCall(
            '/cart', 'GET', null, true);
        const count = cart.items ?
            cart.items.length : 0;
        document.getElementById('cartCount')
            .textContent = count;
    } catch (error) {
        console.error('Cart count error');
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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
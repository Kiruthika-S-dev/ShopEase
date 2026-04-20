// Check login
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Load orders
async function loadOrders() {
    const container =
        document.getElementById('ordersContent');

    try {
        const orders = await apiCall(
            '/orders/my-orders',
            'GET', null, true);

        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📋</div>
                    <p>No orders yet!</p>
                    <a href="index.html">
                        <button class="btn-primary"
                            style="width:auto;
                            padding:12px 30px">
                            Start Shopping
                        </button>
                    </a>
                </div>`;
            return;
        }

        container.innerHTML = orders
            .reverse()
            .map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">
                            Order #${order.id}
                        </div>
                        <div style="font-size:13px;
                            color:#888; margin-top:4px">
                            ${new Date(order.createdAt)
                                .toLocaleDateString(
                                'en-IN', {
                                day:'numeric',
                                month:'long',
                                year:'numeric'})}
                        </div>
                    </div>
                    <span class="order-status
                        status-${order.status}">
                        ${getStatusEmoji(order.status)}
                        ${order.status}
                    </span>
                </div>

                <div>
                    ${order.items.map(item => `
                    <div class="order-item-row">
                        <span>
                            ${item.product.name}
                            × ${item.quantity}
                        </span>
                        <span>
                            ₹${(item.priceAtTime *
                                item.quantity)
                                .toLocaleString()}
                        </span>
                    </div>`).join('')}
                </div>

                <div class="order-footer">
                    <div style="font-size:13px;
                        color:#888">
                        📍 ${order.shippingAddress}
                    </div>
                    <div class="order-total">
                        ₹${order.totalAmount
                            .toLocaleString()}
                    </div>
                </div>
            </div>`).join('');

    } catch (error) {
        container.innerHTML =
            '<div class="loading">Failed to load orders.</div>';
    }
}

// Status emoji
function getStatusEmoji(status) {
    const emojis = {
        PENDING: '⏳',
        CONFIRMED: '✅',
        SHIPPED: '🚚',
        DELIVERED: '🎉',
        CANCELLED: '❌'
    };
    return emojis[status] || '📦';
}

// Toast
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
loadOrders();
// Check login
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// ✅ FIX 1: cartTotal is global so placeOrder() can access it
let cartTotal = 0;

// Load cart
async function loadCart() {
    const container = document.getElementById('cartContent');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert('Session expired! Please login again.');
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        const cartData = await response.json();

        if (!cartData.items || cartData.items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🛒</div>
                    <p>Your cart is empty!</p>
                    <a href="index.html">
                        <button class="btn-primary" style="width:auto; padding:12px 30px">
                            Continue Shopping
                        </button>
                    </a>
                </div>`;
            return;
        }

        // ✅ FIX 2: calculate and store total globally
        cartTotal = 0;
        cartData.items.forEach(item => {
            cartTotal += item.priceAtTime * item.quantity;
        });

        renderCart(cartData);

    } catch (error) {
        container.innerHTML = `<div class="loading">Error: ${error.message}</div>`;
    }
}

// Render cart
function renderCart(cart) {
    const container = document.getElementById('cartContent');

    const emojis = ['📱','💻','👕','👟','🏠','📚','🎮','⌚','📷','🎧'];

    container.innerHTML = `
        ${cart.items.map((item, i) => `
        <div class="cart-item" id="item-${item.id}">
            <div class="cart-item-img">${emojis[i % emojis.length]}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">₹${item.priceAtTime.toLocaleString()}</div>
            </div>
            <div class="qty-control">
                <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity - 1})">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div style="font-weight:bold; color:#1a1a2e; min-width:80px; text-align:right">
                ₹${(item.priceAtTime * item.quantity).toLocaleString()}
            </div>
            <button class="btn-remove" onclick="removeItem(${item.id})">🗑️ Remove</button>
        </div>`).join('')}

        <div class="cart-summary">
            <div class="cart-total">
                Total: <span>₹${cartTotal.toLocaleString()}</span>
            </div>

            <!-- ✅ FIX 3: Added shipping address input -->
            <div style="margin: 15px 0;">
                <input type="text" id="shippingAddress"
                    placeholder="Enter your shipping address"
                    style="width:100%; padding:12px; border:1px solid #ddd;
                    border-radius:8px; font-size:14px; box-sizing:border-box;" />
            </div>

            <div style="display:flex; gap:10px; flex-wrap:wrap">
                <button class="btn-primary"
                    style="width:auto; padding:12px 30px"
                    onclick="placeOrder()">
                    ✅ Place Order
                </button>
                <button onclick="clearCart()"
                    style="padding:12px 20px; background:#e74c3c;
                    color:white; border:none; border-radius:8px; cursor:pointer">
                    🗑️ Clear Cart
                </button>
            </div>
        </div>`;
}

// Update quantity
async function updateQty(itemId, newQty) {
    if (newQty < 1) {
        removeItem(itemId);
        return;
    }
    try {
        await apiCall('/cart/update/' + itemId + '?quantity=' + newQty, 'PUT', null, true);
        loadCart();
    } catch (error) {
        showToast('Failed to update quantity!');
    }
}

// Remove item
async function removeItem(itemId) {
    try {
        await apiCall('/cart/remove/' + itemId, 'DELETE', null, true);
        showToast('Item removed from cart!');
        loadCart();
    } catch (error) {
        showToast('Failed to remove item!');
    }
}

// Clear cart
async function clearCart() {
    if (!confirm('Are you sure you want to clear cart?')) return;
    try {
        await apiCall('/cart/clear', 'DELETE', null, true);
        showToast('Cart cleared!');
        loadCart();
    } catch (error) {
        showToast('Failed to clear cart!');
    }
}

// Place order
async function placeOrder() {
    const addressInput = document.getElementById('shippingAddress');
    if (!addressInput) {
        showToast('❌ Address input not found');
        return;
    }

    const address = addressInput.value.trim();
    if (!address) {
        showToast('Please enter shipping address');
        return;
    }

    if (!cartTotal || cartTotal <= 0) {
        showToast('❌ Cart total is missing');
        return;
    }

    const token = localStorage.getItem('token');

    try {
        // Step 1: Create Razorpay order
        const res = await fetch('http://localhost:8080/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ amount: Math.round(cartTotal) })
        });

        const orderData = await res.json();
        console.log('Razorpay order:', orderData);

        if (!orderData.orderId) {
            showToast('❌ Failed to create payment order. Check backend.');
            return;
        }

        // Step 2: Open Razorpay modal
        const options = {
            key: orderData.keyId,
            // ✅ FIX 4: amount must be in paise (×100)
            amount: Math.round(cartTotal) * 100,
            currency: 'INR',
            name: 'ShopEase',
            description: 'Order Payment',
            order_id: orderData.orderId,

            handler: async function (response) {
                // Step 3: Verify payment
                const verifyRes = await fetch('http://localhost:8080/api/payment/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        razorpay_order_id:  response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature:  response.razorpay_signature
                    })
                });

                const verifyData = await verifyRes.json();
                console.log('Verify result:', verifyData);

                if (verifyData.status === 'success') {
                    // Step 4: Place ShopEase order
                    const orderRes = await fetch(
                        `http://localhost:8080/api/orders/place?shippingAddress=${encodeURIComponent(address)}`,
                        {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + token }
                        }
                    );
                    const orderResult = await orderRes.json();
                    console.log('Order placed:', orderResult);

                    showToast('✅ Order placed successfully!');
                    setTimeout(() => window.location.href = 'orders.html', 1500);
                } else {
                    showToast('❌ Payment verification failed. Try again.');
                }
            },

            prefill: {
                name: localStorage.getItem('username') || 'Customer',
                email: '',
                contact: ''
            },
            theme: { color: '#f59e0b' },
            modal: {
                ondismiss: function () {
                    showToast('Payment cancelled');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error('Payment error:', err);
        showToast('❌ Something went wrong. Check console (F12).');
    }
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
loadCart();
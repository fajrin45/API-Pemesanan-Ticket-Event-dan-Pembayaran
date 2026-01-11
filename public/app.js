// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// State Management
let currentUser = null;
let authToken = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    setupRouting();
});

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateNavForAuth();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }

    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketSubmit);
    }

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
        const quantityInput = document.getElementById('orderQuantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', calculateOrderTotal);
        }
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }

    // Modals
    setupModalListeners();

    // Search and Filters
    const eventSearch = document.getElementById('eventSearch');
    if (eventSearch) {
        eventSearch.addEventListener('input', debounce(loadEvents, 500));
    }

    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', loadEvents);
    }

    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', loadOrders);
    }

    // Back Buttons
    const backToEvents = document.getElementById('backToEvents');
    if (backToEvents) {
        backToEvents.addEventListener('click', () => navigateTo('events'));
    }

    const backToOrders = document.getElementById('backToOrders');
    if (backToOrders) {
        backToOrders.addEventListener('click', () => navigateTo('orders'));
    }

    const backToPayments = document.getElementById('backToPayments');
    if (backToPayments) {
        backToPayments.addEventListener('click', () => navigateTo('payments'));
    }

    const paymentStatusFilter = document.getElementById('paymentStatusFilter');
    if (paymentStatusFilter) {
        paymentStatusFilter.addEventListener('change', loadPayments);
    }

    // Create Event Button
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', () => openEventModal());
    }
}

// Setup Modal Listeners
function setupModalListeners() {
    const modals = ['eventModal', 'ticketModal', 'orderModal', 'paymentModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(`close${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modalId));
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modalId);
                }
            });
        }
    });

    const cancelBtns = ['cancelEventBtn', 'cancelTicketBtn', 'cancelOrderBtn', 'cancelPaymentBtn'];
    cancelBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                const modalId = btnId.replace('cancel', '').replace('Btn', '') + 'Modal';
                closeModal(modalId);
            });
        }
    });
}

// Routing
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
    });

    // Show target page
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        
        // Load page data
        switch(page) {
            case 'events':
                loadEvents();
                break;
            case 'orders':
                if (authToken) loadOrders();
                break;
            case 'payments':
                if (authToken) loadPayments();
                break;
            case 'profile':
                if (authToken) loadProfile();
                break;
        }
    }

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}

function setupRouting() {
    // Default to home page
    navigateTo('home');
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const alert = document.getElementById('loginAlert');

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            updateNavForAuth();
            showAlert(alert, 'Login berhasil!', 'success');
            setTimeout(() => {
                navigateTo('events');
            }, 1000);
        } else {
            showAlert(alert, data.message || 'Login gagal', 'error');
        }
    } catch (error) {
        showAlert(alert, 'Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const alert = document.getElementById('registerAlert');

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(alert, 'Registrasi berhasil! Silakan login.', 'success');
            setTimeout(() => {
                navigateTo('login');
            }, 1500);
        } else {
            const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
            showAlert(alert, errorMsg || 'Registrasi gagal', 'error');
        }
    } catch (error) {
        showAlert(alert, 'Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

function handleLogout() {
    if (authToken) {
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        }).catch(() => {});
    }

    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    updateNavForAuth();
    navigateTo('home');
}

function updateNavForAuth() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const ordersLink = document.getElementById('ordersLink');
    const paymentsLink = document.getElementById('paymentsLink');
    const profileLink = document.getElementById('profileLink');
    const userName = document.getElementById('userName');
    const createEventBtn = document.getElementById('createEventBtn');

    if (currentUser) {
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) navUser.style.display = 'flex';
        if (ordersLink) ordersLink.style.display = 'block';
        if (paymentsLink) paymentsLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'block';
        if (userName) userName.textContent = currentUser.name;
        if (createEventBtn && currentUser.role === 'admin') {
            createEventBtn.style.display = 'block';
        }
    } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
        if (ordersLink) ordersLink.style.display = 'none';
        if (paymentsLink) paymentsLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (createEventBtn) createEventBtn.style.display = 'none';
    }
}

// Events
async function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">Memuat event...</div>';

    try {
        const search = document.getElementById('eventSearch')?.value || '';
        const location = document.getElementById('locationFilter')?.value || '';
        
        let url = `${API_BASE_URL}/events?sort=asc`;
        if (location) url += `&lokasi=${location}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            const events = data.data.data || [];
            
            if (events.length === 0) {
                grid.innerHTML = '<div class="loading">Tidak ada event tersedia</div>';
                return;
            }

            // Filter by search
            const filteredEvents = search 
                ? events.filter(e => 
                    e.nama_event.toLowerCase().includes(search.toLowerCase()) ||
                    e.lokasi.toLowerCase().includes(search.toLowerCase())
                  )
                : events;

            // Load locations for filter
            loadLocations(events);

            grid.innerHTML = filteredEvents.map(event => `
                <div class="event-card" onclick="viewEventDetail(${event.id})">
                    <div class="event-image">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="event-content">
                        <h3 class="event-title">${event.nama_event}</h3>
                        <div class="event-meta">
                            <div><i class="fas fa-map-marker-alt"></i> ${event.lokasi}</div>
                            <div><i class="fas fa-calendar"></i> ${formatDate(event.tanggal_event)}</div>
                        </div>
                        <p class="event-description">${event.deskripsi}</p>
                        <div class="event-actions">
                            <button class="btn btn-primary" onclick="event.stopPropagation(); viewEventDetail(${event.id})">
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<div class="loading">Gagal memuat event</div>';
        }
    } catch (error) {
        grid.innerHTML = '<div class="loading">Terjadi kesalahan saat memuat event</div>';
    }
}

function loadLocations(events) {
    const locationFilter = document.getElementById('locationFilter');
    if (!locationFilter) return;

    const locations = [...new Set(events.map(e => e.lokasi))];
    const currentValue = locationFilter.value;
    
    locationFilter.innerHTML = '<option value="">Semua Lokasi</option>' +
        locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
    
    locationFilter.value = currentValue;
}

async function viewEventDetail(eventId) {
    navigateTo('eventDetail');
    const content = document.getElementById('eventDetailContent');
    if (!content) return;

    content.innerHTML = '<div class="loading">Memuat detail event...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            const event = data.data;
            const tickets = event.tikets || [];

            content.innerHTML = `
                <div class="event-detail">
                    <div class="event-detail-header">
                        <h1 class="event-detail-title">${event.nama_event}</h1>
                        <div class="event-detail-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.lokasi}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${formatDate(event.tanggal_event)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-description-full">
                        ${event.deskripsi}
                    </div>
                    <div class="tickets-section">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3>Tiket Tersedia</h3>
                            ${currentUser && currentUser.role === 'admin' ? `
                                <button class="btn btn-primary" onclick="openTicketModal(${event.id})">
                                    <i class="fas fa-plus"></i> Tambah Tiket
                                </button>
                            ` : ''}
                        </div>
                        ${tickets.length > 0 ? `
                            <div class="tickets-list">
                                ${tickets.map(ticket => {
                                    const sisaKuota = ticket.kuota - ticket.terjual;
                                    return `
                                        <div class="ticket-card">
                                            <div class="ticket-info">
                                                <div class="ticket-type">${ticket.jenis_tiket}</div>
                                                <div class="ticket-details">
                                                    <span><i class="fas fa-ticket-alt"></i> Sisa: ${sisaKuota}</span>
                                                    <span><i class="fas fa-users"></i> Terjual: ${ticket.terjual}</span>
                                                </div>
                                            </div>
                                            <div class="ticket-price">Rp ${formatCurrency(ticket.harga)}</div>
                                            <div class="ticket-actions">
                                                ${sisaKuota > 0 && authToken ? `
                                                    <button class="btn btn-primary" onclick="openOrderModal(${ticket.id}, '${ticket.jenis_tiket}', ${ticket.harga}, ${sisaKuota})">
                                                        Pesan
                                                    </button>
                                                ` : sisaKuota === 0 ? `
                                                    <button class="btn btn-outline" disabled>Habis</button>
                                                ` : `
                                                    <button class="btn btn-outline" onclick="navigateTo('login')">Login untuk Pesan</button>
                                                `}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : '<p>Tidak ada tiket tersedia untuk event ini.</p>'}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        content.innerHTML = '<div class="loading">Gagal memuat detail event</div>';
    }
}

// Event Management
function openEventModal(eventId = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const title = document.getElementById('modalTitle');
    
    if (eventId) {
        title.textContent = 'Edit Event';
        loadEventForEdit(eventId);
    } else {
        title.textContent = 'Buat Event Baru';
        form.reset();
        document.getElementById('eventId').value = '';
    }
    
    modal.style.display = 'flex';
}

async function loadEventForEdit(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        if (data.success) {
            const event = data.data;
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventName').value = event.nama_event;
            document.getElementById('eventDescription').value = event.deskripsi;
            document.getElementById('eventLocation').value = event.lokasi;
            
            // Format date for datetime-local input
            const date = new Date(event.tanggal_event);
            const formattedDate = date.toISOString().slice(0, 16);
            document.getElementById('eventDate').value = formattedDate;
        }
    } catch (error) {
        alert('Gagal memuat data event');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('eventId').value;
    const eventData = {
        nama_event: document.getElementById('eventName').value,
        deskripsi: document.getElementById('eventDescription').value,
        tanggal_event: document.getElementById('eventDate').value,
        lokasi: document.getElementById('eventLocation').value
    };

    try {
        const url = eventId 
            ? `${API_BASE_URL}/events/${eventId}`
            : `${API_BASE_URL}/events`;
        
        const method = eventId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (data.success) {
            closeModal('eventModal');
            loadEvents();
            showNotification(eventId ? 'Event berhasil diperbarui' : 'Event berhasil dibuat', 'success');
        } else {
            showNotification('Gagal menyimpan event', 'error');
        }
    } catch (error) {
        showNotification('Terjadi kesalahan', 'error');
    }
}

// Ticket Management
function openTicketModal(eventId) {
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Hanya admin yang dapat menambahkan tiket', 'error');
        return;
    }

    const modal = document.getElementById('ticketModal');
    if (!modal) {
        console.error('Ticket modal not found');
        return;
    }
    
    document.getElementById('ticketEventId').value = eventId;
    document.getElementById('ticketForm').reset();
    modal.style.display = 'flex';
}

// Make function globally accessible
window.openTicketModal = openTicketModal;

async function handleTicketSubmit(e) {
    e.preventDefault();
    
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Hanya admin yang dapat menambahkan tiket', 'error');
        return;
    }
    
    const ticketData = {
        event_id: parseInt(document.getElementById('ticketEventId').value),
        jenis_tiket: document.getElementById('ticketType').value,
        harga: parseFloat(document.getElementById('ticketPrice').value),
        kuota: parseInt(document.getElementById('ticketQuota').value)
    };

    // Validasi
    if (!ticketData.event_id || !ticketData.jenis_tiket || !ticketData.harga || !ticketData.kuota) {
        showNotification('Mohon lengkapi semua field', 'error');
        return;
    }

    if (ticketData.harga < 0 || ticketData.kuota < 1) {
        showNotification('Harga dan kuota harus valid', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tikets`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : 'Gagal menambahkan tiket');
            showNotification(errorMsg, 'error');
            console.error('Ticket error:', data);
            return;
        }

        if (data.success) {
            closeModal('ticketModal');
            // Reload event detail
            const eventId = ticketData.event_id;
            viewEventDetail(eventId);
            showNotification('Tiket berhasil ditambahkan', 'success');
        } else {
            showNotification(data.message || 'Gagal menambahkan tiket', 'error');
        }
    } catch (error) {
        console.error('Ticket submit error:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

// Orders
function openOrderModal(ticketId, ticketType, price, quota) {
    if (!authToken) {
        navigateTo('login');
        return;
    }

    const modal = document.getElementById('orderModal');
    document.getElementById('orderTicketId').value = ticketId;
    document.getElementById('orderTicketType').value = ticketType;
    document.getElementById('orderTicketPrice').value = `Rp ${formatCurrency(price)}`;
    document.getElementById('orderTicketQuota').value = quota;
    document.getElementById('orderQuantity').value = 1;
    document.getElementById('orderQuantity').max = quota;
    calculateOrderTotal();
    modal.style.display = 'flex';
}

function calculateOrderTotal() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
    const priceText = document.getElementById('orderTicketPrice').value;
    const price = parseFloat(priceText.replace(/[^\d]/g, '')) || 0;
    const total = price * quantity;
    document.getElementById('orderTotal').value = `Rp ${formatCurrency(total)}`;
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    const orderData = {
        tiket_id: parseInt(document.getElementById('orderTicketId').value),
        jumlah_tiket: parseInt(document.getElementById('orderQuantity').value)
    };

    // Validasi
    if (!orderData.tiket_id || !orderData.jumlah_tiket || orderData.jumlah_tiket < 1) {
        showNotification('Data tidak valid', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle error response
            const errorMsg = data.message || data.errors ? JSON.stringify(data.errors) : 'Gagal membuat pesanan';
            showNotification(errorMsg, 'error');
            console.error('Order error:', data);
            return;
        }

        if (data.success && data.data) {
            closeModal('orderModal');
            showNotification('Pesanan berhasil dibuat!', 'success');
            // Reload orders
            await loadOrders();
            // Open payment modal with correct data
            const orderData = data.data;
            const totalHarga = typeof orderData.total_harga === 'string' 
                ? parseFloat(orderData.total_harga.replace(/[^\d]/g, '')) 
                : parseFloat(orderData.total_harga);
            
            setTimeout(() => {
                openPaymentModal(orderData.id, totalHarga);
            }, 500);
        } else {
            const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : 'Gagal membuat pesanan');
            showNotification(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Order error:', error);
        showNotification('Terjadi kesalahan: ' + error.message, 'error');
    }
}

async function loadOrders() {
    const list = document.getElementById('ordersList');
    if (!list) return;

    if (!authToken) {
        list.innerHTML = '<div class="loading">Silakan login terlebih dahulu</div>';
        return;
    }

    list.innerHTML = '<div class="loading">Memuat pesanan...</div>';

    try {
        const status = document.getElementById('orderStatusFilter')?.value || '';
        let url = `${API_BASE_URL}/orders`;
        if (status) url += `?status=${status}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            const orders = data.data.data || [];
            
            if (orders.length === 0) {
                list.innerHTML = '<div class="loading">Tidak ada pesanan</div>';
                return;
            }

            list.innerHTML = orders.map(order => {
                const statusClass = order.status === 'confirmed' ? 'confirmed' : order.status === 'cancelled' ? 'cancelled' : 'pending';
                return `
                    <div class="order-card" onclick="viewOrderDetail(${order.id})">
                        <div class="order-header">
                            <div class="order-id">Pesanan #${order.id}</div>
                            <span class="order-status ${statusClass}">${order.status}</span>
                        </div>
                        <div class="order-info">
                            <div><strong>Event:</strong> ${order.tiket?.event?.nama_event || 'N/A'}</div>
                            <div><strong>Tiket:</strong> ${order.tiket?.jenis_tiket || 'N/A'}</div>
                            <div><strong>Jumlah:</strong> ${order.jumlah_tiket}</div>
                            <div><strong>Tanggal:</strong> ${formatDate(order.created_at)}</div>
                        </div>
                        <div class="order-total">Total: Rp ${formatCurrency(order.total_harga)}</div>
                        <div class="order-actions">
                            <button class="btn btn-primary" onclick="event.stopPropagation(); viewOrderDetail(${order.id})">
                                Lihat Detail
                            </button>
                            ${order.status === 'pending' ? `
                                <button class="btn btn-danger" onclick="event.stopPropagation(); cancelOrder(${order.id})">
                                    Batalkan
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            list.innerHTML = '<div class="loading">Gagal memuat pesanan: ' + (data.message || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Load orders error:', error);
        list.innerHTML = '<div class="loading">Gagal memuat pesanan: ' + error.message + '</div>';
    }
}

async function viewOrderDetail(orderId) {
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    navigateTo('orderDetail');
    const content = document.getElementById('orderDetailContent');
    if (!content) return;

    content.innerHTML = '<div class="loading">Memuat detail pesanan...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            if (response.status === 404) {
                content.innerHTML = '<div class="loading">Pesanan tidak ditemukan</div>';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            const order = data.data;
            const payment = order.payment;

            const statusClass = order.status === 'confirmed' ? 'confirmed' : order.status === 'cancelled' ? 'cancelled' : 'pending';
            const paymentStatusClass = payment ? (payment.status === 'sukses' ? 'confirmed' : payment.status === 'gagal' ? 'cancelled' : 'pending') : '';

            content.innerHTML = `
                <div class="event-detail">
                    <div class="order-header">
                        <h2>Detail Pesanan #${order.id}</h2>
                        <span class="order-status ${statusClass}">${order.status}</span>
                    </div>
                    <div class="profile-info">
                        <div class="profile-item">
                            <label>Event</label>
                            <span>${order.tiket?.event?.nama_event || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Lokasi Event</label>
                            <span>${order.tiket?.event?.lokasi || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Tanggal Event</label>
                            <span>${order.tiket?.event?.tanggal_event ? formatDate(order.tiket.event.tanggal_event) : 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Jenis Tiket</label>
                            <span>${order.tiket?.jenis_tiket || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Jumlah Tiket</label>
                            <span>${order.jumlah_tiket}</span>
                        </div>
                        <div class="profile-item">
                            <label>Harga per Tiket</label>
                            <span>Rp ${formatCurrency(order.tiket?.harga || 0)}</span>
                        </div>
                        <div class="profile-item">
                            <label>Total Harga</label>
                            <span class="order-total">Rp ${formatCurrency(order.total_harga)}</span>
                        </div>
                        <div class="profile-item">
                            <label>Status Pesanan</label>
                            <span class="order-status ${statusClass}">${order.status}</span>
                        </div>
                        <div class="profile-item">
                            <label>Tanggal Pesanan</label>
                            <span>${formatDate(order.created_at)}</span>
                        </div>
                        ${payment && payment.id ? `
                            <div class="profile-item">
                                <label>Status Pembayaran</label>
                                <span class="order-status ${paymentStatusClass}">${payment.status || 'N/A'}</span>
                            </div>
                            <div class="profile-item">
                                <label>Metode Pembayaran</label>
                                <span>${payment.payment_method || 'N/A'}</span>
                            </div>
                            <div class="profile-item">
                                <label>Tanggal Pembayaran</label>
                                <span>${payment.created_at ? formatDate(payment.created_at) : 'N/A'}</span>
                            </div>
                            <div class="profile-item">
                                <a href="#" class="btn btn-primary" onclick="event.preventDefault(); viewPaymentDetail(${payment.id})">
                                    <i class="fas fa-receipt"></i> Lihat Detail Pembayaran
                                </a>
                            </div>
                        ` : order.status === 'pending' ? `
                            <div class="profile-item">
                                <button class="btn btn-primary btn-block" onclick="openPaymentModal(${order.id}, ${parseFloat(order.total_harga)})">
                                    <i class="fas fa-credit-card"></i> Bayar Sekarang
                                </button>
                            </div>
                        ` : ''}
                        ${order.status === 'pending' ? `
                            <div class="profile-item">
                                <button class="btn btn-danger btn-block" onclick="cancelOrder(${order.id})">
                                    <i class="fas fa-times"></i> Batalkan Pesanan
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        content.innerHTML = '<div class="loading">Gagal memuat detail pesanan</div>';
    }
}

async function cancelOrder(orderId) {
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'cancelled' })
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showNotification('Pesanan berhasil dibatalkan', 'success');
            loadOrders();
            // Reload order detail if on that page
            const currentPage = document.querySelector('.page[style*="block"]');
            if (currentPage && currentPage.id === 'orderDetailPage') {
                viewOrderDetail(orderId);
            }
        } else {
            showNotification(data.message || 'Gagal membatalkan pesanan', 'error');
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        showNotification('Terjadi kesalahan: ' + error.message, 'error');
    }
}

// Payment
function openPaymentModal(orderId, amount) {
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    const modal = document.getElementById('paymentModal');
    if (!modal) {
        showNotification('Modal pembayaran tidak ditemukan', 'error');
        return;
    }

    // Ensure amount is a number
    const amountNum = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : parseFloat(amount);
    
    if (!orderId || !amountNum || isNaN(amountNum)) {
        showNotification('Data pembayaran tidak valid', 'error');
        return;
    }

    document.getElementById('paymentOrderId').value = orderId;
    document.getElementById('paymentAmount').value = `Rp ${formatCurrency(amountNum)}`;
    document.getElementById('paymentMethod').value = '';
    modal.style.display = 'flex';
}

async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    const orderId = parseInt(document.getElementById('paymentOrderId').value);
    const amountText = document.getElementById('paymentAmount').value;
    const amount = parseFloat(amountText.replace(/[^\d]/g, ''));
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!orderId || !amount || !paymentMethod) {
        showNotification('Mohon lengkapi semua field', 'error');
        return;
    }

    const paymentData = {
        order_id: orderId,
        amount: amount,
        payment_method: paymentMethod
    };

    try {
        const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle error response
            const errorMsg = data.message || data.errors ? JSON.stringify(data.errors) : 'Gagal membuat pembayaran';
            showNotification(errorMsg, 'error');
            console.error('Payment error:', data);
            return;
        }

        if (data.success && data.data) {
            closeModal('paymentModal');
            showNotification('Pembayaran berhasil dibuat!', 'success');
            // Reload data
            setTimeout(() => {
                loadOrders();
                loadPayments();
                navigateTo('orders');
            }, 500);
        } else {
            showNotification(data.message || 'Gagal membuat pembayaran', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Terjadi kesalahan: ' + error.message, 'error');
    }
}

// Payments
async function loadPayments() {
    const list = document.getElementById('paymentsList');
    if (!list) return;

    if (!authToken) {
        list.innerHTML = '<div class="loading">Silakan login terlebih dahulu</div>';
        return;
    }

    list.innerHTML = '<div class="loading">Memuat pembayaran...</div>';

    try {
        const status = document.getElementById('paymentStatusFilter')?.value || '';
        let url = `${API_BASE_URL}/payments`;
        if (status) url += `?status=${status}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            const payments = data.data.data || [];
            
            if (payments.length === 0) {
                list.innerHTML = '<div class="loading">Tidak ada pembayaran</div>';
                return;
            }

            list.innerHTML = payments.map(payment => {
                const statusClass = payment.status === 'sukses' ? 'confirmed' : payment.status === 'gagal' ? 'cancelled' : 'pending';
                return `
                    <div class="order-card" onclick="viewPaymentDetail(${payment.id})">
                        <div class="order-header">
                            <div class="order-id">Pembayaran #${payment.id}</div>
                            <span class="order-status ${statusClass}">${payment.status}</span>
                        </div>
                        <div class="order-info">
                            <div><strong>Order ID:</strong> #${payment.order_id}</div>
                            <div><strong>Event:</strong> ${payment.order?.tiket?.event?.nama_event || 'N/A'}</div>
                            <div><strong>Metode:</strong> ${payment.payment_method || 'N/A'}</div>
                            <div><strong>Tanggal:</strong> ${formatDate(payment.created_at)}</div>
                        </div>
                        <div class="order-total">Total: Rp ${formatCurrency(payment.amount)}</div>
                        <div class="order-actions">
                            <button class="btn btn-primary" onclick="event.stopPropagation(); viewPaymentDetail(${payment.id})">
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            list.innerHTML = '<div class="loading">Gagal memuat pembayaran: ' + (data.message || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Load payments error:', error);
        list.innerHTML = '<div class="loading">Gagal memuat pembayaran: ' + error.message + '</div>';
    }
}

async function viewPaymentDetail(paymentId) {
    if (!authToken) {
        showNotification('Silakan login terlebih dahulu', 'error');
        navigateTo('login');
        return;
    }

    navigateTo('paymentDetail');
    const content = document.getElementById('paymentDetailContent');
    if (!content) return;

    content.innerHTML = '<div class="loading">Memuat detail pembayaran...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            if (response.status === 404) {
                content.innerHTML = '<div class="loading">Pembayaran tidak ditemukan</div>';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            const payment = data.data;
            const order = payment.order;
            const statusClass = payment.status === 'sukses' ? 'confirmed' : payment.status === 'gagal' ? 'cancelled' : 'pending';

            content.innerHTML = `
                <div class="event-detail">
                    <div class="order-header">
                        <h2>Detail Pembayaran #${payment.id}</h2>
                        <span class="order-status ${statusClass}">${payment.status}</span>
                    </div>
                    <div class="profile-info">
                        <div class="profile-item">
                            <label>Order ID</label>
                            <span>#${payment.order_id}</span>
                        </div>
                        <div class="profile-item">
                            <label>Event</label>
                            <span>${order?.tiket?.event?.nama_event || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Jenis Tiket</label>
                            <span>${order?.tiket?.jenis_tiket || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Jumlah Tiket</label>
                            <span>${order?.jumlah_tiket || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Total Pembayaran</label>
                            <span class="order-total">Rp ${formatCurrency(payment.amount)}</span>
                        </div>
                        <div class="profile-item">
                            <label>Metode Pembayaran</label>
                            <span>${payment.payment_method || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Status Pembayaran</label>
                            <span class="order-status ${statusClass}">${payment.status}</span>
                        </div>
                        <div class="profile-item">
                            <label>Status Order</label>
                            <span class="order-status ${order?.status === 'confirmed' ? 'confirmed' : order?.status === 'cancelled' ? 'cancelled' : 'pending'}">${order?.status || 'N/A'}</span>
                        </div>
                        <div class="profile-item">
                            <label>Tanggal Pembayaran</label>
                            <span>${formatDate(payment.created_at)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        content.innerHTML = '<div class="loading">Gagal memuat detail pembayaran</div>';
    }
}

// Profile
async function loadProfile() {
    const content = document.getElementById('profileContent');
    if (!content) return;

    if (!authToken) {
        content.innerHTML = '<div class="loading">Silakan login terlebih dahulu</div>';
        return;
    }

    content.innerHTML = '<div class="loading">Memuat profil...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                showNotification('Session expired, silakan login kembali', 'error');
                navigateTo('login');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            const user = data.data;
            content.innerHTML = `
                <div class="profile-info">
                    <div class="profile-item">
                        <label>Nama</label>
                        <span>${user.name || 'N/A'}</span>
                    </div>
                    <div class="profile-item">
                        <label>Email</label>
                        <span>${user.email || 'N/A'}</span>
                    </div>
                    <div class="profile-item">
                        <label>Role</label>
                        <span>${user.role || 'user'}</span>
                    </div>
                    <div class="profile-item">
                        <label>Bergabung</label>
                        <span>${user.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                    </div>
                </div>
            `;
        } else {
            content.innerHTML = '<div class="loading">Gagal memuat profil: ' + (data.message || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Load profile error:', error);
        content.innerHTML = '<div class="loading">Gagal memuat profil: ' + error.message + '</div>';
    }
}

// Utility Functions
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    // Get fresh token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        authToken = token; // Update global variable
    }
    
    return headers;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}

function showAlert(alertElement, message, type) {
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';
    
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}
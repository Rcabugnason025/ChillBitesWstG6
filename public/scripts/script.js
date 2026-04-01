document.addEventListener("DOMContentLoaded", () => {
  // Home page: allow anchor tags to navigate via their hrefs (no JS override)
  // This ensures "Order Now" and "Explore Menu" route correctly to menu.html

  // -------------------------------
  // Auth UI initialization
  // -------------------------------
  initAuthUI();

  // -------------------------------
  // Contact form (on Contact page) with Bootstrap validation
  // -------------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    // Bootstrap form validation
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (form.checkValidity()) {
        // Form is valid, show success message
        alert("Message sent successfully! We'll get back to you within 24 hours.");
        form.reset();
        form.classList.remove("was-validated");
      } else {
        // Form is invalid, show validation feedback
        form.classList.add("was-validated");
      }
    }, false);
  }

  // Mobile Menu Toggle (Bootstrap compatibility)
  // Let Bootstrap handle the collapse toggle via data attributes.

  // Menu page: Render items dynamically
  const menuGrid = document.querySelector('.row.g-4');
  if (menuGrid && window.location.pathname.includes('menu.html')) {
    renderMenu();
  }

  // Menu page: Order Now buttons on cards
  // Event delegation for dynamically added buttons
  if (menuGrid) {
    menuGrid.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-order-now')) {
        const btn = e.target;
        // Require login to place an order
        const currentUser = getCurrentUser();
        if (!currentUser) {
          const wantLogin = confirm('Please log in to place an order. Go to login page now?');
          if (wantLogin) {
            window.location.href = 'login.html?redirect=menu.html';
          }
          return;
        }
        const dishId = btn.getAttribute('data-id');
        addDishToCartAndOpenModal(dishId);
      }
    });
  }
});

const API_URL = `${window.location.origin}/api`;
let cachedMenuItems = null;

// -------------------------------
// Menu Management (CRUD)
// -------------------------------

async function getMenu() {
  try {
    const response = await fetch(`${API_URL}/menu`);
    if (!response.ok) {
      throw new Error(`Menu request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    return null;
  }
}

async function renderMenu() {
  const menuGrid = document.querySelector('.row.g-4');
  if (!menuGrid) return;

  const menu = await getMenu();
  if (!Array.isArray(menu)) return;
  cachedMenuItems = menu;
  const availableItems = menu.filter(item => item.available);

  menuGrid.innerHTML = availableItems.map(item => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm food-card">
        <img src="${item.image}" alt="${item.name}" class="card-img-top" style="height: 200px; object-fit: cover;" onerror="this.onerror=null; this.src='images/chillbites-logo.jpg';">
        <div class="card-body">
          <h3 class="card-title fw-bold">${item.name}</h3>
          <p class="card-text text-muted">${item.desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fs-4 text-danger fw-bold">₱${item.price}</span>
            <button class="btn btn-danger btn-order-now" data-id="${item._id}">Order Now</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// -------------------------------
// Admin Functions
// -------------------------------
async function loadAdminMenu() {
  const tableBody = document.getElementById('adminMenuTableBody');
  if (!tableBody) return;

  const menu = await getMenu();
  if (!Array.isArray(menu)) return;
  tableBody.innerHTML = menu.map(item => `
    <tr>
      <td class="ps-4">
        <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.onerror=null; this.src='images/chillbites-logo.jpg';">
      </td>
      <td class="fw-semibold">${item.name}</td>
      <td class="text-muted small text-truncate" style="max-width: 150px;">${item.desc}</td>
      <td>₱${item.price}</td>
      <td>
        <span class="badge ${item.available ? 'bg-success' : 'bg-secondary'}">
          ${item.available ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td class="text-end pe-4">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editDish('${item._id}')">
          <i data-feather="edit-2" style="width: 16px; height: 16px;"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteDish('${item._id}')">
          <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  feather.replace();
}

function openAddDishModal() {
  const form = document.getElementById('menuForm');
  const dishIdEl = document.getElementById('dishId');
  const titleEl = document.getElementById('modalTitle');
  const fileEl = document.getElementById('dishImageFile');
  const imageEl = document.getElementById('dishImage');
  if (form) form.reset();
  if (dishIdEl) dishIdEl.value = '';
  if (titleEl) titleEl.textContent = 'Add New Dish';
  if (fileEl) fileEl.value = '';
  if (imageEl && !imageEl.value) imageEl.value = 'images/sisig.jpg';
  const modalEl = document.getElementById('addMenuModal');
  if (modalEl && window.bootstrap && bootstrap.Modal) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

async function saveDish() {
  const id = document.getElementById('dishId').value;
  const name = document.getElementById('dishName').value;
  const price = document.getElementById('dishPrice').value;
  const desc = document.getElementById('dishDesc').value;
  const imageInput = document.getElementById('dishImage');
  const imageFileInput = document.getElementById('dishImageFile');
  let image = imageInput ? imageInput.value : '';
  const available = document.getElementById('dishAvailable').checked;

  const hasFile = !!(imageFileInput && imageFileInput.files && imageFileInput.files[0]);
  if (!name || !price || !desc || (!image && !hasFile)) {
    alert('Please fill in all fields');
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.token) {
    alert('Please log in again.');
    window.location.href = 'login.html';
    return;
  }

  if (imageFileInput && imageFileInput.files && imageFileInput.files[0] && typeof window.firebaseUploadImage === 'function') {
    try {
      image = await window.firebaseUploadImage(imageFileInput.files[0]);
      if (imageInput) imageInput.value = image;
    } catch (error) {
      if (!image) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }
  }

  const dishData = { name, price: parseInt(price), desc, image, available };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    let response;
    if (id) {
      // Edit existing
      response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify(dishData),
        signal: controller.signal
      });
    } else {
      // Add new
      response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify(dishData),
        signal: controller.signal
      });
    }
    clearTimeout(timeoutId);

    if (response.ok) {
      // Close modal
      const modalEl = document.getElementById('addMenuModal');
      const modal = (modalEl && bootstrap && bootstrap.Modal)
        ? (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl))
        : null;
      if (modal) modal.hide();
      
      // Reset form
      document.getElementById('menuForm').reset();
      document.getElementById('dishId').value = '';
      if (document.getElementById('dishImageFile')) document.getElementById('dishImageFile').value = '';
      
      // Refresh table
      loadAdminMenu();
    } else {
      const status = response.status;
      let raw = '';
      try {
        raw = await response.text();
      } catch (_) {
        raw = '';
      }
      let errorMessage = 'Failed to save dish';
      try {
        const errorData = raw ? JSON.parse(raw) : null;
        if (errorData && errorData.message) errorMessage = errorData.message;
        if (errorData && Array.isArray(errorData.errors) && errorData.errors[0] && errorData.errors[0].msg) {
          errorMessage = errorData.errors[0].msg;
        }
      } catch (_) {}
      if (errorMessage === 'Failed to save dish' && raw && raw.trim()) {
        errorMessage = raw.trim().slice(0, 200);
      }
      if (status === 401) {
        localStorage.removeItem('currentUser');
        const lower = String(errorMessage || '').toLowerCase();
        if (lower.includes('admin')) {
          alert('Admin only: please log in with the admin account (admin@chillbites.com / admin).');
        } else {
          alert(`${errorMessage}. Please log in again.`);
        }
        window.location.href = 'login.html?redirect=admin.html';
        return;
      }
      alert(errorMessage);
    }
  } catch (error) {
    console.error('Error saving dish:', error);
    if (error && error.name === 'AbortError') {
      alert('Save Dish request timed out. Please refresh the page and try again.');
      return;
    }
    alert('An error occurred while saving the dish');
  }
}

async function editDish(id) {
  try {
    const response = await fetch(`${API_URL}/menu/${id}`);
    const dish = await response.json();
    
    if (dish) {
      document.getElementById('dishId').value = dish._id;
      document.getElementById('dishName').value = dish.name;
      document.getElementById('dishPrice').value = dish.price;
      document.getElementById('dishDesc').value = dish.desc;
      document.getElementById('dishImage').value = dish.image;
      document.getElementById('dishAvailable').checked = dish.available;
      
      document.getElementById('modalTitle').textContent = 'Edit Dish';
      
      const modal = new bootstrap.Modal(document.getElementById('addMenuModal'));
      modal.show();
    }
  } catch (error) {
    console.error('Error fetching dish:', error);
  }
}

async function deleteDish(id) {
  if (confirm('Are you sure you want to delete this dish?')) {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.token) {
        alert('Please log in again.');
        window.location.href = 'login.html';
        return;
      }
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (response.ok) {
        loadAdminMenu();
      } else {
        alert('Failed to delete dish');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  }
}

async function generateRandomImage() {
  const btn = document.getElementById('generateImageBtn');
  const input = document.getElementById('dishImage');
  const originalText = btn.innerHTML;
  
  try {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    
    // Using TheMealDB API for random food images
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    
    if (data.meals && data.meals[0]) {
      input.value = data.meals[0].strMealThumb;
    } else {
      throw new Error('No image found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    alert('Failed to fetch random image. Please try again.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
    feather.replace(); // Re-render icons if needed
  }
}

async function logoutAdmin() {
  try {
    if (typeof window.firebaseLogout === 'function') await window.firebaseLogout();
  } catch (_) {}
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function getOrderCart() {
  try {
    const data = JSON.parse(localStorage.getItem('orderCart'));
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

function setOrderCart(cart) {
  localStorage.setItem('orderCart', JSON.stringify(cart));
}

function addDishToCart(cart, dish) {
  const existing = cart.find((x) => x.menuItem === dish._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      menuItem: dish._id,
      name: dish.name,
      price: Number(dish.price),
      quantity: 1,
    });
  }
  return cart;
}

async function addDishToCartAndOpenModal(dishId) {
  let menu = cachedMenuItems;
  if (!Array.isArray(menu)) {
    menu = await getMenu();
  }
  if (!Array.isArray(menu)) return;

  const dish = menu.find((x) => x._id === dishId);
  if (!dish) return;

  const cart = addDishToCart(getOrderCart(), dish);
  setOrderCart(cart);
  showOrderModal();
}

function calculateCartTotal(cart) {
  return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}

function renderCartIntoModal(cart) {
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  if (!orderItems || !orderTotal) return;

  if (!cart.length) {
    orderItems.innerHTML = '<p class="text-muted mb-0">No items yet.</p>';
    orderTotal.textContent = '₱0';
    return;
  }

  orderItems.innerHTML = cart
    .map(
      (item) => `
      <div class="order-item-card p-3 mb-2 border rounded">
        <div class="d-flex justify-content-between align-items-center gap-2">
          <div class="flex-grow-1">
            <h6 class="mb-1">${item.name}</h6>
            <small class="text-muted">₱${item.price} each</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.menuItem}', -1)">-</button>
            <input type="number" class="form-control form-control-sm text-center" style="width: 70px;" min="1" value="${item.quantity}" onchange="setCartQuantity('${item.menuItem}', this.value)">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.menuItem}', 1)">+</button>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.menuItem}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  orderTotal.textContent = `₱${calculateCartTotal(cart)}`;
}

function removeFromCart(menuItemId) {
  const cart = getOrderCart().filter((x) => x.menuItem !== menuItemId);
  setOrderCart(cart);
  renderCartIntoModal(cart);
}

function setCartQuantity(menuItemId, rawValue) {
  const qty = Math.max(1, parseInt(rawValue, 10) || 1);
  const cart = getOrderCart().map((x) => (x.menuItem === menuItemId ? { ...x, quantity: qty } : x));
  setOrderCart(cart);
  renderCartIntoModal(cart);
}

function updateCartQuantity(menuItemId, delta) {
  const cart = getOrderCart().map((x) => {
    if (x.menuItem !== menuItemId) return x;
    const nextQty = Math.max(1, Number(x.quantity) + Number(delta));
    return { ...x, quantity: nextQty };
  });
  setOrderCart(cart);
  renderCartIntoModal(cart);
}

function toggleDeliveryFields(orderType) {
  const deliveryAddressDiv = document.getElementById('deliveryAddress');
  const streetAddress = document.getElementById('streetAddress');
  const barangay = document.getElementById('barangay');
  const city = document.getElementById('city');
  const zipCode = document.getElementById('zipCode');

  const isDelivery = orderType === 'delivery';
  if (deliveryAddressDiv) deliveryAddressDiv.style.display = isDelivery ? 'block' : 'none';

  if (streetAddress) streetAddress.required = isDelivery;
  if (barangay) barangay.required = isDelivery;
  if (city) city.required = isDelivery;
  if (zipCode) zipCode.required = isDelivery;
}

function toggleGcashFields(paymentMethod) {
  const gcashDetails = document.getElementById('gcashDetails');
  const gcashNumber = document.getElementById('gcashNumber');
  const gcashReference = document.getElementById('gcashReference');

  const isGcash = paymentMethod === 'gcash';
  if (gcashDetails) gcashDetails.style.display = isGcash ? 'block' : 'none';
  if (gcashNumber) gcashNumber.required = isGcash;
  if (gcashReference) gcashReference.required = isGcash;
}

// Order Modal Functions
function showOrderModal() {
  const modal = new bootstrap.Modal(document.getElementById('orderModal'));

  const cart = getOrderCart();
  renderCartIntoModal(cart);

  const user = getCurrentUser();
  const customerName = document.getElementById('customerName');
  const customerEmail = document.getElementById('customerEmail');
  if (user) {
    if (customerName && !customerName.value) customerName.value = user.username || '';
    if (customerEmail && !customerEmail.value) customerEmail.value = user.email || '';
  }

  const orderTypeSelect = document.getElementById('orderType');
  if (orderTypeSelect) {
    toggleDeliveryFields(orderTypeSelect.value);
    orderTypeSelect.onchange = () => toggleDeliveryFields(orderTypeSelect.value);
  }

  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  if (paymentMethodRadios && paymentMethodRadios.length) {
    let current = 'cod';
    paymentMethodRadios.forEach((r) => {
      if (r && r.checked) current = r.value;
      r.onchange = () => toggleGcashFields(r.value);
    });
    toggleGcashFields(current);
  }
  
  modal.show();
}

async function submitOrder() {
  const form = document.getElementById('orderForm');
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Please log in to place an order');
    return;
  }

  const cart = getOrderCart();
  if (!cart.length) {
    alert('Your order is empty.');
    return;
  }

  const orderType = document.getElementById('orderType').value;
  if (!orderType) {
    alert('Please select an order type.');
    return;
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  if (paymentMethod === 'gcash') {
    const gcashNumber = document.getElementById('gcashNumber')?.value || '';
    const gcashReference = document.getElementById('gcashReference')?.value || '';
    if (!gcashNumber.trim() || !gcashReference.trim()) {
      alert('Please enter your GCash number and reference number.');
      return;
    }
  }

  const shippingAddress =
    orderType === 'delivery'
      ? {
          address: document.getElementById('streetAddress').value,
          city: document.getElementById('city').value,
          postalCode: document.getElementById('zipCode').value,
          barangay: document.getElementById('barangay').value,
          landmark: (document.getElementById('landmark') && document.getElementById('landmark').value) || '',
        }
      : { address: orderType, city: 'N/A' };

  const orderData = {
    user: currentUser._id,
    orderItems: cart.map((x) => ({
      name: x.name,
      quantity: x.quantity,
      price: Number(x.price),
      menuItem: x.menuItem,
    })),
    shippingAddress,
    paymentMethod,
    paymentDetails: paymentMethod === 'gcash'
      ? {
          gcashNumber: document.getElementById('gcashNumber')?.value || '',
          referenceNumber: document.getElementById('gcashReference')?.value || '',
        }
      : undefined,
    totalPrice: calculateCartTotal(cart),
  };
  
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
      body: JSON.stringify(orderData)
    });
    
    if (response.ok) {
      const createdOrder = await response.json();
      // Store order data for thank you page
      const customerNameVal = document.getElementById('customerName')?.value || '';
      const customerEmailVal = document.getElementById('customerEmail')?.value || '';
      const customerPhoneVal = document.getElementById('customerPhone')?.value || '';
      const orderTypeVal = document.getElementById('orderType')?.value || 'pickup';
      const paymentMethodVal = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';
      const paymentDetailsVal = paymentMethodVal === 'gcash'
        ? {
            gcashNumber: document.getElementById('gcashNumber')?.value || '',
            referenceNumber: document.getElementById('gcashReference')?.value || '',
          }
        : null;
      const deliveryAddressObj = orderTypeVal === 'delivery'
        ? {
            street: document.getElementById('streetAddress')?.value || '',
            barangay: document.getElementById('barangay')?.value || '',
            city: document.getElementById('city')?.value || '',
            zipCode: document.getElementById('zipCode')?.value || '',
            landmark: document.getElementById('landmark')?.value || ''
          }
        : null;

      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: createdOrder._id.slice(-6).toUpperCase(),
        customerName: customerNameVal,
        customerPhone: customerPhoneVal,
        customerEmail: customerEmailVal,
        orderType: orderTypeVal,
        paymentMethod: paymentMethodVal,
        items: cart.map((x) => ({
          name: x.name,
          quantity: x.quantity,
          price: Number(x.price),
        })),
        totalAmount: '₱' + orderData.totalPrice,
        deliveryAddress: deliveryAddressObj,
        paymentDetails: paymentDetailsVal
      }));
      localStorage.removeItem('orderCart');
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
      modal.hide();
      
      // Redirect to thank you page
      window.location.href = 'thank-you.html';
    } else {
      const errorData = await response.json();
      alert('Failed to place order: ' + errorData.message);
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('An error occurred while placing the order');
  }
}

// -------------------------------
// Authentication helpers and page handlers
// -------------------------------

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setCurrentUser(data);
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    throw error;
  }
}

async function registerUser(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setCurrentUser(data);
      return data;
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    throw error;
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  } catch (_) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

async function logout() {
  try {
    if (typeof window.firebaseLogout === 'function') await window.firebaseLogout();
  } catch (_) {}
  localStorage.removeItem('currentUser');
  window.location.reload();
}

function initAuthUI() {
  const authLink = document.getElementById('authLink');
  const logoutLink = document.getElementById('logoutLink');
  const authLinkDesktop = document.getElementById('authLinkDesktop');
  const logoutLinkDesktop = document.getElementById('logoutLinkDesktop');

  const user = getCurrentUser();

  // Helper function to update a pair of links
  const updateLinks = (loginEl, logoutEl) => {
    if (!loginEl) return;
    
    if (user) {
      // User is logged in
      loginEl.textContent = `Hi, ${user.username || user.email.split('@')[0]}`;
      loginEl.href = '#';
      
      // Admin Check
      if (user.isAdmin) {
        loginEl.href = 'admin.html';
      }

      if (logoutEl) {
        logoutEl.classList.remove('d-none');
        logoutEl.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      }
    } else {
      // User is logged out
      loginEl.textContent = 'Login';
      loginEl.href = 'login.html';
      if (logoutEl) logoutEl.classList.add('d-none');
    }
  };

  // Update Mobile/Fullscreen Links
  updateLinks(authLink, logoutLink);

  // Update Desktop Links
  updateLinks(authLinkDesktop, logoutLinkDesktop);

  // Page-specific handlers
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const oauth = new URLSearchParams(window.location.search).get('oauth');
    if (oauth === 'success') {
      alert('Google login is connected. If you need full login, add Google OAuth keys in .env.');
    }
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      try {
        const user = await loginUser(email, password);
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        
        if (user.isAdmin) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = redirect || 'index.html';
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!signupForm.checkValidity()) {
        signupForm.classList.add('was-validated');
        return;
      }

      const username = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }

      try {
        await registerUser(username, email, password);
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'index.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

// Full Screen Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const fullScreenMenu = document.getElementById('fullScreenMenu');

  if (menuToggle && fullScreenMenu && closeMenuBtn) {
    function openMenu() {
      fullScreenMenu.classList.remove('d-none');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeMenu() {
      fullScreenMenu.classList.add('d-none');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    
    // Close on link click
    fullScreenMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on resize (if switching to desktop view)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) { // Bootstrap lg breakpoint
        closeMenu();
      }
    });
  }
});

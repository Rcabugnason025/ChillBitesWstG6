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
        const card = btn.closest('.card');
        const dishName = card.querySelector('.card-title').textContent;
        const priceEl = card.querySelector('.card-text strong, .text-danger.fw-bold');
        const dishPrice = priceEl ? priceEl.textContent : '₱0';
        
        // Store order data
        const orderData = {
          name: dishName,
          price: dishPrice,
          quantity: 1
        };
        
        // Show order modal
        showOrderModal(orderData);
      }
    });
  }
});

const API_URL = `${window.location.origin}/api`;

// -------------------------------
// Menu Management (CRUD)
// -------------------------------

async function getMenu() {
  try {
    const response = await fetch(`${API_URL}/menu`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
}

async function renderMenu() {
  const menuGrid = document.querySelector('.row.g-4');
  if (!menuGrid) return;

  const menu = await getMenu();
  const availableItems = menu.filter(item => item.available);

  menuGrid.innerHTML = availableItems.map(item => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm food-card">
        <img src="${item.image}" alt="${item.name}" class="card-img-top" style="height: 200px; object-fit: cover;" onerror="this.onerror=null; this.src='images/chillbites-logo.svg';">
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
  tableBody.innerHTML = menu.map(item => `
    <tr>
      <td class="ps-4">
        <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.onerror=null; this.src='images/chillbites-logo.svg';">
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
      alert('Failed to upload image. Please try again.');
      return;
    }
  }

  const dishData = { name, price: parseInt(price), desc, image, available };
  
  try {
    let response;
    if (id) {
      // Edit existing
      response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify(dishData)
      });
    } else {
      // Add new
      response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify(dishData)
      });
    }

    if (response.ok) {
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addMenuModal'));
      modal.hide();
      
      // Reset form
      document.getElementById('menuForm').reset();
      document.getElementById('dishId').value = '';
      if (document.getElementById('dishImageFile')) document.getElementById('dishImageFile').value = '';
      
      // Refresh table
      loadAdminMenu();
    } else {
      alert('Failed to save dish');
    }
  } catch (error) {
    console.error('Error saving dish:', error);
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

function logoutAdmin() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Order Modal Functions
function showOrderModal(orderData) {
  const modal = new bootstrap.Modal(document.getElementById('orderModal'));
  
  // Populate order summary
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  
  orderItems.innerHTML = `
    <div class="order-item-card p-3 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">${orderData.name}</h6>
          <small class="text-muted">Quantity: ${orderData.quantity}</small>
        </div>
        <div class="text-end">
          <strong class="text-danger">${orderData.price}</strong>
        </div>
      </div>
    </div>
  `;
  
  orderTotal.textContent = orderData.price;
  
  // Show/hide delivery address based on order type (ONLY PICKUP ALLOWED NOW)
  const orderTypeSelect = document.getElementById('orderType');
  const deliveryAddressDiv = document.getElementById('deliveryAddress');
  
  if (orderTypeSelect) {
    // Force Pickup as default and only option if possible
    orderTypeSelect.value = 'pickup';
    // Hide delivery fields just in case
    if (deliveryAddressDiv) deliveryAddressDiv.style.display = 'none';
    
    // Disable listener for now as we are strictly pickup
    // (Or keep it if we want to re-enable delivery later, but for now we enforce pickup)
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

  // Collect order data
  const orderItemsHTML = document.getElementById('orderItems').innerHTML;
  // Extracting dish name and price from the modal HTML for simplicity in this demo
  // In a real app, you'd pass the original objects
  const dishName = document.querySelector('#orderItems h6').textContent;
  const dishPrice = document.querySelector('#orderItems .text-danger').textContent.replace('₱', '');
  
  // Find the menu item by name to get its ID (simplified)
  const menu = await getMenu();
  const menuItem = menu.find(item => item.name === dishName);

  const orderData = {
    user: currentUser._id,
    orderItems: [
      {
        name: dishName,
        quantity: 1,
        price: parseFloat(dishPrice),
        menuItem: menuItem ? menuItem._id : null
      }
    ],
    shippingAddress: {
      address: 'Pickup', // Defaulting since we enforced pickup in modal
      city: 'Store Location'
    },
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
    totalPrice: parseFloat(dishPrice)
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
      localStorage.setItem('lastOrder', JSON.stringify({
        ...orderData,
        orderId: createdOrder._id.slice(-6).toUpperCase(),
        customerName: document.getElementById('customerName').value,
        totalAmount: '₱' + orderData.totalPrice
      }));
      
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

function logout() {
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

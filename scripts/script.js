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

  // -------------------------------
  // Mobile Menu Toggle (Bootstrap compatibility)
  // -------------------------------
  // Let Bootstrap handle the collapse toggle via data attributes.
  // Removing the manual toggle prevents double-trigger and instant close.

  // -------------------------------
  // Menu page: Order Now buttons on cards
  document.querySelectorAll('.card .btn-danger').forEach(btn => {
    btn.addEventListener('click', function() {
      // Require login to place an order
      const currentUser = getCurrentUser();
      if (!currentUser) {
        const wantLogin = confirm('Please log in to place an order. Go to login page now?');
        if (wantLogin) {
          window.location.href = 'login.html?redirect=menu.html';
        }
        return;
      }
      const card = this.closest('.card');
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
    });
  });
});

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
  
  // Show/hide delivery address based on order type
  const orderTypeSelect = document.getElementById('orderType');
  const deliveryAddressDiv = document.getElementById('deliveryAddress');
  
  orderTypeSelect.addEventListener('change', function() {
    if (this.value === 'delivery') {
      deliveryAddressDiv.style.display = 'block';
      document.getElementById('streetAddress').setAttribute('required', '');
      document.getElementById('barangay').setAttribute('required', '');
      document.getElementById('city').setAttribute('required', '');
      document.getElementById('zipCode').setAttribute('required', '');
    } else {
      deliveryAddressDiv.style.display = 'none';
      document.getElementById('streetAddress').removeAttribute('required');
      document.getElementById('barangay').removeAttribute('required');
      document.getElementById('city').removeAttribute('required');
      document.getElementById('zipCode').removeAttribute('required');
    }
  });
  
  modal.show();
}

function submitOrder() {
  const form = document.getElementById('orderForm');
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  
  // Collect order data
  const orderData = {
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerEmail: document.getElementById('customerEmail').value,
    orderType: document.getElementById('orderType').value,
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
    specialInstructions: document.getElementById('specialInstructions').value,
    orderItems: document.getElementById('orderItems').innerHTML,
    totalAmount: document.getElementById('orderTotal').textContent,
    orderId: 'CHILL' + Date.now().toString().slice(-6)
  };
  
  // Add delivery address if delivery is selected
  if (orderData.orderType === 'delivery') {
    orderData.deliveryAddress = {
      street: document.getElementById('streetAddress').value,
      barangay: document.getElementById('barangay').value,
      city: document.getElementById('city').value,
      zipCode: document.getElementById('zipCode').value,
      landmark: document.getElementById('landmark').value
    };
  }
  
  // Store order data for thank you page
  localStorage.setItem('lastOrder', JSON.stringify(orderData));
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
  modal.hide();
  
  // Redirect to thank you page
  window.location.href = 'thank-you.html';
}

// -------------------------------
// Authentication helpers and page handlers
// -------------------------------
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users')) || [];
  } catch (_) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
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

  const user = getCurrentUser();
  if (authLink) {
    if (user) {
      authLink.textContent = `Hi, ${user.name || user.email}`;
      authLink.href = '#';
      authLink.classList.add('fw-semibold');
      if (logoutLink) {
        logoutLink.classList.remove('d-none');
        logoutLink.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      }
    } else {
      authLink.textContent = 'Login';
      authLink.href = 'login.html';
      if (logoutLink) logoutLink.classList.add('d-none');
    }
  }

  // Page-specific handlers
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert('Invalid email or password.');
        return;
      }

      setCurrentUser(user);
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || 'index.html';
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!signupForm.checkValidity()) {
        signupForm.classList.add('was-validated');
        return;
      }

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }

      const users = getUsers();
      if (users.some(u => u.email === email)) {
        alert('Email already registered. Please log in.');
        window.location.href = 'login.html';
        return;
      }

      const newUser = { name, email, password, points: 0 };
      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);

      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || 'index.html';
    });
  }
}

// Global variables
const API_URL = window.location.origin;

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('index.html') || currentPage.endsWith('/admin') || currentPage.endsWith('/admin/');
  
  if (!isLoginPage) {
    checkAuth();
  }
});

// Check if user is authenticated
async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
      return;
    }

    // Update user info in UI
    const user = JSON.parse(localStorage.getItem('user'));
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user) {
      userNameElement.textContent = user.username;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}

// Logout function
function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}

// Fetch with authentication
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await fetch(`${API_URL}${url}`, authOptions);

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
    throw new Error('Unauthorized');
  }

  return response;
}

// Show notification
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

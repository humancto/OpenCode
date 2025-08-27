// Authentication Module
const Auth = (function() {
  
  // Admin credentials - IMPORTANT: Change these for your deployment!
  // For production, use environment variables or secure backend authentication
  const ADMIN_CREDENTIALS = {
    email: 'admin@example.com',    // TODO: Change this email
    password: 'ChangeMe123!'        // TODO: Change this password
  };
  
  // Current user session
  let currentSession = {
    isAdmin: false,
    userName: null,
    email: null
  };
  
  // Check if user is admin
  function isAdmin() {
    return currentSession.isAdmin;
  }
  
  // Login as admin
  function loginAdmin(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      currentSession = {
        isAdmin: true,
        userName: 'Admin',
        email: email
      };
      
      // Store session
      sessionStorage.setItem('userSession', JSON.stringify(currentSession));
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Join as candidate
  function joinAsCandidate(name) {
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Please enter your name' };
    }
    
    currentSession = {
      isAdmin: false,
      userName: name,
      email: null
    };
    
    // Store session
    sessionStorage.setItem('userSession', JSON.stringify(currentSession));
    
    return { success: true };
  }
  
  // Get current session
  function getCurrentSession() {
    // Check if there's a stored session
    const stored = sessionStorage.getItem('userSession');
    if (stored) {
      currentSession = JSON.parse(stored);
    }
    return currentSession;
  }
  
  // Logout
  function logout() {
    currentSession = {
      isAdmin: false,
      userName: null,
      email: null
    };
    sessionStorage.removeItem('userSession');
  }
  
  // Check if logged in
  function isLoggedIn() {
    return currentSession.userName !== null;
  }
  
  // Get user name
  function getUserName() {
    return currentSession.userName;
  }
  
  // Public API
  return {
    isAdmin,
    loginAdmin,
    joinAsCandidate,
    getCurrentSession,
    logout,
    isLoggedIn,
    getUserName
  };
})();
// Main Application Controller
(function() {
  // Initialize the application
  function init() {
    setupLandingPage();
    setupCandidateFlow();
    setupAdminFlow();
  }

  // Setup landing page
  let landingSetup = false;
  function setupLandingPage() {
    if (landingSetup) return;
    landingSetup = true;
    
    // Candidate button
    const candidateBtn = document.querySelector('.candidate-btn');
    if (candidateBtn) {
      candidateBtn.addEventListener('click', function() {
        document.getElementById('landingModal').style.display = 'none';
        document.getElementById('candidateModal').style.display = 'flex';
      });
    }

    // Admin button
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
      adminBtn.addEventListener('click', function() {
        document.getElementById('landingModal').style.display = 'none';
        document.getElementById('adminLoginModal').style.display = 'flex';
      });
    }
  }

  // Setup candidate flow
  function setupCandidateFlow() {
    const candidateName = document.getElementById('candidateName');
    const candidateSessionCode = document.getElementById('candidateSessionCode');
    const candidateJoinBtn = document.getElementById('candidateJoinBtn');
    const candidateBack = document.getElementById('candidateBack');

    // Back button
    candidateBack.addEventListener('click', function() {
      document.getElementById('candidateModal').style.display = 'none';
      document.getElementById('landingModal').style.display = 'flex';
    });

    // Enable/disable join button
    function updateJoinButton() {
      candidateJoinBtn.disabled = 
        !candidateName.value.trim() || 
        candidateSessionCode.value.length !== 6;
    }

    candidateName.addEventListener('input', updateJoinButton);
    candidateSessionCode.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
      updateJoinButton();
    });

    // Join session
    candidateJoinBtn.addEventListener('click', function() {
      const name = candidateName.value.trim();
      const sessionCode = candidateSessionCode.value;

      if (name && sessionCode.length === 6) {
        Auth.joinAsCandidate(name);
        window.location.hash = sessionCode;
        startSession(name, sessionCode, false);
      }
    });

    // Enter key support
    candidateSessionCode.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !candidateJoinBtn.disabled) {
        candidateJoinBtn.click();
      }
    });
  }

  // Setup admin flow
  function setupAdminFlow() {
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('adminPassword');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLoginBack = document.getElementById('adminLoginBack');
    const loginError = document.getElementById('loginError');

    // Back button
    adminLoginBack.addEventListener('click', function() {
      document.getElementById('adminLoginModal').style.display = 'none';
      document.getElementById('landingModal').style.display = 'flex';
      loginError.style.display = 'none';
    });

    // Login
    adminLoginBtn.addEventListener('click', function() {
      const email = adminEmail.value.trim();
      const password = adminPassword.value;

      const result = Auth.loginAdmin(email, password);
      
      if (result.success) {
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminDashboardModal').style.display = 'flex';
        setupAdminDashboard();
      } else {
        loginError.textContent = result.error;
        loginError.style.display = 'block';
      }
    });

    // Enter key support
    adminPassword.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        adminLoginBtn.click();
      }
    });
  }

  // Setup admin dashboard
  function setupAdminDashboard() {
    const createSessionBtn = document.getElementById('createSessionBtn');
    const adminSessionCode = document.getElementById('adminSessionCode');
    const adminJoinBtn = document.getElementById('adminJoinBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');

    // Create new session
    createSessionBtn.addEventListener('click', function() {
      const sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
      window.location.hash = sessionCode;
      
      // Show active session
      document.getElementById('activeSessionCode').textContent = sessionCode;
      document.getElementById('activeSession').style.display = 'block';
      
      // Start session
      startSession('Interviewer', sessionCode, true);
    });

    // Join existing session
    adminJoinBtn.addEventListener('click', function() {
      const sessionCode = adminSessionCode.value.trim();
      
      if (sessionCode.length === 6) {
        window.location.hash = sessionCode;
        startSession('Interviewer', sessionCode, false);
      }
    });

    // Format session code input
    adminSessionCode.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    // Copy session code
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', function() {
        const code = document.getElementById('activeSessionCode').textContent;
        navigator.clipboard.writeText(code).then(function() {
          copyCodeBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyCodeBtn.textContent = 'Copy Code';
          }, 2000);
        });
      });
    }

    // Logout
    adminLogoutBtn.addEventListener('click', function() {
      Auth.logout();
      document.getElementById('adminDashboardModal').style.display = 'none';
      document.getElementById('landingModal').style.display = 'flex';
      document.getElementById('activeSession').style.display = 'none';
    });
  }

  // Start coding session
  function startSession(userName, sessionCode, isNew) {
    // Hide all modals
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });

    // Show main container
    document.getElementById('main-container').style.display = 'flex';

    // Initialize the editor session
    if (typeof initializeSession === 'function') {
      initializeSession({
        userName: userName,
        sessionCode: sessionCode,
        isNew: isNew,
        isAdmin: Auth.isAdmin()
      });
    }
  }

  // Initialize once and only once
  let initialized = false;
  
  function initOnce() {
    if (initialized) return;
    initialized = true;
    
    const session = Auth.getCurrentSession();
    const urlCode = window.location.hash.replace('#', '');

    if (session.isLoggedIn && urlCode) {
      // Resume existing session
      startSession(session.userName, urlCode, false);
    } else {
      // Show landing page
      init();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnce);
  } else {
    initOnce();
  }
})();
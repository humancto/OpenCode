(function() {
  // Variables
  let firepad = null;
  let editor = null;
  let session = null;
  let currentUser = null;
  let usersRef = null;
  let sessionRef = null;
  let firepadRef = null;
  let languageModes = {};
  let currentSessionCode = null;
  let previousUsers = {};
  let isInitialized = false;
  let firepadReady = false;
  
  // Language mode mappings
  const languageConfig = {
    javascript: { mode: 'ace/mode/javascript', ext: 'js' },
    python: { mode: 'ace/mode/python', ext: 'py' },
    java: { mode: 'ace/mode/java', ext: 'java' },
    c_cpp: { mode: 'ace/mode/c_cpp', ext: 'cpp' },
    csharp: { mode: 'ace/mode/csharp', ext: 'cs' },
    php: { mode: 'ace/mode/php', ext: 'php' },
    ruby: { mode: 'ace/mode/ruby', ext: 'rb' },
    go: { mode: 'ace/mode/golang', ext: 'go' },
    rust: { mode: 'ace/mode/rust', ext: 'rs' },
    typescript: { mode: 'ace/mode/typescript', ext: 'ts' },
    swift: { mode: 'ace/mode/swift', ext: 'swift' },
    kotlin: { mode: 'ace/mode/kotlin', ext: 'kt' },
    html: { mode: 'ace/mode/html', ext: 'html' },
    css: { mode: 'ace/mode/css', ext: 'css' },
    sql: { mode: 'ace/mode/sql', ext: 'sql' },
    markdown: { mode: 'ace/mode/markdown', ext: 'md' }
  };

  // Default code examples for each language
  const defaultCode = {
    javascript: '// Welcome to Collaborative Code Editor!\n\nfunction greet(name) {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet("World");',
    python: '# Welcome to Collaborative Code Editor!\n\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")',
    java: '// Welcome to Collaborative Code Editor!\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    c_cpp: '// Welcome to Collaborative Code Editor!\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    csharp: '// Welcome to Collaborative Code Editor!\n\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    php: '<?php\n// Welcome to Collaborative Code Editor!\n\nfunction greet($name) {\n    echo "Hello, $name!";\n}\n\ngreet("World");\n?>',
    ruby: '# Welcome to Collaborative Code Editor!\n\ndef greet(name)\n  puts "Hello, #{name}!"\nend\n\ngreet("World")',
    go: '// Welcome to Collaborative Code Editor!\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: '// Welcome to Collaborative Code Editor!\n\nfn main() {\n    println!("Hello, World!");\n}',
    typescript: '// Welcome to Collaborative Code Editor!\n\nfunction greet(name: string): void {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet("World");',
    swift: '// Welcome to Collaborative Code Editor!\n\nimport Foundation\n\nfunc greet(_ name: String) {\n    print("Hello, \\(name)!")\n}\n\ngreet("World")',
    kotlin: '// Welcome to Collaborative Code Editor!\n\nfun main() {\n    println("Hello, World!")\n}',
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Welcome</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
    css: '/* Welcome to Collaborative Code Editor! */\n\nbody {\n    font-family: Arial, sans-serif;\n    background: #f0f0f0;\n    color: #333;\n}\n\nh1 {\n    color: #007acc;\n}',
    sql: '-- Welcome to Collaborative Code Editor!\n\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100)\n);\n\nSELECT * FROM users;',
    markdown: '# Welcome to Collaborative Code Editor!\n\n## Features\n\n- Real-time collaboration\n- Multiple language support\n- Syntax highlighting\n- Live presence indicators\n\n### Getting Started\n\n1. Share the session code with your team\n2. Start coding together!\n3. See changes in real-time'
  };

  // Initialize the application (called from app.js)
  window.initializeSession = function(options) {
    // CRITICAL: Prevent multiple initializations
    if (isInitialized) {
      console.warn('⚠️ Session already initialized, blocking re-initialization');
      return;
    }
    isInitialized = true;
    
    const { userName, sessionCode, isNew, isAdmin } = options;
    
    console.log('=== INITIALIZING SESSION (ONCE) ===');
    console.log('User:', userName, 'Code:', sessionCode, 'New:', isNew, 'Admin:', isAdmin);
    
    currentSessionCode = sessionCode;
    currentUser = {
      name: userName,
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      color: generateUserColor(),
      isAdmin: isAdmin
    };
    
    // Initialize components
    initializeEditor();
    initializeFirebase(isNew);
    setupEventListenersOnce();
    
    // Update UI for admin
    if (isAdmin) {
      const sessionInfo = document.getElementById('session-info');
      if (sessionInfo && !sessionInfo.innerHTML.includes('Admin')) {
        sessionInfo.innerHTML += ' <span style="color: #4caf50">(Admin)</span>';
      }
    }
  }

  // Initialize ACE Editor
  function initializeEditor() {
    // Prevent duplicate editor creation
    if (editor) {
      console.warn('Editor already exists');
      return;
    }
    
    console.log('Creating ACE editor...');
    editor = ace.edit("firepad-container");
    editor.setTheme("ace/theme/monokai");
    
    session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setMode("ace/mode/javascript");
    
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false, // Disable to prevent issues
      fontSize: "14px",
      showPrintMargin: false,
      readOnly: false
    });

    editor.setReadOnly(false);
    console.log('Editor created and configured');
  }

  // Initialize Firebase and Firepad
  function initializeFirebase(isNew) {
    // Clean up any existing Firepad
    if (firepad) {
      console.log('Cleaning up existing Firepad...');
      try {
        firepad.dispose();
      } catch(e) {
        console.error('Error disposing Firepad:', e);
      }
      firepad = null;
      firepadReady = false;
    }
    
    // Clear any existing Firebase listeners
    if (sessionRef) {
      sessionRef.off();
    }
    if (usersRef) {
      usersRef.off();
    }
    
    // Create new Firebase references
    const ref = firebase.database().ref('sessions').child(currentSessionCode);
    firepadRef = ref.child('firepad');
    sessionRef = ref;
    usersRef = ref.child('users');

    console.log('Creating Firepad instance...');
    
    // Create Firepad with minimal options
    firepad = Firepad.fromACE(firepadRef, editor, {
      defaultText: isNew ? defaultCode.javascript : '',
      userId: currentUser.id
    });
    
    // Setup ready handler ONCE
    firepad.on('ready', function() {
      if (firepadReady) {
        console.warn('Firepad ready already triggered, ignoring duplicate');
        return;
      }
      firepadReady = true;
      
      console.log('✅ Firepad is ready');
      
      // Ensure editor is editable
      editor.setReadOnly(false);
      
      // Setup presence AFTER Firepad is ready
      setTimeout(() => setupPresenceOnce(), 100);
      
      // Setup session info
      setupSessionInfo();
      
      // Setup settings sync
      setupSettingsSync();
    });
  }

  // Setup presence (ONCE)
  let presenceSetup = false;
  function setupPresenceOnce() {
    if (presenceSetup) {
      console.log('Presence already setup');
      return;
    }
    presenceSetup = true;
    
    const userRef = usersRef.child(currentUser.id);
    
    // Set user data
    userRef.set({
      name: currentUser.name,
      color: currentUser.color,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Remove on disconnect
    userRef.onDisconnect().remove();

    // Listen for users ONCE
    usersRef.on('value', function(snapshot) {
      const users = snapshot.val() || {};
      updateUsersList(users);
      updateUserCount(users);
    });

    // Monitor connection
    firebase.database().ref('.info/connected').on('value', function(snapshot) {
      updateConnectionStatus(snapshot.val());
    });
  }

  // Update users list
  function updateUsersList(users) {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    Object.keys(users).forEach(userId => {
      const user = users[userId];
      const badge = document.createElement('div');
      badge.className = 'user-badge';
      if (userId === currentUser.id) {
        badge.className += ' current-user';
      }
      badge.textContent = user.name;
      badge.style.borderLeft = `3px solid ${user.color}`;
      usersList.appendChild(badge);
    });
  }

  // Update user count
  function updateUserCount(users) {
    const count = Object.keys(users).length;
    const userCountEl = document.getElementById('user-count');
    if (userCountEl) {
      userCountEl.textContent = `${count} ${count === 1 ? 'user' : 'users'} online`;
    }
  }

  // Update connection status
  function updateConnectionStatus(connected) {
    const status = document.getElementById('connection-status');
    if (status) {
      status.textContent = connected ? 'Connected' : 'Disconnected';
      status.className = connected ? 'connected' : 'disconnected';
    }
  }

  // Setup session info
  function setupSessionInfo() {
    const sessionInfo = document.getElementById('session-info');
    if (sessionInfo && !sessionInfo.innerHTML.includes(currentSessionCode)) {
      sessionInfo.innerHTML = `Session Code: <strong>${currentSessionCode}</strong>`;
    }
  }

  // Settings sync (simplified)
  function setupSettingsSync() {
    const settingsRef = sessionRef.child('settings');
    
    // Language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
      // Remove old listeners
      const newLanguageSelector = languageSelector.cloneNode(true);
      languageSelector.parentNode.replaceChild(newLanguageSelector, languageSelector);
      
      newLanguageSelector.addEventListener('change', function() {
        const language = this.value;
        settingsRef.child('language').set(language);
        changeLanguage(language);
      });
    }

    // Theme selector
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
      // Remove old listeners
      const newThemeSelector = themeSelector.cloneNode(true);
      themeSelector.parentNode.replaceChild(newThemeSelector, themeSelector);
      
      newThemeSelector.addEventListener('change', function() {
        const theme = this.value;
        settingsRef.child('theme').set(theme);
        editor.setTheme(`ace/theme/${theme}`);
      });
    }

    // Listen for settings changes
    settingsRef.on('value', function(snapshot) {
      const settings = snapshot.val();
      if (settings) {
        if (settings.language) {
          const selector = document.getElementById('language-selector');
          if (selector && selector.value !== settings.language) {
            selector.value = settings.language;
            changeLanguage(settings.language);
          }
        }
        if (settings.theme) {
          const selector = document.getElementById('theme-selector');
          if (selector && selector.value !== settings.theme) {
            selector.value = settings.theme;
            editor.setTheme(`ace/theme/${settings.theme}`);
          }
        }
      }
    });
  }

  // Change language
  function changeLanguage(language) {
    const config = languageConfig[language];
    if (config) {
      session.setMode(config.mode);
    }
  }

  // Setup event listeners ONCE
  let listenersSetup = false;
  function setupEventListenersOnce() {
    if (listenersSetup) {
      console.log('Event listeners already setup');
      return;
    }
    listenersSetup = true;
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', shareSession);
    }

    // Run button
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', runCode);
    }

    // Clear output
    const clearBtn = document.getElementById('clear-output');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearOutput);
    }

    // Close output
    const closeBtn = document.getElementById('close-output');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideOutput);
    }

    // Cursor position
    if (editor) {
      editor.on('changeSelection', updateCursorPosition);
    }

    // Font size selector
    const fontSizeSelector = document.getElementById('fontSize-selector');
    if (fontSizeSelector) {
      fontSizeSelector.addEventListener('change', function() {
        editor.setFontSize(this.value + 'px');
      });
    }
  }

  // Share session
  function shareSession() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentSessionCode).then(function() {
        showNotification(`Session code ${currentSessionCode} copied!`);
      });
    } else {
      prompt('Share this code:', currentSessionCode);
    }
  }

  // Run code
  async function runCode() {
    const runBtn = document.getElementById('run-btn');
    const language = document.getElementById('language-selector').value;
    const code = editor.getValue();
    const input = document.getElementById('stdin-input').value;

    if (!CodeExecutor.isSupported(language)) {
      showOutput(`Language '${language}' does not support execution yet.`, 'error');
      return;
    }

    showOutput('Running...', 'info');
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';

    try {
      const result = await CodeExecutor.execute(language, code, input);
      
      if (result.success) {
        let output = result.output || '(No output)';
        if (result.executionTime) {
          output += `\n\nExecution time: ${result.executionTime}ms`;
        }
        showOutput(output, 'success');
      } else {
        showOutput(result.error || 'Execution failed', 'error');
      }
    } catch (error) {
      showOutput(`Error: ${error.message}`, 'error');
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = '▶ Run';
    }
  }

  // Show output
  function showOutput(text, type = 'normal') {
    const outputPanel = document.getElementById('output-panel');
    const outputText = document.getElementById('output-text');
    
    outputPanel.style.display = 'flex';
    outputText.textContent = text;
    outputText.className = type;

    const language = document.getElementById('language-selector').value;
    const inputSection = document.getElementById('input-section');
    if (['python', 'java', 'c_cpp', 'javascript'].includes(language)) {
      inputSection.style.display = 'block';
    }
  }

  // Clear output
  function clearOutput() {
    const outputText = document.getElementById('output-text');
    outputText.textContent = '';
    outputText.className = '';
  }

  // Hide output
  function hideOutput() {
    const outputPanel = document.getElementById('output-panel');
    outputPanel.style.display = 'none';
  }

  // Show notification
  function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 14px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Update cursor position
  function updateCursorPosition() {
    const position = editor.getCursorPosition();
    const display = document.getElementById('cursor-position');
    if (display) {
      display.textContent = `Line ${position.row + 1}, Column ${position.column + 1}`;
    }
  }

  // Generate user color
  function generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#FFD700', '#FF69B4', '#00CED1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

})();
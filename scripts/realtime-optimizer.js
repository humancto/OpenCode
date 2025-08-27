// Real-time Performance Optimizer
const RealtimeOptimizer = (function() {
  
  // Optimize Firebase connection
  function optimizeFirebase() {
    // Enable offline persistence for better performance
    if (firebase.database) {
      // Force WebSocket connection (faster than long-polling)
      firebase.database.INTERNAL.forceWebSockets();
      
      // Reduce latency with keepalive
      firebase.database().goOnline();
      
      // Set custom connection timeouts
      firebase.database.INTERNAL.setWebSocketFailureRetryTimeout(1000);
    }
  }

  // Create optimized Firepad instance
  function createOptimizedFirepad(firepadRef, editor, options) {
    // Merge optimization options
    const optimizedOptions = Object.assign({}, options, {
      // Reduce sync interval for faster updates
      syncInterval: 100, // Default is 250ms
      
      // Send changes immediately
      sendChangesImmediately: true,
      
      // Increase operation buffer for smoother sync
      maxCachedOps: 100,
      
      // Enable cursor preservation
      preserveCursor: true
    });

    // Create Firepad with optimizations
    const firepad = Firepad.fromACE(firepadRef, editor, optimizedOptions);
    
    // Add custom event handlers for better responsiveness
    setupRealtimeHandlers(firepad, editor);
    
    return firepad;
  }

  // Setup real-time event handlers
  function setupRealtimeHandlers(firepad, editor) {
    let localChanges = false;
    let remoteChanges = false;
    
    // Track local changes
    editor.on('change', function(delta) {
      localChanges = true;
      // Immediate visual feedback
      updateSyncIndicator('syncing');
      
      // Debounced sync confirmation
      clearTimeout(window.syncTimeout);
      window.syncTimeout = setTimeout(() => {
        if (!remoteChanges) {
          updateSyncIndicator('synced');
        }
        localChanges = false;
      }, 200);
    });
    
    // Track remote changes
    firepad.on('synced', function(isSynced) {
      if (isSynced) {
        updateSyncIndicator('synced');
      }
    });
    
    // Optimize cursor tracking
    let cursorTimeout;
    editor.selection.on('changeCursor', function() {
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(() => {
        // Broadcast cursor position
        if (firepad.firebaseAdapter_) {
          const cursor = editor.getCursorPosition();
          firepad.firebaseAdapter_.sendCursor(cursor);
        }
      }, 50); // Reduced from default 250ms
    });
  }

  // Update sync indicator
  function updateSyncIndicator(status) {
    const indicator = document.getElementById('sync-indicator');
    if (!indicator) {
      createSyncIndicator();
    }
    
    const dot = document.querySelector('#sync-indicator .sync-dot');
    if (dot) {
      dot.className = 'sync-dot ' + status;
    }
  }

  // Create sync indicator
  function createSyncIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: #2d2d2d;
      border-radius: 20px;
      font-size: 12px;
      color: #ccc;
      z-index: 1000;
    `;
    
    indicator.innerHTML = `
      <div class="sync-dot"></div>
      <span>Sync</span>
    `;
    
    document.body.appendChild(indicator);
    
    // Add styles for sync dot
    const style = document.createElement('style');
    style.textContent = `
      .sync-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      .sync-dot.synced {
        background: #4caf50;
        animation: none;
      }
      .sync-dot.syncing {
        background: #ff9800;
        animation: pulse 1s infinite;
      }
      .sync-dot.error {
        background: #f44336;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }

  // Optimize ACE editor for real-time collaboration
  function optimizeACE(editor) {
    editor.setOptions({
      // Reduce render delay
      animatedScroll: false,
      
      // Faster cursor movement
      dragDelay: 0,
      
      // Immediate feedback
      tooltipFollowsMouse: false,
      
      // Reduce render overhead
      maxLines: Infinity,
      minLines: 10,
      
      // Performance options
      useSoftTabs: true,
      navigateWithinSoftTabs: false,
      
      // Disable features that slow down real-time sync
      enableMultiselect: false,
      highlightSelectedWord: false,
      
      // Faster text input
      behavioursEnabled: true,
      wrapBehavioursEnabled: true
    });
    
    // Use efficient renderer
    editor.renderer.setOption('useTextareaForIME', false);
    editor.renderer.setOption('showInvisibles', false);
    editor.renderer.setOption('showPrintMargin', false);
    
    // Optimize scrolling
    editor.renderer.scrollBarV.setScrollSpeed(0.1);
    editor.renderer.scrollBarH.setScrollSpeed(0.1);
  }

  // Monitor and report latency
  function monitorLatency() {
    const startTime = Date.now();
    const testRef = firebase.database().ref('.info/serverTimeOffset');
    
    testRef.on('value', function(snapshot) {
      const offset = snapshot.val();
      const latency = Date.now() - startTime;
      
      console.log(`Firebase latency: ${latency}ms, Server offset: ${offset}ms`);
      
      // Show warning if latency is high
      if (latency > 500) {
        console.warn('High latency detected. Consider using a closer Firebase region.');
      }
    });
  }

  // Public API
  return {
    optimizeFirebase,
    createOptimizedFirepad,
    optimizeACE,
    monitorLatency,
    updateSyncIndicator
  };
})();
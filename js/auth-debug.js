/**
 * auth-debug.js
 * Tools for debugging and fixing authentication issues
 */

window.authDebug = {
    /**
     * Display detailed debug information about authentication state
     */
    showDebugInfo: function() {
        console.log('[AUTH DEBUG] Gathering authentication debug info...');
        
        const debugInfo = {
            secureSession: {
                available: !!window.secureSession,
                functions: window.secureSession ? Object.keys(window.secureSession) : [],
                isValid: window.secureSession && typeof window.secureSession.isSessionValid === 'function' 
                    ? window.secureSession.isSessionValid() 
                    : 'Function not available'
            },
            localStorage: {
                nl_access_token: localStorage.getItem('nl_access_token'),
                nl_token_timestamp: localStorage.getItem('nl_token_timestamp'),
                nl_user_data: localStorage.getItem('nl_user_data'),
                supabase_token: localStorage.getItem('sb-txggovndoxdybdquopvx-auth-token') ? 'Present' : 'Not found'
            },
            adaptiveAuthUI: {
                available: !!window.adaptiveAuthUI,
                functions: window.adaptiveAuthUI ? Object.keys(window.adaptiveAuthUI) : []
            },
            containers: {
                desktop: document.querySelector('#auth-ui-container') ? 'Found' : 'Not found',
                mobile: document.querySelector('#mobile-auth-container') ? 'Found' : 'Not found'
            }
        };
        
        console.log('[AUTH DEBUG] Debug info:', debugInfo);
        
        // Format and show on page if element exists
        const authDebugElement = document.getElementById('auth-debug-info');
        if (authDebugElement) {
            let html = '<h3 class="text-xl font-semibold mb-3">Auth Debug Info</h3>';
            
            // Secure Session
            html += '<div class="mb-4">';
            html += '<h4 class="font-bold">Secure Session:</h4>';
            html += `<div class="ml-4">Available: <span class="${debugInfo.secureSession.available ? 'text-green-400' : 'text-red-400'}">${debugInfo.secureSession.available}</span></div>`;
            if (debugInfo.secureSession.available) {
                html += '<div class="ml-4">Functions: ' + debugInfo.secureSession.functions.join(', ') + '</div>';
                html += `<div class="ml-4">isSessionValid(): <span class="${debugInfo.secureSession.isValid ? 'text-green-400' : 'text-red-400'}">${debugInfo.secureSession.isValid}</span></div>`;
            }
            html += '</div>';
            
            // localStorage
            html += '<div class="mb-4">';
            html += '<h4 class="font-bold">localStorage Tokens:</h4>';
            const tokenExists = !!debugInfo.localStorage.nl_access_token;
            html += `<div class="ml-4">nl_access_token: <span class="${tokenExists ? 'text-green-400' : 'text-red-400'}">${tokenExists ? 'Present' : 'Not found'}</span></div>`;
            
            const timestampExists = !!debugInfo.localStorage.nl_token_timestamp;
            let timestampValid = false;
            let timestampAge = '';
            
            if (timestampExists) {
                const timestamp = parseInt(debugInfo.localStorage.nl_token_timestamp);
                const now = Date.now();
                const age = now - timestamp;
                const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes
                timestampValid = age < SESSION_DURATION;
                timestampAge = `${(age / 1000 / 60).toFixed(2)} minutes ago`;
            }
            
            html += `<div class="ml-4">nl_token_timestamp: <span class="${timestampExists ? 'text-green-400' : 'text-red-400'}">${timestampExists ? 'Present' : 'Not found'}</span>`;
            if (timestampExists) {
                html += ` (${timestampAge}, <span class="${timestampValid ? 'text-green-400' : 'text-red-400'}">${timestampValid ? 'Valid' : 'Expired'}</span>)`;
            }
            html += '</div>';
            
            const userDataExists = !!debugInfo.localStorage.nl_user_data;
            html += `<div class="ml-4">nl_user_data: <span class="${userDataExists ? 'text-green-400' : 'text-red-400'}">${userDataExists ? 'Present' : 'Not found'}</span></div>`;
            
            const supabaseTokenExists = debugInfo.localStorage.supabase_token === 'Present';
            html += `<div class="ml-4">Supabase Token: <span class="${supabaseTokenExists ? 'text-green-400' : 'text-red-400'}">${debugInfo.localStorage.supabase_token}</span></div>`;
            html += '</div>';
            
            authDebugElement.innerHTML = html;
        }
        
        return debugInfo;
    },
    
    /**
     * Create test tokens for debugging
     */
    createTestTokens: function() {
        console.log('[AUTH DEBUG] Creating test tokens...');
        
        // Fix any issues with the secure session implementation
        this.fixSecureSessionSystem();
        
        // Create timestamp (current time)
        const timestamp = Date.now();
        localStorage.setItem('nl_token_timestamp', timestamp.toString());
        
        // Create dummy access token
        localStorage.setItem('nl_access_token', 'test_debug_token_' + timestamp);
        
        // Create dummy user data
        const userData = {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
                name: 'Test User'
            }
        };
        localStorage.setItem('nl_user_data', JSON.stringify(userData));
        
        console.log('[AUTH DEBUG] Test tokens created');
        
        // Force a manual check of the session
        if (window.secureSession && typeof window.secureSession.isSessionValid === 'function') {
            const isValid = window.secureSession.isSessionValid();
            console.log('[AUTH DEBUG] Session valid check after creating tokens:', isValid);
        }
        
        return true;
    },
    
    /**
     * Clear all authentication tokens
     */
    clearAllTokens: function() {
        console.log('[AUTH DEBUG] Clearing all authentication tokens...');
        
        localStorage.removeItem('nl_access_token');
        localStorage.removeItem('nl_refresh_token');
        localStorage.removeItem('nl_token_timestamp');
        localStorage.removeItem('nl_user_data');
        localStorage.removeItem('sb-txggovndoxdybdquopvx-auth-token');
        
        console.log('[AUTH DEBUG] All tokens cleared');
        return true;
    },
    
    /**
     * Force update of the auth UI
     */
    forceUpdate: function() {
        console.log('[AUTH DEBUG] Forcing auth UI update...');
        
        if (window.adaptiveAuthUI && typeof window.adaptiveAuthUI.initAdaptiveAuthUI === 'function') {
            window.adaptiveAuthUI.initAdaptiveAuthUI();
            return true;
        } else {
            console.error('[AUTH DEBUG] adaptiveAuthUI not available!');
            return false;
        }
    },
    
    /**
     * Fix the secure session system if it's not working properly
     */
    fixSecureSessionSystem: function() {
        console.log('[AUTH DEBUG] Checking secure session system...');
        
        // Check if secureSession global object is missing or incomplete
        if (!window.secureSession || 
            typeof window.secureSession.isSessionValid !== 'function' || 
            typeof window.secureSession.getUserData !== 'function') {
            
            console.log('[AUTH DEBUG] secureSession missing or incomplete, creating backup implementation');
            
            // Create a minimal secureSession implementation if it doesn't exist
            window.secureSession = window.secureSession || {};
            
            // Fixed implementation of isSessionValid
            window.secureSession.isSessionValid = function() {
                try {
                    const token = localStorage.getItem('nl_access_token');
                    const timestamp = localStorage.getItem('nl_token_timestamp');
                    
                    if (!token || !timestamp) {
                        console.log('[AUTH DEBUG] No token or timestamp found');
                        return false;
                    }
                    
                    // Check if token is expired (older than 5 minutes)
                    const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes
                    const timeSinceIssued = Date.now() - parseInt(timestamp);
                    const isValid = timeSinceIssued < SESSION_DURATION;
                    
                    console.log(`[AUTH DEBUG] Token age: ${timeSinceIssued / 1000 / 60} minutes, valid: ${isValid}`);
                    return isValid;
                } catch (error) {
                    console.error('[AUTH DEBUG] Error in isSessionValid:', error);
                    return false;
                }
            };
            
            // Fixed implementation of getUserData
            window.secureSession.getUserData = function() {
                try {
                    const userData = localStorage.getItem('nl_user_data');
                    if (userData) {
                        return JSON.parse(userData);
                    }
                    
                    // If no custom user data, check if there's a token and create minimal user data
                    const token = localStorage.getItem('nl_access_token');
                    if (token) {
                        return {
                            id: 'unknown',
                            email: 'user@example.com',
                            user_metadata: {
                                name: 'User'
                            }
                        };
                    }
                    
                    return null;
                } catch (error) {
                    console.error('[AUTH DEBUG] Error in getUserData:', error);
                    return null;
                }
            };
            
            console.log('[AUTH DEBUG] Secure session backup implementation created');
        } else {
            console.log('[AUTH DEBUG] Secure session system appears to be working properly');
        }
        
        return true;
    },
    
    /**
     * Initialize the auth debug system
     */
    init: function() {
        console.log('[AUTH DEBUG] Initializing auth debug system...');
        this.fixSecureSessionSystem();
    }
};

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.authDebug.init();
    }, 500);
}); 
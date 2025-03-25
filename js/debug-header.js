/**
 * Debug script to diagnose header loading issues
 */

document.addEventListener('DOMContentLoaded', function() {
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '0';
    debugDiv.style.left = '0';
    debugDiv.style.right = '0';
    debugDiv.style.padding = '10px';
    debugDiv.style.background = 'rgba(0,0,0,0.8)';
    debugDiv.style.color = '#00ff00';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.fontSize = '12px';
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.style.display = 'none'; // Hide the debug panel by default
    
    // Check component loading functions
    let status = '';
    
    // Check if header container exists
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        status += `Header container exists. `;
        status += `innerHTML length: ${headerContainer.innerHTML.length}. `;
        status += `Visible: ${!(headerContainer.offsetParent === null)}. `;
        status += `Display: ${window.getComputedStyle(headerContainer).display}. `;
        status += `Hidden: ${headerContainer.hidden}. `;
    } else {
        status += `Header container does not exist. `;
    }
    
    // Check if loadComponent exists
    if (typeof loadComponent === 'function') {
        status += `loadComponent function exists. `;
        status += `Function source: ${loadComponent.toString().substring(0, 50)}... `;
    } else {
        status += `loadComponent function does not exist. `;
    }
    
    // Check component events
    if (window.componentEvents) {
        status += `Component events: ${JSON.stringify(window.componentEvents)}. `;
    } else {
        status += `No component events found. `;
    }
    
    // Check script loading
    const scripts = Array.from(document.getElementsByTagName('script'));
    const componentsJsLoaded = scripts.some(script => script.src.includes('components.js'));
    status += `components.js loaded: ${componentsJsLoaded}. `;
    
    // Get all script sources for debugging
    status += `\nLoaded scripts: `;
    scripts.forEach(script => {
        if (script.src) {
            status += `\n- ${script.src}`;
        }
    });
    
    // Add path info
    status += `\n\nCurrent path: ${window.location.pathname}`;
    status += `\nBase URL: ${window.location.origin}`;
    
    // Check if header component request succeeds
    status += `\n\nTesting component loading directly:`;
    
    // Add a check for components directory
    status += `\n\nChecking components/header.html availability...`;
    
    // Add a fetch test to see if we can fetch the header
    fetch('/components/header.html')
        .then(response => {
            if (response.ok) {
                status += `\nHeader fetch successful: ${response.status} ${response.statusText}`;
                return response.text();
            } else {
                status += `\nHeader fetch failed: ${response.status} ${response.statusText}`;
                throw new Error(`Failed to fetch header: ${response.status}`);
            }
        })
        .then(html => {
            status += `\nHeader content length: ${html.length} chars`;
            debugDiv.innerHTML = status;
        })
        .catch(error => {
            status += `\nFetch error: ${error.message}`;
            debugDiv.innerHTML = status;
            
            // Try with a direct test-header fetch as backup
            fetch('/components/test-header.html')
                .then(response => {
                    status += `\nTest-header fetch result: ${response.status} ${response.statusText}`;
                    debugDiv.innerHTML = status;
                })
                .catch(testError => {
                    status += `\nTest-header fetch error: ${testError.message}`;
                    debugDiv.innerHTML = status;
                });
        });
    
    debugDiv.innerHTML = status;
    document.body.appendChild(debugDiv);
    
    // Create a small button to toggle debug panel
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Debug';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '10px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.padding = '5px 10px';
    toggleBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    toggleBtn.style.color = '#00ff00';
    toggleBtn.style.border = '1px solid #00ff00';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.fontSize = '12px';
    toggleBtn.style.zIndex = '9998';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.opacity = '0.5';
    
    toggleBtn.addEventListener('click', function() {
        debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
    });
    
    // Hover effect
    toggleBtn.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });
    
    toggleBtn.addEventListener('mouseout', function() {
        this.style.opacity = '0.5';
    });
    
    document.body.appendChild(toggleBtn);
    
    // Also listen for Ctrl+Shift+D to toggle
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    // Force load of header
    if (headerContainer && typeof loadComponent === 'function') {
        setTimeout(() => {
            status += `\n\nAttempting to force load header...`;
            debugDiv.innerHTML = status;
            
            try {
                loadComponent('header', 'header-container', function() {
                    status += `\nHeader force-loaded callback executed.`;
                    status += `\nHeader HTML length after force-load: ${headerContainer.innerHTML.length}`;
                    debugDiv.innerHTML = status;
                });
            } catch (e) {
                status += `\nError during force load: ${e.message}`;
                debugDiv.innerHTML = status;
            }
        }, 1000);
    }
});
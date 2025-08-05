// EMERGENCY FIX - Run this in browser console to stop the M.find error
// This is a temporary workaround until the server restart takes effect

console.log('🚨 EMERGENCY FIX: Installing error handlers...');

// Override the global error handler
const originalError = window.console.error;
window.console.error = function(...args) {
  const message = args.join(' ');
  
  // Catch the specific M.find error and reload page
  if (message.includes('M.find is not a function') || 
      message.includes('find is not a function')) {
    console.log('🔧 Caught M.find error - reloading page in 2 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  }
  
  // Call original error handler for other errors
  originalError.apply(console, args);
};

// Install global error event handler
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('find is not a function')) {
    console.log('🔧 Caught global find error - reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    event.preventDefault();
    return true;
  }
});

// Install unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.message && 
      event.reason.message.includes('find is not a function')) {
    console.log('🔧 Caught promise rejection find error - reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    event.preventDefault();
  }
});

// Monkey patch Array.prototype.find to add debugging
const originalFind = Array.prototype.find;
Array.prototype.find = function(callback, thisArg) {
  if (typeof this.find !== 'function') {
    console.error('🚨 CRITICAL: find called on non-array:', typeof this, this);
    return undefined;
  }
  
  if (!Array.isArray(this)) {
    console.error('🚨 CRITICAL: find called on non-array object:', typeof this, this);
    return undefined;
  }
  
  try {
    return originalFind.call(this, callback, thisArg);
  } catch (error) {
    console.error('🚨 CRITICAL: Error in find operation:', error);
    return undefined;
  }
};

console.log('✅ Emergency error handlers installed');
console.log('🔄 If you see the M.find error, the page will auto-reload');
console.log('💡 This is a temporary fix - restart your development server for permanent solution');

// Also add a manual reload button to the page
const reloadButton = document.createElement('button');
reloadButton.innerHTML = '🔄 Emergency Reload';
reloadButton.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  background: #ff4444;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;
reloadButton.onclick = () => window.location.reload();
document.body.appendChild(reloadButton);

console.log('🆘 Added emergency reload button to top-right corner');

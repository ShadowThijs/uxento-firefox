// Header Modifier for Firefox Extension
// This file modifies the Origin header for requests to api.uxento.io

// Chrome extension ID to impersonate
const CHROME_EXTENSION_ID = 'ohhmillgdcfefdljfoojejpaicdfgbao';

// Listen for web requests and modify headers before they're sent
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // Log the original headers for debugging
    console.log('Original headers:', JSON.stringify(details.requestHeaders));
    
    // Find and modify the Origin header
    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'origin' && header.value.startsWith('moz-extension://')) {
        // Replace with Chrome extension origin
        header.value = `chrome-extension://${CHROME_EXTENSION_ID}`;
        console.log('Modified Origin header to:', header.value);
        break;
      }
    }
    
    // Add additional headers that might help with identification
    let hasReferer = false;
    let hasXRequestedWith = false;
    
    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'referer') {
        hasReferer = true;
        header.value = `chrome-extension://${CHROME_EXTENSION_ID}/popup.html`;
      }
      if (header.name.toLowerCase() === 'x-requested-with') {
        hasXRequestedWith = true;
        header.value = 'XMLHttpRequest';
      }
    }
    
    if (!hasReferer) {
      details.requestHeaders.push({
        name: 'Referer',
        value: `chrome-extension://${CHROME_EXTENSION_ID}/popup.html`
      });
    }
    
    if (!hasXRequestedWith) {
      details.requestHeaders.push({
        name: 'X-Requested-With',
        value: 'XMLHttpRequest'
      });
    }
    
    // Add Chrome extension ID header
    details.requestHeaders.push({
      name: 'X-Extension-ID',
      value: CHROME_EXTENSION_ID
    });
    
    // Log the modified headers for debugging
    console.log('Modified headers:', JSON.stringify(details.requestHeaders));
    
    return { requestHeaders: details.requestHeaders };
  },
  // Apply to all requests to api.uxento.io
  { urls: ["*://api.uxento.io/*"] },
  ["blocking", "requestHeaders"]
);

console.log('Header modifier loaded and active for api.uxento.io');

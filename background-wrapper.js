// This script detects the browser and loads the appropriate background script

// Check if we're running in Firefox
const isFirefox = typeof browser !== 'undefined';

// If browser is defined, we're in Firefox
if (isFirefox) {
  // Firefox-specific code is in index.firefox.js
  // It will be loaded via the manifest.json background scripts array
  console.log('Running in Firefox');
} else {
  // We're in Chrome or another Chromium-based browser
  console.log('Running in Chrome or other Chromium browser');
  
  // Original Chrome code
  chrome.commands?.onCommand.addListener(command => {
    if (command === "open-extension") {
      chrome.action.openPopup();
    }
  });

  chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
      chrome.tabs.create({
        url: chrome.runtime.getURL("options.html")
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchBalance") {
      if (!message.wallet) {
        sendResponse({ success: false, error: "No wallet address provided." });
        return;
      }

      let requestData = {
        name: "nativeBalances",
        data: {
          walletAddresses: [message.wallet],
          chainIds: [1399811149]
        }
      };

      fetch("https://api-neo.bullx.io/v2/api/nativeBalances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        },
        body: JSON.stringify(requestData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          let balance = data.nativeBalances?.[message.wallet]?.["1399811149"];
          if (balance != null) {
            sendResponse({ success: true, balance: balance / 1e9 });
          } else {
            sendResponse({ success: false, error: "Balance not found in response." });
          }
        })
        .catch(error => {
          sendResponse({ success: false, error: error.toString() });
        });

      return true;
    }
    return false;
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchRepoData") {
      fetch(`https://www.uxento.io/api/health?repo=${encodeURIComponent(message.repo)}`)
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error }));
      return true;
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetchAlphaData") {
      if (message.tokens && Array.isArray(message.tokens)) {
        fetch("https://www.uxento.io/api/pulse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tokens: message.tokens })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            sendResponse({ success: true, data });
          })
          .catch(error => {
            console.error("Background fetch error:", error);
            sendResponse({ success: false, error: error.toString() });
          });
      } else if (message.tokenAddress && typeof message.tokenAddress === "string") {
        fetch("https://www.uxento.io/api/pulse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tokens: [message.tokenAddress] })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            sendResponse({ success: true, data });
          })
          .catch(error => {
            console.error("Background fetch error:", error);
            sendResponse({ success: false, error: error.toString() });
          });
      } else {
        sendResponse({ success: false, error: "Invalid parameters" });
      }
      return true;
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setAddress") {
      chrome.storage.local.set({ storedAddress: message.address }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
    
    if (message.action === "getAddress") {
      chrome.storage.local.get("storedAddress", result => {
        sendResponse({ address: result.storedAddress || "" });
      });
      return true;
    }
    
    if (message.action === "linksFound") {
      chrome.storage.local.set({
        storedTwitterLink: message.twitterLink || "",
        storedWebsiteLink: message.websiteLink || ""
      }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
    
    if (message.action === "getTwitterLink") {
      chrome.storage.local.get("storedTwitterLink", result => {
        sendResponse({ twitterLink: result.storedTwitterLink || "" });
      });
      return true;
    }
    
    if (message.action === "getWebsiteLink") {
      chrome.storage.local.get("storedWebsiteLink", result => {
        sendResponse({ websiteLink: result.storedWebsiteLink || "" });
      });
      return true;
    }
    
    if (message.action === "axiomDataFound") {
      let data = {
        tokenAddress: message.tokenAddress || "",
        twitterLink: message.twitterLink || "",
        websiteLink: message.websiteLink || "",
        tokenName: message.tokenName || "",
        tokenTicker: message.tokenTicker || "",
        deployerAddress: message.deployerAddress || ""
      };
      
      chrome.storage.local.set({ storedAxiomData: data }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
    
    if (message.action === "getAxiomData") {
      chrome.storage.local.get("storedAxiomData", result => {
        sendResponse(result.storedAxiomData || {});
      });
      return true;
    }
    
    if (message.action === "tokenDataFound") {
      let data = {
        symbol: message.symbol || "",
        deployerAddress: message.deployerAddress || ""
      };
      
      chrome.storage.local.set({ storedTokenData: data }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
    
    if (message.action === "getTokenData") {
      chrome.storage.local.get("storedTokenData", result => {
        sendResponse(result.storedTokenData || {});
      });
      return true;
    }
  });
}

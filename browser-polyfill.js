// This polyfill provides a compatibility layer for Chrome extensions to work in Firefox
(function() {
  if (typeof globalThis.browser === 'undefined' && typeof globalThis.chrome !== 'undefined') {
    globalThis.browser = (function() {
      const api = {};
      
      // Runtime API
      api.runtime = {
        getURL: chrome.runtime.getURL,
        sendMessage: function(message, callback) {
          if (callback) {
            return chrome.runtime.sendMessage(message, callback);
          }
          return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(response);
              }
            });
          });
        },
        onMessage: chrome.runtime.onMessage,
        onInstalled: chrome.runtime.onInstalled,
        lastError: chrome.runtime.lastError
      };
      
      // Storage API
      api.storage = {
        local: {
          get: function(keys) {
            return new Promise((resolve, reject) => {
              chrome.storage.local.get(keys, (result) => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve(result);
                }
              });
            });
          },
          set: function(items) {
            return new Promise((resolve, reject) => {
              chrome.storage.local.set(items, () => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve();
                }
              });
            });
          }
        }
      };
      
      // Tabs API
      api.tabs = {
        create: function(createProperties) {
          return new Promise((resolve, reject) => {
            chrome.tabs.create(createProperties, (tab) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(tab);
              }
            });
          });
        }
      };
      
      // Action API (browser.action in Firefox, chrome.action in Chrome)
      api.action = {
        openPopup: chrome.action ? chrome.action.openPopup : function() {
          console.warn('browser.action.openPopup not supported');
        }
      };
      
      // Commands API
      api.commands = chrome.commands ? {
        onCommand: chrome.commands.onCommand
      } : {};
      
      return api;
    })();
  }
})();

// Firefox-compatible background script

let REPORTS_KEY = "uxentoReports";
let FETCH_ALARM_NAME = "fetchReportsHourly";

function setupNextFetch() {
  // Schedule next fetch at the beginning of the next hour
  let now = new Date();
  let nextHour = new Date(now);
  nextHour.setUTCSeconds(0, 0);
  nextHour.setUTCMinutes(1);
  nextHour.setUTCHours(nextHour.getUTCHours() + 1);
  let delayMs = nextHour.getTime() - now.getTime();

  browser.alarms.create(FETCH_ALARM_NAME, {
    when: Date.now() + delayMs,
  });
}

async function fetchReports() {
  try {
    let response = await fetch("https://api.uxento.io/reports", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    let text = await response.text();
    let reports = await decryptData(text, getDecryptionKey());

    await browser.storage.local.set({
      [REPORTS_KEY]: reports,
      uxentoReportsLastFetch: Date.now(),
    });
  } catch (error) {
    console.error("[Uxento] reports fetch failed:", error);
  } finally {
    setupNextFetch();
  }
}

function getDecryptionKey() {
  return "EyG2k4jGF0FVYGi8urLnuxgq183VkE1m";
}

async function decryptData(ciphertext, key) {
  try {
    let iv = ciphertext.slice(0, 32);
    let data = ciphertext.slice(32);

    let ivArray = Uint8Array.from(iv.match(/../g).map((h) => parseInt(h, 16)));
    let dataArray = Uint8Array.from(
      data.match(/../g).map((h) => parseInt(h, 16)),
    );
    let keyArray = new TextEncoder().encode(key);

    let cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyArray,
      { name: "AES-CBC", length: 256 },
      false,
      ["decrypt"],
    );

    let decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: ivArray },
      cryptoKey,
      dataArray,
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error) {
    console.error("decrypt-error:", error);
    throw new Error("Decrypt failed");
  }
}

function checkResponse(response) {
  if (!response.ok) throw new Error(`Status error: ${response.status}`);
  return response.text();
}

function processPulseRequest(tokens, sendResponse) {
  fetch("https://api.uxento.io/pulse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokens: tokens }),
  })
    .then(checkResponse)
    .then((text) => decryptData(text, getDecryptionKey()))
    .then((data) => sendResponse({ success: true, data: data }))
    .catch((error) => {
      console.error("Process error:", error);
      sendResponse({ success: false, error: error.toString() });
    });
}

// Initialize extension
(async function init() {
  let storage = await browser.storage.local.get(REPORTS_KEY);
  if (storage[REPORTS_KEY]) {
    setupNextFetch();
  } else {
    await fetchReports();
  }
})().catch(console.error);

// Set up alarm listener
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === FETCH_ALARM_NAME) {
    fetchReports().catch(console.error);
  }
});

// Handle messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === "ensureReports") {
    browser.storage.local.get(REPORTS_KEY).then((storage) => {
      if (storage[REPORTS_KEY]) {
        sendResponse({ success: true, cached: true });
      } else {
        fetchReports()
          .then(() => sendResponse({ success: true, cached: false }))
          .catch((error) =>
            sendResponse({ success: false, error: error.toString() }),
          );
      }
    });
    return true;
  }
});

// Command listener
browser.commands?.onCommand.addListener((command) => {
  if (command === "open-extension") {
    browser.action.openPopup();
  }
});

// Installation handler
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.tabs.create({
      url: browser.runtime.getURL("options.html"),
    });
  }
});

// Wallet balance handler
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchBalance") {
    if (!message.wallet) {
      sendResponse({ success: false, error: "No wallet address provided." });
      return true;
    }

    let requestData = {
      name: "nativeBalances",
      data: {
        walletAddresses: [message.wallet],
        chainIds: [1399811149],
      },
    };

    fetch("https://api-neo.bullx.io/v2/api/nativeBalances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
      })
      .then((data) => {
        let balance = data.nativeBalances?.[message.wallet]?.["1399811149"];
        if (balance != null) {
          sendResponse({ success: true, balance: balance / 1e9 });
        } else {
          sendResponse({
            success: false,
            error: "Balance not found in response.",
          });
        }
      })
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );

    return true;
  }
});

// Repository data handler
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchRepoData") {
    fetch(
      `https://www.uxento.io/api/health?repo=${encodeURIComponent(message.repo)}`,
    )
      .then((response) => response.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );
    return true;
  }
});

// Alpha data handler
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchAlphaData") {
    if (message.tokens && Array.isArray(message.tokens)) {
      processPulseRequest(message.tokens, sendResponse);
    } else if (
      message.tokenAddress &&
      typeof message.tokenAddress === "string"
    ) {
      processPulseRequest([message.tokenAddress], sendResponse);
    } else {
      sendResponse({ success: false, error: "Invalid parameters" });
    }
    return true;
  }
});

// Storage handlers
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setAddress") {
    browser.storage.local
      .set({ storedAddress: message.address })
      .then(() => sendResponse({ success: true }))
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );
    return true;
  }

  if (message.action === "getAddress") {
    browser.storage.local
      .get("storedAddress")
      .then((result) => sendResponse({ address: result.storedAddress || "" }))
      .catch(() => sendResponse({ address: "" }));
    return true;
  }

  if (message.action === "linksFound") {
    browser.storage.local
      .set({
        storedTwitterLink: message.twitterLink || "",
        storedWebsiteLink: message.websiteLink || "",
      })
      .then(() => sendResponse({ success: true }))
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );
    return true;
  }

  if (message.action === "getTwitterLink") {
    browser.storage.local
      .get("storedTwitterLink")
      .then((result) =>
        sendResponse({ twitterLink: result.storedTwitterLink || "" }),
      )
      .catch(() => sendResponse({ twitterLink: "" }));
    return true;
  }

  if (message.action === "getWebsiteLink") {
    browser.storage.local
      .get("storedWebsiteLink")
      .then((result) =>
        sendResponse({ websiteLink: result.storedWebsiteLink || "" }),
      )
      .catch(() => sendResponse({ websiteLink: "" }));
    return true;
  }

  if (message.action === "axiomDataFound") {
    let data = {
      tokenAddress: message.tokenAddress || "",
      twitterLink: message.twitterLink || "",
      websiteLink: message.websiteLink || "",
      tokenName: message.tokenName || "",
      tokenTicker: message.tokenTicker || "",
      deployerAddress: message.deployerAddress || "",
    };

    browser.storage.local
      .set({ storedAxiomData: data })
      .then(() => sendResponse({ success: true }))
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );
    return true;
  }

  if (message.action === "getAxiomData") {
    browser.storage.local
      .get("storedAxiomData")
      .then((result) => sendResponse(result.storedAxiomData || {}))
      .catch(() => sendResponse({}));
    return true;
  }

  if (message.action === "tokenDataFound") {
    let data = {
      symbol: message.symbol || "",
      deployerAddress: message.deployerAddress || "",
    };

    browser.storage.local
      .set({ storedTokenData: data })
      .then(() => sendResponse({ success: true }))
      .catch((error) =>
        sendResponse({ success: false, error: error.toString() }),
      );
    return true;
  }

  if (message.action === "getTokenData") {
    browser.storage.local
      .get("storedTokenData")
      .then((result) => sendResponse(result.storedTokenData || {}))
      .catch(() => sendResponse({}));
    return true;
  }
});

// Open token handler - Updated to match the new implementation
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "OPEN_BACKGROUND_TAB" && message.url) {
    browser.tabs
      .create({ url: message.url, active: false })
      .then((tab) => {
        console.log("Tab opened in background:", tab.id);
        sendResponse({ success: true, tabId: tab.id });
      })
      .catch((error) => {
        console.error("Error opening tab:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// Keep the legacy handler for backward compatibility
browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "OPEN_TOKEN_BG" && typeof message.url === "string") {
    browser.tabs.create({ url: message.url, active: false });
  }
});

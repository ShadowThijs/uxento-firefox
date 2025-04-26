;(function () {
  // --- XMLHttpRequest Override ---
  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url
    this._method = method

    // Target the pair-info endpoint
    this._isTargetRequest = url.includes("axiom.trade/pair-info")
    originalXHROpen.apply(this, [method, url, ...rest])
  }

  XMLHttpRequest.prototype.send = function (body) {
    if (this._isTargetRequest) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
          try {
            const response = JSON.parse(this.responseText)
            const tokenAddress = response.tokenAddress || null
            const twitterLink = response.twitter || null
            const websiteLink = response.website || null
            const tokenTicker = response.tokenTicker || null
            const tokenName = response.tokenName || null
            const deployerAddress =
              (response.extra && response.extra.pumpDeployerAddress) ||
              response.deployerAddress ||
              null

            window.postMessage(
              {
                type: "axiomTokenDataFound",
                tokenAddress,
                twitterLink,
                websiteLink,
                tokenTicker,
                tokenName,
                deployerAddress
              },
              "*"
            )
          } catch (error) {
            console.error("Error parsing XHR response:", error)
          }
        }
      })
    }
    originalXHRSend.apply(this, [body])
  }
})()

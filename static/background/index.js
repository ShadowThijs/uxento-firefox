var e, t
'function' == typeof (e = globalThis.define) && ((t = e), (e = null)),
    (function (t, r, o, n, s) {
        var a =
                'undefined' != typeof globalThis
                    ? globalThis
                    : 'undefined' != typeof self
                    ? self
                    : 'undefined' != typeof window
                    ? window
                    : 'undefined' != typeof global
                    ? global
                    : {},
            i = 'function' == typeof a[n] && a[n],
            c = i.cache || {},
            d =
                'undefined' != typeof module &&
                'function' == typeof module.require &&
                module.require.bind(module)
        function l(e, r) {
            if (!c[e]) {
                if (!t[e]) {
                    var o = 'function' == typeof a[n] && a[n]
                    if (!r && o) return o(e, !0)
                    if (i) return i(e, !0)
                    if (d && 'string' == typeof e) return d(e)
                    var s = Error("Cannot find module '" + e + "'")
                    throw ((s.code = 'MODULE_NOT_FOUND'), s)
                }
                ;(f.resolve = function (r) {
                    var o = t[e][1][r]
                    return null != o ? o : r
                }),
                    (f.cache = {})
                var u = (c[e] = new l.Module(e))
                t[e][0].call(u.exports, f, u, u.exports, this)
            }
            return c[e].exports
            function f(e) {
                var t = f.resolve(e)
                return !1 === t ? {} : l(t)
            }
        }
        ;(l.isParcelRequire = !0),
            (l.Module = function (e) {
                ;(this.id = e), (this.bundle = l), (this.exports = {})
            }),
            (l.modules = t),
            (l.cache = c),
            (l.parent = i),
            (l.register = function (e, r) {
                t[e] = [
                    function (e, t) {
                        t.exports = r
                    },
                    {},
                ]
            }),
            Object.defineProperty(l, 'root', {
                get: function () {
                    return a[n]
                },
            }),
            (a[n] = l)
        for (var u = 0; u < r.length; u++) l(r[u])
        if (o) {
            var f = l(o)
            'object' == typeof exports && 'undefined' != typeof module
                ? (module.exports = f)
                : 'function' == typeof e && e.amd
                ? e(function () {
                      return f
                  })
                : s && (this[s] = f)
        }
    })(
        {
            kgW6q: [
                function (e, t, r) {
                    e('../../../src/background')
                },
                { '../../../src/background': 'fx8Od' },
            ],
            fx8Od: [
                function (e, t, r) {
                    e(
                        '@parcel/transformer-js/src/esmodule-helpers.js'
                    ).defineInteropFlag(r)
                    let o = 'uxentoReports',
                        n = 'fetchReportsHourly'
                    function s() {
                        chrome.alarms.create(n, {
                            when:
                                Date.now() +
                                (function () {
                                    let e = new Date(),
                                        t = new Date(e)
                                    return (
                                        t.setUTCSeconds(0, 0),
                                        t.setUTCMinutes(1),
                                        t.setUTCHours(t.getUTCHours() + 1),
                                        t.getTime() - e.getTime()
                                    )
                                })(),
                        })
                    }
                    async function a() {
                        try {
                            let e = await fetch(
                                'https://api.uxento.io/reports',
                                {
                                    cache: 'no-store',
                                }
                            )
                            if (!e.ok) throw Error(`HTTP ${e.status}`)
                            let t = await e.text(),
                                r = await c(t, i())
                            await chrome.storage.local.set({
                                [o]: r,
                                uxentoReportsLastFetch: Date.now(),
                            })
                        } catch (e) {
                            console.error('[Uxento] reports fetch failed:', e)
                        } finally {
                            s()
                        }
                    }
                    function i() {
                        return 'EyG2k4jGF0FVYGi8urLnuxgq183VkE1m'
                    }
                    function c(e, t) {
                        try {
                            let r = e.slice(0, 32),
                                o = e.slice(32),
                                n = Uint8Array.from(
                                    r.match(/../g).map((e) => parseInt(e, 16))
                                ),
                                s = Uint8Array.from(
                                    o.match(/../g).map((e) => parseInt(e, 16))
                                ),
                                a = new TextEncoder().encode(t)
                            return crypto.subtle
                                .importKey(
                                    'raw',
                                    a,
                                    { name: 'AES-CBC', length: 256 },
                                    !1,
                                    ['decrypt']
                                )
                                .then((e) =>
                                    crypto.subtle.decrypt(
                                        { name: 'AES-CBC', iv: n },
                                        e,
                                        s
                                    )
                                )
                                .then((e) =>
                                    JSON.parse(new TextDecoder().decode(e))
                                )
                        } catch (e) {
                            throw (
                                (console.error('decrypt-error:', e),
                                Error('Decrypt failed'))
                            )
                        }
                    }
                    function d(e) {
                        if (!e.ok) throw Error(`Status error: ${e.status}`)
                        return e.text()
                    }
                    function l(e, t) {
                        fetch('https://api.uxento.io/pulse', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ tokens: e }),
                        })
                            .then(d)
                            .then((e) => c(e, i()))
                            .then((e) => t({ success: !0, data: e }))
                            .catch((e) => {
                                console.error('Process error:', e),
                                    t({ success: !1, error: e.toString() })
                            })
                    }
                    ;(async function () {
                        let e = await chrome.storage.local.get(o)
                        e[o] ? s() : await a()
                    })().catch(console.error),
                        chrome.alarms.onAlarm.addListener((e) => {
                            e.name === n && a().catch(console.error)
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if (e?.action === 'ensureReports')
                                return (
                                    chrome.storage.local.get(o, (e) => {
                                        e[o]
                                            ? r({ success: !0, cached: !0 })
                                            : a()
                                                  .then(() =>
                                                      r({
                                                          success: !0,
                                                          cached: !1,
                                                      })
                                                  )
                                                  .catch((e) =>
                                                      r({
                                                          success: !1,
                                                          error: e.toString(),
                                                      })
                                                  )
                                    }),
                                    !0
                                )
                        }),
                        chrome.commands?.onCommand.addListener((e) => {
                            'open-extension' === e && chrome.action.openPopup()
                        }),
                        chrome.runtime.onInstalled.addListener((e) => {
                            'install' === e.reason &&
                                chrome.tabs.create({
                                    url: chrome.runtime.getURL('options.html'),
                                })
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if ('fetchBalance' === e.action) {
                                if (!e.wallet) {
                                    r({
                                        success: !1,
                                        error: 'No wallet address provided.',
                                    })
                                    return
                                }
                                let t = {
                                    name: 'nativeBalances',
                                    data: {
                                        walletAddresses: [e.wallet],
                                        chainIds: [1399811149],
                                    },
                                }
                                return (
                                    fetch(
                                        'https://api-neo.bullx.io/v2/api/nativeBalances',
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                                'User-Agent':
                                                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                                            },
                                            body: JSON.stringify(t),
                                        }
                                    )
                                        .then((e) => {
                                            if (!e.ok)
                                                throw Error(
                                                    `HTTP error ${e.status}`
                                                )
                                            return e.json()
                                        })
                                        .then((t) => {
                                            let o =
                                                t.nativeBalances?.[e.wallet]?.[
                                                    '1399811149'
                                                ]
                                            null != o
                                                ? r({
                                                      success: !0,
                                                      balance: o / 1e9,
                                                  })
                                                : r({
                                                      success: !1,
                                                      error: 'Balance not found in response.',
                                                  })
                                        })
                                        .catch((e) =>
                                            r({
                                                success: !1,
                                                error: e.toString(),
                                            })
                                        ),
                                    !0
                                )
                            }
                            return !1
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if ('fetchRepoData' === e.action)
                                return (
                                    fetch(
                                        `https://www.uxento.io/api/health?repo=${encodeURIComponent(
                                            e.repo
                                        )}`
                                    )
                                        .then((e) => e.json())
                                        .then((e) =>
                                            r({ success: !0, data: e })
                                        )
                                        .catch((e) =>
                                            r({
                                                success: !1,
                                                error: e.toString(),
                                            })
                                        ),
                                    !0
                                )
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if ('fetchAlphaData' === e.type)
                                return (
                                    e.tokens && Array.isArray(e.tokens)
                                        ? l(e.tokens, r)
                                        : e.tokenAddress &&
                                          'string' == typeof e.tokenAddress
                                        ? l([e.tokenAddress], r)
                                        : r({
                                              success: !1,
                                              error: 'Invalid parameters',
                                          }),
                                    !0
                                )
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if ('setAddress' === e.action)
                                return (
                                    chrome.storage.local.set(
                                        { storedAddress: e.address },
                                        () => r({ success: !0 })
                                    ),
                                    !0
                                )
                            if ('getAddress' === e.action)
                                return (
                                    chrome.storage.local.get(
                                        'storedAddress',
                                        (e) =>
                                            r({
                                                address: e.storedAddress || '',
                                            })
                                    ),
                                    !0
                                )
                            if ('linksFound' === e.action)
                                return (
                                    chrome.storage.local.set(
                                        {
                                            storedTwitterLink:
                                                e.twitterLink || '',
                                            storedWebsiteLink:
                                                e.websiteLink || '',
                                        },
                                        () => r({ success: !0 })
                                    ),
                                    !0
                                )
                            if ('getTwitterLink' === e.action)
                                return (
                                    chrome.storage.local.get(
                                        'storedTwitterLink',
                                        (e) =>
                                            r({
                                                twitterLink:
                                                    e.storedTwitterLink || '',
                                            })
                                    ),
                                    !0
                                )
                            if ('getWebsiteLink' === e.action)
                                return (
                                    chrome.storage.local.get(
                                        'storedWebsiteLink',
                                        (e) =>
                                            r({
                                                websiteLink:
                                                    e.storedWebsiteLink || '',
                                            })
                                    ),
                                    !0
                                )
                            if ('axiomDataFound' === e.action) {
                                let t = {
                                    tokenAddress: e.tokenAddress || '',
                                    twitterLink: e.twitterLink || '',
                                    websiteLink: e.websiteLink || '',
                                    tokenName: e.tokenName || '',
                                    tokenTicker: e.tokenTicker || '',
                                    deployerAddress: e.deployerAddress || '',
                                }
                                return (
                                    chrome.storage.local.set(
                                        { storedAxiomData: t },
                                        () => r({ success: !0 })
                                    ),
                                    !0
                                )
                            }
                            if ('getAxiomData' === e.action)
                                return (
                                    chrome.storage.local.get(
                                        'storedAxiomData',
                                        (e) => r(e.storedAxiomData || {})
                                    ),
                                    !0
                                )
                            if ('tokenDataFound' === e.action) {
                                let t = {
                                    symbol: e.symbol || '',
                                    deployerAddress: e.deployerAddress || '',
                                }
                                return (
                                    chrome.storage.local.set(
                                        { storedTokenData: t },
                                        () => r({ success: !0 })
                                    ),
                                    !0
                                )
                            }
                            return (
                                'getTokenData' === e.action &&
                                (chrome.storage.local.get(
                                    'storedTokenData',
                                    (e) => r(e.storedTokenData || {})
                                ),
                                !0)
                            )
                        }),
                        chrome.runtime.onMessage.addListener((e, t, r) => {
                            if ('OPEN_BACKGROUND_TAB' === e.type && e.url)
                                return (
                                    chrome.tabs
                                        .create({ url: e.url, active: !1 })
                                        .then((e) => {
                                            console.log(
                                                'Tab opened in background:',
                                                e.id
                                            ),
                                                r({ success: !0, tabId: e.id })
                                        })
                                        .catch((e) => {
                                            console.error(
                                                'Error opening tab:',
                                                e
                                            ),
                                                r({
                                                    success: !1,
                                                    error: e.message,
                                                })
                                        }),
                                    !0
                                )
                        })
                },
                { '@parcel/transformer-js/src/esmodule-helpers.js': 'hbR2Q' },
            ],
            hbR2Q: [
                function (e, t, r) {
                    ;(r.interopDefault = function (e) {
                        return e && e.__esModule ? e : { default: e }
                    }),
                        (r.defineInteropFlag = function (e) {
                            Object.defineProperty(e, '__esModule', {
                                value: !0,
                            })
                        }),
                        (r.exportAll = function (e, t) {
                            return (
                                Object.keys(e).forEach(function (r) {
                                    'default' === r ||
                                        '__esModule' === r ||
                                        t.hasOwnProperty(r) ||
                                        Object.defineProperty(t, r, {
                                            enumerable: !0,
                                            get: function () {
                                                return e[r]
                                            },
                                        })
                                }),
                                t
                            )
                        }),
                        (r.export = function (e, t, r) {
                            Object.defineProperty(e, t, {
                                enumerable: !0,
                                get: r,
                            })
                        })
                },
                {},
            ],
        },
        ['kgW6q'],
        'kgW6q',
        'parcelRequire7905'
    ),
    (globalThis.define = t)

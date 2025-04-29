var e, t;
"function" == typeof (e = globalThis.define) && ((t = e), (e = null)),
  (function (t, o, r, n, i) {
    var a =
        "undefined" != typeof globalThis
          ? globalThis
          : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
              ? window
              : "undefined" != typeof global
                ? global
                : {},
      d = "function" == typeof a[n] && a[n],
      s = d.cache || {},
      c =
        "undefined" != typeof module &&
        "function" == typeof module.require &&
        module.require.bind(module);
    function l(e, o) {
      if (!s[e]) {
        if (!t[e]) {
          var r = "function" == typeof a[n] && a[n];
          if (!o && r) return r(e, !0);
          if (d) return d(e, !0);
          if (c && "string" == typeof e) return c(e);
          var i = Error("Cannot find module '" + e + "'");
          throw ((i.code = "MODULE_NOT_FOUND"), i);
        }
        (u.resolve = function (o) {
          var r = t[e][1][o];
          return null != r ? r : o;
        }),
          (u.cache = {});
        var p = (s[e] = new l.Module(e));
        t[e][0].call(p.exports, u, p, p.exports, this);
      }
      return s[e].exports;
      function u(e) {
        var t = u.resolve(e);
        return !1 === t ? {} : l(t);
      }
    }
    (l.isParcelRequire = !0),
      (l.Module = function (e) {
        (this.id = e), (this.bundle = l), (this.exports = {});
      }),
      (l.modules = t),
      (l.cache = s),
      (l.parent = d),
      (l.register = function (e, o) {
        t[e] = [
          function (e, t) {
            t.exports = o;
          },
          {},
        ];
      }),
      Object.defineProperty(l, "root", {
        get: function () {
          return a[n];
        },
      }),
      (a[n] = l);
    for (var p = 0; p < o.length; p++) l(o[p]);
    if (r) {
      var u = l(r);
      "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = u)
        : "function" == typeof e && e.amd
          ? e(function () {
              return u;
            })
          : i && (this[i] = u);
    }
  })(
    {
      "6RmOp": [
        function (e, t, o) {
          var r = e("@parcel/transformer-js/src/esmodule-helpers.js");
          r.defineInteropFlag(o), r.export(o, "config", () => n);
          let n = {
            matches: ["https://discord.com/*"],
            run_at: "document_idle",
          };
          function i(e) {
            e.dataset.contractProcessed ||
              ((function e(t) {
                let o = /\b[a-zA-Z0-9]{40,44}\b/g;
                if (t.nodeType === Node.TEXT_NODE) {
                  let e = t.textContent || "",
                    r = [...e.matchAll(o)];
                  if (r.length > 0) {
                    let r = document.createDocumentFragment(),
                      n = 0;
                    e.replace(o, (t, o) => {
                      let i = e.slice(n, o);
                      i && r.appendChild(document.createTextNode(i));
                      let a = document.createElement("span");
                      (a.textContent = t),
                        a.classList.add("contract-address"),
                        r.appendChild(a);
                      let d = document.createElement("button");
                      return (
                        (d.textContent = "Copy"),
                        d.classList.add("copy-contract-button"),
                        d.addEventListener("click", (e) => {
                          e.stopPropagation(),
                            navigator.clipboard
                              .writeText(t)
                              .then(() => {
                                (d.textContent = "Copied!"),
                                  setTimeout(() => {
                                    d.textContent = "Copy";
                                  }, 2e3);
                              })
                              .catch((e) => {
                                console.error(
                                  "Failed to copy contract address:",
                                  e,
                                );
                              });
                        }),
                        r.appendChild(d),
                        (n = o + t.length),
                        t
                      );
                    });
                    let i = e.slice(n);
                    i && r.appendChild(document.createTextNode(i)),
                      t.parentNode?.replaceChild(r, t);
                  }
                } else if (t.nodeType === Node.ELEMENT_NODE) {
                  if (
                    t.classList.contains("copy-contract-button") ||
                    t.classList.contains("contract-address")
                  )
                    return;
                  Array.from(t.childNodes).forEach((t) => e(t));
                }
              })(e),
              (e.dataset.contractProcessed = "true"));
          }
          (function () {
            let e = document.createElement("style");
            (e.id = "discord-contract-address-styles"),
              (e.textContent = `
    /* Styles for contract address and copy button */
    .contract-address {
      font-family: monospace;
      background-color: #2f3136;
      padding: 2px 4px;
      border-radius: 3px;
    }

    .copy-contract-button {
      margin-left: 8px;
      font-size: 0.8em;
      background-color: #40444b;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .copy-contract-button:hover {
      background-color: #4e545c;
    }

    .copy-contract-button:active {
      background-color: #36393f;
      transform: scale(0.98);
    }
  `),
              document.head.appendChild(e);
          })(),
            (function () {
              let e = new MutationObserver((e) => {
                e.forEach((e) => {
                  e.addedNodes.forEach((e) => {
                    e.nodeType === Node.ELEMENT_NODE &&
                      (e.matches(".messageContent_c19a55")
                        ? i(e)
                        : e
                            .querySelectorAll(".messageContent_c19a55")
                            .forEach((e) => i(e)));
                  });
                });
              });
              e.observe(document.body, { childList: !0, subtree: !0 }),
                document
                  .querySelectorAll(".messageContent_c19a55")
                  .forEach((e) => i(e));
            })(),
            chrome.storage.local.get("discordTrenchEnabled", (e) => {
              if (!e.discordTrenchEnabled) {
                console.log(
                  "Discord Trench Mode is disabled. Only contract address copying is active.",
                );
                return;
              }
              !(function () {
                function e() {
                  let e = document.createElement("style");
                  (e.id = "discord-sidebar-collapse-styles"),
                    (e.textContent = `
      /* Hide the servers/guilds sidebar */
      nav.wrapper_ef3116.guilds_c48ade,
      .sidebar_c48ade,
      .sidebar_c48ade[data-collapsed="false"],
      .sidebar__27f77,
      ul.tree_ef3116 {
        width: 0 !important;
        min-width: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        transition: all 0.3s ease !important;
      }

      /* Hide the channels sidebar */
      .sidebarList_c48ade,
      .sidebarListRounded_c48ade,
      nav.container__2637a,
      .container__2637a {
        width: 0 !important;
        min-width: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        transition: all 0.3s ease !important;
      }

      /* Hide resize handle */
      .sidebarResizeHandle_c48ade {
        display: none !important;
      }

      /* Add sidebar hover area */
      #discord-sidebar-hover-area {
        position: fixed;
        left: 0;
        top: 0;
        width: 8px;
        height: 100vh;
        z-index: 9999;
        cursor: pointer;
        background-color: rgba(100, 100, 100, 0.1);
      }

      /* When showing sidebars */
      body.sidebars-visible nav.wrapper_ef3116.guilds_c48ade,
      body.sidebars-visible .sidebar_c48ade,
      body.sidebars-visible .sidebar_c48ade[data-collapsed="false"],
      body.sidebars-visible .sidebar__27f77,
      body.sidebars-visible ul.tree_ef3116 {
        width: 72px !important;
        min-width: 72px !important;
        overflow: visible !important;
        opacity: 1 !important;
      }

      body.sidebars-visible .sidebarList_c48ade,
      body.sidebars-visible .sidebarListRounded_c48ade,
      body.sidebars-visible nav.container__2637a,
      body.sidebars-visible .container__2637a {
        width: 240px !important;
        min-width: 240px !important;
        overflow: visible !important;
        opacity: 1 !important;
      }

      /* Fix layout variables */
      .base__081a3 {
        --guild-sidebar-width: 0px !important;
        --sidebar-width: 0px !important;
      }

      body.sidebars-visible .base__081a3 {
        --guild-sidebar-width: 72px !important;
        --sidebar-width: 240px !important;
      }

      /* Fix content spacing */
      .base__081a3 > div {
        margin-left: 0 !important;
      }

      /* Small indicator for the hover area */
      #discord-sidebar-hover-area::after {
        content: '\xab';
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
      }

      body.sidebars-visible #discord-sidebar-hover-area::after {
        content: '\xbb';
      }

      body.sidebars-visible #discord-sidebar-hover-area {
        left: 312px; /* 72px + 240px */
        background-color: rgba(100, 100, 100, 0.2);
      }
      `),
                    document.head.appendChild(e);
                  let t = document.createElement("div");
                  (t.id = "discord-sidebar-hover-area"),
                    (t.title = "Click to show Discord sidebars"),
                    document.body.appendChild(t),
                    t.addEventListener("click", () => {
                      document.body.classList.toggle("sidebars-visible");
                    }),
                    document.addEventListener("mousemove", (e) => {
                      document.body.classList.contains("sidebars-visible") &&
                        e.clientX > 320 &&
                        document.body.classList.remove("sidebars-visible");
                    });
                }
                e(),
                  "loading" === document.readyState
                    ? document.addEventListener("DOMContentLoaded", e)
                    : e(),
                  window.addEventListener("load", e);
                let t = new MutationObserver(() => {
                  document.getElementById("discord-sidebar-collapse-styles") ||
                    e();
                });
                t.observe(document.documentElement, {
                  childList: !0,
                  subtree: !0,
                }),
                  setTimeout(() => {
                    t.disconnect();
                  }, 3e4);
              })();
            });
        },
        { "@parcel/transformer-js/src/esmodule-helpers.js": "cHUbl" },
      ],
      cHUbl: [
        function (e, t, o) {
          (o.interopDefault = function (e) {
            return e && e.__esModule ? e : { default: e };
          }),
            (o.defineInteropFlag = function (e) {
              Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (o.exportAll = function (e, t) {
              return (
                Object.keys(e).forEach(function (o) {
                  "default" === o ||
                    "__esModule" === o ||
                    t.hasOwnProperty(o) ||
                    Object.defineProperty(t, o, {
                      enumerable: !0,
                      get: function () {
                        return e[o];
                      },
                    });
                }),
                t
              );
            }),
            (o.export = function (e, t, o) {
              Object.defineProperty(e, t, { enumerable: !0, get: o });
            });
        },
        {},
      ],
    },
    ["6RmOp"],
    "6RmOp",
    "parcelRequire7905",
  ),
  (globalThis.define = t);

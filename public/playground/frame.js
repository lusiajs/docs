// The preview frame. It runs in a sandbox with an opaque origin, so user code cannot reach the site.
// The parent sends the runtime and the compiled modules, then this page loads them with blob URLs.
(function () {
  "use strict";

  var MODULE_PREFIX = "@live/";

  function post(message) {
    window.parent.postMessage(message, "*");
  }

  function report(error) {
    var message = error && error.message ? error.message : String(error);
    post({ type: "error", message: message, code: error && error.code, hint: error && error.hint });
  }

  function blobUrl(code) {
    return URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
  }

  // "lusia" and "lusia/internal" share one blob, so the runtime is a single module instance.
  function addImportMap(run) {
    var imports = { lusia: blobUrl(run.runtime) };
    imports["lusia/internal"] = imports.lusia;
    for (var name in run.modules) {
      imports[MODULE_PREFIX + name] = blobUrl(run.modules[name]);
    }
    var map = document.createElement("script");
    map.type = "importmap";
    map.textContent = JSON.stringify({ imports: imports });
    document.head.append(map);
  }

  // The theme sets the colors the CSS variables use. The styles come from the parent, if any.
  function applyLook(run) {
    document.documentElement.dataset.theme = run.theme || "light";
    if (!run.styles) return;
    var style = document.createElement("style");
    style.textContent = run.styles;
    document.head.append(style);
  }

  async function run(data) {
    try {
      addImportMap(data);
      applyLook(data);
      var runtime = await import("lusia");
      for (var i = 0; i < data.entries.length; i++) {
        var app = await import(MODULE_PREFIX + data.entries[i]);
        var root = document.createElement("div");
        root.className = "app";
        document.body.append(root);
        runtime.attach(app.default, root);
      }
      watchSize();
      post({ type: "mounted" });
    } catch (error) {
      report(error);
    }
  }

  // The parent sizes the frame to its content, so the frame reports each change in height.
  var sizeWatched = false;
  function reportSize() {
    post({ type: "size", height: document.documentElement.scrollHeight });
  }
  function watchSize() {
    reportSize();
    if (sizeWatched) return;
    sizeWatched = true;
    new ResizeObserver(reportSize).observe(document.body);
  }

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || !event.data || event.data.type !== "run") return;
    void run(event.data);
  });
  window.addEventListener("error", function (event) {
    report(event.error || event.message);
  });
  window.addEventListener("unhandledrejection", function (event) {
    report(event.reason);
  });
  post({ type: "ready" });
})();

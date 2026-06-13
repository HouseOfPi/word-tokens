// spotlight.js — click-to-focus highlighter for presenting/pausing the video.
// Click any element inside the animation canvas: it gently scales up and a
// dimming overlay spotlights it. Click it again, click the dim area, or press
// Esc to clear. Plain JS — no React dependency.

(function () {
  'use strict';

  var current = null;      // currently spotlighted element
  var overlay = null;      // the cutout/dim overlay div
  var rafId = null;

  var SCALE = '1.06';
  var PAD = 10;            // px of breathing room around the cutout
  var DIM = 'rgba(20, 14, 9, 0.55)';
  var RING = 'rgba(201, 100, 66, 0.9)';

  // ── styles ──
  var style = document.createElement('style');
  style.textContent =
    '.vo-spot{scale:' + SCALE + ';transition:scale .28s cubic-bezier(.22,1,.36,1);}' +
    '.vo-overlay{position:fixed;z-index:99990;pointer-events:auto;cursor:pointer;' +
    'box-shadow:0 0 0 9999px ' + DIM + ';outline:2px solid ' + RING + ';outline-offset:2px;' +
    'border-radius:10px;transition:opacity .25s ease;background:transparent;}';
  document.head.appendChild(style);

  function positionOverlay() {
    if (!current || !overlay) return;
    if (!current.isConnected) { clear(); return; }
    var r = current.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) { clear(); return; }
    overlay.style.left = (r.left - PAD) + 'px';
    overlay.style.top = (r.top - PAD) + 'px';
    overlay.style.width = (r.width + PAD * 2) + 'px';
    overlay.style.height = (r.height + PAD * 2) + 'px';
    var br = parseFloat(getComputedStyle(current).borderRadius) || 0;
    overlay.style.borderRadius = Math.max(10, br + PAD * 0.6) + 'px';
    rafId = requestAnimationFrame(positionOverlay);
  }

  function clear() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (current) { current.classList.remove('vo-spot'); current = null; }
    if (overlay) {
      var o = overlay; overlay = null;
      o.style.opacity = '0';
      setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 260);
    }
  }

  function spotlight(el) {
    clear();
    current = el;
    el.classList.add('vo-spot');
    overlay = document.createElement('div');
    overlay.className = 'vo-overlay';
    overlay.style.opacity = '0';
    overlay.addEventListener('click', function (e) {
      e.stopPropagation();
      clear();
    });
    document.body.appendChild(overlay);
    positionOverlay();
    requestAnimationFrame(function () {
      if (overlay) overlay.style.opacity = '1';
    });
  }

  // Pick a sensible element: climb from the click target until we find
  // something with real size, but never the whole canvas.
  function pickTarget(start, canvas) {
    var el = start;
    var best = null;
    var canvasRect = canvas.getBoundingClientRect();
    var canvasArea = canvasRect.width * canvasRect.height;
    while (el && el !== canvas) {
      var r = el.getBoundingClientRect();
      var area = r.width * r.height;
      if (r.width >= 18 && r.height >= 14 && area < canvasArea * 0.55) {
        best = el;
        // prefer the first (innermost) decently-sized element, but if it's
        // tiny (like a single digit), allow one more step up
        if (r.width >= 40 || r.height >= 30) break;
      }
      el = el.parentElement;
    }
    return best;
  }

  var lastClickTime = 0;
  var lastClickTarget = null;

  document.addEventListener('click', function (e) {
    if (overlay && e.target === overlay) return; // handled by overlay
    var canvas = e.target && e.target.closest && e.target.closest('[data-anim-canvas]');
    if (!canvas) return;

    // Suppress spotlight on double-click (let play/pause fire instead)
    var now = Date.now();
    var isDouble = (now - lastClickTime < 350) && lastClickTarget === e.target;
    lastClickTime = now;
    lastClickTarget = e.target;
    if (isDouble) { clear(); return; }

    var el = pickTarget(e.target, canvas);
    if (!el) { clear(); return; }
    if (el === current) { clear(); return; }
    spotlight(el);
  }, true);

  window.addEventListener('keydown', function (e) {
    if (e.code === 'Escape') clear();
  });
})();

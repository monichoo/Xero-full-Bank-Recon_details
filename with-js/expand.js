// Xero truncates the statement description but keeps the full string in title="".
// Write the full string into the existing text node so it is real, selectable text.
//
// We mutate nodeValue in place rather than replacing nodes, so React keeps its
// reference and never fights us or throws during reconciliation.

function expandAll() {
  for (const span of document.querySelectorAll('[data-testid="notes"][title]')) {
    const full = span.getAttribute('title');
    if (!full) continue;
    const text = span.firstChild;
    if (text && text.nodeType === Node.TEXT_NODE && text.nodeValue !== full) {
      text.nodeValue = full;
    }
  }
}

// Xero re-renders rows constantly (scrolling, reconciling, tab switches),
// so re-apply after any DOM change. Coalesced to one pass per frame.
let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; expandAll(); });
});

expandAll();
observer.observe(document.body, { childList: true, subtree: true });

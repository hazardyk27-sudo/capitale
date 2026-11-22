"use strict";
(function () {
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-step]'));
  const panels = new Map(Array.from(document.querySelectorAll('[role="tabpanel"]')).map(p => [p.id, p]));
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("primary-navigation");

  function activateTab(button, shouldFocus) {
    for (const tab of tabs) {
      const isCurrent = tab === button;
      tab.classList.toggle("is-selected", isCurrent);
      tab.setAttribute("aria-selected", String(isCurrent));
      tab.tabIndex = isCurrent ? 0 : -1;
      const panel = panels.get(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !isCurrent;
    }
    if (shouldFocus) button.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab, false));
    tab.addEventListener("keydown", event => {
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) closeMenu();
  });
})();

"use strict";
(function () {
  const trigger = document.getElementById("mobile-menu");
  const nav = document.getElementById("nav-links");
  if (!trigger || !nav) return;
  const closeMenu = () => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  };
  trigger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(open));
    trigger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 770) closeMenu();
  });
})();

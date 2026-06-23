document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav-hamburger");
  const navLinks = document.querySelector(".nav-links");

  const setNavState = () => {
    if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 10);
  };

  const closeMenu = () => {
    if (!hamburger || !navLinks) return;
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    if (!hamburger || !navLinks) return;
    navLinks.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });

  if (navLinks && !navLinks.querySelector('a[href="installer.html"]')) {
    const decoderLink = navLinks.querySelector('a[href="decoder.html"]');
    const item = document.createElement("li");
    item.innerHTML = '<a href="installer.html">Install</a>';
    if (decoderLink && decoderLink.parentElement) {
      decoderLink.parentElement.insertAdjacentElement("afterend", item);
    } else {
      navLinks.insertBefore(item, navLinks.firstChild);
    }
  }

  if (hamburger && navLinks) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => {
      navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("open")) return;
      if (nav && nav.contains(event.target)) return;
      closeMenu();
    });
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`QECTOR inquiry: ${data.get("type") || "General"}`);
      const body = encodeURIComponent([
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Organization: ${data.get("org") || ""}`,
        `Inquiry type: ${data.get("type") || ""}`,
        "",
        String(data.get("message") || "")
      ].join("\n"));
      window.location.href = `mailto:admin@qector.store?subject=${subject}&body=${body}`;
    });
  }
});

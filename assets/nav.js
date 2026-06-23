document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav-hamburger");
  const navLinks = document.querySelector(".nav-links");
  const current = window.location.pathname.split("/").pop() || "index.html";

  const applyOfficialLogo = () => {
    document.querySelectorAll("a.nav-logo, a.footer-brand").forEach((link) => {
      while (link.firstChild) link.removeChild(link.firstChild);
      const img = document.createElement("img");
      img.className = "official-logo";
      img.src = "assets/logo.svg";
      img.width = 132;
      img.height = 74;
      img.alt = "QECTOR official logo";
      link.appendChild(img);
      link.setAttribute("aria-label", "QECTOR official logo");
    });
  };

  applyOfficialLogo();

  let backdrop = document.querySelector(".mobile-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "mobile-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  const setNavState = () => {
    if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 8);
  };

  const closeMenu = () => {
    if (!hamburger || !navLinks) return;
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    backdrop.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    if (!hamburger || !navLinks) return;
    navLinks.classList.add("open");
    hamburger.classList.add("open");
    backdrop.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  if (hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", "qector-navigation");
  }
  if (navLinks) navLinks.id = "qector-navigation";

  if (navLinks && !navLinks.querySelector('a[href="installer.html"]')) {
    const decoderLink = navLinks.querySelector('a[href="decoder.html"]');
    const item = document.createElement("li");
    const installLink = document.createElement("a");
    installLink.href = "installer.html";
    installLink.textContent = "Install";
    item.appendChild(installLink);
    if (decoderLink && decoderLink.parentElement) {
      decoderLink.parentElement.insertAdjacentElement("afterend", item);
    } else {
      navLinks.insertBefore(item, navLinks.firstChild);
    }
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
    link.addEventListener("click", closeMenu);
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1120) closeMenu();
    }, { passive: true });
  }

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

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

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

  const ensureNavLink = (href, label, afterHref) => {
    if (!navLinks || navLinks.querySelector(`a[href="${href}"]`)) return;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    item.appendChild(link);

    const anchor = navLinks.querySelector(`a[href="${afterHref}"]`);
    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertAdjacentElement("afterend", item);
    } else {
      const cta = navLinks.querySelector(".nav-cta");
      if (cta) navLinks.insertBefore(item, cta);
      else navLinks.appendChild(item);
    }
  };

  const syncReleaseText = () => {
    const replacements = [
      ["Decoder v0.4.0 available", "Decoder v0.5.0 available"],
      ["early-stage v0.4 R&D platform", "early-stage v0.5 R&D platform"],
      ["832 tests collected: 829 passed / 2 skipped / 1 expected xfailed", "832 Python tests passed + 87 Rust tests passed"],
      ["829 passed, 2 skipped, 1 expected xfailed", "832 passed, 0 skipped, 0 xfailed"],
      ["The xfailed item is an expected test marker, not an unexplained failed release gate.", "The previous skips and expected xfail have been removed in the v0.5 validation report."],
      ["33.7% lower observed LER at d=5", "34.8% lower observed LER at d=5"],
      ["33.7% d=5 headline", "34.8% d=5 headline"],
      ["33.7% lower LER at d=5", "34.8% lower LER at d=5"]
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      let text = node.nodeValue;
      replacements.forEach(([from, to]) => {
        text = text.split(from).join(to);
      });
      node.nodeValue = text;
    });
  };

  applyOfficialLogo();
  syncReleaseText();

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

  ensureNavLink("installer.html", "Install", "decoder.html");
  ensureNavLink("docs.html", "Docs", "installer.html");
  ensureNavLink("about.html", "About", "commercial.html");

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

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav-hamburger");
  const navLinks = document.querySelector(".nav-links");
  const current = window.location.pathname.split("/").pop() || "index.html";

  const ensureMainLandmark = () => {
    if (document.querySelector("main")) return;
    const firstSection = document.querySelector("body > section");
    if (!firstSection) return;
    const main = document.createElement("main");
    main.id = "main";
    main.tabIndex = -1;
    firstSection.parentNode.insertBefore(main, firstSection);
    let node = firstSection;
    while (node && !(node.matches && node.matches("footer"))) {
      const next = node.nextSibling;
      main.appendChild(node);
      node = next;
    }
  };

  const ensureSkipLink = () => {
    if (document.querySelector(".skip-link")) return;
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main";
    link.textContent = "Skip to content";
    document.body.insertBefore(link, document.body.firstChild);
  };

  const applyOfficialLogo = () => {
    document.querySelectorAll("a.nav-logo, a.footer-brand").forEach((link) => {
      while (link.firstChild) link.removeChild(link.firstChild);
      const img = document.createElement("img");
      img.className = "official-logo";
      img.src = "assets/logo.svg";
      img.width = 132;
      img.height = 74;
      img.alt = "QECTOR official logo";
      img.loading = "eager";
      img.decoding = "async";
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
    if (anchor && anchor.parentElement) anchor.parentElement.insertAdjacentElement("afterend", item);
    else navLinks.appendChild(item);
  };

  ensureMainLandmark();
  ensureSkipLink();
  applyOfficialLogo();
  ensureNavLink("installer.html", "Install", "decoder.html");
  ensureNavLink("docs.html", "Docs", "installer.html");
  ensureNavLink("technical-reference.html", "Tech", "docs.html");
  ensureNavLink("about.html", "About", "commercial.html");

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

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
    link.addEventListener("click", closeMenu, { passive: true });
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.contains("open") ? closeMenu() : openMenu());
    backdrop.addEventListener("click", closeMenu, { passive: true });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 1120) closeMenu(); }, { passive: true });
  }

  document.querySelectorAll("pre").forEach((pre, index) => {
    if (pre.closest(".code-block")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = "Copy";
    button.setAttribute("aria-label", `Copy code block ${index + 1}`);
    wrapper.appendChild(button);
    button.addEventListener("click", async () => {
      const code = pre.innerText.trim();
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = "Select";
      }
      setTimeout(() => { button.textContent = "Copy"; }, 1400);
    });
  });

  const originalForm = document.getElementById("contactForm");
  if (originalForm) {
    const form = originalForm.cloneNode(true);
    originalForm.replaceWith(form);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`QECTOR ${data.get("type") || "Contact"}`);
      const body = encodeURIComponent([
        `Name: ${data.get("name") || ""}`,
        `Organization: ${data.get("org") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Inquiry type: ${data.get("type") || ""}`,
        `License tier: ${data.get("tier") || ""}`,
        "",
        "Message:",
        `${data.get("message") || ""}`,
        "",
        "Official links:",
        "Website: https://www.qector.store",
        "PyPI: https://pypi.org/project/qector-decoder-v3/",
        "Repository: https://github.com/GuillaumeLessard/qector-decoder",
        "DOI: https://doi.org/10.5281/zenodo.20825980"
      ].join("\n"));
      window.location.href = `mailto:admin@qector.store?subject=${subject}&body=${body}`;
    });
  }

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });
});

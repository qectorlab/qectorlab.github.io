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

  const normalizeFooterLabels = () => {
    document.querySelectorAll("footer h4").forEach((heading) => {
      const label = document.createElement("span");
      label.className = "footer-title";
      label.textContent = heading.textContent;
      label.setAttribute("aria-hidden", "true");
      label.style.display = "block";
      label.style.margin = "0 0 .75rem";
      label.style.color = "#f7fbff";
      label.style.fontWeight = "850";
      label.style.letterSpacing = "-.02em";
      heading.replaceWith(label);
    });
  };

  ensureMainLandmark();
  ensureSkipLink();
  normalizeFooterLabels();

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
    if (href === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
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

  if (window.location.search.includes("sent=true") && document.querySelector("#contactForm")) {
    const sentNotice = document.createElement("div");
    sentNotice.className = "notice";
    sentNotice.innerHTML = "<strong>Message sent.</strong><br>Your QECTOR inquiry was submitted successfully.";
    document.querySelector("#contactForm").before(sentNotice);
  }

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });
});

/* ==========================================================================
   Rangiora RSA Club — main.js
   Vanilla JS only. Handles: mobile nav, sticky header, scroll-reveal,
   animated counters, gallery lightbox, events filtering, FAQ accordion,
   back-to-top, form helpers, footer year.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Mobile navigation ---------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("hidden") === false;
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("overflow-hidden", open);
      menuToggle.querySelector(".icon-open")?.classList.toggle("hidden", open);
      menuToggle.querySelector(".icon-close")?.classList.toggle("hidden", !open);
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector(".icon-open")?.classList.remove("hidden");
        menuToggle.querySelector(".icon-close")?.classList.add("hidden");
      })
    );
  }

  /* ---------------- Sticky header shadow ---------------- */
  const header = document.getElementById("site-header");
  const onScrollHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Scroll-reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || "";
          const plain = el.dataset.plain === "true"; // no thousands separator (e.g. years)
          const dur = 1800;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(target * eased);
            el.textContent = (plain ? String(val) : val.toLocaleString()) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------------- Gallery lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCaption = document.getElementById("lightbox-caption");
    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    let idx = 0;

    const show = (i) => {
      idx = (i + items.length) % items.length;
      const el = items[idx];
      lbImg.src = el.dataset.full || el.querySelector("img").src;
      lbImg.alt = el.querySelector("img").alt || "";
      if (lbCaption) lbCaption.textContent = el.dataset.caption || "";
      lightbox.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    };
    const hide = () => {
      lightbox.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    };

    items.forEach((el, i) => el.addEventListener("click", () => show(i)));
    lightbox.querySelector("[data-lb-close]")?.addEventListener("click", hide);
    lightbox.querySelector("[data-lb-prev]")?.addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
    lightbox.querySelector("[data-lb-next]")?.addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hide(); });
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------------- Events filtering ---------------- */
  const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
  const monthSelect = document.getElementById("month-filter");
  const eventCards = document.querySelectorAll(".event-card");
  if (eventCards.length) {
    let activeCat = "all";
    const applyFilters = () => {
      const month = monthSelect ? monthSelect.value : "all";
      let visible = 0;
      eventCards.forEach((card) => {
        const catOk = activeCat === "all" || (card.dataset.category || "").split(" ").includes(activeCat);
        const monthOk = month === "all" || (card.dataset.month || "") === month;
        const showCard = catOk && monthOk;
        card.classList.toggle("hidden-card", !showCard);
        if (showCard) visible++;
      });
      const empty = document.getElementById("events-empty");
      if (empty) empty.classList.toggle("hidden", visible !== 0);
    };
    filterBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCat = btn.dataset.filter;
        applyFilters();
      })
    );
    monthSelect && monthSelect.addEventListener("change", applyFilters);
    applyFilters();
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const btn = item.querySelector(".accordion-toggle");
    btn &&
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // close others in same group
        item.closest(".accordion-group")?.querySelectorAll(".accordion-item.open").forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".accordion-toggle")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
  });

  /* ---------------- Back to top ---------------- */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------- Forms (Formspree helper) ----------------
     Forms post to Formspree. Replace YOUR_FORM_ID in each form's action.
     If the action still contains the placeholder we intercept the submit
     and show a friendly notice instead of a 404. */
  document.querySelectorAll("form[data-formspree]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (form.action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        const note = form.querySelector(".form-note");
        if (note) {
          note.textContent =
            "Form not connected yet — create a free form at formspree.io and paste your form ID into this form's action attribute (see README.md).";
          note.classList.remove("hidden");
        }
      }
    });
  });

  /* ---------------- Auto-sliding carousel (.auto-slider) ----------------
     Slides left at data-interval ms (default 3000), loops seamlessly. */
  document.querySelectorAll(".auto-slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    if (!track || track.children.length < 2) return;
    const interval = parseInt(slider.dataset.interval, 10) || 3000;
    track.appendChild(track.children[0].cloneNode(true)); // clone first for seamless loop
    let i = 0;
    setInterval(() => {
      i++;
      track.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
      track.style.transform = "translateX(-" + i * 100 + "%)";
      if (i === track.children.length - 1) {
        // after sliding onto the clone, snap back to the real first slide
        setTimeout(() => {
          track.style.transition = "none";
          track.style.transform = "translateX(0)";
          i = 0;
        }, 850);
      }
    }, interval);
  });

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();

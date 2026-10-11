(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Nav: scroll state + mobile menu ---------- */
  const nav = $("#nav");
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scrollspy ---------- */
  const spyTargets = $$("main section[id]");
  const spyLinks = $$("[data-nav]");

  if ("IntersectionObserver" in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          spyLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    spyTargets.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$(".stat__num[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduced) { el.textContent = target; return; }
    const dur = 1100;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Modes switcher ---------- */
  const MODES = {
    solo: {
      n: "1",
      title: "Solo",
      copy: "Every survivor for themselves. No revives, no second chances — pure loot route and aim.",
      meta: "QUEUE · FREE-FOR-ALL · CLASSIC RULESET"
    },
    duo: {
      n: "2",
      title: "Duo",
      copy: "One partner, one plan. Trade loot, cover the revive, and don't be the reason you both die.",
      meta: "QUEUE · PAIRS · CLASSIC RULESET"
    },
    squad: {
      n: "4",
      title: "Squad",
      copy: "Four-player tactics. Split drops, call targets, hold the compound — the way most of the island was played.",
      meta: "QUEUE · TEAMS OF FOUR · CLASSIC RULESET"
    },
    fireteam: {
      n: "5",
      title: "Fireteam",
      copy: "Five up — the ROS classic. Big pushes, bigger circles, someone always watching a flank.",
      meta: "QUEUE · TEAMS OF FIVE · ROS CLASSIC"
    }
  };

  const modeBtns = $$(".mode");
  const panel = $("#modePanel");
  const ghost = $("#modeGhost");
  const mTitle = $("#modeTitle");
  const mCopy = $("#modeCopy");
  const mMeta = $("#modeMeta");

  const setMode = (key, btn) => {
    const data = MODES[key];
    if (!data) return;
    modeBtns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    panel.setAttribute("aria-labelledby", btn.id);
    ghost.textContent = data.n;
    mTitle.textContent = data.title;
    mCopy.textContent = data.copy;
    mMeta.textContent = data.meta;
    if (!reduced) {
      panel.classList.remove("is-swapping");
      void panel.offsetWidth;
      panel.classList.add("is-swapping");
    }
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode, btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const i = modeBtns.indexOf(btn);
      const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
      const next = modeBtns[(i + dir + modeBtns.length) % modeBtns.length];
      next.focus();
      setMode(next.dataset.mode, next);
    });
  });

  /* ---------- Roadmap accordion (independent) ---------- */
  $$(".phase").forEach((phase) => {
    const head = $(".phase__head", phase);
    head.addEventListener("click", () => {
      const open = phase.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- FAQ accordion (one at a time) ---------- */
  const faqItems = $$(".faq__item");
  faqItems.forEach((item) => {
    const q = $(".faq__q", item);
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      faqItems.forEach((other) => {
        other.classList.remove("is-open");
        $(".faq__q", other).setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Back to top ---------- */
  const toTop = $("#toTop");
  window.addEventListener(
    "scroll",
    () => {
      toTop.classList.toggle("is-shown", window.scrollY > 520);
      toTop.hidden = false;
    },
    { passive: true }
  );
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------- Hero emblem parallax ---------- */
  const art = $("#heroArt");
  if (art && !reduced && window.matchMedia("(pointer: fine)").matches) {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      art.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
      raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener(
      "pointermove",
      (e) => {
        tx = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12;
        ty = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 9;
        if (!raf) raf = requestAnimationFrame(tick);
      },
      { passive: true }
    );
  }
})();

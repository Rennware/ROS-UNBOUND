(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Nav: scroll state + mobile menu ---------- */
  const nav = $("#nav");
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll progress + swimming fin ---------- */
  const pFill = $("#progressFill");
  const pFin = $("#progressFin");

  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    pFill.style.width = pct + "%";
    pFin.style.left = pct + "%";
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  /* ---------- Scrollspy ---------- */
  const spySections = $$("main section[id]");
  const spyLinks = $$("[data-nav]");

  if ("IntersectionObserver" in window && spySections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          spyLinks.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
          );
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    spySections.forEach((s) => spy.observe(s));
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

  /* ---------- Boot line typing ---------- */
  const bootEl = $("#bootText");
  const BOOT =
    "127.0.0.1:443 · TLS OK · PATCH HTTP 200 · PC-ASIA SMOOTH/FAST · PLAY SCREEN ✓ · AUTH: STANDING BY ▲";

  if (bootEl) {
    if (reduced) {
      bootEl.textContent = BOOT;
    } else {
      let i = 0;
      const tick = () => {
        bootEl.textContent = BOOT.slice(0, i);
        i += 1;
        if (i <= BOOT.length) {
          setTimeout(tick, i < 8 ? 40 : 16 + Math.random() * 28);
        }
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Animated counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const fmt = (v) =>
      decimals > 0
        ? v.toFixed(decimals)
        : Math.round(v).toLocaleString("en-US");

    if (reduced) { el.textContent = fmt(target); return; }

    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counters = $$(".count[data-count]");
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

  /* ---------- Pipeline fills ---------- */
  const pipes = $$(".pipe[data-w]");
  if ("IntersectionObserver" in window) {
    const pio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const w = parseFloat(el.dataset.w);
          const fill = $(".pipe__fill", el);
          if (fill) {
            requestAnimationFrame(() => { fill.style.width = w + "%"; });
          }
          pio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    pipes.forEach((p) => pio.observe(p));
  } else {
    pipes.forEach((p) => {
      const fill = $(".pipe__fill", p);
      if (fill) fill.style.width = parseFloat(p.dataset.w) + "%";
    });
  }

  /* ---------- Devlog render + filter + expand ---------- */
  const list = $("#devlogList");
  const entries = Array.isArray(window.DEVLOG) ? window.DEVLOG : [];

  if (list) {
    if (!entries.length) {
      list.innerHTML = '<li class="dentry"><p class="dentry__head">No milestones loaded — js/devlog.js missing?</p></li>';
    } else {
      entries.forEach((entry, idx) => {
        const li = document.createElement("li");
        li.className = "dentry";
        li.dataset.tag = entry.tag;

        const head = document.createElement("button");
        head.className = "dentry__head";
        head.setAttribute("aria-expanded", "false");

        const date = document.createElement("span");
        date.className = "dentry__date mono";
        date.textContent = entry.date;

        const title = document.createElement("span");
        title.className = "dentry__title";
        title.textContent = entry.title;

        const tag = document.createElement("span");
        tag.className = "dentry__tag mono dentry__tag--" + entry.tag;
        tag.textContent = entry.tag;

        const plus = document.createElement("span");
        plus.className = "dentry__plus";
        plus.setAttribute("aria-hidden", "true");

        head.append(date, title, tag, plus);

        const body = document.createElement("div");
        body.className = "dentry__body";
        const ul = document.createElement("ul");
        (entry.done || []).forEach((d) => {
          const li2 = document.createElement("li");
          li2.textContent = d;
          ul.appendChild(li2);
        });
        body.appendChild(ul);

        head.addEventListener("click", () => {
          const open = li.classList.toggle("is-open");
          head.setAttribute("aria-expanded", String(open));
        });

        li.append(head, body);
        list.appendChild(li);
      });
    }

    $$(".devlog__filters .chip--btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        $$(".devlog__filters .chip--btn").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", String(on));
        });
        $$(".dentry", list).forEach((d) => {
          d.classList.toggle("is-hidden", f !== "ALL" && d.dataset.tag !== f);
        });
      });
    });
  }

  /* ---------- FAQ accordion (one open) ---------- */
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

  /* ---------- Magnetic buttons ---------- */
  if (!reduced && finePointer) {
    $$(".magnetic").forEach((el) => {
      const strength = 0.28;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform =
          "translate(" + (x * strength).toFixed(1) + "px," + (y * strength).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0,0)";
        el.style.transition = "transform 0.3s ease";
        setTimeout(() => { el.style.transition = ""; }, 300);
      });
    });
  }

  /* ---------- Heading scramble on hover ---------- */
  const GLYPHS = "UNBOUND▲#%&01AXK";
  if (!reduced) {
    $$("[data-scramble]").forEach((el) => {
      const originalNodes = Array.from(el.childNodes);
      let busy = false;

      el.addEventListener("pointerenter", () => {
        if (busy || finePointer === false) return;
        busy = true;
        const textNodes = [];
        const walk = (node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textNodes.push(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(walk);
          }
        };
        originalNodes.forEach(walk);

        const snapshots = textNodes.map((n) => n.textContent);
        const total = snapshots.join("").length;
        let frame = 0;
        const maxFrames = 14;

        const scrambleStep = () => {
          frame += 1;
          const progress = frame / maxFrames;
          let idx = 0;
          textNodes.forEach((n, i) => {
            const src = snapshots[i];
            let out = "";
            for (let c = 0; c < src.length; c++) {
              const globalPos = idx + c;
              const ch = src[c];
              if (ch === " " || globalPos / total < progress) {
                out += ch;
              } else {
                out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
              }
            }
            idx += src.length;
            n.textContent = out;
          });

          if (frame < maxFrames) {
            requestAnimationFrame(scrambleStep);
          } else {
            textNodes.forEach((n, i) => { n.textContent = snapshots[i]; });
            busy = false;
          }
        };
        requestAnimationFrame(scrambleStep);
      });
    });
  }

  /* ---------- Hero emblem tilt ---------- */
  const tilt = $("#heroTilt");
  if (tilt && !reduced && finePointer) {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      tilt.style.transform =
        "perspective(900px) rotateY(" + cx.toFixed(2) + "deg) rotateX(" + cy.toFixed(2) + "deg)";
      raf =
        Math.abs(tx - cx) > 0.04 || Math.abs(ty - cy) > 0.04
          ? requestAnimationFrame(tick)
          : 0;
    };
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 8;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    tilt.addEventListener("pointerleave", () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* ---------- Map card glare ---------- */
  if (!reduced && finePointer) {
    $$(".mcard").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--gx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--gy", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }
})();

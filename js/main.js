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

  // close the burger menu if the viewport grows past the nav breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
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

  /* ---------- Background canvas: bubbles + marine snow ---------- */
  const canvas = $("#bgCanvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let particles = [];
    let rafBg = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = (w * dpr) | 0;
      canvas.height = (h * dpr) | 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(70, Math.max(28, Math.floor((w * h) / 26000)));
      particles = Array.from({ length: target }, () => spawn(true));
    };

    const spawn = (anywhere) => {
      const kind = Math.random() < 0.24 ? "bubble" : "snow";
      return {
        kind,
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 12,
        r: kind === "bubble" ? 1 + Math.random() * 2.4 : 0.6 + Math.random() * 1.4,
        spd: kind === "bubble" ? 0.25 + Math.random() * 0.55 : 0.08 + Math.random() * 0.2,
        sway: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        alpha: kind === "bubble" ? 0.10 + Math.random() * 0.16 : 0.06 + Math.random() * 0.12,
      };
    };

    let tBg = 0;
    const draw = () => {
      tBg += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.spd;
        const ox = Math.sin(tBg * 0.7 + p.phase) * p.sway;
        if (p.y < -14) {
          particles[i] = spawn(false);
          continue;
        }
        if (p.kind === "bubble") {
          ctx.beginPath();
          ctx.arc(p.x + ox, p.y, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(150,180,235," + p.alpha + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x + ox, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(180,200,240," + p.alpha + ")";
          ctx.fill();
        }
      }
      rafBg = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafBg);
      } else {
        rafBg = requestAnimationFrame(draw);
      }
    });
  }

  /* ---------- Shark buddy: multi-part, springs after the cursor ---------- */
  const buddy = $("#buddy");
  const bubbleLayer = $("#bubbles");

  const spawnBubbles = (x, y, n) => {
    if (!bubbleLayer || reduced) return;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const s = 4 + Math.random() * 9;
      b.style.width = s.toFixed(1) + "px";
      b.style.height = s.toFixed(1) + "px";
      b.style.left = (x + (Math.random() * 28 - 14)).toFixed(0) + "px";
      b.style.top = (y + (Math.random() * 18 - 9)).toFixed(0) + "px";
      b.style.setProperty("--bx", (Math.random() * 34 - 17).toFixed(0) + "px");
      b.style.animationDuration = (0.85 + Math.random() * 0.85).toFixed(2) + "s";
      bubbleLayer.appendChild(b);
      b.addEventListener("animationend", () => b.remove(), { once: true });
    }
  };

  if (buddy && !reduced && finePointer && window.innerWidth > 900) {
    const wrap = $(".buddy__body-wrap", buddy);
    const pupil = $(".buddy__pupil", buddy);

    let mx = window.innerWidth * 0.72;
    let my = window.innerHeight * 0.42;
    let bx = mx + 220;
    let by = my + 140;
    let vx = 0, vy = 0;
    let facing = 1;          // 1 = right, -1 = left
    let bank = 0;
    let lastMove = 0;
    let hunting = false;
    let lunging = 0;
    let t = 0;
    let rafBuddy = 0;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    }, { passive: true });

    // click anywhere → lunge burst + bubble puff
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      lunging = 1;
      lastMove = performance.now();
      spawnBubbles(e.clientX, e.clientY, 6);
    });

    // hover CTAs / links → hunt posture
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(".btn, a[href]")) {
        hunting = true;
        buddy.classList.add("is-hunting");
      }
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(".btn, a[href]") && !e.relatedTarget?.closest?.(".btn, a[href]")) {
        hunting = false;
        buddy.classList.remove("is-hunting");
      }
    });

    const tickBuddy = () => {
      t += 0.016;
      const idle = performance.now() - lastMove > 2600;

      let tx, ty;
      if (idle) {
        tx = window.innerWidth * 0.5 + Math.sin(t * 0.42) * window.innerWidth * 0.32;
        ty = window.innerHeight * 0.55 + Math.cos(t * 0.31) * window.innerHeight * 0.2;
      } else {
        tx = mx;
        ty = my;
      }

      const dx = tx - bx;
      const dy = ty - by;
      const dist = Math.hypot(dx, dy) || 1;

      // spring pursuit — strike when close, cruise otherwise, boost on lunge
      const base = idle ? 0.011 : (dist < 170 ? 0.05 : 0.02);
      const speed = base * (1 + lunging * 2.2);
      vx += dx * speed;
      vy += dy * speed;
      vx *= 0.85;
      vy *= 0.85;
      bx += vx;
      by += vy;

      lunging *= 0.92;
      if (lunging < 0.02) lunging = 0;

      const sp = Math.hypot(vx, vy);
      if (vx > 0.35) facing = 1;
      else if (vx < -0.35) facing = -1;

      // bank into the turn (clamped)
      const targetBank = Math.max(-14, Math.min(14, vx * 0.5));
      bank += (targetBank - bank) * 0.12;

      const bob = Math.sin(t * 2.1) * 4;

      buddy.style.transform =
        "translate(" + (bx - 52).toFixed(1) + "px," + (by + bob - 22).toFixed(1) + "px)";

      if (wrap) {
        wrap.style.transform =
          "rotate(" + bank.toFixed(2) + "deg) scaleX(" + facing + ")";
      }

      // pupil tracks the cursor (local space accounts for flip)
      if (pupil) {
        const lx = Math.max(-2.2, Math.min(2.2, facing * dx * 0.012));
        const ly = Math.max(-1.6, Math.min(1.6, dy * 0.012));
        pupil.style.transform = "translate(" + lx.toFixed(2) + "px," + ly.toFixed(2) + "px)";
      }

      // wake trail while moving fast
      if (sp > 2.4 && Math.random() < 0.18) {
        spawnBubbles(bx - facing * 46, by + bob, 1);
      }

      rafBuddy = requestAnimationFrame(tickBuddy);
    };

    setTimeout(() => buddy.classList.add("is-awake"), 1600);
    rafBuddy = requestAnimationFrame(tickBuddy);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafBuddy);
      } else {
        rafBuddy = requestAnimationFrame(tickBuddy);
      }
    });
  }
})();

// Quantum Linux — descarga con animación, créditos y detalles
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const say = (m) => { if (typeof toast === "function") toast(m); };

  // ---- Pantalla de bienvenida (solo la primera visita): continúa sola o con el botón ----
  window.__welReady = true;
  const rootEl = document.documentElement, wel = $("#welcome");
  if (wel && rootEl.classList.contains("wel-on")) {
    const D = devicePixelRatio || 1, wring = (a, i) => `<g transform="rotate(${a} 128 128)"><ellipse class="ring" style="--i:${i}" cx="128" cy="128" rx="104" ry="38" fill="none" stroke="url(#lgw)" stroke-width="10" stroke-linecap="round" pathLength="1"/><circle class="odot" style="--i:${i}" r="11" fill="#fff"><animateMotion dur="${2.6 + i * 0.5}s" repeatCount="indefinite" path="M232 128A104 38 0 1 1 24 128A104 38 0 1 1 232 128"/></circle></g>`;
    $("#welLogo").innerHTML = `<svg viewBox="0 0 256 256" aria-hidden="true"><defs><linearGradient id="lgw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4FD8FF"/><stop offset=".5" stop-color="#6A5CFF"/><stop offset="1" stop-color="#B14DFF"/></linearGradient></defs><g class="spinIn"><g class="spin">${[90, -30, 30].map(wring).join("")}<g class="core"><polygon points="128,102 150.6,115 128,128 105.4,115" fill="#8CE8FF"/><polygon points="105.4,115 128,128 128,154 105.4,141" fill="#6A5CFF"/><polygon points="128,128 150.6,115 150.6,141 128,154" fill="#B14DFF"/></g></g></g></svg>`;
    const words = $("#welTitle").textContent.split(" "); let n = 0;
    $("#welTitle").setAttribute("aria-label", $("#welTitle").textContent);
    $("#welTitle").innerHTML = words.map((w, wi) => `<span class="w">${[...w].map((ch) => `<span class="c${wi >= words.length - 2 ? " g" : ""}" style="--i:${n++}" aria-hidden="true">${ch}</span>`).join("")}</span>`).join(" ");
    wel.insertAdjacentHTML("afterbegin", Array.from({ length: 22 }, () => `<b class="spark" style="--x:${(Math.random() * 100).toFixed(1)}%;--y:${(Math.random() * 100).toFixed(1)}%;--d:${(Math.random() * 3).toFixed(2)}s;--s:${(3 + Math.random() * 5).toFixed(1)}px"></b>`).join(""));

    // Polvo de estrellas y confeti en un lienzo aparte (queda por encima al abrir la página)
    const cv = document.createElement("canvas"), cx = cv.getContext("2d"); cv.className = "wel-fx"; document.body.appendChild(cv);
    const fit = () => { cv.width = innerWidth * D; cv.height = innerHeight * D; }; fit(); addEventListener("resize", fit);
    const COL = ["#2FC4F0", "#6A5CFF", "#B14DFF", "#FFB3E6", "#7FE3FF", "#FFFFFF"];
    const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: (1 + Math.random() * 2.2) * D, v: 0.00008 + Math.random() * 0.0002, a: 0.2 + Math.random() * 0.6, p: Math.random() * 6 }));
    let parts = [], raf = 0, closing = false, fade = 1;
    const burst = (x, y, k, spd) => { for (let i = 0; i < k; i++) { const a = Math.random() * 7, v = (0.4 + Math.random()) * spd * D; parts.push({ x: x * D, y: y * D, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4 * D, r: (4 + Math.random() * 7) * D, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: COL[i % 6], sq: Math.random() < 0.6, life: 1 }); } };
    const loop = (t) => {
      cx.clearRect(0, 0, cv.width, cv.height);
      if (closing) fade = Math.max(0, fade - 0.03);
      for (const d of dust) { d.y -= d.v * 16; if (d.y < 0) d.y = 1; cx.globalAlpha = d.a * fade * (0.5 + 0.5 * Math.sin(t / 700 + d.p)); cx.fillStyle = "#CFC8FF"; cx.beginPath(); cx.arc(d.x * cv.width, d.y * cv.height, d.r, 0, 7); cx.fill(); }
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.vy += 0.24 * D; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.006;
        cx.save(); cx.globalAlpha = Math.max(0, p.life); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
        if (p.sq) cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { cx.beginPath(); cx.arc(0, 0, p.r / 2, 0, 7); cx.fill(); }
        cx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    const done = () => { rootEl.classList.remove("wel-on"); try { localStorage.setItem("ql-welcome", "1"); } catch (_) {} wel.remove(); setTimeout(() => { cancelAnimationFrame(raf); cv.remove(); }, 3200); };
    const enter = (x, y) => {
      if (closing) return; closing = true; if (navigator.vibrate) navigator.vibrate(12);
      if (reduce) { wel.animate({ opacity: [1, 0] }, { duration: 300 }).onfinish = () => { done(); cancelAnimationFrame(raf); cv.remove(); }; return; }
      burst(x, y, 130, 12); setTimeout(() => burst(x, y, 70, 9), 250);
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      setTimeout(() => { wel.animate({ clipPath: [`circle(${r}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`] }, { duration: 950, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }).onfinish = done; }, 350);
    };
    const go = $("#welGo");
    go.addEventListener("click", () => { const r = go.getBoundingClientRect(); enter(r.left + r.width / 2, r.top + r.height / 2); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !closing && document.body.contains(wel)) enter(innerWidth / 2, innerHeight / 2); });
    let sy = null;   // deslizar hacia arriba también continúa
    wel.addEventListener("pointerdown", (e) => { sy = e.target.closest("#welGo") ? null : e.clientY; });
    wel.addEventListener("pointerup", (e) => { if (sy != null && sy - e.clientY > 80) enter(e.clientX, e.clientY); sy = null; });
    setTimeout(() => go.focus({ preventScroll: true }), 300);
    // no hace esperar a nadie: cuando termina de aparecer, sigue sola
    setTimeout(() => { if (document.body.contains(wel)) { const r = go.getBoundingClientRect(); enter(r.left + r.width / 2, r.top + r.height / 2); } }, reduce ? 1500 : 3200);
  }

  // ---- Al tocar «Descargar ISO»: pantalla de bienvenida y luego la página de descarga ----
  const btn = $("#downloadBtn");
  if (btn) {
    const TOTAL = reduce ? 600 : 1500, COL = ["#2FC4F0", "#6A5CFF", "#B14DFF", "#FFB3E6", "#7FE3FF", "#FFFFFF"];
    const words = "¡Que disfrutes Quantum Linux!".split(" "); let n = 0;
    const title = words.map((w, wi) => `<span class="w">${[...w].map((ch) => `<span class="c${wi >= words.length - 2 ? " g" : ""}" style="--i:${n++}">${ch}</span>`).join("")}</span>`).join(" ");
    const ring = (a, i) => `<g transform="rotate(${a} 128 128)"><ellipse class="ring" style="--i:${i}" cx="128" cy="128" rx="104" ry="38" fill="none" stroke="url(#lgq)" stroke-width="10" stroke-linecap="round" pathLength="1"/><circle class="odot" style="--i:${i}" r="11" fill="#fff"><animateMotion dur="${2.6 + i * 0.5}s" repeatCount="indefinite" path="M232 128A104 38 0 1 1 24 128A104 38 0 1 1 232 128"/></circle></g>`;
    const LOGO = `<svg viewBox="0 0 256 256" aria-hidden="true"><defs><linearGradient id="lgq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4FD8FF"/><stop offset=".5" stop-color="#6A5CFF"/><stop offset="1" stop-color="#B14DFF"/></linearGradient></defs><g class="spinIn"><g class="spin">${[90, -30, 30].map(ring).join("")}<g class="core"><polygon points="128,102 150.6,115 128,128 105.4,115" fill="#8CE8FF"/><polygon points="105.4,115 128,128 128,154 105.4,141" fill="#6A5CFF"/><polygon points="128,128 150.6,115 150.6,141 128,154" fill="#B14DFF"/></g></g></g></svg>`;
    const sparks = Array.from({ length: 18 }, () => `<b class="spark" style="--x:${(Math.random() * 100).toFixed(1)}%;--y:${(Math.random() * 100).toFixed(1)}%;--d:${(Math.random() * 3).toFixed(2)}s;--s:${(3 + Math.random() * 5).toFixed(1)}px"></b>`).join("");
    const ov = document.createElement("div");
    ov.className = "launch"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Descarga");
    ov.innerHTML = `${sparks}<canvas class="launch-fx"></canvas><div class="flash"></div><button class="launch-x" type="button" aria-label="Cerrar"><span class="ms">close</span></button>
      <div class="launch-card"><div class="launch-logo"><i></i><i></i><i></i>${LOGO}</div>
      <h2 class="launch-title" aria-label="¡Que disfrutes Quantum Linux!">${title}</h2><p class="launch-sub">Tu descarga empieza en un momento…</p><div class="launch-bar"><i></i></div><a class="launch-go" href="#">Ir ahora</a></div>`;
    document.body.appendChild(ov);
    const cv = $(".launch-fx", ov), cx = cv.getContext("2d"), dpr = () => devicePixelRatio || 1;
    let timer = 0, leave = 0, raf = 0, parts = [];
    const go = () => { clearTimeout(timer); location.assign(btn.href); };
    const close = () => { clearTimeout(timer); clearTimeout(leave); ov.classList.remove("leaving"); cancelAnimationFrame(raf); ov.classList.remove("show"); document.documentElement.style.overflow = ""; btn.focus({ preventScroll: true }); };
    const burst = (k, spd) => {
      for (let i = 0; i < k; i++) {
        const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * spd * dpr();
        parts.push({ x: cv.width / 2, y: cv.height * 0.42, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3 * dpr(), r: (4 + Math.random() * 7) * dpr(), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: COL[i % COL.length], sq: Math.random() < 0.6, life: 1 });
      }
    };
    const tick = () => {
      cx.clearRect(0, 0, cv.width, cv.height); parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.vy += 0.22 * dpr(); p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.0065;
        cx.save(); cx.globalAlpha = Math.max(0, p.life); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
        if (p.sq) cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { cx.beginPath(); cx.arc(0, 0, p.r / 2, 0, 7); cx.fill(); }
        cx.restore();
      }
      if (ov.classList.contains("show")) raf = requestAnimationFrame(tick);
    };
    const open = () => {
      cv.width = innerWidth * dpr(); cv.height = innerHeight * dpr(); parts = [];
      ov.classList.remove("show", "leaving"); void ov.offsetWidth; ov.classList.add("show"); clearTimeout(leave); leave = setTimeout(() => ov.classList.add("leaving"), TOTAL - 250); if (navigator.vibrate) navigator.vibrate([14, 60, 14]);   // reinicia las animaciones
      document.documentElement.style.overflow = "hidden"; $(".launch-go", ov).focus({ preventScroll: true });
      if (!reduce) { setTimeout(() => burst(150, 11), 150); setTimeout(() => burst(90, 8), 650); raf = requestAnimationFrame(tick); }
      timer = setTimeout(go, TOTAL);
    };
    btn.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || btn.getAttribute("href") === "#descargar") return;
      e.preventDefault(); open();
    });
    $(".launch-go", ov).addEventListener("click", (e) => { e.preventDefault(); go(); });
    $(".launch-x", ov).addEventListener("click", close);
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && ov.classList.contains("show")) close(); });
    addEventListener("pageshow", (e) => { if (e.persisted) close(); });
  }

  // ---- Copiar el SHA256 ----
  document.querySelectorAll(".copy").forEach((b) => b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy); const i = $(".ms", b); i.textContent = "check"; setTimeout(() => (i.textContent = "content_copy"), 1600); say("SHA256 copiado");
    } catch (_) { say("No se pudo copiar"); }
  }));

  // ---- Créditos: software libre en marquesina de dos filas ----
  const oss = $(".oss");
  if (oss) {
    const items = [...oss.querySelectorAll("a")], half = Math.ceil(items.length / 2);
    const row = (list, rev) => {
      const m = document.createElement("div"), tr = document.createElement("div"); m.className = "marquee" + (rev ? " rev" : ""); tr.className = "track";
      for (let k = 0; k < 6; k++) list.forEach((a) => { const c = a.cloneNode(true); if (k) { c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; } tr.appendChild(c); });
      m.appendChild(tr); return m;
    };
    oss.before(row(items.slice(0, half), false), row(items.slice(half), true)); oss.classList.add("built");
  }

  // ---- Inclinación 3D en las tarjetas del equipo (solo con mouse) ----
  if (!reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) document.querySelectorAll(".member").forEach((m) => {
    m.addEventListener("pointermove", (e) => {
      const r = m.getBoundingClientRect();
      m.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 14 + "deg"); m.style.setProperty("--rx", -((e.clientY - r.top) / r.height - 0.5) * 12 + "deg");
    });
    m.addEventListener("pointerleave", () => { m.style.setProperty("--rx", "0deg"); m.style.setProperty("--ry", "0deg"); });
  });

  // ---- Menú: resalta la sección en la que estás ----
  const nav = [...document.querySelectorAll('.links a[href^="#"]')], secs = nav.map((a) => document.querySelector(a.getAttribute("href")));
  const spy = () => { let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; }); nav.forEach((a, i) => a.classList.toggle("active", i === cur)); };
  addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true }); spy();

  // ================= MÓVIL Y EXTRAS =================
  const root = document.documentElement, mobile = () => root.dataset.device === "mobile", cl1 = (v) => Math.max(-1, Math.min(1, v));

  // Efecto de onda al tocar botones, pestañas y la barra inferior
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest && e.target.closest(".btn, .dock a, .tab, .launch-go, .copy"); if (!t || reduce) return;
    const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, i = document.createElement("span");
    i.className = "ripple"; i.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    t.appendChild(i); setTimeout(() => i.remove(), 650);
  });

  // Carrusel de tarjetas: la del centro se destaca y hay puntos indicadores
  const cards = $(".cards");
  if (cards) {
    const list = [...cards.children], dots = document.createElement("div"); let tk = 0;
    dots.className = "cdots"; dots.setAttribute("aria-hidden", "true"); dots.innerHTML = list.map(() => "<i></i>").join(""); cards.after(dots);
    const upd = () => {
      tk = 0; if (!mobile()) return;
      const c = cards.getBoundingClientRect(), mid = c.left + c.width / 2; let best = 0, bd = 1e9;
      list.forEach((el, i) => { const r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
      list.forEach((el, i) => el.classList.toggle("active", i === best)); [...dots.children].forEach((d, i) => d.classList.toggle("on", i === best));
    };
    cards.addEventListener("scroll", () => { if (!tk) tk = requestAnimationFrame(upd); }, { passive: true }); addEventListener("resize", upd); upd();
  }

  // Portada: se inclina con el dedo o con el giroscopio del celular
  const hs = $(".hero-shot"); let touching = false;
  if (hs) {
    const rel = () => { touching = false; hs.style.setProperty("--tx", "0"); hs.style.setProperty("--ty", "0"); };
    hs.addEventListener("pointermove", (e) => {
      if (!mobile() || e.pointerType === "mouse") return; touching = true; const r = hs.getBoundingClientRect();
      hs.style.setProperty("--tx", cl1(((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3)); hs.style.setProperty("--ty", cl1(((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => hs.addEventListener(ev, rel));
  }
  if (!reduce && "DeviceOrientationEvent" in window && typeof DeviceOrientationEvent.requestPermission !== "function") {
    addEventListener("deviceorientation", (e) => {
      if (!mobile() || e.gamma == null || touching) return; const g = cl1(e.gamma / 35), b = cl1(((e.beta || 0) - 55) / 35);
      root.style.setProperty("--px", (g * 0.5).toFixed(3)); root.style.setProperty("--py", (b * 0.5).toFixed(3));
      if (hs) { hs.style.setProperty("--tx", g.toFixed(3)); hs.style.setProperty("--ty", b.toFixed(3)); }
    }, { passive: true });
  }

  // Barra inferior: se esconde al bajar y vuelve al subir (como una app)
  const dock = $(".dock"); let ly = scrollY;
  if (dock) addEventListener("scroll", () => {
    const y = scrollY, d = y - ly; if (Math.abs(d) < 8) return; ly = y;
    dock.classList.toggle("hide", d > 0 && y > 500 && innerHeight + y < document.body.scrollHeight - 90);
  }, { passive: true });

  // Pasos: la línea de unión se dibuja al llegar
  const steps = $(".steps");
  if (steps) new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")), { threshold: 0.3 }).observe(steps);

  // ================= APP, SUBIR Y PREGUNTAS =================
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  // Botón para volver arriba, con anillo que muestra cuánto has avanzado
  const up = document.createElement("button"); up.type = "button"; up.className = "to-top"; up.setAttribute("aria-label", "Volver arriba");
  up.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength="1"/></svg><span class="ms">arrow_upward</span>'; document.body.appendChild(up);
  up.addEventListener("click", () => { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); if (navigator.vibrate) navigator.vibrate(8); });
  const upSync = () => { up.classList.toggle("on", scrollY > 700); up.querySelector("circle").style.strokeDashoffset = 1 - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sy")) || 0); };
  addEventListener("scroll", () => requestAnimationFrame(upSync), { passive: true }); upSync();

  // Preguntas frecuentes: se abren y cierran con animación suave
  if (!reduce) document.querySelectorAll(".faq details").forEach((d) => {
    const s = d.querySelector("summary"); let a = null;
    s.addEventListener("click", (e) => {
      e.preventDefault(); if (a) a.cancel();
      const from = d.offsetHeight, opening = !d.open; if (opening) d.open = true;
      const to = opening ? d.scrollHeight : s.offsetHeight; d.style.overflow = "hidden";
      a = d.animate({ height: [from + "px", to + "px"] }, { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
      a.onfinish = a.oncancel = () => { if (!opening) d.open = false; d.style.height = d.style.overflow = ""; a = null; };
    });
  });
})();

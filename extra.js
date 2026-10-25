// Quantum Linux — créditos, copiar SHA256 y detalles
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const say = (m) => { if (typeof toast === "function") toast(m); };

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
    const t = e.target.closest && e.target.closest(".btn, .dock a, .tab, .copy"); if (!t || reduce) return;
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

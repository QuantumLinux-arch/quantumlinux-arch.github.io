// Quantum Linux — mejoras: modo claro/oscuro, detección PC/móvil, blur y animaciones
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s) => document.querySelector(s);
  const saved = () => { try { return localStorage.getItem("ql-theme"); } catch (_) { return null; } };

  // Modo claro / oscuro (botón en la esquina)
  const meta = $('meta[name="theme-color"]');
  const paint = (t) => {
    root.dataset.theme = t;
    if (meta) meta.setAttribute("content", t === "dark" ? "#0C0920" : "#6A5CFF");
  };
  paint(root.dataset.theme || "light");

  const tbtn = document.createElement("button");
  tbtn.type = "button";
  tbtn.className = "theme-toggle";
  tbtn.setAttribute("aria-label", "Cambiar entre modo claro y oscuro");
  tbtn.innerHTML = '<span class="ms moon">dark_mode</span><span class="ms sun">light_mode</span>';
  document.body.appendChild(tbtn);

  tbtn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("ql-theme", next); } catch (_) {}
    if (!document.startViewTransition || reduce) {
      root.classList.add("theme-anim");
      paint(next);
      setTimeout(() => root.classList.remove("theme-anim"), 650);
      return;
    }
    // Cambio de tema con una onda circular que sale del botón
    const r = tbtn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => paint(next)).ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
      )
    );
  });
  // Mientras no elijan uno, sigue el tema del sistema
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!saved()) paint(e.matches ? "dark" : "light");
  });

  // Barra de progreso
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  // Barra inferior para móviles (usa los mismos nombres de las secciones)
  const dock = document.createElement("nav");
  dock.className = "dock";
  dock.setAttribute("aria-label", "Navegación");
  dock.innerHTML = [
    ["por-que", "auto_awesome", "Por qué"],
    ["capturas", "photo_library", "Capturas"],
    ["instalar", "usb", "Instalar"],
    ["preguntas", "help", "Preguntas"],
    ["descargar", "download", "Descargar"],
  ].map(([id, ic, t]) => `<a href="#${id}"${id === "descargar" ? ' class="dl"' : ""}><span class="ms">${ic}</span>${t}</a>`).join("");
  document.body.appendChild(dock);
  dock.addEventListener("click", () => navigator.vibrate && navigator.vibrate(8));

  // Scroll: progreso, parallax del fondo, barra que se encoge y sección activa
  const nav = $("#nav");
  const secs = ["por-que", "capturas", "comparacion", "instalar", "preguntas", "creditos"].map((id) => document.getElementById(id));
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty("--sy", (max > 0 ? Math.min(scrollY / max, 1) : 0).toFixed(4));
    nav.classList.toggle("scrolled", scrollY > 40);
    let cur = "";
    secs.forEach((s) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
    dock.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Mouse (solo PC): parallax del fondo, inclinación de la portada y luz en tarjetas
  if (fine && !reduce) {
    let raf = 0, nx = 0, ny = 0;
    addEventListener("pointermove", (e) => {
      nx = e.clientX / innerWidth - 0.5;
      ny = e.clientY / innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty("--px", nx.toFixed(3));
        root.style.setProperty("--py", ny.toFixed(3));
      });
      const c = e.target.closest && e.target.closest(".card,.member,.step");
      if (c) {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      }
    }, { passive: true });
  }

  // Órbitas alrededor de la portada
  const shot = $(".hero-shot");
  if (shot) shot.insertAdjacentHTML("beforeend", '<div class="orbit" aria-hidden="true"><i></i><i></i><i></i></div>');

  // Luz que sigue al mouse y botones magnéticos (solo PC)
  if (fine && !reduce) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("on"));
    (function loop() {
      gx += (tx - gx) * 0.09; gy += (ty - gy) * 0.09;
      glow.style.transform = `translate(${gx.toFixed(1)}px,${gy.toFixed(1)}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.classList.remove("mag-out");
        b.style.setProperty("--bx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        b.style.setProperty("--by", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", () => { b.classList.add("mag-out"); b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
    });
  }

  // Galería: la captura sale y entra deslizándose según la dirección, con brillo y subtítulo animado
  const tabs = [...document.querySelectorAll(".tab")];
  const gShot = document.getElementById("shot"), gCap = document.getElementById("caption");
  if (gShot && gCap && tabs.length) {
    let prev = tabs.findIndex((t) => t.classList.contains("active")), dir = 1;
    tabs.forEach((t, i) => t.addEventListener("click", () => {
      dir = i >= prev ? 1 : -1;
      prev = i;
      gShot.style.setProperty("--dir", dir);
    }));
    new MutationObserver(() => {
      if (reduce) return;
      gShot.animate([
        { opacity: 0, transform: `translateX(${dir * 90}px) scale(.92) rotateY(${-dir * 10}deg)`, filter: "blur(18px)" },
        { opacity: 1, transform: "none", filter: "blur(0px)" },
      ], { duration: 850, easing: "cubic-bezier(.22,1,.36,1)" });
      const m = gShot.closest(".monitor");
      m.classList.remove("flash"); void m.offsetWidth; m.classList.add("flash");
    }).observe(gShot, { attributes: true, attributeFilter: ["src"] });
    new MutationObserver(() => {
      if (reduce) return;
      gCap.animate([
        { opacity: 0, transform: "translateY(10px)", filter: "blur(6px)" },
        { opacity: 1, transform: "none", filter: "blur(0px)" },
      ], { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" });
    }).observe(gCap, { childList: true, characterData: true, subtree: true });
  }

  // Deslizar la captura con el dedo (o arrastrar con el mouse): siguiente / anterior
  if (gShot && tabs.length) {
    const box = gShot.closest(".monitor");
    const idx = () => tabs.findIndex((t) => t.classList.contains("active"));
    gShot.draggable = false;

    const dots = document.createElement("div");
    dots.className = "dots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = tabs.map(() => "<i></i>").join("");
    gCap.before(dots);
    const sync = (n) => [...dots.children].forEach((d, k) => d.classList.toggle("on", k === n));
    sync(idx());
    tabs.forEach((t, k) => t.addEventListener("click", () => sync(k)));

    const go = (step) => {
      const t = tabs[idx() + step];
      if (!t) return false;
      t.click();
      t.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      if (navigator.vibrate) navigator.vibrate(8);
      return true;
    };
    let sx = 0, sy = 0, dx = 0, drag = false, pid = null;
    box.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; dx = 0; drag = false; pid = e.pointerId; });
    box.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pid) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!drag && Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) {
        drag = true;
        box.setPointerCapture(pid);
        gShot.style.transition = "none";
      }
      if (!drag) return;
      dx = mx;
      const edge = !tabs[idx() + (dx < 0 ? 1 : -1)]; // en la primera/última captura se estira menos
      gShot.style.transform = `translateX(${dx * (edge ? 0.22 : 0.6)}px) scale(${1 - Math.min(Math.abs(dx), 300) / 3000})`;
    });
    const end = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      if (!drag) return;
      drag = false;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      gShot.style.transition = "";
      gShot.style.transform = "";
    };
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
  }
})();

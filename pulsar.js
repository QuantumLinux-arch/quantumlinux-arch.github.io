// Quantum Linux — web 2.0 «Pulsar»: fondo animado, menú del celular, copiar SHA256, capturas en grande,
// secciones que aparecen al bajar y botón para volver arriba.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const es = document.documentElement.lang !== "en";

  // el video de Pulsar solo en pantallas grandes y si no se pidió ahorrar datos o movimiento
  const box = document.querySelector(".hero .bg");
  const conn = navigator.connection || {};
  if (box && !reduce && !conn.saveData && innerWidth > 760) {
    const v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute("aria-hidden", "true");
    v.src = box.dataset.video;
    v.addEventListener("canplay", () => { v.classList.add("ready"); v.play().catch(() => {}); }, { once: true });
    box.appendChild(v);
    // pausar cuando no se ve (ahorra batería)
    new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())).observe(box);
  }

  // aviso abajo
  const toast = document.querySelector(".toast");
  const say = (m) => { if (!toast) return; toast.textContent = m; toast.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("show"), 2800); };

  // copiar el SHA256
  document.querySelectorAll(".copy").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say(es ? "Copiado" : "Copied"); }
    catch { say(es ? "No se pudo copiar" : "Couldn't copy"); }
  }));

  // menú del celular
  const menu = document.querySelector("nav.top ul"), mb = document.querySelector(".menu-btn");
  if (mb) mb.addEventListener("click", () => menu.classList.toggle("open"));
  menu && menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));

  // barra: más compacta al bajar; enlace de la sección actual resaltado
  const nav = document.querySelector("nav.top");
  const links = [...document.querySelectorAll('nav.top ul a[href^="#"]')];
  const spy = () => {
    nav.classList.toggle("scrolled", scrollY > 30);
    let cur = "";
    for (const a of links) { const s = document.querySelector(a.getAttribute("href")); if (s && s.getBoundingClientRect().top < 140) cur = a.getAttribute("href"); }
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === cur));
    up && up.classList.toggle("show", scrollY > 900);
  };
  const up = document.querySelector(".up");
  if (up) up.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true }); spy();

  // capturas en grande
  const lb = document.querySelector(".lightbox");
  document.querySelectorAll(".shot").forEach((s) => s.addEventListener("click", () => {
    lb.querySelector("img").src = s.querySelector("img").src; lb.classList.add("on");
  }));
  lb && lb.addEventListener("click", () => lb.classList.remove("on"));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && lb) lb.classList.remove("on"); });

  // aparecer al bajar
  const io = new IntersectionObserver((es2) => es2.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // funciona sin conexión (y carga al instante la segunda vez)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
    addEventListener("load", () => navigator.serviceWorker.register((es ? "" : "../") + "sw.js").catch(() => {}));
})();

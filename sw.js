// Quantum Linux — caché para que cargue al instante y funcione sin conexión.
// La página (HTML) siempre se pide primero a internet: así el enlace del ISO y el SHA256 nunca
// quedan viejos. Lo demás (estilos, scripts, imágenes) sale de la caché y se actualiza de fondo.
const VERSION = "quantum-v5", CORE = ["./", "index.html", "styles.css", "enhance.css", "extra.css", "main.js", "enhance.js", "extra.js", "manifest.webmanifest", "assets/quantum-mark.svg", "assets/favicon.png", "assets/icon-192.png",
  "assets/img/escritorio.webp", "assets/img/inicio.webp", "assets/img/store.webp", "assets/img/ajustes.webp", "assets/img/claro.webp"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== VERSION).map((n) => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const page = r.mode === "navigate" || (r.headers.get("accept") || "").includes("text/html");
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; });
    if (page) return net.catch(async () => (await c.match(r)) || c.match("index.html"));   // sin conexión: la copia
    const hit = await c.match(r);
    if (hit) { net.catch(() => {}); return hit; }   // archivos: la copia al instante; se actualiza en segundo plano
    return net;
  }));
});

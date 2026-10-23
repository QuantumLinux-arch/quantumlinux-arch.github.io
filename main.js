// Quantum Linux — interacciones de la página

// Enlaces: cuando estén publicados, se pegan aquí y la página los usa.
const LINKS = {
  download: "https://sourceforge.net/projects/quantum-linux/files/1.0/quantumlinux-1.0-2026.10.22-x86_64.iso/download",
  tiktok: "https://www.tiktok.com/@quantum.os",
  github: "https://github.com/QuantumLinux-arch",
};

const toast = (msg) => {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3200);
};

// Título que aparece letra por letra; las últimas dos palabras van con degradado
document.querySelectorAll(".kinetic").forEach((h) => {
  const words = h.dataset.text.split(" ");
  let i = 0;
  words.forEach((word, wi) => {
    const w = document.createElement("span");
    w.className = "w";
    for (const c of word) {
      const ch = document.createElement("span");
      ch.className = "ch" + (wi >= words.length - 2 ? " g" : "");
      ch.textContent = c;
      ch.style.animationDelay = `${0.15 + i++ * 0.035}s`;
      w.appendChild(ch);
    }
    h.appendChild(w);
    if (wi < words.length - 1) h.appendChild(document.createTextNode(" "));
  });
  h.setAttribute("aria-label", h.dataset.text);
});

// Aparición al hacer scroll, escalonada dentro de cada grupo
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.querySelectorAll(":scope > .reveal")];
    e.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(e.target)) * 70}ms`;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Galería de capturas
const captions = {
  escritorio: "El escritorio limpio, con la barra de tareas flotante abajo.",
  inicio: "El menú Inicio sale desde la barra, como en Windows 11.",
  store: "Quantum Store: apps de Arch, Flathub y la comunidad en un solo lugar.",
  ajustes: "El Centro Quantum: apariencia, fondos, ventanas y teclado.",
  claro: "Modo claro con colores tomados del fondo de pantalla.",
};
const shot = document.getElementById("shot");
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    const name = tab.dataset.shot;
    shot.classList.add("swap");
    const img = new Image();
    img.onload = () => {
      shot.src = img.src;
      document.getElementById("caption").textContent = captions[name];
      requestAnimationFrame(() => shot.classList.remove("swap"));
    };
    img.src = `assets/img/${name}.webp`;
  });
});

// Descarga y redes: si aún no hay enlace, se avisa en vez de llevar a ninguna parte
const btn = document.getElementById("downloadBtn");
if (LINKS.download) {
  btn.href = LINKS.download;
} else {
  document.getElementById("dlNote").textContent = "La descarga pública estará disponible muy pronto.";
  btn.addEventListener("click", (e) => { e.preventDefault(); toast("La descarga estará disponible muy pronto. Síguenos para enterarte."); });
}
for (const [id, key] of [["tiktokLink", "tiktok"], ["githubLink", "github"]]) {
  const a = document.getElementById(id);
  if (LINKS[key]) a.href = LINKS[key];
  else a.addEventListener("click", (e) => { e.preventDefault(); toast("Muy pronto."); });
}

// Menú en celulares
const toggle = document.getElementById("menuToggle");
const links = document.getElementById("links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.querySelector(".ms").textContent = open ? "close" : "menu";
});
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.querySelector(".ms").textContent = "menu";
}));

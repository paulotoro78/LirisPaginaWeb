async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  const mount = document.getElementById(id);
  if (!mount) return;
  mount.innerHTML = html;
}

function buildLink(item, currentPage, isMobile = false) {
  const el = document.createElement("a");
  el.href = item.href;
  el.textContent = item.label;

  // Estilos
  if (item.button) {
    el.className = isMobile
      ? "w-full text-center px-6 py-2.5 bg-primary text-white font-bold rounded"
      : "px-6 py-2.5 bg-primary text-white font-bold rounded";
  } else {
    el.className = isMobile
      ? "w-full px-3 py-2 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition"
      : "text-gray-600 dark:text-gray-200 hover:text-primary transition-colors";
  }

  // Link activo (solo para links normales)
  if (!item.button && item.href === currentPage) {
    if (isMobile) {
      el.classList.add("text-primary", "font-semibold");
    } else {
      el.classList.add("text-primary", "border-b-2", "border-primary", "pb-0.5");
    }
  }

  return el;
}

async function loadNavigation() {
  const res = await fetch("data/navigation.json");
  const links = await res.json();

  const desktopContainer = document.getElementById("nav-links");
  const mobileContainer = document.getElementById("mobile-nav-links");

  if (!desktopContainer && !mobileContainer) return;

  // Detecta página actual
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Limpia (por si recargas el componente)
  if (desktopContainer) desktopContainer.innerHTML = "";
  if (mobileContainer) mobileContainer.innerHTML = "";

  // Render links en ambos
  links.forEach((item) => {
    if (desktopContainer) desktopContainer.appendChild(buildLink(item, currentPage, false));
    if (mobileContainer) mobileContainer.appendChild(buildLink(item, currentPage, true));
  });
}

function setupMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (!btn || !menu) return;

  const closeMenu = () => {
    menu.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const willOpen = menu.classList.contains("hidden");
    menu.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  };

  // Abre/cierra al tocar hamburger
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Cierra al hacer click en un link dentro del menú móvil
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });

  // Cierra al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });

  // Si pasas a desktop, fuerza cerrar menú móvil
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMenu(); // 1024px = lg
  });
}


/* =========================
   TIMELINE (4 en 4)
========================= */
function initTimeline(batchSize = 4) {
  const items = document.querySelectorAll(".timeline-item");
  const btn = document.getElementById("loadMoreTimeline");

  if (!items.length || !btn) return;

  let visibleCount = batchSize;

  function update() {
    items.forEach((item, index) => {
      item.style.display = index < visibleCount ? "flex" : "none";
    });

    if (visibleCount >= items.length) {
      btn.style.display = "none";
    }
  }

  btn.addEventListener("click", () => {
    visibleCount += batchSize;
    update();
  });

  update();
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar", "components/navbar.html");
  await loadNavigation();

  await loadComponent("timeline", "components/timeline.html");
  initTimeline(4);

  setupMobileMenu();

  await loadComponent("footer", "components/footer.html");
});

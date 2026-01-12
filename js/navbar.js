async function loadComponent(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function loadNavigation() {
  const res = await fetch("data/navigation.json");
  const links = await res.json();
  const container = document.getElementById("nav-links");

  if (!container) return;

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  links.forEach(item => {
    const el = document.createElement("a");
    el.href = item.href;
    el.textContent = item.label;

    if (item.button) {
      el.className =
        "px-6 py-2.5 bg-primary text-white font-bold rounded";
    } else {
      el.className =
        "text-gray-600 hover:text-primary transition-colors";
    }

    if (!item.button && item.href === currentPage) {
      el.classList.add(
        "text-primary",
        "border-b-2",
        "border-primary",
        "pb-0.5"
      );
    }

    container.appendChild(el);
  });
}

/* =========================
   TIMELINE (4 en 4)
========================= */

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar", "components/navbar.html");
  await loadNavigation();

  loadComponent("footer", "components/footer.html");
});

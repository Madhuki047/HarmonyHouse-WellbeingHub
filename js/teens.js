const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const modals = document.querySelectorAll(".modal");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    mobileNav.classList.remove("open");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function openModal(id) {
  modals.forEach(modal => modal.classList.remove("open"));
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeModals() {
  modals.forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-open");

    if (modalId === "registerModal") {
      const eventName = button.getAttribute("data-event") || "Event";
      const eventDate = button.getAttribute("data-date") || "Date TBC";
      const eventNameEl = document.getElementById("modalEventName");
      const eventDateEl = document.getElementById("modalEventDate");
      if (eventNameEl) eventNameEl.textContent = eventName;
      if (eventDateEl) eventDateEl.textContent = eventDate;
    }

    openModal(modalId);
  });
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll("[data-switch]").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    const targetModal = button.getAttribute("data-switch");
    openModal(targetModal);
  });
});

modals.forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      closeModals();
    }
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModals();
});

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Prototype form submitted.");
    closeModals();
  });
});
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

const bookingModal = document.getElementById("bookingModal");
const signinModal = document.getElementById("signinModal");
const signupModal = document.getElementById("signupModal");

const bookingButtons = document.querySelectorAll(".open-booking");
const signinButtons = document.querySelectorAll(".open-signin");
const signupButtons = document.querySelectorAll(".open-signup");
const closeButtons = document.querySelectorAll(".close-btn");

const bookingEventLabel = document.getElementById("bookingEventLabel");
const bookingEventDate = document.getElementById("bookingEventDate");

const signupSwitchButtons = document.querySelectorAll(".open-signup-switch");
const signinSwitchButtons = document.querySelectorAll(".open-signin-switch");

menuBtn?.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});

mobileNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("active");
  });
});

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");

  if (!document.querySelector(".modal.active")) {
    document.body.style.overflow = "";
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "";
}

bookingButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const eventName = button.dataset.event || "Selected Event";
    const eventDate = button.dataset.date || "Choose from available event dates";

    bookingEventLabel.textContent = eventName;
    bookingEventDate.textContent = eventDate;

    openModal(bookingModal);
  });
});

signinButtons.forEach(button => {
  button.addEventListener("click", () => openModal(signinModal));
});

signupButtons.forEach(button => {
  button.addEventListener("click", () => openModal(signupModal));
});

signupSwitchButtons.forEach(button => {
  button.addEventListener("click", () => {
    closeModal(signinModal);
    openModal(signupModal);
  });
});

signinSwitchButtons.forEach(button => {
  button.addEventListener("click", () => {
    closeModal(signupModal);
    closeModal(bookingModal);
    openModal(signinModal);
  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const modalId = button.dataset.close;
    closeModal(document.getElementById(modalId));
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Prototype form submitted successfully.");
    form.reset();
    closeAllModals();
  });
});
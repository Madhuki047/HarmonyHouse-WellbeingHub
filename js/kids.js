const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

const bookingModal = document.getElementById("bookingModal");
const signupModal = document.getElementById("signupModal");
const signinModal = document.getElementById("signinModal");

const bookingButtons = document.querySelectorAll(".open-booking");
const signinButtons = document.querySelectorAll(".open-signin");
const signupButtons = document.querySelectorAll(".open-signup");
const closeButtons = document.querySelectorAll(".close-btn");

const bookingEventLabel = document.getElementById("bookingEventLabel");
const bookingEventDate = document.getElementById("bookingEventDate");

const signupSwitchButtons = document.querySelectorAll(".open-signup-switch");
const signinSwitchButtons = document.querySelectorAll(".open-signin-switch");

const bookingForm = document.getElementById("bookingForm");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

const heroFairy = document.getElementById("heroFairy");
const heroCar = document.getElementById("heroCar");

function burstOnHover(element, className) {
  if (!element) return;

  let burstTimeout;

  const triggerBurst = () => {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    clearTimeout(burstTimeout);
    burstTimeout = setTimeout(() => {
      element.classList.remove(className);
    }, 1100);
  };

  element.addEventListener("mouseenter", triggerBurst);
  element.addEventListener("click", triggerBurst);
  element.addEventListener("touchstart", triggerBurst, { passive: true });
}

burstOnHover(heroFairy, "is-bursting");
burstOnHover(heroCar, "is-bursting");

const heroSection = document.querySelector(".hero");

if (heroSection) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroSection.classList.remove("hero-animate");
          void heroSection.offsetWidth;
          heroSection.classList.add("hero-animate");
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  heroObserver.observe(heroSection);
}


/* MOBILE MENU */
if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const isActive = mobileNav.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(isActive));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* MODALS */
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
}

bookingButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const eventName = button.dataset.event || "Selected Event";
    const eventDate = button.dataset.date || "Choose from available event dates";

    bookingEventLabel.textContent = eventName;
    bookingEventDate.textContent = eventDate;

    openModal(bookingModal);
  });
});

signinButtons.forEach((button) => {
  button.addEventListener("click", () => openModal(signinModal));
});

signupButtons.forEach((button) => {
  button.addEventListener("click", () => openModal(signupModal));
});

signupSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(signinModal);
    openModal(signupModal);
  });
});

signinSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(signupModal);
    closeModal(bookingModal);
    openModal(signinModal);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.dataset.close;
    closeModal(document.getElementById(modalId));
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

/* FORM VALIDATION HELPERS */
function showError(input, message) {
  input.classList.add("input-error");
  const fieldGroup = input.closest(".field-group");
  const error = fieldGroup ? fieldGroup.querySelector(".error-message") : null;
  if (error) error.textContent = message;
}

function clearError(input) {
  input.classList.remove("input-error");
  const fieldGroup = input.closest(".field-group");
  const error = fieldGroup ? fieldGroup.querySelector(".error-message") : null;
  if (error) error.textContent = "";
}

function validateRequired(input, label) {
  const value = input.value.trim();
  if (!value) {
    showError(input, `${label} is required.`);
    return false;
  }
  clearError(input);
  return true;
}

function validateName(input, label, required = true) {
  const value = input.value.trim();
  const namePattern = /^[A-Za-zÀ-ÿ' -]+$/;

  if (!value) {
    if (required) {
      showError(input, `${label} is required.`);
      return false;
    }
    clearError(input);
    return true;
  }

  if (value.length < 2) {
    showError(input, `${label} must be at least 2 characters.`);
    return false;
  }

  if (!namePattern.test(value)) {
    showError(input, `${label} should only contain letters, spaces, apostrophes, or hyphens.`);
    return false;
  }

  clearError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!value) {
    showError(input, "Email is required.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(input, "Please enter a valid email address.");
    return false;
  }

  clearError(input);
  return true;
}

function validatePhone(input) {
  const value = input.value.trim();
  const phonePattern = /^[0-9+\s()-]{7,20}$/;

  if (!value) {
    showError(input, "Phone number is required.");
    return false;
  }

  if (!phonePattern.test(value)) {
    showError(input, "Please enter a valid phone number.");
    return false;
  }

  clearError(input);
  return true;
}

function validatePassword(input) {
  const value = input.value;

  if (!value.trim()) {
    showError(input, "Password is required.");
    return false;
  }

  if (value.length < 8) {
    showError(input, "Password must be at least 8 characters.");
    return false;
  }

  clearError(input);
  return true;
}

/* BOOKING FORM */
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const childFullName = bookingForm.querySelector("#childFullName");
    const guardianName = bookingForm.querySelector("#guardianName");
    const parentEmail = bookingForm.querySelector("#parentEmail");
    const parentPhone = bookingForm.querySelector("#parentPhone");

    const isValid =
      validateName(childFullName, "Child's full name") &&
      validateName(guardianName, "Parent/Guardian name") &&
      validateEmail(parentEmail) &&
      validatePhone(parentPhone);

    if (!isValid) return;

    alert("Registration submitted successfully.");
    bookingForm.reset();
    closeAllModals();
  });
}

/* SIGNUP FORM */
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const childFirstName = signupForm.querySelector("#childFirstName");
    const childLastName = signupForm.querySelector("#childLastName");
    const parentFirstName = signupForm.querySelector("#parentFirstName");
    const parentLastName = signupForm.querySelector("#parentLastName");
    const signupEmail = signupForm.querySelector("#signupEmail");
    const signupPassword = signupForm.querySelector("#signupPassword");

    const isValid =
      validateName(childFirstName, "Child's first name") &&
      validateName(childLastName, "Child's last name", false) &&
      validateName(parentFirstName, "Parent/Guardian first name") &&
      validateName(parentLastName, "Parent/Guardian last name") &&
      validateEmail(signupEmail) &&
      validatePassword(signupPassword);

    if (!isValid) return;

    alert("Account created successfully.");
    signupForm.reset();
    closeAllModals();
  });
}

/* SIGNIN FORM */
if (signinForm) {
  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const signinEmail = signinForm.querySelector("#signinEmail");
    const signinPassword = signinForm.querySelector("#signinPassword");

    const isValid =
      validateEmail(signinEmail) &&
      validateRequired(signinPassword, "Password");

    if (!isValid) return;

    alert("Signed in successfully.");
    signinForm.reset();
    closeAllModals();
  });
}

/* CLEAR ERRORS AS USER TYPES */
document.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    clearError(field);
  });
});
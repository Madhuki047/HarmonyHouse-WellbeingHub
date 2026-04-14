const modals = document.querySelectorAll(".modal");
const openButtons = document.querySelectorAll("[data-open]");
const closeButtons = document.querySelectorAll("[data-close]");
const switchButtons = document.querySelectorAll("[data-switch]");

const registerModal = document.getElementById("registerModal");
const signupModal = document.getElementById("signupModal");
const signinModal = document.getElementById("signinModal");

const signupForm = signupModal ? signupModal.querySelector("form") : null;
const signinForm = signinModal ? signinModal.querySelector("form") : null;
const registerForm = registerModal ? registerModal.querySelector("form") : null;

function openModal(id) {
  modals.forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("open");
    target.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeAllModals() {
  modals.forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  document.body.style.overflow = "";
}

openButtons.forEach(button => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-open");
    if (modalId) openModal(modalId);
  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", () => {
    closeAllModals();
  });
});

switchButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetModal = button.getAttribute("data-switch");
    if (targetModal) openModal(targetModal);
  });
});

modals.forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeAllModals();
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
  }
});

function showFieldError(input, message) {
  clearFieldError(input);

  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;

  input.classList.add("input-error");
  input.parentElement.appendChild(error);
}

function clearFieldError(input) {
  input.classList.remove("input-error");
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
}

function clearFormErrors(form) {
  const fields = form.querySelectorAll("input, textarea");
  fields.forEach(field => clearFieldError(field));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

function isStrongPassword(password) {
  return password.length >= 8;
}

function saveUserAccount(user) {
  localStorage.setItem("adultsHubUser", JSON.stringify(user));
}

function getSavedUserAccount() {
  const raw = localStorage.getItem("adultsHubUser");
  return raw ? JSON.parse(raw) : null;
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(signupForm);

    const firstName = signupForm.querySelector('input[placeholder="John"]');
    const lastName = signupForm.querySelector('input[placeholder="Smith"]');
    const email = signupForm.querySelector('input[type="email"]');
    const password = signupForm.querySelector('input[type="password"]');

    let valid = true;

    if (!firstName.value.trim()) {
      showFieldError(firstName, "First name is required.");
      valid = false;
    }

    if (!lastName.value.trim()) {
      showFieldError(lastName, "Last name is required.");
      valid = false;
    }

    if (!email.value.trim()) {
      showFieldError(email, "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    if (!password.value.trim()) {
      showFieldError(password, "Password is required.");
      valid = false;
    } else if (!isStrongPassword(password.value)) {
      showFieldError(password, "Password must be at least 8 characters.");
      valid = false;
    }

    if (!valid) return;

    saveUserAccount({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value
    });

    alert("Account created successfully.");
    signupForm.reset();
    closeAllModals();
  });
}

if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(signinForm);

    const email = signinForm.querySelector('input[type="email"]');
    const password = signinForm.querySelector('input[type="password"]');
    const savedUser = getSavedUserAccount();

    let valid = true;

    if (!email.value.trim()) {
      showFieldError(email, "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    if (!password.value.trim()) {
      showFieldError(password, "Password is required.");
      valid = false;
    }

    if (!valid) return;

    if (!savedUser) {
      showFieldError(email, "No account found. Please sign up first.");
      return;
    }

    if (email.value.trim().toLowerCase() !== savedUser.email || password.value !== savedUser.password) {
      showFieldError(password, "Incorrect email or password.");
      return;
    }

    alert(`Welcome back, ${savedUser.firstName}!`);
    signinForm.reset();
    closeAllModals();
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(registerForm);

    const name = registerForm.querySelector('input[placeholder="John Smith"]');
    const email = registerForm.querySelector('input[type="email"]');
    const phone = registerForm.querySelector('input[placeholder="(555) 123-4567"]');

    let valid = true;

    if (!name.value.trim()) {
      showFieldError(name, "Full name is required.");
      valid = false;
    }

    if (!email.value.trim()) {
      showFieldError(email, "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    if (!phone.value.trim()) {
      showFieldError(phone, "Phone number is required.");
      valid = false;
    } else if (!isValidPhone(phone.value)) {
      showFieldError(phone, "Enter a valid phone number.");
      valid = false;
    }

    if (!valid) return;

    alert("Registration completed successfully.");
    registerForm.reset();
    closeAllModals();
  });
}
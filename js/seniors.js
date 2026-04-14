const modals = document.querySelectorAll(".modal");
const openButtons = document.querySelectorAll("[data-open]");
const closeButtons = document.querySelectorAll("[data-close]");
const switchButtons = document.querySelectorAll("[data-switch]");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

const registerForm = document.getElementById("registerForm");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

const registerEventName = document.getElementById("registerEventName");
const registerEventDate = document.getElementById("registerEventDate");

const accountGuestView = document.getElementById("accountGuestView");
const accountUserView = document.getElementById("accountUserView");
const accountUserName = document.getElementById("accountUserName");
const signOutBtn = document.getElementById("signOutBtn");
const registeredEventsWrap = document.getElementById("registeredEventsWrap");
const registeredEventsList = document.getElementById("registeredEventsList");

const STORAGE_KEYS = {
  user: "seniorsHubUser",
  session: "seniorsHubCurrentUser",
  events: "seniorsHubRegisteredEvents"
};

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
    if (mobileNav) mobileNav.classList.remove("open");
    target.scrollIntoView({ behavior: "smooth" });
  });
});

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

    if (modalId === "registerModal") {
      const eventName = button.getAttribute("data-event") || "Event";
      const eventDate = button.getAttribute("data-date") || "Date TBC";

      if (registerEventName) registerEventName.textContent = eventName;
      if (registerEventDate) registerEventDate.textContent = eventDate;

      const currentUser = getCurrentUser();
      if (currentUser && registerForm) {
        const fullNameInput = registerForm.querySelector('[name="fullName"]');
        const emailInput = registerForm.querySelector('[name="email"]');

        if (fullNameInput) {
          fullNameInput.value = `${currentUser.firstName} ${currentUser.lastName}`;
        }

        if (emailInput) {
          emailInput.value = currentUser.email;
        }
      }
    }

    if (modalId) openModal(modalId);
  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", closeAllModals);
});

switchButtons.forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    const targetModal = button.getAttribute("data-switch");
    if (targetModal) openModal(targetModal);
  });
});

modals.forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      closeAllModals();
    }
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeAllModals();
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
  const oldError = input.parentElement.querySelector(".field-error");
  if (oldError) oldError.remove();
}

function clearFormErrors(form) {
  form.querySelectorAll("input, textarea").forEach(field => clearFieldError(field));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function getSavedUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.session);
  return raw ? JSON.parse(raw) : null;
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getRegisteredEvents() {
  const raw = localStorage.getItem(STORAGE_KEYS.events);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

function renderRegisteredEvents() {
  if (!registeredEventsList || !registeredEventsWrap) return;

  const currentUser = getCurrentUser();
  const events = getRegisteredEvents();

  if (!currentUser) {
    registeredEventsWrap.classList.add("hidden");
    registeredEventsList.innerHTML = "";
    return;
  }

  const userEvents = events.filter(
    event => event.userEmail === currentUser.email
  );

  if (userEvents.length === 0) {
    registeredEventsWrap.classList.add("hidden");
    registeredEventsList.innerHTML = "";
    return;
  }

  registeredEventsWrap.classList.remove("hidden");

  registeredEventsList.innerHTML = userEvents.map((event, index) => `
    <div class="registered-event-card">
      <h4>${event.eventName}</h4>
      <p><strong>Date:</strong> ${event.eventDate}</p>
      <p><strong>Name:</strong> ${event.fullName}</p>
      <p><strong>Email:</strong> ${event.email}</p>
      <button type="button" class="btn outline full remove-registration-btn" data-index="${index}">Cancel Registration</button>
    </div>
  `).join("");

  document.querySelectorAll(".remove-registration-btn").forEach(button => {
    button.addEventListener("click", () => {
      const visibleIndex = Number(button.getAttribute("data-index"));
      const allEvents = getRegisteredEvents();
      const userEmail = currentUser.email;

      const matchingIndexes = allEvents
        .map((event, idx) => ({ event, idx }))
        .filter(item => item.event.userEmail === userEmail);

      const actualIndex = matchingIndexes[visibleIndex]?.idx;

      if (actualIndex === undefined) return;

      allEvents.splice(actualIndex, 1);
      saveRegisteredEvents(allEvents);
      renderRegisteredEvents();
    });
  });
}

function updateAccountUI() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    if (accountGuestView) accountGuestView.classList.add("hidden");
    if (accountUserView) accountUserView.classList.remove("hidden");
    if (accountUserName) accountUserName.textContent = currentUser.firstName.toLowerCase();
  } else {
    if (accountGuestView) accountGuestView.classList.remove("hidden");
    if (accountUserView) accountUserView.classList.add("hidden");
    if (registeredEventsWrap) registeredEventsWrap.classList.add("hidden");
  }

  renderRegisteredEvents();
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    clearCurrentUser();
    updateAccountUI();
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    clearFormErrors(signupForm);

    const firstName = signupForm.querySelector('[name="firstName"]');
    const lastName = signupForm.querySelector('[name="lastName"]');
    const email = signupForm.querySelector('[name="email"]');
    const password = signupForm.querySelector('[name="password"]');

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
    } else if (password.value.length < 8) {
      showFieldError(password, "Password must be at least 8 characters.");
      valid = false;
    }

    if (!valid) return;

    const user = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value
    };

    saveUser(user);
    setCurrentUser(user);

    alert("Account created successfully.");
    signupForm.reset();
    closeAllModals();
    updateAccountUI();
  });
}

if (signinForm) {
  signinForm.addEventListener("submit", e => {
    e.preventDefault();
    clearFormErrors(signinForm);

    const email = signinForm.querySelector('[name="email"]');
    const password = signinForm.querySelector('[name="password"]');
    const savedUser = getSavedUser();

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
      showFieldError(email, "No account found. Please create an account first.");
      return;
    }

    if (
      email.value.trim().toLowerCase() !== savedUser.email ||
      password.value !== savedUser.password
    ) {
      showFieldError(password, "Incorrect email or password.");
      return;
    }

    setCurrentUser(savedUser);

    alert(`Welcome back, ${savedUser.firstName}!`);
    signinForm.reset();
    closeAllModals();
    updateAccountUI();
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    clearFormErrors(registerForm);

    const fullName = registerForm.querySelector('[name="fullName"]');
    const email = registerForm.querySelector('[name="email"]');
    const phone = registerForm.querySelector('[name="phone"]');
    const emergencyContact = registerForm.querySelector('[name="emergencyContact"]');

    let valid = true;

    if (!fullName.value.trim()) {
      showFieldError(fullName, "Full name is required.");
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

    if (!emergencyContact.value.trim()) {
      showFieldError(emergencyContact, "Emergency contact is required.");
      valid = false;
    }

    if (!valid) return;

    const currentUser = getCurrentUser();
    const allEvents = getRegisteredEvents();

    const registration = {
      eventName: registerEventName ? registerEventName.textContent : "Event",
      eventDate: registerEventDate ? registerEventDate.textContent : "Date TBC",
      fullName: fullName.value.trim(),
      email: email.value.trim().toLowerCase(),
      phone: phone.value.trim(),
      emergencyContact: emergencyContact.value.trim(),
      medicalInfo: registerForm.querySelector('[name="medicalInfo"]')?.value.trim() || "",
      userEmail: currentUser ? currentUser.email : email.value.trim().toLowerCase()
    };

    allEvents.push(registration);
    saveRegisteredEvents(allEvents);

    alert("Registration completed successfully.");
    registerForm.reset();
    closeAllModals();
    updateAccountUI();
  });
}

updateAccountUI();
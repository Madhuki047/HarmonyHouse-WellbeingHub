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

const guestView = document.getElementById("accountGuestView");
const dashboardView = document.getElementById("accountUserView");
const dashboardWelcome = document.getElementById("accountUserName");
const signOutBtn = document.getElementById("signOutBtn");
const registeredEventsWrap = document.getElementById("registeredEventsWrap");
const registeredEventsList = document.getElementById("registeredEventsList");
const statRegistered = document.getElementById("statRegistered");
const statUpcoming = document.getElementById("statUpcoming");

const searchForm = document.getElementById("siteSearchForm");
const searchInput = document.getElementById("siteSearchInput");
const mobileSearchForm = document.getElementById("mobileSearchForm");
const mobileSearchInput = document.getElementById("mobileSearchInput");
const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");
const searchStatus = document.getElementById("searchStatus");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const STORAGE_KEYS = {
  user: "seniorsHubUser",
  events: "seniorsHubRegisteredEvents"
};

const formTemplates = new Map();
[registerForm, signupForm, signinForm].forEach((form) => {
  if (form) {
    formTemplates.set(form.id, form.innerHTML);
  }
});

/* -------------------------- MOBILE NAV -------------------------- */
function closeMobileNav() {
  if (!mobileNav || !menuBtn) return;
  mobileNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    closeMobileNav();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (mobileNav) {
  mobileNav.querySelectorAll('a[href^="#"], button[data-open]').forEach((item) => {
    item.addEventListener("click", () => {
      closeMobileNav();
    });
  });
}

document.addEventListener("click", (e) => {
  const clickedInsideMobileMenu =
    mobileNav?.contains(e.target) ||
    menuBtn?.contains(e.target);

  if (!clickedInsideMobileMenu) {
    closeMobileNav();
  }
});

/* -------------------------- MODALS -------------------------- */
function restoreFormState(form) {
  if (!form) return;
  const originalMarkup = formTemplates.get(form.id);
  if (!originalMarkup) return;

  if (form.dataset.successState === "true") {
    form.innerHTML = originalMarkup;
    delete form.dataset.successState;
  }
}

function restoreAllForms() {
  restoreFormState(registerForm);
  restoreFormState(signupForm);
  restoreFormState(signinForm);
  attachClearErrorListeners();
}

function openModal(id) {
  modals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  restoreAllForms();

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("open");
    target.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (id === "registerModal") {
      autofillRegisterForm();
    }
  }
}

function closeAllModals() {
  modals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

openButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const modalId = button.getAttribute("data-open");

    if (modalId === "registerModal") {
      const eventName = button.getAttribute("data-event") || "Event";
      const eventDate = button.getAttribute("data-date") || "Date TBC";

      if (registerEventName) registerEventName.textContent = eventName;
      if (registerEventDate) registerEventDate.textContent = eventDate;
    }

    if (modalId) openModal(modalId);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeAllModals);
});

switchButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetModal = button.getAttribute("data-switch");
    if (targetModal) openModal(targetModal);
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeAllModals();
    }
  });
});

/* -------------------------- FORM ERRORS -------------------------- */
function showFieldError(input, message) {
  clearFieldError(input);
  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;
  input.classList.add("input-error");
  input.parentElement.appendChild(error);
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove("input-error");
  const oldError = input.parentElement.querySelector(".field-error");
  if (oldError) oldError.remove();
}

function clearFormErrors(form) {
  form.querySelectorAll("input, textarea").forEach((field) => clearFieldError(field));
}

function attachClearErrorListeners() {
  document.querySelectorAll(".modal-form input, .modal-form textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

/* -------------------------- STORAGE -------------------------- */
function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function getSavedUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function clearSavedUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

function getRegisteredEvents() {
  const raw = localStorage.getItem(STORAGE_KEYS.events);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

/* -------------------------- SEARCH -------------------------- */
function hideSearchResults() {
  if (searchResults) searchResults.hidden = true;
}

function performSearch(query) {
  if (!searchResults || !searchResultsList || !searchStatus) return;

  const trimmedQuery = query.trim().toLowerCase();
  searchResultsList.innerHTML = "";

  if (!trimmedQuery) {
    hideSearchResults();
    return;
  }

  const searchableItems = document.querySelectorAll(".searchable-section, .searchable-card");
  const matches = [];

  searchableItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (!text.includes(trimmedQuery)) return;

    let title = "";
    let link = "#";

    if (item.classList.contains("searchable-section")) {
      const heading = item.querySelector("h2, h3");
      title = heading ? heading.textContent.trim() : "Section";
      link = item.id ? `#${item.id}` : "#";
    } else {
      const heading = item.querySelector("h3, h4, strong");
      title = heading ? heading.textContent.trim() : "Result";
      const parentSection = item.closest("section");
      link = parentSection && parentSection.id ? `#${parentSection.id}` : "#";
    }

    matches.push({ title, link });
  });

  const uniqueMatches = matches.filter(
    (item, index, self) =>
      index === self.findIndex((entry) => entry.title === item.title && entry.link === item.link)
  );

  if (uniqueMatches.length === 0) {
    searchStatus.innerHTML = `No results found for "<strong>${query}</strong>".`;
    searchResultsList.innerHTML = "";
    searchResults.hidden = false;
    return;
  }

  searchStatus.innerHTML = `${uniqueMatches.length} result${uniqueMatches.length === 1 ? "" : "s"} found for "<strong>${query}</strong>".`;

  uniqueMatches.forEach((match) => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.innerHTML = `<a href="${match.link}">${match.title}</a>`;
    searchResultsList.appendChild(item);
  });

  searchResults.hidden = false;
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(searchInput ? searchInput.value : "");
  });
}

if (mobileSearchForm) {
  mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(mobileSearchInput ? mobileSearchInput.value : "");
    closeMobileNav();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
      hideSearchResults();
    }
  });
}

if (mobileSearchInput) {
  mobileSearchInput.addEventListener("input", () => {
    if (!mobileSearchInput.value.trim()) {
      hideSearchResults();
    }
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (mobileSearchInput) mobileSearchInput.value = "";
    hideSearchResults();
  });
}

document.addEventListener("click", (e) => {
  const isInsideSearch =
    searchForm?.contains(e.target) ||
    mobileSearchForm?.contains(e.target) ||
    searchResults?.contains(e.target);

  if (!isInsideSearch) {
    hideSearchResults();
  }
});

if (searchResultsList) {
  searchResultsList.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    hideSearchResults();
    if (searchInput) searchInput.value = "";
    if (mobileSearchInput) mobileSearchInput.value = "";
  });
}

/* -------------------------- SUCCESS -------------------------- */
function showFormSuccess(form, title, message) {
  if (!form) return;

  form.innerHTML = `
    <div class="form-success-message">
      <div class="form-success-icon">✓</div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
  form.dataset.successState = "true";
}

/* -------------------------- ACCOUNT / DASHBOARD -------------------------- */
function renderRegisteredEvents() {
  if (!registeredEventsList || !registeredEventsWrap) return;

  const currentUser = getSavedUser();
  const events = getRegisteredEvents();

  if (!currentUser) {
    registeredEventsWrap.classList.add("hidden");
    registeredEventsList.innerHTML = "";
    return;
  }

  const userEvents = events.filter((event) => event.userEmail === currentUser.email);

  if (statRegistered) statRegistered.textContent = String(userEvents.length);
  if (statUpcoming) statUpcoming.textContent = String(userEvents.length);

  if (userEvents.length === 0) {
    registeredEventsWrap.classList.remove("hidden");
    registeredEventsList.innerHTML = `<div class="dashboard-empty">You have not registered for any events yet.</div>`;
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

  document.querySelectorAll(".remove-registration-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const visibleIndex = Number(button.getAttribute("data-index"));
      const allEvents = getRegisteredEvents();
      const userEmail = currentUser.email;

      const matchingIndexes = allEvents
        .map((event, idx) => ({ event, idx }))
        .filter((item) => item.event.userEmail === userEmail);

      const actualIndex = matchingIndexes[visibleIndex]?.idx;
      if (actualIndex === undefined) return;

      allEvents.splice(actualIndex, 1);
      saveRegisteredEvents(allEvents);
      updateAccountUI();
    });
  });
}

function updateAccountUI() {
  const currentUser = getSavedUser();

  if (currentUser) {
    if (guestView) guestView.classList.add("hidden");
    if (dashboardView) dashboardView.classList.remove("hidden");
    if (dashboardWelcome) dashboardWelcome.textContent = currentUser.firstName;
  } else {
    if (guestView) guestView.classList.remove("hidden");
    if (dashboardView) dashboardView.classList.add("hidden");
    if (registeredEventsWrap) registeredEventsWrap.classList.add("hidden");
    if (statRegistered) statRegistered.textContent = "0";
    if (statUpcoming) statUpcoming.textContent = "0";
  }

  renderRegisteredEvents();
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    clearSavedUser();
    updateAccountUI();
  });
}

/* -------------------------- REGISTER AUTOFILL -------------------------- */
function autofillRegisterForm() {
  const currentUser = getSavedUser();
  if (!currentUser || !registerForm) return;

  const fullNameInput = registerForm.querySelector('[name="fullName"]');
  const emailInput = registerForm.querySelector('[name="email"]');

  if (fullNameInput && !fullNameInput.value.trim()) {
    fullNameInput.value = `${currentUser.firstName} ${currentUser.lastName}`;
  }

  if (emailInput && !emailInput.value.trim()) {
    emailInput.value = currentUser.email;
  }
}

/* -------------------------- SIGN UP -------------------------- */
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
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

    showFormSuccess(
      signupForm,
      "Account created!",
      "Your Seniors Hub account has been created successfully."
    );

    updateAccountUI();
  });
}

/* -------------------------- SIGN IN -------------------------- */
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
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

    showFormSuccess(
      signinForm,
      "Signed in successfully!",
      `Welcome back, ${savedUser.firstName}!`
    );

    updateAccountUI();
  });
}

/* -------------------------- REGISTER EVENT -------------------------- */
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
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

    const currentUser = getSavedUser();
    if (!currentUser) {
      closeAllModals();
      openModal("signinModal");
      return;
    }

    const allEvents = getRegisteredEvents();

    const registration = {
      eventName: registerEventName ? registerEventName.textContent : "Event",
      eventDate: registerEventDate ? registerEventDate.textContent : "Date TBC",
      fullName: fullName.value.trim(),
      email: email.value.trim().toLowerCase(),
      phone: phone.value.trim(),
      emergencyContact: emergencyContact.value.trim(),
      medicalInfo: registerForm.querySelector('[name="medicalInfo"]')?.value.trim() || "",
      userEmail: currentUser.email
    };

    const alreadyRegistered = allEvents.some(
      (event) =>
        event.userEmail === currentUser.email &&
        event.eventName === registration.eventName &&
        event.eventDate === registration.eventDate
    );

    if (!alreadyRegistered) {
      allEvents.push(registration);
      saveRegisteredEvents(allEvents);
    }

    showFormSuccess(
      registerForm,
      "Registration confirmed!",
      `You are successfully registered for ${registration.eventName}.`
    );

    updateAccountUI();
  });
}

/* -------------------------- ESC -------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
    hideSearchResults();
    closeMobileNav();
  }
});

/* -------------------------- INIT -------------------------- */
attachClearErrorListeners();
updateAccountUI();
const modals = document.querySelectorAll(".modal");
const openButtons = document.querySelectorAll("[data-open]");
const closeButtons = document.querySelectorAll("[data-close]");
const switchButtons = document.querySelectorAll("[data-switch]");

const registerModal = document.getElementById("registerModal");
const signupModal = document.getElementById("signupModal");
const signinModal = document.getElementById("signinModal");

const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");
const registerForm = document.getElementById("registerForm");

const searchForm = document.getElementById("siteSearchForm");
const searchInput = document.getElementById("siteSearchInput");
const mobileSearchForm = document.getElementById("mobileSearchForm");
const mobileSearchInput = document.getElementById("mobileSearchInput");

const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");
const searchStatus = document.getElementById("searchStatus");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const guestView = document.getElementById("guestView");
const dashboardView = document.getElementById("dashboardView");
const dashboardWelcome = document.getElementById("dashboardWelcome");
const statRegistered = document.getElementById("statRegistered");
const statUpcoming = document.getElementById("statUpcoming");
const registeredEventsList = document.getElementById("registeredEventsList");
const signOutBtn = document.getElementById("signOutBtn");

const modalEventName = document.getElementById("modalEventName");
const modalEventDate = document.getElementById("modalEventDate");

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

const STORAGE_KEYS = {
  user: "adultsHubUser",
  events: "adultsHubRegisteredEvents"
};

const formTemplates = new Map();
[registerForm, signupForm, signinForm].forEach((form) => {
  if (form) {
    formTemplates.set(form.id, form.innerHTML);
  }
});

/* -------------------- MOBILE NAV -------------------- */
function closeMobileNav() {
  if (!mobileNav || !menuBtn) return;
  mobileNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function openMobileNav() {
  if (!mobileNav || !menuBtn) return;
  mobileNav.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
}

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = mobileNav.classList.contains("open");

    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
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

if (mobileNav) {
  mobileNav.querySelectorAll('a[href^="#"], button[data-open]').forEach((item) => {
    item.addEventListener("click", () => {
      closeMobileNav();
    });
  });
}

/* -------------------- STORAGE -------------------- */
function saveUserAccount(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function getSavedUserAccount() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function clearSavedUserAccount() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

function getRegisteredEvents() {
  const raw = localStorage.getItem(STORAGE_KEYS.events);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

/* -------------------- MODALS -------------------- */
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

      if (modalEventName) modalEventName.textContent = eventName;
      if (modalEventDate) modalEventDate.textContent = eventDate;
    }

    if (modalId) openModal(modalId);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeAllModals();
  });
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

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
    hideSearchResults();
    closeMobileNav();
  }
});

/* -------------------- FORM ERRORS -------------------- */
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
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
}

function clearFormErrors(form) {
  const fields = form.querySelectorAll("input, textarea");
  fields.forEach((field) => clearFieldError(field));
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

function isStrongPassword(password) {
  return password.length >= 8;
}

/* -------------------- SUCCESS UI -------------------- */
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

/* -------------------- SEARCH -------------------- */
function hideSearchResults() {
  if (searchResults) {
    searchResults.hidden = true;
  }
}

function clearBothSearchInputs() {
  if (searchInput) searchInput.value = "";
  if (mobileSearchInput) mobileSearchInput.value = "";
}

function syncSearchInputs(value) {
  if (searchInput) searchInput.value = value;
  if (mobileSearchInput) mobileSearchInput.value = value;
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
      index === self.findIndex(
        (entry) => entry.title === item.title && entry.link === item.link
      )
  );

  if (uniqueMatches.length === 0) {
    searchStatus.innerHTML = `No results found for "<strong>${query}</strong>".`;
    searchResultsList.innerHTML = "";
    searchResults.hidden = false;
    return;
  }

  searchStatus.innerHTML = `${uniqueMatches.length} result${
    uniqueMatches.length === 1 ? "" : "s"
  } found for "<strong>${query}</strong>".`;

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
    const value = searchInput ? searchInput.value : "";
    syncSearchInputs(value);
    performSearch(value);
  });
}

if (mobileSearchForm) {
  mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = mobileSearchInput ? mobileSearchInput.value : "";
    syncSearchInputs(value);
    performSearch(value);
    closeMobileNav();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    syncSearchInputs(searchInput.value);
    if (!searchInput.value.trim()) {
      hideSearchResults();
    }
  });
}

if (mobileSearchInput) {
  mobileSearchInput.addEventListener("input", () => {
    syncSearchInputs(mobileSearchInput.value);
    if (!mobileSearchInput.value.trim()) {
      hideSearchResults();
    }
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    clearBothSearchInputs();
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
    clearBothSearchInputs();
  });
}

/* -------------------- DASHBOARD -------------------- */
function renderDashboard() {
  const savedUser = getSavedUserAccount();
  const events = getRegisteredEvents();

  if (!guestView || !dashboardView) return;

  if (!savedUser) {
    guestView.hidden = false;
    dashboardView.hidden = true;
    return;
  }

  guestView.hidden = true;
  dashboardView.hidden = false;

  if (dashboardWelcome) {
    dashboardWelcome.textContent = `Welcome, ${savedUser.firstName || "Friend"}!`;
  }

  if (statRegistered) statRegistered.textContent = String(events.length);
  if (statUpcoming) statUpcoming.textContent = String(events.length);

  if (registeredEventsList) {
    if (events.length === 0) {
      registeredEventsList.innerHTML = `
        <div class="dashboard-empty">You have not registered for any events yet.</div>
      `;
    } else {
      registeredEventsList.innerHTML = events
        .map((eventItem) => {
          return `
            <article class="dashboard-event-card">
              <h4>${eventItem.name}</h4>
              <p>${eventItem.description || "You’re registered for this event."}</p>
              <div class="dashboard-event-meta">${eventItem.date}</div>
              <button
                type="button"
                class="btn outline full cancel-registration-btn"
                data-event-name="${eventItem.name}"
                data-event-date="${eventItem.date}"
              >
                Remove Registration
              </button>
            </article>
          `;
        })
        .join("");
    }
  }
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    clearSavedUserAccount();
    renderDashboard();
  });
}

document.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".cancel-registration-btn");
  if (!removeBtn) return;

  const eventName = removeBtn.getAttribute("data-event-name");
  const eventDate = removeBtn.getAttribute("data-event-date");

  const updatedEvents = getRegisteredEvents().filter((item) => {
    return !(item.name === eventName && item.date === eventDate);
  });

  saveRegisteredEvents(updatedEvents);
  renderDashboard();
});

/* -------------------- REGISTER AUTO-FILL -------------------- */
function autofillRegisterForm() {
  const savedUser = getSavedUserAccount();
  if (!savedUser || !registerForm) return;

  const fullName = registerForm.querySelector("#registerFullName");
  const email = registerForm.querySelector("#registerEmail");
  const phone = registerForm.querySelector("#registerPhone");

  if (fullName && !fullName.value.trim()) {
    fullName.value = `${savedUser.firstName || ""} ${savedUser.lastName || ""}`.trim();
  }

  if (email && !email.value.trim()) {
    email.value = savedUser.email || "";
  }

  if (phone && !phone.value.trim()) {
    phone.value = savedUser.phone || "";
  }
}

/* -------------------- SIGN UP -------------------- */
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(signupForm);

    const firstName = signupForm.querySelector("#signupFirstName");
    const lastName = signupForm.querySelector("#signupLastName");
    const email = signupForm.querySelector("#signupEmail");
    const password = signupForm.querySelector("#signupPassword");

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
      password: password.value,
      phone: ""
    });

    showFormSuccess(
      signupForm,
      "Account created!",
      "Your Work Life Hub account has been created successfully."
    );

    renderDashboard();
  });
}

/* -------------------- SIGN IN -------------------- */
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(signinForm);

    const email = signinForm.querySelector("#signinEmail");
    const password = signinForm.querySelector("#signinPassword");
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

    renderDashboard();
  });
}

/* -------------------- REGISTER EVENT -------------------- */
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors(registerForm);

    const name = registerForm.querySelector("#registerFullName");
    const email = registerForm.querySelector("#registerEmail");
    const phone = registerForm.querySelector("#registerPhone");
    const company = registerForm.querySelector("#registerCompany");
    const savedUser = getSavedUserAccount();

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

    if (!savedUser) {
      closeAllModals();
      openModal("signinModal");
      return;
    }

    const updatedUser = {
      ...savedUser,
      email: email.value.trim().toLowerCase(),
      phone: phone.value.trim()
    };
    saveUserAccount(updatedUser);

    const eventName = modalEventName?.textContent || "Event";
    const eventDate = modalEventDate?.textContent || "Date TBC";

    const allEvents = getRegisteredEvents();
    const alreadyRegistered = allEvents.some(
      (item) => item.name === eventName && item.date === eventDate
    );

    if (!alreadyRegistered) {
      allEvents.push({
        name: eventName,
        date: eventDate,
        description: company.value.trim()
          ? `Registered as ${company.value.trim()}.`
          : "Registration confirmed for this event."
      });
      saveRegisteredEvents(allEvents);
    }

    showFormSuccess(
      registerForm,
      "Registration confirmed!",
      `You are successfully registered for ${eventName}.`
    );

    renderDashboard();
  });
}

/* -------------------- INIT -------------------- */
attachClearErrorListeners();
renderDashboard();
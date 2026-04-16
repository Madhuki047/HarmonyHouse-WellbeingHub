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

const openSearchBtn = document.getElementById("openSearchBtn");
const openSearchBtnMobile = document.getElementById("openSearchBtnMobile");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const searchPanel = document.getElementById("searchPanel");
const siteSearchForm = document.getElementById("siteSearchForm");
const siteSearchInput = document.getElementById("siteSearchInput");
const searchResults = document.getElementById("searchResults");

/* Optional future account/dashboard selectors */
const guestView = document.getElementById("guestView");
const dashboardView = document.getElementById("dashboardView");
const dashboardWelcome = document.getElementById("dashboardWelcome");
const statRegistered = document.getElementById("statRegistered");
const statUpcoming = document.getElementById("statUpcoming");
const registeredEventsList = document.getElementById("registeredEventsList");
const signOutBtn = document.getElementById("signOutBtn");

const STORAGE_KEYS = {
  user: "kidsHubUser",
  events: "kidsHubRegisteredEvents",
  legacy: "kidsHubAccount"
};

const formTemplates = new Map();

[bookingForm, signupForm, signinForm].forEach((form) => {
  if (form) {
    formTemplates.set(form.id, form.innerHTML);
  }
});

/* ---------------------------------- */
/* HERO ANIMATION */
/* ---------------------------------- */
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

/* ---------------------------------- */
/* MOBILE MENU */
/* ---------------------------------- */
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

/* ---------------------------------- */
/* STORAGE */
/* ---------------------------------- */
function saveAccount(account) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(account));
  localStorage.setItem(STORAGE_KEYS.legacy, JSON.stringify(account));
}

function getSavedAccount() {
  const raw = localStorage.getItem(STORAGE_KEYS.user) || localStorage.getItem(STORAGE_KEYS.legacy);
  return raw ? JSON.parse(raw) : null;
}

function clearSavedAccount() {
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.legacy);
}

function getRegisteredEvents() {
  const raw = localStorage.getItem(STORAGE_KEYS.events);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

/* ---------------------------------- */
/* SEARCH */
/* ---------------------------------- */
function openSearchPanel() {
  if (!searchPanel) return;
  searchPanel.classList.add("active");
  searchPanel.setAttribute("aria-hidden", "false");
  if (siteSearchInput) siteSearchInput.focus();
}

function closeSearchPanel() {
  if (!searchPanel) return;
  searchPanel.classList.remove("active");
  searchPanel.setAttribute("aria-hidden", "true");
}

function clearSearchResults() {
  if (!searchResults) return;
  searchResults.innerHTML = "";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function runSiteSearch(query) {
  if (!searchResults) return;

  const trimmedQuery = query.trim().toLowerCase();

  if (!trimmedQuery) {
    searchResults.innerHTML = `
      <p class="search-empty">Please type something to search for.</p>
      <p class="search-footer-link">
        If you can’t find what you’re looking for here, check the <a href="index.html">main site</a>.
      </p>
    `;
    return;
  }

  const items = [...document.querySelectorAll("[data-search-item]")];
  const matches = items.filter((item) => {
    const title = (item.dataset.searchTitle || "").toLowerCase();
    const searchText = (item.dataset.searchText || "").toLowerCase();
    const visibleText = (item.textContent || "").toLowerCase();
    const haystack = `${title} ${searchText} ${visibleText}`;
    return haystack.includes(trimmedQuery);
  });

  const uniqueMatches = [];
  const seenIds = new Set();

  matches.forEach((item) => {
    const section = item.closest("section") || item;
    const id = section.id || item.id || Math.random().toString(36);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniqueMatches.push(item);
    }
  });

  if (uniqueMatches.length === 0) {
    searchResults.innerHTML = `
      <div class="search-no-results">
        <h3>No results found for “${escapeHtml(query)}”.</h3>
        <p>Try a different keyword like <strong>art</strong>, <strong>science</strong>, <strong>events</strong>, or <strong>account</strong>.</p>
        <p class="search-footer-link">
          If you can’t find what you’re looking for here, check the <a href="index.html">main site</a>.
        </p>
      </div>
    `;
    return;
  }

  const resultMarkup = uniqueMatches.slice(0, 8).map((item) => {
    const section = item.closest("section") || item;
    const targetId = section.id ? `#${section.id}` : "#hero";
    const title =
      item.dataset.searchTitle ||
      section.querySelector("h2, h3")?.textContent?.trim() ||
      "Result";
    const snippetSource = item.dataset.searchText || item.textContent || "";
    const snippet = snippetSource.trim().replace(/\s+/g, " ").slice(0, 130);

    return `
      <a href="${targetId}" class="search-result-card">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(snippet)}...</p>
      </a>
    `;
  }).join("");

  searchResults.innerHTML = `
    <div class="search-results-head">
      <h3>${uniqueMatches.length} result${uniqueMatches.length === 1 ? "" : "s"} found for “${escapeHtml(query)}”</h3>
    </div>
    <div class="search-results-list">
      ${resultMarkup}
    </div>
    <p class="search-footer-link">
      If you can’t find what you’re looking for here, check the <a href="index.html">main site</a>.
    </p>
  `;

  searchResults.querySelectorAll(".search-result-card").forEach((card) => {
    card.addEventListener("click", () => {
      closeSearchPanel();
      if (siteSearchInput) siteSearchInput.value = "";
      if (mobileNav) {
        mobileNav.classList.remove("active");
        menuBtn?.setAttribute("aria-expanded", "false");
      }
    });
  });
}

openSearchBtn?.addEventListener("click", openSearchPanel);
openSearchBtnMobile?.addEventListener("click", openSearchPanel);
closeSearchBtn?.addEventListener("click", closeSearchPanel);

siteSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  runSiteSearch(siteSearchInput?.value || "");
});

siteSearchInput?.addEventListener("input", () => {
  if (!siteSearchInput.value.trim()) {
    clearSearchResults();
    closeSearchPanel();
  }
});

document.addEventListener("click", (event) => {
  if (!searchPanel || !searchPanel.classList.contains("active")) return;

  const clickedInsideSearch =
    searchPanel.contains(event.target) ||
    openSearchBtn?.contains(event.target) ||
    openSearchBtnMobile?.contains(event.target);

  if (!clickedInsideSearch) {
    closeSearchPanel();
  }
});

/* ---------------------------------- */
/* MODALS */
/* ---------------------------------- */
function restoreFormState(form) {
  if (!form) return;
  const originalMarkup = formTemplates.get(form.id);
  if (!originalMarkup) return;

  if (form.dataset.successState === "true") {
    form.innerHTML = originalMarkup;
    form.classList.remove("form-fade-in", "form-fade-out");
    delete form.dataset.successState;
  }
}

function attachClearErrorListeners() {
  document.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearError(field);
    });
  });
}

function restoreAllForms() {
  restoreFormState(bookingForm);
  restoreFormState(signupForm);
  restoreFormState(signinForm);
  attachClearErrorListeners();
}

function autofillBookingForm() {
  const savedAccount = getSavedAccount();
  if (!savedAccount || !bookingForm) return;

  const guardianInput = bookingForm.querySelector("#guardianName");
  const emailInput = bookingForm.querySelector("#parentEmail");
  const phoneInput = bookingForm.querySelector("#parentPhone");

  if (guardianInput && !guardianInput.value.trim()) {
    guardianInput.value = `${savedAccount.parentFirstName || ""} ${savedAccount.parentLastName || ""}`.trim();
  }

  if (emailInput && !emailInput.value.trim()) {
    emailInput.value = savedAccount.email || "";
  }

  if (phoneInput && !phoneInput.value.trim()) {
    phoneInput.value = savedAccount.parentPhone || "";
  }
}

function openModal(modal) {
  if (!modal) return;

  restoreAllForms();
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (modal === bookingModal) {
    autofillBookingForm();
  }
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

    if (bookingEventLabel) bookingEventLabel.textContent = eventName;
    if (bookingEventDate) bookingEventDate.textContent = eventDate;

    openModal(bookingModal);
  });
});

signinButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(signinModal);
  });
});

signupButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(signupModal);
  });
});

signupSwitchButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal(signinModal);
    openModal(signupModal);
  });
});

signinSwitchButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
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
    closeSearchPanel();
  }
});

/* ---------------------------------- */
/* FORM VALIDATION HELPERS */
/* ---------------------------------- */
function showError(input, message) {
  if (!input) return;
  input.classList.add("input-error");
  const fieldGroup = input.closest(".field-group");
  const error = fieldGroup ? fieldGroup.querySelector(".error-message") : null;
  if (error) error.textContent = message;
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("input-error");
  const fieldGroup = input.closest(".field-group");
  const error = fieldGroup ? fieldGroup.querySelector(".error-message") : null;
  if (error) error.textContent = "";
}

function validateRequired(input, label) {
  const value = input?.value?.trim() || "";
  if (!value) {
    showError(input, `${label} is required.`);
    return false;
  }
  clearError(input);
  return true;
}

function validateName(input, label, required = true) {
  const value = input?.value?.trim() || "";
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
  const value = input?.value?.trim() || "";
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
  const value = input?.value?.trim() || "";
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
  const value = input?.value || "";

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

/* ---------------------------------- */
/* SUCCESS UI */
/* ---------------------------------- */
function showFormSuccess(form, title, message) {
  if (!form) return;

  form.classList.add("form-fade-out");

  setTimeout(() => {
    form.innerHTML = `
      <div class="form-success-message">
        <div class="form-success-icon">✓</div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
    form.dataset.successState = "true";
    form.classList.remove("form-fade-out");
    form.classList.add("form-fade-in");
  }, 300);
}

/* ---------------------------------- */
/* DASHBOARD / ACCOUNT SECTION */
/* ---------------------------------- */
function renderDashboard() {
  const savedAccount = getSavedAccount();
  const events = getRegisteredEvents();

  if (!guestView || !dashboardView) return;

  if (!savedAccount) {
    guestView.hidden = false;
    dashboardView.hidden = true;
    return;
  }

  guestView.hidden = true;
  dashboardView.hidden = false;

  const welcomeName = savedAccount.parentFirstName || savedAccount.childFirstName || "Friend";
  if (dashboardWelcome) {
    dashboardWelcome.textContent = `Welcome, ${welcomeName}!`;
  }

  if (statRegistered) statRegistered.textContent = String(events.length);
  if (statUpcoming) statUpcoming.textContent = String(events.length);

  if (registeredEventsList) {
    if (events.length === 0) {
      registeredEventsList.innerHTML = `
        <div class="dashboard-empty">You have not registered for any events yet.</div>
      `;
    } else {
      registeredEventsList.innerHTML = events.map((eventItem) => {
        return `
          <article class="dashboard-event-card">
            <h4>${escapeHtml(eventItem.name)}</h4>
            <p>${escapeHtml(eventItem.description || "You’re registered for this event.")}</p>
            <div class="dashboard-event-meta">${escapeHtml(eventItem.date)}</div>
            <button
              type="button"
              class="event-btn outline-btn cancel-registration-btn"
              data-event-name="${escapeHtml(eventItem.name)}"
              data-event-date="${escapeHtml(eventItem.date)}"
            >
              Remove Registration
            </button>
          </article>
        `;
      }).join("");
    }
  }
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    clearSavedAccount();
    renderDashboard();
  });
}

/* ---------------------------------- */
/* BOOKING FORM */
/* ---------------------------------- */
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const childFullName = bookingForm.querySelector("#childFullName");
    const guardianName = bookingForm.querySelector("#guardianName");
    const parentEmail = bookingForm.querySelector("#parentEmail");
    const parentPhone = bookingForm.querySelector("#parentPhone");
    const savedAccount = getSavedAccount();

    const checks = [
      validateName(childFullName, "Child's full name"),
      validateName(guardianName, "Parent/Guardian name"),
      validateEmail(parentEmail),
      validatePhone(parentPhone)
    ];

    const isValid = checks.every(Boolean);
    if (!isValid) return;

    if (!savedAccount) {
      closeModal(bookingModal);
      openModal(signinModal);
      return;
    }

    const updatedAccount = {
      ...savedAccount,
      email: parentEmail.value.trim().toLowerCase(),
      parentPhone: parentPhone.value.trim()
    };
    saveAccount(updatedAccount);

    const selectedEventName = bookingEventLabel?.textContent?.trim() || "Selected Event";
    const selectedEventDate = bookingEventDate?.textContent?.trim() || "Choose from available event dates";

    const allEvents = getRegisteredEvents();
    const alreadyRegistered = allEvents.some(
      (item) => item.name === selectedEventName && item.date === selectedEventDate
    );

    if (!alreadyRegistered) {
      allEvents.push({
        name: selectedEventName,
        date: selectedEventDate,
        description: `Booked for ${childFullName.value.trim()}.`
      });
      saveRegisteredEvents(allEvents);
    }

    showFormSuccess(
      bookingForm,
      "Registration confirmed!",
      `You are successfully registered for ${selectedEventName}.`
    );

    renderDashboard();
  });
}

/* ---------------------------------- */
/* SIGNUP FORM */
/* ---------------------------------- */
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const childFirstName = signupForm.querySelector("#childFirstName");
    const childLastName = signupForm.querySelector("#childLastName");
    const parentFirstName = signupForm.querySelector("#parentFirstName");
    const parentLastName = signupForm.querySelector("#parentLastName");
    const signupEmail = signupForm.querySelector("#signupEmail");
    const signupPassword = signupForm.querySelector("#signupPassword");

    const checks = [
      validateName(childFirstName, "Child's first name"),
      validateName(childLastName, "Child's last name", false),
      validateName(parentFirstName, "Parent/Guardian first name"),
      validateName(parentLastName, "Parent/Guardian last name"),
      validateEmail(signupEmail),
      validatePassword(signupPassword)
    ];

    const isValid = checks.every(Boolean);
    if (!isValid) return;

    saveAccount({
      childFirstName: childFirstName.value.trim(),
      childLastName: childLastName.value.trim(),
      parentFirstName: parentFirstName.value.trim(),
      parentLastName: parentLastName.value.trim(),
      email: signupEmail.value.trim().toLowerCase(),
      password: signupPassword.value,
      parentPhone: ""
    });

    showFormSuccess(
      signupForm,
      "Account created!",
      "Your Kids Hub account has been created successfully."
    );

    renderDashboard();
  });
}

/* ---------------------------------- */
/* SIGNIN FORM */
/* ---------------------------------- */
if (signinForm) {
  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const signinEmail = signinForm.querySelector("#signinEmail");
    const signinPassword = signinForm.querySelector("#signinPassword");
    const savedAccount = getSavedAccount();

    const checks = [
      validateEmail(signinEmail),
      validateRequired(signinPassword, "Password")
    ];

    const isValid = checks.every(Boolean);
    if (!isValid) return;

    if (!savedAccount) {
      showError(signinEmail, "No account found yet. Please create an account first.");
      return;
    }

    if (
      signinEmail.value.trim().toLowerCase() !== savedAccount.email ||
      signinPassword.value !== savedAccount.password
    ) {
      showError(signinPassword, "Incorrect email or password.");
      return;
    }

    showFormSuccess(
      signinForm,
      "Signed in successfully!",
      `Welcome back, ${savedAccount.parentFirstName}!`
    );

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

/* ---------------------------------- */
/* INIT */
/* ---------------------------------- */
attachClearErrorListeners();
renderDashboard();
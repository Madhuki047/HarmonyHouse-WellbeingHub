const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const modals = document.querySelectorAll(".modal");
const toastMessage = document.getElementById("toastMessage");

const siteSearchForm = document.getElementById("siteSearchForm");
const siteSearchInput = document.getElementById("siteSearchInput");
const mobileSearchForm = document.getElementById("mobileSearchForm");
const mobileSearchInput = document.getElementById("mobileSearchInput");
const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");

const guestView = document.getElementById("guestView");
const dashboardView = document.getElementById("dashboardView");
const dashboardWelcome = document.getElementById("dashboardWelcome");
const statRegistered = document.getElementById("statRegistered");
const statUpcoming = document.getElementById("statUpcoming");
const registeredEventsList = document.getElementById("registeredEventsList");
const signOutBtn = document.getElementById("signOutBtn");

const STORAGE_KEYS = {
  teenUser: "teensHubUser",
  teenEvents: "teensHubRegisteredEvents"
};

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.teenUser, JSON.stringify(user));
}

function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.teenUser);
  return raw ? JSON.parse(raw) : null;
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.teenUser);
}

function getRegisteredEvents() {
  const raw = localStorage.getItem(STORAGE_KEYS.teenEvents);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.teenEvents, JSON.stringify(events));
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    clearUser();
    renderDashboard();
    showToast("Signed out successfully.");
  });
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
    mobileNav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function openModal(id) {
  modals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function resetSuccessStates() {
  document.querySelectorAll(".modal-card").forEach((card) => {
    card.classList.remove("success-state");

    const successBox = card.querySelector(".success-message-box");
    if (successBox) {
      successBox.remove();
    }
  });

  document.querySelectorAll(".modal-form").forEach((form) => {
    clearFormErrors(form);
  });
}

function closeModals() {
  modals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  document.body.style.overflow = "";
  resetSuccessStates();
}

function renderDashboard() {
  const user = getUser();
  const events = getRegisteredEvents();

  if (!guestView || !dashboardView) return;

  if (!user) {
    guestView.hidden = false;
    dashboardView.hidden = true;
    return;
  }

  guestView.hidden = true;
  dashboardView.hidden = false;

  const firstName = user.firstName || user.fullName || "Friend";
  if (dashboardWelcome) {
    dashboardWelcome.textContent = `Welcome, ${firstName}!`;
  }

  if (statRegistered) statRegistered.textContent = events.length;
  if (statUpcoming) statUpcoming.textContent = events.length;

  if (registeredEventsList) {
    if (events.length === 0) {
      registeredEventsList.innerHTML = `
        <div class="dashboard-empty">You have not registered for any events yet.</div>
      `;
    } else {
      registeredEventsList.innerHTML = events
        .map((event) => {
          return `
            <article class="dashboard-event-card">
              <h4>${event.name}</h4>
              <p>${event.description || "You’re registered for this event."}</p>
              <div class="dashboard-event-meta">${event.date}</div>
          
              <button 
                class="btn btn-secondary cancel-event-btn"
                data-event-name="${event.name}"
                data-event-date="${event.date}"
              >
                Cancel Registration ❌
              </button>
            </article>
          `;
        })
        .join("");
    }
  }
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".cancel-event-btn");
  if (!btn) return;

  const eventName = btn.getAttribute("data-event-name");
  const eventDate = btn.getAttribute("data-event-date");

  let events = getRegisteredEvents();

  events = events.filter(
    (event) => !(event.name === eventName && event.date === eventDate)
  );

  saveRegisteredEvents(events);

  showToast("Registration cancelled.");

  renderDashboard();
});

function autofillRegisterForm() {
  const user = getUser();
  if (!user || !registerForm) return;

  if (registerForm.fullName && !registerForm.fullName.value.trim()) {
    registerForm.fullName.value = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }

  if (registerForm.email && !registerForm.email.value.trim()) {
    registerForm.email.value = user.email || "";
  }

  if (registerForm.phone && !registerForm.phone.value.trim()) {
    registerForm.phone.value = user.phone || "";
  }

  if (registerForm.emergencyContact && !registerForm.emergencyContact.value.trim()) {
    registerForm.emergencyContact.value = user.emergencyContact || "";
  }
}

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const modalId = button.getAttribute("data-open");

    if (modalId === "registerModal") {
      const eventName = button.getAttribute("data-event") || "Event";
      const eventDate = button.getAttribute("data-date") || "Date TBC";
      const eventNameEl = document.getElementById("modalEventName");
      const eventDateEl = document.getElementById("modalEventDate");

      if (eventNameEl) eventNameEl.textContent = eventName;
      if (eventDateEl) eventDateEl.textContent = eventDate;

      if (registerForm) {
        clearFormErrors(registerForm);
        autofillRegisterForm();
      }
    }

    openModal(modalId);
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll("[data-switch]").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetModal = button.getAttribute("data-switch");
    openModal(targetModal);
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModals();
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

function showToast(message) {
  if (!toastMessage) return;

  toastMessage.textContent = message;
  toastMessage.classList.add("show");

  setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2200);
}

function setFieldError(input, message) {
  input.classList.add("input-error");
  const errorEl = document.querySelector(`.form-error[data-error-for="${input.name}"]`);
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove("input-error");
  const errorEl = document.querySelector(`.form-error[data-error-for="${input.name}"]`);
  if (errorEl) errorEl.textContent = "";
}

function clearFormErrors(form) {
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.classList.remove("input-error");
  });

  form.querySelectorAll(".form-error").forEach((error) => {
    error.textContent = "";
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  const cleaned = value.replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

function validateRegisterForm(form) {
  let isValid = true;

  const fullName = form.fullName;
  const email = form.email;
  const phone = form.phone;
  const emergencyContact = form.emergencyContact;

  clearFormErrors(form);

  if (!fullName.value.trim()) {
    setFieldError(fullName, "Please enter your full name.");
    isValid = false;
  } else if (fullName.value.trim().length < 3) {
    setFieldError(fullName, "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (!email.value.trim()) {
    setFieldError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!phone.value.trim()) {
    setFieldError(phone, "Please enter your phone number.");
    isValid = false;
  } else if (!isValidPhone(phone.value)) {
    setFieldError(phone, "Please enter a valid phone number.");
    isValid = false;
  }

  if (!emergencyContact.value.trim()) {
    setFieldError(emergencyContact, "Please enter an emergency contact.");
    isValid = false;
  } else if (emergencyContact.value.trim().length < 5) {
    setFieldError(emergencyContact, "Emergency contact looks too short.");
    isValid = false;
  }

  return isValid;
}

function validateSignupForm(form) {
  let isValid = true;

  const firstName = form.firstName;
  const lastName = form.lastName;
  const email = form.email;
  const password = form.password;

  clearFormErrors(form);

  if (!firstName.value.trim()) {
    setFieldError(firstName, "Please enter your first name.");
    isValid = false;
  } else if (firstName.value.trim().length < 2) {
    setFieldError(firstName, "First name must be at least 2 characters.");
    isValid = false;
  }

  if (!lastName.value.trim()) {
    setFieldError(lastName, "Please enter your last name.");
    isValid = false;
  } else if (lastName.value.trim().length < 2) {
    setFieldError(lastName, "Last name must be at least 2 characters.");
    isValid = false;
  }

  if (!email.value.trim()) {
    setFieldError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!password.value.trim()) {
    setFieldError(password, "Please enter a password.");
    isValid = false;
  } else if (password.value.length < 8) {
    setFieldError(password, "Password must be at least 8 characters.");
    isValid = false;
  }

  return isValid;
}

function validateSigninForm(form) {
  let isValid = true;

  const email = form.email;
  const password = form.password;

  clearFormErrors(form);

  if (!email.value.trim()) {
    setFieldError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!password.value.trim()) {
    setFieldError(password, "Please enter your password.");
    isValid = false;
  } else if (password.value.length < 6) {
    setFieldError(password, "Password must be at least 6 characters.");
    isValid = false;
  }

  return isValid;
}

function showSuccessInsideModal(form, message) {
  const modalCard = form.closest(".modal-card");
  if (!modalCard) return;

  modalCard.classList.add("success-state");

  const successBox = document.createElement("div");
  successBox.className = "success-message-box";
  successBox.textContent = message;

  form.insertAdjacentElement("afterend", successBox);
}

const registerForm = document.getElementById("registerForm");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateRegisterForm(registerForm)) return;

    const currentUser = getUser();
    if (!currentUser) {
      showToast("Please sign in or create an account first.");
      closeModals();
      openModal("signinModal");
      return;
    }

    const eventName = document.getElementById("modalEventName")?.textContent || "Event";
    const eventDate = document.getElementById("modalEventDate")?.textContent || "Date TBC";

    const allEvents = getRegisteredEvents();

    const alreadyRegistered = allEvents.some(
      (event) => event.name === eventName && event.date === eventDate
    );

    if (alreadyRegistered) {
      showToast("You are already registered for this event.");
      return;
    }

    currentUser.fullName = registerForm.fullName.value.trim();
    currentUser.email = registerForm.email.value.trim();
    currentUser.phone = registerForm.phone.value.trim();
    currentUser.emergencyContact = registerForm.emergencyContact.value.trim();
    saveUser(currentUser);

    const newEvent = {
      name: eventName,
      date: eventDate,
      description:
        registerForm.interests.value.trim() || "Registration confirmed for this event."
    };

    allEvents.push(newEvent);
    saveRegisteredEvents(allEvents);

    showToast("Registration submitted successfully.");

    setTimeout(() => {
      const modalCard = registerForm.closest(".modal-card");
      if (!modalCard) return;

      modalCard.classList.add("success-state");

      let successBox = modalCard.querySelector(".success-message-box");
      if (!successBox) {
        successBox = document.createElement("div");
        successBox.className = "success-message-box";
        registerForm.insertAdjacentElement("afterend", successBox);
      }

      successBox.innerHTML = `
        <strong style="display:block; font-size:1.2rem; margin-bottom:10px;">🎉 Registration Confirmed!</strong>
        <p style="margin:0 0 10px;">You are successfully registered for <strong>${eventName}</strong>.</p>
        <p style="margin:0 0 14px; color:#9ee9ff;">${eventDate}</p>
        <p style="margin:0;">Your spot has been saved in your account dashboard.</p>
      `;

      registerForm.reset();
      renderDashboard();
    }, 700);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateSignupForm(signupForm)) return;

    const user = {
      firstName: signupForm.firstName.value.trim(),
      lastName: signupForm.lastName.value.trim(),
      fullName: `${signupForm.firstName.value.trim()} ${signupForm.lastName.value.trim()}`.trim(),
      email: signupForm.email.value.trim(),
      phone: "",
      emergencyContact: ""
    };

    saveUser(user);

    showToast("Account created successfully.");
    setTimeout(() => {
      closeModals();
      signupForm.reset();
      renderDashboard();
    }, 700);
  });
}

if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateSigninForm(signinForm)) return;

    const emailValue = signinForm.email.value.trim();
    const savedUser = getUser();

    let userToUse;

    if (savedUser && savedUser.email === emailValue) {
      userToUse = savedUser;
    } else {
      userToUse = {
        firstName: emailValue.split("@")[0],
        lastName: "",
        fullName: emailValue.split("@")[0],
        email: emailValue,
        phone: "",
        emergencyContact: ""
      };
      saveUser(userToUse);
    }

    showToast("Signed in successfully.");
    setTimeout(() => {
      closeModals();
      signinForm.reset();
      renderDashboard();
    }, 700);
  });
}

document.querySelectorAll(".modal-form input, .modal-form textarea").forEach((field) => {
  field.addEventListener("input", () => {
    clearFieldError(field);
  });
});

function performSearch(query) {
  if (!searchResults || !searchResultsList) return;

  const trimmedQuery = query.trim().toLowerCase();
  searchResultsList.innerHTML = "";

  if (!trimmedQuery) {
    searchResults.hidden = true;
    return;
  }

  const searchableItems = document.querySelectorAll(".searchable-section, .searchable-item");
  const matches = [];

  searchableItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (!text.includes(trimmedQuery)) return;

    let title = "";
    let link = "#";

    if (item.classList.contains("searchable-section")) {
      const heading = item.querySelector("h2, h3");
      title = heading ? heading.textContent.trim() : "Section";
      link = `#${item.id}`;
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
    searchResultsList.innerHTML = `<li>No results found for "<strong>${query}</strong>".</li>`;
  } else {
    uniqueMatches.forEach((match) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${match.link}">${match.title}</a>`;
      searchResultsList.appendChild(li);
    });
  }

  searchResults.hidden = false;
}

if (siteSearchForm) {
  siteSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(siteSearchInput ? siteSearchInput.value : "");
  });
}

if (mobileSearchForm) {
  mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(mobileSearchInput ? mobileSearchInput.value : "");
    mobileNav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  });
}

if (siteSearchInput) {
  siteSearchInput.addEventListener("input", () => {
    if (!siteSearchInput.value.trim()) {
      if (searchResults) searchResults.hidden = true;
    }
  });
}

if (mobileSearchInput) {
  mobileSearchInput.addEventListener("input", () => {
    if (!mobileSearchInput.value.trim()) {
      if (searchResults) searchResults.hidden = true;
    }
  });
}

document.addEventListener("click", (e) => {
  if (!searchResults || !siteSearchForm) return;

  const isInsideSearch =
    siteSearchForm.contains(e.target) ||
    searchResults.contains(e.target);

  if (!isInsideSearch) {
    searchResults.hidden = true;
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

    if (searchResults) searchResults.hidden = true;
    if (siteSearchInput) siteSearchInput.value = "";
    if (mobileSearchInput) mobileSearchInput.value = "";
  });
}

renderDashboard();
window.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  function setHeaderState() {
    if (siteHeader) {
      if (window.scrollY > 12) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    }
  }

  function openMenu() {
    if (mobileMenu && menuOverlay && menuToggle) {
      mobileMenu.classList.add("open");
      menuOverlay.classList.add("show");
      menuToggle.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      mobileMenu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (mobileMenu && menuOverlay && menuToggle) {
      mobileMenu.classList.remove("open");
      menuOverlay.classList.remove("show");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuOverlay.addEventListener("click", closeMenu);
    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));
  }

  window.addEventListener("scroll", setHeaderState);
  setHeaderState();

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const statNumbers = document.querySelectorAll(".stat-number");
  let statsStarted = false;

  function animateValue(el, endValue, suffix = "") {
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * endValue);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsGrid = document.getElementById("statsGrid");
  if (statsGrid && statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsStarted) {
            statsStarted = true;
            statNumbers.forEach((stat) => {
              animateValue(stat, Number(stat.dataset.target), stat.dataset.suffix || "");
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    statsObserver.observe(statsGrid);
  }

  const satisfactionCounter = document.getElementById("satisfactionCounter");
  let satisfactionStarted = false;

  if (satisfactionCounter) {
    const satisfactionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !satisfactionStarted) {
            satisfactionStarted = true;
            const end = 98;
            const duration = 1200;
            const startTime = performance.now();

            function update(currentTime) {
              const progress = Math.min((currentTime - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              satisfactionCounter.textContent = Math.floor(eased * end) + "%";

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }

            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.45 }
    );

    satisfactionObserver.observe(satisfactionCounter);
  }

  const typingText = document.getElementById("typingText");

  if (typingText) {
    const phrases = [
      "Connecting people with care.",
      "Making wellbeing support easier to access.",
      "Helping communities thrive together.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (!deleting) {
        typingText.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        typingText.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const speed = deleting ? 42 : 65;
      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  // SERVICES PAGE ACCORDION
  const accordionItems = document.querySelectorAll(".accordion-item");

  if (accordionItems.length) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");

      if (header) {
        header.addEventListener("click", () => {
          const isActive = item.classList.contains("active");

          accordionItems.forEach((other) => {
            other.classList.remove("active");
          });

          if (!isActive) {
            item.classList.add("active");
          }
        });
      }
    });

    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get("service");

    if (serviceParam) {
      const targetAccordion = document.querySelector(
        `.accordion-item[data-service="${serviceParam}"]`
      );

      if (targetAccordion) {
        targetAccordion.classList.add("active");
        targetAccordion.classList.add("highlighted");

        setTimeout(() => {
          targetAccordion.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 250);

        setTimeout(() => {
          targetAccordion.classList.remove("highlighted");
        }, 1600);
      }
    }
  }


  // EVENTS PAGE
  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonthLabel = document.getElementById("calendarMonthLabel");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");
  const clearDayFilterBtn = document.getElementById("clearDayFilterBtn");
  const eventsGrid = document.getElementById("eventsGrid");
  const eventsCountText = document.getElementById("eventsCountText");
  const eventsEmptyState = document.getElementById("eventsEmptyState");
  const filterChips = document.querySelectorAll(".filter-chip");

  if (
    calendarGrid &&
    calendarMonthLabel &&
    prevMonthBtn &&
    nextMonthBtn &&
    clearDayFilterBtn &&
    eventsGrid &&
    eventsCountText &&
    eventsEmptyState
  ) {
    const eventsData = [
      {
        id: "morning-yoga-apr-6",
        title: "Morning Yoga for Beginners",
        category: "fitness",
        date: "2026-04-06",
        time: "7:00 AM - 8:00 AM",
        dayLabel: "Mon, Apr 6",
        location: "Studio A",
        spots: 20,
        left: 8,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
        description: "Start your week with gentle yoga suitable for all levels.",
      },
      {
        id: "mindfulness-meditation-apr-6",
        title: "Mindfulness Meditation",
        category: "mental-health",
        date: "2026-04-06",
        time: "6:00 PM - 7:00 PM",
        dayLabel: "Mon, Apr 6",
        location: "Quiet Room",
        spots: 15,
        left: 5,
        image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&fit=crop&w=900&q=80",
        description: "Learn meditation techniques for stress relief and mental clarity.",
      },
      {
        id: "parenting-workshop-apr-7",
        title: "Parenting Workshop: Teen Communication",
        category: "family",
        date: "2026-04-07",
        time: "6:30 PM - 8:00 PM",
        dayLabel: "Tue, Apr 7",
        location: "Conference Room B",
        spots: 25,
        left: 25,
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
        description: "Strategies for effective communication with teenagers.",
      },
      {
        id: "senior-book-club-apr-7",
        title: "Senior Book Club",
        category: "seniors",
        date: "2026-04-07",
        time: "10:00 AM - 11:30 AM",
        dayLabel: "Tue, Apr 7",
        location: "Library Corner",
        spots: 15,
        left: 3,
        image: "https://images.unsplash.com/photo-1516589091380-5d60138fdf6d?auto=format&fit=crop&w=900&q=80",
        description: "Discussion of this month’s featured book with light refreshments.",
      },
      {
        id: "zumba-dance-party-apr-8",
        title: "Zumba Dance Party",
        category: "fitness",
        date: "2026-04-08",
        time: "5:30 PM - 6:30 PM",
        dayLabel: "Wed, Apr 8",
        location: "Studio A",
        spots: 30,
        left: 30,
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
        description: "High-energy dance fitness class for all levels.",
      },
      {
        id: "youth-art-workshop-apr-8",
        title: "Youth Art Workshop",
        category: "youth",
        date: "2026-04-08",
        time: "4:00 PM - 5:30 PM",
        dayLabel: "Wed, Apr 8",
        location: "Art Studio",
        spots: 20,
        left: 7,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
        description: "Creative art projects for ages 8–16.",
      },
      {
        id: "financial-literacy-workshop-apr-9",
        title: "Financial Literacy Workshop",
        category: "workshops",
        date: "2026-04-09",
        time: "6:00 PM - 7:30 PM",
        dayLabel: "Thu, Apr 9",
        location: "Conference Room A",
        spots: 30,
        left: 30,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        description: "Budget planning and financial wellness strategies.",
      },
      {
        id: "group-therapy-apr-9",
        title: "Group Therapy: Managing Anxiety",
        category: "mental-health",
        date: "2026-04-09",
        time: "7:00 PM - 8:30 PM",
        dayLabel: "Thu, Apr 9",
        location: "Counselling Suite",
        spots: 12,
        left: 4,
        image: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=900&q=80",
        description: "Supportive group session led by licensed therapist.",
      },
      {
        id: "community-walking-group-apr-10",
        title: "Community Walking Group",
        category: "fitness",
        date: "2026-04-10",
        time: "8:00 AM - 9:30 AM",
        dayLabel: "Fri, Apr 10",
        location: "Main Entrance",
        spots: 999,
        left: 999,
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
        description: "Morning walk through local parks. All ages welcome!",
      },
      {
        id: "teen-support-circle-apr-10",
        title: "Teen Support Circle",
        category: "youth",
        date: "2026-04-10",
        time: "4:00 PM - 5:30 PM",
        dayLabel: "Fri, Apr 10",
        location: "Youth Center",
        spots: 15,
        left: 6,
        image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80",
        description: "Safe space for teens to share and connect. Ages 13–18.",
      },
      {
        id: "senior-chair-yoga-apr-11",
        title: "Senior Fitness: Chair Yoga",
        category: "seniors",
        date: "2026-04-11",
        time: "10:00 AM - 11:00 AM",
        dayLabel: "Sat, Apr 11",
        location: "Studio B",
        spots: 20,
        left: 9,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
        description: "Gentle yoga designed for seniors with limited mobility.",
      },
      {
        id: "family-game-day-apr-11",
        title: "Family Game Day",
        category: "family",
        date: "2026-04-11",
        time: "2:00 PM - 5:00 PM",
        dayLabel: "Sat, Apr 11",
        location: "Recreation Hall",
        spots: 50,
        left: 50,
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
        description: "Board games, activities, and snacks for the whole family.",
      },
      {
        id: "morning-yoga-apr-13",
        title: "Morning Yoga for Beginners",
        category: "fitness",
        date: "2026-04-13",
        time: "7:00 AM - 8:00 AM",
        dayLabel: "Mon, Apr 13",
        location: "Studio A",
        spots: 20,
        left: 20,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
        description: "Start your week with gentle yoga suitable for all levels.",
      },
      {
        id: "zumba-dance-party-apr-15",
        title: "Zumba Dance Party",
        category: "fitness",
        date: "2026-04-15",
        time: "5:30 PM - 6:30 PM",
        dayLabel: "Wed, Apr 15",
        location: "Studio A",
        spots: 30,
        left: 30,
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
        description: "High-energy dance fitness class for all levels.",
      },
    ];

    const categoryLabelMap = {
      "mental-health": "Mental Health",
      fitness: "Fitness",
      family: "Family",
      youth: "Youth",
      seniors: "Seniors",
      workshops: "Workshops",
    };

    let currentDate = new Date(2026, 3, 1);
    let selectedCategory = "all";
    let selectedDay = null;

    const savedFavourites = JSON.parse(localStorage.getItem("harmonyFavouriteEvents") || "[]");
    const favouriteIds = new Set(savedFavourites);

    function formatMonthYear(date) {
      return date.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    }

    function getDaysWithEvents(year, month) {
      return eventsData
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        })
        .map((event) => new Date(event.date).getDate());
    }

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      calendarMonthLabel.textContent = formatMonthYear(currentDate);
      calendarGrid.innerHTML = "";

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysWithEvents = getDaysWithEvents(year, month);

      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day is-empty";
        calendarGrid.appendChild(emptyCell);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dayBtn = document.createElement("button");
        dayBtn.type = "button";
        dayBtn.className = "calendar-day";
        dayBtn.textContent = day;

        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (daysWithEvents.includes(day)) {
          dayBtn.classList.add("has-events");
        }

        if (selectedDay === fullDate) {
          dayBtn.classList.add("active");
        }

        dayBtn.addEventListener("click", () => {
          if (selectedDay === fullDate) {
            selectedDay = null;
          } else {
            selectedDay = fullDate;
          }

          updateClearDayButton();
          renderCalendar();
          renderEvents();
        });

        calendarGrid.appendChild(dayBtn);
      }
    }

    function updateClearDayButton() {
      if (selectedDay) {
        clearDayFilterBtn.classList.add("show");
      } else {
        clearDayFilterBtn.classList.remove("show");
      }
    }

    function getFilteredEvents() {
      const visibleMonth = currentDate.getMonth();
      const visibleYear = currentDate.getFullYear();

      return eventsData.filter((event) => {
        const eventDate = new Date(event.date);
        const matchesMonth =
          eventDate.getMonth() === visibleMonth && eventDate.getFullYear() === visibleYear;

        const matchesCategory =
          selectedCategory === "all" || event.category === selectedCategory;

        const matchesDay = !selectedDay || event.date === selectedDay;

        return matchesMonth && matchesCategory && matchesDay;
      });
    }

    function getSpotsText(event) {
      if (event.left >= 999) {
        return "Open";
      }
      return `${event.left} left`;
    }

    function getCategoryClass(category) {
      return `category-${category}`;
    }

    function createEventCard(event) {
      const article = document.createElement("article");
      article.className = `event-card ${getCategoryClass(event.category)}`;

      const isFavourited = favouriteIds.has(event.id);

      article.innerHTML = `
        <div class="event-card-image-wrap">
          <span class="event-category-tag tag-${event.category}">${categoryLabelMap[event.category]}</span>
          <button class="event-fav-btn ${isFavourited ? "active" : ""}" type="button" aria-label="Toggle favourite" data-event-id="${event.id}">
            ♥
          </button>
          <img src="${event.image}" alt="${event.title}">
        </div>
        <div class="event-card-body">
          <div class="event-card-topline">
            <h3>${event.title}</h3>
            <span class="event-spots-left">${getSpotsText(event)}</span>
          </div>
          <p>${event.description}</p>
          <ul class="event-meta">
            <li>🗓 ${event.dayLabel}</li>
            <li>⏰ ${event.time}</li>
            <li>📍 ${event.location}</li>
            <li>👥 ${event.spots >= 999 ? "Unlimited" : `${event.spots} spots`}</li>
          </ul>
          <a class="event-register-btn btn-${event.category}" href="booking.html?event=${encodeURIComponent(event.title)}&date=${encodeURIComponent(event.dayLabel)}">Register for Event</a>
        </div>
      `;

      return article;
    }

    function renderEvents() {
      const filteredEvents = getFilteredEvents();
      eventsGrid.innerHTML = "";

      eventsCountText.textContent = `Showing ${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"}`;

      if (!filteredEvents.length) {
        eventsEmptyState.hidden = false;
        return;
      }

      eventsEmptyState.hidden = true;

      filteredEvents.forEach((event) => {
        eventsGrid.appendChild(createEventCard(event));
      });

      attachFavouriteHandlers();
    }

    function attachFavouriteHandlers() {
      const favouriteButtons = document.querySelectorAll(".event-fav-btn");

      favouriteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const eventId = btn.dataset.eventId;

          if (favouriteIds.has(eventId)) {
            favouriteIds.delete(eventId);
            btn.classList.remove("active");
          } else {
            favouriteIds.add(eventId);
            btn.classList.add("active");
          }

          localStorage.setItem("harmonyFavouriteEvents", JSON.stringify([...favouriteIds]));
        });
      });
    }

    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        filterChips.forEach((otherChip) => otherChip.classList.remove("active"));
        chip.classList.add("active");
        selectedCategory = chip.dataset.category;
        renderEvents();
      });
    });

    prevMonthBtn.addEventListener("click", () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      if (selectedDay) {
        const selectedDateObj = new Date(selectedDay);
        const sameMonth =
          selectedDateObj.getMonth() === currentDate.getMonth() &&
          selectedDateObj.getFullYear() === currentDate.getFullYear();

        if (!sameMonth) {
          selectedDay = null;
        }
      }

      updateClearDayButton();
      renderCalendar();
      renderEvents();
    });

    nextMonthBtn.addEventListener("click", () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      if (selectedDay) {
        const selectedDateObj = new Date(selectedDay);
        const sameMonth =
          selectedDateObj.getMonth() === currentDate.getMonth() &&
          selectedDateObj.getFullYear() === currentDate.getFullYear();

        if (!sameMonth) {
          selectedDay = null;
        }
      }

      updateClearDayButton();
      renderCalendar();
      renderEvents();
    });

    clearDayFilterBtn.addEventListener("click", () => {
      selectedDay = null;
      updateClearDayButton();
      renderCalendar();
      renderEvents();
    });

    renderCalendar();
    updateClearDayButton();
    renderEvents();
  }

    // BOOKING PAGE
  const eventRegistrationForm = document.getElementById("eventRegistrationForm");
  const registrationFormWrap = document.getElementById("registrationFormWrap");
  const registrationSuccessWrap = document.getElementById("registrationSuccessWrap");
  const registrationSuccessText = document.getElementById("registrationSuccessText");
  const registrationErrorMessage = document.getElementById("registrationErrorMessage");

  const selectedEventInput = document.getElementById("selectedEvent");
  const selectedDateInput = document.getElementById("selectedDate");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const participantsInput = document.getElementById("participants");
  const ageGroupInput = document.getElementById("ageGroup");
  const emergencyNameInput = document.getElementById("emergencyName");
  const emergencyPhoneInput = document.getElementById("emergencyPhone");
  const dietaryNotesInput = document.getElementById("dietaryNotes");
  const registrationAgreementInput = document.getElementById("registrationAgreement");

  const proposalLockedWrap = document.getElementById("proposalLockedWrap");
  const proposalFormWrap = document.getElementById("proposalFormWrap");
  const proposalSuccessWrap = document.getElementById("proposalSuccessWrap");
  const proposalSuccessText = document.getElementById("proposalSuccessText");
  const eventProposalForm = document.getElementById("eventProposalForm");
  const proposalErrorMessage = document.getElementById("proposalErrorMessage");

  const proposalStepLabel = document.getElementById("proposalStepLabel");
  const proposalStepTitle = document.getElementById("proposalStepTitle");
  const proposalProgressFill = document.getElementById("proposalProgressFill");
  const proposalBackBtn = document.getElementById("proposalBackBtn");
  const proposalNextBtn = document.getElementById("proposalNextBtn");
  const proposalSubmitBtn = document.getElementById("proposalSubmitBtn");
  const proposalSteps = document.querySelectorAll(".proposal-step");

  if (eventRegistrationForm) {
    const bookingParams = new URLSearchParams(window.location.search);
    const eventParam = bookingParams.get("event");
    const dateParam = bookingParams.get("date");

    if (selectedEventInput && eventParam) {
      const decodedEvent = decodeURIComponent(eventParam);

      const matchingOption = [...selectedEventInput.options].find(
        (option) => option.value.toLowerCase() === decodedEvent.toLowerCase()
      );

      if (matchingOption) {
        selectedEventInput.value = matchingOption.value;
      } else {
        const newOption = document.createElement("option");
        newOption.value = decodedEvent;
        newOption.textContent = decodedEvent;
        selectedEventInput.appendChild(newOption);
        selectedEventInput.value = decodedEvent;
      }
    }

    if (selectedDateInput && dateParam) {
      selectedDateInput.value = decodeURIComponent(dateParam);
    }

    const storedUser = JSON.parse(localStorage.getItem("harmonyCurrentUser") || "null");

    if (storedUser) {
      if (firstNameInput && storedUser.firstName) firstNameInput.value = storedUser.firstName;
      if (lastNameInput && storedUser.lastName) lastNameInput.value = storedUser.lastName;
      if (emailInput && storedUser.email) emailInput.value = storedUser.email;
      if (phoneInput && storedUser.phone) phoneInput.value = storedUser.phone;
    }

    eventRegistrationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const selectedEvent = selectedEventInput.value.trim();
      const selectedDate = selectedDateInput.value.trim();
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const participants = participantsInput.value.trim();
      const ageGroup = ageGroupInput.value.trim();
      const agreementChecked = registrationAgreementInput.checked;

      const hasContactMethod = email !== "" || phone !== "";
      const formValid =
        selectedEvent &&
        firstName &&
        lastName &&
        participants &&
        ageGroup &&
        hasContactMethod &&
        agreementChecked;

      if (!formValid) {
        registrationErrorMessage.hidden = false;
        return;
      }

      registrationErrorMessage.hidden = true;

      const registeredEvents = JSON.parse(localStorage.getItem("harmonyRegisteredEvents") || "[]");
      registeredEvents.push({
        id: Date.now(),
        eventName: selectedEvent,
        eventDate: selectedDate || "Date not specified",
        firstName,
        lastName,
        email,
        phone,
        participants,
        ageGroup,
        emergencyName: emergencyNameInput.value.trim(),
        emergencyPhone: emergencyPhoneInput.value.trim(),
        dietaryNotes: dietaryNotesInput.value.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("harmonyRegisteredEvents", JSON.stringify(registeredEvents));

      registrationSuccessText.innerHTML = `Thank you, <strong>${firstName}</strong>! Your registration for <strong>${selectedEvent}</strong> has been confirmed.`;

      registrationFormWrap.hidden = true;
      registrationSuccessWrap.hidden = false;
      registrationSuccessWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (proposalLockedWrap && proposalFormWrap) {
    const storedUser = JSON.parse(localStorage.getItem("harmonyCurrentUser") || "null");
    const isSignedIn = !!storedUser;

    if (isSignedIn) {
      proposalLockedWrap.hidden = true;
      proposalFormWrap.hidden = false;

      const proposalFullName = document.getElementById("proposalFullName");
      const proposalEmail = document.getElementById("proposalEmail");
      const proposalPhone = document.getElementById("proposalPhone");

      if (proposalFullName && storedUser.firstName && storedUser.lastName) {
        proposalFullName.value = `${storedUser.firstName} ${storedUser.lastName}`;
      }
      if (proposalEmail && storedUser.email) proposalEmail.value = storedUser.email;
      if (proposalPhone && storedUser.phone) proposalPhone.value = storedUser.phone;
    } else {
      proposalLockedWrap.hidden = false;
      proposalFormWrap.hidden = true;
    }
  }

  if (eventProposalForm && proposalSteps.length) {
    let currentProposalStep = 1;

    const stepTitles = {
      1: "Organizer Information",
      2: "Event Proposal",
      3: "Audience & Resources",
    };

    function showProposalStep(stepNumber) {
      if (stepNumber < 1) stepNumber = 1;
      if (stepNumber > 3) stepNumber = 3;

      currentProposalStep = stepNumber;

      proposalSteps.forEach((step) => {
        step.classList.toggle("active", Number(step.dataset.step) === currentProposalStep);
      });

      proposalStepLabel.textContent = `Step ${currentProposalStep} of 3`;
      proposalStepTitle.textContent = stepTitles[currentProposalStep];
      proposalProgressFill.style.width = `${(currentProposalStep / 3) * 100}%`;

      // BACK BUTTON
      proposalBackBtn.style.display = currentProposalStep === 1 ? "none" : "inline-flex";

      // NEXT BUTTON
      proposalNextBtn.style.display = currentProposalStep === 3 ? "none" : "inline-flex";

      // SUBMIT BUTTON
      proposalSubmitBtn.style.display = currentProposalStep === 3 ? "inline-flex" : "none";

      proposalErrorMessage.hidden = true;
    }

    function validateProposalStep(stepNumber) {
      const currentStepElement = document.querySelector(`.proposal-step[data-step="${stepNumber}"]`);
      if (!currentStepElement) return false;

      const requiredFields = currentStepElement.querySelectorAll("[required]");
      let valid = true;

      requiredFields.forEach((field) => {
        const isCheckbox = field.type === "checkbox";
        const isValidField = isCheckbox ? field.checked : field.value.trim() !== "";

        if (!isValidField) {
          valid = false;
        }
      });

      proposalErrorMessage.hidden = valid;
      return valid;
    }

    proposalNextBtn.addEventListener("click", () => {
      if (!validateProposalStep(currentProposalStep)) return;

      if (currentProposalStep < 3) {
        currentProposalStep += 1;
        showProposalStep(currentProposalStep);
      }
    });

    proposalBackBtn.addEventListener("click", () => {
      if (currentProposalStep > 1) {
        currentProposalStep -= 1;
        showProposalStep(currentProposalStep);
      }
    });
    eventProposalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (currentProposalStep !== 3) return;
      if (!validateProposalStep(currentProposalStep)) return;

      const proposalData = {
        id: Date.now(),
        organizerName: document.getElementById("proposalFullName").value.trim(),
        organizerEmail: document.getElementById("proposalEmail").value.trim(),
        organizerPhone: document.getElementById("proposalPhone").value.trim(),
        organizationType: document.getElementById("organizationType").value.trim(),
        eventTitle: document.getElementById("proposalEventTitle").value.trim(),
        description: document.getElementById("proposalDescription").value.trim(),
        date: document.getElementById("proposalDate").value.trim(),
        time: document.getElementById("proposalTime").value.trim(),
        duration: document.getElementById("proposalDuration").value.trim(),
        expectedParticipants: document.getElementById("expectedParticipants").value.trim(),
        targetAudience: document.getElementById("targetAudience").value.trim(),
        resourcesNeeded: document.getElementById("resourcesNeeded").value.trim(),
        createdAt: new Date().toISOString(),
        status: "submitted",
      };

      const savedProposals = JSON.parse(localStorage.getItem("harmonyEventProposals") || "[]");
      savedProposals.push(proposalData);
      localStorage.setItem("harmonyEventProposals", JSON.stringify(savedProposals));

      proposalSuccessText.innerHTML = `Thank you for your interest in organizing an event at Harmony House. Your proposal for <strong>${proposalData.eventTitle}</strong> has been received.`;

      proposalFormWrap.hidden = true;
      proposalSuccessWrap.hidden = false;
      proposalSuccessWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    showProposalStep(1);
  }

    // ACCOUNT PAGE
  const accountAuthSection = document.getElementById("accountAuthSection");
  const accountDashboardSection = document.getElementById("accountDashboardSection");
  const accountHeroSignedOut = document.getElementById("accountHeroSignedOut");
  const accountHeroSignedIn = document.getElementById("accountHeroSignedIn");
  const dashboardWelcomeText = document.getElementById("dashboardWelcomeText");

  const signInTabBtn = document.getElementById("signInTabBtn");
  const signUpTabBtn = document.getElementById("signUpTabBtn");
  const accountSignInView = document.getElementById("accountSignInView");
  const accountSignUpView = document.getElementById("accountSignUpView");

  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");
  const signInErrorMessage = document.getElementById("signInErrorMessage");
  const signUpErrorMessage = document.getElementById("signUpErrorMessage");
  const signOutBtn = document.getElementById("signOutBtn");

  const accountAttendedCount = document.getElementById("accountAttendedCount");
  const accountUpcomingCount = document.getElementById("accountUpcomingCount");
  const accountLikedEventsCount = document.getElementById("accountLikedEventsCount");
  const accountLikedStoriesCount = document.getElementById("accountLikedStoriesCount");

  const accountUpcomingEventsList = document.getElementById("accountUpcomingEventsList");
  const accountLikedEventsList = document.getElementById("accountLikedEventsList");
  const accountLikedStoriesList = document.getElementById("accountLikedStoriesList");
  const accountProposalsList = document.getElementById("accountProposalsList");

  const accountUpcomingEmpty = document.getElementById("accountUpcomingEmpty");
  const accountLikedEventsEmpty = document.getElementById("accountLikedEventsEmpty");
  const accountLikedStoriesEmpty = document.getElementById("accountLikedStoriesEmpty");
  const accountProposalsEmpty = document.getElementById("accountProposalsEmpty");

  if (
    accountAuthSection &&
    accountDashboardSection &&
    accountHeroSignedOut &&
    accountHeroSignedIn
  ) {
    function setAccountTab(mode) {
      const isSignIn = mode === "signin";

      signInTabBtn.classList.toggle("active", isSignIn);
      signUpTabBtn.classList.toggle("active", !isSignIn);
      accountSignInView.hidden = !isSignIn;
      accountSignUpView.hidden = isSignIn;
    }

    function getStoredUsers() {
      return JSON.parse(localStorage.getItem("harmonyUsers") || "[]");
    }

    function getCurrentUser() {
      return JSON.parse(localStorage.getItem("harmonyCurrentUser") || "null");
    }

    function setCurrentUser(user) {
      localStorage.setItem("harmonyCurrentUser", JSON.stringify(user));
    }

    function clearCurrentUser() {
      localStorage.removeItem("harmonyCurrentUser");
    }

    function createMiniCard(title, subtitle, extra = "", status = "") {
      const card = document.createElement("article");
      card.className = "account-mini-card";

      let html = `<h3>${title}</h3>`;
      if (subtitle) html += `<p>${subtitle}</p>`;
      if (extra) html += `<div class="mini-time">${extra}</div>`;
      if (status) html += `<span class="account-proposal-status">${status}</span>`;

      card.innerHTML = html;
      return card;
    }

    function renderDashboard() {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();
      dashboardWelcomeText.textContent = `Welcome, ${currentUser.firstName || "friend"}!`;

      const registeredEvents = JSON.parse(localStorage.getItem("harmonyRegisteredEvents") || "[]");
      const favouriteEventIds = JSON.parse(localStorage.getItem("harmonyFavouriteEvents") || "[]");
      const likedStories = JSON.parse(localStorage.getItem("harmonyLikedStories") || "[]");
      const submittedProposals = JSON.parse(localStorage.getItem("harmonyEventProposals") || "[]");

      const userRegisteredEvents = registeredEvents.filter((event) => {
        const sameEmail =
          currentUser.email &&
          event.email &&
          currentUser.email.toLowerCase() === event.email.toLowerCase();

        const sameName =
          event.firstName &&
          event.lastName &&
          `${event.firstName} ${event.lastName}`.trim().toLowerCase() === fullName.toLowerCase();

        return sameEmail || sameName;
      });

      const likedEventTitleMap = {
        "morning-yoga-apr-6": { title: "Morning Yoga for Beginners", info: "Mon, Apr 6 · 7:00 AM - 8:00 AM" },
        "mindfulness-meditation-apr-6": { title: "Mindfulness Meditation", info: "Mon, Apr 6 · 6:00 PM - 7:00 PM" },
        "parenting-workshop-apr-7": { title: "Parenting Workshop: Teen Communication", info: "Tue, Apr 7 · 6:30 PM - 8:00 PM" },
        "senior-book-club-apr-7": { title: "Senior Book Club", info: "Tue, Apr 7 · 10:00 AM - 11:30 AM" },
        "zumba-dance-party-apr-8": { title: "Zumba Dance Party", info: "Wed, Apr 8 · 5:30 PM - 6:30 PM" },
        "youth-art-workshop-apr-8": { title: "Youth Art Workshop", info: "Wed, Apr 8 · 4:00 PM - 5:30 PM" },
        "financial-literacy-workshop-apr-9": { title: "Financial Literacy Workshop", info: "Thu, Apr 9 · 6:00 PM - 7:30 PM" },
        "group-therapy-apr-9": { title: "Group Therapy: Managing Anxiety", info: "Thu, Apr 9 · 7:00 PM - 8:30 PM" },
        "community-walking-group-apr-10": { title: "Community Walking Group", info: "Fri, Apr 10 · 8:00 AM - 9:30 AM" },
        "teen-support-circle-apr-10": { title: "Teen Support Circle", info: "Fri, Apr 10 · 4:00 PM - 5:30 PM" },
        "senior-chair-yoga-apr-11": { title: "Senior Fitness: Chair Yoga", info: "Sat, Apr 11 · 10:00 AM - 11:00 AM" },
        "family-game-day-apr-11": { title: "Family Game Day", info: "Sat, Apr 11 · 2:00 PM - 5:00 PM" },
        "morning-yoga-apr-13": { title: "Morning Yoga for Beginners", info: "Mon, Apr 13 · 7:00 AM - 8:00 AM" },
        "zumba-dance-party-apr-15": { title: "Zumba Dance Party", info: "Wed, Apr 15 · 5:30 PM - 6:30 PM" }
      };

      accountUpcomingEventsList.innerHTML = "";
      accountLikedEventsList.innerHTML = "";
      accountLikedStoriesList.innerHTML = "";
      accountProposalsList.innerHTML = "";

      if (userRegisteredEvents.length) {
        accountUpcomingEmpty.hidden = true;
        userRegisteredEvents.forEach((event) => {
          accountUpcomingEventsList.appendChild(
            createMiniCard(
              event.eventName,
              event.eventDate || "Date not specified",
              `${event.participants} participant(s)`
            )
          );
        });
      } else {
        accountUpcomingEmpty.hidden = false;
      }

      if (favouriteEventIds.length) {
        accountLikedEventsEmpty.hidden = true;
        favouriteEventIds.forEach((id) => {
          const eventInfo = likedEventTitleMap[id];
          if (eventInfo) {
            accountLikedEventsList.appendChild(
              createMiniCard(eventInfo.title, eventInfo.info)
            );
          }
        });
      } else {
        accountLikedEventsEmpty.hidden = false;
      }

      if (likedStories.length) {
        accountLikedStoriesEmpty.hidden = true;
        likedStories.forEach((story) => {
          const title = typeof story === "string" ? story : story.title || "Saved story";
          const subtitle = typeof story === "string" ? "" : story.subtitle || "";
          accountLikedStoriesList.appendChild(createMiniCard(title, subtitle));
        });
      } else {
        accountLikedStoriesEmpty.hidden = false;
      }

      if (submittedProposals.length) {
        accountProposalsEmpty.hidden = true;
        submittedProposals.forEach((proposal) => {
          accountProposalsList.appendChild(
            createMiniCard(
              proposal.eventTitle,
              proposal.date ? `Proposed for ${proposal.date}` : "Proposal submitted",
              proposal.targetAudience || "",
              proposal.status || "submitted"
            )
          );
        });
      } else {
        accountProposalsEmpty.hidden = false;
      }

      accountAttendedCount.textContent = "0";
      accountUpcomingCount.textContent = userRegisteredEvents.length;
      accountLikedEventsCount.textContent = favouriteEventIds.length;
      accountLikedStoriesCount.textContent = likedStories.length;
    }

    function showSignedInState() {
      accountAuthSection.hidden = true;
      accountDashboardSection.hidden = false;
      accountHeroSignedOut.hidden = true;
      accountHeroSignedIn.hidden = false;
      renderDashboard();
    }

    function showSignedOutState() {
      accountAuthSection.hidden = false;
      accountDashboardSection.hidden = true;
      accountHeroSignedOut.hidden = false;
      accountHeroSignedIn.hidden = true;
      setAccountTab("signin");
    }

    if (signInTabBtn && signUpTabBtn) {
      signInTabBtn.addEventListener("click", () => setAccountTab("signin"));
      signUpTabBtn.addEventListener("click", () => setAccountTab("signup"));
    }

    if (signUpForm) {
      signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const firstName = document.getElementById("signUpFirstName").value.trim();
        const lastName = document.getElementById("signUpLastName").value.trim();
        const email = document.getElementById("signUpEmail").value.trim();
        const phone = document.getElementById("signUpPhone").value.trim();
        const dob = document.getElementById("signUpDob").value.trim();
        const emergencyContact = document.getElementById("signUpEmergencyContact").value.trim();
        const address = document.getElementById("signUpAddress").value.trim();
        const password = document.getElementById("signUpPassword").value;
        const confirmPassword = document.getElementById("signUpConfirmPassword").value;

        const valid =
          firstName &&
          lastName &&
          email &&
          phone &&
          dob &&
          password &&
          confirmPassword &&
          password === confirmPassword;

        if (!valid) {
          signUpErrorMessage.hidden = false;
          return;
        }

        const existingUsers = getStoredUsers();
        const emailAlreadyUsed = existingUsers.some(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (emailAlreadyUsed) {
          signUpErrorMessage.textContent = "An account with that email already exists. Please sign in instead.";
          signUpErrorMessage.hidden = false;
          return;
        }

        signUpErrorMessage.hidden = true;
        signUpErrorMessage.textContent = "Please complete all required fields and make sure both passwords match.";

        const newUser = {
          firstName,
          lastName,
          email,
          phone,
          dob,
          emergencyContact,
          address,
          password
        };

        existingUsers.push(newUser);
        localStorage.setItem("harmonyUsers", JSON.stringify(existingUsers));
        setCurrentUser(newUser);
        showSignedInState();
      });
    }

    if (signInForm) {
      signInForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("signInEmail").value.trim();
        const password = document.getElementById("signInPassword").value;

        const existingUsers = getStoredUsers();
        const matchedUser = existingUsers.find(
          (user) =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

        if (!matchedUser) {
          signInErrorMessage.hidden = false;
          return;
        }

        signInErrorMessage.hidden = true;
        setCurrentUser(matchedUser);
        showSignedInState();
      });
    }

    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        clearCurrentUser();
        showSignedOutState();
      });
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      showSignedInState();
    } else {
      showSignedOutState();
    }
  }


    // NEWS PAGE
  const featuredStoryWrap = document.getElementById("featuredStoryWrap");
  const newsGrid = document.getElementById("newsGrid");
  const newsEmptyState = document.getElementById("newsEmptyState");
  const newsFilterChips = document.querySelectorAll(".news-filter-chip");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  if (featuredStoryWrap && newsGrid && newsEmptyState) {
    const storiesData = [
      {
        id: "community-garden-program",
        title: "Community Garden Program Flourishes in First Year",
        category: "success-story",
        date: "March 28, 2026",
        author: "Sarah Johnson",
        summary:
          "Our community garden initiative has brought together over 50 families, yielding fresh produce and stronger neighborhood bonds.",
        excerpt:
          "What started as a small pilot program has grown into a thriving community hub. Families gather weekly to tend their plots, share gardening tips, and build lasting friendships.",
        image:
          "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "mental-health-workshop-series",
        title: "Mental Health Workshop Series Reaches 500 Participants",
        category: "milestone",
        date: "March 25, 2026",
        author: "Dr. Michael Chen",
        summary:
          "Our mindfulness and mental health workshops have helped hundreds of community members develop coping strategies and find support.",
        excerpt:
          "The latest round of sessions drew participants from across the region, showing the growing demand for accessible wellbeing education.",
        image:
          "https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "new-youth-mentorship-program",
        title: "New Youth Mentorship Program Launches",
        category: "announcement",
        date: "March 20, 2026",
        author: "Harmony House Team",
        summary:
          "We’re excited to introduce a new mentorship program connecting local youth with caring adult role models.",
        excerpt:
          "The program focuses on confidence building, practical guidance, and long-term encouragement for young people in our community.",
        image:
          "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "marias-journey",
        title: "Maria’s Journey: From Crisis to Confidence",
        category: "success-story",
        date: "March 15, 2026",
        author: "Irene Rodriguez",
        summary:
          "A community member shares how Harmony House services helped her navigate a difficult period and rebuild her life.",
        excerpt:
          "With support from counselling, community groups, and new friendships, Maria found renewed stability and confidence.",
        image:
          "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "senior-fitness-classes-expand",
        title: "Senior Fitness Classes Expand Due to Popular Demand",
        category: "program-update",
        date: "March 10, 2026",
        author: "Emily Waters",
        summary:
          "Our chair yoga and gentle fitness classes for seniors now run four times weekly to accommodate growing interest.",
        excerpt:
          "Participants have reported improved mobility, confidence, and social connection through the expanded programme.",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "community-celebrates-anniversary",
        title: "Community Celebrates One Year of Harmony House",
        category: "milestone",
        date: "March 5, 2026",
        author: "Harmony House Team",
        summary:
          "We marked our first anniversary with a community celebration, reflecting on a year of growth, connection, and positive impact.",
        excerpt:
          "Residents, volunteers, and partners joined together to celebrate stories of resilience and success.",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "free-legal-aid-services",
        title: "New Partnership Brings Free Legal Aid Services",
        category: "announcement",
        date: "February 28, 2026",
        author: "Harmony House Team",
        summary:
          "Thanks to a new partnership, community members can now access free legal consultation services twice monthly.",
        excerpt:
          "This new offering broadens the practical support available through the hub and improves local access to advice.",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "teen-support-group-network",
        title: "Teen Support Group Creates Powerful Peer Network",
        category: "success-story",
        date: "February 20, 2026",
        author: "James Li",
        summary:
          "Our weekly teen support circles are creating a judgement-free space for growth, friendship, and resilience.",
        excerpt:
          "Young people say the group has become a trusted place to connect, share experiences, and feel understood.",
        image:
          "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "spring-event-calendar",
        title: "Spring Event Calendar Now Available",
        category: "announcement",
        date: "February 15, 2026",
        author: "Events Team",
        summary:
          "Our spring lineup features exciting new workshops, fitness classes, and community activities for all ages.",
        excerpt:
          "The new calendar reflects member feedback and includes several expanded programs requested by the community.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80"
      }
    ];

    const categoryMap = {
      "success-story": "Success Story",
      announcement: "Announcement",
      milestone: "Milestone",
      "program-update": "Program Update"
    };

    const favouriteStories = new Set(
      JSON.parse(localStorage.getItem("harmonyLikedStories") || "[]")
    );

    let selectedStoryCategory = "all";

    function createStoryTag(category) {
      return `<span class="story-tag tag-${category}">${categoryMap[category]}</span>`;
    }

    function createLikeButton(storyId, isFeatured = false) {
      const activeClass = favouriteStories.has(storyId) ? "active" : "";
      const buttonClass = isFeatured ? "featured-story-like-btn" : "news-card-like-btn";
      return `<button class="${buttonClass} ${activeClass}" type="button" data-story-id="${storyId}" aria-label="Toggle liked story">♥</button>`;
    }

    function renderFeaturedStory() {
      const featured = storiesData[0];

      featuredStoryWrap.innerHTML = `
        <a class="featured-story-link" href="story.html?id=${encodeURIComponent(featured.id)}">
          <div class="featured-story-image-wrap">
            ${createLikeButton(featured.id, true)}
            <img src="${featured.image}" alt="${featured.title}">
          </div>
          <div class="featured-story-content">
            ${createStoryTag(featured.category)}
            <h2>${featured.title}</h2>
            <p class="story-summary">${featured.summary}</p>
            <p class="story-excerpt">${featured.excerpt}</p>
            <div class="story-meta-line">🗓 ${featured.date} &nbsp;&nbsp; ✎ ${featured.author}</div>
            <span class="featured-story-btn">Read Full Story →</span>
          </div>
        </a>
      `;
    }

    function createStoryCard(story) {
      const article = document.createElement("article");
      article.className = `news-card category-${story.category}`;

      article.innerHTML = `
        <a href="story.html?id=${encodeURIComponent(story.id)}">
          <div class="news-card-media">
            ${createStoryTag(story.category)}
            ${createLikeButton(story.id)}
            <img src="${story.image}" alt="${story.title}">
          </div>
          <div class="news-card-body">
            <div class="news-card-date">${story.date}</div>
            <h3>${story.title}</h3>
            <p class="news-card-summary">${story.summary}</p>
            <div class="news-card-footer">
              <span class="news-card-author">✎ ${story.author}</span>
              <span class="news-read-more">Read More →</span>
            </div>
          </div>
        </a>
      `;

      return article;
    }

    function getVisibleStories() {
      const nonFeaturedStories = storiesData.slice(1);

      if (selectedStoryCategory === "all") {
        return nonFeaturedStories;
      }

      return nonFeaturedStories.filter(
        (story) => story.category === selectedStoryCategory
      );
    }

    function renderStories() {
      const visibleStories = getVisibleStories();
      newsGrid.innerHTML = "";

      if (!visibleStories.length) {
        newsEmptyState.hidden = false;
        return;
      }

      newsEmptyState.hidden = true;
      visibleStories.forEach((story) => {
        newsGrid.appendChild(createStoryCard(story));
      });

      attachStoryLikeHandlers();
    }

    function saveFavouriteStories() {
      localStorage.setItem(
        "harmonyLikedStories",
        JSON.stringify([...favouriteStories])
      );
    }

    function attachStoryLikeHandlers() {
      const likeButtons = document.querySelectorAll(
        ".news-card-like-btn, .featured-story-like-btn"
      );

      likeButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const storyId = button.dataset.storyId;

          if (favouriteStories.has(storyId)) {
            favouriteStories.delete(storyId);
            button.classList.remove("active");
          } else {
            favouriteStories.add(storyId);
            button.classList.add("active");
          }

          saveFavouriteStories();
        });
      });
    }

    newsFilterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        newsFilterChips.forEach((otherChip) => otherChip.classList.remove("active"));
        chip.classList.add("active");
        selectedStoryCategory = chip.dataset.category;
        renderStories();
      });
    });

    if (newsletterForm && newsletterEmail && newsletterMessage) {
      newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailValue = newsletterEmail.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
          newsletterMessage.hidden = false;
          newsletterMessage.textContent = "Please enter a valid email address.";
          return;
        }

        const savedSubscribers = JSON.parse(
          localStorage.getItem("harmonyNewsletterSubscribers") || "[]"
        );

        if (!savedSubscribers.includes(emailValue.toLowerCase())) {
          savedSubscribers.push(emailValue.toLowerCase());
          localStorage.setItem(
            "harmonyNewsletterSubscribers",
            JSON.stringify(savedSubscribers)
          );
        }

        newsletterMessage.hidden = false;
        newsletterMessage.textContent =
          "Thanks for subscribing! A confirmation email will be sent shortly.";
        newsletterEmail.value = "";
      });
    }

    renderFeaturedStory();
    renderStories();
    attachStoryLikeHandlers();
  }

    // CONTACT PAGE
  const contactForm = document.getElementById("contactForm");
  const contactFormWrap = document.getElementById("contactFormWrap");
  const contactSuccessWrap = document.getElementById("contactSuccessWrap");
  const contactFormError = document.getElementById("contactFormError");
  const contactTopic = document.getElementById("contactTopic");

  const donationForm = document.getElementById("donationForm");
  const donationFormWrap = document.getElementById("donationFormWrap");
  const donationSuccessWrap = document.getElementById("donationSuccessWrap");
  const donationFormError = document.getElementById("donationFormError");

  const viewFaqBtn = document.getElementById("viewFaqBtn");
  const viewDonationFaqBtn = document.getElementById("viewDonationFaqBtn");
  const generalFaqGroup = document.getElementById("generalFaqGroup");
  const donationFaqGroup = document.getElementById("donationFaqGroup");

  if (contactForm && contactTopic) {
    const contactParams = new URLSearchParams(window.location.search);
    const topicParam = contactParams.get("topic");

    if (topicParam) {
      contactTopic.value = topicParam;
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const phone = document.getElementById("contactPhone").value.trim();
      const topic = contactTopic.value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !topic || !subject || !message) {
        contactFormError.hidden = false;
        return;
      }

      contactFormError.hidden = true;

      const savedContacts = JSON.parse(localStorage.getItem("harmonyContactMessages") || "[]");
      savedContacts.push({
        id: Date.now(),
        name,
        email,
        phone,
        topic,
        subject,
        message,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("harmonyContactMessages", JSON.stringify(savedContacts));

      contactFormWrap.hidden = true;
      contactSuccessWrap.hidden = false;
      contactSuccessWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (donationForm) {
    donationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("donationName").value.trim();
      const email = document.getElementById("donationEmail").value.trim();
      const phone = document.getElementById("donationPhone").value.trim();
      const amount = document.getElementById("donationAmount").value.trim();
      const purpose = document.getElementById("donationPurpose").value.trim();
      const reference = document.getElementById("donationReference").value.trim();
      const message = document.getElementById("donationMessage").value.trim();

      if (!name || !email || !amount || !purpose) {
        donationFormError.hidden = false;
        return;
      }

      donationFormError.hidden = true;

      const savedDonations = JSON.parse(localStorage.getItem("harmonyDonationRecords") || "[]");
      savedDonations.push({
        id: Date.now(),
        name,
        email,
        phone,
        amount,
        purpose,
        reference,
        message,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("harmonyDonationRecords", JSON.stringify(savedDonations));

      donationFormWrap.hidden = true;
      donationSuccessWrap.hidden = false;
      donationSuccessWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (viewFaqBtn && generalFaqGroup) {
    viewFaqBtn.addEventListener("click", () => {
      generalFaqGroup.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (viewDonationFaqBtn && donationFaqGroup) {
    viewDonationFaqBtn.addEventListener("click", () => {
      donationFaqGroup.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const header = item.querySelector(".faq-header");

      if (header) {
        header.addEventListener("click", () => {
          const isActive = item.classList.contains("active");

          faqItems.forEach((other) => {
            other.classList.remove("active");
          });

          if (!isActive) {
            item.classList.add("active");
          }
        });
      }
    });
  }
});
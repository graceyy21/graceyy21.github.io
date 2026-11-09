// Messages from the contact form are sent to this address
const CONTACT_EMAIL = "graceanndemate@gmail.com";

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setMenuOpen(isOpen) {
  navLinks.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!navLinks.classList.contains("open"));
});

// Close the menu when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

// ===== Navbar background on scroll =====
const navbar = document.getElementById("navbar");

function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

// ===== Highlight the active section in the nav =====
const links = navLinks.querySelectorAll("a:not(.btn-hire)");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

links.forEach((link) => {
  sectionObserver.observe(document.querySelector(link.getAttribute("href")));
});

// ===== Hero name: letters appear one by one =====
const heroName = document.getElementById("hero-name");
const fullName = heroName.textContent;
let letterIndex = 0;

heroName.setAttribute("aria-label", fullName);
heroName.textContent = "";

fullName.split(" ").forEach((word) => {
  const wordEl = document.createElement("span");
  wordEl.className = "word";
  wordEl.setAttribute("aria-hidden", "true");

  [...word].forEach((char) => {
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = char;
    letter.style.setProperty("--d", `${0.2 + letterIndex * 0.05}s`);
    wordEl.appendChild(letter);
    letterIndex++;
  });

  heroName.appendChild(wordEl);
});

// ===== Stagger cards so they appear one after another =====
document.querySelectorAll("[data-stagger]").forEach((group) => {
  [...group.children].forEach((child, i) => {
    child.style.setProperty("--d", `${i * 0.12}s`);
  });
});

document.querySelectorAll("[data-delay]").forEach((el) => {
  el.style.setProperty("--d", `${el.dataset.delay}s`);
});

const tools = document.getElementById("tools");

[...tools.children].forEach((tool, i) => {
  tool.style.setProperty("--d", `${i * 0.07}s`);
});

// ===== Animate elements as they scroll into view =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
revealObserver.observe(tools);

// ===== Contact form: opens the visitor's email app with the message filled in =====
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { first, last, email, subject, message } = form.elements;
  const body = `${message.value}\n\nFrom: ${first.value} ${last.value} (${email.value})`;

  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Opening your email app so you can send this message.";
});

// ===== Light / dark mode toggle =====
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

applyTheme(document.documentElement.dataset.theme || "light");

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // Storage blocked (e.g. private mode): the theme still switches for this visit
  }
});

// ===== Resume viewer (view only, no download) =====
const resumeViewer = document.getElementById("resume-viewer");

document.getElementById("resume-open").addEventListener("click", () => {
  resumeViewer.showModal();
  document.body.style.overflow = "hidden";
});

document.getElementById("resume-close").addEventListener("click", () => resumeViewer.close());

// Clicking the dark area outside the page also closes it
resumeViewer.addEventListener("click", (e) => {
  if (e.target === resumeViewer) resumeViewer.close();
});

resumeViewer.addEventListener("close", () => {
  document.body.style.overflow = "";
});

// Discourage saving: no right-click menu or dragging on the resume
resumeViewer.addEventListener("contextmenu", (e) => e.preventDefault());

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

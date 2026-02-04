document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const langBtn = document.getElementById("langBtn");
  const contactForm = document.getElementById("contactForm");

  let currentLang = localStorage.getItem("lang") || "fr";
  applyLanguage(currentLang);

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    nav.classList.toggle("open");
  });

  // Gentle fade navigation instead of scroll
  document.querySelectorAll('.nav-list a, a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Close mobile menu
          menuToggle.classList.remove("active");
          nav.classList.remove("open");

          // Fade out
          document.body.classList.add("page-fade");
          document.body.classList.remove("page-visible");

          setTimeout(() => {
            // Hide completely before jump
            document.body.classList.add("page-hidden");
            document.body.classList.remove("page-fade");

            // Jump to section instantly
            window.scrollTo(0, targetSection.offsetTop - 80);

            // Small delay then fade in
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                document.body.classList.remove("page-hidden");
                document.body.classList.add("page-visible");
              });
            });
          }, 400);
        }
      }
    });
  });

  // Initialize body as visible
  document.body.classList.add("page-visible");

  langBtn.addEventListener("click", function () {
    currentLang = currentLang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", currentLang);
    applyLanguage(currentLang);
  });

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    const langActive = langBtn.querySelector(".lang-active");
    const langInactive = langBtn.querySelector(".lang-inactive");

    if (lang === "en") {
      langActive.textContent = "EN";
      langInactive.textContent = "FR";
    } else {
      langActive.textContent = "FR";
      langInactive.textContent = "EN";
    }

    document.querySelectorAll("[data-fr][data-en]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    const titleEl = document.querySelector("title");
    if (lang === "en") {
      titleEl.textContent =
        "A Time for Yourself – Yoga and Thai Massage in Montbrun-les-Bains";
      document
        .querySelector('meta[name="description"]')
        .setAttribute(
          "content",
          "Discover yoga and traditional Thai massage in Montbrun-les-Bains with Laurence and Ransley. Group classes, intensive workshops and therapeutic massages in a natural, soothing setting.",
        );
    } else {
      titleEl.textContent =
        "Un temps pour soi-même – Yoga et massage thaï à Montbrun-les-Bains";
      document
        .querySelector('meta[name="description"]')
        .setAttribute(
          "content",
          "Découvrez le yoga et le massage thaï traditionnel à Montbrun-les-Bains avec Laurence et Ransley. Cours collectifs, stages intensifs et massages thérapeutiques dans un cadre naturel et apaisant.",
        );
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      let isValid = true;

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
      });

      if (!name.value.trim()) {
        name.closest(".form-group").classList.add("error");
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        email.closest(".form-group").classList.add("error");
        isValid = false;
      }

      if (!message.value.trim()) {
        message.closest(".form-group").classList.add("error");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        return;
      }
    });
  }
  /*
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });*/
  function smoothScrollTo(targetY, duration = 1200) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    // Very soft ease-out (slow arrival)
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeOutCubic(progress);

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".service-card, .yoga-type, .pricing-card, .stage-card, .location-card, .info-card",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  let lastScrollY = window.scrollY;
  const header = document.querySelector(".header");
  // Hero soft intro animation
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add("animate");
    }, 300); // slight pause after image starts appearing
  }
  // Sort pricing cards by price (ascending) + very soft sand gradient
  const pricingContainer = document.querySelector(".pricing-cards");

  if (pricingContainer) {
    const cards = Array.from(
      pricingContainer.querySelectorAll(".pricing-card"),
    );

    cards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    pricingContainer.innerHTML = "";

    // Light sand → slightly warmer sand (very subtle)
    const startColor = [252, 246, 238]; // almost white sand
    const endColor = [232, 222, 208]; // warm light sand

    cards.forEach((card, index) => {
      pricingContainer.appendChild(card);

      const t = index / (cards.length - 1);

      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);

      card.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.08)";
    } else {
      header.style.boxShadow = "none";
    }
    lastScrollY = window.scrollY;
  });
});

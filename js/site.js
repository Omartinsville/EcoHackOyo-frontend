(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("primary-menu");
  const backToTop = document.getElementById("back-to-top");

  // Mobile navigation
  const closeMenu = () => {
    menu?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // Header + back-to-top
  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 10);
    backToTop?.classList.toggle("visible", window.scrollY > 650);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Active navigation link (home page section scroll-spy)
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  if (sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Countdown (used on the homepage, targets the Main Event)
  const countdown = document.getElementById("countdown");
  if (countdown) {
    const target = new Date(countdown.dataset.date).getTime();
    const units = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };

    const pad = value => String(Math.max(0, value)).padStart(2, "0");

    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        units.days.textContent = "00";
        units.hours.textContent = "00";
        units.minutes.textContent = "00";
        units.seconds.textContent = "00";
        const label = countdown.parentElement.querySelector(".countdown-label");
        if (label) label.textContent = "ECOHACKOYO MAIN EVENT IS LIVE";
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      units.days.textContent = pad(Math.floor(totalSeconds / 86400));
      units.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
      units.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      units.seconds.textContent = pad(totalSeconds % 60);
    };

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
})();

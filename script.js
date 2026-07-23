(function () {
  "use strict";

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Navbar scroll effect ---------------- */
  var header = document.getElementById("siteHeader");
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      if (y > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    updateProgress();
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Scroll progress indicator ---------------- */
  var progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll reveal (fade up / left / right) ---------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = (i % 4) * 90;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Counter animation ---------------- */
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterIo.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------------- Soft parallax on hero image ---------------- */
  var heroImg = document.querySelector(".hero__frame img");
  var hero = document.getElementById("hero");

  function parallax() {
    if (!heroImg || !hero) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    var progress = 1 - rect.bottom / (window.innerHeight + rect.height);
    var translate = Math.max(-20, Math.min(20, progress * 30 - 10));
    heroImg.style.transform = "scale(1.05) translateY(" + translate + "px)";
  }
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();

  /* ---------------- Smooth anchor scrolling offset for fixed header ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------------- Quote form (front-end only, no backend wired up) ---------------- */
  var quoteForm = document.getElementById("quoteForm");
  var formNote = document.getElementById("formNote");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }
      formNote.textContent = "Thanks — we'll be in touch within 48 hours to arrange your free consultation.";
      quoteForm.reset();
    });
  }

  /* ---------------- Before / after comparison sliders ---------------- */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var range = ba.querySelector(".ba__range");
    var dragging = false;

    function setPos(p) {
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty("--pos", p + "%");
      if (range) range.value = p;
    }

    function posFromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    setPos(range ? parseFloat(range.value) : 50);

    // Keyboard support via the range input
    if (range) {
      range.addEventListener("input", function () {
        setPos(parseFloat(range.value));
      });
    }

    // Pointer drag anywhere on the image
    ba.addEventListener("pointerdown", function (e) {
      dragging = true;
      if (range) range.focus();
      setPos(posFromEvent(e));
    });
    window.addEventListener("pointermove", function (e) {
      if (dragging) setPos(posFromEvent(e));
    });
    window.addEventListener("pointerup", function () {
      dragging = false;
    });
  });
})();
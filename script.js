(function () {
  /* Плавний перехід до секцій без # у адресному рядку */
  function stripUrlHash() {
    if (!history.replaceState) return;
    var path = window.location.pathname + window.location.search;
    history.replaceState(null, "", path);
  }

  (function initInPageNavWithoutHash() {
    var h = window.location.hash;
    if (h && h.length > 1) {
      var onLoadTarget = document.getElementById(h.slice(1));
      if (onLoadTarget) {
        stripUrlHash();
        onLoadTarget.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      link.addEventListener("click", function (e) {
        if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        var id = href.slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        stripUrlHash();
      });
    });
  })();

  var signupModal = document.getElementById("signup-modal");
  var signupOpeners = document.querySelectorAll("[data-open-signup]");
  var signupClosers = document.querySelectorAll("[data-close-signup]");
  var lastFocus = null;

  function openSignup() {
    if (!signupModal) return;
    var nt = document.querySelector(".nav-toggle");
    var nv = document.querySelector(".nav");
    if (nt && nv && nv.classList.contains("is-open")) {
      nv.classList.remove("is-open");
      nt.setAttribute("aria-expanded", "false");
    }
    lastFocus = document.activeElement;
    signupModal.classList.add("is-open");
    signupModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var first = signupModal.querySelector("input:not([type='hidden'])");
    if (first) window.setTimeout(function () { first.focus(); }, 10);
  }

  function closeSignup() {
    if (!signupModal) return;
    signupModal.classList.remove("is-open");
    signupModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  signupOpeners.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openSignup();
    });
  });

  signupClosers.forEach(function (el) {
    el.addEventListener("click", function () {
      closeSignup();
    });
  });

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox && lightbox.querySelector("img");
  var closeBtn = lightbox && lightbox.querySelector(".lightbox-close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      openLightbox(img.src, img.alt);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (signupModal && signupModal.classList.contains("is-open")) {
      e.preventDefault();
      closeSignup();
      return;
    }
    if (lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();

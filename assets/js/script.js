(function () {
  "use strict";

  // Menu mobile
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Sombra no header ao rolar
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Animação de entrada
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  // Carrossel contínuo de depoimentos
  var carousel = document.querySelector("[data-testimonial-carousel]");
  if (carousel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var paused = false;
    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    var scrollPosition = carousel.scrollLeft;
    var speed = 0.35;

    var getLoopWidth = function () {
      var track = carousel.querySelector(".testimonial-track");
      return track ? track.scrollWidth / 2 : 0;
    };

    var step = function () {
      var loopWidth = getLoopWidth();
      if (!paused && !dragging && loopWidth > 0) {
        scrollPosition += speed;
        if (scrollPosition >= loopWidth) {
          scrollPosition -= loopWidth;
        }
        carousel.scrollLeft = scrollPosition;
      }
      window.requestAnimationFrame(step);
    };

    carousel.addEventListener("mouseenter", function () {
      paused = true;
    });

    carousel.addEventListener("mouseleave", function () {
      paused = false;
      dragging = false;
      carousel.classList.remove("is-dragging");
    });

    carousel.addEventListener("focusin", function () {
      paused = true;
    });

    carousel.addEventListener("focusout", function () {
      paused = false;
    });

    carousel.addEventListener("pointerdown", function (e) {
      dragging = true;
      paused = true;
      startX = e.clientX;
      startScroll = carousel.scrollLeft;
      scrollPosition = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(e.pointerId);
    });

    carousel.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      carousel.scrollLeft = startScroll - (e.clientX - startX);
      scrollPosition = carousel.scrollLeft;
    });

    carousel.addEventListener("pointerup", function (e) {
      dragging = false;
      paused = false;
      carousel.classList.remove("is-dragging");
      if (carousel.hasPointerCapture(e.pointerId)) {
        carousel.releasePointerCapture(e.pointerId);
      }
    });

    carousel.addEventListener("pointercancel", function () {
      dragging = false;
      paused = false;
      carousel.classList.remove("is-dragging");
    });

    window.requestAnimationFrame(step);
  }

  // FAQ com transição suave
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    if (item.open) item.classList.add("is-open");

    var summary = item.querySelector("summary");
    var answer = item.querySelector(".faq-answer");
    if (!summary || !answer) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();

      if (item.classList.contains("is-open")) {
        item.classList.remove("is-open");
        answer.addEventListener(
          "transitionend",
          function () {
            if (!item.classList.contains("is-open")) item.open = false;
          },
          { once: true }
        );
        return;
      }

      item.open = true;
      window.requestAnimationFrame(function () {
        item.classList.add("is-open");
      });
    });
  });

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();

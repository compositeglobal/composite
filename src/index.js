import Lenis from "lenis";
import { attr, runSplit, checkBreakpoints } from "./utilities";
import { pageLoadandTransition } from "./interactions/pageload";
import { scrollIn } from "./interactions/scrollin";
import { cursor } from "./interactions/cursor";

////////////////////////
//Page Load & Transition
pageLoadandTransition();

////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Previous Custom Code

  // LENIS SMOOTH SCROLL
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false,
  });
  // lenis request animation from
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // anchor links
  function anchorLinks() {
    const anchorLinks = document.querySelectorAll("[scroll-to]");
    if (anchorLinks == null) {
      return;
    }
    anchorLinks.forEach((item) => {
      const targetID = item.getAttribute("scroll-to");
      const target = document.getElementById(targetID);
      if (!target) return;
      item.addEventListener("click", (event) => {
        lenis.scrollTo(target, {
          duration: 0,
        });
      });
    });
  }
  anchorLinks();

  // stop page scrolling
  function stopScroll() {
    const stopScrollLinks = document.querySelectorAll("[data-lenis-stop]");
    if (stopScrollLinks == null) {
      return;
    }
    stopScrollLinks.forEach((item) => {
      item.addEventListener("click", (event) => {
        lenis.stop();
      });
    });
  }
  stopScroll();

  // start page scrolling
  function startScroll() {
    const startScrollLinks = document.querySelectorAll("[data-lenis-start]");
    if (startScrollLinks == null) {
      return;
    }
    startScrollLinks.forEach((item) => {
      item.addEventListener("click", (event) => {
        lenis.start();
      });
    });
  }
  startScroll();

  // toggle page scrolling
  function toggleScroll() {
    const toggleScrollLinks = document.querySelectorAll("[data-lenis-toggle]");
    if (toggleScrollLinks == null) {
      return;
    }
    toggleScrollLinks.forEach((item) => {
      let stopScroll = false;
      item.addEventListener("click", (event) => {
        stopScroll = !stopScroll;
        if (stopScroll) lenis.stop();
        else lenis.start();
      });
    });
  }
  toggleScroll();

  // Keep lenis and scrolltrigger in sync
  lenis.on("scroll", () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ////////////////////////
  //Utility Functions

  //replace low res images once high res images are loaded
  const loadHighResImages = function () {
    const highResImages = document.querySelectorAll(
      ".image-container .high-res"
    );
    //if no high res images exist return the function
    if (highResImages.length === 0) return;
    highResImages.forEach((highResImg) => {
      const lowResImg = highResImg.previousElementSibling; // Find the low-res image

      // Function to fade in the high-res image and fade out the low-res image
      const fadeInHighRes = () => {
        setTimeout(() => {
          // Add a delay before the fade-in
          highResImg.style.opacity = 1;
          lowResImg.style.opacity = 0;
        }, 300); // Delay in milliseconds (0.3 seconds)
      };

      // Check if the high-res image is fully loaded
      if (highResImg.complete && highResImg.naturalHeight !== 0) {
        fadeInHighRes(); // If already loaded, apply the fade-in effect with the delay
      } else {
        highResImg.onload = fadeInHighRes; // If not loaded, wait for the onload event
      }
    });
  };
  loadHighResImages();

  //set all button hover text to the same values
  const updateButtonText = function () {
    $(".nav-link, .nav-contact, .modal-trigger-button").hover(function () {
      let textOne = $(this).find(".button-text-move").eq(0).text();
      $(this).find(".button-text-move.is-second").text(textOne);
    });
    $(".button").hover(function () {
      let textOne = $(this).find(".button-text-move").eq(0).text();
      $(this).find(".button-text-move.is-second").text(textOne);
    });
  };
  updateButtonText();

  //Code for opening and closing Contact Modal //
  const contactModal = function () {
    let modalTimeline = gsap.timeline({ paused: true });
    //create gsap timeline
    modalTimeline
      .set(".contact-modal", { display: "block" }) // Ensure modal is displayed before animation starts
      .from(".contact-modal_bg", { opacity: 0, duration: 0.5 }, 0) // Animate background
      .from(
        ".contact-modal_card",
        {
          y: "10rem",
          scale: 0.9,
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
        },
        0
      ) // Animate card
      .addPause() // Add a pause to the timeline to prevent auto-reverse
      .to(".contact-modal_bg", { opacity: 0, duration: 0.5 }, "+=0") // Reverse background animation
      .to(
        ".contact-modal_card",
        {
          y: "10rem",
          scale: 0.9,
          opacity: 0,
          duration: 0.5,
          ease: "power1.in",
        },
        "-=0.5"
      ) // Reverse card animation
      .set(".contact-modal", { display: "none" }); // Hide modal after reverse animation

    // Event listener for opening triggers
    document.querySelectorAll("[data-contact-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (lenis) {
          lenis.stop();
        } // Disable Lenis smooth scrolling
        modalTimeline.play(0); // Play from start
      });
    });

    // Event listener for closing triggers
    document.querySelectorAll("[data-contact-close]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (lenis) {
          lenis.start();
        } // Re-enable Lenis smooth scrolling
        modalTimeline.reverse(); // Reverse the animation
      });
    });
  };
  contactModal();

  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: "(max-width: 767px)",
        isTablet: "(min-width: 768px)  and (max-width: 991px)",
        isDesktop: "(min-width: 992px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } =
          gsapContext.conditions;
        //functional interactions

        //conditional interactions
        if (!reduceMotion) {
          // oldScrollIn();
          scrollIn(gsapContext);
        }
        if (isDesktop) {
          cursor(gsapContext);
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = "[data-ix-reset]";
    //time option
    const RESET_TIME = "data-ix-reset-time";
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener("click", function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();
});

// Page Transition Code
/*
// On page load
let nextPageLink;
$(".content-wrapper").addClass("first");

// On link click - Update for all selectors
$(
  ".nav-link:not(.w--current), .button, .card-projects, .home-news-card, .footer-link, .news-gallery-link, .global-nav_logo-link, .bc-item, .next_text-link, .next_img-link"
).on("click", function (e) {
  e.preventDefault();
  nextPageLink = $(this).attr("href");
  $.ajax({
    url: nextPageLink,
    success: function (response) {
      let element = $(response).find(".content-wrapper").addClass("second");
      $(".main-wrapper").append(element);
    },
    complete: function () {
      pageTransition();
    },
  });
});

function pageTransition() {
  $("html").addClass("animating");
  let tl = gsap.timeline({
    paused: false,
    onComplete: updatePage,
  });
  tl.from(".content-wrapper.second", {
    y: "100vh",
    delay: 0.2,
    duration: 0.8, //0.8
    ease: "power2.out",
    borderRadius: "10rem",
  });
  tl.to(
    ".overlay-transition",
    {
      opacity: 1,
      duration: 0.3, //0.3
      ease: "power1.out",
    },
    0
  );
  tl.to(
    ".content-wrapper.first",
    {
      scale: 0.95,
      duration: 0.3, //0.3
      ease: "power1.out",
      borderRadius: "4rem",
    },
    0
  );
}

function updatePage() {
  window.location = nextPageLink;
}

const updateCurrentClass = function (){
  // Update for all selectors
  $(
    ".nav-link, .button, .card-projects, .home-news-card, .text-link, .news-gallery-link, .global-nav_logo-link, .bc-item, .next_text-link, .text_img-link"
  ).removeClass("w--current");
  $(
    ".nav-link, .button, .card-projects, .home-news-card, .footer-link, .news-gallery-link, .global-nav_logo-link, .bc-item, .next_text-link, .next_img-link"
  ).each(function () {
    if ($(this).attr("href") === window.location.pathname) {
      $(this).addClass("w--current");
    }
  });
}
updateCurrentClass()
*/

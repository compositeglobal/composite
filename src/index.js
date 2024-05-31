import SplitType from "split-type";
import Lenis from "lenis";
import imagesLoaded from "imagesloaded";
import { attr, runSplit } from "./utilities";

////////////////////////
//Page Load & Transition
const pageLoadandTransition = function () {
  //Constants
  const COOKIE = "page-visited";
  // Selectors - Load
  const LOAD_WRAP = '[data-page-load="wrap"]';
  const LOAD_LOGO_FRONT = '[data-page-load="logo-front"]';
  const LOAD_LOGO_WRAP = '[data-page-load="logo-wrap"]';
  const LOAD_BG = '[data-page-load="background"]';
  //Selectors - Transition
  const TRANSITION_WRAP = '[data-page-transition="wrap"]';
  const TRANSITION_BG = '[data-page-transition="background"]';
  const TRANSITION_CLOUD_1 = '[data-page-transition="cloud-1"]';
  const TRANSITION_CLOUD_2 = '[data-page-transition="cloud-2"]';
  //Selectors - Page Elements

  const MAIN_WRAP = ".main-wrapper";
  const NAV = '[data-page="nav"]';
  //Options
  // if '[data-transition="false"]' then prevent the transition
  const EXCLUDE = "data-transition";

  //Get Elements
  const loadWrap = document.querySelector(LOAD_WRAP);
  const loadLogoFront = document.querySelector(LOAD_LOGO_FRONT);
  const loadLogoWrap = document.querySelector(LOAD_LOGO_WRAP);
  const loadBackground = document.querySelector(LOAD_BG);
  const body = document.querySelector("body");
  const contentWrap = document.querySelector(MAIN_WRAP);
  const nav = document.querySelector(NAV);

  if (
    !loadWrap ||
    !loadLogoFront ||
    !loadLogoWrap ||
    !loadBackground ||
    !contentWrap
  )
    return;

  const transitionWrap = document.querySelector(TRANSITION_WRAP);
  const transitionBackground = document.querySelector(TRANSITION_BG);
  const transitionCloud1 = document.querySelector(TRANSITION_CLOUD_1);
  const transitionCloud2 = document.querySelector(TRANSITION_CLOUD_2);
  if (
    !transitionWrap ||
    !transitionBackground ||
    !transitionCloud1 ||
    !transitionCloud2
  )
    return;

  const pageTransition = function () {
    const loadAnimation = function () {
      //timeline
      const tlLoad = gsap.timeline({
        defaults: {
          ease: "power1.inOut",
        },
      });
      //tweens
      tlLoad.to(transitionBackground, { opacity: 0, duration: 0.6 });
      tlLoad.to(
        transitionCloud1,
        { xPercent: -100, scale: 0.8, opacity: 0, duration: 2 },
        "<.2"
      );
      tlLoad.to(
        transitionCloud2,
        { xPercent: 100, scale: 0.8, opacity: 0, duration: 2 },
        "<.2"
      );
      tlLoad.set(transitionWrap, { display: "none" });
      tlLoad.set("body", { overflow: "visible" });
    };
    const clickAnimation = function (linkURL) {
      //timeline
      const tlClick = gsap.timeline({
        paused: false,
        defaults: {
          ease: "power1.inOut",
        },
        onComplete: () =>
          setTimeout(() => {
            window.location.href = linkURL;
          }, 100),
      });
      //tweens
      tlClick.set(transitionWrap, { display: "flex" });
      tlClick.fromTo(
        transitionCloud1,
        { xPercent: -100, scale: 0.8, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: 1.2 }
      );
      tlClick.fromTo(
        transitionCloud2,
        { xPercent: 100, scale: 0.8, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: 1.2 },
        "<"
      );
      tlClick.fromTo(
        transitionBackground,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=.8"
      );
      return tlClick;
    };

    // Page load animation
    //check if site has been visited, if it run the load in animation
    if (sessionStorage.getItem(COOKIE) !== null) {
      loadAnimation();
    }

    const checkLink = function (link) {
      if (!link || link.tagName !== "A") {
        // If the argument is not a link element, return false
        return false;
      }
      // get the attributes from the link
      const hostname = link.hostname;
      const target = link.target;
      const href = link.getAttribute("href");
      //check the link for a prevent transition attribute.
      const playTransition = attr(true, link.getAttribute(EXCLUDE));
      // link doesn't have prevent transition attribute, link is for the current site, link isn't an anchor, link doesn't open in new tab
      if (
        !hostname ||
        hostname !== window.location.hostname ||
        (target && target === "_blank") ||
        !href ||
        href.includes("#") ||
        !playTransition
      ) {
        return false;
      } else {
        return true;
      }
    };

    // Link click event listener
    document.querySelectorAll("a").forEach((link) => {
      //get the link url
      const linkURL = link.getAttribute("href");
      // check if the link should play the transition, requirements:
      const playTransition = checkLink(link);
      //conditionally play the transition
      if (playTransition) {
        // add event listener for link click
        link.addEventListener("click", function (e) {
          e.preventDefault();
          console.log(linkURL);
          //turn on if using lenis to prevent scrolling during the transition.
          //lenis.stop()
          //gsap timeline
          clickAnimation(linkURL);
        });
      }
    });

    // Prevents back button bug on safari
    window.onpageshow = function (event) {
      if (event.persisted) window.location.reload();
    };
  };
  pageTransition();

  const pageLoad = function () {
    //prevent scrolling
    body.style.overflow = "hidden";
    //check if site has been visited, if it has set cookie
    if (sessionStorage.getItem(COOKIE) === null) {
      // item is set set visited to true
      sessionStorage.setItem(COOKIE, "true");
      //show transition wrap
      transitionWrap.style.display = "none";
    } else {
      //hide load wrap
      loadWrap.style.display = "none";
      //show transition wrap
      transitionWrap.style.display = "flex";
      return;
    }

    //timeline while page is loading
    const tlLoading = gsap.timeline({ paused: true });
    //tweens
    tlLoading.set(loadWrap, { display: "flex" });
    tlLoading.set(loadBackground, { display: "flex" });
    tlLoading.set(loadLogoFront, { opacity: 1 });
    tlLoading.fromTo(
      loadLogoFront,
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "linear",
        duration: 1,
      }
    );
    //timeline to show page once loaded
    const tlLoaded = gsap.timeline({ paused: true, delay: 0.1 });
    tlLoaded.set(loadBackground, { display: "none" });
    tlLoaded.fromTo(
      loadLogoWrap,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.4,
      }
    );
    tlLoaded.fromTo(
      contentWrap,
      { y: "100vh", scale: 0.8, borderRadius: "40vw 40vw 0vw 0vw" },
      {
        y: "0vh",
        scale: 1,
        borderRadius: "0vw 0vw 0vw 0vw",
        ease: "power1.inOut",
        duration: 1,
      },
      "<"
    );
    tlLoaded.fromTo(
      nav,
      { opacity: 0, y: "-50%" },
      {
        opacity: 1,
        y: "0%",
        ease: "power2.out",
        duration: 0.4,
      },
      "-=.4"
    );
    tlLoaded.set(loadWrap, { display: "none" });
    tlLoaded.set("body", { overflow: "visible" });

    //checking for images loaded
    const start = performance.now();
    const imgLoad = new imagesLoaded(
      "body",
      { background: true },
      onImagesLoaded
    );
    //get the number of images
    const numImages = imgLoad.images.length;

    //function to handle image load progress
    imgLoad.on("progress", function (instance, image) {
      var result = image.isLoaded ? "loaded" : "broken";
      //log the amount of images loaded
      // console.log(
      //   `image ${instance.progressedCount} out of ${numImages} is ${result}`
      // );
      const progress = instance.progressedCount / numImages;
      //update loading progress
      tlLoading.progress(progress);
    });

    //function to run when images have loaded
    function onImagesLoaded() {
      const end = performance.now();
      // Calculate remaining time to ensure loader is displayed for a minimum time
      const MIN_TIME = 800;
      const duration = end - start;
      const remainingTime = Math.max(MIN_TIME - duration, 0);

      //after remaining time play loaded animation
      setTimeout(() => {
        tlLoaded.play();
      }, remainingTime);
    }
  };
  pageLoad();
};
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

  const oldScrollIn = function () {
    // Split text into spans
    let typeSplit = new SplitType("[text-split]", {
      types: "words, chars",
      tagName: "span",
    });

    function createScrollTrigger(triggerElement, timeline) {
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top bottom",
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        },
      });
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 80%",
        onEnter: () => timeline.play(),
      });
    }

    $("[scrub-each-word]").each(function (index) {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top 95%",
          end: "top center",
          scrub: true,
        },
      });
      tl.from($(this).find(".word"), {
        opacity: 0.2,
        duration: 0.2,
        ease: "power1.out",
        stagger: { each: 0.4 },
      });
    });

    $("[letters-slide-up]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        yPercent: 100,
        opacity: 0.2,
        duration: 0.3,
        ease: "power1.out",
        stagger: { amount: 0.2 },
      });
      createScrollTrigger($(this), tl);
    });

    $("[letters-fade-in-random]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: { amount: 0.4, from: "random" },
      });
      createScrollTrigger($(this), tl);
    });

    $("[words-fade-in-random]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".word"), {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: { amount: 0.4, from: "random" },
      });
      createScrollTrigger($(this), tl);
    });

    $("[words-slide-up]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".word"), {
        opacity: 0,
        yPercent: 100,
        duration: 0.5,
        ease: "power1.out",
        stagger: { amount: 0.2 },
      });
      createScrollTrigger($(this), tl);
    });

    // Avoid flash of unstyled content
    gsap.set("[text-split]", { opacity: 1 });
  };

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
        if (!reduceMotion && isDesktop) {
          oldScrollIn();
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

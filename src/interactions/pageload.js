import { attr, runSplit } from "../utilities";
import imagesLoaded from "imagesloaded";

export const pageLoadandTransition = function () {
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
  //////////////////
  //Page transition
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

  const pageLoadAnimation = function () {
    // hero animation attribute
    const ATTRIBUTE = "data-load";
    // hero animation selectors
    const TITLE = "title";
    const ITEM = "item";

    const items = document.querySelectorAll(`[${ATTRIBUTE}="${ITEM}"]`);
    const title = document.querySelector(`[${ATTRIBUTE}="${TITLE}"]`);
    if (!title || items.length === 0) return;

    const splitText = runSplit(title, "lines, words, chars");
    if (!splitText) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power1.out",
        duration: 0.6,
      },
    });
    tl.set(title, { opacity: 1 });
    tl.fromTo(title, { scale: 1.2 }, { scale: 1 });
    tl.fromTo(
      splitText.words,
      { opacity: 0 },
      { opacity: 1, stagger: { each: 0.1, from: "random" } },
      "<"
    );
    tl.fromTo(
      items,
      { opacity: 0, y: "2rem" },
      { opacity: 1, y: "0rem", stagger: { each: 0.2, from: "start" } },
      "<.3"
    );
    return tl;
  };
  const heroAnimation = pageLoadAnimation();

  const pageTransition = function () {
    const loadAnimation = function () {
      //timeline
      const tlLoad = gsap.timeline({
        defaults: {
          ease: "power1.inOut",
        },
        // onComplete: () => heroAnimation.play(),
      });

      //tweens
      tlLoad.set(transitionCloud1, { opacity: 0 });
      tlLoad.set(transitionCloud2, { opacity: 0 });
      tlLoad.to(transitionBackground, { opacity: 0, duration: 0.8 });

      // tlLoad.to(
      //   transitionCloud1,
      //   { xPercent: -10, scale: 2, opacity: 0, duration: 1.2 },
      //   "<.2"
      // );
      // tlLoad.to(
      //   transitionCloud2,
      //   { xPercent: 10, scale: 2, opacity: 0, duration: 1.2 },
      //   "<"
      // );
      tlLoad.set(transitionWrap, { display: "none" });
      tlLoad.set("body", { overflow: "visible" });
      //play hero animation just before load animation finishes
      tlLoad.eventCallback("onStart", () => {
        const duration = (tlLoad.duration() - 0.2) * 1000;
        setTimeout(() => {
          heroAnimation.play();
        }, duration);
      });
    };
    const clickAnimation = function (linkURL) {
      //timeline
      const tlClick = gsap.timeline({
        paused: false,
        defaults: {
          ease: "power2.inOut",
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
        { xPercent: -15, scale: 2, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: 1.2 }
      );
      tlClick.fromTo(
        transitionCloud2,
        { xPercent: 25, yPercent: 25, scale: 2, opacity: 0 },
        { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, duration: 1 },
        "<.2"
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
    tlLoading.set(loadLogoWrap, { display: "flex" });
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
    const tlLoaded = gsap.timeline({
      paused: true,
      delay: 0.1,
      onComplete: () => heroAnimation.play(),
    });
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

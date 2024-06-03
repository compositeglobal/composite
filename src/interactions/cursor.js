import { attr, checkBreakpoints } from "../utilities";

/*
CSS to include
can also use pointer to check for non fine pointers
@media not all and (pointer: fine) {

@media (hover: none) {
 .cursor {
    pointer-events: none;
    display: none;
  }
}
*/

export const cursor = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = "cursor";
  //constants
  const HOVER_CLASS = "is-active";
  const DEFAULT_TEXT = "view-page";

  //cursor elements
  const WRAP = '[data-cursor="wrap"]';
  const INNER = '[data-cursor="inner"]';
  const CURSOR_TEXT = '[data-cursor="text"]';
  const CURSOR_TEXT_CONTENT = '[data-cursor="text-content"]';
  const CURSOR_DRAG = '[data-cursor="drag"]';
  //trigger elements
  const HOVER_TEXT = "[data-cursor-text]";
  const HOVER_TEXT_ATTR = "data-cursor-text";
  const HOVER_DRAG = "[data-cursor-drag]";
  // select the items
  const cursorWrap = document.querySelector(WRAP);
  const cursorInner = document.querySelector(INNER);
  const cursorTextContent = document.querySelector(CURSOR_TEXT_CONTENT);
  const cursorText = document.querySelector(CURSOR_TEXT);
  const cursorDrag = document.querySelector(CURSOR_DRAG);

  // return if items are null
  if (!cursorWrap || !cursorInner) return;
  //check if the device has a touch screen
  if ("ontouchstart" in window || navigator.maxTouchPoints) return;

  //check breakpoints and quit function if set on specific breakpoints
  let runOnBreakpoint = checkBreakpoints(cursorWrap, ANIMATION_ID, gsapContext);
  if (runOnBreakpoint === false) return;

  const cursorHover = function () {
    //Get text hover elements
    const textHoverElements = gsap.utils.toArray(HOVER_TEXT);
    textHoverElements.forEach((item) => {
      if (!item || !cursorText) return;
      //get custom text or set to default text
      const itemText = attr(DEFAULT_TEXT, item.getAttribute(HOVER_TEXT_ATTR));
      //event listeners
      item.addEventListener("mouseover", function (e) {
        cursorTextContent.textContent = itemText;
        cursorText.classList.add(HOVER_CLASS);
      });
      item.addEventListener("mouseleave", function (e) {
        cursorText.classList.remove(HOVER_CLASS);
      });
    });

    //Get text hover elements
    const dragHoverElements = gsap.utils.toArray(HOVER_DRAG);
    dragHoverElements.forEach((item) => {
      if (!item || !cursorDrag) return;
      item.addEventListener("mouseover", function (e) {
        cursorDrag.classList.add(HOVER_CLASS);
      });
      item.addEventListener("mouseleave", function (e) {
        cursorDrag.classList.remove(HOVER_CLASS);
      });
    });
  };
  cursorHover();
  //click interaction
  //   const cursorClick = function () {
  //     if (!cursorDot) return;
  //     document.addEventListener("click", function (e) {
  //       let tl = gsap.timeline({});
  //       tl.fromTo(
  //         cursorDot,
  //         { rotateZ: -45 },
  //         { rotateZ: 45, ease: "power1.out", duration: 0.3 }
  //       );
  //     });
  //   };
  //   cursorClick();

  //handle cursor movement
  const cursorMove = function () {
    // object that stores the value of the progress so it can be animated
    let progressObject = { x: 0, y: 0 };

    // Create X timeline
    let cursorXTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: "none" },
    });
    cursorXTimeline.fromTo(cursorInner, { x: "-50vw" }, { x: "50vw" });
    // Create Y Timeline
    let cursorYTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: "none" },
    });
    cursorYTimeline.fromTo(cursorInner, { y: "-50vh" }, { y: "50vh" });

    // Function to update timeline progress based on an inputted value
    function setTimelineProgress(xValue, yValue) {
      // animate the timeline progress value and keep the timeline in sync onUpdate
      gsap.to(progressObject, {
        x: xValue,
        y: yValue,
        ease: "none",
        duration: 0,
        onUpdate: () => {
          cursorXTimeline.progress(progressObject.x);
          cursorYTimeline.progress(progressObject.y);
        },
      });
      // an alternate option if you want the timeline progress to jump immediately without easing (will be choppier)
      // tl.progress(progressValue)
    }

    // Mouse events
    document.addEventListener("mousemove", function (e) {
      // getting the horizontal and vertical positions of the mouse and dividing it by the total screen width
      let mousePercentX = e.clientX / window.innerWidth;
      let mousePercentY = e.clientY / window.innerHeight;
      // call function to animate the timeline progress
      setTimelineProgress(mousePercentX, mousePercentY);
    });
  };
  cursorMove();
};

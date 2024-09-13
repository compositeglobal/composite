import { attr, runSplit, checkBreakpoints } from "../utilities";

export const scrollIn = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = "scrollin";
  // selectors
  const ATTRIBUTE = "data-scrollin";
  // types of scrolling elements (value for scrollin element attribute)
  const HEADING = "heading";
  const SUBHEADING = "subheading";
  const ITEM = "item";
  const CONTAINER = "container";
  const STAGGER = "stagger";
  const RICH_TEXT = "rich-text";
  const IMAGE_WRAP = "image-wrap";
  const IMAGE = "image";
  const LINE = "line";

  //options
  const SCROLL_START = "data-scrollin-start";
  const SCROLL_END = "data-scrollin-end";
  const SCROLL_STAGGER_X = "data-scrollin-stagger-x";
  const CLIP_DIRECTION = "data-scrollin-direction";

  //resuable timeline creation with option attributes for individual customization per element
  const scrollInTL = function (item, options = {}) {
    // default GSAP options
    const settings = {
      start: "top 90%",
      end: "top 60%",
    };
    if (options.scrub !== true) {
      settings.toggleActions = "play none none none";
    } else {
      settings.scrub = true;
    }

    //override settings if an attribute is present and a valid type.
    settings.start = attr(settings.start, item.getAttribute(SCROLL_START));
    settings.end = attr(settings.end, item.getAttribute(SCROLL_END));
    const tl = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: "power1.out",
      },
      scrollTrigger: {
        trigger: item,
        start: settings.start,
        end: settings.end,
        toggleActions: settings.toggleActions,
        scrub: settings.scrub,
      },
    });
    return tl;
  };

  //resuable timeline creation with option attributes for individual customization per element
  const defaultTween = function (item, tl, options = {}) {
    const varsFrom = {
      opacity: 0,
      y: "2rem",
    };
    const varsTo = {
      opacity: 1,
      y: "0rem",
    };
    //optional adjustments to the tween
    // {stagger: large}
    if (options.stagger === true) {
      varsTo.stagger = { each: 0.1, from: "start" };
    }
    // putting tween together
    const tween = tl.fromTo(item, varsFrom, varsTo);
    return tween;
  };

  const scrollInHeading = function (item) {
    //split the text
    const splitText = runSplit(item, "lines, words, chars");
    if (!splitText) return;
    //set heading to full opacity (check to see if needed)
    // item.style.opacity = 1;
    const tl = scrollInTL(item);
    tl.fromTo(
      splitText.chars,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "power1.out",
        stagger: { amount: 0.4, from: "random" },
      }
    );
    //add event calleback to revert text on completion
    tl.eventCallback("onComplete", () => {
      // splitText.revert();
    });
  };

  const scrollInSubHeading = function (item) {
    //split the text
    const splitText = runSplit(item);
    if (!splitText) return;
    //set heading to full opacity (check to see if needed)
    // item.style.opacity = 1;
    const tl = scrollInTL(item, { scrub: true });
    tl.fromTo(
      splitText.words,
      {
        opacity: 0.2,
      },
      {
        opacity: 1,
        ease: "power1.out",
        stagger: { each: 0.4 },
      }
    );
  };

  const scrollInItem = function (item) {
    if (!item) return;
    const tl = scrollInTL(item);
    const tween = defaultTween(item, tl);
  };

  //utility function to get the clipping direction of items (horizontal or vertical only)
  const getCLipStart = function (item) {
    //set defautl direction
    let defaultDirection = "top";
    let clipStart;
    //get the clip direction
    const direction = attr(defaultDirection, item.getAttribute(CLIP_DIRECTION));
    const clipDirections = {
      left: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      right: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      top: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      bottom: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    };
    //check for each possible direction and map it to the correct clipping value
    if (direction === "left") {
      clipStart = clipDirections.left;
    }
    if (direction === "right") {
      clipStart = clipDirections.right;
    }
    if (direction === "top") {
      clipStart = clipDirections.top;
    }
    if (direction === "bottom") {
      clipStart = clipDirections.bottom;
    }
    return clipStart;
  };

  const scrollInImage = function (item) {
    //item is the image wrap for this animation
    if (!item) return;
    //set clip path directions
    //create timeline
    const tl = scrollInTL(item);
    tl.fromTo(
      item,
      {
        filter: "blur(32px)",
      },
      {
        filter: "blur(0px)",
        duration: 0.6,
      }
    );
  };
  // OLD VERSION
  // const scrollInImage = function (item) {
  //   //item is the image wrap for this animation
  //   if (!item) return;
  //   //set clip path directions
  //   const clipStart = getCLipStart(item);
  //   const clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  //   //create timeline
  //   const tl = scrollInTL(item);
  //   tl.fromTo(
  //     item,
  //     {
  //       clipPath: clipStart,
  //     },
  //     {
  //       clipPath: clipEnd,
  //       duration: 1,
  //     }
  //   );
  // };

  const scrollInLine = function (item) {
    if (!item) return;
    //set clip path directions
    const clipStart = getCLipStart(item);
    const clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    //create timeline
    const tl = scrollInTL(item);
    tl.fromTo(
      item,
      {
        clipPath: clipStart,
      },
      {
        clipPath: clipEnd,
      }
    );
  };

  const scrollInContainer = function (item) {
    if (!item) return;
    //get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    children.forEach((child) => {
      const tl = scrollInTL(child);
      const tween = defaultTween(child, tl);
    });
  };

  const scrollInStagger = function (item) {
    if (!item) return;

    // get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    const tl = scrollInTL(item);
    const tween = defaultTween(children, tl, { stagger: true });
  };

  const scrollInRichText = function (item) {
    if (!item) return;
    //get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    children.forEach((child) => {
      const childTag = child.tagName;
      //apply the items animation based on the child type
      if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(childTag)) {
        scrollInHeading(child);
      }
      if (childTag === "FIGURE") {
        scrollInImage(child);
      } else {
        scrollInItem(child);
      }
    });
  };

  //get all elements and apply animations
  const items = gsap.utils.toArray(`[${ATTRIBUTE}]`);
  items.forEach((item) => {
    if (!item) return;
    //check breakpoints and quit function if set on specific breakpoints
    let runOnBreakpoint = checkBreakpoints(item, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false) return;
    //find the type of the scrolling animation and apply it to the element
    const scrollInType = item.getAttribute(ATTRIBUTE);
    if (scrollInType === HEADING) {
      scrollInHeading(item);
    }
    if (scrollInType === SUBHEADING) {
      scrollInSubHeading(item);
    }
    if (scrollInType === ITEM) {
      scrollInItem(item);
    }
    if (scrollInType === IMAGE) {
      scrollInImage(item);
    }
    if (scrollInType === LINE) {
      scrollInLine(item);
    }
    if (scrollInType === CONTAINER) {
      scrollInContainer(item);
    }
    if (scrollInType === STAGGER) {
      scrollInStagger(item);
    }
    if (scrollInType === RICH_TEXT) {
      scrollInRichText(item);
    }
  });
};

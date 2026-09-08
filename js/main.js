/* GLOBAL VARS */
const feed = IVD.feed;
const size = DFX.size;

// BUILD AD | INIT //////////////////
function init() {
  const nodes = DFX.getNodes();
  nodes.ad.classList.add(`_${size}`);

  // Dynamic image map
  const imageMap = {
    background: `./${feed.background}-${size}.jpg`,
  };
  DFX.setDynamicContent(imageMap);

  // Auto text resizing
  nodes.ad.querySelectorAll('[resize]').forEach(tf => DFX.resize(tf));

  // Click events
  DFX.bindClick(nodes.clicktag, "clicktag");
  DFX.bindClick(nodes.ctaButton, "clicktag");

  // Animation shortcuts
  const p = DFX.anim;
  // const fadeInAd = (tl) => tl.add(p.fadeIn(nodes.ad, 0.25));

  // Initial states
  gsap.set("#overlay", { opacity: 1 });
  gsap.set("#logo", { opacity: 0 });
  gsap.set("#bar", { opacity: 0 });
  gsap.set("#headline", { opacity: 0 });
  gsap.set("#headline2", { opacity: 0 });
  gsap.set("#headline3", { opacity: 0 });
  gsap.set("#cta", { opacity: 0 });
  
  
  // Set initial state for Emoji and ALL 5 Hearts
  const iconTargets = ["#emoji1", "#heart1", "#heart2", "#heart3", "#heart4", "#heart5"];
  gsap.set(iconTargets, { scale: 0, transformOrigin: "center center" });

  //////////////////////////////////////////////////////
  // 1. BACKGROUND TIMELINE
  //////////////////////////////////////////////////////
  function getBgTl() {
    const tl = gsap.timeline();
    
    // Add the main fade in of the ad container here
    // fadeInAd(tl);

    tl.from("#bg", {
      x: 0,
      duration: 4,
      ease: "power4.out"
    });

    return tl;
  }

  //////////////////////////////////////////////////////
  // 2. HEADLINE TIMELINE
  //////////////////////////////////////////////////////
  function getTextTl() {
    const tl = gsap.timeline();


tl.to("#logo", { opacity: 1, duration: 0.5 })
    .to("#bar", { opacity: 1, duration: 0.5 })
    
    // 1. Fade in Headline 1
    .to("#headline", { opacity: 1, duration: 0.5 })

  return tl;
}

  //////////////////////////////////////////////////////
  // 3. EMOJI & HEARTS TIMELINE (Applied to all 6 items)
  //////////////////////////////////////////////////////
  function getIconsTl() {
    const tl = gsap.timeline();
    // Array of all items to animate
    const items = ["#heart1", "#emoji1", "#heart2", "#heart3", "#heart4", "#heart5"];

    // Loop through each item to create its specific sequence
    items.forEach((item, index) => {
      const nestedTl = gsap.timeline();

      // 1. Pop in
      nestedTl.fromTo(item, 
        { scale: 0 }, 
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      )
      // 2. Wiggle
      .to(item, {
        rotation: 12,
        duration: 0.12,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut"
      })
      // 3. Shoot up + fade
      .to(item, {
        y: "-=200",
        opacity: 0,
        duration: 0.35,
        ease: "power4.in"
      })
      // 4. Return to original position
      .to(item, {
        y: "0",
        duration: .1
      })
         // 5. Appear in original position
      .to(item, {
        opacity: 1,
        duration: 0.5,
        ease: "power4.in",
        delay: 1
      });

      // Add nested timeline to main icon timeline with a stagger
      // (index * 0.2) means each heart starts 0.2s after the previous one
      tl.add(nestedTl, index * 0.2);
    });

    return tl;
  }

  //////////////////////////////////////////////////////
  // 4. CTA TIMELINE
  //////////////////////////////////////////////////////
  function getCtaTl() {
    const tl = gsap.timeline();

    tl.to("#cta", {
      opacity: 1,
      duration: 0.5
    })
    // CTA arrow wiggle loop
    .to("#cta", {
      x: "+=8",
      duration: 0.75,
      yoyo: true,
      repeat: 19, // 1 play + 19 repeats = 20 moves. 20 * 0.75s = 15s
      ease: "power1.inOut"
    });

    return tl;
  }

  //////////////////////////////////////////////////////
  // MAIN ANIMATION CONFIG (ASSEMBLY)
  //////////////////////////////////////////////////////
  const animConfig = {
    default: (masterTl) => {
      
      // 1. Add Background
      masterTl.add(getBgTl());

      // 2. Add Text (starts 2 seconds before BG finishes, matching original logic)
      masterTl.add(getTextTl(), "-=4");

      // 3. Add Icons (Insert them relative to the start of the Text timeline)
      // Adjusting the position parameter ("<+1") controls when hearts appear relative to text
      masterTl.add(getIconsTl(), "-=1.5"); 

      // 4. Add CTA
      masterTl.add(getCtaTl(), "-=0.5");
      
    }
  };

  //////////////////////////////////////////////////////
  // RUN ANIMATION
  //////////////////////////////////////////////////////
  const tl = gsap.timeline();
  (animConfig[size] || animConfig.default)(tl);
}
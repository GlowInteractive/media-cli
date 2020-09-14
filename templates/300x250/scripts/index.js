import "./bootstrap";
import { loadLazyImgs, loadISI, getEl, getEls, log } from "@sharedScripts";
gsap.registerPlugin(MotionPathPlugin);

const TL = gsap.timeline();
TL.addLabel("start");

function initUnit() {
  const els = getEls({
    unit: ".media-unit",
    evergreen: ".evergreen",
    topiary: ".t",
    bush: ".bush1",
    bush2: ".bush3",
    branch: ".branch1",
    text1: ".c1",
    text2: ".c2",
    text3: ".c3",
    text4: ".c4",
    cl1: ".cl1",
    cl2: ".cl2",
    cl3: ".cl3",
    bird: ".bird1",
    logo: ".logo",
    f1: ".f1",
    cta: ".tmm"
  });

  loadLazyImgs();
  // Cloud movement
  TL.to(els.cl2, { x: -50, duration: 15, ease: "sine.inOut" }, "start");
  TL.to(els.cl1, { x: -60, duration: 14, ease: "sine.inOut" }, "start+=1");
  TL.to(els.cl3, { x: -80, duration: 13.5, ease: "sine.inOut" }, "start+=1.5");
  // bring in unit
  TL.to([els.f1, els.unit], { autoAlpha: 1, duration: 0.3 }, "start");
  // FRAME 1 - exit
  TL.to(
    els.text1,
    { autoAlpha: 0, x: -20, ease: "power2.in", duration: 0.85 },
    "start+=3.75"
  );
  TL.to(
    els.topiary,
    { x: -50, ease: "power2.in", autoAlpha: 0, duration: 1 },
    "start+=3.9"
  );
  //bring in bototm cloud
  TL.to(els.cl3, { opacity: 1, duration: 1 }, "start+=3.75");
  // FRAME 2 - enter
  TL.to(
    els.text2,
    { autoAlpha: 1, x: -20, ease: "power2.out", duration: 1.25 },
    "start+=5"
  );
  TL.to(
    els.bush,
    { x: -105, ease: "power2.out", duration: 1.35 },
    "start+=4.85"
  );
  TL.to(
    els.bird,
    {
      duration: 6.15,
      ease: "power2.in",
      motionPath: {
        path: "M58-18c58,7,85.6,75.1,143,74c51-1,64-49,138-49",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      }
    },
    "start+=4.75"
  );

  // FRAME 2 - exit
  TL.to(
    els.text2,
    { autoAlpha: 0, x: -40, ease: "power2.in", duration: 0.85 },
    "start+=8.45"
  );
  TL.to(
    els.bush,
    { x: -435, ease: "power2.inOut", duration: 2 },
    "start+=8.65"
  );
  TL.to(
    els.branch,
    { x: -50, ease: "power2.out", duration: 1.25 },
    "start+=9.8"
  );
  // FRAME 3 - enter
  TL.to(
    els.text3,
    {
      autoAlpha: 1,
      x: -20,
      ease: "power2.out",
      duration: 1.25
    },
    "start+=9.85"
  );

  // FRAME 3 - exit
  TL.to(
    els.text3,
    {
      autoAlpha: 0,
      x: -40,
      ease: "power2.in",
      duration: 0.85
    },
    "start+=12.5"
  );
  TL.to(
    els.bush,
    { x: -600, ease: "power2.inOut", duration: 1.5 },
    "start+=12.5"
  );
  TL.to(
    els.branch,
    { x: -291, ease: "power2.inOut", duration: 1.75 },
    "start+=12.65"
  );

  // FRAME 4 - enter
  TL.to(
    els.bush2,
    { x: -70, ease: "power2.out", duration: 1.5 },
    "start+=13.35"
  );
  TL.to(
    els.text4,
    {
      autoAlpha: 1,
      x: -20,
      ease: "power2.out",
      duration: 1.25
    },
    "start+=13.5"
  );

  TL.to(
    els.cta,
    { autoAlpha: 1, x: -20, ease: "power2.out", duration: 1.25 },
    "start+=13.75"
  );
}

function handleMediaExit() {
  TL.time(TL.totalDuration());
}

window.onload = function () {
  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      enablerInitHandler
    );
  }
};

function enablerInitHandler() {
  Enabler.addEventListener(studio.events.StudioEvent.EXIT, handleMediaExit);
  // Start polite loading, or start animation,
  // load in your image assets, call Enabler methods,
  // and/or include other Studio modules.
  loadISI("assets/isi.html");
  initUnit();
}

export default {};

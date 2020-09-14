import "./bootstrap";
import { loadLazyImgs, loadISI, getEl, getEls, log } from "@sharedScripts";
gsap.registerPlugin(MotionPathPlugin);

const TL = gsap.timeline();
TL.addLabel("start");

function initUnit() {
  loadLazyImgs();
}

function handleMediaExit() {
  TL.time(TL.totalDuration());
  Enabler.exit(window.glowMedia.EXIT);
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

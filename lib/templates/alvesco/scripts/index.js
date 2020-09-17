import "./bootstrap";
import { loadLazyImgs, loadISI, getEl, getEls, log } from "@sharedScripts";

const TL = gsap.timeline();
TL.addLabel("start");

function initUnit() {}

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
  loadLazyImgs();
  loadISI("assets/isi.html");
  initUnit();
  Enabler.addEventListener(studio.events.StudioEvent.EXIT, handleMediaExit);
}

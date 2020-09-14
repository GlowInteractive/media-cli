import "./bootstrap";

const TL = gsap.timeline();

function initUnit() {
  // do stuff
}

function handleMediaExit() {
  TL.time(TL.totalDuration());
}

document.addEventListener("trailer-video-started", initUnit);
document.addEventListener("media-exit", handleMediaExit);
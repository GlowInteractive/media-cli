import "./bootstrap";

TweenLite.defaultEase = Expo.easeOut;
const TL = gsap.timeline();

function handleStart() {}

function handleLastChapter() {}

function handleSkipToEnd() {}

function handleEnd() {}

function handleMediaExit() {
  handleSkipToEnd();
}

document.addEventListener("story-start", handleStart);
document.addEventListener("story-last-chapter", handleLastChapter);
document.addEventListener("story-skip-to-end", handleSkipToEnd);
document.addEventListener("story-end", handleEnd);
document.addEventListener("media-exit", handleMediaExit);

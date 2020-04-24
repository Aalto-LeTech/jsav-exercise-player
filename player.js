const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');

let $ = window.$;
let showClicks = false;
let initialStateDOM;
let animationSteps;
let $animationContainer = $('#animation-container');
let canvas = $animationContainer[0];

initialize();

async function initialize() {
  try {
    let submission = await getSubmission();
    if(submission && Object.keys(submission).length > 0){
      initialStateDOM = submission.initialState.animationDOM;
      animationSteps = getAnimationSteps(submission);
      canvas.innerHTML = initialStateDOM;
      initiateSlideShow(submission);
      initializeAnimation(submission);
      $('#jaal').on('click', () => showJaal(submission));
      $('#export').on('click', () => exportAnimation());
    } else {
      console.warn('No animation data received')
    }
  } catch (err) {
    console.warn(err)
  }
}

async function getSubmission() {
  try {
    const parsedUrl = new URL(window.location.href);
    const url = parsedUrl.searchParams.get("submission");
    const response = await fetch(url)
    const submission = response.json();
    return submission;
  } catch (err) {
    throw new Error(` Failed getting submission from address ${url}: ${err}`)
  }
}

function initiateSlideShow(submission) {
  try {
    var slideShow = new DOMSlideShow(initialStateDOM, animationSteps, canvas);
  } catch (err) {
    console.warn(`Error when initializing slideshow: ${err}`);
  }
  try {
    $('#to-beginning').on('click', () => slideShow.reset());
    $('#step-backward').on('click', () => slideShow.backward());
    $('#step-forward').on('click', () => slideShow.forward());
    $('#to-end').on('click', () => slideShow.toEnd());
  } catch (err) {
    console.warn(`Error when setting listeners for slideshow: ${err}`);
  }
}

function showJaal(submission) {
  const modalContent = JSON.stringify(submission, null, 2);
  useModal(modalContent);
}

function exportAnimation() {
  const iframe = `<iframe src=${window.location.href}</iframe>`
  const modalContent = `Add this iframe to an HTML document to import the animation: \n${iframe}`;
  useModal(modalContent);
}

function useModal(modalContent) {
  $("#modal-content").text(modalContent);
  const modal = $('#myModal');
  modal.css('display', 'block');
  const close = $('.close');
  close.on('click', () => modal.css('display', 'none'));
}

function initializeAnimation(submission) {
  try {
    var animation = new DOMAnimation(initialStateDOM, animationSteps, canvas);
  } catch (err) {
    console.warn(`Error when initializing animation: ${err}`);
  }
  try {
    $("#play-button").on('click', () => animation.play(1000));
    $("#pause-button").on('click', () => animation.pause());
    $("#reset-button").on('click', () => animation.reset());
  } catch (err) {
    console.warn(`Error when setting listeners for animation: ${err}`);
  }
}

function getAnimationSteps(submission) {
  try {
    var gradableSteps = submission.animation.filter(step => step.type === 'gradeable-step');
    var clickSteps = submission.animation.filter(step => step.type === 'click');
  } catch (err) {
    console.warn(` Failed getting animation steps: ${err}`);
  }
  return showClicks? clickSteps : gradableSteps;
}

module.exports = {
  initialize
}

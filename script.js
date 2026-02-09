const dot = document.getElementById('dot');
const counter = document.getElementById('counter');
const donate = document.getElementById('donate');
const startButton = document.getElementById('start-button');

let taps = 0;
let misses = 0;
let gameActive = false;
const gameElements = [dot, counter, donate];

function setGameActive(active) {
  gameActive = active;
  gameElements.forEach((element) => {
    element.classList.toggle('hidden', !active);
  });
  startButton.classList.toggle('hidden', active);

  if (active) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';
    resetDot();
  }
}

// Punkt bewegen
function moveDot() {
  const padding = 10;
  const donateRect = donate.getBoundingClientRect();
  const counterRect = counter.getBoundingClientRect();
  const dotSize = dot.offsetWidth;
  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, window.innerWidth - dotSize - padding);
  const maxY = Math.max(minY, window.innerHeight - dotSize - padding);

  let newX = minX;
  let newY = minY;

  const overlapsRect = (rectA, rectB) => !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );

  for (let attempt = 0; attempt < 25; attempt++) {
    const candidateX = Math.random() * (maxX - minX) + minX;
    const candidateY = Math.random() * (maxY - minY) + minY;
    const dotRect = {
      left: candidateX,
      right: candidateX + dotSize,
      top: candidateY,
      bottom: candidateY + dotSize
    };

    const overlapsDonate = overlapsRect(dotRect, donateRect);
    const overlapsCounter = overlapsRect(dotRect, counterRect);

    newX = candidateX;
    newY = candidateY;

    if (!overlapsDonate && !overlapsCounter) break;
  }

  dot.style.left = newX + 'px';
  dot.style.top = newY + 'px';
}

function getCenteredPosition() {
  const dotSize = dot.offsetWidth;
  const left = (window.innerWidth - dotSize) / 2;
  const top = (window.innerHeight - dotSize) / 2;

  return {
    left: `${left}px`,
    top: `${top}px`
  };
}

function resetDot() {
  const centeredPosition = getCenteredPosition();
  dot.style.left = centeredPosition.left;
  dot.style.top = centeredPosition.top;
}

// Treffer
function hitDot() {
  taps++;
  counter.textContent = 'Taps: ' + taps;
  moveDot();
}

// Alles prüfen (Treffer / Fehlklick)
function handleTap(event) {
  if (!gameActive) return;

  const target = event.target;

  if (target === dot) {
    hitDot();
    return;
  }

  if (target === donate) return;

  misses++;

  if (misses >= 5) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';
    resetDot();
  }
}

//Nur EIN Event registrieren (keine Doppelzählung!)
const isTouchDevice = 'ontouchstart' in window;

document.addEventListener(
  isTouchDevice ? 'touchstart' : 'click',
  handleTap
);

window.addEventListener('resize', () => {
  if (gameActive) {
    moveDot();
  }
});

startButton.addEventListener('click', () => {
  setGameActive(true);
});

setGameActive(false);

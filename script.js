const dot = document.getElementById('dot');
const counter = document.getElementById('counter');
const donate = document.getElementById('donate');

let taps = 0;
let misses = 0;

// Punkt bewegen
function moveDot() {
  const padding = 10;

  const donateWidth = donate.offsetWidth + 20;
  const donateHeight = donate.offsetHeight + 20;

  const maxX = window.innerWidth - dot.offsetWidth - donateWidth - padding;
  const maxY = window.innerHeight - dot.offsetHeight - donateHeight - padding;

  const newX = Math.random() * maxX + padding;
  const newY = Math.random() * maxY + padding;

  dot.style.left = newX + 'px';
  dot.style.top = newY + 'px';
}

// Treffer
function hitDot() {
  taps++;
  counter.textContent = 'Taps: ' + taps;
  moveDot();
}

// Alles prüfen (Treffer / Fehlklick)
function handleTap(event) {
  const target = event.target;

  if (target === dot) {
    hitDot();
    return;
  }

  if (target === donate) return;

  misses++;

  if (misses >= 5) {
    // Reset Zähler
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';

    // Punkt wieder in Ausgangslage (Mitte des Bildschirms)
    dot.style.left = (window.innerWidth / 2 - dot.offsetWidth / 2) + 'px';
    dot.style.top = (window.innerHeight / 2 - dot.offsetHeight / 2) + 'px';
}
  }
}

// Nur EIN Event registrieren (keine Doppelzählung!)
const isTouchDevice = 'ontouchstart' in window;

document.addEventListener(
  isTouchDevice ? 'touchstart' : 'click',
  handleTap
);

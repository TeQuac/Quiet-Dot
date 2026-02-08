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

// Fehlklick Reset
function checkMiss() {
  misses++;
  if (misses >= 5) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';

    // Punkt wieder mittig setzen
    const padding = 10;
    const donateWidth = donate.offsetWidth + 20;
    const donateHeight = donate.offsetHeight + 20;

    const centerX = Math.min(window.innerWidth / 2 - dot.offsetWidth / 2, window.innerWidth - dot.offsetWidth - donateWidth - padding);
    const centerY = Math.min(window.innerHeight / 2 - dot.offsetHeight / 2, window.innerHeight - dot.offsetHeight - donateHeight - padding);

    dot.style.left = centerX + 'px';
    dot.style.top = centerY + 'px';
  }
}

// --- Event Listener ---
// Punkt trifft
dot.addEventListener('click', hitDot);
dot.addEventListener('touchstart', hitDot);

// Hintergrund Fehlklick (weiß + ignoriert Donate)
document.body.addEventListener('click', (e) => {
  if (e.target !== dot && e.target !== donate) checkMiss();
});
document.body.addEventListener('touchstart', (e) => {
  if (e.target !== dot && e.target !== donate) checkMiss();
});

// Initialposition beim Laden
window.addEventListener('load', moveDot);

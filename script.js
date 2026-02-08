const dot = document.getElementById('dot');
const counter = document.getElementById('counter');
const donate = document.getElementById('donate');

let taps = 0;
let misses = 0; // unsichtbarer Fehlklick-Zähler

function moveDot(event) {
  event.stopPropagation(); // verhindert Fehlklick-Zählung

  const padding = 10;

  const donateWidth = donate.offsetWidth + 20;
  const donateHeight = donate.offsetHeight + 20;

  const maxX = window.innerWidth - dot.offsetWidth - donateWidth - padding;
  const maxY = window.innerHeight - dot.offsetHeight - donateHeight - padding;

  const newX = Math.random() * maxX + padding;
  const newY = Math.random() * maxY + padding;

  dot.style.left = newX + 'px';
  dot.style.top = newY + 'px';

  taps++;
  counter.textContent = 'Taps: ' + taps;
}

// Klick auf Punkt
dot.addEventListener('click', moveDot);

// Klick auf Hintergrund = Fehlklick
document.body.addEventListener('click', () => {
  misses++;

  if (misses >= 5) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';
  }
});

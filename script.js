const dot = document.getElementById('dot');
const counter = document.getElementById('counter');
const donate = document.getElementById('donate');

let taps = 0;

function moveDot() {

  const padding = 10;

  // Platz für Donate Button reservieren
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

dot.addEventListener('click', moveDot);

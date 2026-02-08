const dot = document.getElementById("dot");
const counter = document.getElementById("counter");
let taps = 0;

function moveDot() {
  const maxX = window.innerWidth - 60;
  const maxY = window.innerHeight - 60;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dot.style.left = x + "px";
  dot.style.top = y + "px";

  taps++;
  counter.textContent = taps;
}

dot.addEventListener("click", moveDot);
dot.addEventListener("touchstart", moveDot);

moveDot();

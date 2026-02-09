diff --git a/script.js b/script.js
index 07ce0ec403f3e8999aea890d435f04879f140611..4bd68a341ff6b075381e8962436c78bb7c219f7f 100644
--- a/script.js
+++ b/script.js
@@ -1,135 +1,211 @@
 const dot = document.getElementById('dot');
 const counter = document.getElementById('counter');
const missesDisplay = document.getElementById('misses');
 const donate = document.getElementById('donate');
 const startButton = document.getElementById('start-button');
 
 let taps = 0;
 let misses = 0;
 let gameActive = false;
const maxMisses = 2;
const gameElements = [dot, counter, missesDisplay, donate];
const avoidElements = [counter, missesDisplay, donate];
let movementAnimation = null;
let movementState = null;
 
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
    missesDisplay.textContent = `Misses: 0/${maxMisses}`;
     resetDot();
  } else if (movementAnimation) {
    cancelAnimationFrame(movementAnimation);
    movementAnimation = null;
    movementState = null;
   }
 }
 
function getDotPosition() {
  return {
    left: parseFloat(dot.style.left) || 0,
    top: parseFloat(dot.style.top) || 0
  };
}

function startMovement(previousPosition, nextPosition) {
  const directionX = nextPosition.left - previousPosition.left;
  const directionY = nextPosition.top - previousPosition.top;
  const length = Math.hypot(directionX, directionY) || 1;

  movementState = {
    position: { ...nextPosition },
    velocity: 0.4,
    direction: {
      x: directionX / length,
      y: directionY / length
    }
  };

  const padding = 10;

  const animate = () => {
    if (!movementState || !gameActive) return;

    const dotSize = dot.offsetWidth;
    const minX = padding;
    const minY = padding;
    const maxX = Math.max(minX, window.innerWidth - dotSize - padding);
    const maxY = Math.max(minY, window.innerHeight - dotSize - padding);

    movementState.velocity = Math.min(movementState.velocity + 0.04, 8);
    movementState.position.left += movementState.direction.x * movementState.velocity;
    movementState.position.top += movementState.direction.y * movementState.velocity;

    if (movementState.position.left <= minX || movementState.position.left >= maxX) {
      movementState.position.left = Math.min(Math.max(movementState.position.left, minX), maxX);
      movementState.direction.x *= -1;
    }

    if (movementState.position.top <= minY || movementState.position.top >= maxY) {
      movementState.position.top = Math.min(Math.max(movementState.position.top, minY), maxY);
      movementState.direction.y *= -1;
    }

    dot.style.left = `${movementState.position.left}px`;
    dot.style.top = `${movementState.position.top}px`;

    movementAnimation = requestAnimationFrame(animate);
  };

  if (movementAnimation) {
    cancelAnimationFrame(movementAnimation);
  }
  movementAnimation = requestAnimationFrame(animate);
}

 // Punkt bewegen
 function moveDot() {
   const padding = 10;
  const avoidRects = avoidElements.map((element) => element.getBoundingClientRect());
   const dotSize = dot.offsetWidth;
   const minX = padding;
   const minY = padding;
   const maxX = Math.max(minX, window.innerWidth - dotSize - padding);
   const maxY = Math.max(minY, window.innerHeight - dotSize - padding);
 
  const previousPosition = getDotPosition();
  let newX = previousPosition.left;
  let newY = previousPosition.top;
 
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
 
    const overlapsAvoid = avoidRects.some((rect) => overlapsRect(dotRect, rect));
 
     newX = candidateX;
     newY = candidateY;
 
    if (!overlapsAvoid) break;
   }
 
  const nextPosition = { left: newX, top: newY };
  dot.style.left = `${nextPosition.left}px`;
  dot.style.top = `${nextPosition.top}px`;
  startMovement(previousPosition, nextPosition);
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
  if (movementAnimation) {
    cancelAnimationFrame(movementAnimation);
    movementAnimation = null;
  }
  movementState = null;
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
  missesDisplay.textContent = `Misses: ${misses}/${maxMisses}`;
 
  if (misses >= maxMisses) {
     taps = 0;
     misses = 0;
     counter.textContent = 'Taps: 0';
    missesDisplay.textContent = `Misses: 0/${maxMisses}`;
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

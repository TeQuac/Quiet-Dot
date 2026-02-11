const dot = document.getElementById('dot');
const counter = document.getElementById('counter');
const gameHighscore = document.getElementById('game-highscore');
const missesDisplay = document.getElementById('misses');
const donate = document.getElementById('donate');

const usernameOverlay = document.getElementById('username-overlay');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameError = document.getElementById('username-error');

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const usernameValue = document.getElementById('username-value');
const userHighscoreValue = document.getElementById('user-highscore-value');
const highscoreTrack = document.getElementById('highscore-track');

const storageKeys = {
  users: 'silentapUsers',
  currentUser: 'silentapCurrentUser'
};

const supabaseConfig = {
  url: 'https://lwsnfjkgremafzqbhooe.supabase.co',
  anonKey: 'sb_publishable_BQfkDQVX5WWmW1tECuENyA_r8ppUYNb'
};

const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

let taps = 0;
let misses = 0;
let gameActive = false;
const maxMisses = 2;
let currentUser = null;
let movementAnimation = null;
let movementState = null;
let userCache = [];
let currentUserBest = 0;

const gameElements = [dot, counter, gameHighscore, missesDisplay, donate].filter(Boolean);
const avoidElements = [counter, gameHighscore, missesDisplay, donate].filter(Boolean);

function loadUsers() {
  const stored = localStorage.getItem(storageKeys.users);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(storageKeys.users, JSON.stringify(users));
}

function normalizeName(name) {
  return name.trim();
}

function getUserRecordFromCache(name) {
  return userCache.find((user) => user.name === name) || null;
}

function upsertUserCache(name, highscore) {
  const existing = userCache.find((user) => user.name === name);
  if (!existing) {
    userCache.push({ name, highscore });
  } else {
    existing.highscore = Math.max(existing.highscore, highscore);
  }

  saveUsers(userCache);
}

function getTopTenText(users) {
  const topTen = users
    .slice()
    .sort((a, b) => b.highscore - a.highscore)
    .slice(0, 10);

  if (topTen.length === 0) {
    return 'Noch keine Highscores';
  }

  const text = topTen.map((entry, index) => `${index + 1}. ${entry.name} - ${entry.highscore}`).join(' • ');
  return `${text} • ${text}`;
}

async function fetchTopTenRemote() {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore')
    .order('highscore', { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(10);

  if (error) {
    console.warn('Top-10 konnte nicht geladen werden:', error.message);
    return null;
  }

  return (data || []).map((entry) => ({
    name: entry.username,
    highscore: entry.highscore
  }));
}

async function fetchUserRemote(name) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore')
    .eq('username', name)
    .maybeSingle();

  if (error) {
    console.warn('User konnte nicht geladen werden:', error.message);
    return null;
  }

  if (!data) return null;

  return {
    name: data.username,
    highscore: data.highscore
  };
}

async function usernameExistsRemote(name) {
  if (!supabaseClient) return false;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username')
    .ilike('username', name)
    .limit(1);

  if (error) {
    console.warn('Username-Prüfung fehlgeschlagen:', error.message);
    return false;
  }

  return (data || []).length > 0;
}

async function createUserRemote(name) {
  if (!supabaseClient) return { name, highscore: 0 };

  const { data, error } = await supabaseClient
    .from('game_scores')
    .insert({ username: name, highscore: 0 })
    .select('username, highscore')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    name: data.username,
    highscore: data.highscore
  };
}

async function submitHighscoreRemote(name, score) {
  if (!supabaseClient) return score;

  const { data, error } = await supabaseClient
    .rpc('submit_score', { p_username: name, p_score: score });

  if (error) {
    console.warn('Highscore konnte nicht gespeichert werden:', error.message);
    return score;
  }

  if (!data) return score;
  return data.highscore;
}

async function updateTicker() {
  const remoteTopTen = await fetchTopTenRemote();
  if (remoteTopTen) {
    remoteTopTen.forEach((entry) => upsertUserCache(entry.name, entry.highscore));
    highscoreTrack.textContent = getTopTenText(remoteTopTen);
    return;
  }

  highscoreTrack.textContent = getTopTenText(userCache);
}

function setCurrentUser(record) {
  currentUser = record.name;
  currentUserBest = record.highscore;
  localStorage.setItem(storageKeys.currentUser, record.name);

  usernameValue.textContent = record.name;
  userHighscoreValue.textContent = String(record.highscore);
  gameHighscore.textContent = `Highscore: ${record.highscore}`;
}

async function updateCurrentUserHighscore(newScore) {
  if (!currentUser || newScore <= currentUserBest) return;

  const persistedHighscore = await submitHighscoreRemote(currentUser, newScore);
  const bestScore = Math.max(newScore, persistedHighscore);

  currentUserBest = bestScore;
  upsertUserCache(currentUser, bestScore);
  userHighscoreValue.textContent = String(bestScore);
  gameHighscore.textContent = `Highscore: ${bestScore}`;

  await updateTicker();
}

function showStartMenu() {
  usernameOverlay.classList.add('hidden');
  startScreen.classList.remove('hidden');
  startButton.disabled = false;
}

function showUsernameOverlay(message = '') {
  startScreen.classList.add('hidden');
  usernameOverlay.classList.remove('hidden');
  usernameInput.value = '';
  if (message) {
    usernameError.textContent = message;
    usernameError.classList.remove('hidden');
  } else {
    usernameError.textContent = '';
    usernameError.classList.add('hidden');
  }
  startButton.disabled = true;
}

async function resolveSavedUser(savedUser) {
  const remoteRecord = await fetchUserRemote(savedUser);
  if (remoteRecord) {
    upsertUserCache(remoteRecord.name, remoteRecord.highscore);
    return remoteRecord;
  }

  return getUserRecordFromCache(savedUser);
}

async function initUserFlow() {
  userCache = loadUsers();
  await updateTicker();

  const savedUser = localStorage.getItem(storageKeys.currentUser);

  if (!savedUser) {
    showUsernameOverlay();
    return;
  }

  const record = await resolveSavedUser(savedUser);
  if (!record) {
    showUsernameOverlay('Gespeicherter User wurde nicht gefunden. Bitte neu wählen.');
    return;
  }

  setCurrentUser(record);
  showStartMenu();
}

function setGameActive(active) {
  gameActive = active;
  gameElements.forEach((element) => {
    element.classList.toggle('hidden', !active);
    element.hidden = !active;
  });
  startScreen.classList.toggle('hidden', active);

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
  return {
    left: `${(window.innerWidth - dotSize) / 2}px`,
    top: `${(window.innerHeight - dotSize) / 2}px`
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

function hitDot() {
  taps++;
  counter.textContent = `Taps: ${taps}`;
  updateCurrentUserHighscore(taps);
  moveDot();
}

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

const isTouchDevice = 'ontouchstart' in window;
document.addEventListener(isTouchDevice ? 'touchstart' : 'click', handleTap);

window.addEventListener('resize', () => {
  if (gameActive) moveDot();
});

startButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!currentUser) return;
  setGameActive(true);
});

startButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!currentUser) return;
  setGameActive(true);
}, { passive: false });

usernameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = normalizeName(usernameInput.value);

  if (name.length < 3) {
    showUsernameOverlay('Username muss mindestens 3 Zeichen lang sein.');
    return;
  }

  const localConflict = userCache.some((user) => user.name.toLowerCase() === name.toLowerCase());
  const remoteConflict = await usernameExistsRemote(name);
  if (localConflict || remoteConflict) {
    showUsernameOverlay('Dieser Username ist bereits vergeben.');
    return;
  }

  try {
    const createdUser = await createUserRemote(name);
    upsertUserCache(createdUser.name, createdUser.highscore);
    setCurrentUser(createdUser);
    await updateTicker();
    showStartMenu();
  } catch {
    showUsernameOverlay('User konnte nicht gespeichert werden. Bitte versuche es erneut.');
  }
});

setGameActive(false);
initUserFlow();

const dot = document.getElementById('dot');
const dotSplit = document.getElementById('dot-split');
const splitDivider = document.getElementById('split-divider');
const counter = document.getElementById('counter');
const gameHighscore = document.getElementById('game-highscore');
const missesDisplay = document.getElementById('misses');
const donate = document.getElementById('donate');
const backToMenu = document.getElementById('back-to-menu');

const usernameOverlay = document.getElementById('username-overlay');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameError = document.getElementById('username-error');

const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackButton = document.getElementById('feedback-button');
const feedbackForm = document.getElementById('feedback-form');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackCancel = document.getElementById('feedback-cancel');
const feedbackError = document.getElementById('feedback-error');

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const usernameValue = document.getElementById('username-value');
const userHighscoreNormal = document.getElementById('user-highscore-normal');
const userHighscoreSplit = document.getElementById('user-highscore-split');
const highscoreTrack = document.getElementById('highscore-track');
const tickerModeLabel = document.getElementById('ticker-mode-label');

const modeScreen = document.getElementById('mode-screen');
const modeNormalButton = document.getElementById('mode-normal');
const modeSplitButton = document.getElementById('mode-split');
const modeBackButton = document.getElementById('mode-back');

const storageKeys = {
  users: 'silentapUsers',
  currentUser: 'silentapCurrentUser'
};

const gameModes = {
  normal: { label: 'Normal' },
  split: { label: 'Split' }
};

const developerEmail = 'te.quac@web.de';


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
let userCache = [];
let currentMode = 'normal';

const movementAnimations = new Map();
const movementStates = new Map();

const warmDotColors = [
  '#1f2937', '#8b5e3c', '#a05d4e', '#b66a50', '#c9785a', '#d08a62', '#9f7a57', '#c17f59', '#b5835a', '#7a5c4a', '#94624e'
];
let currentDotColorIndex = 0;

const alwaysVisibleInGame = [counter, gameHighscore, missesDisplay, donate, backToMenu];
const avoidElements = [counter, gameHighscore, missesDisplay, donate, backToMenu];

function ensureUserRecordShape(user) {
  const highscores = {
    normal: Number.isFinite(user?.highscores?.normal) ? user.highscores.normal : Number.isFinite(user?.highscore) ? user.highscore : 0,
    split: Number.isFinite(user?.highscores?.split) ? user.highscores.split : 0
  };

  return {
    name: user?.name || '',
    highscores
  };
}

function loadUsers() {
  const stored = localStorage.getItem(storageKeys.users);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(ensureUserRecordShape).filter((entry) => entry.name);
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

function getScore(record, mode) {
  return record?.highscores?.[mode] ?? 0;
}

function getUserRecordFromCache(name) {
  return userCache.find((user) => user.name === name) || null;
}

function upsertUserCache(name, mode, score) {
  let existing = userCache.find((user) => user.name === name);
  if (!existing) {
    existing = ensureUserRecordShape({ name });
    userCache.push(existing);
  }

  if (!existing.highscores) {
    existing.highscores = { normal: 0, split: 0 };
  }

  existing.highscores[mode] = Math.max(getScore(existing, mode), score);
  saveUsers(userCache);
}

function getTopTenEntries(users, mode) {
  return users
    .slice()
    .sort((a, b) => getScore(b, mode) - getScore(a, mode))
    .slice(0, 10)
    .filter((entry) => getScore(entry, mode) > 0);
}

function getEntryClass(index) {
  if (index === 0) return 'rank-1';
  if (index === 1) return 'rank-2';
  if (index === 2) return 'rank-3';
  return '';
}

function renderTicker(users, mode) {
  const entries = getTopTenEntries(users, mode);
  tickerModeLabel.textContent = `Top 10 · ${gameModes[mode].label}`;

  if (entries.length === 0) {
    highscoreTrack.textContent = `Noch keine ${gameModes[mode].label}-Highscores`;
    return;
  }

  const tickerItems = entries
    .map((entry, index) => {
      const rankClass = getEntryClass(index);
      return `<span class="ticker-entry ${rankClass}">${index + 1}. ${entry.name} - ${getScore(entry, mode)}</span>`;
    })
    .join('<span aria-hidden="true">•</span>');

  highscoreTrack.innerHTML = `<div class="ticker-content">${tickerItems}<span aria-hidden="true">•</span>${tickerItems}</div>`;
}

async function fetchTopTenRemote() {
  if (!supabaseClient || currentMode !== 'normal') return null;

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

  return (data || []).map((entry) => ensureUserRecordShape({
    name: entry.username,
    highscores: { normal: entry.highscore, split: 0 }
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

  return ensureUserRecordShape({
    name: data.username,
    highscores: { normal: data.highscore, split: 0 }
  });
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
  if (!supabaseClient) return ensureUserRecordShape({ name });

  const { data, error } = await supabaseClient
    .from('game_scores')
    .insert({ username: name, highscore: 0 })
    .select('username, highscore')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return ensureUserRecordShape({
    name: data.username,
    highscores: { normal: data.highscore, split: 0 }
  });
}

async function submitHighscoreRemote(name, score) {
  if (!supabaseClient || currentMode !== 'normal') return score;

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
    remoteTopTen.forEach((entry) => upsertUserCache(entry.name, 'normal', getScore(entry, 'normal')));
    renderTicker(remoteTopTen, currentMode);
    return;
  }

  renderTicker(userCache, currentMode);
}

function updateModeButtons() {
  modeNormalButton.classList.toggle('active', currentMode === 'normal');
  modeSplitButton.classList.toggle('active', currentMode === 'split');
}

function updateCurrentUserHighscoreDisplay() {
  const record = getUserRecordFromCache(currentUser);
  const normalScore = getScore(record, 'normal');
  const splitScore = getScore(record, 'split');

  userHighscoreNormal.textContent = String(normalScore);
  userHighscoreSplit.textContent = String(splitScore);
  gameHighscore.textContent = `Highscore (${gameModes[currentMode].label}): ${getScore(record, currentMode)}`;
}

function setCurrentUser(record) {
  const shaped = ensureUserRecordShape(record);
  currentUser = shaped.name;
  localStorage.setItem(storageKeys.currentUser, shaped.name);

  const cacheRecord = getUserRecordFromCache(shaped.name);
  if (!cacheRecord) {
    userCache.push(shaped);
    saveUsers(userCache);
  }

  usernameValue.textContent = shaped.name;
  updateCurrentUserHighscoreDisplay();
}

async function updateCurrentUserHighscore(newScore) {
  if (!currentUser) return;

  const record = getUserRecordFromCache(currentUser);
  const currentBest = getScore(record, currentMode);
  if (newScore <= currentBest) return;

  let bestScore = newScore;
  if (currentMode === 'normal') {
    const persistedHighscore = await submitHighscoreRemote(currentUser, newScore);
    bestScore = Math.max(newScore, persistedHighscore);
  }

  upsertUserCache(currentUser, currentMode, bestScore);
  updateCurrentUserHighscoreDisplay();
  await updateTicker();
}

function showFeedbackOverlay(message = '') {
  feedbackOverlay.classList.remove('hidden');
  feedbackMessage.value = '';
  if (message) {
    feedbackError.textContent = message;
    feedbackError.classList.remove('hidden');
  } else {
    feedbackError.textContent = '';
    feedbackError.classList.add('hidden');
  }
}

function hideFeedbackOverlay() {
  feedbackOverlay.classList.add('hidden');
  feedbackError.textContent = '';
  feedbackError.classList.add('hidden');
}

function sendFeedbackMail(message) {
  const subject = encodeURIComponent('Silentap Feedback');
  const body = encodeURIComponent(message.trim());
  window.location.href = `mailto:${developerEmail}?subject=${subject}&body=${body}`;
}

function showStartMenu() {
  usernameOverlay.classList.add('hidden');
  hideFeedbackOverlay();
  modeScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  startButton.disabled = false;
  updateCurrentUserHighscoreDisplay();
  updateTicker();
}

function showModeScreen() {
  startScreen.classList.add('hidden');
  modeScreen.classList.remove('hidden');
  updateModeButtons();
}

function showUsernameOverlay(message = '') {
  startScreen.classList.add('hidden');
  modeScreen.classList.add('hidden');
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
    upsertUserCache(remoteRecord.name, 'normal', getScore(remoteRecord, 'normal'));
    return getUserRecordFromCache(savedUser);
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

function getDotsForMode() {
  return currentMode === 'split' ? [dot, dotSplit] : [dot];
}

function setGameActive(active) {
  gameActive = active;

  alwaysVisibleInGame.forEach((element) => {
    element.classList.toggle('hidden', !active);
    element.hidden = !active;
  });

  splitDivider.classList.toggle('hidden', !active || currentMode !== 'split');
  splitDivider.hidden = !active || currentMode !== 'split';

  [dot, dotSplit].forEach((element) => {
    const shouldShow = active && getDotsForMode().includes(element);
    element.classList.toggle('hidden', !shouldShow);
    element.hidden = !shouldShow;
  });

  startScreen.classList.toggle('hidden', active);
  modeScreen.classList.toggle('hidden', true);

  if (active) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';
    missesDisplay.textContent = `Misses: 0/${maxMisses}`;
    gameHighscore.textContent = `Highscore (${gameModes[currentMode].label}): ${getScore(getUserRecordFromCache(currentUser), currentMode)}`;
    resetDotColors();
    resetDots();
    getDotsForMode().forEach((dotElement) => moveDot(dotElement));
  } else {
    stopAllMovement();
    splitDivider.classList.add('hidden');
    splitDivider.hidden = true;
    dotSplit.classList.add('hidden');
    dotSplit.hidden = true;
  }
}

function getDotPosition(dotElement) {
  return {
    left: parseFloat(dotElement.style.left) || 0,
    top: parseFloat(dotElement.style.top) || 0
  };
}

function getBoundsForDot(dotElement) {
  const padding = 10;
  const dotSize = dotElement.offsetWidth;

  if (currentMode !== 'split') {
    return {
      minX: padding,
      minY: padding,
      maxX: Math.max(padding, window.innerWidth - dotSize - padding),
      maxY: Math.max(padding, window.innerHeight - dotSize - padding)
    };
  }

  const dividerWidth = splitDivider.offsetWidth || 14;
  const centerX = window.innerWidth / 2;
  const leftHalfMaxX = centerX - (dividerWidth / 2) - dotSize - padding;
  const rightHalfMinX = centerX + (dividerWidth / 2) + padding;

  const isLeftDot = dotElement === dot;

  return {
    minX: isLeftDot ? padding : rightHalfMinX,
    minY: padding,
    maxX: isLeftDot ? Math.max(padding, leftHalfMaxX) : Math.max(rightHalfMinX, window.innerWidth - dotSize - padding),
    maxY: Math.max(padding, window.innerHeight - dotSize - padding)
  };
}

function startMovement(dotElement, previousPosition, nextPosition) {
  const directionX = nextPosition.left - previousPosition.left;
  const directionY = nextPosition.top - previousPosition.top;
  const length = Math.hypot(directionX, directionY) || 1;

  movementStates.set(dotElement, {
    position: { ...nextPosition },
    velocity: 0.4,
    direction: {
      x: directionX / length,
      y: directionY / length
    }
  });

  const animate = () => {
    const movementState = movementStates.get(dotElement);
    if (!movementState || !gameActive) return;

    const bounds = getBoundsForDot(dotElement);

    movementState.velocity = Math.min(movementState.velocity + 0.04, 8);
    movementState.position.left += movementState.direction.x * movementState.velocity;
    movementState.position.top += movementState.direction.y * movementState.velocity;

    if (movementState.position.left <= bounds.minX || movementState.position.left >= bounds.maxX) {
      movementState.position.left = Math.min(Math.max(movementState.position.left, bounds.minX), bounds.maxX);
      movementState.direction.x *= -1;
    }

    if (movementState.position.top <= bounds.minY || movementState.position.top >= bounds.maxY) {
      movementState.position.top = Math.min(Math.max(movementState.position.top, bounds.minY), bounds.maxY);
      movementState.direction.y *= -1;
    }

    dotElement.style.left = `${movementState.position.left}px`;
    dotElement.style.top = `${movementState.position.top}px`;

    movementAnimations.set(dotElement, requestAnimationFrame(animate));
  };

  const previousAnimation = movementAnimations.get(dotElement);
  if (previousAnimation) cancelAnimationFrame(previousAnimation);

  movementAnimations.set(dotElement, requestAnimationFrame(animate));
}

function moveDot(dotElement) {
  const avoidRects = avoidElements.map((element) => element.getBoundingClientRect());
  const dotSize = dotElement.offsetWidth;
  const bounds = getBoundsForDot(dotElement);

  const previousPosition = getDotPosition(dotElement);
  let newX = previousPosition.left;
  let newY = previousPosition.top;

  const overlapsRect = (rectA, rectB) => !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );

  for (let attempt = 0; attempt < 25; attempt++) {
    const candidateX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
    const candidateY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
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
  dotElement.style.left = `${nextPosition.left}px`;
  dotElement.style.top = `${nextPosition.top}px`;
  startMovement(dotElement, previousPosition, nextPosition);
}

function getCenteredPosition(dotElement, dotIndex = 0) {
  const dotSize = dotElement.offsetWidth;

  if (currentMode !== 'split') {
    return {
      left: `${(window.innerWidth - dotSize) / 2}px`,
      top: `${(window.innerHeight - dotSize) / 2}px`
    };
  }

  const quarterX = dotIndex === 0 ? window.innerWidth * 0.25 : window.innerWidth * 0.75;
  return {
    left: `${quarterX - (dotSize / 2)}px`,
    top: `${(window.innerHeight - dotSize) / 2}px`
  };
}

function resetDots() {
  getDotsForMode().forEach((dotElement, index) => {
    const centeredPosition = getCenteredPosition(dotElement, index);
    dotElement.style.left = centeredPosition.left;
    dotElement.style.top = centeredPosition.top;
    movementStates.delete(dotElement);
  });

  stopAllMovement();
}

function stopAllMovement() {
  movementAnimations.forEach((animation) => cancelAnimationFrame(animation));
  movementAnimations.clear();
  movementStates.clear();
}

function updateDotColorByTaps() {
  const nextColorIndex = Math.floor(taps / 10) % warmDotColors.length;
  if (nextColorIndex === currentDotColorIndex) return;

  currentDotColorIndex = nextColorIndex;
  getDotsForMode().forEach((dotElement) => {
    dotElement.style.backgroundColor = warmDotColors[currentDotColorIndex];
  });
}

function resetDotColors() {
  currentDotColorIndex = 0;
  [dot, dotSplit].forEach((dotElement) => {
    dotElement.style.backgroundColor = warmDotColors[currentDotColorIndex];
  });
}

function hitDot() {
  taps++;
  counter.textContent = `Taps: ${taps}`;
  updateDotColorByTaps();
  updateCurrentUserHighscore(taps);
  getDotsForMode().forEach((dotElement) => moveDot(dotElement));
}

function getInteractionPoint(event) {
  const touchPoint = event.touches?.[0] || event.changedTouches?.[0];
  if (touchPoint) {
    return {
      x: touchPoint.clientX,
      y: touchPoint.clientY
    };
  }

  if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  return null;
}

function isTapInsideDot(dotElement, point) {
  if (!dotElement || dotElement.hidden || dotElement.classList.contains('hidden')) return false;
  if (!point) return false;

  const rect = dotElement.getBoundingClientRect();
  const centerX = rect.left + (rect.width / 2);
  const centerY = rect.top + (rect.height / 2);
  const radius = rect.width / 2;

  const deltaX = point.x - centerX;
  const deltaY = point.y - centerY;

  return Math.hypot(deltaX, deltaY) <= radius;
}

function handleTap(event) {
  if (!gameActive) return;

  const target = event.target;
  const isControlButton = target?.closest?.('#donate, #back-to-menu, #start-btn, #mode-back, #mode-normal, #mode-split, #feedback-btn, #feedback-cancel, #feedback-submit');
  if (isControlButton) return;

  const interactionPoint = getInteractionPoint(event);
  const tappedDot = getDotsForMode().some((dotElement) => isTapInsideDot(dotElement, interactionPoint));
  if (tappedDot) {
    hitDot();
    return;
  }

  misses++;
  missesDisplay.textContent = `Misses: ${misses}/${maxMisses}`;

  if (misses >= maxMisses) {
    taps = 0;
    misses = 0;
    counter.textContent = 'Taps: 0';
    missesDisplay.textContent = `Misses: 0/${maxMisses}`;
    resetDotColors();
    resetDots();
    getDotsForMode().forEach((dotElement) => moveDot(dotElement));
  }
}

function applyMode(mode) {
  currentMode = mode;
  updateModeButtons();
  updateCurrentUserHighscoreDisplay();
  updateTicker();
}


document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

document.addEventListener('selectstart', (event) => {
  event.preventDefault();
});

const isTouchDevice = 'ontouchstart' in window;
document.addEventListener(isTouchDevice ? 'touchstart' : 'click', handleTap);

window.addEventListener('resize', () => {
  if (gameActive) {
    resetDots();
    getDotsForMode().forEach((dotElement) => moveDot(dotElement));
  }
});

startButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!currentUser) return;
  showModeScreen();
});

startButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!currentUser) return;
  showModeScreen();
}, { passive: false });

modeNormalButton.addEventListener('click', () => {
  applyMode('normal');
  setGameActive(true);
});

modeSplitButton.addEventListener('click', () => {
  applyMode('split');
  setGameActive(true);
});

modeBackButton.addEventListener('click', () => {
  showStartMenu();
});

backToMenu.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  setGameActive(false);
  showStartMenu();
});

backToMenu.addEventListener('touchstart', (event) => {
  event.preventDefault();
  event.stopPropagation();
  setGameActive(false);
  showStartMenu();
}, { passive: false });

feedbackButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  showFeedbackOverlay();
});

feedbackCancel.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideFeedbackOverlay();
});

feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = feedbackMessage.value.trim();

  if (message.length < 3) {
    showFeedbackOverlay('Bitte mindestens 3 Zeichen eingeben.');
    return;
  }

  sendFeedbackMail(message);
  hideFeedbackOverlay();
});

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
    upsertUserCache(createdUser.name, 'normal', getScore(createdUser, 'normal'));
    upsertUserCache(createdUser.name, 'split', getScore(createdUser, 'split'));
    setCurrentUser(getUserRecordFromCache(createdUser.name) || createdUser);
    await updateTicker();
    showStartMenu();
  } catch {
    showUsernameOverlay('User konnte nicht gespeichert werden. Bitte versuche es erneut.');
  }
});

setGameActive(false);
initUserFlow();

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
const passwordInput = document.getElementById('password-input');
const passwordConfirmInput = document.getElementById('password-confirm');
const passwordConfirmLabel = document.getElementById('password-confirm-label');
const usernameSave = document.getElementById('username-save');
const authCancelButton = document.getElementById('auth-cancel');
const usernameError = document.getElementById('username-error');
const authTitle = document.getElementById('auth-title');
const authDescription = document.getElementById('auth-description');
const authRegisterButton = document.getElementById('auth-register');
const authLoginButton = document.getElementById('auth-login');

const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackButton = document.getElementById('feedback-button');
const feedbackForm = document.getElementById('feedback-form');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackCancel = document.getElementById('feedback-cancel');
const feedbackError = document.getElementById('feedback-error');

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const switchUserButton = document.getElementById('switch-user-button');
const usernameValue = document.getElementById('username-value');
const userHighscoreNormal = document.getElementById('user-highscore-normal');
const userHighscoreSplit = document.getElementById('user-highscore-split');
const highscoreButton = document.getElementById('highscore-button');
const highscoreOverlay = document.getElementById('highscore-overlay');
const highscoreModeNormalButton = document.getElementById('highscore-mode-normal');
const highscoreModeSplitButton = document.getElementById('highscore-mode-split');
const highscoreList = document.getElementById('highscore-list');
const highscoreEmpty = document.getElementById('highscore-empty');
const highscoreCloseButton = document.getElementById('highscore-close');

const modeScreen = document.getElementById('mode-screen');
const modeNormalButton = document.getElementById('mode-normal');
const modeSplitButton = document.getElementById('mode-split');
const modeBackButton = document.getElementById('mode-back');
const splitHintOverlay = document.getElementById('split-hint-overlay');
const splitHintCloseButton = document.getElementById('split-hint-close');

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
let selectedHighscoreMode = 'normal';
let authMode = 'register';
let splitSequenceFirstDot = null;

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

function renderHighscoreList(users, mode) {
  const entries = getTopTenEntries(users, mode);
  highscoreModeNormalButton.classList.toggle('active', mode === 'normal');
  highscoreModeSplitButton.classList.toggle('active', mode === 'split');
  highscoreModeNormalButton.setAttribute('aria-selected', String(mode === 'normal'));
  highscoreModeSplitButton.setAttribute('aria-selected', String(mode === 'split'));

  highscoreList.innerHTML = '';
  if (entries.length === 0) {
    highscoreEmpty.textContent = `Noch keine ${gameModes[mode].label}-Highscores vorhanden.`;
    highscoreEmpty.classList.remove('hidden');
    return;
  }

  highscoreEmpty.classList.add('hidden');
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'highscore-entry';

    const rank = document.createElement('span');
    rank.className = `highscore-rank ${index < 3 ? `rank-${index + 1}` : ''}`;
    rank.textContent = `${index + 1}.`;

    const name = document.createElement('span');
    name.className = 'highscore-name';
    name.textContent = entry.name;

    const score = document.createElement('span');
    score.className = 'highscore-score';
    score.textContent = String(getScore(entry, mode));

    item.append(rank, name, score);
    highscoreList.appendChild(item);
  });
}

async function fetchTopTenRemote() {
  if (!supabaseClient) return null;

  const scoreColumn = currentMode === 'split' ? 'split_highscore' : 'highscore';

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore')
    .order(scoreColumn, { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(10);

  if (error) {
    console.warn('Top-10 konnte nicht geladen werden:', error.message);
    return null;
  }

  return (data || []).map((entry) => ensureUserRecordShape({
    name: entry.username,
    highscores: { normal: entry.highscore, split: entry.split_highscore }
  }));
}

async function hashPassword(password) {
  const normalized = password.trim();
  if (!normalized) return '';

  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(normalized);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return normalized;
}

function shapeRemoteUser(entry) {
  if (!entry) return null;

  return {
    record: ensureUserRecordShape({
      name: entry.username,
      highscores: { normal: entry.highscore, split: entry.split_highscore }
    }),
    passwordHash: entry.password_hash || null
  };
}

async function fetchUserRemote(name) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, password_hash')
    .ilike('username', name)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('User konnte nicht geladen werden:', error.message);
    return null;
  }

  return shapeRemoteUser(data);
}

async function createUserRemote(name, passwordHash) {
  if (!supabaseClient) return { record: ensureUserRecordShape({ name }), passwordHash };

  const { data, error } = await supabaseClient
    .from('game_scores')
    .insert({ username: name, highscore: 0, split_highscore: 0, password_hash: passwordHash })
    .select('username, highscore, split_highscore, password_hash')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return shapeRemoteUser(data);
}

async function setUserPasswordRemote(name, passwordHash) {
  if (!supabaseClient) return { record: ensureUserRecordShape({ name }), passwordHash };

  const { data, error } = await supabaseClient
    .from('game_scores')
    .update({ password_hash: passwordHash })
    .ilike('username', name)
    .is('password_hash', null)
    .select('username, highscore, split_highscore, password_hash')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) return shapeRemoteUser(data);

  const existing = await fetchUserRemote(name);
  if (!existing) throw new Error('User nicht gefunden.');
  return existing;
}

function extractPersistedScore(result, mode, fallbackScore) {
  if (!result || typeof result !== 'object') return fallbackScore;

  const modeKey = mode === 'split' ? 'split_highscore' : 'highscore';
  if (typeof result[modeKey] === 'number') return result[modeKey];
  if (typeof result.highscore === 'number' && mode === 'normal') return result.highscore;
  if (typeof result.split_highscore === 'number' && mode === 'split') return result.split_highscore;
  return fallbackScore;
}

async function submitHighscoreRemote(name, score, mode) {
  if (!supabaseClient) return score;

  const { data, error } = await supabaseClient
    .rpc('submit_score_mode', { p_username: name, p_mode: mode, p_score: score });

  if (!error) {
    if (!data) return score;
    return extractPersistedScore(data, mode, score);
  }

  if (mode === 'normal') {
    const legacy = await supabaseClient
      .rpc('submit_score', { p_username: name, p_score: score });

    if (!legacy.error) {
      if (!legacy.data) return score;
      return extractPersistedScore(legacy.data, mode, score);
    }
  }

  console.warn('Highscore konnte nicht gespeichert werden:', error.message);
  return score;
}

async function updateTicker() {
  const remoteTopTen = await fetchTopTenRemote();
  if (remoteTopTen) {
    remoteTopTen.forEach((entry) => {
      upsertUserCache(entry.name, 'normal', getScore(entry, 'normal'));
      upsertUserCache(entry.name, 'split', getScore(entry, 'split'));
    });
    renderHighscoreList(remoteTopTen, selectedHighscoreMode);
    return;
  }

  renderHighscoreList(userCache, selectedHighscoreMode);
}

function showHighscoreOverlay() {
  selectedHighscoreMode = currentMode;
  highscoreOverlay.classList.remove('hidden');
  void updateTicker();
}

function hideHighscoreOverlay() {
  highscoreOverlay.classList.add('hidden');
}

function setHighscoreMode(mode) {
  selectedHighscoreMode = mode;
  void updateTicker();
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
    const persistedHighscore = await submitHighscoreRemote(currentUser, newScore, currentMode);
    bestScore = Math.max(newScore, persistedHighscore);
  }

  if (currentMode === 'split') {
    const persistedHighscore = await submitHighscoreRemote(currentUser, newScore, currentMode);
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

async function submitFeedbackRemote(message) {
  if (!supabaseClient) return;

  const trimmedMessage = message.trim();
  const payload = {
    message: trimmedMessage,
    sender_email: developerEmail
  };

  const savePromise = supabaseClient.from('feedback_messages').insert(payload)
    .then(({ error }) => {
      if (error) {
        console.warn('Feedback konnte nicht gespeichert werden:', error.message);
      }
    })
    .catch((error) => {
      console.warn('Feedback-Speicherung fehlgeschlagen:', error?.message || error);
    });

  const mailPromise = supabaseClient.functions.invoke('send-feedback-email', {
    body: {
      message: trimmedMessage,
      senderEmail: developerEmail,
      recipientEmail: developerEmail
    }
  })
    .then(({ error }) => {
      if (error) {
        console.warn('Feedback-Mail konnte nicht gesendet werden:', error.message);
      }
    })
    .catch((error) => {
      console.warn('Feedback-Mailversand fehlgeschlagen:', error?.message || error);
    });

  await Promise.allSettled([savePromise, mailPromise]);
}

function showStartMenu() {
  closeSplitHint();
  usernameOverlay.classList.add('hidden');
  hideFeedbackOverlay();
  modeScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  hideHighscoreOverlay();
  startButton.disabled = false;
  updateCurrentUserHighscoreDisplay();
  void updateTicker();
}

function showModeScreen() {
  startScreen.classList.add('hidden');
  modeScreen.classList.remove('hidden');
  updateModeButtons();
}

function setAuthMode(mode, options = {}) {
  authMode = mode;
  const isRegister = mode === 'register';

  authTitle.textContent = options.title || (isRegister ? 'Willkommen bei Silentap' : 'Bei Silentap anmelden');
  authDescription.textContent = options.description || (isRegister
    ? 'Wähle einen Usernamen und melde dich mit Passwort an.'
    : 'Melde dich mit Username und Passwort an.');

  authRegisterButton.classList.toggle('active', isRegister);
  authLoginButton.classList.toggle('active', !isRegister);

  usernameForm.dataset.mode = mode;
  usernameSave.textContent = isRegister ? 'Registrieren' : 'Anmelden';

  passwordConfirmInput.classList.toggle('hidden', !isRegister);
  passwordConfirmLabel.classList.toggle('hidden', !isRegister);
  passwordConfirmInput.required = isRegister;
  passwordInput.autocomplete = isRegister ? 'new-password' : 'current-password';
}

function showUsernameOverlay(options = {}) {
  const { message = '', mode = 'register', keepValues = false, allowCancel = Boolean(currentUser) } = options;

  startScreen.classList.add('hidden');
  modeScreen.classList.add('hidden');
  usernameOverlay.classList.remove('hidden');

  setAuthMode(mode, options);

  authCancelButton.classList.toggle('hidden', !allowCancel);

  if (!keepValues) {
    usernameInput.value = options.username || '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';
  }

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
  const remoteUser = await fetchUserRemote(savedUser);
  if (remoteUser) {
    upsertUserCache(remoteUser.record.name, 'normal', getScore(remoteUser.record, 'normal'));
    upsertUserCache(remoteUser.record.name, 'split', getScore(remoteUser.record, 'split'));
    return remoteUser;
  }

  const localRecord = getUserRecordFromCache(savedUser);
  if (!localRecord) return null;
  return { record: localRecord, passwordHash: null };
}

async function initUserFlow() {
  userCache = loadUsers();
  await updateTicker();

  const savedUser = localStorage.getItem(storageKeys.currentUser);

  if (!savedUser) {
    showUsernameOverlay({ mode: 'login', allowCancel: false });
    return;
  }

  const resolved = await resolveSavedUser(savedUser);
  if (!resolved) {
    showUsernameOverlay({ mode: 'login', message: 'Gespeicherter User wurde nicht gefunden. Bitte neu anmelden.' });
    return;
  }

  if (!resolved.passwordHash) {
    showUsernameOverlay({
      mode: 'register',
      username: resolved.record.name,
      title: 'Passwort festlegen',
      description: 'Dieser bestehende User benötigt einmalig ein Passwort für künftige Anmeldungen.',
      message: 'Bitte Passwort festlegen.'
    });
    return;
  }

  setCurrentUser(resolved.record);
  showStartMenu();
}

function getDotsForMode() {
  return currentMode === 'split' ? [dot, dotSplit] : [dot];
}

function setGameActive(active) {
  gameActive = active;
  splitSequenceFirstDot = null;

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

function getInteractionPoints(event) {
  if (event.touches?.length) {
    return Array.from(event.touches).map((touchPoint) => ({
      x: touchPoint.clientX,
      y: touchPoint.clientY
    }));
  }

  const touchPoint = event.changedTouches?.[0];
  if (touchPoint) {
    return [{
      x: touchPoint.clientX,
      y: touchPoint.clientY
    }];
  }

  if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    return [{
      x: event.clientX,
      y: event.clientY
    }];
  }

  return [];
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

  const interactionPoints = getInteractionPoints(event);

  if (currentMode === 'split') {
    const leftHit = interactionPoints.some((point) => isTapInsideDot(dot, point));
    const rightHit = interactionPoints.some((point) => isTapInsideDot(dotSplit, point));

    if (leftHit && rightHit) {
      splitSequenceFirstDot = null;
    } else if (leftHit || rightHit) {
      const tappedSide = leftHit ? 'left' : 'right';

      if (!splitSequenceFirstDot) {
        splitSequenceFirstDot = tappedSide;
        return;
      }

      if (splitSequenceFirstDot !== tappedSide) {
        splitSequenceFirstDot = null;
        hitDot();
        return;
      }
    }
  } else {
    const tappedDot = interactionPoints.some((point) => isTapInsideDot(dot, point));
    if (tappedDot) {
      hitDot();
      return;
    }
  }

  misses++;
  missesDisplay.textContent = `Misses: ${misses}/${maxMisses}`;

  if (misses >= maxMisses) {
    taps = 0;
    misses = 0;
    splitSequenceFirstDot = null;
    counter.textContent = 'Taps: 0';
    missesDisplay.textContent = `Misses: 0/${maxMisses}`;
    resetDotColors();
    resetDots();
    getDotsForMode().forEach((dotElement) => moveDot(dotElement));
  }
}


function closeSplitHint() {
  splitHintOverlay.classList.add('hidden');
}

function showSplitHint() {
  splitHintOverlay.classList.remove('hidden');
}

function applyMode(mode) {
  currentMode = mode;
  updateModeButtons();
  updateCurrentUserHighscoreDisplay();
  void updateTicker();
}


document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

document.addEventListener('selectstart', (event) => {
  event.preventDefault();
});


document.addEventListener('touchmove', (event) => {
  event.preventDefault();
}, { passive: false });

document.addEventListener('wheel', (event) => {
  event.preventDefault();
}, { passive: false });

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
  showSplitHint();
  setGameActive(true);
});

modeBackButton.addEventListener('click', () => {
  showStartMenu();
});

highscoreButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  showHighscoreOverlay();
});

highscoreModeNormalButton.addEventListener('click', (event) => {
  event.preventDefault();
  setHighscoreMode('normal');
});

highscoreModeSplitButton.addEventListener('click', (event) => {
  event.preventDefault();
  setHighscoreMode('split');
});

highscoreCloseButton.addEventListener('click', (event) => {
  event.preventDefault();
  hideHighscoreOverlay();
});

highscoreOverlay.addEventListener('click', (event) => {
  if (event.target === highscoreOverlay) {
    hideHighscoreOverlay();
  }
});


splitHintCloseButton.addEventListener('click', (event) => {
  event.preventDefault();
  closeSplitHint();
});

splitHintOverlay.addEventListener('click', (event) => {
  if (event.target === splitHintOverlay) {
    closeSplitHint();
  }
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

  hideFeedbackOverlay();
  showStartMenu();
  void submitFeedbackRemote(message);
});

authRegisterButton.addEventListener('click', () => {
  showUsernameOverlay({ mode: 'register' });
});

authLoginButton.addEventListener('click', () => {
  showUsernameOverlay({ mode: 'login' });
});

authCancelButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!currentUser) return;
  showStartMenu();
});

switchUserButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  showUsernameOverlay({ mode: 'login', allowCancel: true });
});

usernameForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = normalizeName(usernameInput.value);
  const password = passwordInput.value.trim();
  const confirmPassword = passwordConfirmInput.value.trim();
  const mode = usernameForm.dataset.mode || authMode;

  if (name.length < 3) {
    showUsernameOverlay({ mode, message: 'Username muss mindestens 3 Zeichen lang sein.', keepValues: true });
    return;
  }

  if (password.length < 4) {
    showUsernameOverlay({ mode, message: 'Passwort muss mindestens 4 Zeichen lang sein.', keepValues: true });
    return;
  }

  const passwordHash = await hashPassword(password);

  if (mode === 'register') {
    if (password !== confirmPassword) {
      showUsernameOverlay({ mode, message: 'Passwörter stimmen nicht überein.', keepValues: true });
      return;
    }

    const remoteUser = await fetchUserRemote(name);
    if (remoteUser?.passwordHash) {
      showUsernameOverlay({ mode, message: 'Dieser Username ist bereits vergeben.', keepValues: true });
      return;
    }

    try {
      const authUser = remoteUser && !remoteUser.passwordHash
        ? await setUserPasswordRemote(name, passwordHash)
        : await createUserRemote(name, passwordHash);

      upsertUserCache(authUser.record.name, 'normal', getScore(authUser.record, 'normal'));
      upsertUserCache(authUser.record.name, 'split', getScore(authUser.record, 'split'));
      setCurrentUser(authUser.record);
      await updateTicker();
      showStartMenu();
    } catch {
      showUsernameOverlay({ mode, message: 'User konnte nicht gespeichert werden. Bitte versuche es erneut.', keepValues: true });
    }

    return;
  }

  const remoteUser = await fetchUserRemote(name);
  if (!remoteUser) {
    showUsernameOverlay({ mode, message: 'User nicht gefunden. Bitte registrieren.', keepValues: true });
    return;
  }

  try {
    let authUser = remoteUser;
    if (!remoteUser.passwordHash) {
      authUser = await setUserPasswordRemote(name, passwordHash);
    } else if (remoteUser.passwordHash !== passwordHash) {
      showUsernameOverlay({ mode, message: 'Passwort ist nicht korrekt.', keepValues: true });
      return;
    }

    upsertUserCache(authUser.record.name, 'normal', getScore(authUser.record, 'normal'));
    upsertUserCache(authUser.record.name, 'split', getScore(authUser.record, 'split'));
    setCurrentUser(authUser.record);
    await updateTicker();
    showStartMenu();
  } catch {
    showUsernameOverlay({ mode, message: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.', keepValues: true });
  }
});

setGameActive(false);
initUserFlow();

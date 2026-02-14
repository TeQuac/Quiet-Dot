const dot = document.getElementById('dot');
const dotSplit = document.getElementById('dot-split');
const splitDivider = document.getElementById('split-divider');
const counter = document.getElementById('counter');
const newHighscoreDisplay = document.getElementById('new-highscore');
const missIndicator = document.getElementById('miss-indicator');
const tryAgainMessage = document.getElementById('try-again');
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
const userHighscorePressure = document.getElementById('user-highscore-pressure');
const highscoreButton = document.getElementById('highscore-button');
const highscoreOverlay = document.getElementById('highscore-overlay');
const highscoreModeNormalButton = document.getElementById('highscore-mode-normal');
const highscoreModeSplitButton = document.getElementById('highscore-mode-split');
const highscoreModePressureButton = document.getElementById('highscore-mode-pressure');
const highscoreList = document.getElementById('highscore-list');
const highscoreEmpty = document.getElementById('highscore-empty');
const highscoreCloseButton = document.getElementById('highscore-close');

const modeScreen = document.getElementById('mode-screen');
const modeNormalButton = document.getElementById('mode-normal');
const modeSplitButton = document.getElementById('mode-split');
const modePressureButton = document.getElementById('mode-pressure');
const modeBackButton = document.getElementById('mode-back');
const splitHintOverlay = document.getElementById('split-hint-overlay');
const splitHintCloseButton = document.getElementById('split-hint-close');
const pressureHintOverlay = document.getElementById('pressure-hint-overlay');
const pressureHintCloseButton = document.getElementById('pressure-hint-close');

const storageKeys = {
  users: 'silentapUsers',
  currentUser: 'silentapCurrentUser'
};

const gameModes = {
  normal: { label: 'Normal' },
  split: { label: 'Split' },
  pressure: { label: 'Druck' }
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
let splitSequenceLastTappedSide = null;
let missResetMoveTimeoutId = null;
let missIndicatorTimeoutId = null;
let hasRoundStarted = false;
let newHighscoreTimeoutId = null;
let pressureModeTimerId = null;
let pressureModeStartedAt = 0;

const movementAnimations = new Map();
const movementStates = new Map();
const maxDotVelocity = 4.8;
const pressureModeTimeLimitMs = 5000;

const warmDotColors = [
  '#1f2937', '#8b5e3c', '#a05d4e', '#b66a50', '#c9785a', '#d08a62', '#9f7a57', '#c17f59', '#b5835a', '#7a5c4a', '#94624e'
];
const resetVibrationPattern = [30, 40, 30];
const resetVibrationDuration = 40;
let currentDotColorIndex = 0;

const alwaysVisibleInGame = [counter, donate, backToMenu];
const avoidElements = [counter, newHighscoreDisplay, tryAgainMessage, donate, backToMenu];
const pressureModeClasses = ['pressure-tension-low', 'pressure-tension-medium', 'pressure-tension-high'];

function ensureUserRecordShape(user) {
  const highscores = {
    normal: Number.isFinite(user?.highscores?.normal) ? user.highscores.normal : Number.isFinite(user?.highscore) ? user.highscore : 0,
    split: Number.isFinite(user?.highscores?.split) ? user.highscores.split : 0,
    pressure: Number.isFinite(user?.highscores?.pressure) ? user.highscores.pressure : Number.isFinite(user?.pressure_highscore) ? user.pressure_highscore : 0
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
    existing.highscores = { normal: 0, split: 0, pressure: 0 };
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
  highscoreModePressureButton.classList.toggle('active', mode === 'pressure');
  highscoreModeNormalButton.setAttribute('aria-selected', String(mode === 'normal'));
  highscoreModeSplitButton.setAttribute('aria-selected', String(mode === 'split'));
  highscoreModePressureButton.setAttribute('aria-selected', String(mode === 'pressure'));

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

  const scoreColumn = selectedHighscoreMode === 'split' ? 'split_highscore' : selectedHighscoreMode === 'pressure' ? 'pressure_highscore' : 'highscore';

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, pressure_highscore')
    .order(scoreColumn, { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(10);

  if (error) {
    console.warn('Top-10 konnte nicht geladen werden:', error.message);
    return null;
  }

  return (data || []).map((entry) => ensureUserRecordShape({
    name: entry.username,
    highscores: { normal: entry.highscore, split: entry.split_highscore, pressure: entry.pressure_highscore }
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
      highscores: { normal: entry.highscore, split: entry.split_highscore, pressure: entry.pressure_highscore }
    }),
    passwordHash: entry.password_hash || null
  };
}

async function fetchUserRemote(name) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, pressure_highscore, password_hash')
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
  if (!supabaseClient) {
    return {
      record: ensureUserRecordShape({
        name,
        highscores: { normal: 0, split: 0, pressure: 0 }
      }),
      passwordHash
    };
  }

  const { data, error } = await supabaseClient
    .from('game_scores')
    .insert({
      username: name,
      highscore: 0,
      split_highscore: 0,
      pressure_highscore: 0,
      password_hash: passwordHash
    })
    .select('username, highscore, split_highscore, pressure_highscore, password_hash')
    .single();

  if (error) {
    throw new Error(error.message || 'User konnte nicht angelegt werden');
  }

  return shapeRemoteUser(data);
}

async function setUserPasswordRemote(name, passwordHash) {
  if (!supabaseClient) {
    return {
      record: ensureUserRecordShape({
        name,
        highscores: { normal: 0, split: 0, pressure: 0 }
      }),
      passwordHash
    };
  }

  const { data, error } = await supabaseClient
    .from('game_scores')
    .update({ password_hash: passwordHash })
    .eq('username', name)
    .select('username, highscore, split_highscore, pressure_highscore, password_hash')
    .single();

  if (error) {
    throw new Error(error.message || 'Passwort konnte nicht gesetzt werden');
  }

  return shapeRemoteUser(data);
}

async function upsertUserHighscoreRemote(name, mode, score) {
  if (!supabaseClient) return ensureUserRecordShape({ name, highscores: { [mode]: score } });

  const column = mode === 'split' ? 'split_highscore' : mode === 'pressure' ? 'pressure_highscore' : 'highscore';
  const payload = { username: name, [column]: score };

  const { data, error } = await supabaseClient
    .from('game_scores')
    .upsert(payload, { onConflict: 'username' })
    .select('username, highscore, split_highscore, pressure_highscore')
    .single();

  if (error) {
    throw new Error(error.message || 'Highscore konnte nicht gespeichert werden');
  }

  return ensureUserRecordShape({
    name: data.username,
    highscores: { normal: data.highscore, split: data.split_highscore, pressure: data.pressure_highscore }
  });
}

async function submitFeedbackRemote(message) {
  if (!supabaseClient) {
    alert('Feedback konnte nicht gesendet werden: keine Verbindung verfügbar.');
    return false;
  }

  const payload = {
    user_name: currentUser?.name || 'Gast',
    message,
    user_agent: navigator.userAgent
  };

  const { data, error } = await supabaseClient.functions.invoke('send-feedback-email', {
    body: payload
  });

  if (error || data?.error) {
    console.warn('Feedback konnte nicht gesendet werden:', error?.message || data?.error);
    alert('Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.');
    return false;
  }

  alert('Vielen Dank! Dein Feedback wurde gesendet.');
  return true;
}

function getStoredCurrentUserName() {
  return localStorage.getItem(storageKeys.currentUser);
}

function storeCurrentUserName(name) {
  if (name) {
    localStorage.setItem(storageKeys.currentUser, name);
  } else {
    localStorage.removeItem(storageKeys.currentUser);
  }
}

function updateCurrentUserHighscoreDisplay() {
  if (!currentUser) {
    userHighscoreNormal.textContent = '0';
    userHighscoreSplit.textContent = '0';
    userHighscorePressure.textContent = '0';
    return;
  }

  userHighscoreNormal.textContent = String(getScore(currentUser, 'normal'));
  userHighscoreSplit.textContent = String(getScore(currentUser, 'split'));
  userHighscorePressure.textContent = String(getScore(currentUser, 'pressure'));
}

function setCurrentUser(user) {
  currentUser = user ? ensureUserRecordShape(user) : null;
  usernameValue.textContent = currentUser?.name || '';
  updateCurrentUserHighscoreDisplay();
  storeCurrentUserName(currentUser?.name || '');
}

async function updateCurrentUserHighscore(score) {
  if (!currentUser) return;
  if (!Number.isFinite(score) || score < 0) return;

  const previousBest = getScore(currentUser, currentMode);
  if (score <= previousBest) return;

  currentUser.highscores[currentMode] = score;
  upsertUserCache(currentUser.name, currentMode, score);
  updateCurrentUserHighscoreDisplay();
  showNewHighscoreMessage();

  try {
    const remoteUser = await upsertUserHighscoreRemote(currentUser.name, currentMode, score);
    currentUser.highscores.normal = Math.max(getScore(currentUser, 'normal'), getScore(remoteUser, 'normal'));
    currentUser.highscores.split = Math.max(getScore(currentUser, 'split'), getScore(remoteUser, 'split'));
    currentUser.highscores.pressure = Math.max(getScore(currentUser, 'pressure'), getScore(remoteUser, 'pressure'));
    upsertUserCache(currentUser.name, 'normal', getScore(currentUser, 'normal'));
    upsertUserCache(currentUser.name, 'split', getScore(currentUser, 'split'));
    upsertUserCache(currentUser.name, 'pressure', getScore(currentUser, 'pressure'));
    updateCurrentUserHighscoreDisplay();
  } catch (error) {
    console.warn('Highscore konnte nicht synchronisiert werden:', error.message);
  }
}

function showGameElements() {
  alwaysVisibleInGame.forEach((element) => {
    element.classList.remove('hidden');
    element.hidden = false;
  });

  const modeDots = getDotsForMode();
  modeDots.forEach((dotElement) => {
    dotElement.classList.remove('hidden');
    dotElement.hidden = false;
  });

  const inactiveDots = currentMode === 'split' ? [] : [dotSplit];
  inactiveDots.forEach((dotElement) => {
    dotElement.classList.add('hidden');
    dotElement.hidden = true;
  });

  splitDivider.classList.toggle('hidden', currentMode !== 'split');
  splitDivider.hidden = currentMode !== 'split';
}

function hideGameElements() {
  [dot, dotSplit, splitDivider, ...alwaysVisibleInGame, tryAgainMessage, missIndicator, newHighscoreDisplay].forEach((element) => {
    element.classList.add('hidden');
    element.hidden = true;
  });
}

function getDotsForMode() {
  return currentMode === 'split' ? [dot, dotSplit] : [dot];
}

function isPressureMode() {
  return currentMode === 'pressure';
}

function updateModeButtons() {
  modeNormalButton.classList.toggle('active', currentMode === 'normal');
  modeSplitButton.classList.toggle('active', currentMode === 'split');
  modePressureButton.classList.toggle('active', currentMode === 'pressure');
}

function showStartMenu() {
  startScreen.classList.remove('hidden');
  modeScreen.classList.add('hidden');
  hideGameElements();
  closeSplitHint();
  closePressureHint();
  clearPendingTimers();
  misses = 0;
  splitSequenceLastTappedSide = null;
  updateSplitTargetHighlight();
  hideMissIndicator();
  hideTryAgainMessage();
  hideNewHighscoreMessage();
  updateDotColorByTaps();
}

function showModeScreen() {
  startScreen.classList.add('hidden');
  modeScreen.classList.remove('hidden');
  closeSplitHint();
  closePressureHint();
  hideGameElements();
  updateModeButtons();
}

function setHighscoreMode(mode) {
  selectedHighscoreMode = mode;
}

async function showHighscoreOverlay() {
  highscoreOverlay.classList.remove('hidden');

  const remoteTopTen = await fetchTopTenRemote();
  if (remoteTopTen) {
    renderHighscoreList(remoteTopTen, selectedHighscoreMode);
    return;
  }

  renderHighscoreList(userCache, selectedHighscoreMode);
}

function hideHighscoreOverlay() {
  highscoreOverlay.classList.add('hidden');
}

function clearAuthFields() {
  usernameInput.value = '';
  passwordInput.value = '';
  passwordConfirmInput.value = '';
}

function showUsernameOverlay(options = {}) {
  const mode = options.mode || authMode;
  const isRegister = mode === 'register';
  authMode = mode;
  usernameForm.dataset.mode = mode;

  authTitle.textContent = options.title || (isRegister ? 'Willkommen bei Silentap' : 'Bei Silentap anmelden');
  authDescription.textContent = options.description || (isRegister
    ? 'Wähle einen Usernamen und melde dich mit Passwort an.'
    : 'Melde dich mit Username und Passwort an.');

  passwordConfirmInput.classList.toggle('hidden', !isRegister);
  passwordConfirmInput.hidden = !isRegister;
  passwordConfirmLabel.classList.toggle('hidden', !isRegister);
  passwordConfirmLabel.hidden = !isRegister;
  passwordConfirmInput.required = isRegister;

  authRegisterButton.classList.toggle('active', isRegister);
  authLoginButton.classList.toggle('active', !isRegister);
  authRegisterButton.classList.toggle('secondary', !isRegister);
  authLoginButton.classList.toggle('secondary', isRegister);

  const allowCancel = Boolean(options.allowCancel && currentUser);
  authCancelButton.classList.toggle('hidden', !allowCancel);
  authCancelButton.hidden = !allowCancel;

  usernameError.textContent = options.message || '';
  usernameError.classList.toggle('hidden', !options.message);

  if (!options.keepValues) clearAuthFields();
  startScreen.classList.add('hidden');
  modeScreen.classList.add('hidden');
  usernameOverlay.classList.remove('hidden');
  usernameInput.focus({ preventScroll: true });
}

function hideUsernameOverlay() {
  usernameOverlay.classList.add('hidden');
  usernameError.textContent = '';
  usernameError.classList.add('hidden');
  clearAuthFields();
}

function showFeedbackOverlay(message = '') {
  feedbackError.textContent = message;
  feedbackError.classList.toggle('hidden', !message);
  feedbackOverlay.classList.remove('hidden');
  feedbackMessage.focus({ preventScroll: true });
}

function hideFeedbackOverlay() {
  feedbackOverlay.classList.add('hidden');
  feedbackError.textContent = '';
  feedbackError.classList.add('hidden');
  feedbackForm.reset();
}

function clearPendingTimers() {
  if (missResetMoveTimeoutId) {
    clearTimeout(missResetMoveTimeoutId);
    missResetMoveTimeoutId = null;
  }

  if (missIndicatorTimeoutId) {
    clearTimeout(missIndicatorTimeoutId);
    missIndicatorTimeoutId = null;
  }

  if (newHighscoreTimeoutId) {
    clearTimeout(newHighscoreTimeoutId);
    newHighscoreTimeoutId = null;
  }

  clearPressureModeTimer();
}

function setGameActive(active) {
  gameActive = active;
  hideMissIndicator();
  hideTryAgainMessage();

  if (gameActive) {
    startScreen.classList.add('hidden');
    modeScreen.classList.add('hidden');
    closeSplitHint();
    showGameElements();
    taps = 0;
    misses = 0;
    hasRoundStarted = false;
    splitSequenceLastTappedSide = null;
    counter.textContent = '0';
    resetDotColors();
    resetDots();
    clearPressureModeTimer();
    updateSplitTargetHighlight();
    stopAllMovement();
    if (isPressureMode()) {
      startPressureModeTimer();
    }
    void updateTicker();
  } else {
    clearPendingTimers();
    clearPressureModeTimer();
    stopAllMovement();
    splitSequenceLastTappedSide = null;
    updateSplitTargetHighlight();
    hideNewHighscoreMessage();
    hasRoundStarted = false;
  }
}

async function updateTicker() {
  if (!currentUser) {
    counter.textContent = '0';
    return;
  }

  const localRecord = getUserRecordFromCache(currentUser.name);
  if (localRecord) {
    currentUser = ensureUserRecordShape({ ...currentUser, highscores: localRecord.highscores });
    updateCurrentUserHighscoreDisplay();
  }

  const remoteUser = await fetchUserRemote(currentUser.name);
  if (remoteUser?.record) {
    currentUser = ensureUserRecordShape({
      ...currentUser,
      highscores: {
        normal: Math.max(getScore(currentUser, 'normal'), getScore(remoteUser.record, 'normal')),
        split: Math.max(getScore(currentUser, 'split'), getScore(remoteUser.record, 'split')),
        pressure: Math.max(getScore(currentUser, 'pressure'), getScore(remoteUser.record, 'pressure'))
      }
    });

    upsertUserCache(currentUser.name, 'normal', getScore(currentUser, 'normal'));
    upsertUserCache(currentUser.name, 'split', getScore(currentUser, 'split'));
    upsertUserCache(currentUser.name, 'pressure', getScore(currentUser, 'pressure'));
    updateCurrentUserHighscoreDisplay();
  }
}

function initUserFlow() {
  userCache = loadUsers();
  const storedCurrentUserName = getStoredCurrentUserName();

  if (storedCurrentUserName) {
    const cached = getUserRecordFromCache(storedCurrentUserName);
    if (cached) {
      setCurrentUser(cached);
      showStartMenu();
      void updateTicker();
      return;
    }
  }

  showUsernameOverlay({ mode: 'register' });
}

function showNewHighscoreMessage() {
  newHighscoreDisplay.classList.remove('hidden');
  newHighscoreDisplay.hidden = false;

  if (newHighscoreTimeoutId) {
    clearTimeout(newHighscoreTimeoutId);
  }

  newHighscoreTimeoutId = setTimeout(() => {
    hideNewHighscoreMessage();
  }, 1800);
}

function hideNewHighscoreMessage() {
  if (newHighscoreTimeoutId) {
    clearTimeout(newHighscoreTimeoutId);
    newHighscoreTimeoutId = null;
  }

  newHighscoreDisplay.classList.add('hidden');
  newHighscoreDisplay.hidden = true;
}

function updateSplitTargetHighlight() {
  if (currentMode !== 'split' || !gameActive) {
    dot.classList.remove('split-target');
    dotSplit.classList.remove('split-target');
    return;
  }

  if (!splitSequenceLastTappedSide) {
    dot.classList.remove('split-target');
    dotSplit.classList.remove('split-target');
    return;
  }

  const nextTargetIsLeft = splitSequenceLastTappedSide === 'right';
  dot.classList.toggle('split-target', nextTargetIsLeft);
  dotSplit.classList.toggle('split-target', !nextTargetIsLeft);
}

function getDotPosition(dotElement) {
  return {
    left: parseFloat(dotElement.style.left) || 0,
    top: parseFloat(dotElement.style.top) || 0
  };
}

function getViewportSize() {
  const viewportWidth = window.visualViewport?.width;
  const viewportHeight = window.visualViewport?.height;

  return {
    width: Math.round(viewportWidth || document.documentElement.clientWidth || window.innerWidth || 0),
    height: Math.round(viewportHeight || document.documentElement.clientHeight || window.innerHeight || 0)
  };
}

function getBoundsForDot(dotElement) {
  const padding = 10;
  const dotSize = dotElement.offsetWidth;
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();

  if (currentMode !== 'split') {
    return {
      minX: padding,
      minY: padding,
      maxX: Math.max(padding, viewportWidth - dotSize - padding),
      maxY: Math.max(padding, viewportHeight - dotSize - padding)
    };
  }

  const dividerWidth = splitDivider.offsetWidth || 14;
  const centerX = viewportWidth / 2;
  const leftHalfMaxX = centerX - (dividerWidth / 2) - dotSize - padding;
  const rightHalfMinX = centerX + (dividerWidth / 2) + padding;

  const isLeftDot = dotElement === dot;

  return {
    minX: isLeftDot ? padding : rightHalfMinX,
    minY: padding,
    maxX: isLeftDot ? Math.max(padding, leftHalfMaxX) : Math.max(rightHalfMinX, viewportWidth - dotSize - padding),
    maxY: Math.max(padding, viewportHeight - dotSize - padding)
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

    movementState.velocity = Math.min(movementState.velocity + 0.04, maxDotVelocity);
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
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();

  if (currentMode !== 'split') {
    return {
      left: `${(viewportWidth - dotSize) / 2}px`,
      top: `${(viewportHeight - dotSize) / 2}px`
    };
  }

  const quarterX = dotIndex === 0 ? viewportWidth * 0.25 : viewportWidth * 0.75;
  return {
    left: `${quarterX - (dotSize / 2)}px`,
    top: `${(viewportHeight - dotSize) / 2}px`
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


function clearPressureTensionClasses() {
  dot.classList.remove(...pressureModeClasses);
}

function updatePressureTensionVisual() {
  clearPressureTensionClasses();
  if (!isPressureMode() || !gameActive || !pressureModeStartedAt) return;

  const elapsed = Date.now() - pressureModeStartedAt;
  const ratio = Math.min(1, elapsed / pressureModeTimeLimitMs);

  if (ratio >= 0.66) {
    dot.classList.add('pressure-tension-high');
  } else if (ratio >= 0.33) {
    dot.classList.add('pressure-tension-medium');
  } else {
    dot.classList.add('pressure-tension-low');
  }
}

function clearPressureModeTimer() {
  if (pressureModeTimerId) {
    clearInterval(pressureModeTimerId);
    pressureModeTimerId = null;
  }
  pressureModeStartedAt = 0;
  clearPressureTensionClasses();
  dot.classList.remove('pressure-explode');
}

function resetRoundToCenterWithTryAgain() {
  taps = 0;
  misses = 0;
  triggerResetHaptic();
  splitSequenceLastTappedSide = null;
  counter.textContent = '0';
  hideMissIndicator();
  resetDotColors();
  resetDots();
  clearPressureModeTimer();
  requestAnimationFrame(() => {
    showTryAgainMessage();
  });
  hasRoundStarted = false;
  hideNewHighscoreMessage();
  updateSplitTargetHighlight();

  if (isPressureMode() && gameActive) {
    startPressureModeTimer();
  }
}

function triggerPressureExplosion() {
  if (!gameActive || !isPressureMode()) return;

  clearPressureModeTimer();
  dot.classList.add('pressure-explode');

  setTimeout(() => {
    dot.classList.remove('pressure-explode');
    if (!gameActive || !isPressureMode()) return;
    resetRoundToCenterWithTryAgain();
  }, 420);
}

function startPressureModeTimer() {
  if (!gameActive || !isPressureMode()) return;

  clearPressureModeTimer();
  pressureModeStartedAt = Date.now();
  updatePressureTensionVisual();

  pressureModeTimerId = setInterval(() => {
    if (!gameActive || !isPressureMode()) {
      clearPressureModeTimer();
      return;
    }

    const elapsed = Date.now() - pressureModeStartedAt;
    if (elapsed >= pressureModeTimeLimitMs) {
      triggerPressureExplosion();
      return;
    }

    updatePressureTensionVisual();
  }, 60);
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
  hideTryAgainMessage();
  hasRoundStarted = true;
  taps++;
  counter.textContent = String(taps);
  updateDotColorByTaps();
  updateCurrentUserHighscore(taps);
  getDotsForMode().forEach((dotElement) => moveDot(dotElement));

  if (isPressureMode()) {
    startPressureModeTimer();
  }
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


function hideMissIndicator() {
  if (missIndicatorTimeoutId) {
    clearTimeout(missIndicatorTimeoutId);
    missIndicatorTimeoutId = null;
  }

  missIndicator.classList.add('hidden');
  missIndicator.hidden = true;
}

function showMissIndicator(point) {
  if (!point || !gameActive) return;

  const { width: viewportWidth, height: viewportHeight } = getViewportSize();
  const indicatorSize = missIndicator.offsetWidth || 44;
  const safeLeft = Math.min(Math.max(point.x - (indicatorSize / 2), 8), viewportWidth - indicatorSize - 8);
  const safeTop = Math.min(Math.max(point.y - (indicatorSize / 2), 8), viewportHeight - indicatorSize - 8);

  missIndicator.style.left = `${safeLeft}px`;
  missIndicator.style.top = `${safeTop}px`;
  missIndicator.classList.remove('hidden');
  missIndicator.hidden = false;

  missIndicator.style.animation = 'none';
  void missIndicator.offsetWidth;
  missIndicator.style.animation = '';

  if (missIndicatorTimeoutId) {
    clearTimeout(missIndicatorTimeoutId);
  }

  missIndicatorTimeoutId = setTimeout(() => {
    missIndicatorTimeoutId = null;
    hideMissIndicator();
  }, 360);
}

function hideTryAgainMessage() {
  tryAgainMessage.classList.add('hidden');
  tryAgainMessage.hidden = true;
}

function getPrimaryDotForTryAgain() {
  const modeDots = getDotsForMode();
  const visiblePrimaryDot = modeDots.find((dotElement) => !dotElement.hidden && !dotElement.classList.contains('hidden'));
  return visiblePrimaryDot || modeDots[0] || dot;
}

function positionTryAgainMessage() {
  const primaryDot = getPrimaryDotForTryAgain();
  if (!primaryDot) return;

  const { width: viewportWidth } = getViewportSize();
  const dotRect = primaryDot.getBoundingClientRect();
  const messageWidth = tryAgainMessage.offsetWidth || 110;
  const messageHeight = tryAgainMessage.offsetHeight || 34;

  const centerX = dotRect.left + (dotRect.width / 2);
  const desiredLeft = centerX - (messageWidth / 2);
  const desiredTop = dotRect.top - messageHeight - 10;

  const left = Math.min(Math.max(desiredLeft, 8), viewportWidth - messageWidth - 8);
  const top = Math.max(desiredTop, 8);

  tryAgainMessage.style.left = `${left}px`;
  tryAgainMessage.style.top = `${top}px`;
}

function showTryAgainMessage() {
  tryAgainMessage.classList.remove('hidden');
  tryAgainMessage.hidden = false;
  positionTryAgainMessage();
}

function triggerResetHaptic() {
  const vibrate = navigator?.vibrate?.bind(navigator);
  if (!vibrate) return false;

  const patternTriggered = vibrate(resetVibrationPattern);
  if (patternTriggered === false) {
    return vibrate(resetVibrationDuration);
  }

  return patternTriggered;
}

function handleTap(event) {
  if (!gameActive) return;

  const target = event.target;
  const touchedDotElement = target?.closest?.('#dot, #dot-split');
  const isControlButton = target?.closest?.('#donate, #back-to-menu, #start-btn, #mode-back, #mode-normal, #mode-split, #feedback-btn, #feedback-cancel, #feedback-submit');
  if (isControlButton) return;

  const interactionPoints = getInteractionPoints(event);

  if (currentMode === 'split') {
    const leftHit = touchedDotElement === dot || interactionPoints.some((point) => isTapInsideDot(dot, point));
    const rightHit = touchedDotElement === dotSplit || interactionPoints.some((point) => isTapInsideDot(dotSplit, point));

    if (leftHit && rightHit) {
      return;
    } else if (leftHit || rightHit) {
      const tappedSide = leftHit ? 'left' : 'right';
      if (!splitSequenceLastTappedSide) {
        splitSequenceLastTappedSide = tappedSide;
        updateSplitTargetHighlight();
        return;
      }

      if (splitSequenceLastTappedSide !== tappedSide) {
        hitDot();
        splitSequenceLastTappedSide = null;
        updateSplitTargetHighlight();
        return;
      }

      splitSequenceLastTappedSide = tappedSide;
      updateSplitTargetHighlight();
      return;
    }
  } else {
    const tappedDot = touchedDotElement === dot || interactionPoints.some((point) => isTapInsideDot(dot, point));
    if (tappedDot) {
      hitDot();
      return;
    }
  }

  misses++;
  showMissIndicator(interactionPoints[0]);

  if (misses >= maxMisses) {
    if (missResetMoveTimeoutId) {
      clearTimeout(missResetMoveTimeoutId);
    }

    missResetMoveTimeoutId = setTimeout(() => {
      missResetMoveTimeoutId = null;
      resetRoundToCenterWithTryAgain();
    }, 420);
  }
}


function closeSplitHint() {
  splitHintOverlay.classList.add('hidden');
}

function showSplitHint() {
  splitHintOverlay.classList.remove('hidden');
}

function closePressureHint() {
  pressureHintOverlay.classList.add('hidden');
}

function showPressureHint() {
  pressureHintOverlay.classList.remove('hidden');
}

function applyMode(mode) {
  currentMode = mode;
  splitSequenceLastTappedSide = null;
  updateSplitTargetHighlight();
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

const handlePrimaryPointerDown = (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  handleTap(event);
};

if (window.PointerEvent) {
  document.addEventListener('pointerdown', handlePrimaryPointerDown);
} else {
  const isTouchDevice = 'ontouchstart' in window;
  document.addEventListener(isTouchDevice ? 'touchstart' : 'click', handleTap);
}

function syncGameLayoutToViewport() {
  if (gameActive) {
    resetDots();
    if (hasRoundStarted) {
      getDotsForMode().forEach((dotElement) => moveDot(dotElement));
    }

    if (!tryAgainMessage.hidden && !tryAgainMessage.classList.contains('hidden')) {
      positionTryAgainMessage();
    }
  }
}

window.addEventListener('resize', syncGameLayoutToViewport);
window.addEventListener('orientationchange', () => {
  requestAnimationFrame(syncGameLayoutToViewport);
});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncGameLayoutToViewport);
}

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
  showSplitHint();
});

modePressureButton.addEventListener('click', () => {
  applyMode('pressure');
  setGameActive(true);
  showPressureHint();
});

modeBackButton.addEventListener('click', () => {
  showStartMenu();
});

highscoreButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  setHighscoreMode(currentMode);
  showHighscoreOverlay();
});

highscoreModeNormalButton.addEventListener('click', async (event) => {
  event.preventDefault();
  setHighscoreMode('normal');
  await showHighscoreOverlay();
});

highscoreModeSplitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  setHighscoreMode('split');
  await showHighscoreOverlay();
});

highscoreModePressureButton.addEventListener('click', async (event) => {
  event.preventDefault();
  setHighscoreMode('pressure');
  await showHighscoreOverlay();
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

pressureHintCloseButton.addEventListener('click', (event) => {
  event.preventDefault();
  closePressureHint();
});

pressureHintOverlay.addEventListener('click', (event) => {
  if (event.target === pressureHintOverlay) {
    closePressureHint();
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
      upsertUserCache(authUser.record.name, 'pressure', getScore(authUser.record, 'pressure'));
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
    upsertUserCache(authUser.record.name, 'pressure', getScore(authUser.record, 'pressure'));
    setCurrentUser(authUser.record);
    await updateTicker();
    showStartMenu();
  } catch {
    showUsernameOverlay({ mode, message: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.', keepValues: true });
  }
});

setGameActive(false);
initUserFlow();

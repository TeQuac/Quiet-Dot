const dot = document.getElementById('dot');
const dotSplit = document.getElementById('dot-split');
const splitDivider = document.getElementById('split-divider');
const counter = document.getElementById('counter');
const newHighscoreDisplay = document.getElementById('new-highscore');
const missIndicator = document.getElementById('miss-indicator');
const tryAgainMessage = document.getElementById('try-again');
const donate = document.getElementById('donate');
const backToMenu = document.getElementById('back-to-menu');

const introOverlay = document.getElementById('intro-overlay');
const introAcceptButton = document.getElementById('intro-accept');
const introDeclineButton = document.getElementById('intro-decline');
const introCloseHint = document.getElementById('intro-close-hint');
const introPreviewLabel = document.getElementById('intro-preview-label');
const introPreviewStage = document.getElementById('intro-preview-stage');

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
const settingsOverlay = document.getElementById('settings-overlay');
const settingsButton = document.getElementById('settings-button');
const settingsCloseButton = document.getElementById('settings-close');
const settingsLanguageButton = document.getElementById('settings-language-button');
const settingsLanguageLabel = document.getElementById('settings-language-label');
const userHighscoreNormalLabel = document.getElementById('user-highscore-normal-label');
const userHighscoreSplitLabel = document.getElementById('user-highscore-split-label');
const userHighscorePressureLabel = document.getElementById('user-highscore-pressure-label');
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
  currentUser: 'silentapCurrentUser',
  language: 'silentapLanguage',
  introSeen: 'silentapIntroSeen'
};

const gameModes = {
  normal: { labelKey: 'modeNormal' },
  split: { labelKey: 'modeSplit' },
  pressure: { labelKey: 'modePressure' }
};

const developerEmail = 'te.quac@web.de';


const supportedLanguages = ['de', 'en', 'ru', 'tr', 'zh'];
const languageNames = {
  de: 'Deutsch',
  en: 'English',
  ru: 'Русский',
  tr: 'Türkçe',
  zh: '中文'
};

const translations = {
  de: {
    authWelcome: 'Willkommen bei Silentap', authLoginTitle: 'Bei Silentap anmelden',
    authRegisterDescription: 'Wähle einen Usernamen und melde dich mit Passwort an.', authLoginDescription: 'Melde dich mit Username und Passwort an.',
    newUser: 'Neuer User', login: 'Anmelden', username: 'Username', usernamePlaceholder: 'Min. 3 Zeichen', password: 'Passwort', passwordPlaceholder: 'Mind. 4 Zeichen',
    passwordConfirm: 'Passwort wiederholen', passwordConfirmPlaceholder: 'Passwort wiederholen', save: 'Speichern', cancel: 'Abbrechen',
    feedbackTitle: 'Feedback senden', feedbackDescription: 'Teile Lob, Kritik oder Verbesserungsvorschläge.', message: 'Nachricht', feedbackPlaceholder: 'Deine Nachricht...', send: 'Senden',
    start: 'Start', switchUser: 'Anderen User anmelden', settingsTitle: 'Einstellungen', settingsOpen: 'Einstellungen öffnen', settingsClose: 'Schließen',
    settingsLanguageLabel: 'Sprache: {language}', settingsLanguageButton: 'Sprache ändern', feedbackToDev: 'Nachricht an Entwickler',
    highscoreAria: 'Top-10-Highscores öffnen', highscoreTitle: 'Top 10 Highscores', highscoreModesAria: 'Spielmodi für Highscores',
    noHighscores: 'Noch keine Highscores vorhanden.', noModeHighscores: 'Noch keine {mode}-Highscores vorhanden.', close: 'Schließen',
    splitHintTitle: 'Split-Modus Wertung', splitHintText: 'Ein Punkt zählt nur, wenn beide Punkte nacheinander getroffen werden – Reihenfolge egal.',
    splitCounts: '✅ zählt', splitNoCount: '❌ zählt nicht', understood: 'Verstanden',
    modeChoose: 'Spielmodus wählen', modeDescription: 'Normal: Ein Punkt über das ganze Feld.\nSplit: Zwei Hälften mit Mittelbalken und je ein Punkt pro Seite.\nDruck: Wie Normal, aber jeder Punkt muss in 5 Sekunden getroffen werden.',
    back: 'Zurück', pressureHintTitle: 'Druck-Modus', pressureHintText1: 'Du spielst wie im Normal-Modus, aber jeder Punkt hat nur 5 Sekunden Lebenszeit.', pressureHintText2: 'Mit jeder Sekunde wird der Punkt nervöser und zittert stärker. Triff ihn rechtzeitig – sonst explodiert er!',
    letsGo: "Los geht's", newHighscore: 'Highscore!', tryAgain: 'Nochmal!', backToMenu: '← Startmenü', support: '☕️ Support',
    alertFeedbackOffline: 'Feedback konnte nicht gesendet werden: keine Verbindung verfügbar.', alertFeedbackError: 'Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.', alertFeedbackSent: 'Vielen Dank! Dein Feedback wurde gesendet.',
    errFeedbackMinLength: 'Bitte mindestens 3 Zeichen eingeben.', errUsernameMin: 'Username muss mindestens 3 Zeichen lang sein.', errPasswordMin: 'Passwort muss mindestens 4 Zeichen lang sein.', errPasswordMismatch: 'Passwörter stimmen nicht überein.', errUsernameTaken: 'Dieser Username ist bereits vergeben.', errUserSave: 'User konnte nicht gespeichert werden. Bitte versuche es erneut.', errUserNotFound: 'User nicht gefunden. Bitte registrieren.', errPasswordWrong: 'Passwort ist nicht korrekt.', errLoginFailed: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
    modeNormal: 'Normal', modeSplit: 'Split', modePressure: 'Druck', modePressureLabel: 'Druck',
    introTitle: 'Willkommen bei Silentap 👋', introLead: 'Kurze Demo vor dem Login:',
    introModeNormal: 'Normal: Ein Punkt erscheint irgendwo auf dem Feld. Tippe ihn so schnell wie möglich an.',
    introModeSplit: 'Split: Zwei Punkte (links/rechts). Ein Punkt zählt nur, wenn du abwechselnd beide Seiten triffst.',
    introModePressure: 'Druck: Wie Normal, aber jeder Punkt lebt nur 5 Sekunden und explodiert sonst.',
    introQuestion: 'Möchtest du Silentap jetzt spielen?', introAccept: 'Ja, spielen', introDecline: 'Nein, schließen',
    introCloseHint: 'Der Tab konnte nicht automatisch geschlossen werden. Du kannst ihn jetzt manuell schließen.'
  },
  en: {
    authWelcome: 'Welcome to Silentap', authLoginTitle: 'Sign in to Silentap', authRegisterDescription: 'Choose a username and sign in with a password.', authLoginDescription: 'Sign in with username and password.',
    newUser: 'New user', login: 'Sign in', username: 'Username', usernamePlaceholder: 'Min. 3 characters', password: 'Password', passwordPlaceholder: 'Min. 4 characters', passwordConfirm: 'Repeat password', passwordConfirmPlaceholder: 'Repeat password', save: 'Save', cancel: 'Cancel',
    feedbackTitle: 'Send feedback', feedbackDescription: 'Share praise, criticism or suggestions.', message: 'Message', feedbackPlaceholder: 'Your message...', send: 'Send',
    start: 'Start', switchUser: 'Sign in as another user', settingsTitle: 'Settings', settingsOpen: 'Open settings', settingsClose: 'Close', settingsLanguageLabel: 'Language: {language}', settingsLanguageButton: 'Change language', feedbackToDev: 'Message to developer',
    highscoreAria: 'Open top-10 highscores', highscoreTitle: 'Top 10 highscores', highscoreModesAria: 'Game modes for highscores', noHighscores: 'No highscores yet.', noModeHighscores: 'No {mode} highscores yet.', close: 'Close',
    splitHintTitle: 'Split mode scoring', splitHintText: 'A point only counts if both dots are hit consecutively – order does not matter.', splitCounts: '✅ counts', splitNoCount: '❌ does not count', understood: 'Understood',
    modeChoose: 'Choose game mode', modeDescription: 'Normal: One dot on the full field.\nSplit: Two halves with middle bar and one dot per side.\nPressure: Like Normal, but each dot must be hit within 5 seconds.', back: 'Back', pressureHintTitle: 'Pressure mode', pressureHintText1: 'You play like in Normal mode, but each dot only lives for 5 seconds.', pressureHintText2: 'With every second the dot gets more nervous and shakes harder. Hit it in time – otherwise it explodes!', letsGo: "Let's go", newHighscore: 'Highscore!', tryAgain: 'Try again!', backToMenu: '← Start menu', support: '☕️ Support', userHighscoreLine: 'Normal: {normal} | Split: {split} | Pressure: {pressure}',
    alertFeedbackOffline: 'Feedback could not be sent: no connection available.', alertFeedbackError: 'Feedback could not be sent. Please try again later.', alertFeedbackSent: 'Thank you! Your feedback has been sent.',
    errFeedbackMinLength: 'Please enter at least 3 characters.', errUsernameMin: 'Username must be at least 3 characters long.', errPasswordMin: 'Password must be at least 4 characters long.', errPasswordMismatch: 'Passwords do not match.', errUsernameTaken: 'This username is already taken.', errUserSave: 'User could not be saved. Please try again.', errUserNotFound: 'User not found. Please register.', errPasswordWrong: 'Password is incorrect.', errLoginFailed: 'Login failed. Please try again.', modeNormal: 'Normal', modeSplit: 'Split', modePressure: 'Pressure', modePressureLabel: 'Pressure',
    introTitle: 'Welcome to Silentap 👋', introLead: 'Quick demo before login:',
    introModeNormal: 'Normal: One dot appears anywhere on the field. Tap it as quickly as possible.',
    introModeSplit: 'Split: Two dots (left/right). A point counts only when you alternate between both sides.',
    introModePressure: 'Pressure: Like Normal, but each dot only lives for 5 seconds and explodes otherwise.',
    introQuestion: 'Do you want to play Silentap now?', introAccept: 'Yes, play', introDecline: 'No, close',
    introCloseHint: 'The tab could not be closed automatically. Please close it manually.'
  },
  ru: {
    authWelcome: 'Добро пожаловать в Silentap',
authLoginTitle: 'Войти в Silentap',
authRegisterDescription: 'Выбери имя пользователя и зарегистрируйся с паролем.',
authLoginDescription: 'Войди с именем пользователя и паролем.',
newUser: 'Новый пользователь',
login: 'Войти',
username: 'Имя пользователя',
usernamePlaceholder: 'Мин. 3 символа',
password: 'Пароль',
passwordPlaceholder: 'Мин. 4 символа',
passwordConfirm: 'Повторить пароль',
passwordConfirmPlaceholder: 'Повторить пароль',
save: 'Сохранить',
cancel: 'Отмена',
feedbackTitle: 'Отправить отзыв',
feedbackDescription: 'Поделись похвалой, критикой или предложениями по улучшению.',
message: 'Сообщение',
feedbackPlaceholder: 'Твоё сообщение...',
send: 'Отправить',
start: 'Старт',
switchUser: 'Войти под другим пользователем',
settingsTitle: 'Настройки',
settingsOpen: 'Открыть настройки',
settingsClose: 'Закрыть',
settingsLanguageLabel: 'Язык: {language}',
settingsLanguageButton: 'Изменить язык',
feedbackToDev: 'Сообщение разработчику',
highscoreAria: 'Открыть топ-10 рекордов',
highscoreTitle: 'Топ-10 рекордов',
highscoreModesAria: 'Режимы игры для рекордов',
noHighscores: 'Рекордов пока нет.',
noModeHighscores: 'Рекордов для режима {mode} пока нет.',
close: 'Закрыть',
splitHintTitle: 'Подсчёт очков в двойном режиме',
splitHintText: 'Очко засчитывается только если обе точки попадены подряд — порядок не важен.',
splitCounts: '✅ засчитывается',
splitNoCount: '❌ не засчитывается',
understood: 'Понятно',
modeChoose: 'Выбери режим игры',
modeDescription: 'Обычный: одно очко на всё поле.\nДвойной: две половины с центральной перегородкой и по одному очку на каждую сторону.\nДавление: как Обычный, но каждую точку нужно попасть за 5 секунд.',
back: 'Назад',
pressureHintTitle: 'Режим Давление',
pressureHintText1: 'Ты играешь как в обычном режиме, но у каждой точки есть только 5 секунд жизни.',
pressureHintText2: 'С каждой секундой точка становится всё нервнее и сильнее дрожит. Попади вовремя — иначе она взорвётся!',
letsGo: "Поехали!",
newHighscore: 'Рекорд!',
tryAgain: 'Ещё раз!',
backToMenu: '← Главное меню',
support: '☕️ Поддержать',
alertFeedbackOffline: 'Не удалось отправить отзыв: нет подключения.',
alertFeedbackError: 'Не удалось отправить отзыв. Пожалуйста, попробуй позже.',
alertFeedbackSent: 'Спасибо! Твой отзыв отправлен.',
errFeedbackMinLength: 'Пожалуйста, введи минимум 3 символа.',
errUsernameMin: 'Имя пользователя должно быть не короче 3 символов.',
errPasswordMin: 'Пароль должен быть не короче 4 символов.',
errPasswordMismatch: 'Пароли не совпадают.',
errUsernameTaken: 'Это имя пользователя уже занято.',
errUserSave: 'Не удалось сохранить пользователя. Пожалуйста, попробуй ещё раз.',
errUserNotFound: 'Пользователь не найден. Пожалуйста, зарегистрируйся.',
errPasswordWrong: 'Неверный пароль.',
errLoginFailed: 'Вход не выполнен. Пожалуйста, попробуй снова.',
modeNormal: 'Обычный',
modeSplit: 'Двойной',
modePressure: 'Давление',
modePressureLabel: 'Давление'
  },
};

let currentLanguage = localStorage.getItem(storageKeys.language) || 'de';
if (!supportedLanguages.includes(currentLanguage)) currentLanguage = 'de';
let translationCache = {};
let introDemoIntervalId = null;
let introDemoModeIndex = 0;
const introDemoModes = ['normal', 'split', 'pressure'];

function template(text, vars = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

async function translateTextSmart(sourceText, targetLang) {
  const cacheKey = `${targetLang}:${sourceText}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  if (supportedLanguages.includes(targetLang)) {
    const sourceLang = 'de';
    try {
      const response = await fetch('https://translate.argosopentech.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: sourceText, source: sourceLang, target: targetLang, format: 'text' })
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.translatedText) {
          translationCache[cacheKey] = data.translatedText;
          return data.translatedText;
        }
      }
    } catch {
      return sourceText;
    }
  }

  return sourceText;
}

function t(key, vars = {}) {
  const dictionary = translations[currentLanguage] || translations.de;
  const base = dictionary[key] || translations.de[key] || key;
  return template(base, vars);
}

async function ensureLanguageDictionary(language) {
  if (language === 'de' || translations[language]) return;
  translations[language] = {};
  for (const [key, value] of Object.entries(translations.de)) {
    translations[language][key] = await translateTextSmart(value, language);
  }
}

async function setLanguage(language) {
  if (!supportedLanguages.includes(language)) return;
  await ensureLanguageDictionary(language);
  currentLanguage = language;
  localStorage.setItem(storageKeys.language, language);
  applyTranslations();
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;

  document.getElementById('intro-title').textContent = t('introTitle');
  document.getElementById('intro-lead').textContent = t('introLead');
  const introModeItems = document.querySelectorAll('.intro-mode-list li');
  if (introModeItems[0]) introModeItems[0].innerHTML = `<strong>${t('modeNormal')}:</strong> ${t('introModeNormal').replace(/^Normal:\s*/, '')}`;
  if (introModeItems[1]) introModeItems[1].innerHTML = `<strong>${t('modeSplit')}:</strong> ${t('introModeSplit').replace(/^Split:\s*/, '')}`;
  if (introModeItems[2]) introModeItems[2].innerHTML = `<strong>${t('modePressureLabel')}:</strong> ${t('introModePressure').replace(/^[^:]+:\s*/, '')}`;
  document.querySelector('.intro-question').textContent = t('introQuestion');
  introAcceptButton.textContent = t('introAccept');
  introDeclineButton.textContent = t('introDecline');
  introCloseHint.textContent = t('introCloseHint');
  updateIntroDemoVisual(false);

  authRegisterButton.textContent = t('newUser');
  authLoginButton.textContent = t('login');
  document.querySelector('label[for="username-input"]').textContent = t('username');
  document.querySelector('label[for="password-input"]').textContent = t('password');
  passwordConfirmLabel.textContent = t('passwordConfirm');
  usernameInput.placeholder = t('usernamePlaceholder');
  passwordInput.placeholder = t('passwordPlaceholder');
  passwordConfirmInput.placeholder = t('passwordConfirmPlaceholder');
  usernameSave.textContent = t('save');
  authCancelButton.textContent = t('cancel');

  document.querySelector('#feedback-form h2').textContent = t('feedbackTitle');
  document.querySelector('#feedback-form p').textContent = t('feedbackDescription');
  document.querySelector('label[for="feedback-message"]').textContent = t('message');
  feedbackMessage.placeholder = t('feedbackPlaceholder');
  document.getElementById('feedback-send').textContent = t('send');
  feedbackCancel.textContent = t('cancel');

  startButton.textContent = t('start');
  switchUserButton.textContent = t('switchUser');
  settingsButton.setAttribute('aria-label', t('settingsOpen'));
  highscoreButton.setAttribute('aria-label', t('highscoreAria'));

  document.getElementById('settings-title').textContent = t('settingsTitle');
  settingsLanguageLabel.textContent = t('settingsLanguageLabel', { language: languageNames[currentLanguage] || currentLanguage });
  settingsLanguageButton.textContent = t('settingsLanguageButton');
  feedbackButton.textContent = t('feedbackToDev');
  settingsCloseButton.textContent = t('settingsClose');

  document.getElementById('highscore-title').textContent = t('highscoreTitle');
  document.querySelector('.highscore-mode-selector').setAttribute('aria-label', t('highscoreModesAria'));
  highscoreModeNormalButton.textContent = t('modeNormal');
  highscoreModeSplitButton.textContent = t('modeSplit');
  highscoreModePressureButton.textContent = t('modePressureLabel');
  highscoreCloseButton.textContent = t('close');

  document.getElementById('split-hint-title').textContent = t('splitHintTitle');
  document.querySelector('#split-hint-overlay p').textContent = t('splitHintText');
  document.querySelector('.hint-row.success .hint-label').textContent = t('splitCounts');
  document.querySelector('.hint-row.fail .hint-label').textContent = t('splitNoCount');
  splitHintCloseButton.textContent = t('understood');

  document.querySelector('#mode-screen h2').textContent = t('modeChoose');
  document.querySelector('#mode-screen p').innerHTML = t('modeDescription').replace(/\n/g, '<br>');
  modeNormalButton.textContent = t('modeNormal');
  modeSplitButton.textContent = t('modeSplit');
  modePressureButton.textContent = t('modePressureLabel');
  modeBackButton.textContent = t('back');

  document.getElementById('pressure-hint-title').textContent = t('pressureHintTitle');
  const pressureParagraphs = document.querySelectorAll('#pressure-hint-overlay p');
  pressureParagraphs[0].textContent = t('pressureHintText1');
  pressureParagraphs[1].textContent = t('pressureHintText2');
  pressureHintCloseButton.textContent = t('letsGo');

  newHighscoreDisplay.textContent = t('newHighscore');
  tryAgainMessage.textContent = t('tryAgain');
  backToMenu.textContent = t('backToMenu');
  donate.textContent = t('support');

  userHighscoreNormalLabel.textContent = `${t('modeNormal')}:`;
  userHighscoreSplitLabel.textContent = `${t('modeSplit')}:`;
  userHighscorePressureLabel.textContent = `${t('modePressureLabel')}:`;

  authTitle.textContent = authMode === 'register' ? t('authWelcome') : t('authLoginTitle');
  authDescription.textContent = authMode === 'register' ? t('authRegisterDescription') : t('authLoginDescription');

  updateCurrentUserHighscoreDisplay();
  if (!highscoreEmpty.classList.contains('hidden')) {
    highscoreEmpty.textContent = t('noHighscores');
  }
}


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
const movementInsetRatioX = 0;
const movementInsetRatioY = 0;
const minTeleportDistanceCm = 5;
const pixelsPerCentimeter = 37.8;

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
    highscoreEmpty.textContent = t('noModeHighscores', { mode: t(gameModes[mode].labelKey) });
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

  let { data, error } = await supabaseClient.rpc('submit_score_mode', {
    p_username: name,
    p_mode: mode,
    p_score: score
  });

  if (error && mode === 'normal' && /submit_score_mode/i.test(error.message || '')) {
    ({ data, error } = await supabaseClient.rpc('submit_score', {
      p_username: name,
      p_score: score
    }));
  }

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
    alert(t('alertFeedbackOffline'));
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
    alert(t('alertFeedbackError'));
    return false;
  }

  alert(t('alertFeedbackSent'));
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
  const normalScore = currentUser ? String(getScore(currentUser, 'normal')) : '0';
  const splitScore = currentUser ? String(getScore(currentUser, 'split')) : '0';
  const pressureScore = currentUser ? String(getScore(currentUser, 'pressure')) : '0';

  userHighscoreNormal.textContent = normalScore;
  userHighscoreSplit.textContent = splitScore;
  userHighscorePressure.textContent = pressureScore;
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

  authTitle.textContent = options.title || (isRegister ? t('authWelcome') : t('authLoginTitle'));
  authDescription.textContent = options.description || (isRegister
    ? t('authRegisterDescription')
    : t('authLoginDescription'));

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

function showSettingsOverlay() {
  settingsOverlay.classList.remove('hidden');
}

function hideSettingsOverlay() {
  settingsOverlay.classList.add('hidden');
}

async function cycleLanguage() {
  const index = supportedLanguages.indexOf(currentLanguage);
  const nextLanguage = supportedLanguages[(index + 1) % supportedLanguages.length];
  await setLanguage(nextLanguage);
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



function setIntroDemoMode(mode) {
  const modeKey = introDemoModes.includes(mode) ? mode : 'normal';
  introPreviewStage.dataset.mode = modeKey;
  introPreviewLabel.textContent = t(gameModes[modeKey].labelKey);
}

function updateIntroDemoVisual(advance = true) {
  if (advance) {
    introDemoModeIndex = (introDemoModeIndex + 1) % introDemoModes.length;
  }
  setIntroDemoMode(introDemoModes[introDemoModeIndex]);
}

function startIntroDemoLoop() {
  if (introDemoIntervalId) return;
  updateIntroDemoVisual(false);
  introDemoIntervalId = setInterval(() => {
    updateIntroDemoVisual(true);
  }, 2400);
}

function stopIntroDemoLoop() {
  if (!introDemoIntervalId) return;
  clearInterval(introDemoIntervalId);
  introDemoIntervalId = null;
}

function showIntroOverlay() {
  introCloseHint.classList.add('hidden');
  introOverlay.classList.remove('hidden');
  startIntroDemoLoop();
}

function hideIntroOverlay() {
  introOverlay.classList.add('hidden');
  stopIntroDemoLoop();
}

function tryCloseAppTab() {
  window.close();
  setTimeout(() => {
    if (!document.hidden) {
      introCloseHint.classList.remove('hidden');
    }
  }, 200);
}

function initAppFlow() {
  const hasSeenIntro = localStorage.getItem(storageKeys.introSeen) === '1';
  if (!hasSeenIntro) {
    showIntroOverlay();
    return;
  }

  initUserFlow();
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
  }, 5000);
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

function getVisibleRect(element) {
  if (!element || element.hidden || element.classList.contains('hidden')) return null;

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return rect;
}

function overlapsRect(rectA, rectB) {
  return !(
    rectA.right <= rectB.left ||
    rectA.left >= rectB.right ||
    rectA.bottom <= rectB.top ||
    rectA.top >= rectB.bottom
  );
}

function getBlockingRects() {
  return avoidElements.map(getVisibleRect).filter(Boolean);
}

function getBoundsForDot(dotElement) {
  const padding = 0;
  const dotSize = dotElement.offsetWidth;
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();
  const applyMovementInsets = (rawBounds) => {
    const horizontalRange = Math.max(0, rawBounds.maxX - rawBounds.minX);
    const verticalRange = Math.max(0, rawBounds.maxY - rawBounds.minY);
    const insetX = horizontalRange * movementInsetRatioX;
    const insetY = verticalRange * movementInsetRatioY;

    const minX = Math.min(rawBounds.maxX, rawBounds.minX + insetX);
    const maxX = Math.max(minX, rawBounds.maxX - insetX);
    const minY = Math.min(rawBounds.maxY, rawBounds.minY + insetY);
    const maxY = Math.max(minY, rawBounds.maxY - insetY);

    return { minX, minY, maxX, maxY };
  };

  if (currentMode !== 'split') {
    return applyMovementInsets({
      minX: padding,
      minY: padding,
      maxX: Math.max(padding, viewportWidth - dotSize - padding),
      maxY: Math.max(padding, viewportHeight - dotSize - padding)
    });
  }

  const dividerWidth = splitDivider.offsetWidth || 14;
  const centerX = viewportWidth / 2;
  const leftHalfMaxX = centerX - (dividerWidth / 2) - dotSize - padding;
  const rightHalfMinX = centerX + (dividerWidth / 2) + padding;

  const isLeftDot = dotElement === dot;

  return applyMovementInsets({
    minX: isLeftDot ? padding : rightHalfMinX,
    minY: padding,
    maxX: isLeftDot ? Math.max(padding, leftHalfMaxX) : Math.max(rightHalfMinX, viewportWidth - dotSize - padding),
    maxY: Math.max(padding, viewportHeight - dotSize - padding)
  });
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

    const previousPosition = { ...movementState.position };
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

    const dotRect = {
      left: movementState.position.left,
      right: movementState.position.left + dotElement.offsetWidth,
      top: movementState.position.top,
      bottom: movementState.position.top + dotElement.offsetHeight
    };
    const previousDotRect = {
      left: previousPosition.left,
      right: previousPosition.left + dotElement.offsetWidth,
      top: previousPosition.top,
      bottom: previousPosition.top + dotElement.offsetHeight
    };

    getBlockingRects().forEach((blockRect) => {
      if (!overlapsRect(dotRect, blockRect)) return;

      if (previousDotRect.right <= blockRect.left) {
        movementState.position.left = blockRect.left - dotElement.offsetWidth;
        movementState.direction.x = -Math.abs(movementState.direction.x);
      } else if (previousDotRect.left >= blockRect.right) {
        movementState.position.left = blockRect.right;
        movementState.direction.x = Math.abs(movementState.direction.x);
      } else if (previousDotRect.bottom <= blockRect.top) {
        movementState.position.top = blockRect.top - dotElement.offsetHeight;
        movementState.direction.y = -Math.abs(movementState.direction.y);
      } else if (previousDotRect.top >= blockRect.bottom) {
        movementState.position.top = blockRect.bottom;
        movementState.direction.y = Math.abs(movementState.direction.y);
      } else {
        const pushLeft = Math.abs(dotRect.right - blockRect.left);
        const pushRight = Math.abs(blockRect.right - dotRect.left);
        const pushTop = Math.abs(dotRect.bottom - blockRect.top);
        const pushBottom = Math.abs(blockRect.bottom - dotRect.top);
        const minOverlap = Math.min(pushLeft, pushRight, pushTop, pushBottom);

        if (minOverlap === pushLeft) {
          movementState.position.left = blockRect.left - dotElement.offsetWidth;
          movementState.direction.x = -Math.abs(movementState.direction.x);
        } else if (minOverlap === pushRight) {
          movementState.position.left = blockRect.right;
          movementState.direction.x = Math.abs(movementState.direction.x);
        } else if (minOverlap === pushTop) {
          movementState.position.top = blockRect.top - dotElement.offsetHeight;
          movementState.direction.y = -Math.abs(movementState.direction.y);
        } else {
          movementState.position.top = blockRect.bottom;
          movementState.direction.y = Math.abs(movementState.direction.y);
        }
      }

      dotRect.left = movementState.position.left;
      dotRect.right = movementState.position.left + dotElement.offsetWidth;
      dotRect.top = movementState.position.top;
      dotRect.bottom = movementState.position.top + dotElement.offsetHeight;
    });

    dotElement.style.left = `${movementState.position.left}px`;
    dotElement.style.top = `${movementState.position.top}px`;

    movementAnimations.set(dotElement, requestAnimationFrame(animate));
  };

  const previousAnimation = movementAnimations.get(dotElement);
  if (previousAnimation) cancelAnimationFrame(previousAnimation);

  movementAnimations.set(dotElement, requestAnimationFrame(animate));
}

function moveDot(dotElement) {
  const avoidRects = getBlockingRects();
  const dotSize = dotElement.offsetWidth;
  const bounds = getBoundsForDot(dotElement);

  const previousPosition = getDotPosition(dotElement);
  let newX = previousPosition.left;
  let newY = previousPosition.top;

  const minTeleportDistancePx = minTeleportDistanceCm * pixelsPerCentimeter;
  const maxPossibleDistance = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const requiredDistance = Math.min(minTeleportDistancePx, maxPossibleDistance * 0.85);

  for (let attempt = 0; attempt < 40; attempt++) {
    const candidateX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
    const candidateY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
    const distanceToPrevious = Math.hypot(candidateX - previousPosition.left, candidateY - previousPosition.top);
    const dotRect = {
      left: candidateX,
      right: candidateX + dotSize,
      top: candidateY,
      bottom: candidateY + dotSize
    };

    const overlapsAvoid = avoidRects.some((rect) => overlapsRect(dotRect, rect));
    if (distanceToPrevious < requiredDistance || overlapsAvoid) continue;
    newX = candidateX;
    newY = candidateY;
    break;
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

function isElementVisible(element) {
  return Boolean(element) && !element.hidden && !element.classList.contains('hidden');
}

function isGameplayOverlayOpen() {
  return [splitHintOverlay, pressureHintOverlay, highscoreOverlay, settingsOverlay, feedbackOverlay, usernameOverlay]
    .some((overlayElement) => isElementVisible(overlayElement));
}

function handleTap(event) {
  if (!gameActive) return;
  if (isGameplayOverlayOpen()) return;

  const target = event.target;
  const touchedDotElement = target?.closest?.('#dot, #dot-split');
  const isControlButton = target?.closest?.('#donate, #back-to-menu, #start-btn, #mode-back, #mode-normal, #mode-split, #mode-pressure, #feedback-btn, #feedback-cancel, #feedback-submit');
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


introAcceptButton.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.setItem(storageKeys.introSeen, '1');
  hideIntroOverlay();
  initUserFlow();
});

introDeclineButton.addEventListener('click', (event) => {
  event.preventDefault();
  tryCloseAppTab();
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

settingsButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  showSettingsOverlay();
});

settingsCloseButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideSettingsOverlay();
});

settingsOverlay.addEventListener('click', (event) => {
  if (event.target === settingsOverlay) {
    hideSettingsOverlay();
  }
});

settingsLanguageButton.addEventListener('click', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  await cycleLanguage();
});

feedbackButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideSettingsOverlay();
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
    showFeedbackOverlay(t('errFeedbackMinLength'));
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
    showUsernameOverlay({ mode, message: t('errUsernameMin'), keepValues: true });
    return;
  }

  if (password.length < 4) {
    showUsernameOverlay({ mode, message: t('errPasswordMin'), keepValues: true });
    return;
  }

  const passwordHash = await hashPassword(password);

  if (mode === 'register') {
    if (password !== confirmPassword) {
      showUsernameOverlay({ mode, message: t('errPasswordMismatch'), keepValues: true });
      return;
    }

    const remoteUser = await fetchUserRemote(name);
    if (remoteUser?.passwordHash) {
      showUsernameOverlay({ mode, message: t('errUsernameTaken'), keepValues: true });
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
      showUsernameOverlay({ mode, message: t('errUserSave'), keepValues: true });
    }

    return;
  }

  const remoteUser = await fetchUserRemote(name);
  if (!remoteUser) {
    showUsernameOverlay({ mode, message: t('errUserNotFound'), keepValues: true });
    return;
  }

  try {
    let authUser = remoteUser;
    if (!remoteUser.passwordHash) {
      authUser = await setUserPasswordRemote(name, passwordHash);
    } else if (remoteUser.passwordHash !== passwordHash) {
      showUsernameOverlay({ mode, message: t('errPasswordWrong'), keepValues: true });
      return;
    }

    upsertUserCache(authUser.record.name, 'normal', getScore(authUser.record, 'normal'));
    upsertUserCache(authUser.record.name, 'split', getScore(authUser.record, 'split'));
    upsertUserCache(authUser.record.name, 'pressure', getScore(authUser.record, 'pressure'));
    setCurrentUser(authUser.record);
    await updateTicker();
    showStartMenu();
  } catch {
    showUsernameOverlay({ mode, message: t('errLoginFailed'), keepValues: true });
  }
});

setGameActive(false);
applyTranslations();
initAppFlow();

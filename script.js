const dot = document.getElementById('dot');
const dotSplit = document.getElementById('dot-split');
const splitDivider = document.getElementById('split-divider');
const counter = document.getElementById('counter');
const newHighscoreDisplay = document.getElementById('new-highscore');
const missIndicator = document.getElementById('miss-indicator');
const tryAgainMessage = document.getElementById('try-again');
const donate = document.getElementById('donate');
const backToMenu = document.getElementById('back-to-menu');
const blackhole = document.getElementById('blackhole');

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
const feedbackButton = document.getElementById('feedback-button');
const feedbackForm = document.getElementById('feedback-form');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackCancel = document.getElementById('feedback-cancel');
const feedbackError = document.getElementById('feedback-error');

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const switchUserButton = document.getElementById('switch-user-button');
const usernameValue = document.getElementById('username-value');
const highscoreButton = document.getElementById('highscore-button');
const highscoreOverlay = document.getElementById('highscore-overlay');
const highscoreModeNormalButton = document.getElementById('highscore-mode-normal');
const highscoreModeSplitButton = document.getElementById('highscore-mode-split');
const highscoreModePressureButton = document.getElementById('highscore-mode-pressure');
const highscoreModeBlackholeButton = document.getElementById('highscore-mode-blackhole');
const highscoreList = document.getElementById('highscore-list');
const highscoreEmpty = document.getElementById('highscore-empty');
const highscoreCloseButton = document.getElementById('highscore-close');

const highscoreModeButtons = [
  [highscoreModeNormalButton, 'normal'],
  [highscoreModeSplitButton, 'split'],
  [highscoreModePressureButton, 'pressure'],
  [highscoreModeBlackholeButton, 'blackhole']
];
highscoreModeButtons.forEach(([button, mode]) => button.dataset.mode = mode);

const modeScreen = document.getElementById('mode-screen');
const modeNormalButton = document.getElementById('mode-normal');
const modeSplitButton = document.getElementById('mode-split');
const modePressureButton = document.getElementById('mode-pressure');
const modeBlackholeButton = document.getElementById('mode-blackhole');
const modeBackButton = document.getElementById('mode-back');
const modeExplainOverlay = document.getElementById('mode-explain-overlay');
const modeExplainTitle = document.getElementById('mode-explain-title');
const modeExplainDescription = document.getElementById('mode-explain-description');
const modeExplainAnimation = document.getElementById('mode-explain-animation');
const modeExplainBackButton = document.getElementById('mode-explain-back');
const modeExplainStartButton = document.getElementById('mode-explain-start');
const splitHintOverlay = document.getElementById('split-hint-overlay');
const splitHintCloseButton = document.getElementById('split-hint-close');
const pressureHintOverlay = document.getElementById('pressure-hint-overlay');
const pressureHintCloseButton = document.getElementById('pressure-hint-close');
const blackholeHintOverlay = document.getElementById('blackhole-hint-overlay');
const blackholeHintCloseButton = document.getElementById('blackhole-hint-close');

const storageKeys = {
  users: 'silentapUsers',
  currentUser: 'silentapCurrentUser',
  language: 'silentapLanguage',
  introSeen: 'silentapIntroSeen'
};

const gameModes = {
  normal: { labelKey: 'modeNormal' },
  split: { labelKey: 'modeSplit' },
  pressure: { labelKey: 'modePressure' },
  blackhole: { labelKey: 'modeBlackhole' }
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
    modeChoose: 'Spielmodus wählen', modeVisualHint: 'Auswahl wird durch Animationen erklärt.', modeDescription: 'Normal: Ein Punkt über das ganze Feld.\nSplit: Zwei Hälften mit Mittelbalken und je ein Punkt pro Seite.\nDruck: Wie Normal, aber jeder Punkt muss in 5 Sekunden getroffen werden.\nSchwarzes Loch: Der Dot teleportiert nach oben und wird von unten angesaugt. Jeder Treffer erhöht die Saugkraft um 5%.',
    modeExplainTitle: 'So funktioniert {mode}', modeExplainStart: 'Spiel starten', modeExplainBack: 'Zurück',
    modeExplainNormal: 'Ein Punkt bewegt sich frei über das Feld. Jeder Treffer gibt einen Punkt.',
    modeExplainSplit: 'Treffe links und rechts abwechselnd. Nur der Wechsel zwischen den Seiten zählt.',
    modeExplainPressure: 'Wie Normal, aber jeder Punkt muss innerhalb von 5 Sekunden getroffen werden.',
    modeExplainBlackhole: 'Der Punkt wird nach unten gezogen. Mit jedem Treffer steigt die Sogkraft.',
    back: 'Zurück', pressureHintTitle: 'Druck-Modus', pressureHintText1: 'Du spielst wie im Normal-Modus, aber jeder Punkt hat nur 5 Sekunden Lebenszeit.', pressureHintText2: 'Mit jeder Sekunde wird der Punkt nervöser und zittert stärker. Triff ihn rechtzeitig – sonst explodiert er!', blackholeHintTitle: 'Schwarzes-Loch-Modus', blackholeHintText1: 'Der Dot startet in der Mitte und teleportiert bei jedem Treffer nach oben in eine zufällige Richtung.', blackholeHintText2: 'Unten rotiert ein Schwarzes Loch, das den Dot ansaugt. Jede Berührung erhöht die Saugkraft um 5%.',
    letsGo: "Los geht's", newHighscore: 'Highscore!', tryAgain: 'Nochmal!', backToMenu: '← Startmenü', support: '☕️ Support',
    alertFeedbackOffline: 'Feedback konnte nicht gesendet werden: keine Verbindung verfügbar.', alertFeedbackError: 'Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.', alertFeedbackSent: 'Vielen Dank! Dein Feedback wurde gesendet.',
    errFeedbackMinLength: 'Bitte mindestens 3 Zeichen eingeben.', errUsernameMin: 'Username muss mindestens 3 Zeichen lang sein.', errPasswordMin: 'Passwort muss mindestens 4 Zeichen lang sein.', errPasswordMismatch: 'Passwörter stimmen nicht überein.', errUsernameTaken: 'Dieser Username ist bereits vergeben.', errUserSave: 'User konnte nicht gespeichert werden. Bitte versuche es erneut.', errUserNotFound: 'User nicht gefunden. Bitte registrieren.', errPasswordWrong: 'Passwort ist nicht korrekt.', errLoginFailed: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
    modeNormal: 'Normal', modeSplit: 'Split', modePressure: 'Druck', modePressureLabel: 'Druck', modeBlackhole: 'Schwarzes Loch',
    introTitle: 'Willkommen bei Silentap 👋', introLead: 'Kurze Demo vor dem Login:',
    introModeNormal: 'Normal: Ein Punkt erscheint irgendwo auf dem Feld. Tippe ihn so schnell wie möglich an.',
    introModeSplit: 'Split: Zwei Punkte (links/rechts). Ein Punkt zählt nur, wenn du abwechselnd beide Seiten triffst.',
    introModePressure: 'Druck: Wie Normal, aber jeder Punkt lebt nur 5 Sekunden und explodiert sonst.',
    introModeBlackhole: 'Schwarzes Loch: Der Dot teleportiert nach oben und wird von unten immer stärker angesogen.',
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
    modeChoose: 'Choose game mode', modeVisualHint: 'Animations explain each mode.', modeDescription: 'Normal: One dot on the full field.\nSplit: Two halves with middle bar and one dot per side.\nPressure: Like Normal, but each dot must be hit within 5 seconds.\nBlack Hole: The dot teleports upward and is pulled from below. Every hit increases suction by 5%.', back: 'Back', pressureHintTitle: 'Pressure mode', pressureHintText1: 'You play like in Normal mode, but each dot only lives for 5 seconds.', pressureHintText2: 'With every second the dot gets more nervous and shakes harder. Hit it in time – otherwise it explodes!', blackholeHintTitle: 'Black Hole mode', blackholeHintText1: 'The dot starts in the middle and teleports upward in a random direction after each hit.', blackholeHintText2: 'A rotating black hole at the bottom pulls the dot in. Every hit increases suction by 5%.', letsGo: "Let's go", newHighscore: 'Highscore!', tryAgain: 'Try again!', backToMenu: '← Start menu', support: '☕️ Support', userHighscoreLine: 'Normal: {normal} | Split: {split} | Pressure: {pressure}',
    alertFeedbackOffline: 'Feedback could not be sent: no connection available.', alertFeedbackError: 'Feedback could not be sent. Please try again later.', alertFeedbackSent: 'Thank you! Your feedback has been sent.',
    errFeedbackMinLength: 'Please enter at least 3 characters.', errUsernameMin: 'Username must be at least 3 characters long.', errPasswordMin: 'Password must be at least 4 characters long.', errPasswordMismatch: 'Passwords do not match.', errUsernameTaken: 'This username is already taken.', errUserSave: 'User could not be saved. Please try again.', errUserNotFound: 'User not found. Please register.', errPasswordWrong: 'Password is incorrect.', errLoginFailed: 'Login failed. Please try again.', modeNormal: 'Normal', modeSplit: 'Split', modePressure: 'Pressure', modePressureLabel: 'Pressure', modeBlackhole: 'Black Hole',
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
modePressureLabel: 'Давление',
modeBlackhole: 'Чёрная дыра'
  },
  tr: {
  authWelcome: 'Silentap’e hoş geldin',
  authLoginTitle: 'Silentap’e giriş yap',
  authRegisterDescription: 'Bir kullanıcı adı seç ve şifreyle kayıt ol.',
  authLoginDescription: 'Kullanıcı adın ve şifrenle giriş yap.',
  newUser: 'Yeni kullanıcı',
  login: 'Giriş yap',
  username: 'Kullanıcı adı',
  usernamePlaceholder: 'En az 3 karakter',
  password: 'Şifre',
  passwordPlaceholder: 'En az 4 karakter',
  passwordConfirm: 'Şifreyi tekrar gir',
  passwordConfirmPlaceholder: 'Şifreyi tekrar gir',
  save: 'Kaydet',
  cancel: 'İptal',
  feedbackTitle: 'Geri bildirim gönder',
  feedbackDescription: 'Övgünü, eleştirini veya geliştirme önerilerini paylaş.',
  message: 'Mesaj',
  feedbackPlaceholder: 'Mesajın...',
  send: 'Gönder',
  start: 'Başla',
  switchUser: 'Başka bir kullanıcıyla giriş yap',
  settingsTitle: 'Ayarlar',
  settingsOpen: 'Ayarları aç',
  settingsClose: 'Kapat',
  settingsLanguageLabel: 'Dil: {language}',
  settingsLanguageButton: 'Dili değiştir',
  feedbackToDev: 'Geliştiriciye mesaj',
  highscoreAria: 'İlk 10 rekoru aç',
  highscoreTitle: 'İlk 10 rekor',
  highscoreModesAria: 'Rekorlar için oyun modları',
  noHighscores: 'Henüz rekor yok.',
  noModeHighscores: '{mode} modu için henüz rekor yok.',
  close: 'Kapat',
  splitHintTitle: 'Çift modda puanlama',
  splitHintText: 'Puan sadece iki noktaya da arka arkaya isabet edersen sayılır — sırası önemli değil.',
  splitCounts: '✅ sayılır',
  splitNoCount: '❌ sayılmaz',
  understood: 'Anladım',
  modeChoose: 'Oyun modunu seç',
  modeDescription:
    'Normal: tüm alan için tek puan.\nÇift: ortada bir bölme ile iki yarı ve her taraf için birer puan.\nBaskı: Normal gibi, ama her noktaya 5 saniye içinde isabet etmelisin.',
  back: 'Geri',
  pressureHintTitle: 'Baskı modu',
  pressureHintText1: 'Normal modda oynarsın, ama her noktanın sadece 5 saniyelik ömrü vardır.',
  pressureHintText2: 'Her saniye nokta daha da gerilir ve daha çok titrer. Zamanında vur — yoksa patlar!',
  letsGo: 'Haydi!',
  newHighscore: 'Rekor!',
  tryAgain: 'Tekrar dene!',
  backToMenu: '← Ana menü',
  support: '☕️ Destek ol',
  alertFeedbackOffline: 'Geri bildirim gönderilemedi: bağlantı yok.',
  alertFeedbackError: 'Geri bildirim gönderilemedi. Lütfen daha sonra tekrar dene.',
  alertFeedbackSent: 'Teşekkürler! Geri bildirimin gönderildi.',
  errFeedbackMinLength: 'Lütfen en az 3 karakter gir.',
  errUsernameMin: 'Kullanıcı adı en az 3 karakter olmalı.',
  errPasswordMin: 'Şifre en az 4 karakter olmalı.',
  errPasswordMismatch: 'Şifreler uyuşmuyor.',
  errUsernameTaken: 'Bu kullanıcı adı zaten alınmış.',
  errUserSave: 'Kullanıcı kaydedilemedi. Lütfen tekrar dene.',
  errUserNotFound: 'Kullanıcı bulunamadı. Lütfen kayıt ol.',
  errPasswordWrong: 'Şifre yanlış.',
  errLoginFailed: 'Giriş yapılamadı. Lütfen tekrar dene.',
  modeNormal: 'Normal',
  modeSplit: 'Çift',
  modePressure: 'Baskı',
  modePressureLabel: 'Baskı',
  modeBlackhole: 'Kara Delik',
  },
  zh: {
  authWelcome: '欢迎来到 Silentap',
  authLoginTitle: '登录 Silentap',
  authRegisterDescription: '选择一个用户名并使用密码注册。',
  authLoginDescription: '使用用户名和密码登录。',
  newUser: '新用户',
  login: '登录',
  username: '用户名',
  usernamePlaceholder: '至少 3 个字符',
  password: '密码',
  passwordPlaceholder: '至少 4 个字符',
  passwordConfirm: '确认密码',
  passwordConfirmPlaceholder: '再次输入密码',
  save: '保存',
  cancel: '取消',
  feedbackTitle: '发送反馈',
  feedbackDescription: '分享表扬、批评或改进建议。',
  message: '消息',
  feedbackPlaceholder: '你的消息…',
  send: '发送',
  start: '开始',
  switchUser: '使用其他用户登录',
  settingsTitle: '设置',
  settingsOpen: '打开设置',
  settingsClose: '关闭',
  settingsLanguageLabel: '语言：{language}',
  settingsLanguageButton: '更改语言',
  feedbackToDev: '给开发者留言',
  highscoreAria: '打开前 10 名记录',
  highscoreTitle: '前 10 名记录',
  highscoreModesAria: '记录的游戏模式',
  noHighscores: '暂无记录。',
  noModeHighscores: '{mode} 模式暂无记录。',
  close: '关闭',
  splitHintTitle: '双人模式计分',
  splitHintText: '只有当两点连续命中时才计分——顺序不重要。',
  splitCounts: '✅ 计分',
  splitNoCount: '❌ 不计分',
  understood: '明白了',
  modeChoose: '选择游戏模式',
  modeDescription:
    '普通：全场共用一个计分。\n双人：中间有隔板分成两半，每边各计一分。\n压力：与普通相同，但每个点必须在 5 秒内命中。',
  back: '返回',
  pressureHintTitle: '压力模式',
  pressureHintText1: '你像普通模式一样游戏，但每个点只有 5 秒的生命。',
  pressureHintText2: '每过一秒，点会更紧张、抖得更厉害。及时命中——否则它会爆炸！',
  letsGo: '出发！',
  newHighscore: '新纪录！',
  tryAgain: '再来一次！',
  backToMenu: '← 主菜单',
  support: '☕️ 支持',
  alertFeedbackOffline: '反馈发送失败：无网络连接。',
  alertFeedbackError: '反馈发送失败。请稍后再试。',
  alertFeedbackSent: '谢谢！你的反馈已发送。',
  errFeedbackMinLength: '请输入至少 3 个字符。',
  errUsernameMin: '用户名长度不得少于 3 个字符。',
  errPasswordMin: '密码长度不得少于 4 个字符。',
  errPasswordMismatch: '两次输入的密码不一致。',
  errUsernameTaken: '该用户名已被占用。',
  errUserSave: '无法保存用户。请再试一次。',
  errUserNotFound: '未找到用户。请先注册。',
  errPasswordWrong: '密码错误。',
  errLoginFailed: '登录失败。请再试一次。',
  modeNormal: '普通',
  modeSplit: '双人',
  modePressure: '压力',
  modePressureLabel: '压力',
  modeBlackhole: '黑洞',
  },
};

let currentLanguage = localStorage.getItem(storageKeys.language) || 'de';
if (!supportedLanguages.includes(currentLanguage)) currentLanguage = 'de';
let translationCache = {};
let introDemoIntervalId = null;
let introDemoModeIndex = 0;
const introDemoModes = ['normal', 'split', 'pressure', 'blackhole'];

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
  highscoreModeNormalButton.textContent = '';
  highscoreModeSplitButton.textContent = '';
  highscoreModePressureButton.textContent = '';
  highscoreModeBlackholeButton.textContent = '';
  highscoreModeNormalButton.setAttribute('aria-label', t('modeNormal'));
  highscoreModeSplitButton.setAttribute('aria-label', t('modeSplit'));
  highscoreModePressureButton.setAttribute('aria-label', t('modePressureLabel'));
  highscoreModeBlackholeButton.setAttribute('aria-label', t('modeBlackhole'));
  highscoreCloseButton.textContent = t('close');

  document.getElementById('split-hint-title').textContent = t('splitHintTitle');
  document.querySelector('.hint-row.success .hint-label').textContent = t('splitCounts');
  document.querySelector('.hint-row.fail .hint-label').textContent = t('splitNoCount');
  splitHintCloseButton.textContent = t('understood');

  document.querySelector('#mode-screen h2').textContent = t('modeChoose');
  document.getElementById('mode-visual-hint').textContent = t('modeVisualHint');
  modeNormalButton.textContent = t('modeNormal');
  modeSplitButton.textContent = t('modeSplit');
  modePressureButton.textContent = t('modePressureLabel');
  modeBlackholeButton.textContent = t('modeBlackhole');
  modeBackButton.textContent = t('back');
  modeExplainBackButton.textContent = t('modeExplainBack');
  modeExplainStartButton.textContent = t('modeExplainStart');
  updateModeExplainOverlayContent(pendingModeForStart || currentMode);

  document.getElementById('pressure-hint-title').textContent = t('pressureHintTitle');
  pressureHintCloseButton.textContent = t('letsGo');

  document.getElementById('blackhole-hint-title').textContent = t('blackholeHintTitle');
  blackholeHintCloseButton.textContent = t('letsGo');

  newHighscoreDisplay.textContent = t('newHighscore');
  tryAgainMessage.textContent = t('tryAgain');
  backToMenu.textContent = '←';
  backToMenu.setAttribute('aria-label', t('backToMenu'));
  backToMenu.setAttribute('title', t('backToMenu'));
  donate.textContent = '☕️';
  donate.setAttribute('aria-label', t('support'));
  donate.setAttribute('title', t('support'));

  authTitle.textContent = authMode === 'register' ? t('authWelcome') : t('authLoginTitle');
  authDescription.textContent = authMode === 'register' ? t('authRegisterDescription') : t('authLoginDescription');

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

const alwaysVisibleInGame = [counter, backToMenu];
const avoidElements = [counter, newHighscoreDisplay, tryAgainMessage, backToMenu];
const pressureModeClasses = ['pressure-tension-low', 'pressure-tension-medium', 'pressure-tension-high'];
const blackholeBaseSuction = 1;
const blackholeSuctionIncreasePerTap = 0.05;
const blackholeCaptureDistanceFactor = 0.42;
let blackholeSuctionMultiplier = blackholeBaseSuction;
let blackholeCaptureInProgress = false;
let modeStartInProgress = false;
let modeStartAnimationFrameId = null;
let pendingModeForStart = null;

function ensureUserRecordShape(user) {
  const highscores = {
    normal: Number.isFinite(user?.highscores?.normal) ? user.highscores.normal : Number.isFinite(user?.highscore) ? user.highscore : 0,
    split: Number.isFinite(user?.highscores?.split) ? user.highscores.split : 0,
    pressure: Number.isFinite(user?.highscores?.pressure) ? user.highscores.pressure : Number.isFinite(user?.pressure_highscore) ? user.pressure_highscore : 0,
    blackhole: Number.isFinite(user?.highscores?.blackhole) ? user.highscores.blackhole : Number.isFinite(user?.blackhole_highscore) ? user.blackhole_highscore : 0
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
    existing.highscores = { normal: 0, split: 0, pressure: 0, blackhole: 0 };
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

function sortEntriesByMode(users, mode) {
  return users
    .slice()
    .sort((a, b) => getScore(b, mode) - getScore(a, mode));
}

function isCurrentUserEntry(entry) {
  if (!currentUser?.name || !entry?.name) return false;
  return entry.name.toLowerCase() === currentUser.name.toLowerCase();
}

function getLocalCurrentUserRank(users, mode) {
  if (!currentUser?.name) return null;

  const sortedEntries = sortEntriesByMode(users, mode).filter((entry) => getScore(entry, mode) > 0);
  const userIndex = sortedEntries.findIndex((entry) => isCurrentUserEntry(entry));

  if (userIndex < 0) return null;

  return {
    rank: userIndex + 1,
    entry: sortedEntries[userIndex]
  };
}

function renderHighscoreList(users, mode, currentUserRank = null) {
  const entries = getTopTenEntries(users, mode);
  highscoreModeNormalButton.classList.toggle('active', mode === 'normal');
  highscoreModeSplitButton.classList.toggle('active', mode === 'split');
  highscoreModePressureButton.classList.toggle('active', mode === 'pressure');
  highscoreModeBlackholeButton.classList.toggle('active', mode === 'blackhole');
  highscoreModeNormalButton.setAttribute('aria-selected', String(mode === 'normal'));
  highscoreModeSplitButton.setAttribute('aria-selected', String(mode === 'split'));
  highscoreModePressureButton.setAttribute('aria-selected', String(mode === 'pressure'));
  highscoreModeBlackholeButton.setAttribute('aria-selected', String(mode === 'blackhole'));

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
    if (isCurrentUserEntry(entry)) {
      item.classList.add('current-user');
    }

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

  const userOutsideTopTen = currentUserRank
    && currentUserRank.rank > 10
    && currentUserRank.entry
    && !entries.some((entry) => isCurrentUserEntry(entry));

  if (userOutsideTopTen) {
    const separator = document.createElement('li');
    separator.className = 'highscore-separator';
    separator.textContent = '.';
    highscoreList.appendChild(separator);

    const item = document.createElement('li');
    item.className = 'highscore-entry current-user outside-top-ten';

    const rank = document.createElement('span');
    rank.className = 'highscore-rank';
    rank.textContent = `${currentUserRank.rank}.`;

    const name = document.createElement('span');
    name.className = 'highscore-name';
    name.textContent = currentUserRank.entry.name;

    const score = document.createElement('span');
    score.className = 'highscore-score';
    score.textContent = String(getScore(currentUserRank.entry, mode));

    item.append(rank, name, score);
    highscoreList.appendChild(item);
  }
}

async function fetchTopTenRemote() {
  if (!supabaseClient) return null;

  const scoreColumn = selectedHighscoreMode === 'split' ? 'split_highscore' : selectedHighscoreMode === 'pressure' ? 'pressure_highscore' : selectedHighscoreMode === 'blackhole' ? 'blackhole_highscore' : 'highscore';

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, pressure_highscore, blackhole_highscore')
    .gt(scoreColumn, 0)
    .order(scoreColumn, { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: true })
    .limit(10);

  if (error) {
    console.warn('Top-10 konnte nicht geladen werden:', error.message);
    return null;
  }

  return (data || []).map((entry) => ensureUserRecordShape({
    name: entry.username,
    highscores: { normal: entry.highscore, split: entry.split_highscore, pressure: entry.pressure_highscore, blackhole: entry.blackhole_highscore }
  }));
}

async function fetchCurrentUserRankRemote(mode) {
  if (!supabaseClient || !currentUser?.name) return null;

  const scoreColumn = mode === 'split' ? 'split_highscore' : mode === 'pressure' ? 'pressure_highscore' : mode === 'blackhole' ? 'blackhole_highscore' : 'highscore';

  const { data: userData, error: userError } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, pressure_highscore, blackhole_highscore')
    .ilike('username', currentUser.name)
    .limit(1)
    .maybeSingle();

  if (userError || !userData) return null;

  const userEntry = ensureUserRecordShape({
    name: userData.username,
    highscores: {
      normal: userData.highscore,
      split: userData.split_highscore,
      pressure: userData.pressure_highscore,
      blackhole: userData.blackhole_highscore
    }
  });

  const userScore = getScore(userEntry, mode);
  if (userScore <= 0) return null;

  const { count, error: rankError } = await supabaseClient
    .from('game_scores')
    .select('username', { count: 'exact', head: true })
    .gt(scoreColumn, userScore);

  if (rankError || !Number.isFinite(count)) return null;

  return {
    rank: count + 1,
    entry: userEntry
  };
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
      highscores: { normal: entry.highscore, split: entry.split_highscore, pressure: entry.pressure_highscore, blackhole: entry.blackhole_highscore }
    }),
    passwordHash: entry.password_hash || null
  };
}

async function fetchUserRemote(name) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('username, highscore, split_highscore, pressure_highscore, blackhole_highscore, password_hash')
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
        highscores: { normal: 0, split: 0, pressure: 0, blackhole: 0 }
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
      blackhole_highscore: 0,
      password_hash: passwordHash
    })
    .select('username, highscore, split_highscore, pressure_highscore, blackhole_highscore, password_hash')
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
        highscores: { normal: 0, split: 0, pressure: 0, blackhole: 0 }
      }),
      passwordHash
    };
  }

  const { data, error } = await supabaseClient
    .from('game_scores')
    .update({ password_hash: passwordHash })
    .eq('username', name)
    .select('username, highscore, split_highscore, pressure_highscore, blackhole_highscore, password_hash')
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
    highscores: { normal: data.highscore, split: data.split_highscore, pressure: data.pressure_highscore, blackhole: data.blackhole_highscore }
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

function setCurrentUser(user) {
  currentUser = user ? ensureUserRecordShape(user) : null;
  updateCurrentUserHighscoreDisplay();
  storeCurrentUserName(currentUser?.name || '');
}

function updateCurrentUserHighscoreDisplay() {
  if (!currentUser) {
    usernameValue.textContent = '';
    return;
  }

  usernameValue.textContent = currentUser.name;
}

async function updateCurrentUserHighscore(score) {
  if (!currentUser) return;
  if (!Number.isFinite(score) || score < 0) return;

  const previousBest = getScore(currentUser, currentMode);
  if (score <= previousBest) return;

  currentUser.highscores[currentMode] = score;
  upsertUserCache(currentUser.name, currentMode, score);
  showNewHighscoreMessage();

  try {
    const remoteUser = await upsertUserHighscoreRemote(currentUser.name, currentMode, score);
    currentUser.highscores.normal = Math.max(getScore(currentUser, 'normal'), getScore(remoteUser, 'normal'));
    currentUser.highscores.split = Math.max(getScore(currentUser, 'split'), getScore(remoteUser, 'split'));
    currentUser.highscores.pressure = Math.max(getScore(currentUser, 'pressure'), getScore(remoteUser, 'pressure'));
    currentUser.highscores.blackhole = Math.max(getScore(currentUser, 'blackhole'), getScore(remoteUser, 'blackhole'));
    upsertUserCache(currentUser.name, 'normal', getScore(currentUser, 'normal'));
    upsertUserCache(currentUser.name, 'split', getScore(currentUser, 'split'));
    upsertUserCache(currentUser.name, 'pressure', getScore(currentUser, 'pressure'));
    upsertUserCache(currentUser.name, 'blackhole', getScore(currentUser, 'blackhole'));
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
  blackhole.classList.toggle('hidden', currentMode !== 'blackhole');
  blackhole.hidden = currentMode !== 'blackhole';
}

function hideGameElements() {
  [dot, dotSplit, splitDivider, blackhole, ...alwaysVisibleInGame, tryAgainMessage, missIndicator, newHighscoreDisplay].forEach((element) => {
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

function isBlackholeMode() {
  return currentMode === 'blackhole';
}

function updateModeButtons() {
  modeNormalButton.classList.toggle('active', currentMode === 'normal');
  modeSplitButton.classList.toggle('active', currentMode === 'split');
  modePressureButton.classList.toggle('active', currentMode === 'pressure');
  modeBlackholeButton.classList.toggle('active', currentMode === 'blackhole');
}

function showStartMenu() {
  startScreen.classList.remove('hidden');
  modeScreen.classList.add('hidden');
  hideModeExplainOverlay();
  hideGameElements();
  closeSplitHint();
  closePressureHint();
  closeBlackholeHint();
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
  hideModeExplainOverlay();
  closeSplitHint();
  closePressureHint();
  closeBlackholeHint();
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
    const currentUserRank = await fetchCurrentUserRankRemote(selectedHighscoreMode);
    renderHighscoreList(remoteTopTen, selectedHighscoreMode, currentUserRank);
    return;
  }

  const localCurrentUserRank = getLocalCurrentUserRank(userCache, selectedHighscoreMode);
  renderHighscoreList(userCache, selectedHighscoreMode, localCurrentUserRank);
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
  if (modeStartAnimationFrameId) {
    cancelAnimationFrame(modeStartAnimationFrameId);
    modeStartAnimationFrameId = null;
  }
  modeStartInProgress = false;
  clearModeStartAnimation();

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

function clearModeStartAnimation() {
  getDotsForMode().forEach((dotElement) => {
    dotElement.classList.remove('mode-start-animation');
  });
}


function getModeExplainTextKey(mode) {
  if (mode === 'split') return 'modeExplainSplit';
  if (mode === 'pressure') return 'modeExplainPressure';
  if (mode === 'blackhole') return 'modeExplainBlackhole';
  return 'modeExplainNormal';
}

function updateModeExplainOverlayContent(mode) {
  const safeMode = mode || 'normal';
  const modeLabel = t(gameModes[safeMode]?.labelKey || 'modeNormal');
  modeExplainTitle.textContent = t('modeExplainTitle', { mode: modeLabel });
  modeExplainDescription.textContent = t(getModeExplainTextKey(safeMode));
  modeExplainAnimation.dataset.mode = safeMode;
}

function showModeExplainOverlay(mode) {
  pendingModeForStart = mode;
  updateModeExplainOverlayContent(mode);
  modeExplainOverlay.classList.remove('hidden');
}

function hideModeExplainOverlay() {
  pendingModeForStart = null;
  modeExplainOverlay.classList.add('hidden');
}

function startSelectedMode(mode) {
  if (modeStartInProgress) return;

  modeStartInProgress = true;
  applyMode(mode);
  closeSplitHint();
  closePressureHint();
  closeBlackholeHint();
  hideModeExplainOverlay();
  modeScreen.classList.add('hidden');
  showGameElements();
  resetDotColors();
  resetDots();
  hideTryAgainMessage();
  hideMissIndicator();
  clearModeStartAnimation();

  const modeDots = getDotsForMode();
  modeDots.forEach((dotElement) => {
    dotElement.classList.add('mode-start-animation');
  });

  const animationDurationMs = 650;
  const animationStartedAt = performance.now();

  const finishModeStart = (now) => {
    if (!modeStartInProgress) return;

    const elapsed = now - animationStartedAt;
    if (elapsed >= animationDurationMs) {
      modeStartAnimationFrameId = null;
      clearModeStartAnimation();
      modeStartInProgress = false;
      setGameActive(true);
      return;
    }

    modeStartAnimationFrameId = requestAnimationFrame(finishModeStart);
  };

  modeStartAnimationFrameId = requestAnimationFrame(finishModeStart);
}

function setGameActive(active) {
  gameActive = active;
  hideMissIndicator();
  hideTryAgainMessage();

  if (gameActive) {
    startScreen.classList.add('hidden');
    modeScreen.classList.add('hidden');
    hideModeExplainOverlay();
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
    blackholeSuctionMultiplier = blackholeBaseSuction;
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
        pressure: Math.max(getScore(currentUser, 'pressure'), getScore(remoteUser.record, 'pressure')),
        blackhole: Math.max(getScore(currentUser, 'blackhole'), getScore(remoteUser.record, 'blackhole'))
      }
    });

    upsertUserCache(currentUser.name, 'normal', getScore(currentUser, 'normal'));
    upsertUserCache(currentUser.name, 'split', getScore(currentUser, 'split'));
    upsertUserCache(currentUser.name, 'pressure', getScore(currentUser, 'pressure'));
    upsertUserCache(currentUser.name, 'blackhole', getScore(currentUser, 'blackhole'));
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
  const padding = 10;
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
    const blackholeExclusion = isBlackholeMode() ? 120 : 0;
    return applyMovementInsets({
      minX: padding,
      minY: padding,
      maxX: Math.max(padding, viewportWidth - dotSize - padding),
      maxY: Math.max(padding, viewportHeight - dotSize - padding - blackholeExclusion)
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


function getBlackholeCenter() {
  const rect = blackhole.getBoundingClientRect();
  if (rect.width && rect.height) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: rect.width / 2 };
  }

  const { width, height } = getViewportSize();
  return { x: width / 2, y: height - 60, radius: 50 };
}

function moveDotBlackhole(dotElement) {
  const dotSize = dotElement.offsetWidth;
  const bounds = getBoundsForDot(dotElement);
  const previousPosition = getDotPosition(dotElement);
  const minTeleportDistancePx = minTeleportDistanceCm * pixelsPerCentimeter;

  let newX = previousPosition.left;
  let newY = previousPosition.top;

  for (let attempt = 0; attempt < 40; attempt++) {
    const candidateX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
    const topMax = Math.max(bounds.minY + 10, bounds.minY + ((bounds.maxY - bounds.minY) * 0.36));
    const candidateY = Math.random() * (topMax - bounds.minY) + bounds.minY;
    const distanceToPrevious = Math.hypot(candidateX - previousPosition.left, candidateY - previousPosition.top);
    if (distanceToPrevious < Math.min(minTeleportDistancePx, 220)) continue;
    newX = candidateX;
    newY = candidateY;
    break;
  }

  const nextPosition = { left: newX, top: newY };
  dotElement.style.left = `${nextPosition.left}px`;
  dotElement.style.top = `${nextPosition.top}px`;

  const hole = getBlackholeCenter();
  const initialCenterX = nextPosition.left + (dotSize / 2);
  const initialCenterY = nextPosition.top + (dotSize / 2);
  let velocityX = (hole.x - initialCenterX) * 0.0035;
  let velocityY = (hole.y - initialCenterY) * 0.0035;

  movementStates.set(dotElement, {
    position: { ...nextPosition },
    velocityX,
    velocityY
  });

  blackholeCaptureInProgress = false;

  const animate = () => {
    const movementState = movementStates.get(dotElement);
    if (!movementState || !gameActive || !isBlackholeMode()) return;

    const holeCenter = getBlackholeCenter();
    const currentCenterX = movementState.position.left + (dotSize / 2);
    const currentCenterY = movementState.position.top + (dotSize / 2);
    const directionX = holeCenter.x - currentCenterX;
    const directionY = holeCenter.y - currentCenterY;
    const distance = Math.hypot(directionX, directionY) || 1;

    const normalizedX = directionX / distance;
    const normalizedY = directionY / distance;
    const suction = blackholeSuctionMultiplier;
    const acceleration = blackholeCaptureInProgress
      ? Math.min(0.54, 0.04 * suction + 0.04)
      : Math.min(0.34, 0.022 * suction + 0.008);

    movementState.velocityX += normalizedX * acceleration;
    movementState.velocityY += normalizedY * acceleration;

    const maxVelocity = Math.min(18, 4.6 + suction * 1.5);
    const speed = Math.hypot(movementState.velocityX, movementState.velocityY) || 1;
    if (speed > maxVelocity) {
      movementState.velocityX = (movementState.velocityX / speed) * maxVelocity;
      movementState.velocityY = (movementState.velocityY / speed) * maxVelocity;
    }

    movementState.position.left += movementState.velocityX;
    movementState.position.top += movementState.velocityY;

    dotElement.style.left = `${movementState.position.left}px`;
    dotElement.style.top = `${movementState.position.top}px`;

    const updatedCenterX = movementState.position.left + (dotSize / 2);
    const updatedCenterY = movementState.position.top + (dotSize / 2);
    const updatedDistance = Math.hypot(holeCenter.x - updatedCenterX, holeCenter.y - updatedCenterY);

    const captureDistance = holeCenter.radius * blackholeCaptureDistanceFactor;
    if (!blackholeCaptureInProgress && updatedDistance <= captureDistance) {
      blackholeCaptureInProgress = true;
    }

    const centerSnapDistance = Math.max(14, holeCenter.radius * 1);
    if (blackholeCaptureInProgress && updatedDistance <= centerSnapDistance) {
      movementState.position.left = holeCenter.x - (dotSize / 2);
      movementState.position.top = holeCenter.y - (dotSize / 2);
      dotElement.style.left = `${movementState.position.left}px`;
      dotElement.style.top = `${movementState.position.top}px`;
      resetRoundToCenterWithTryAgain();
      return;
    }

    movementAnimations.set(dotElement, requestAnimationFrame(animate));
  };

  const previousAnimation = movementAnimations.get(dotElement);
  if (previousAnimation) cancelAnimationFrame(previousAnimation);

  movementAnimations.set(dotElement, requestAnimationFrame(animate));
}

function moveDot(dotElement) {
  if (isBlackholeMode()) {
    moveDotBlackhole(dotElement);
    return;
  }

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

   if (currentMode === 'blackhole') {
    return {
      left: `${(viewportWidth - dotSize) / 2}px`,
      top: `${Math.max(0, viewportHeight - dotSize - 20)}px`
    };
  }
  
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
  blackholeSuctionMultiplier = blackholeBaseSuction;
  blackholeCaptureInProgress = false;

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
  if (isBlackholeMode()) {
    blackholeSuctionMultiplier *= (1 + blackholeSuctionIncreasePerTap);
  }

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
  const tolerance = Math.max(2, Math.round(Math.min(rect.width, rect.height) * 0.06));

  const candidatePoints = [point];
  if (window.visualViewport) {
    const { offsetLeft, offsetTop, scale } = window.visualViewport;
    candidatePoints.push(
      { x: point.x + offsetLeft, y: point.y + offsetTop },
      { x: (point.x / scale) + offsetLeft, y: (point.y / scale) + offsetTop }
    );
  }

  return candidatePoints.some((candidate) => (
    candidate.x >= rect.left - tolerance
      && candidate.x <= rect.right + tolerance
      && candidate.y >= rect.top - tolerance
      && candidate.y <= rect.bottom + tolerance
  ));
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

function isPointInsideBlackhole(point) {
  if (!point || !isBlackholeMode()) return false;

  const hole = getBlackholeCenter();
  return Math.hypot(point.x - hole.x, point.y - hole.y) <= hole.radius;
}

function isGameplayOverlayOpen() {
  return [splitHintOverlay, pressureHintOverlay, blackholeHintOverlay, highscoreOverlay, settingsOverlay, feedbackOverlay, usernameOverlay]
    .some((overlayElement) => isElementVisible(overlayElement));
}

function handleTap(event) {
  if (!gameActive) return;
  if (isGameplayOverlayOpen()) return;

  const target = event.target;
  const touchedDotElement = target?.closest?.('#dot, #dot-split');
  const isControlButton = target?.closest?.('#donate, #back-to-menu, #start-btn, #mode-back, #mode-normal, #mode-split, #mode-pressure, #mode-blackhole, #feedback-btn, #feedback-cancel, #feedback-submit');
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
    const tappedDot = !blackholeCaptureInProgress
      && (touchedDotElement === dot || interactionPoints.some((point) => isTapInsideDot(dot, point)));
    if (tappedDot) {
      hitDot();
      return;
    }
  }

  if (isBlackholeMode()) {
    const tappedBlackhole = blackholeCaptureInProgress && interactionPoints.some((point) => isPointInsideBlackhole(point));
    if (tappedBlackhole) {
      showMissIndicator(interactionPoints[0]);
    }
    return;
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

function closeBlackholeHint() {
  blackholeHintOverlay.classList.add('hidden');
}

function showBlackholeHint() {
  blackholeHintOverlay.classList.remove('hidden');
}

function applyMode(mode) {
  currentMode = mode;
  splitSequenceLastTappedSide = null;
  updateSplitTargetHighlight();
  updateModeButtons();
  closeSplitHint();
  closePressureHint();
  closeBlackholeHint();
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
  showModeExplainOverlay('normal');
});

modeSplitButton.addEventListener('click', () => {
  showModeExplainOverlay('split');
});

modePressureButton.addEventListener('click', () => {
  showModeExplainOverlay('pressure');
});

modeBlackholeButton.addEventListener('click', () => {
  showModeExplainOverlay('blackhole');
});

modeNormalButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  showModeExplainOverlay('normal');
}, { passive: false });

modeSplitButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  showModeExplainOverlay('split');
}, { passive: false });

modePressureButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  showModeExplainOverlay('pressure');
}, { passive: false });

modeBlackholeButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  showModeExplainOverlay('blackhole');
}, { passive: false });


modeExplainBackButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideModeExplainOverlay();
});

modeExplainOverlay.addEventListener('click', (event) => {
  if (event.target === modeExplainOverlay) {
    hideModeExplainOverlay();
  }
});

modeExplainStartButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!pendingModeForStart) return;
  startSelectedMode(pendingModeForStart);
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

highscoreModeBlackholeButton.addEventListener('click', async (event) => {
  event.preventDefault();
  setHighscoreMode('blackhole');
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


blackholeHintCloseButton.addEventListener('click', (event) => {
  event.preventDefault();
  closeBlackholeHint();
});

blackholeHintOverlay.addEventListener('click', (event) => {
  if (event.target === blackholeHintOverlay) {
    closeBlackholeHint();
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
      upsertUserCache(authUser.record.name, 'blackhole', getScore(authUser.record, 'blackhole'));
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
    upsertUserCache(authUser.record.name, 'blackhole', getScore(authUser.record, 'blackhole'));
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

# План сборки: сайт личного бренда Гульнар Хамитовой

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одностраничный иммерсивный сайт-история Гульнар Хамитовой (спека: `~/Desktop/GA/PROMPT.md`), ведущий к подписке на @gulnara.rich через финальный QR.

**Architecture:** Чистая статика без сборщиков: `index.html` + `css/style.css` + `js/*.js`. Глубина — многослойный параллакс (data-depth + rAF), canvas-лепестки поверх контента, IntersectionObserver-анимации. RU/KZ через JS-словарь. Все ассеты локальные (фото с Яндекс.Диска скачиваются скриптом на этапе сборки).

**Tech Stack:** HTML5, CSS (custom properties, grid, perspective), vanilla JS (rAF, IntersectionObserver, canvas), Google Fonts (Playfair Display + Manrope, cyrillic), Python segno для QR, macOS `sips` для обработки фото.

**Рабочая папка:** `~/Desktop/GA`. Спека: `PROMPT.md` (согласована 24.07.2026).

---

### Task 0: Каркас проекта и git

**Files:**
- Create: `~/Desktop/GA/.gitignore`, структура папок

- [ ] **Step 1: Инициализировать git и папки**

```bash
cd ~/Desktop/GA
git init
printf ".DS_Store\nassets/photos/raw/\n" > .gitignore
mkdir -p css js assets/photos/raw assets/photos/web assets/video scripts docs
```

- [ ] **Step 2: Первый коммит (спека + hero-ассеты уже в папке)**

```bash
git add -A && git commit -m "chore: scaffold GA project, spec + hero assets"
```

---

### Task 1: Ассеты — фото, обложки видео, QR

**Files:**
- Create: `scripts/download-photos.sh`, `assets/photos/web/*.jpg`, `assets/video/XqzH7o4Y2Jo.jpg`, `assets/video/6qYO2e6JLPU.jpg`, `assets/qr-instagram.svg`

- [ ] **Step 1: Скрипт скачивания с Яндекс.Диска (проверенный API-рецепт из PROMPT.md §7)**

```bash
#!/bin/bash
# scripts/download-photos.sh — скачивает всю папку одним ZIP
set -e
PK='https%3A%2F%2Fdisk.yandex.kz%2Fd%2FK-Ia08dks-2xvQ'
HREF=$(curl -s "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=$PK" | python3 -c "import sys,json; print(json.load(sys.stdin)['href'])")
curl -sL -o /tmp/ga-photos.zip "$HREF"
unzip -o /tmp/ga-photos.zip -d assets/photos/raw/
```

- [ ] **Step 2: Запустить, проверить: ~36 JPEG в `assets/photos/raw/`** (`ls assets/photos/raw/**/*.jpg | wc -l`)

- [ ] **Step 3: Оптимизация в `web/`: ширина ≤1200, качество 82**

```bash
mkdir -p assets/photos/web && i=0
find assets/photos/raw -iname "*.jpg" | while read f; do
  i=$((i+1)); sips -Z 1200 -s format jpeg -s formatOptions 82 "$f" --out "assets/photos/web/photo-$(printf %02d $i).jpg" >/dev/null
done
```

- [ ] **Step 4: Обложки видео**

```bash
curl -sL -o assets/video/XqzH7o4Y2Jo.jpg "https://i.ytimg.com/vi/XqzH7o4Y2Jo/hqdefault.jpg"
curl -sL -o assets/video/6qYO2e6JLPU.jpg "https://i.ytimg.com/vi/6qYO2e6JLPU/hqdefault.jpg"
```

- [ ] **Step 5: QR-код (золотой, прозрачный фон, error-correction H)**

```bash
python3 -m pip install --user -q segno
python3 -c "import segno; segno.make('https://www.instagram.com/gulnara.rich/', error='h').save('assets/qr-instagram.svg', scale=12, border=2, dark='#D8B36A', light=None)"
```

- [ ] **Step 6: Просмотреть все фото (Read глазами), выбрать: 4–5 для таймлайна, 6–8 для галереи Rich Flowers** — список сохранить в `docs/photo-selection.md` с однострочным описанием каждого выбранного фото.

- [ ] **Step 7: Commit** `git add -A && git commit -m "feat: assets — photos, video covers, QR"`

---

### Task 2: Базовый слой — токены, шрифты, i18n, скелет 9 секций

**Files:**
- Create: `index.html`, `css/style.css`, `js/i18n.js`, `js/main.js`

- [ ] **Step 1: `index.html`** — скелет: `<html lang="ru">`, meta (title «Гульнар Хамитова — self-made woman», description, og:image = hero), Google Fonts `Playfair+Display:ital@0;1` + `Manrope` (subset cyrillic), фикс-шапка (имя-логотип + переключатель RU/ҚАЗ), 9 `<section>` с id: `hero, manifesto, story, flowers, philosophy, voice, book, press, follow`, каждый пока с заголовком-заглушкой и `data-i18n` атрибутами. Canvas лепестков: `<canvas id="petals"></canvas>` перед `</body>`.

- [ ] **Step 2: `css/style.css`** — токены из спеки §3:

```css
:root {
  --bg: #FAF6EF; --bg-2: #F5E9E4; --ink: #2B2523;
  --gold: #B98A3E; --gold-2: #D8B36A; --dark: #1E1917;
  --serif: "Playfair Display", serif; --sans: "Manrope", sans-serif;
}
```

Плюс: reset, базовая типографика (заголовки clamp(2.5rem, 8vw, 7rem)), `.act` (min-height: 100vh, position: relative, overflow: clip), `.bg-letter` (огромная serif-буква, opacity .05, position absolute), `#petals { position: fixed; inset: 0; pointer-events: none; z-index: 50 }`.

- [ ] **Step 3: `js/i18n.js`** — словарь и переключение:

```js
const I18N = {
  ru: { "nav.follow": "Instagram", "hero.name": "Гульнар Хамитова", /* все ключи RU */ },
  kz: { /* пока копия RU — заполняется в Task 8 */ }
};
function setLang(lang) {
  document.documentElement.lang = lang === "kz" ? "kk" : "ru";
  localStorage.setItem("ga-lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = I18N[lang][el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.classList.toggle("is-active", b.dataset.lang === lang));
}
document.addEventListener("DOMContentLoaded", () =>
  setLang(localStorage.getItem("ga-lang") || "ru"));
```

- [ ] **Step 4: `js/main.js`** — reveal-движок:

```js
const io = new IntersectionObserver(
  es => es.forEach(e => e.target.classList.toggle("in-view", e.isIntersecting)),
  { threshold: 0.18 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
```

- [ ] **Step 5: Проверка в браузере** — открыть превью (preview_start на папку GA, любой статический сервер из launch.json: `python3 -m http.server`), read_console_messages: 0 ошибок; read_page: 9 секций, переключатель меняет текст, язык переживает перезагрузку.

- [ ] **Step 6: Commit** `git commit -am "feat: base layer — tokens, i18n, section skeleton"`

---

### Task 3: Акт 1 Hero — слои, буква G, лепестки, параллакс

**Files:**
- Modify: `index.html` (#hero), `css/style.css`
- Create: `js/petals.js`, `js/parallax.js`

- [ ] **Step 1: Разметка hero** — сцена из слоёв с `data-depth` (0 — дальний):

```html
<section id="hero" class="act">
  <div class="hero-scene">
    <span class="bg-letter" data-depth="0.05" aria-hidden="true">G</span>
    <div class="hero-glow" data-depth="0.1"></div>
    <img class="hero-portrait" data-depth="0.18" src="assets/hero/gulnar-hero-cutout.png"
         alt="Гульнар Хамитова" fetchpriority="high">
    <div class="hero-titles" data-depth="0.28">
      <p class="hero-eyebrow" data-i18n="hero.eyebrow">self-made woman · наставник женщин в бизнесе</p>
      <h1 class="hero-name" data-i18n="hero.name">Гульнар Хамитова</h1>
    </div>
    <div class="hero-social" data-depth="0.34"><!-- тёмная плашка: @gulnara.rich, @rich.flowers --></div>
  </div>
  <div class="scroll-hint" data-i18n="hero.scroll">листай вниз</div>
</section>
```

- [ ] **Step 2: `js/parallax.js`** — мышь + скролл, один rAF-цикл:

```js
let mx = 0, my = 0, raf = null;
const layers = [...document.querySelectorAll("[data-depth]")];
function tick() {
  raf = null;
  const sy = scrollY;
  layers.forEach(l => {
    const d = +l.dataset.depth;
    l.style.transform =
      `translate3d(${mx * 40 * d}px, ${my * 30 * d - sy * d * 0.6}px, 0)`;
  });
}
function queue() { if (!raf) raf = requestAnimationFrame(tick); }
addEventListener("mousemove", e => {
  mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; queue();
}, { passive: true });
addEventListener("scroll", queue, { passive: true });
```

- [ ] **Step 3: `js/petals.js`** — ~22 лепестка на fullscreen-canvas: каждый {x, y, z: 0.4–1, rot, vy, vx-синус}; форма — два quadraticCurveTo (лодочка), цвета rgba пудрово-розового `#E8C4B8` и золота `#D8B36A`, alpha по z; крупные (ближние) движутся быстрее. Респект `prefers-reduced-motion: reduce` → канвас не запускается.

- [ ] **Step 4: CSS hero** — портрет по центру/чуть правее, буква G ~55vw, свечение radial-gradient золота 8%, плашка соцсетей `--dark` с золотыми иконками (инлайн-SVG Instagram), `.scroll-hint` с плавающей анимацией.

- [ ] **Step 5: Проверка** — скриншот десктоп: слои сдвигаются при скролле (сравнить 2 скриншота с разным scroll), лепестки ПЕРЕД портретом, консоль чистая. FPS: в performance-трейсе нет длинных тасков от rAF.

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: hero — layered parallax, petals canvas, social plaque"`

---

### Task 4: Акты 2–3 — Манифест и История

**Files:**
- Modify: `index.html`, `css/style.css`, `js/main.js`, `js/i18n.js`

- [ ] **Step 1: Манифест** — фраза из спеки §4.2 разбита на `<span class="w">слово </span>`; прогресс скролла секции (sticky-обёртка высотой 220vh) маппится на количество «зажжённых» слов:

```js
const words = [...document.querySelectorAll("#manifesto .w")];
function manifestoTick() {
  const r = document.querySelector("#manifesto .sticky-wrap").getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  const lit = Math.floor(p * words.length);
  words.forEach((w, i) => w.classList.toggle("lit", i <= lit));
}
addEventListener("scroll", () => requestAnimationFrame(manifestoTick), { passive: true });
```

`.w { opacity: .12; transition: opacity .4s }` → `.w.lit { opacity: 1 }`. Ключевые слова «согласии с собой» — italic + золото. Подпись «— философия self-made женщины».

- [ ] **Step 2: История** — вертикальный таймлайн: центральная золотая линия (на мобиле — слева), 4 вехи из спеки §4.3 (педагог → первый магазин → сеть Rich Flowers → наставник и общественный деятель), каждая: фото из отобранных (Task 1 Step 6), огромная цифра-веха антиквой («20 лет», «сеть», «мир»), текст 2–3 предложения (написать при вёрстке, тон — спека §1). Фото в рамках с параллаксом `data-depth="0.1"`, появление `.reveal`.

- [ ] **Step 3: Тексты** — все строки в `I18N.ru`, ключи `manifesto.*`, `story.*`.

- [ ] **Step 4: Проверка** — скролл по манифесту зажигает слова постепенно; таймлайн: фото загружаются (`loading="lazy"`), консоль чистая. Скриншоты обеих секций.

- [ ] **Step 5: Commit** `git commit -am "feat: manifesto scroll-reveal + story timeline"`

---

### Task 5: Акты 4–5 — Rich Flowers и Философия

**Files:**
- Modify: `index.html`, `css/style.css`, `js/main.js`, `js/i18n.js`

- [ ] **Step 1: Rich Flowers** — фон `--bg-2`, подложка «RICH» (`.bg-letter`), заголовок «Цветы со всего мира», текст про сеть магазинов (спека §1). Галерея 6–8 фото: CSS-grid с разными размерами ячеек, каждая карточка — свой `data-depth` (0.06–0.16) и лёгкий rotate (−2°…2°), hover — scale(1.03) + золотая рамка. Кнопка-ссылка на https://www.instagram.com/rich.flowers/ (`target="_blank" rel="noopener"`).

- [ ] **Step 2: Философия** — 4 карточки (спека §4.5): золотой номер 01–04 антиквой, заголовок, 1–2 предложения. Grid 2×2 (мобайл — столбик), появление каскадом: `.reveal` + `transition-delay: calc(var(--i) * 120ms)`.

- [ ] **Step 3: Тексты в `I18N.ru`** (`flowers.*`, `phil.*`).

- [ ] **Step 4: Проверка** — скриншоты; ссылка на rich.flowers кликается (read_page: href верный).

- [ ] **Step 5: Commit** `git commit -am "feat: rich flowers gallery + philosophy cards"`

---

### Task 6: Акты 6–8 — Голос, Книга, СМИ

**Files:**
- Modify: `index.html`, `css/style.css`, `js/i18n.js`
- Create: `js/video.js`

- [ ] **Step 1: Видео (ленивые embed)** — две карточки:

```html
<div class="video-card" data-vid="XqzH7o4Y2Jo">
  <img src="assets/video/XqzH7o4Y2Jo.jpg" alt="" loading="lazy">
  <button class="play-btn" aria-label="Смотреть"></button>
  <p class="video-title">Ұстаздық жолдан кәсіпкерлікке дейін — LStories</p>
</div>
```

```js
// js/video.js
document.querySelectorAll(".video-card").forEach(c =>
  c.addEventListener("click", () => {
    c.innerHTML = `<iframe src="https://www.youtube.com/embed/${c.dataset.vid}?autoplay=1"
      allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
    c.classList.add("is-playing");
  }));
```

Второе видео: `6qYO2e6JLPU`, подпись «Как открыть цветочный бизнес — «Все о Бизнесе»». Подложка секции — слово «ГОЛОС».

- [ ] **Step 2: Книга** — CSS-3D разворот: `.book { transform-style: preserve-3d; animation: bookFloat 6s ease-in-out infinite alternate }` (rotateY 18°→28°), обложка — тёмная с золотым тиснением «Қазақстанның Алтын кітабы», корешок и «золотой обрез» (linear-gradient полоска). Рядом полное библиоописание из спеки §4.7 + бейдж «с. 128–129».

- [ ] **Step 3: СМИ** — 8 карточек из спеки §4.8 (эмодзи + название), grid 4×2 (планшет 2×4, мобайл 1×8), каскадное появление, hover — золотая рамка + лёгкий подъём.

- [ ] **Step 4: Проверка** — клик по видео создаёт iframe и он играет (read_page: iframe появился), книга покачивается, консоль чистая (YouTube-варнинги допустимы). Скриншоты.

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: voice videos, 3D book, press grid"`

---

### Task 7: Акт 9 — Финал с QR + футер

**Files:**
- Modify: `index.html`, `css/style.css`, `js/i18n.js`

- [ ] **Step 1: Секция `#follow`** — фон `--dark`, переход к ней — плавный градиент. Центр: заголовок «Продолжение — в Instagram», `assets/qr-instagram.svg` в золотой рамке (углы — SVG-лепестки), подпись «@gulnara.rich», кнопка-ссылка «Подписаться» (золотая, hover — заливка) на https://www.instagram.com/gulnara.rich/. Лепестки канваса поверх тёмного фона смотрятся золотыми искрами — проверить контраст.

- [ ] **Step 2: Футер внутри финала** — «Гульнар Хамитова · 2026», мини-ссылки @gulnara.rich / @rich.flowers / YouTube.

- [ ] **Step 3: Проверка** — скриншот; QR открыть в браузере крупно и отсканировать телефоном НЕ можем сами → зум-скриншот для юзера + декод-проверка: `python3 -m pip install --user -q "qreader||true"` не тянуть; вместо этого проверить содержимое SVG сгенерировано из верного URL (Step 5 Task 1 фиксирует URL в команде) и попросить юзера сканировать при финальном ревью.

- [ ] **Step 4: Commit** `git commit -am "feat: dark QR finale + footer"`

---

### Task 8: Казахская версия

**Files:**
- Modify: `js/i18n.js`

- [ ] **Step 1: Перевести весь словарь `I18N.ru` → `I18N.kz`** — литературный казахский, тон — вдохновляющий, не канцелярит. Имена собственные (Rich Flowers, Instagram, LStories) не переводить. «self-made woman» оставить латиницей. Название книги уже на казахском.

- [ ] **Step 2: Проверка** — переключить на ҚАЗ в превью: все секции переведены (read_page, искать русские строки — не должно остаться, кроме брендов), вёрстка не ломается длинными словами (скриншоты hero + финала на KZ).

- [ ] **Step 3: Commit** `git commit -am "feat: kazakh translation"`

---

### Task 9: Мобильная версия, reduced-motion, производительность

**Files:**
- Modify: `css/style.css`, `js/*.js`, `index.html`

- [ ] **Step 1: Брейкпоинты** — 1024/768/430: hero — портрет над заголовком, буква G 90vw; таймлайн — линия слева; сетки складываются (см. задачи выше); плашка соцсетей — full-width снизу hero.

- [ ] **Step 2: Упростить движение на мобиле** — mousemove-параллакса нет (нет мыши), scroll-параллакс амплитуда ×0.5, лепестков 10 вместо 22 (`matchMedia("(max-width: 768px)")`).

- [ ] **Step 3: `prefers-reduced-motion`** — канвас не стартует, параллакс отключён, reveal без transition (мгновенно видимы).

- [ ] **Step 4: Перфоманс-проход** — все `<img>` ниже hero: `loading="lazy"` + явные width/height (нет CLS); hero-PNG: `fetchpriority="high"`; общий вес страницы без видео < 4 МБ (`du -sh assets/photos/web assets/hero`), иначе ужать качество до 75.

- [ ] **Step 5: Проверка** — resize_window mobile (375×812): скриншоты всех 9 секций, горизонтального скролла нет (`document.documentElement.scrollWidth === innerWidth` через javascript_tool), консоль чистая.

- [ ] **Step 6: Commit** `git commit -am "feat: responsive + reduced motion + perf pass"`

---

### Task 10: Финальная проверка и ревью юзера

- [ ] **Step 1: Полный прогон** — десктоп 1280: скролл от hero до QR, скриншоты каждого акта; консоль: 0 ошибок; network: нет 404.
- [ ] **Step 2: Языки** — RU → KZ → перезагрузка (язык сохранился).
- [ ] **Step 3: Самоrevью против PROMPT.md** — каждая строка спеки §4 реализована; отсылки на месте: 2 видео, книга с ISBN, 8 карточек СМИ, QR, @rich.flowers.
- [ ] **Step 4: Commit** `git commit -am "chore: final polish"` 
- [ ] **Step 5: Показать юзеру** — превью открыто, попросить: посмотреть на телефоне/десктопе и **отсканировать QR телефоном** (единственная проверка, которую не сделать самим).

---

## Верификация (общая для всех задач)

Тестов-фреймворков нет — статический сайт. Каждая задача проверяется в браузере: превью через `preview_start` (python3 -m http.server из папки GA), `read_console_messages` (0 ошибок), `read_page` (структура/тексты), скриншоты (визуал). Не просить юзера проверять руками ничего, кроме сканирования QR в самом конце.

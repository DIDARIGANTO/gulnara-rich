/* ═══ RU / KZ словарь и переключение языка ═══ */
const I18N = {
  ru: {
    "nav.name": "Гульнар Хамитова",
    /* Hero */
    "hero.eyebrow": "self-made woman · наставник женщин в бизнесе",
    "hero.name": "Гульнар<br>Хамитова",
    "hero.tag": "20 лет в цветочном бизнесе. Строить дело и жить в согласии с собой.",
    "hero.social": "Будь в движении",
    "hero.scroll": "листайте вниз",
    /* Манифест */
    "manifesto.text": "Строить бизнес и жить в <em>согласии</em> <em>с</em> <em>собой</em> — это не выбор. Это <em>философия.</em>",
    "manifesto.sign": "— философия self-made женщины",
    /* История */
    "story.kicker": "Путь",
    "story.title": "20 лет в цветах",
    "story.lead": "От учительской — к сети цветочных магазинов и наставничеству. Ни один шаг не был случайным.",
    "story.m1t": "Педагог",
    "story.m1x": "Путь начался не с цветов, а с людей: первая профессия — учить и вести за собой. Оттуда — характер и дисциплина.",
    "story.m2t": "Своё дело",
    "story.m2x": "Решение, которое изменило всё: первый цветочный магазин и вера, что красота может быть делом жизни.",
    "story.m3t": "Rich Flowers",
    "story.m3x": "Один магазин вырос в сеть. Цветы со всего мира, команда и стандарты, которым доверяют.",
    "story.m4t": "Наставник",
    "story.m4x": "Опыт стал системой: наставничество для женщин в бизнесе, выступления, форумы и общественная работа.",
    "story.s1n": "20", "story.s1l": "лет в цветочном бизнесе",
    "story.s2n": "сеть", "story.s2l": "магазинов Rich Flowers",
    "story.s3n": "мир", "story.s3l": "цветы со всех континентов",
    /* Rich Flowers */
    "flowers.title": "Цветы со всего мира",
    "flowers.text": "Когда-то это был один магазин. Сегодня — сеть Rich Flowers: свежие поставки со всего мира, фирменные букеты и сервис, ради которого возвращаются.",
    "flowers.cta": "Смотреть @rich.flowers",
    /* Философия */
    "phil.kicker": "Философия",
    "phil.title": "Жить в согласии с собой",
    "phil.p1t": "Активная позиция",
    "phil.p1x": "Не ждать обстоятельств — создавать их. Каждый день.",
    "phil.p2t": "Дело как продолжение себя",
    "phil.p2x": "Бизнес растёт, когда он честен с той, кто его строит.",
    "phil.p3t": "Красота — это дисциплина",
    "phil.p3x": "За лёгкостью букета — система, порядок и труд команды.",
    "phil.p4t": "Делиться — значит умножать",
    "phil.p4x": "Знания, отданные другим, возвращаются новыми возможностями.",
    /* Голос */
    "voice.bg": "ГОЛОС",
    "voice.kicker": "Голос",
    "voice.title": "Подкасты и интервью",
    "voice.v1t": "Ұстаздық жолдан кәсіпкерлікке дейін",
    "voice.v1s": "LStories · Qstar group",
    "voice.v2t": "Как открыть цветочный бизнес",
    "voice.v2s": "«Все о Бизнесе»",
    /* Книга */
    "book.kicker": "Признание",
    "book.title": "Страница в истории страны",
    "book.role": "«Хамитова Гульнар. Педагог, предприниматель, общественный деятель»",
    "book.bib": "«Қазақстанның Алтын кітабы» (Golden Book of Kazakhstan) — Издательский Дом «Райымбек», 414 с. ISBN 978-601-307-240-1",
    "book.pages": "стр. 128–129",
    /* СМИ */
    "press.kicker": "СМИ",
    "press.title": "СМИ и признание",
    "press.p1": "«Қазақстанның Алтын кітабы»",
    "press.p2": "Sultan Magazine",
    "press.p3": "Business Lady Asia",
    "press.p4": "Интервью и подкасты",
    "press.p5": "Телевидение и сюжеты",
    "press.p6": "Статьи о Rich Flowers",
    "press.p7": "Награды и дипломы",
    "press.p8": "Выступления и форумы",
    /* Финал */
    "follow.kicker": "Продолжение",
    "follow.title": "Продолжение — в Instagram",
    "follow.text": "Философия self-made женщины, закулисье Rich Flowers и живой опыт — каждый день.",
    "follow.scan": "наведите камеру на QR",
    "follow.cta": "Подписаться"
  },
  /* Казахская версия заполняется в Task 8; до тех пор — RU-строки */
  kz: {}
};

function setLang(lang) {
  const dict = Object.assign({}, I18N.ru, I18N[lang] || {});
  document.documentElement.lang = lang === "kz" ? "kk" : "ru";
  localStorage.setItem("ga-lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i18n-words]").forEach(el => {
    const v = dict[el.dataset.i18nWords];
    if (v != null) {
      el.innerHTML = v.split(" ")
        .map(w => `<span class="w">${w}</span>`).join(" ");
    }
  });
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.classList.toggle("is-active", b.dataset.lang === lang));
  document.dispatchEvent(new CustomEvent("ga:lang", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.addEventListener("click", () => setLang(b.dataset.lang)));
  setLang(localStorage.getItem("ga-lang") || "ru");
});

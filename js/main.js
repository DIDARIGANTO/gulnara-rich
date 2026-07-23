/* ═══ Reveal-движок + манифест ═══ */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Появление блоков из глубины */
  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
    { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach(el => {
    if (reduced) el.classList.add("in-view");
    else io.observe(el);
  });

  /* Манифест: слова зажигаются по прогрессу скролла sticky-секции */
  const wrap = document.querySelector("#manifesto .sticky-wrap");
  if (wrap) {
    const tick = () => {
      const words = wrap.querySelectorAll(".w");
      if (!words.length) return;
      const r = wrap.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      const lit = reduced ? words.length : Math.floor(p * (words.length + 2));
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    };
    addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true });
    document.addEventListener("ga:lang", () => requestAnimationFrame(tick));
    tick();
  }
})();

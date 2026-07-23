/* ═══ Параллакс слоёв: мышь + скролл → CSS-переменные ═══ */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layers = [...document.querySelectorAll("[data-depth]")];
  if (!layers.length) return;

  const fine = matchMedia("(pointer: fine)").matches;
  const AMP = matchMedia("(max-width: 900px)").matches ? 0.5 : 1;
  let mx = 0, my = 0, raf = null;

  const tick = () => {
    raf = null;
    const sy = scrollY;
    for (const l of layers) {
      const d = +l.dataset.depth;
      l.style.setProperty("--px", (mx * 46 * d * AMP).toFixed(2) + "px");
      l.style.setProperty("--py", (my * 32 * d * AMP - sy * d * 0.35).toFixed(2) + "px");
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };

  if (fine) addEventListener("mousemove", e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    queue();
  }, { passive: true });
  addEventListener("scroll", queue, { passive: true });
  tick();
})();

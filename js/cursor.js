/* ═══ Курсор-лепесток (только точный указатель, без reduced-motion) ═══ */
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const c = document.createElement("div");
  c.id = "cursor";
  c.innerHTML = `<svg viewBox="0 0 32 32">
    <defs><linearGradient id="cursor-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F1DCA8"/>
      <stop offset=".5" stop-color="#D8B36A"/>
      <stop offset="1" stop-color="#C2607A"/>
    </linearGradient></defs>
    <path d="M16 2 C24.5 10 26.5 18.5 16 30 C5.5 18.5 7.5 10 16 2 Z"
      fill="url(#cursor-g)" fill-opacity=".92"
      stroke="rgba(255,255,255,.75)" stroke-width="1"/>
  </svg>`;
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(c);
    document.documentElement.classList.add("has-cursor");
  });

  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, ang = 10;

  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

  const HOV = "a, button, .video-card, .fl-card, .phil-card, .press-card, .bloom, .tl-photo";
  document.addEventListener("mouseover", e => {
    c.classList.toggle("is-hover", !!(e.target.closest && e.target.closest(HOV)));
  });
  addEventListener("mousedown", () => c.classList.add("is-down"));
  addEventListener("mouseup", () => c.classList.remove("is-down"));

  const loop = () => {
    const dx = tx - x, dy = ty - y;
    x += dx * 0.22;
    y += dy * 0.22;
    const target = Math.max(-38, Math.min(38, dx * 1.4 + 10));
    ang += (target - ang) * 0.08;
    c.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${ang.toFixed(1)}deg)`;
    requestAnimationFrame(loop);
  };
  loop();
})();

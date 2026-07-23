/* ═══ Лепестки: canvas поверх контента ═══ */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("petals");
  if (!canvas || reduced) return;

  const ctx = canvas.getContext("2d");
  const mobile = matchMedia("(max-width: 768px)").matches;
  const COUNT = mobile ? 10 : 22;

  let W, H, dpr;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  };
  resize();
  addEventListener("resize", resize, { passive: true });

  /* пудра · золото · крем · роза */
  const TINTS = [[232, 196, 184], [216, 179, 106], [236, 220, 200], [224, 168, 155]];
  const rnd = (a, b) => a + Math.random() * (b - a);

  const mk = (anywhere) => ({
    x: rnd(-0.05, 1.05),
    y: anywhere ? rnd(0, 1) : rnd(-0.16, -0.05),
    z: rnd(0.35, 1),                 /* глубина: размер, скорость, прозрачность */
    r: rnd(0, Math.PI * 2),
    vr: rnd(-0.012, 0.012),
    vy: rnd(0.00045, 0.0009),
    sway: rnd(0.5, 1.5),
    phase: rnd(0, Math.PI * 2),
    tint: TINTS[Math.random() * TINTS.length | 0]
  });

  const petals = Array.from({ length: COUNT }, () => mk(true));
  let t = 0;

  const draw = () => {
    t += 1 / 60;
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy * (0.5 + p.z);
      p.r += p.vr;
      if (p.y > 1.12) Object.assign(p, mk(false));

      const x = (p.x + Math.sin(t * 0.5 * p.sway + p.phase) * 0.022) * W;
      const y = p.y * H;
      const s = (13 + 25 * p.z) * dpr;
      const [cr, cg, cb] = p.tint;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.r + Math.sin(t + p.phase) * 0.35);
      ctx.globalAlpha = 0.22 + 0.42 * p.z;
      const g = ctx.createLinearGradient(0, -s / 2, 0, s / 2);
      g.addColorStop(0, `rgb(${cr},${cg},${cb})`);
      g.addColorStop(1, `rgba(${cr},${cg},${cb},.55)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.quadraticCurveTo(s * .48, -s * .08, 0, s / 2);
      ctx.quadraticCurveTo(-s * .48, -s * .08, 0, -s / 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

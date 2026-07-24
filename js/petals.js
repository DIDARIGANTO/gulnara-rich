/* ═══ Атмосфера: стеклянные лепестки (DoF) + золотая пыль (bloom) ═══ */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("petals");
  if (!canvas || reduced) return;

  const ctx = canvas.getContext("2d");
  const mobile = matchMedia("(max-width: 768px)").matches;
  const N_PETALS = mobile ? 9 : 20;
  const N_DUST = mobile ? 12 : 26;

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

  /* пудра · золото · пион · шалфей · крем */
  const TINTS = [
    [232, 196, 184], [216, 179, 106], [194, 96, 122],
    [169, 183, 155], [236, 220, 200]
  ];

  /* Спрайт лепестка: стеклянный градиент + блик; blur-версия для глубины резкости */
  const makePetal = ([r, g, b], blur) => {
    const s = 64, c = document.createElement("canvas");
    c.width = c.height = s;
    const x = c.getContext("2d");
    if (blur) x.filter = `blur(${blur}px)`;
    const grad = x.createLinearGradient(0, 6, 0, s - 6);
    grad.addColorStop(0, `rgba(255,255,255,.75)`);
    grad.addColorStop(.35, `rgba(${r},${g},${b},.9)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},.4)`);
    x.fillStyle = grad;
    x.beginPath();
    x.moveTo(s / 2, 4);
    x.quadraticCurveTo(s - 8, s * .42, s / 2, s - 4);
    x.quadraticCurveTo(8, s * .42, s / 2, 4);
    x.fill();
    x.globalAlpha = .55;
    x.fillStyle = "rgba(255,255,255,.65)";
    x.beginPath();
    x.ellipse(s * .42, s * .3, s * .08, s * .18, -.5, 0, 7);
    x.fill();
    return c;
  };
  const SPRITES = TINTS.map(t => ({ sharp: makePetal(t, 0), soft: makePetal(t, 4) }));

  /* Спрайт пылинки: золотое свечение (bloom) */
  const makeDust = () => {
    const s = 48, c = document.createElement("canvas");
    c.width = c.height = s;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(248,222,160,.95)");
    g.addColorStop(.25, "rgba(226,186,116,.55)");
    g.addColorStop(1, "rgba(226,186,116,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return c;
  };
  const DUST_SPRITE = makeDust();

  const rnd = (a, b) => a + Math.random() * (b - a);

  const mkPetal = (anywhere) => ({
    x: rnd(-0.05, 1.05),
    y: anywhere ? rnd(0, 1) : rnd(-0.16, -0.05),
    z: rnd(0.3, 1),
    r: rnd(0, Math.PI * 2),
    vr: rnd(-0.012, 0.012),
    vy: rnd(0.00045, 0.0009),
    sway: rnd(0.5, 1.5),
    phase: rnd(0, Math.PI * 2),
    ti: Math.random() * TINTS.length | 0
  });
  const mkDust = (anywhere) => ({
    x: rnd(0, 1),
    y: anywhere ? rnd(0, 1) : rnd(1.02, 1.1),
    z: rnd(0.3, 1),
    vy: rnd(0.00018, 0.00045),
    sway: rnd(0.4, 1.3),
    phase: rnd(0, Math.PI * 2),
    tw: rnd(1.5, 3.5)
  });

  const petals = Array.from({ length: N_PETALS }, () => mkPetal(true));
  const dust = Array.from({ length: N_DUST }, () => mkDust(true));
  let t = 0;

  const draw = () => {
    t += 1 / 60;
    ctx.clearRect(0, 0, W, H);

    /* пыль поднимается, мерцает */
    for (const d of dust) {
      d.y -= d.vy * (0.5 + d.z);
      if (d.y < -0.06) Object.assign(d, mkDust(false));
      const x = (d.x + Math.sin(t * 0.4 * d.sway + d.phase) * 0.018) * W;
      const y = d.y * H;
      const tw = 0.55 + 0.45 * Math.sin(t * d.tw + d.phase);
      const s = (5 + 11 * d.z) * dpr * (0.85 + 0.15 * tw);
      ctx.globalAlpha = (0.2 + 0.5 * d.z) * tw;
      ctx.drawImage(DUST_SPRITE, x - s / 2, y - s / 2, s, s);
    }

    /* лепестки падают; дальние — вне фокуса */
    for (const p of petals) {
      p.y += p.vy * (0.5 + p.z);
      p.r += p.vr;
      if (p.y > 1.12) Object.assign(p, mkPetal(false));
      const x = (p.x + Math.sin(t * 0.5 * p.sway + p.phase) * 0.022) * W;
      const y = p.y * H;
      const s = (15 + 27 * p.z) * dpr;
      const img = p.z < 0.55 ? SPRITES[p.ti].soft : SPRITES[p.ti].sharp;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.r + Math.sin(t + p.phase) * 0.35);
      ctx.globalAlpha = 0.24 + 0.5 * p.z;
      ctx.drawImage(img, -s / 2, -s / 2, s, s);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

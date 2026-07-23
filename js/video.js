/* ═══ Ленивые YouTube-embed: iframe создаётся по клику ═══ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("is-playing")) return;
      const id = card.dataset.vid;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      frame.title = card.querySelector(".video-title span")?.textContent || "Видео";
      const img = card.querySelector("img");
      const btn = card.querySelector(".play-btn");
      if (img) img.replaceWith(frame); else card.prepend(frame);
      if (btn) btn.remove();
      card.classList.add("is-playing");
    });
  });
});

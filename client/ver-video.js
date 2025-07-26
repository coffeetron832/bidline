// client/ver-video.js

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("id");

  if (!videoId) {
    alert("Video no especificado.");
    return window.location.href = "perfil.html";
  }

  try {
    const res = await fetch(`/api/videos/${videoId}`);
    if (!res.ok) throw new Error("No encontrado");

    const video = await res.json();

    document.getElementById("titulo").textContent = video.title;
    document.getElementById("descripcion").textContent =
      `${video.description} \n\n Subido por: ${video.uploader?.username || 'Desconocido'}`;

    const reproductor = document.getElementById("reproductor");
    reproductor.src = video.cloudinary_url;

    // Controles
    const playPauseBtn = document.getElementById("playPause");
    const muteBtn = document.getElementById("mute");
    const fullscreenBtn = document.getElementById("fullscreen");
    const progress = document.getElementById("progress");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");

    // Iconos
    const playIcon = playPauseBtn.querySelector("i");
    const muteIcon = muteBtn.querySelector("i");

    // Reproducción
    playPauseBtn.addEventListener("click", () => {
      if (reproductor.paused) {
        reproductor.play();
        playIcon.setAttribute("data-lucide", "pause");
      } else {
        reproductor.pause();
        playIcon.setAttribute("data-lucide", "play");
      }
      lucide.createIcons();
    });

    // Silencio
    muteBtn.addEventListener("click", () => {
      reproductor.muted = !reproductor.muted;
      muteIcon.setAttribute("data-lucide", reproductor.muted ? "volume-x" : "volume-2");
      lucide.createIcons();
    });

    // Pantalla completa
    fullscreenBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        reproductor.requestFullscreen();
      }
    });

    // Actualizar duración total
    reproductor.addEventListener("loadedmetadata", () => {
      progress.max = reproductor.duration;
      durationDisplay.textContent = formatTime(reproductor.duration);
    });

    // Actualizar barra de progreso y tiempo actual
    reproductor.addEventListener("timeupdate", () => {
      progress.value = reproductor.currentTime;
      currentTimeDisplay.textContent = formatTime(reproductor.currentTime);
    });

    // Saltar en el video
    progress.addEventListener("input", () => {
      reproductor.currentTime = progress.value;
    });

  } catch (err) {
    console.error("Error al cargar el video:", err);
    alert("No se pudo cargar el video.");
    window.location.href = "perfil.html";
  }
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

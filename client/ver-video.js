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

    // Mostrar botón "Volver al perfil" si el video pertenece al usuario autenticado
    const token = localStorage.getItem("token");
    let userId = null;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload._id;
      } catch (e) {
        console.warn("Token inválido");
      }
    }

    if (userId && video.uploader && video.uploader._id === userId) {
      document.getElementById("volver-perfil").style.display = "inline-block";
    }

    // Controles
    const playPauseBtn = document.getElementById("playPause");
    const muteBtn = document.getElementById("mute");
    const fullscreenBtn = document.getElementById("fullscreen");
    const progress = document.getElementById("progress");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");

    // Reproducción
    playPauseBtn.addEventListener("click", () => {
      if (reproductor.paused) {
        reproductor.play();
        playPauseBtn.innerHTML = `<i data-lucide="pause"></i>`;
      } else {
        reproductor.pause();
        playPauseBtn.innerHTML = `<i data-lucide="play"></i>`;
      }
      lucide.createIcons();
    });

    // Silencio
    muteBtn.addEventListener("click", () => {
      reproductor.muted = !reproductor.muted;
      muteBtn.innerHTML = `<i data-lucide="${reproductor.muted ? 'volume-x' : 'volume-2'}"></i>`;
      lucide.createIcons();
    });

    // Pantalla completa
    fullscreenBtn.addEventListener("click", () => {
      const videoWrapper = document.querySelector(".video-wrapper");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoWrapper.requestFullscreen();
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

  let timeout;
  const wrapper = document.querySelector(".video-wrapper");

  wrapper.addEventListener("mousemove", () => {
    wrapper.classList.remove("hide-controls");
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      wrapper.classList.add("hide-controls");
    }, 3000);
  });
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

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

    const container = document.querySelector(".video-container");

    container.innerHTML += `
      <div class="video-wrapper">
        <video id="custom-video" preload="metadata">
          <source src="${video.cloudinary_url}" type="video/mp4">
          Tu navegador no soporta el video.
        </video>

        <div class="controls">
          <button id="play-pause" aria-label="Play">
            <i data-lucide="play"></i>
          </button>

          <span id="currentTime">0:00</span>

          <input type="range" id="seek" value="0" min="0" max="100" step="1" />

          <span id="duration">0:00</span>
        </div>
      </div>
    `;

    lucide.createIcons();

    const videoEl = document.getElementById("custom-video");
    const playPauseBtn = document.getElementById("play-pause");
    const seek = document.getElementById("seek");
    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");

    const formatTime = (t) => {
      const minutes = Math.floor(t / 60);
      const seconds = Math.floor(t % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    videoEl.addEventListener("loadedmetadata", () => {
      seek.max = Math.floor(videoEl.duration);
      durationEl.textContent = formatTime(videoEl.duration);
    });

    videoEl.addEventListener("timeupdate", () => {
      seek.value = Math.floor(videoEl.currentTime);
      currentTimeEl.textContent = formatTime(videoEl.currentTime);
    });

    seek.addEventListener("input", () => {
      videoEl.currentTime = seek.value;
    });

    playPauseBtn.addEventListener("click", () => {
      if (videoEl.paused) {
        videoEl.play();
        playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
      } else {
        videoEl.pause();
        playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
      }
      lucide.createIcons();
    });
  } catch (err) {
    console.error("Error al cargar el video:", err);
    alert("No se pudo cargar el video.");
    window.location.href = "perfil.html";
  }
});


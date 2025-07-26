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
    document.getElementById("descripcion").textContent = video.description;
    
    const reproductor = document.getElementById("reproductor");
    reproductor.src = video.cloudinary_url;
  } catch (err) {
    console.error("Error al cargar el video:", err);
    alert("No se pudo cargar el video.");
    window.location.href = "perfil.html";
  }
});

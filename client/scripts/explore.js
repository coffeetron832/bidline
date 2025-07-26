// client/scripts/explore.js
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.video-grid');  // <-- aquí

  try {
    const res = await fetch('/api/videos/explore');
    const videos = await res.json();

    if (!Array.isArray(videos)) throw new Error('Respuesta no válida');

    grid.innerHTML = '';  // limpia el contenido de ejemplo

    if (videos.length === 0) {
      grid.innerHTML = '<p>No hay videos aprobados todavía.</p>';
      return;
    }

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      card.innerHTML = `
        <a href="ver-video.html?id=${video._id}">
          <video src="${video.cloudinary_url}" muted></video>
        </a>
        <h2>${video.title}</h2>
        <p>${video.description || ''}</p>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<p>No se pudieron cargar los videos.</p>';
    console.error(err);
  }
});

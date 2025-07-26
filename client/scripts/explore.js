document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.video-grid');


  try {
    const res = await fetch('/api/videos/explore');
    const videos = await res.json();

    if (!Array.isArray(videos)) throw new Error('Respuesta no válida');

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      card.innerHTML = `
        <video src="${video.cloudinary_url}" controls></video>
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

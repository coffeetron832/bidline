// client/perfil.js

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("https://bidline-production.up.railway.app/api/user/perfil", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    if (!res.ok) throw new Error("No autorizado");

    const data = await res.json();
    const { user, videos, notifications } = data;

    // Info usuario
    document.getElementById("nombreUsuario").textContent = user.username;
    document.getElementById("emailUsuario").textContent = user.email || "Sin email";
    document.getElementById("fechaRegistro").textContent = new Date(user.createdAt).toLocaleDateString();

    // Mis videos
    const listaVideos = document.getElementById("listaVideos");
    if (videos.length === 0) {
      listaVideos.innerHTML = "<p>No has subido videos todavía.</p>";
    } else {
      videos.forEach(video => {
        const div = document.createElement("div");
        div.classList.add("video-card");

        div.innerHTML = `
          <p><strong>${video.title}</strong></p>
          <p>Subido: ${new Date(video.uploadedAt).toLocaleDateString()}</p>
          <span class="estado ${video.status}">${video.status}</span>
          <br/>
          <a href="/videos/${video.filename}" target="_blank">Ver video</a>
        `;

        listaVideos.appendChild(div);
      });
    }

    // Notificaciones
    const listaNotificaciones = document.getElementById("listaNotificaciones");
    if (notifications.length === 0) {
      listaNotificaciones.innerHTML = "<li>No tienes notificaciones.</li>";
    } else {
      notifications.forEach(n => {
        const li = document.createElement("li");
        li.classList.toggle("unread", !n.read);
        li.innerHTML = `
          <span>${n.message}</span>
          <small>${new Date(n.createdAt).toLocaleDateString()}</small>
        `;
        listaNotificaciones.appendChild(li);
      });
    }

  } catch (err) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "/login.html";
  }
});

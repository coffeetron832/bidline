// client/perfil.js

document.addEventListener("DOMContentLoaded", async () => {
  // 1) Leer token
  const token = localStorage.getItem("token");

  // 2) Si no hay token, redirigir al login (index.html)
  if (!token) {
    alert("Debes iniciar sesión para ver tu perfil.");
    return window.location.href = "index.html";
  }

  try {
    // 3) Petición con ruta relativa
    const res = await fetch("/api/user/perfil", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("No autorizado");

    // 4) Procesar respuesta
    const { user, videos, notifications } = await res.json();

    // Info usuario
    document.getElementById("nombreUsuario").textContent = user.username;
    document.getElementById("fechaRegistro").textContent =
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Desconocido";

    // Mis videos
    const listaVideos = document.getElementById("listaVideos");
    if (videos.length === 0) {
      listaVideos.innerHTML = "<p>No has subido videos todavía.</p>";
    } else {
      listaVideos.innerHTML = ""; // limpiar
      videos.forEach(video => {
        const div = document.createElement("div");
        div.classList.add("video-card");
        div.innerHTML = `
          <p><strong>${video.title}</strong></p>
          <p>Subido: ${new Date(video.uploadedAt).toLocaleDateString()}</p>
          <span class="estado ${video.status}">${video.status}</span>
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
      listaNotificaciones.innerHTML = ""; // limpiar
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
    console.error("Perfil error:", err);
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "index.html";
  }

  // 🚪 Funcionalidad del botón Cerrar sesión con confirmación
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmar = confirm("¿Seguro que deseas cerrar sesión?");
      if (confirmar) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    });
  }
});

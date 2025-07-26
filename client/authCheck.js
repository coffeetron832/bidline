// client/authCheck.js

(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  try {
    const res = await fetch("https://bidline-production.up.railway.app/api/user/perfil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Token inválido o expirado");

    const data = await res.json();
    window.currentUser = data.user;

  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  }
})();

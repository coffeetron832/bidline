document.addEventListener("DOMContentLoaded", () => {
  const authActions = document.getElementById("auth-actions");
  const userActions = document.getElementById("user-actions");
  const authForms = document.getElementById("auth-forms");

  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  const token = localStorage.getItem("token");

  if (token) {
    authActions.style.display = "none";
    userActions.style.display = "flex";
  } else {
    authActions.style.display = "flex";
    userActions.style.display = "none";
  }

  let currentForm = null;

  showLoginBtn.addEventListener("click", () => {
    if (currentForm === "login") {
      authForms.style.display = "none";
      currentForm = null;
    } else {
      authForms.style.display = "flex";
      loginForm.style.display = "flex";
      registerForm.style.display = "none";
      currentForm = "login";
    }
  });

  showRegisterBtn.addEventListener("click", () => {
    if (currentForm === "register") {
      authForms.style.display = "none";
      currentForm = null;
    } else {
      authForms.style.display = "flex";
      loginForm.style.display = "none";
      registerForm.style.display = "flex";
      currentForm = "register";
    }
  });

  function showToast(message, isError = false) {
  Toastify({
    text: message,
    duration: 10000, // 10 segundos
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    offset: {
      x: 10,
      y: 10, // Más arriba
    },
    style: {
      background: isError ? "#e53935" : "#4caf50",
      fontSize: "0.9rem",
      padding: "12px 16px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    }
  }).showToast();
}


  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    if (!username || !password) return showToast("Completa ambos campos", true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar");

      showToast("Registro exitoso. Ahora inicia sesión.");
      registerForm.reset();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!username || !password) return showToast("Completa ambos campos", true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      localStorage.setItem("token", data.token);
      showToast("Inicio de sesión exitoso");

      setTimeout(() => {
        window.location.reload();
      }, 2000); // Espera 2 segundos antes de recargar
    } catch (err) {
      showToast(err.message, true);
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    showToast("Sesión cerrada");

    setTimeout(() => {
      window.location.reload();
    }, 2000); // Espera 2 segundos antes de recargar
  });
});

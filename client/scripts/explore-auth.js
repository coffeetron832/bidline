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

  showLoginBtn.addEventListener("click", () => {
    authForms.style.display = "block";
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  });

  showRegisterBtn.addEventListener("click", () => {
    authForms.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
  });

  function showToast(message, isError = false) {
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: isError ? "#e53935" : "#4caf50"
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
      window.location.reload();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    showToast("Sesión cerrada");
    window.location.reload();
  });


const loginBtn = document.getElementById("show-login");
  const registerBtn = document.getElementById("show-register");
  const authForms = document.getElementById("auth-forms");

  // Alternar visibilidad del formulario
  function toggleForms() {
    if (authForms.style.display === "none" || !authForms.style.display) {
      authForms.style.display = "flex";
    } else {
      authForms.style.display = "none";
    }
  }

  loginBtn.addEventListener("click", toggleForms);
  registerBtn.addEventListener("click", toggleForms);
  
});

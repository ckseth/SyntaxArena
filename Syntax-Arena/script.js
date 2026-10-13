window.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const modeLabel = document.getElementById("modeLabel");
  const form = document.getElementById("registrationForm");

  const usernameInput = document.getElementById("username");
  const unameInput = document.getElementById("uname");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const pnoInput = document.getElementById("pno");
  const emailInput = document.getElementById("email");
  const submitBtn = document.getElementById("submitBtn");

  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-theme");
    modeLabel.textContent = this.checked ? "Dark Mode" : "Light Mode";
  });

  form.addEventListener("submit", (e) => {
    if (usernameInput.value.trim() === "") {
      e.preventDefault();
      alert("Enter full name");
      return;
    }

    if (!unameInput.value.includes("@")) {
      e.preventDefault();
      alert("Username must contain @");
      return;
    }

    if (pnoInput.value.length !== 10) {
      e.preventDefault();
      alert("Phone number must be 10 digits");
      return;
    }

    const p1 = passwordInput.value;
    const p2 = confirmPasswordInput.value;

    if (
      p1.length < 6 ||
      !/^[A-Za-z]/.test(p1) ||
      !/[0-9]/.test(p1) ||
      !/[!@#$%^&*]/.test(p1)
    ) {
      e.preventDefault();
      alert("Password not strong enough");
      return;
    }

    if (p1 !== p2) {
      e.preventDefault();
      alert("Passwords do not match");
      return;
    }

    alert("Registration Successful!");
  });

  usernameInput.addEventListener("keydown", (e) => {
    if (/[0-9]/.test(e.key)) e.preventDefault();
  });

  submitBtn.addEventListener(
    "mouseover",
    () => (submitBtn.style.opacity = "0.8"),
  );
  submitBtn.addEventListener("mouseout", () => (submitBtn.style.opacity = "1"));
});

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;         // <html>
  const toggle = document.querySelector("theme-toggle");
  if (!toggle) return;

  // Show the toggle (it was hidden by .no-js)
  toggle.classList.remove("no-js");

  const lightBtn = toggle.querySelector('[data-theme-btn="light"]');
  const darkBtn  = toggle.querySelector('[data-theme-btn="dark"]');

  // 1. Helper to apply + remember theme
  function setTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;

    root.setAttribute("data-theme", theme);
    localStorage.setItem("site-theme", theme);

    // Optional: highlight active button
    if (lightBtn && darkBtn) {
      if (theme === "light") {
        lightBtn.classList.add("active-theme");
        darkBtn.classList.remove("active-theme");
      } else {
        darkBtn.classList.add("active-theme");
        lightBtn.classList.remove("active-theme");
      }
    }
  }

  // 2. On page load: use saved theme or system preference
  const storedTheme = localStorage.getItem("site-theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  // 3. Wire the buttons
  if (lightBtn) {
    lightBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setTheme("light");
    });
  }

  if (darkBtn) {
    darkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setTheme("dark");
    });
  }
});

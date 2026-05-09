// Footer active button handling + screen switching

document.addEventListener("DOMContentLoaded", () => {
  const footerButtons = document.querySelectorAll("footer .footer-btns");
  const screens = document.querySelectorAll("main .screen[data-screen]");

  if (!footerButtons.length) return;

  const hideAllScreens = () => {
    screens.forEach((s) => {
      s.style.display = "none";
    });
  };

  const showScreen = (id) => {
    const el = document.querySelector(`main .screen[data-screen="${id}"]`);
    if (!el) return;
    el.style.display = "block";
  };

  const setActive = (activeBtn) => {
    footerButtons.forEach((btn) => btn.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  };

  const activate = (btn) => {
    setActive(btn);

    const target = btn.getAttribute("data-target");
    if (!target) return;

    hideAllScreens();
    showScreen(target);
  };

  footerButtons.forEach((btn) => {
    btn.addEventListener("click", () => activate(btn));
  });

  // Initialize to Home
  const homeBtn =
    document.querySelector('footer .footer-btns[data-target="home"]') ||
    footerButtons[0];
  activate(homeBtn);
});

// Footer active button handling + screen switching

document.addEventListener("DOMContentLoaded", () => {
  const footerButtons = document.querySelectorAll("footer .footer-btns");
  const screens = document.querySelectorAll("main .screen[data-screen]");

  if (!footerButtons.length || !screens.length) return;

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

  const activateFromButton = (btn) => {
    if (!btn) return;

    // data-target may be on the <button> or on its child <img>
    const target =
      btn.getAttribute("data-target") ||
      btn.querySelector("[data-target]")?.getAttribute("data-target");

    if (!target) return;

    setActive(btn);
    hideAllScreens();
    showScreen(target);
  };

  footerButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activateFromButton(btn);
    });
  });

  // Initialize to Home
  const homeBtn =
    document.querySelector('footer .footer-btns[data-target="home"]') ||
    document
      .querySelector('footer .footer-btns [data-target="home"]')
      ?.closest(".footer-btns") ||
    footerButtons[0];

  activateFromButton(homeBtn);
});

function myFunction() {
  document
    .getElementById("info-algemeen-myDropdown")
    .classList.toggle("show-algemeen");
}

function myFunction2() {
  document
    .getElementById("info-Bereikbaarheid-myDropdown")
    .classList.toggle("show-Bereikbaarheid");
}

// Close all dropdowns when one is opened (optional, but prevents multiple sections staying open)
function closeAllInfoDropdowns() {
  document
    .getElementById("info-algemeen-myDropdown")
    ?.classList.remove("show-algemeen");

  document
    .getElementById("info-Bereikbaarheid-myDropdown")
    ?.classList.remove("show-Bereikbaarheid");
}

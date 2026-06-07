function toggleInfoDropdown(id) {
  const openClass = "show-info-dropdown";

  const current = document.getElementById(id);
  if (!current) return;

  const isOpen = current.classList.contains(openClass);

  // close all
  document.querySelectorAll(".info-dropdown-content").forEach((el) => {
    el.classList.remove(openClass);
  });

  // toggle only requested one
  if (!isOpen) current.classList.add(openClass);
}

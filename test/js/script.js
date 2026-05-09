function updatePixelInfo() {
  const pixelX = document.getElementById("pixel-x");
  const pixelY = document.getElementById("pixel-y");

  if (pixelX && pixelY) {
    pixelX.textContent = "Width: " + window.innerWidth;
    pixelY.textContent = "Height: " + window.innerHeight;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updatePixelInfo();
  window.addEventListener("resize", updatePixelInfo);
});

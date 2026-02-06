import scene from "./scene.json";

export function loadDesert() {
  const container = document.getElementById("scene")!;
  const layers: HTMLImageElement[] = [];

  document.body.style.height = `${window.innerHeight * 4}px`;

  scene.layers.forEach((layer, index) => {
    const img = document.createElement("img");

    img.src = layer.image;
    img.dataset.speed = String(layer.speed);

    img.style.position = "fixed";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100vw";
    img.style.height = "100vh";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center bottom";
    img.style.pointerEvents = "none";
    img.style.willChange = "transform";

    img.style.zIndex = String(index);

    container.appendChild(img);
    layers.push(img);
  });

  const update = () => {
    const scrollY = window.scrollY;

    layers.forEach((img, index) => {
      if (index === 0) return;

      const speed = Number(img.dataset.speed);
      const start = Number(img.dataset.start || 0);

      const y = start + scrollY * speed;
      img.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };

  update();
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });

      ticking = true;
    }
  });
}

const stripSettings: Record<string, { speed: number; start: number }> = {
  atmosphere: { speed: 0.04, start: -10 },
  rear: { speed: 0.08, start: -15 },
  main: { speed: 0.14, start: -25 },
  front: { speed: 0.22, start: -40 },
};

export function loadSceneStrips(scene: any) {
  const container = document.getElementById("scene")!;
  const layers: HTMLImageElement[] = [];

  container.innerHTML = "";

  const background = document.createElement("img");

  background.src = scene.background;
  background.style.position = "fixed";
  background.style.top = "0";
  background.style.left = "0";
  background.style.width = "100vw";
  background.style.height = "100vh";
  background.style.objectFit = "cover";
  background.style.objectPosition = "center bottom";
  background.style.pointerEvents = "none";
  background.style.zIndex = "0";

  container.appendChild(background);

  document.body.style.height = `${window.innerHeight * (scene.scrollLength ?? 8)}px`;

  scene.strips.forEach((strip: any, index: number) => {
    const settings = stripSettings[strip.slot];

    const img = document.createElement("img");

    img.src = strip.image;
    img.dataset.speed = String(settings.speed);
    img.dataset.start = String(settings.start);

    img.style.position = "fixed";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100vw";
    img.style.height = "100vh";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center bottom";
    img.style.transformOrigin = "center bottom";
    img.style.pointerEvents = "none";
    img.style.willChange = "transform";
    img.style.zIndex = String(index + 1);

    container.appendChild(img);
    layers.push(img);
  });

  const update = () => {
    const scrollY = window.scrollY;

    layers.forEach((img) => {
      const speed = Number(img.dataset.speed);
      const start = Number(img.dataset.start);

      const y = start + scrollY * speed * 0.45;
      const baseScale = 1 + speed * 0.05;
      const scrollScale = scrollY * speed * 0.00022;
      const scale = baseScale + scrollScale;
      const fade = Math.max(0.6, 1 - scrollY * speed * 0.00015);

      img.style.opacity = String(fade);

      img.style.transform = `
        translate3d(0, ${y}px, 0)
        scale(${scale})
      `;
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

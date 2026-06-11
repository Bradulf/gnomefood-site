export type StripSlot = "atmosphere" | "rear" | "main" | "front";

export type TimelineStrip = {
  image: string;
  slot: StripSlot;
};

export type TimelineScene = {
  id: string;
  order: number;
  strips: TimelineStrip[];
};

export type WorldTimeline = {
  background: string;
  sceneScrollLength?: number;
  scenes: TimelineScene[];
};

const stripSettings: Record<StripSlot, { speed: number; start: number }> = {
  atmosphere: { speed: 0.04, start: -120 },
  rear: { speed: 0.08, start: -80 },
  main: { speed: 0.14, start: -10 },
  front: { speed: 0.22, start: 30 },
};

type RenderedStrip = {
  img: HTMLImageElement;
  sceneIndex: number;
  speed: number;
  start: number;
};

export function loadWorldTimeline(world: WorldTimeline) {
  const container = document.getElementById("scene")!;
  const renderedStrips: RenderedStrip[] = [];

  container.innerHTML = "";

  const sceneScrollLength = world.sceneScrollLength ?? 8;
  const sceneHeight = window.innerHeight * sceneScrollLength;

  document.body.style.height = `${sceneHeight * world.scenes.length}px`;

  const background = document.createElement("img");

  background.src = world.background;
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

  world.scenes
    .sort((a, b) => a.order - b.order)
    .forEach((timelineScene, sceneIndex) => {
      timelineScene.strips.forEach((strip, stripIndex) => {
        const settings = stripSettings[strip.slot];

        const img = document.createElement("img");

        img.src = strip.image;

        img.style.position = "fixed";
        img.style.top = "0";
        img.style.left = "0";
        img.style.width = "100vw";
        img.style.height = "100vh";
        img.style.objectFit = "cover";
        img.style.objectPosition = "center bottom";
        img.style.transformOrigin = "center bottom";
        img.style.pointerEvents = "none";
        img.style.willChange = "transform, opacity";

        // Scene 1 strips: 1-4, Scene 2 strips: 5-8, etc.
        img.style.zIndex = String(sceneIndex * 10 + stripIndex + 1);

        container.appendChild(img);

        renderedStrips.push({
          img,
          sceneIndex,
          speed: settings.speed,
          start: settings.start,
        });
      });
    });

  const update = () => {
    const scrollY = window.scrollY;

    renderedStrips.forEach(({ img, sceneIndex, speed, start }) => {
      const sceneStart = sceneIndex * sceneHeight;
      const localScroll = scrollY - sceneStart;

      const sceneProgress = Math.min(Math.max(localScroll / sceneHeight, 0), 1);

      const stripWindow = 0.25;

      const stripProgress = Math.min(
        Math.max(sceneProgress / stripWindow, 0),
        1,
      );

      const stripScroll = localScroll;

      const y = start + stripScroll * speed * 0.45;
      const scrollScale = stripScroll * speed * 0.00022;
      const baseScale = 1 + speed * 0.05;
      const scale = baseScale + scrollScale;

      const isBeforeScene = scrollY < sceneStart;
      const isAfterScene = scrollY > sceneStart + sceneHeight;

      let sceneOpacity = 1;

      if (isBeforeScene || isAfterScene) {
        sceneOpacity = 0;
      } else {
        const fadeWindow = 0.35;
        const fadeIn =
          sceneIndex === 0 ? 1 : Math.min(sceneProgress / fadeWindow, 1);
        const fadeOut = Math.min((1 - sceneProgress) / fadeWindow, 1);

        sceneOpacity = Math.min(fadeIn, fadeOut);
      }

      img.style.opacity = String(sceneOpacity);

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

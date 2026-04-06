export function loadScene(scene: any) {
    const container = document.getElementById("scene")!;
    const layers: HTMLImageElement[] = [];

    container.innerHTML = "";

    document.body.style.height = `${window.innerHeight * 8}px`;

    scene.layers.forEach((layer: any, index: number) => {
        const img = document.createElement("img");

        img.src = layer.image;
        img.dataset.speed = String(layer.speed);
        img.dataset.start = String(layer.start ?? 0);

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
        img.style.zIndex = String(index);

        container.appendChild(img);
        layers.push(img);
    });

    const update = () => {
        const scrollY = window.scrollY;

        layers.forEach((img, index) => {
            if (index === 0) return;

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

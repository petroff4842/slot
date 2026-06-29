import { Container, Graphics, ParticleContainer, Particle } from "pixi.js";

export class CBubblesBackgroundView extends Container {
  constructor(renderer, width, height) {
    super();

    this.renderer = renderer;
    this.areaWidth = width;
    this.areaHeight = height;
    this.bubbles = [];
    this.bubblesCount = 80;

    this.particleContainer = new ParticleContainer({
      dynamicProperties: {
        position: true,
        rotation: false,
        vertex: false,
        uvs: false,
        color: false,
      },
    });
    this.addChild(this.particleContainer);
  }

  init() {
    this.bubbleTexture = this.createBubbleTexture();

    for (let i = 0; i < this.bubblesCount; i++) {
      this.createBubble();
    }
  }

  createBubbleTexture() {
    const bubble = new Graphics();

    bubble
      .circle(32, 32, 26)
      .fill({ color: 0xffffff, alpha: 0.12 })
      .stroke({ width: 2, color: 0xffffff, alpha: 0.35 });

    bubble.circle(23, 22, 6).fill({ color: 0xffffff, alpha: 0.45 });

    return this.renderer.generateTexture({
      target: bubble,
      resolution: 2,
    });
  }

  createBubble() {
    const particle = new Particle(this.bubbleTexture);

    const scale = 0.25 + Math.random() * 0.9;

    particle.anchorX = 0.5;
    particle.anchorY = 0.5;
    particle.x = Math.random() * this.areaWidth;
    particle.y = Math.random() * this.areaHeight;
    particle.scaleX = scale;
    particle.scaleY = scale;
    particle.alpha = 0.2 + Math.random() * 0.45;

    this.particleContainer.addParticle(particle);

    this.bubbles.push({
      particle,
      speed: 15 + Math.random() * 45,
      drift: -12 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      baseX: particle.x,
    });
  }

  update(delta) {
    const dt = delta / 1000;

    for (const bubble of this.bubbles) {
      const particle = bubble.particle;

      particle.y -= bubble.speed * dt;
      bubble.phase += dt;

      particle.x = bubble.baseX + Math.sin(bubble.phase) * bubble.drift;

      if (particle.y < -40) {
        particle.y = this.areaHeight + 40;
        bubble.baseX = Math.random() * this.areaWidth;
        particle.x = bubble.baseX;
      }
    }
  }

  resize(width, height) {
    this.areaWidth = width;
    this.areaHeight = height;
  }
}

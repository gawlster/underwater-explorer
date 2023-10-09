class Seaweed {
  #seaweedColor = vec4(0, 1, 0, 1);

  rotationRandomnessScale;
  #randomRotations;
  #randomTranslations;

  length;
  amplitude;
  strandSize;
  #strandScale;

  swaySpeed;
  #swaySpeedScale;

  constructor({
    length,
    amplitude,
    strandSize,
    rotationRandomnessScale,
    swaySpeed,
  }) {
    this.length = length;
    this.amplitude = amplitude;
    this.strandSize = strandSize;
    this.#strandScale = this.strandSize * 0.25;

    this.rotationRandomnessScale = rotationRandomnessScale;

    this.#randomRotations = Array.from({ length }, () =>
      Math.floor(Math.random() * rotationRandomnessScale * 20),
    ).map((v, i) => (i % 2 === 0 ? -1 * v : v));

    this.#randomTranslations = Array.from({ length }, () =>
      Math.floor((Math.random() * rotationRandomnessScale) / 2),
    ).map((v, i) => (i % 2 === 0 ? -1 * v : v));

    this.swaySpeed = swaySpeed;
    this.#swaySpeedScale = swaySpeed / 1000;
  }

  draw(dt, timestamp) {
    gPush();
    gScale(this.#strandScale, this.#strandScale, this.#strandScale);
    setColor(this.#seaweedColor);
    for (let i = 0; i < this.length; i++) {
      gPush();
      this.#drawStrand(timestamp, i);
    }
    for (let i = 0; i < this.length; i++) {
      gPop();
      gPop();
    }
    gPop();
  }

  #drawStrand(timestamp, i) {
    gPush();
    gRotate(
      Math.cos(timestamp * this.#swaySpeedScale - i / 5) * this.amplitude +
      this.#randomRotations[i],
      0,
      0,
      1,
    );
    {
      gPush();
      gTranslate(this.#randomTranslations[i], 1, 0);
      gPush();
      gScale(0.5, 1, 0.5);
      drawSphere();
      gPop();
      gPop();
    }
    gTranslate(0, 2, 0);
  }
}

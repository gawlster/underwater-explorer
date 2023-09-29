class Seaweed {
  #seaweedColor = vec4(0, 1, 0, 1);

  #randomRotations;

  length;
  amplitude;
  strandSize;
  #strandScale;

  constructor(length, amplitude, strandSize) {
    this.length = length;
    this.amplitude = amplitude;
    this.strandSize = strandSize;
    this.#strandScale = this.strandSize * 0.15;

    this.#randomRotations = Array.from({ length }, () =>
      Math.floor(Math.random() * 20),
    ).map((v, i) => (i % 2 === 0 ? -1 * v : v));
    console.log(this.#randomRotations);
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
      Math.cos(timestamp * 0.001 - i / 5) * 2.5 + this.#randomRotations[i],
      0,
      0,
      1,
    );
    {
      gPush();
      gTranslate(0, 1, 0);
      gPush();
      gScale(0.5, 1, 0.5);
      drawSphere();
      gPop();
      gPop();
    }
    gTranslate(0, 2, 0);
  }
}

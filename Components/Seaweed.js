class Seaweed {
  #seaweedColor = vec4(0, 1, 0, 1);

  length;
  amplitude;
  strandSize;
  #strandScale;

  constructor(length, amplitude, strandSize) {
    this.length = length;
    this.amplitude = amplitude;
    this.strandSize = strandSize;
    this.#strandScale = this.strandSize * 0.15;
  }

  draw(dt, timestamp) {
    gPush();
    for (let i = 0; i < this.length; i++) {
      gPush();
      gTranslate(0, i * this.#strandScale * 4, 0);
      gTranslate(
        (Math.cos(timestamp * 0.001 - i / 10) * i * this.amplitude) / 5,
        0,
        0,
      );
      gTranslate(
        0,
        Math.abs(Math.sin(timestamp * 0.001 - i / 10) * i * this.amplitude) /
          30,
        0,
      );
      gRotate(
        -Math.cos(timestamp * 0.001 - i / 10) * i * this.amplitude * 2,
        0,
        0,
        1,
      );
      gScale(this.#strandScale, this.#strandScale, this.#strandScale);
      this.#drawStrand();
      gPop();
    }
    gPop();
  }

  #drawStrand() {
    gTranslate(0, 1, 0);
    gScale(1, 2, 1);
    setColor(this.#seaweedColor);
    drawSphere();
  }
}

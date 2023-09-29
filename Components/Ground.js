class Ground {
  #groundColor = vec4(0.1, 0.1, 0.1, 1.0);

  constructor() {}

  draw(dt, timestamp) {
    gPush();
    setColor(this.#groundColor);
    drawCube();
    gPop();
  }
}

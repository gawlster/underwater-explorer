class Rocks {
  numRocks;

  #rockColor = vec4(0.3, 0.3, 0.3, 1.0);

  constructor(numRocks) {
    this.numRocks = numRocks;
  }

  drawDefaultRockPair(dt, timestamp) {
    gPush();
    setColor(this.#rockColor);
    drawSphere();
    {
      gPush();
      gTranslate(-1.4, -0.5, 0);
      gScale(0.5, 0.5, 0.5);
      drawSphere();
      gPop();
    }
    gPop();
  }

  drawRandomRocks() {
    //todo
  }
}

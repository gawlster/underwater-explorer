class Diver {
  #bodyColor = vec4(1, 1, 1, 1);

  constructor() {}

  draw(dt, timestamp) {
    gPush();
    gRotate(340, 0, 1, 0);
    {
      gPush();
      {
        gPush();
        gScale(1, 1.2, 0.3);
        setColor(this.#bodyColor);
        drawCube();
        gPop();
      }
      {
        gPush();
        gTranslate(0.5, -1.5, 0);
        this.#drawLeg(timestamp, false);
        gPop();
      }
      {
        gPush();
        gTranslate(-0.5, -1.5, 0);
        this.#drawLeg(timestamp, true);
        gPop();
      }
      {
        gPush();
        gTranslate(0, 1.75, 0);
        gScale(0.5, 0.5, 0.5);
        this.#drawHead();
        gPop();
      }
      gPop();
    }
    gPop();
  }

  #drawHead() {
    setColor(this.#bodyColor);
    drawSphere();
  }

  #drawLeg(timestamp, isOffset) {
    gTranslate(0, 0.3, 0);
    gRotate(
      isOffset
        ? Math.cos(timestamp * 0.001) * 15 + 40
        : -Math.cos(timestamp * 0.001) * 15 + 40,
      1,
      0,
      0,
    );
    {
      gPush();
      gTranslate(0, -0.75, 0);
      {
        gPush();
        gScale(0.25, 0.7, 0.2);
        setColor(this.#bodyColor);
        drawCube();
        gPop();
      }
      {
        gPush();
        gTranslate(0, -0.4, 0);
        gRotate(
          isOffset
            ? Math.cos(timestamp * 0.001) * 10 + 20
            : -Math.cos(timestamp * 0.001) * 10 + 20,
          1,
          0,
          0,
        );
        {
          gPush();
          gTranslate(0, -1, 0);
          gScale(0.2, 0.7, 0.2);
          setColor(this.#bodyColor);
          drawCube();
          gPop();
        }
        {
          gPush();
          gTranslate(0, -1.5, 0.5);
          gScale(0.2, 0.2, 0.4);
          drawCube();
          gPop();
        }
        gPop();
      }
      gPop();
    }
  }
}
